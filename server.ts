

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://wjgqknytnmvsxdxjttio.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqZ3Frbnl0bm12c3hkeGp0dGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU5NTQsImV4cCI6MjA4Nzc0MTk1NH0.P6rwNIRSkMtl6Z4HZWKUQvQuofkoHSkqc1YTgO9h6-E';
const supabase = createClient(supabaseUrl, supabaseKey);

// Note: You'll need to create these tables in your Supabase database:
// - documents (id, title, subtitle, content, likes, shares, date)
// - comments (id, docId, user, text, date)
// - messages (id, name, email, message, date, read)
// - settings (key, value)

// API Endpoints for Documents
app.get('/api/documents', async (req, res) => {
  try {
    // Fetch all documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .order('date', { ascending: false });

    if (docsError) throw docsError;

    // Fetch comments for each document
    const docsWithComments = await Promise.all(
      documents.map(async (doc) => {
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('docId', doc.id);

        if (commentsError) throw commentsError;
        return { ...doc, comments: comments || [] };
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

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete comments first (foreign key constraint)
    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('docId', id);

    if (commentsError) throw commentsError;

    // Delete the document
    const { error: docError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (docError) throw docError;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: error.message });
  }
});

// API Endpoints for Messages
app.get('/api/messages', async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    // Convert read field to boolean
    const formattedMessages = messages.map(m => ({
      ...m,
      read: !!m.read
    }));

    res.json(formattedMessages);
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
