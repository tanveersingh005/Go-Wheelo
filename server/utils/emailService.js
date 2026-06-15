import dns from "node:dns";
import nodemailer from "nodemailer";

// Force Node.js to resolve IPv4 addresses first.
// Google SMTP servers have both IPv4 and IPv6 addresses.
// Render's outbound network lacks IPv6 routing, so forcing IPv4 prevents ENETUNREACH timeouts.
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

export const sendOTPEmail = async (email, otp) => {
    console.log(`Attempting to send OTP to ${email}...`);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error("GMAIL_USER or GMAIL_PASS environment variables are missing!");
        return false;
    }

    const mailOptions = {
        from: `"GoWheelo Support" <${process.env.GMAIL_USER}>`,
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
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully via Gmail SMTP:", info.response);
        return true;
    } catch (error) {
        console.error("Gmail SMTP send failed:", error.message);
        return false;
    }
};


