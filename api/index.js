import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Favicon handler to silence 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ==================== DEBUG ROUTE ====================
app.get('/api/debug', async (req, res) => {
    try {
        const results = {};

        // 1. Check Env
        results.env = {
            hasUrl: !!process.env.SUPABASE_URL,
            hasKey: !!process.env.SUPABASE_KEY,
            urlPrefix: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 10) + '...' : 'NONE'
        };

        // 2. Test Connection
        const { data, error } = await supabase.from('hero_section').select('count', { count: 'exact', head: true });
        results.connection = error ? { status: 'ERROR', error } : { status: 'OK', count: data };

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== HERO SECTION ROUTES ====================
app.get('/api/hero', async (req, res) => {
    try {
        const { data: hero, error: heroError } = await supabase
            .from('hero_section')
            .select('*')
            .eq('id', 1)
            .single();

        if (heroError && heroError.code !== 'PGRST116') throw heroError;

        const { data: buttons, error: buttonsError } = await supabase
            .from('hero_buttons')
            .select('*')
            .eq('hero_id', 1);

        if (buttonsError) throw buttonsError;

        const { data: socials, error: socialsError } = await supabase
            .from('hero_socials')
            .select('*')
            .eq('hero_id', 1);

        if (socialsError) throw socialsError;

        res.json({
            ...hero,
            buttons: (buttons || []).map(b => ({
                id: b.id,
                label: b.label,
                link: b.link,
                primary: !!b.is_primary
            })),
            socials: socials || []
        });
    } catch (error) {
        console.error('Error fetching hero:', error);
        res.status(500).json({
            error: error.message,
            details: error.details,
            hint: error.hint
        });
    }
});

app.post('/api/hero', async (req, res) => {
    try {
        console.log('Update Hero Request:', JSON.stringify(req.body));
        const { title, subtitle, buttons, socials } = req.body;

        const { error: heroError } = await supabase
            .from('hero_section')
            .upsert({ id: 1, title, subtitle });

        if (heroError) {
            console.error('Hero section upsert error:', heroError);
            throw heroError;
        }

        const { error: delButtonsError } = await supabase.from('hero_buttons').delete().eq('hero_id', 1);
        if (delButtonsError) {
            console.error('Delete hero buttons error:', delButtonsError);
            throw delButtonsError;
        }

        const { error: delSocialsError } = await supabase.from('hero_socials').delete().eq('hero_id', 1);
        if (delSocialsError) {
            console.error('Delete hero socials error:', delSocialsError);
            throw delSocialsError;
        }

        if (buttons && Array.isArray(buttons) && buttons.length) {
            const { error: buttonsError } = await supabase
                .from('hero_buttons')
                .insert(buttons.map(b => ({
                    hero_id: 1,
                    label: b.label || '',
                    link: b.link || '',
                    is_primary: !!(b.primary || b.is_primary)
                })));

            if (buttonsError) {
                console.error('Insert hero buttons error:', buttonsError);
                throw buttonsError;
            }
        }

        if (socials && Array.isArray(socials) && socials.length) {
            const { error: socialsError } = await supabase
                .from('hero_socials')
                .insert(socials.map(s => ({
                    hero_id: 1,
                    platform: s.platform || '',
                    link: s.link || ''
                })));

            if (socialsError) {
                console.error('Insert hero socials error:', socialsError);
                throw socialsError;
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Final Error updating hero:', error);
        res.status(500).json({ error: error.message || 'Unknown error occurred' });
    }
});

// ==================== ABOUT SECTION ROUTES ====================
app.get('/api/about', async (req, res) => {
    try {
        const { data: about, error: aboutError } = await supabase
            .from('about_section')
            .select('*')
            .eq('id', 1)
            .single();

        if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;

        const { data: cards, error: cardsError } = await supabase
            .from('about_cards')
            .select('*')
            .eq('about_id', 1);

        res.json({
            ...about,
            cards: cards || []
        });
    } catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/about', async (req, res) => {
    try {
        const { title, image_url, text, cards } = req.body;

        const { error: aboutError } = await supabase
            .from('about_section')
            .upsert({ id: 1, title, image_url, text });

        if (aboutError) throw aboutError;

        await supabase.from('about_cards').delete().eq('about_id', 1);

        if (cards && cards.length) {
            const { error: cardsError } = await supabase
                .from('about_cards')
                .insert(cards.map(c => ({
                    about_id: 1,
                    title: c.title,
                    items: c.items // c.items is already an array of strings from frontend
                })));

            if (cardsError) throw cardsError;
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating about:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== SKILLS ROUTES ====================
app.get('/api/skills', async (req, res) => {
    try {
        const { data: categories, error: catError } = await supabase
            .from('skill_categories')
            .select('*');

        if (catError) throw catError;

        const skillsWithCategories = await Promise.all(
            categories.map(async (category) => {
                const { data: skills, error: skillError } = await supabase
                    .from('skills')
                    .select('*')
                    .eq('category_id', category.id);

                if (skillError) throw skillError;
                return { ...category, skills: skills || [] };
            })
        );

        res.json(skillsWithCategories);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/skills', async (req, res) => {
    try {
        const categories = req.body;

        await supabase.from('skills').delete().neq('id', 0);
        await supabase.from('skill_categories').delete().neq('id', 0);

        for (const category of categories) {
            const { data: newCategory, error: catError } = await supabase
                .from('skill_categories')
                .insert({ title: category.title })
                .select()
                .single();

            if (catError) throw catError;

            if (category.skills && category.skills.length) {
                const { error: skillError } = await supabase
                    .from('skills')
                    .insert(category.skills.map(s => ({
                        name: s.name,
                        percentage: parseInt(s.percentage) || 0,
                        category_id: newCategory.id
                    })));

                if (skillError) throw skillError;
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating skills:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROJECTS ROUTES ====================
app.get('/api/projects', async (req, res) => {
    try {
        const { data: section, error: sectionError } = await supabase
            .from('projects_section')
            .select('*')
            .eq('id', 1)
            .single();

        if (sectionError && sectionError.code !== 'PGRST116') throw sectionError;

        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        res.json({
            ...section,
            items: (projects || []).map(p => ({
                id: String(p.id),
                title: p.title,
                type: p.type,
                thumbnail: p.thumbnail_url,
                link: p.link
            }))
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { heading, description, items } = req.body;

        const { error: sectionError } = await supabase
            .from('projects_section')
            .upsert({ id: 1, heading, description });

        if (sectionError) throw sectionError;

        await supabase.from('projects').delete().neq('id', 0);

        if (items && items.length) {
            const { error: projectsError } = await supabase
                .from('projects')
                .insert(items.map(item => ({
                    title: item.title,
                    type: item.type,
                    thumbnail_url: item.thumbnail_url || item.thumbnail,
                    link: item.link
                })));

            if (projectsError) throw projectsError;
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating projects:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== CONTACT ROUTES ====================
app.get('/api/contact', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('contact_section')
            .select('*')
            .eq('id', 1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        res.json(data || {});
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { error } = await supabase
            .from('contact_section')
            .upsert({ id: 1, ...req.body });

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== FOOTER ROUTES ====================
app.get('/api/footer', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('footer_section')
            .select('*')
            .eq('id', 1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        res.json(data || {});
    } catch (error) {
        console.error('Error fetching footer:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/footer', async (req, res) => {
    try {
        const { error } = await supabase
            .from('footer_section')
            .upsert({ id: 1, ...req.body });

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating footer:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== SETTINGS ROUTES ====================
app.get('/api/settings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!data) {
            return res.json({
                websiteName: 'Portfolio',
                showLoginButton: true,
                adminUsername: 'admin',
                adminPassword: 'password'
            });
        }

        res.json({
            websiteName: data.website_name,
            showLoginButton: !!data.show_login_button,
            adminUsername: data.admin_username,
            adminPassword: data.admin_password
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        // Fallback instead of sending 500 error so the UI can load
        res.json({
            websiteName: 'Portfolio',
            showLoginButton: true,
            adminUsername: 'admin',
            adminPassword: 'password'
        });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const s = req.body;
        const { error } = await supabase
            .from('settings')
            .upsert({
                id: 1,
                website_name: s.websiteName,
                show_login_button: !!s.showLoginButton,
                admin_username: s.adminUsername,
                admin_password: s.adminPassword
            });

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            error: error.message,
            details: error.details,
            hint: error.hint
        });
    }
});

// ==================== DOCUMENTS ROUTES ====================
app.get('/api/documents', async (req, res) => {
    try {
        const { data: documents, error: docsError } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (docsError) throw docsError;

        const docsWithComments = await Promise.all(
            (documents || []).map(async (doc) => {
                try {
                    const { data: comments } = await supabase
                        .from('document_comments')
                        .select('*')
                        .eq('document_id', doc.id)
                        .order('created_at', { ascending: true });
                    return {
                        id: String(doc.id),
                        title: doc.title,
                        subtitle: doc.subtitle,
                        content: doc.content,
                        likes: doc.likes,
                        shares: doc.shares,
                        date: doc.created_at,
                        comments: (comments || []).map(c => ({
                            id: String(c.id),
                            user: c.user_name,
                            text: c.comment_text,
                            date: c.created_at
                        }))
                    };
                } catch (e) {
                    return {
                        ...doc,
                        id: String(doc.id),
                        date: doc.created_at,
                        comments: []
                    };
                }
            })
        );

        res.json(docsWithComments);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.json([]);
    }
});

app.post('/api/documents', async (req, res) => {
    try {
        const { title, subtitle, content } = req.body;

        const { error } = await supabase
            .from('documents')
            .insert([{ title, subtitle, content, likes: 0, shares: 0 }]);

        if (error) throw error;
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/documents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, content } = req.body;

        const { error } = await supabase
            .from('documents')
            .update({ title, subtitle, content })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/documents/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/documents/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, comment_text } = req.body;

        const { error } = await supabase
            .from('document_comments')
            .insert([{
                document_id: id,
                user_name: username,
                comment_text: comment_text
            }]);

        if (error) throw error;
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== MESSAGES ROUTES ====================
app.get('/api/messages', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json((data || []).map(m => ({
            id: String(m.id),
            name: m.name,
            email: m.email,
            message: m.message,
            date: m.created_at,
            read: !!m.is_read
        })));
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.json([]);
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const { error } = await supabase
            .from('messages')
            .insert([{ name, email, message, is_read: false }]);

        if (error) throw error;
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/messages/mark-read', async (req, res) => {
    try {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('is_read', false);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export the Express app for Vercel
export default app;
