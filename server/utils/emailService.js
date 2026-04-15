import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Connection Error:", error.message);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

export const sendOTPEmail = async (email, otp) => {
    console.log(`Attempting to send OTP to ${email}...`);
    const mailOptions = {
        from: `"GoWheelo Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your GoWheelo Verification Code",
        html: `
            <div style="font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
                <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
                    <!-- Header with Gradient -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">GoWheelo</h2>
                        <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px; font-weight: 500;">Secure Your Account</p>
                    </div>
                    
                    <div style="padding: 40px; text-align: center;">
                        <div style="background: #eff6ff; width: 64px; height: 64px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                            <span style="font-size: 32px;">🔑</span>
                        </div>
                        
                        <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Verify your email</h3>
                        <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 32px 0;">
                            Welcome to the future of car rentals! Please use the verification code below to complete your registration.
                        </p>
                        
                        <div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                            <h1 style="margin: 0; font-size: 42px; letter-spacing: 8px; color: #1e293b; font-family: monospace; font-weight: 800;">${otp}</h1>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
                            This code expires in <strong style="color: #3b82f6;">10 minutes</strong>.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                            If you didn't request this, you can safely ignore this email.
                        </p>
                        <p style="color: #cbd5e1; font-size: 11px; margin-top: 8px;">
                            © 2026 GoWheelo Platforms • premium Car Rentals
                        </p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return true;
    } catch (error) {
        console.error("CRITICAL ERROR: Email send failed!");
        console.error("Error details:", error.message);
        return false;
    }
};
