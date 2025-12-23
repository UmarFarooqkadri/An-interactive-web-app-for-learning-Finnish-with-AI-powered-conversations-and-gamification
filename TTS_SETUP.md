# Text-to-Speech Setup with Quota Management

This document explains the TTS (Text-to-Speech) implementation with Google Cloud TTS API and automatic fallback to Web Speech API.

## Overview

The app uses a **tiered TTS system** with quota management:

1. **Primary**: Google Cloud Text-to-Speech API (high-quality Finnish voices)
2. **Fallback**: Web Speech API (browser built-in, no API key needed)

The system automatically tracks usage and falls back to Web Speech API when:
- Google TTS API quota is exceeded
- No API key is configured
- Google TTS API fails for any reason

## Free Tier Limits

### Google Cloud Text-to-Speech
- **Standard voices**: 1 million characters/month FREE
- **WaveNet voices**: 1 million characters/month FREE
- **Neural2 voices**: 1 million characters/month FREE
- After free tier: $4-16 per 1 million characters (depending on voice type)

### Quota Management
- Usage tracked in browser localStorage
- Automatic monthly reset
- Warning at 80% usage (800,000 characters)
- Automatic fallback at 100% usage

## Setup Instructions

### 1. Enable Google Cloud Text-to-Speech API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Text-to-Speech API:
   - Visit: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   - Click **"Enable"**

### 2. Create API Key

1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the generated API key
4. **Important**: Restrict the API key for security:
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Text-to-Speech API"
   - Under "Application restrictions", add your domain (e.g., `*.vercel.app`)
   - Save

### 3. Add API Key to Environment

Add to `.env`:
```bash
EXPO_PUBLIC_GOOGLE_TTS_API_KEY=your_api_key_here
```

For Vercel deployment:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add: `EXPO_PUBLIC_GOOGLE_TTS_API_KEY` with your API key value
4. Redeploy

### 4. Verify Setup

1. Start the app
2. Open browser console
3. Use any TTS feature (e.g., AI chat, vocabulary practice)
4. Check console logs:
   - `TTS: Attempting Google Cloud TTS` = Using Google TTS ✅
   - `TTS used: X chars. Monthly total: Y/1000000` = Tracking working ✅
   - `TTS: Using Web Speech` = Fallback (no API key or quota exceeded)

## Usage Tracking

### View Current Usage

Open browser console and run:
```javascript
import { getTTSUsageStats } from './services/ttsService';
const stats = getTTSUsageStats();
console.log(stats);
```

Returns:
```javascript
{
  usage: 12500,              // Characters used this month
  requests: 45,              // Number of requests
  limit: 1000000,            // Monthly limit
  remaining: 987500,         // Characters remaining
  percentUsed: 1.25,         // Percentage used
  withinQuota: true,         // Still within quota
  lastReset: "2025-12"       // Last reset month
}
```

### Reset Usage (if needed)

```javascript
import { resetTTSUsage } from './services/ttsService';
resetTTSUsage();
```

**Note**: Usage automatically resets on the 1st of each month.

## How It Works

### Automatic Fallback Logic

```javascript
// When you call speakFinnish()
1. Check if Google TTS API key is configured
   └─ NO → Use Web Speech API
   └─ YES → Continue to step 2

2. Check if within monthly quota
   └─ NO → Use Web Speech API + show warning
   └─ YES → Continue to step 3

3. Try Google Cloud TTS
   └─ SUCCESS → Play audio + track usage
   └─ FAIL → Use Web Speech API
```

### Character Counting

Usage is tracked by the number of characters in the text being spoken:
- "Hei" = 3 characters
- "Kiitos paljon avusta!" = 21 characters
- Empty strings don't count

### Storage

Usage data stored in browser localStorage:
- `tts_monthly_usage`: Total characters used this month
- `tts_total_requests`: Number of requests made
- `tts_last_reset`: Last reset month (YYYY-MM format)

## Voice Configuration

### Google Cloud TTS Voices

Default Finnish voice: `fi-FI-Standard-A` (Female)

Available Finnish voices:
- `fi-FI-Standard-A` (Female, Standard quality)
- `fi-FI-Wavenet-A` (Female, High quality - WaveNet)

To change voice, modify in `ttsService.js`:
```javascript
const {
  voiceName = 'fi-FI-Wavenet-A',  // Change here
  ...
} = options;
```

### Web Speech API

Uses browser's built-in Finnish voices (varies by browser/OS):
- Chrome/Edge: Google Finnish voice
- Safari: Apple Finnish voice
- Firefox: eSpeak Finnish voice

Quality varies - Google TTS is generally much better.

## Cost Estimation

### Example Usage Patterns

