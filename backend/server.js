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

//chat end point
app.post('/api/chat', async (req, res) => {
  const { prompt, username, conversationId, messages } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {

    let currentConversationId = conversationId||null;

//create conversation
    if (username && !currentConversationId) {
      const title = prompt || "New Chat";

      currentConversationId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO conversations (username, title) VALUES (?, ?)`,
          [username, title],
          function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      });
//history message
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          await new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
              [currentConversationId, msg.role, msg.content],
              (err) => (err ? reject(err) : resolve())
            );
          });
        }
      }
    }

 // user message]
    if (username) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
          [currentConversationId, 'user', prompt],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

//waitfor ai
    const response = await callLLM(prompt);
//save ai messave
    if (username) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
          [currentConversationId, 'ai', response],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    return res.json({
      response,
      conversationId: currentConversationId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM failed' });
  }
});


//history endpoint
app.get('/api/history', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  db.all(
    `SELECT id, title, created_at
     FROM conversations
     WHERE username = ?
     ORDER BY created_at DESC`,
    [username],
    (err, rows) => {
      if (err) {
        console.error('DB fetch error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});
//conversation id
app.get('/api/conversation/:id', (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT role, content, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC`,
    [id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});

app.listen(3001, () => {
  console.log('Auth server running on port 3001');
});


export default app;
