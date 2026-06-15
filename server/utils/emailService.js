export const sendOTPEmail = async (email, otp) => {
    console.log(`Attempting to send OTP to ${email}...`);

    if (!process.env.BREVO_API_KEY) {
        console.error("BREVO_API_KEY env var is missing!");
        return false;
    }

    const senderEmail = process.env.GMAIL_USER || "harrykaler005@gmail.com";

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: "GoWheelo",
                    email: senderEmail
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: "Your GoWheelo Verification Code",
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
                        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
                            <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                                <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">GoWheelo</h2>
                                <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">Secure Your Account</p>
                            </div>
                            <div style="padding: 40px; text-align: center;">
                                <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Verify your email</h3>
                                <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 32px 0;">
                                    Welcome to GoWheelo! Use the code below to complete your registration.
                                </p>
                                <div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                                    <h1 style="margin: 0; font-size: 42px; letter-spacing: 8px; color: #1e293b; font-family: monospace; font-weight: 800;">${otp}</h1>
                                </div>
                                <p style="color: #94a3b8; font-size: 13px;">
                                    This code expires in <strong style="color: #3b82f6;">10 minutes</strong>.
                                </p>
                            </div>
                            <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                    If you didn't request this, you can safely ignore this email.
                                </p>
                            </div>
                        </div>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (response.ok && (data.messageId || data.id)) {
            console.log("Email sent successfully via Brevo:", data.messageId || data.id);
            return true;
        } else {
            console.error("Brevo API error:", JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error("Brevo send failed:", error.message);
        return false;
    }
};



