/**
 * Vercel Serverless Function - Send Welcome Email
 *
 * Endpoint: /api/send-welcome-email
 * Method: POST
 * Body: { email: string, name: string }
 */

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = 'farooqkadri@gmail.com'; // Your verified sender email
const FROM_NAME = "Let's Finnish This";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get email and name from request body
  const { email, name } = req.body;

  // Validate input
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check if SendGrid API key is configured
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    // Send email via SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email, name }],
            subject: 'Welcome to Let\'s Finnish This! 🇫🇮',
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME,
        },
        content: [
          {
            type: 'text/html',
            value: getWelcomeEmailHTML(name),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SendGrid API error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to send email',
        details: errorData
      });
    }

    console.log(`Welcome email sent to ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully'
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Welcome Email HTML Template
 */
function getWelcomeEmailHTML(name) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Let's Finnish This!</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #2C3E50;
      margin-bottom: 10px;
    }
    .flag {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      color: #2C3E50;
      font-size: 28px;
      margin-bottom: 20px;
    }
    .greeting {
      font-size: 18px;
      color: #555;
      margin-bottom: 20px;
    }
    .content {
      margin-bottom: 30px;
    }
    .feature-box {
      background-color: #f8f9fa;
      border-left: 4px solid #4ECDC4;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .feature-title {
      font-weight: bold;
      color: #2C3E50;
      margin-bottom: 5px;
    }
    .cta-button {
      display: inline-block;
      background-color: #4ECDC4;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .tips {
      background-color: #FFF9E6;
      border: 1px solid #FFE066;
      border-radius: 5px;
      padding: 20px;
      margin: 20px 0;
    }
    .tips-title {
      font-weight: bold;
      color: #D4A017;
      margin-bottom: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #777;
      font-size: 14px;
    }
    .unsubscribe {
      color: #999;
      font-size: 12px;
      margin-top: 10px;
    }
    .unsubscribe a {
      color: #999;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="flag">🇫🇮</div>
      <div class="logo">Let's Finnish This</div>
    </div>

    <h1>Tervetuloa! Welcome aboard!</h1>

    <div class="greeting">
      Hi <strong>${name}</strong>,
    </div>

    <div class="content">
      <p>Welcome to <strong>Let's Finnish This</strong> - your AI-powered Finnish learning companion! We're thrilled to have you join our community of Finnish language learners.</p>

      <p>You're about to embark on an exciting journey to master Finnish. Here's what you can do right now:</p>

      <div class="feature-box">
        <div class="feature-title">🤖 Chat with your AI Tutor</div>
        Practice conversations in Finnish and get instant feedback with translations.
      </div>

      <div class="feature-box">
        <div class="feature-title">📚 Learn 300+ Finnish Words</div>
        Master essential vocabulary with speaking and writing practice modes.
      </div>

      <div class="feature-box">
        <div class="feature-title">🎯 Practice Real Scenarios</div>
        Learn practical Finnish for shopping, restaurants, travel, and more.
      </div>

      <div class="feature-box">
        <div class="feature-title">👥 Practice with Partners</div>
        Connect with other learners for video call practice sessions.
      </div>

      <div class="feature-box">
        <div class="feature-title">🏆 Track Your Progress</div>
        Earn XP points, level up, and compete on the leaderboard.
      </div>

      <div style="text-align: center;">
        <a href="https://an-interactive-web-app-for-learning.vercel.app/" class="cta-button">
          Start Learning Now →
        </a>
      </div>

      <div class="tips">
        <div class="tips-title">💡 Quick Start Tips:</div>
        <ul>
          <li><strong>Start with AI Chat:</strong> Say "Moi!" (Hello) and introduce yourself</li>
          <li><strong>Practice Daily:</strong> Just 10 minutes a day makes a huge difference</li>
          <li><strong>Use Your Voice:</strong> Practice speaking to improve pronunciation</li>
          <li><strong>Track Your Streak:</strong> Build momentum by practicing every day</li>
          <li><strong>Find Partners:</strong> Real conversations accelerate learning</li>
        </ul>
      </div>

      <p>Learning Finnish is challenging but incredibly rewarding. Remember:</p>
      <ul>
        <li>🎯 Focus on consistency over perfection</li>
        <li>🗣️ Don't be afraid to make mistakes - that's how you learn!</li>
        <li>🎉 Celebrate small wins - every word learned is progress</li>
      </ul>

      <p>If you have any questions or feedback, just reply to this email. We'd love to hear from you!</p>

      <p><strong>Onnea matkaan!</strong> (Good luck on your journey!)<br>
      The Let's Finnish This Team</p>
    </div>

    <div class="footer">
      <p>You're receiving this email because you signed up for Let's Finnish This.</p>
      <div class="unsubscribe">
        <a href="#">Unsubscribe from future emails</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
