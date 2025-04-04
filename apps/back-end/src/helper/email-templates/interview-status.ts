export const APPLICANT_SELECTION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Congratulations! You're Moving Forward</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #1c7ed6;">🎉 Congratulations!</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear Candidate,</p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">We appreciate your time and effort in participating in the <%= roundType.toLowerCase(); %> round for the applied position.</p>

        <p style="font-size: 16px; color: #333; font-weight: line-height: 1.6;">
            <strong>Great news!</strong> You have successfully cleared the <%= roundName?.toLowerCase() ?? roundType.toLowerCase(); %> and have been selected for the next stage of the hiring process.
            Our team will reach out to you with further details soon.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
            Best Regards, <br />
            <strong><%= organizationName %> Hiring Team</strong>
        </p>
    </div>
</body>
</html>`;

export const APPLICANT_REJECTION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interview Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #d32f2f;">🚫 Sorry</h2>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear Candidate,</p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We appreciate your time and effort in participating in the <%= roundType.toLowerCase(); %> round for the applied position.
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Unfortunately, we regret to inform you that you have not been selected to proceed further at this time. However, we truly appreciate your effort and encourage you to apply for future opportunities with us.
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thank you for your interest in our company.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
            Best Regards, <br />
            <strong><%= organizationName %> Hiring Team</strong>
        </p>
    </div>
</body>
</html>`;