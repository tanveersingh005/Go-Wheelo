// Using Resend API (HTTPS) instead of Gmail SMTP
// Gmail SMTP is blocked on Render's IPv6 network — Resend works via port 443

export const sendOTPEmail = async (email, otp) => {
    console.log(`Attempting to send OTP to ${email}...`);

    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY env var is missing!");
        return false;
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "GoWheelo <onboarding@resend.dev>",
                to: email,
                subject: "Your GoWheelo Verification Code",
                html: `
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
                `,
            }),
        });

        const data = await response.json();

        if (response.ok && data.id) {
            console.log("Email sent successfully via Resend:", data.id);
            return true;
        } else {
            console.error("Resend API error:", JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error("Email send failed:", error.message);
        return false;
    }
};

