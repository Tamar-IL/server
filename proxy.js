import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://ffp.tactiq.io/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // אם צריך, הוסף Authorization כאן
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Tactiq', details: err.message });
  }
}
