export default async function handler(req, res) {
  // CORS headers - חובה!
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // טיפול ב-preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // רק POST מותר
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('📨 Received:', JSON.stringify(req.body));
    
    // שליחה ל-Make webhook
    const makeResponse = await fetch('https://hook.eu2.make.com/mnlmqnrelehv5i7bdba7sj7m5oe7art4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('📥 Make status:', makeResponse.status);
    
    // קריאת התשובה
    const contentType = makeResponse.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await makeResponse.json();
    } else {
      const textResponse = await makeResponse.text();
      responseData = { 
        reply: textResponse || 'ההודעה התקבלה',
        success: true 
      };
    }
    
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ 
      error: 'שגיאה בשרת',
      details: error.message,
      reply: 'מצטער, יש בעיה. נסה שוב.'
    });
  }
}
