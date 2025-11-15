const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint שמקבל הודעה מהצ’אט
app.post('/proxy', async (req, res) => {
  try {
    const response = await fetch('https://ffp.tactiq.io/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_API_KEY' // אם צריך
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Tactiq', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
