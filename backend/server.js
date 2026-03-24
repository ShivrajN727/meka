import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from './database.js';
import { callLLM } from './llm.js';

const app = express();
app.use(cors()); 
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, username });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.json({ id: user.id, username: user.username });
    }
  );
});

//LLM
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await callLLM(prompt);

    res.json({ response });

  } catch (err) {
    res.status(500).json({ error: 'LLM failed' });
  }
});

app.listen(3001, () => {
  console.log('Auth server running on port 3001');
});


export default app;