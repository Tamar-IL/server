// קובץ: api/proxy.js

export default async function handler(req, res) {
  // 🔴 חובה! CORS headers - בלי זה הדפדפן חוסם
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 🔴 חובה! טיפול ב-preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('📨 Received from chat:', req.body);
    
    // שליחה ל-Make
    const response = await fetch('https://hook.eu2.make.com/mnlmqnrelehv5i7bdba7sj7m5oe7art4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('📥 Make status:', response.status);
    
    // 🔴 חשוב! Make לא תמיד מחזיר JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Make החזיר טקסט רגיל
      const text = await response.text();
      data = { reply: text, success: true };
    }
    
    console.log('✅ Sending back:', data);
    res.status(200).json(data);
    
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ 
      error: 'Failed to connect to Make', 
      details: err.message 
    });
  }
}
