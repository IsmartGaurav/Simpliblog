import {sendEmail} from "@/lib/resend";
import {createTRPCRouter, publicProcedure, protectedProcedure} from "@/server/api/trpc";
import {z} from "zod";
import VercelInviteUserEmail from "@/components/emails/VercelInvite";
import {emailRateLimiter} from "@/lib/rate-limit";
import { rateLimit } from "@/lib/rate-limit";

export const userRouter = createTRPCRouter({
    sendOnBoardingEmail : protectedProcedure.input(z.object({
        email: z.string().email()
    })).mutation(async ({ctx, input}) => {
        const identifier = input.email;
        const { success } = await emailRateLimiter.limit(ctx.auth.id);
        if (!success) {
            throw new Error("You Can Only Send 3 Emails Per Day");
        }
        const {email} = input;
        await sendEmail({
            to: [email],
            subject: "Welcome to our platform",
            react: VercelInviteUserEmail({ 
                username: "alanturing",
                userImage: `${process.env.NEXT_PUBLIC_APP_URL}/assets/vercel-user.png`,
                inviteByUsername: "Alan",
                inviteByEmail : "alan.turing@example.com",
                teamName: "Enginema",
                teamImage: `${process.env.NEXT_PUBLIC_APP_URL}/assets/vercel-team.png`,
                inviteLink: "https://vercel.com/teams/invite/foo",
                inviteFromIp:"IP_ADDRESS",
                inviteFromLocation:"San Fransico"
             }) as React.ReactElement,
        });
    }),
    sendInviteEmail: protectedProcedure.input(z.object({
        email: z.string().email("Invalid email address")  // Added email validation
    })).mutation(async ({ctx, input}) => {
        const identifier = input.email;
        const { success } = await emailRateLimiter.limit(ctx.auth.id);
        if (!success) {
            throw new Error("You Can Only Send 3 Emails Per Day");
        }
        const {email} = input;
        await sendEmail({
            to: [email],
            subject: "Welcome to our platform",
            react: VercelInviteUserEmail({ 
                username: "alanturing",
                userImage: `${process.env.NEXT_PUBLIC_APP_URL}/assets/vercel-user.png`,
                inviteByUsername: "Alan",
                inviteByEmail : "alan.turing@example.com",
                teamName: "Enginema",
                teamImage: `${process.env.NEXT_PUBLIC_APP_URL}/assets/vercel-team.png`,
                inviteLink: "https://vercel.com/teams/invite/foo",
                inviteFromIp:"IP_ADDRESS",
                inviteFromLocation:"San Fransico"
             }) as React.ReactElement,
        });
    }),
});