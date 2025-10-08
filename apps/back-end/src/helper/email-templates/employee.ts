export const EMPLOYEE_ADDITION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to <%= organizationName %>!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #1c7ed6;">👋 Welcome to <%= organizationName %>!</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We’re excited to have you on board! You’ve been successfully added as an employee to our organization.
        </p>
		
		<p style="font-size: 16px; color: #333; line-height: 1.6;">
            Below are your login credentials to access the platform:
        </p>

        <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; font-size: 14px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Login Credentials:</strong></p>
            <p style="margin: 5px 0;">Email: <%= employeeEmail %></p>
            <p style="margin: 5px 0;">Password: <%= employeePassword %></p>
        </div>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            You can now log in and explore the platform to access tools, resources, access training to your skills and more.
        </p>

        <a href="<%= frontendDomailUrl %>" 
           style="display: inline-block; background-color: #1c7ed6; color: #ffffff; padding: 12px 20px; margin-top: 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
           Go to Dashboard
        </a>

        <p style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
            For any questions or assistance, please reach out to your HR team.<br />
            Welcome once again!<br />
            <strong><%= organizationName %> Team</strong>
        </p>
    </div>
</body>
</html>`;

export const EMPLOYEE_UPDATE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Employee Information Updated</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #1c7ed6;">🔄 Employee Information Updated</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            The details associated with your employee profile were updated on:
        </p>

        <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; font-size: 14px; margin: 20px 0;">
            <p><strong><%= updatedOn %></strong></p>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
            Thanks for staying updated.<br />
            <strong><%= organizationName %> Team</strong>
        </p>
    </div>
</body>
</html>`;