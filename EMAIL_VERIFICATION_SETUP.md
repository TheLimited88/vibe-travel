# Email Verification Setup Guide

## Overview
The email verification system has been implemented for Vibe Travel. This guide explains how to complete the setup and use it.

## Files Created

### Core Files
- **lib/firebase.ts** - Firebase initialization and authentication setup
- **lib/auth.ts** - Email verification utilities
- **app/api/auth/send-verification/route.ts** - API endpoint to send verification emails via SendGrid
- **app/api/auth/verify-email/route.ts** - API endpoint to verify email tokens
- **app/api/auth/check-verification/route.ts** - API endpoint to check email verification status
- **app/auth/verify-email/page.tsx** - Verification confirmation page
- **hooks/useEmailVerification.ts** - React hook for checking verification status

### Updated Files
- **app/auth/create-account/page.tsx** - Integrated Firebase auth and email verification
- **.env.local** - Added SendGrid configuration variables

## Setup Instructions

### 1. Install SendGrid (if not already installed)
```bash
npm install @sendgrid/mail
```

### 2. Configure SendGrid API Key
1. Go to your [SendGrid Account](https://app.sendgrid.com)
2. Navigate to **Settings → API Keys**
3. Create a new API key (give it a name like "Vibe Travel")
4. Copy the API key

### 3. Update Environment Variables
Edit `.env.local` and replace the placeholders:

```env
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
```

> **Important**: For production, set `NEXT_PUBLIC_APP_URL` to your actual domain (e.g., `https://vibe-travel.app`)

### 4. Firestore Database Setup
Make sure your Firestore has the following collections:

#### users collection
```
{
  email: string
  emailVerified: boolean (default: false)
  emailVerifiedAt: timestamp (optional)
  createdAt: timestamp
  updatedAt: timestamp
  savedPlaces: array (default: [])
  visitedPlaces: array (default: [])
  reviews: array (default: [])
}
```

#### verification_tokens collection
```
{
  userId: string
  email: string
  createdAt: timestamp
  expiresAt: timestamp (60 minutes from creation)
  used: boolean (default: false)
  usedAt: timestamp (optional)
}
```

## How It Works

### User Registration Flow
1. User fills out email and password on create account page
2. Clicks "Create account"
3. Firebase creates the user account
4. System creates a user document in Firestore with `emailVerified: false`
5. SendGrid sends a verification email with a 60-minute expiring link
6. User sees "Check your email" modal
7. User clicks link in email → lands on verify-email page
8. System validates token and marks email as verified in Firestore
9. User is redirected to home page

### Protected Features
Users with unverified emails can:
- ✅ Browse places
- ✅ View place details
- ✅ Access the platform

Users with unverified emails CANNOT:
- ❌ Save places (restrict in API)
- ❌ Track visited places (restrict in API)
- ❌ Leave reviews (restrict in API)

## Adding Verification Checks to Features

### Example: Protecting Save Place Feature
```typescript
// In your save place API endpoint
export async function POST(request: NextRequest) {
  const { userId, placeId } = await request.json();

  // Check email verification
  const isVerified = await checkEmailVerified(userId);
  if (!isVerified) {
    return NextResponse.json(
      { error: 'Please verify your email to save places' },
      { status: 403 }
    );
  }

  // ... rest of save place logic
}
```

### Example: Client-Side UI Check
```typescript
import { useEmailVerification } from '@/hooks/useEmailVerification';

export function SavePlaceButton({ userId, placeId }) {
  const { isVerified } = useEmailVerification(userId);

  if (!isVerified) {
    return (
      <button disabled style={{ opacity: 0.5 }}>
        Save place (verify email first)
      </button>
    );
  }

  return (
    <button onClick={() => savePlace(placeId)}>
      Save place
    </button>
  );
}
```

## Email Template Customization
The email is sent from `app/api/auth/send-verification/route.ts`. To customize the template, edit the `html` property in the message object.

Current template features:
- Vibe Travel branding
- Clear call-to-action button
- 60-minute expiration notice
- Professional formatting

## Troubleshooting

### Emails Not Sending
1. Verify `SENDGRID_API_KEY` is correct in `.env.local`
2. Check SendGrid API key has "Mail Send" permissions
3. Verify `SENDGRID_FROM_EMAIL` matches a verified sender in SendGrid
4. Check server logs for error messages

### Verification Link Not Working
1. Ensure `NEXT_PUBLIC_APP_URL` is correctly set
2. Verify token hasn't expired (60 minute window)
3. Check Firestore `verification_tokens` collection exists
4. Ensure user document exists in `users` collection

### Users Can't Sign In After Verification
1. Make sure `emailVerified` is being set to `true` in user document
2. Check that verification token's `used` flag is set to `true`

## Testing

### Test Verification Email Sending
1. Create account with test email
2. Check email inbox for verification link
3. Click link and verify it works
4. Confirm `emailVerified` is `true` in Firestore

### Test Expired Token
1. Manually set a verification token's `expiresAt` to the past
2. Try to verify using that token
3. Should show "Token expired" error

### Test Protected Features
1. Create account but don't verify email
2. Try to save a place
3. Should be blocked with verification message

## Next Steps

1. **Get SendGrid API Key** - Follow setup instructions above
2. **Add Verification Checks** - Protect save place, visited places, and review endpoints
3. **Update UI Components** - Add verification checks to buttons and forms
4. **Test Email Delivery** - Send test emails to ensure configuration is correct
5. **Deploy** - Update `NEXT_PUBLIC_APP_URL` for production domain

## Support
For issues with SendGrid configuration, visit: https://sendgrid.com/docs/
For Firebase Firestore help, visit: https://firebase.google.com/docs/firestore
