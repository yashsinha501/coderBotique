const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config()
const cors = require('cors');


const supabaseUrl = process.env.DB_URL;
const supabaseKey = process.env.PROJECT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());  
app.use(express.json()); 




app.get('/', (req, res) => {
  res.send('Todo Backend API is running...');
});



app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([{ text }])
    .select('*')

  if (error) {
    return res.status(500).json({ error: error.message });
  }

    console.log(data);
    

  res.status(201).json({data});
});


// Get all todos (GET)
app.get('/todos', async (req, res) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

// Update a todo (PUT)
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const { data, error } = await supabase
    .from('todos')
    .update({ text, completed })
    .eq('id', id)
    .select('*')

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

// Delete a todo (DELETE)
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Todo deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

