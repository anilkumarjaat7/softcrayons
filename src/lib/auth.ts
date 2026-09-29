import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP, magicLink } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { 
    defaultStatements, 
    adminAc as defaultAdminAc 
} from "better-auth/plugins/admin/access";
import { prisma } from "./prisma";
import { sendEmail, getPasswordResetEmailTemplate } from "./email";
import { userExists } from "./userExist";

const ac = createAccessControl(defaultStatements);

const ADMIN = ac.newRole({
    ...defaultAdminAc.statements,
});

const STUDENT = ac.newRole({
    user: [],
    session: [],
});

const INSTRUCTOR = ac.newRole({
    user: [],
    session: [],
});

const COUNSELOR = ac.newRole({
    user: [],
    session: [],
});

const HR = ac.newRole({
    user: [],
    session: [],
});

const CONTENT_WRITER = ac.newRole({
    user: [],
    session: [],
});

const AGENT = ac.newRole({
    user: [],
    session: [],
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            console.log("[Auth] Sending password reset email to:", user.email);
            const emailTemplate = getPasswordResetEmailTemplate(url);
            void sendEmail({
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text,
            }).then(() => {
                console.log("[Auth] Password reset email sent successfully");
            }).catch((err) => {
                console.error("[Auth] Failed to send password reset email:", err);
            });
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`[Auth] Password for user ${user.email} has been reset.`);
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            console.log("[Auth] Sending verification email to:", user.email);
            try {
                await sendEmail({
                    to: user.email,
                    subject: "Verify your email address",
                    text: `Click the link to verify your email: ${url}`,
                });
                console.log("[Auth] Verification email sent successfully");
            } catch (err) {
                console.error("[Auth] Failed to send verification email:", err);
            }
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: false,
                input: true,
                returned: true,
            },
        },
    },
    plugins: [
        admin({
            defaultRole: "STUDENT",
            ac,
            roles: {
                ADMIN,
                STUDENT,
                INSTRUCTOR,
                COUNSELOR,
                HR,
                CONTENT_WRITER,
                AGENT,
            },
        }),
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                console.log("[Auth] OTP request - type:", type, "email:", email);
                if (type === "sign-in") {
                    const exists = await userExists(email);
                    console.log("[Auth] User exists check:", exists);
                    if (exists) {
                        try {
                            await sendEmail({
                                to: email,
                                subject: "Your sign-in OTP",
                                text: `Your OTP for sign-in is: ${otp}`,
                            });
                            console.log("[Auth] OTP email sent successfully to:", email);
                        } catch (err) {
                            console.error("[Auth] Failed to send OTP email:", err);
                        }
                    }
                }
            },
        }),
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                console.log("[Auth] Magic link request for:", email);
                const exists = await userExists(email);
                console.log("[Auth] User exists check:", exists);
                if (exists) {
                    try {
                        await sendEmail({
                            to: email,
                            subject: "Your magic sign-in link",
                            text: `Click the link to sign in: ${url}`,
                        });
                        console.log("[Auth] Magic link email sent successfully to:", email);
                    } catch (err) {
                        console.error("[Auth] Failed to send magic link email:", err);
                    }
                }
            },
        }),
    ],
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        process.env.BETTER_AUTH_URL || "",
        "https://softcrayons.vercel.app",
    ].filter(Boolean),
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;