const { google } = require('googleapis');

// In-memory store for basic rate limiting
const ipRequests = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW_MS) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000);

exports.handler = async function (event, context) {
  // CORS check if needed
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ status: 'error', message: 'Method Not Allowed' })
    };
  }

  // Rate Limiting
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  const now = Date.now();
  const requestData = ipRequests.get(ip);
  
  if (requestData && now - requestData.timestamp < RATE_LIMIT_WINDOW_MS) {
    if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
      return {
        statusCode: 429,
        body: JSON.stringify({ status: 'error', message: 'Too many requests, please try again later.' })
      };
    }
    requestData.count++;
  } else {
    ipRequests.set(ip, { timestamp: now, count: 1 });
  }

  try {
    const body = JSON.parse(event.body);
    const { name, phone, occasion, story, honeypot } = body;

    // Spam Protection: Honeypot Check
    if (honeypot) {
      console.log('Spam Prevention: Honeypot triggered, simulating success');
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'success', message: 'Enquiry submitted successfully' })
      };
    }

    console.log(`Processing payload from POST input: Name=${name}, Occasion=${occasion}`);

    if (!name || !phone || !occasion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'error', message: 'Name, phone, and occasion are required.' })
      };
    }

    const serviceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '';
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      console.error('SERVER MISCONFIG: Missing Google Sheets credentials in environment variables.');
      return {
        statusCode: 500,
        body: JSON.stringify({ status: 'error', message: 'Server misconfiguration.' })
      };
    }
    
    console.log('Auth configurations checked, attempting to initiate GoogleAuth...');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const date = new Date().toLocaleString();
    const finalStory = story || '';

    console.log("Writing to sheet:", sheetId);
    console.log("Data:", [date, name, phone, occasion, finalStory]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[date, name, phone, occasion, finalStory]]
      }
    });

    console.log('Row successfully inserted.');

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success', message: 'Enquiry submitted successfully' })
    };
    
  } catch (error) {
    console.error('Error handling enquiry:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: 'Failed to save enquiry' })
    };
  }
};
