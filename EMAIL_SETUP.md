# Email Setup Instructions

To receive contact form messages via email, you need to configure Gmail App Password.

## Steps to Set Up Email:

1. **Enable 2-Step Verification on your Google Account:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Portfolio Contact Form" as the name
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Create a `.env` file in the project root:**
   ```env
   EMAIL_USER=talb.arkan2003@gmail.com
   EMAIL_PASS=your-16-character-app-password-here
   PORT=3000
   ```

4. **Important:** 
   - Never commit the `.env` file to git (it's already in `.gitignore`)
   - The `.env` file should be in the root directory: `/Users/talbarkan/Desktop/portfolo/.env`

5. **Restart the server** after creating the `.env` file

## Testing:

After setup, test the contact form on your website. You should receive emails at `talb.arkan2003@gmail.com` when someone submits the form.

