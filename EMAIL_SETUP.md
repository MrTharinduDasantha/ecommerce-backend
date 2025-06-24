# Email Setup for Invoice Sending

This document explains how to set up email functionality to send invoices via email with PDF attachments.

## Prerequisites

1. A Gmail account
2. App Password for Gmail (2-factor authentication must be enabled)

## Setup Instructions

### 1. Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password

1. Go to your Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click on "App passwords"
4. Generate a new app password for "Mail"
5. Copy the generated password (16 characters)

### 3. Create Environment Variables

Create a `.env` file in the root directory of the backend with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password

# Server Configuration
PORT=9000
NODE_ENV=development
```

### 4. Important Notes

- **EMAIL_USER**: Use your full Gmail address
- **EMAIL_PASS**: Use the 16-character app password, NOT your regular Gmail password
- Never commit the `.env` file to version control
- The app password is different from your regular Gmail password

## How It Works

1. When a user clicks "Share via Email" in the invoice component:
   - The PDF is generated on the frontend
   - The PDF is converted to base64
   - The base64 data is sent to the backend API
   - The backend converts the base64 back to a PDF buffer
   - The PDF is attached to an email and sent via Gmail SMTP

## API Endpoint

The invoice email functionality uses the following endpoint:

```
POST /api/orders/:customer_id/:order_id/send-invoice
```

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <jwt_token>`

**Body:**
```json
{
  "emailAddress": "recipient@example.com",
  "pdfBase64": "base64_encoded_pdf_data"
}
```

## Troubleshooting

### Common Issues

1. **Authentication failed**: Make sure you're using the app password, not your regular Gmail password
2. **2FA not enabled**: You must enable 2-factor authentication to generate app passwords
3. **Less secure app access**: Gmail no longer supports "less secure app access", you must use app passwords

### Testing

To test the email functionality:

1. Make sure your `.env` file is properly configured
2. Start the backend server: `npm start`
3. Try sending an invoice from the frontend
4. Check the recipient's email inbox (and spam folder)

## Security Considerations

- The email credentials are stored in environment variables
- The API endpoint requires authentication
- Only the order owner can send invoices for their orders
- PDF data is transmitted securely over HTTPS (in production) 