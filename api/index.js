import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Health check endpoint (for testing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// ==================== DOCUMENTS ROUTES ====================
app.get('/api/documents', async (req, res) => {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(documents || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { id, title, subtitle, content, date } = req.body;
    const { error } = await supabase
      .from('documents')
      .insert([{ id, title, subtitle, content, created_at: date, likes: 0, shares: 0 }]);

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (error) {
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
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { id, name, email, message, date } = req.body;
    const { error } = await supabase
      .from('messages')
      .insert([{ id, name, email, message, created_at: date, is_read: false }]);

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

// ==================== HERO ROUTES ====================
app.get('/api/hero', async (req, res) => {
  try {
    const { data: hero } = await supabase
      .from('hero_section')
      .select('*')
      .eq('id', '1')
      .single();

    const { data: buttons } = await supabase
      .from('hero_buttons')
      .select('*')
      .eq('hero_id', '1');

    const { data: socials } = await supabase
      .from('hero_socials')
      .select('*')
      .eq('hero_id', '1');

    res.json({
      ...hero,
      buttons: buttons || [],
      socials: socials || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ABOUT ROUTES ====================
app.get('/api/about', async (req, res) => {
  try {
    const { data: about } = await supabase
      .from('about_section')
      .select('*')
      .eq('id', '1')
      .single();

    const { data: cards } = await supabase
      .from('about_cards')
      .select('*')
      .eq('about_id', '1');

    res.json({
      ...about,
      cards: cards || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SKILLS ROUTES ====================
app.get('/api/skills', async (req, res) => {
  try {
    const { data: categories } = await supabase
      .from('skill_categories')
      .select('*');

    const skillsWithCategories = await Promise.all(
      (categories || []).map(async (category) => {
        const { data: skills } = await supabase
          .from('skills')
          .select('*')
          .eq('category_id', category.id);

        return { ...category, skills: skills || [] };
      })
    );

    res.json(skillsWithCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROJECTS ROUTES ====================
app.get('/api/projects', async (req, res) => {
  try {
    const { data: section } = await supabase
      .from('projects_section')
      .select('*')
      .eq('id', '1')
      .single();

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    res.json({
      ...section,
      items: projects || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTACT ROUTES ====================
app.get('/api/contact', async (req, res) => {
  try {
    const { data } = await supabase
      .from('contact_section')
      .select('*')
      .eq('id', '1')
      .single();

    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FOOTER ROUTES ====================
app.get('/api/footer', async (req, res) => {
  try {
    const { data } = await supabase
      .from('footer_section')
      .select('*')
      .eq('id', '1')
      .single();

    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SETTINGS ROUTES ====================
app.get('/api/settings', async (req, res) => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('id', '1')
      .single();

    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all for debugging
app.use('/api/*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ 
    error: 'Route not found', 
    path: req.path,
    method: req.method,
    available: 'Check server logs'
  });
});

// Export for Vercel
export default app;
