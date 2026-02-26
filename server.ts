import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db';

const __dirname = import.meta.dirname;

async function initDb() {
    try {
        const fs = await import('fs/promises');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');

        // Robust MySQL -> SQLite conversion
        // Order matters: replace compound patterns first, then individual keywords
        const sqliteSchema = schema
            .replace(/\bINT\b\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
            .replace(/VARCHAR\(\d+\)/gi, 'TEXT')
            .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
            .replace(/\bJSON\b/gi, 'TEXT')
            .replace(/\bINT\b/gi, 'INTEGER')
            .replace(/TIMESTAMP\s+DEFAULT\s+CURRENT_TIMESTAMP/gi, "TEXT DEFAULT (datetime('now','localtime'))");

        // Force recreation of critical tables if they are malformed
        // For simplicity, we just execute the schema and let init logic handle seeding
        db.exec(sqliteSchema);

        const ensureColumn = (table: string, column: string, type: string) => {
            try {
                const cols = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
                const has = cols.some(c => c.name === column);
                if (!has) {
                    console.log(`Adding column ${column} to table ${table}...`);
                    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
                    console.log(`Column ${column} added successfully.`);
                }
            } catch (err: any) {
                console.warn(`Could not ensure column ${column} in ${table}: ${err.message}`);
                // Ignore: table may not exist yet or other transient errors during init
            }
        };

        // Lightweight migrations for existing database.db files
        ensureColumn('settings', 'admin_username', 'TEXT');
        ensureColumn('settings', 'admin_password', 'TEXT');

        // Seeding logic
        const userExists = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='users'").get() as any;
        if (userExists && userExists.count > 0) {
            const users = db.prepare('SELECT * FROM users').all();
            if (users.length === 0) {
                db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('Ravi', 'Ravi123');
                console.log('Default admin user created');
            }
        }

        const tablesToSeed = ['hero_section', 'about_section', 'projects_section', 'contact_section', 'footer_section', 'settings'];
        for (const table of tablesToSeed) {
            const exists = db.prepare(`SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='${table}'`).get() as any;
            if (exists && exists.count > 0) {
                const row = db.prepare(`SELECT * FROM ${table} LIMIT 1`).get();
                if (!row) {
                    try {
                        if (table === 'hero_section') {
                            db.prepare('INSERT INTO hero_section (id, title, subtitle) VALUES (1, ?, ?)').run("Hi, I'm Ravi Kalauni", "Studying Bachelors in Computer Application (BCA)");
                            db.prepare('INSERT INTO hero_buttons (hero_id, label, link, is_primary) VALUES (1, ?, ?, ?)').run("Contact me", "#", 1);
                            db.prepare('INSERT INTO hero_buttons (hero_id, label, link, is_primary) VALUES (1, ?, ?, ?)').run("View CV", "#", 0);
                        } else if (table === 'about_section') {
                            db.prepare('INSERT INTO about_section (id, title, image_url, text) VALUES (1, ?, ?, ?)').run("About Me", "", "I am a BCA student passionate about web development.");
                        } else if (table === 'projects_section') {
                            db.prepare('INSERT INTO projects_section (id, heading, description) VALUES (1, ?, ?)').run("My Projects", "A showcase of my recent work.");
                        } else if (table === 'contact_section') {
                            db.prepare('INSERT INTO contact_section (id, title, subtitle, description, email, phone, location, name_placeholder, email_placeholder) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)').run("Contact Me", "Get in touch", "I'm always open to new opportunities.", "ravi@example.com", "+1234567890", "Nepal", "Your Name", "Your Email");
                        } else if (table === 'footer_section') {
                            db.prepare('INSERT INTO footer_section (id, text) VALUES (1, ?)').run("© 2024 Ravi Kalauni. All rights reserved.");
                        } else if (table === 'settings') {
                            db.prepare('INSERT INTO settings (id, website_name, show_login_button, admin_username, admin_password) VALUES (1, ?, ?, ?, ?)')
                                .run("Ravi", 1, "Ravi", "Ravi123");
                        }
                        console.log(`Seeded matching data for ${table}`);
                    } catch (seedErr: any) {
                        console.warn(`Could not seed ${table}: ${seedErr.message}`);
                    }
                }
            }
        }

        // Backfill admin credentials for existing settings row if missing
        try {
            const settingsRow = db.prepare('SELECT * FROM settings WHERE id = 1').get() as any;
            if (settingsRow) {
                const adminU = settingsRow.admin_username ?? null;
                const adminP = settingsRow.admin_password ?? null;
                if (!adminU || !adminP) {
                    db.prepare('UPDATE settings SET admin_username = COALESCE(admin_username, ?), admin_password = COALESCE(admin_password, ?) WHERE id = 1')
                        .run('Ravi', 'Ravi123');
                }
            }
        } catch {
            // ignore
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', (error as any).message || error);
    }
}

async function startServer() {
    await initDb();

    const app = express();
    const requestedPort = Number.parseInt(process.env.PORT || '3000', 10);
    const requestedHmrPort = Number.parseInt(process.env.HMR_PORT || String(requestedPort + 1), 10);

    app.use(express.json());

    // API Endpoints
    app.get('/api/hero', (req, res) => {
        try {
            const hero = db.prepare('SELECT * FROM hero_section LIMIT 1').get() as any;
            if (!hero) return res.json(null);
            const buttons = db.prepare('SELECT * FROM hero_buttons WHERE hero_id = ?').all(hero.id) as any[];
            const socials = db.prepare('SELECT * FROM hero_socials WHERE hero_id = ?').all(hero.id) as any[];
            // Frontend/Admin expect { title, subtitle, buttons: {id,label,link,primary}[], socials: {id,platform,link}[] }
            res.json({
                title: hero.title,
                subtitle: hero.subtitle,
                buttons: buttons.map(b => ({
                    id: b.id,
                    label: b.label,
                    link: b.link,
                    primary: Boolean(b.is_primary)
                })),
                socials: socials.map(s => ({
                    id: s.id,
                    platform: s.platform,
                    link: s.link
                }))
            });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/about', (req, res) => {
        try {
            const about = db.prepare('SELECT * FROM about_section LIMIT 1').get() as any;
            if (!about) return res.json(null);
            const cards = db.prepare('SELECT * FROM about_cards WHERE about_id = ?').all(about.id) as any[];
            // Frontend expects { title, image, text, cards[] }, where image comes from image_url
            res.json({
                title: about.title,
                image: about.image_url,
                text: about.text,
                cards: cards.map(c => ({
                    id: c.id,
                    title: c.title,
                    items: JSON.parse(c.items)
                }))
            });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/skills', (req, res) => {
        try {
            const categories = db.prepare('SELECT * FROM skill_categories').all() as any[];
            const skillsData = categories.map((cat) => {
                const skills = db.prepare('SELECT * FROM skills WHERE category_id = ?').all(cat.id) as any[];
                // Frontend expects { id, title, skills: {name,percentage}[] }
                return {
                    id: String(cat.id),
                    title: cat.title,
                    skills: skills.map(s => ({
                        name: s.name,
                        percentage: s.percentage
                    }))
                };
            });
            res.json(skillsData);
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/projects', (req, res) => {
        try {
            const section = db.prepare('SELECT * FROM projects_section LIMIT 1').get() as any;
            const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as any[];
            // Frontend expects { heading, description, items: {id,title,type,thumbnail,link}[] }
            res.json({
                heading: section?.heading ?? '',
                description: section?.description ?? '',
                items: projects.map(p => ({
                    id: String(p.id),
                    title: p.title,
                    type: p.type,
                    thumbnail: p.thumbnail_url,
                    link: p.link
                }))
            });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/documents', (req, res) => {
        try {
            const docs = db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all() as any[];
            const docsWithComments = docs.map((doc) => {
                const comments = db.prepare('SELECT * FROM document_comments WHERE document_id = ?').all(doc.id) as any[];
                return {
                    id: String(doc.id),
                    title: doc.title,
                    subtitle: doc.subtitle,
                    content: doc.content,
                    likes: doc.likes,
                    shares: doc.shares,
                    date: doc.created_at,
                    comments: comments.map(c => ({
                        id: String(c.id),
                        user: c.user_name,
                        text: c.comment_text,
                        date: c.created_at
                    }))
                };
            });
            res.json(docsWithComments);
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/messages', (req, res) => {
        try {
            const msgs = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all() as any[];
            res.json(msgs.map(m => ({
                id: String(m.id),
                name: m.name,
                email: m.email,
                message: m.message,
                date: m.created_at,
                read: Boolean(m.is_read)
            })));
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/messages', (req, res) => {
        try {
            const { name, email, message } = req.body;
            db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(name, email, message);
            res.status(201).json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/settings', (req, res) => {
        try {
            const settings = db.prepare('SELECT * FROM settings LIMIT 1').get() as any;
            if (!settings) return res.json(null);
            // Frontend/Admin expect { websiteName, showLoginButton, adminUsername, adminPassword }
            res.json({
                websiteName: settings.website_name,
                showLoginButton: Boolean(settings.show_login_button),
                adminUsername: settings.admin_username ?? 'Ravi',
                adminPassword: settings.admin_password ?? 'Ravi123'
            });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/contact', (req, res) => {
        try {
            const contact = db.prepare('SELECT * FROM contact_section LIMIT 1').get() as any;
            if (!contact) return res.json(null);
            // Frontend/Admin expect camelCase keys
            res.json({
                title: contact.title,
                subtitle: contact.subtitle,
                description: contact.description,
                email: contact.email,
                phone: contact.phone,
                location: contact.location,
                namePlaceholder: contact.name_placeholder,
                emailPlaceholder: contact.email_placeholder
            });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/footer', (req, res) => {
        try {
            const footer = db.prepare('SELECT * FROM footer_section LIMIT 1').get();
            res.json(footer || null);
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    // Admin Update Endpoints
    app.post('/api/hero', (req, res) => {
        try {
            const { title, subtitle, buttons, socials } = req.body;
            db.prepare('UPDATE hero_section SET title = ?, subtitle = ? WHERE id = 1').run(title, subtitle);
            db.prepare('DELETE FROM hero_buttons WHERE hero_id = 1').run();
            for (const btn of buttons) {
                db.prepare('INSERT INTO hero_buttons (hero_id, label, link, is_primary) VALUES (1, ?, ?, ?)').run(btn.label, btn.link, btn.primary ? 1 : 0);
            }
            db.prepare('DELETE FROM hero_socials WHERE hero_id = 1').run();
            for (const soc of socials) {
                db.prepare('INSERT INTO hero_socials (hero_id, platform, link) VALUES (1, ?, ?)').run(soc.platform, soc.link);
            }
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/about', (req, res) => {
        try {
            const { title, image, text, cards } = req.body;
            db.prepare('UPDATE about_section SET title = ?, image_url = ?, text = ? WHERE id = 1').run(title, image, text);
            db.prepare('DELETE FROM about_cards WHERE about_id = 1').run();
            for (const card of cards) {
                db.prepare('INSERT INTO about_cards (about_id, title, items) VALUES (1, ?, ?)').run(card.title, JSON.stringify(card.items));
            }
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/skills', (req, res) => {
        try {
            const categories = req.body as any[];
            db.prepare('DELETE FROM skills').run();
            db.prepare('DELETE FROM skill_categories').run();
            for (const cat of categories) {
                const result = db.prepare('INSERT INTO skill_categories (title) VALUES (?)').run(cat.title);
                const catId = result.lastInsertRowid;
                for (const skill of cat.skills) {
                    db.prepare('INSERT INTO skills (category_id, name, percentage) VALUES (?, ?, ?)').run(catId, skill.name, skill.percentage);
                }
            }
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/projects', (req, res) => {
        try {
            const { heading, description, items } = req.body;
            db.prepare('UPDATE projects_section SET heading = ?, description = ? WHERE id = 1').run(heading, description);
            db.prepare('DELETE FROM projects').run();
            for (const item of items) {
                db.prepare('INSERT INTO projects (title, type, thumbnail_url, link) VALUES (?, ?, ?, ?)').run(item.title, item.type, item.thumbnail, item.link);
            }
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/settings', (req, res) => {
        try {
            const { websiteName, showLoginButton, adminUsername, adminPassword } = req.body;
            const exists = db.prepare("SELECT COUNT(*) as count FROM settings WHERE id = 1").get() as any;
            try {
                // Newer schema (with admin credentials)
                if (exists && exists.count > 0) {
                    db.prepare('UPDATE settings SET website_name = ?, show_login_button = ?, admin_username = ?, admin_password = ? WHERE id = 1')
                        .run(websiteName, showLoginButton ? 1 : 0, adminUsername, adminPassword);
                } else {
                    db.prepare('INSERT INTO settings (id, website_name, show_login_button, admin_username, admin_password) VALUES (1, ?, ?, ?, ?)')
                        .run(websiteName, showLoginButton ? 1 : 0, adminUsername, adminPassword);
                }
            } catch (inner: any) {
                // Backwards-compatible fallback for existing DBs without admin_* columns
                if (String(inner?.message || '').toLowerCase().includes('no such column: admin_')) {
                    if (exists && exists.count > 0) {
                        db.prepare('UPDATE settings SET website_name = ?, show_login_button = ? WHERE id = 1')
                            .run(websiteName, showLoginButton ? 1 : 0);
                    } else {
                        db.prepare('INSERT INTO settings (id, website_name, show_login_button) VALUES (1, ?, ?)')
                            .run(websiteName, showLoginButton ? 1 : 0);
                    }
                } else {
                    throw inner;
                }
            }
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/contact', (req, res) => {
        try {
            const { title, subtitle, description, email, phone, location, namePlaceholder, emailPlaceholder } = req.body;
            db.prepare('UPDATE contact_section SET title = ?, subtitle = ?, description = ?, email = ?, phone = ?, location = ?, name_placeholder = ?, email_placeholder = ? WHERE id = 1')
                .run(title, subtitle, description, email, phone, location, namePlaceholder, emailPlaceholder);
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/footer', (req, res) => {
        try {
            const { text } = req.body;
            db.prepare('UPDATE footer_section SET text = ? WHERE id = 1').run(text);
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.patch('/api/messages/mark-read', (req, res) => {
        try {
            db.prepare('UPDATE messages SET is_read = 1 WHERE is_read = 0').run();
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.delete('/api/messages/:id', (req, res) => {
        try {
            const id = req.params.id;
            db.prepare('DELETE FROM messages WHERE id = ?').run(id);
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/documents', (req, res) => {
        try {
            const { title, subtitle, content } = req.body;
            const result = db.prepare('INSERT INTO documents (title, subtitle, content) VALUES (?, ?, ?)')
                .run(title, subtitle, content);
            res.json({ success: true, id: result.lastInsertRowid });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.put('/api/documents/:id', (req, res) => {
        try {
            const id = req.params.id;
            const { title, subtitle, content } = req.body;
            db.prepare('UPDATE documents SET title = ?, subtitle = ?, content = ? WHERE id = ?')
                .run(title, subtitle, content, id);
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.delete('/api/documents/:id', (req, res) => {
        try {
            const id = req.params.id;
            db.prepare('DELETE FROM document_comments WHERE document_id = ?').run(id);
            db.prepare('DELETE FROM documents WHERE id = ?').run(id);
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    app.post('/api/documents/:id/comments', (req, res) => {
        try {
            const id = req.params.id;
            const { user, text } = req.body;
            db.prepare('INSERT INTO document_comments (document_id, user_name, comment_text) VALUES (?, ?, ?)')
                .run(id, user || 'Guest', text);
            res.json({ success: true });
        } catch (e: any) { res.status(500).json({ error: e.message }); }
    });

    // Vite Integration
    if (process.env.NODE_ENV !== 'production') {
        const { default: react } = await import('@vitejs/plugin-react');
        const { default: tailwindcss } = await import('@tailwindcss/vite');

        const vite = await createViteServer({
            configFile: false,
            plugins: [react(), tailwindcss()],
            server: {
                middlewareMode: true,
                hmr: process.env.DISABLE_HMR === 'true' ? false : { port: requestedHmrPort },
            },
            appType: 'custom',
            root: process.cwd(),
        });

        app.use(vite.middlewares);
        app.use('*', async (req, res) => {
            try {
                const url = req.originalUrl;
                const { readFileSync } = await import('fs');
                const indexPath = path.join(process.cwd(), 'index.html');
                const rawHtml = readFileSync(indexPath, 'utf-8');
                const template = await vite.transformIndexHtml(url, rawHtml);
                res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
            } catch (e: any) {
                vite.ssrFixStacktrace(e);
                res.status(500).end(e.message);
            }
        });

    } else {
        app.use(express.static(path.resolve(__dirname, 'dist')));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
        });
    }

    const listen = (port: number) =>
        new Promise<number>((resolve, reject) => {
            const server = app.listen(port, () => {
                const address = server.address();
                const actualPort =
                    typeof address === 'object' && address && 'port' in address ? (address as any).port : port;
                resolve(actualPort);
            });
            server.on('error', reject);
        });

    let actualPort: number | null = null;
    for (let port = requestedPort; port < requestedPort + 20; port++) {
        try {
            actualPort = await listen(port);
            break;
        } catch (err: any) {
            if (err?.code !== 'EADDRINUSE') throw err;
        }
    }
    if (actualPort === null) {
        actualPort = await listen(0);
    }

    console.log(`Server running at http://localhost:${actualPort}`);
}

startServer();
