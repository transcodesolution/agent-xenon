export const ACCOUNT_CREATION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to <%= organizationName %>!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #1c7ed6;">🎉 Welcome to <%= organizationName %>!</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Congratulations! You have been successfully added to the platform.
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Your account is now active, and you can log in to start using the platform.
        </p>

        <a href="<%= frontendDomailUrl %>" 
           style="display: inline-block; background-color: #1c7ed6; color: #ffffff; padding: 12px 20px; margin-top: 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
           Log In to Your Account
        </a>

        <p style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
            If you have any questions, feel free to contact the HR team.<br />
            Thank you,<br />
            <strong><%= organizationName %> Team</strong>
        </p>
    </div>
</body>
</html>`;

export const ACCOUNT_UPDATION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Information Updated</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #1c7ed6;">🔄 Account Information Updated</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Your account information was updated on:
        </p>

        <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; font-size: 14px; margin: 20px 0;">
            <p><strong><%= updatedOn %></strong></p>
        </div>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            If you did not make this change, please contact your HR Team immediately.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
            Thank you,<br />
            <strong><%= organizationName %> Team</strong>
        </p>
    </div>
</body>
</html>`;