**Light usage** (100 users, 50 phrases/day):
- 100 users × 50 phrases × 30 chars/phrase × 30 days = 4.5M chars/month
- Cost: $4/month (after 1M free)

**Medium usage** (500 users, 30 phrases/day):
- 500 users × 30 phrases × 30 chars/phrase × 30 days = 13.5M chars/month
- Cost: $12/month (after 1M free)

**Your app**:
- Estimate based on actual usage tracking
- Monitor in Google Cloud Console: [Usage & Billing](https://console.cloud.google.com/billing)

## Monitoring & Alerts

### Google Cloud Console

1. Go to [Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Dashboard**
4. Click on **Text-to-Speech API**
5. View usage graphs and quotas

### Set up Budget Alerts

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Click on your billing account
3. Go to **Budgets & alerts**
4. Create budget alert at $5/month (or your preference)

## Troubleshooting

### Issue: "Google TTS API error: API key not valid"

**Solution**:
1. Check API key is correct in `.env`
2. Verify Text-to-Speech API is enabled in Google Cloud Console
3. Check API key restrictions aren't blocking requests

### Issue: "TTS: Using Web Speech (no API key)"

**Cause**: API key not configured

**Solution**: Add `EXPO_PUBLIC_GOOGLE_TTS_API_KEY` to `.env` and restart app

### Issue: "TTS quota exceeded, using fallback voice"

**Cause**: Exceeded 1 million characters/month

**Solution**:
- Wait for monthly reset (automatic on 1st of month)
- OR add billing to Google Cloud account to continue with paid tier
- Web Speech API will continue working as fallback

### Issue: Audio not playing

**Causes**:
1. Browser autoplay policy blocking audio
2. User hasn't interacted with page yet

**Solution**: Audio will play after first user interaction (click, tap, etc.)

### Issue: Poor voice quality

**Cause**: Using Web Speech API fallback

**Check**:
```javascript
// Console should show:
"TTS: Attempting Google Cloud TTS" ✅
// Not:
"TTS: Using Web Speech" ❌
```

**Solutions**:
1. Add Google TTS API key if missing
2. Check quota hasn't been exceeded
3. Check browser console for errors

## API Usage Best Practices

### Optimize Character Usage

1. **Remove unnecessary text**:
   ```javascript
   // Before: "Hei! Tervetuloa! Miten voin auttaa?"
   // After: "Hei! Miten voin auttaa?"
   // Saved: ~12 characters per response
   ```

2. **Cache common phrases**: Consider pre-generating audio for common phrases

3. **User preference**: Allow users to disable TTS if not needed

### Security

1. **API Key Restrictions**:
   - Restrict to Text-to-Speech API only
   - Add domain restrictions (e.g., your Vercel domain)
   - Rotate keys regularly

2. **Never expose API key**:
   - Keep in environment variables
   - Don't commit to git
   - Use Vercel environment variables for production

### Monitoring

1. Check usage weekly in Google Cloud Console
2. Review costs monthly
3. Set up budget alerts

## Testing

### Test Google TTS

```javascript
import { speakFinnish, getTTSUsageStats } from './services/ttsService';

// Speak with Google TTS
await speakFinnish("Hei, tämä on testi");

// Check stats
console.log(getTTSUsageStats());
```

### Test Fallback

```javascript
import { speak } from './services/ttsService';

// Force Web Speech API
await speak("Hei, tämä on testi", {
  forceWebSpeech: true
});
```

### Test Quota Exceeded

```javascript
import { resetTTSUsage, getTTSUsageStats } from './services/ttsService';

// Simulate quota exceeded
localStorage.setItem('tts_monthly_usage', '1000001');

// Should use Web Speech API
await speakFinnish("Testi");

// Reset when done testing
resetTTSUsage();
```

## Files

- **`services/ttsService.js`**: Main TTS service with quota management
- **`App.js`**: Updated to use new TTS service
- **`components/VocabularyPractice.js`**: Updated to use new TTS service
- **`.env`**: Contains API key (add: `EXPO_PUBLIC_GOOGLE_TTS_API_KEY`)

## Summary

✅ **Implemented**: Google Cloud TTS with quota tracking
✅ **Free tier**: 1 million characters/month
✅ **Fallback**: Automatic Web Speech API
✅ **Tracking**: localStorage-based usage monitoring
✅ **Auto-reset**: Monthly quota reset
✅ **Safe**: Quota enforcement prevents surprise costs

**Next Steps**:
1. Get Google Cloud API key
2. Add to `.env` file
3. Enable Text-to-Speech API in Google Cloud Console
4. Test the implementation
5. Monitor usage in Google Cloud Console

---

**Last Updated**: December 22, 2025
**Status**: ✅ Implemented - Ready to configure API key
