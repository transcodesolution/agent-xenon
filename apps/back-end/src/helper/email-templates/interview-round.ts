export const APPLICANT_EXAMINATION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exam Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #1c7ed6; text-align: center;">Exam Invitation</h2>
    
    <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear Candidate,</p>

    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      We have received your inquiry and are excited to move forward with your application.
      Get ready for your <strong><%= roundType.toLowerCase() %></strong> round. You can take this test from home.
    </p>

    <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; font-size: 14px; margin-top: 20px;">
      <p style="margin: 0;"><strong>Login Credentials:</strong></p>
      <p style="margin: 5px 0;">Email: <%= applicantEmail %></p>
      <p style="margin: 5px 0;">Password: <%= applicantPassword %></p>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.6;">Click the button below to start your examination:</p>

    <div style="text-align: center;">
      <a href="<%= examLink %>" style="display: inline-block; background-color: #1c7ed6; color: #ffffff; padding: 12px 18px; margin: 20px auto; border-radius: 8px; text-decoration: none; font-weight: bold;">Start Examination</a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
      Best wishes and good luck!<br />
      Thank you,<br />
      <strong>HR Team, <%= organizationName %></strong>
    </p>
  </div>
</body>
</html>`;