# Email Setup Guide - Step by Step

## Quick Fix for "Buffer is not defined" and Email Issues

The error you're seeing is likely because the email credentials are not configured. Follow these steps:

### Step 1: Create .env file
Create a file named `.env` in the `ecommerce-backend` folder with this content:

```env
# Database Configuration (update with your values)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# JWT Secret (update with your secret)
JWT_SECRET=your_jwt_secret_key

# Email Configuration (REQUIRED for invoice emails)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=9000
NODE_ENV=development
```

### Step 2: Get Gmail App Password
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security"
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords" (under 2-Step Verification)
5. Select "Mail" and "Other (Custom name)"
6. Enter "Asipiya E-commerce" as the name
7. Click "Generate"
8. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")

### Step 3: Update .env file
Replace the email values in your `.env` file:
```env
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### Step 4: Restart the server
1. Stop the current server (Ctrl+C)
2. Run: `npm start`

### Step 5: Test the email
Try sending an invoice again. It should work now!

## Troubleshooting

### If you still get errors:
1. **Check the backend console** - Look for error messages when you try to send the email
2. **Verify .env file location** - Make sure it's in the `ecommerce-backend` folder
3. **Check Gmail settings** - Make sure 2FA is enabled and app password is correct
4. **Check spam folder** - The email might go to spam initially

### Common Issues:
- **"Invalid credentials"** - Use app password, not your regular Gmail password
- **"2FA not enabled"** - You must enable 2-factor authentication first
- **"App password not working"** - Generate a new app password

## File Structure
Your `.env` file should be here:
```
ecommerce-backend/
├── .env  ← Create this file here
├── src/
├── package.json
└── ...
```

## Security Note
- Never commit the `.env` file to git
- Keep your app password secure
- The `.env` file is already in `.gitignore` so it won't be committed 