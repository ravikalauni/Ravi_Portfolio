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
const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== HERO SECTION ROUTES ====================
app.get('/api/hero', async (req, res) => {
    try {
        const { data: hero, error: heroError } = await supabase
            .from('hero_section')
            .select('*')
            .eq('id', '1')
            .single();

        if (heroError && heroError.code !== 'PGRST116') throw heroError;

        const { data: buttons, error: buttonsError } = await supabase
            .from('hero_buttons')
            .select('*')
            .eq('hero_id', '1');

        const { data: socials, error: socialsError } = await supabase
            .from('hero_socials')
            .select('*')
            .eq('hero_id', '1');

        res.json({
            ...hero,
            buttons: buttons || [],
            socials: socials || []
        });
    } catch (error) {
        console.error('Error fetching hero:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/hero', async (req, res) => {
    try {
        const { title, subtitle, buttons, socials } = req.body;

        const { error: heroError } = await supabase
            .from('hero_section')
            .upsert({ id: '1', title, subtitle });

        if (heroError) throw heroError;

        await supabase.from('hero_buttons').delete().eq('hero_id', '1');
        await supabase.from('hero_socials').delete().eq('hero_id', '1');

        if (buttons && buttons.length) {
            const { error: buttonsError } = await supabase
                .from('hero_buttons')
                .insert(buttons.map(b => ({ ...b, hero_id: '1' })));

            if (buttonsError) throw buttonsError;
        }

        if (socials && socials.length) {
            const { error: socialsError } = await supabase
                .from('hero_socials')
                .insert(socials.map(s => ({ ...s, hero_id: '1' })));

            if (socialsError) throw socialsError;
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating hero:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ABOUT SECTION ROUTES ====================
app.get('/api/about', async (req, res) => {
    try {
        const { data: about, error: aboutError } = await supabase
            .from('about_section')
            .select('*')
            .eq('id', '1')
            .single();

        if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;

        const { data: cards, error: cardsError } = await supabase
            .from('about_cards')
            .select('*')
            .eq('about_id', '1');

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
            .upsert({ id: '1', title, image_url, text });

        if (aboutError) throw aboutError;

        await supabase.from('about_cards').delete().eq('about_id', '1');

        if (cards && cards.length) {
            const { error: cardsError } = await supabase
                .from('about_cards')
                .insert(cards.map(c => ({ ...c, about_id: '1' })));

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

        await supabase.from('skills').delete().neq('id', '0');
        await supabase.from('skill_categories').delete().neq('id', '0');

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
                        ...s,
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
            .eq('id', '1')
            .single();

        if (sectionError && sectionError.code !== 'PGRST116') throw sectionError;

        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        res.json({
            ...section,
            items: projects || []
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
            .upsert({ id: '1', heading, description });

        if (sectionError) throw sectionError;

        await supabase.from('projects').delete().neq('id', '0');

        if (items && items.length) {
            const { error: projectsError } = await supabase
                .from('projects')
                .insert(items);

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
            .eq('id', '1')
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
            .upsert({ id: '1', ...req.body });

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
            .eq('id', '1')
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
            .upsert({ id: '1', ...req.body });

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
            .limit(1);

        if (error) throw error;
        res.json((data && data[0]) || {});
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        // Try upsert with id=1 (integer)
        const { error } = await supabase
            .from('settings')
            .upsert({ id: 1, ...req.body });

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== DOCUMENTS ROUTES ====================
app.get('/api/documents', async (req, res) => {
    try {
        const { data: documents, error: docsError } = await supabase
            .from('documents')
            .select('*')
            .order('date', { ascending: false });

        if (docsError) throw docsError;

        const docsWithComments = await Promise.all(
            (documents || []).map(async (doc) => {
                try {
                    const { data: comments } = await supabase
                        .from('document_comments')
                        .select('*')
                        .eq('document_id', doc.id);
                    return { ...doc, comments: comments || [] };
                } catch (e) {
                    return { ...doc, comments: [] };
                }
            })
        );

        res.json(docsWithComments);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/documents', async (req, res) => {
    try {
        const { id, title, subtitle, content, date } = req.body;

        const { error } = await supabase
            .from('documents')
            .insert([{ id, title, subtitle, content, date, likes: 0, shares: 0 }]);

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
                id: Date.now().toString(),
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
        let { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('date', { ascending: false });

        // If 'date' column doesn't exist, try without ordering
        if (error) {
            const fallback = await supabase.from('messages').select('*');
            if (fallback.error) throw fallback.error;
            data = fallback.data;
        }

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { id, name, email, message, date } = req.body;

        const { error } = await supabase
            .from('messages')
            .insert([{ id, name, email, message, date, read: false }]);

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
            .update({ read: true })
            .eq('read', false);

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
