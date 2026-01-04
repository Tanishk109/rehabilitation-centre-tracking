# Password Reset & Email Configuration

This document explains how to set up password reset functionality with email notifications.

## Features Implemented

1. **Password Validation During Registration**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **Password Hashing**
   - All passwords are hashed using bcryptjs before storage
   - Salt rounds: 10

3. **Login with Password Verification**
   - Passwords are verified using bcrypt compare
   - Invalid credentials return appropriate error messages

4. **Forgot Password Flow**
   - User enters email address
   - System generates secure reset token
   - Reset link sent to registered email
   - Token expires in 1 hour

5. **Password Reset**
   - User clicks reset link from email
   - Token is validated
   - User sets new password with validation
   - Password is updated and token is cleared

## Email Configuration

### Option 1: Gmail (Recommended for Development)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Add to `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Option 2: Other SMTP Providers

For production, consider using:
- **Resend** (recommended for Next.js)
- **SendGrid**
- **AWS SES**
- **Mailgun**

Example for SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Option 3: Development Mode (No Email Setup)

If SMTP credentials are not configured, the system will:
- Log the reset link to the console
- Still process the reset request successfully
- Allow you to manually copy the reset link

## Environment Variables

Add these to your `.env.local` file:

```env
# MongoDB (already configured)
MONGODB_URI=your-mongodb-connection-string

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App URL (for reset links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Usage

### Registration
1. Navigate to `/register`
2. Fill in all required fields including password
3. Password validation happens in real-time
4. Password is hashed and stored securely

### Login
1. Navigate to `/`
2. Enter email and password
3. System verifies credentials
4. Access granted if valid

### Forgot Password
1. Click "Forgot Password?" on login page
2. Enter registered email address
3. Check email for reset link
4. Click link or copy to browser
5. Set new password

### Reset Password
1. Click reset link from email
2. Enter new password (must meet requirements)
3. Confirm password
4. Submit to update password
5. Redirected to login page

## Security Features

- Passwords are never stored in plain text
- Reset tokens are cryptographically secure (32 bytes)
- Tokens expire after 1 hour
- Tokens are single-use (cleared after password reset)
- Email existence is not revealed (security best practice)

## Testing

### Without Email Setup
1. Request password reset
2. Check server console for reset link
3. Copy link and use in browser

### With Email Setup
1. Configure SMTP credentials
2. Request password reset
3. Check email inbox
4. Click reset link
5. Set new password

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env.local`
- Verify SMTP host and port
- Check spam folder
- For Gmail, ensure App Password is used (not regular password)
- Check server console for error messages

### Reset Link Not Working
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check if token has expired (1 hour limit)
- Verify token hasn't been used already
- Check server logs for errors

### Password Validation Issues
- Ensure password meets all requirements:
  - 8+ characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character

## API Endpoints

- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/verify-reset-token` - Verify reset token
- `POST /api/auth/reset-password` - Reset password with new one

## Files Modified/Created

- `app/register/page.tsx` - Added password fields and validation
- `app/forgot-password/page.tsx` - Forgot password page
- `app/reset-password/page.tsx` - Reset password page
- `app/api/auth/forgot-password/route.ts` - Forgot password API
- `app/api/auth/verify-reset-token/route.ts` - Token verification API
- `app/api/auth/reset-password/route.ts` - Password reset API
- `app/api/register/route.ts` - Updated to hash passwords
- `app/api/users/route.ts` - Updated to verify passwords
- `lib/models.ts` - Added reset token fields to User model

