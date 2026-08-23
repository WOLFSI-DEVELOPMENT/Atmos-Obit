const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newDataRoutes = `
  // --- User Data Persistence ---
  app.get('/api/user/data', async (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const rows = await sql\`SELECT payload FROM user_data WHERE user_id = \${decoded.id}\`;
      if (rows.length > 0) {
        res.json({ success: true, data: rows[0].payload });
      } else {
        res.json({ success: true, data: null });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.post('/api/user/data', async (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const payload = req.body;
      
      await sql\`
        INSERT INTO user_data (user_id, payload)
        VALUES (\${decoded.id}, \${payload})
        ON CONFLICT (user_id) DO UPDATE SET payload = EXCLUDED.payload;
      \`;
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  // --- Vite Middleware ---
`;

code = code.replace('// --- Vite Middleware ---', newDataRoutes);
fs.writeFileSync('server.ts', code);
console.log('done');
