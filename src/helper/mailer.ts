// domain.com/verifytoken/asdsajdakjsdf
// domain.com/verifytoken?token=asdnsakd

import nodemailer from "nodemailer";
import User from "@/Models/userModel";
import bcrypt from "bcryptjs";

type SendEmailArgs = {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
};

export const sendEmail = async ({ email, emailType, userId }: SendEmailArgs) => {
  try {
    //create a hashed Token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswodExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS ,
      },
    });

    const linkPath =
      emailType === "VERIFY" ? "verifyemail" : "resetPassword";

    const mailOptions = {
        from:"kamran.ah005@gmail.com",
        to:email,
        subject:emailType === "VERIFY" ? "Verify Your Account" : "Reset Your Password",
        html:`<p>Click<a href="${process.env.domain}/${linkPath}?token=${encodeURIComponent(hashedToken)}"> here </a> to ${emailType==="VERIFY"?"verify your email":"reset your password"}
        </p>`

    }

    const mailresponse=await  transport.sendMail(mailOptions);
    return mailresponse

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Email failed";
    throw new Error(message);
  }
};
