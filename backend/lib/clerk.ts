import {createClerkClient} from '@clerk/backend'

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export const createClerkSession = async(userId: string, metadata?: Record<string, any>) => {
    try{
        let clerkUser;
        try{
            clerkUser = await clerkClient.users.getUser(userId);
        }
        catch{
            throw new Error('User id not found so session cannot be created');
        }

        const session = await clerkClient.sessions.createSession({
            userId: clerkUser.id,
            metadata: {
                provider: metadata?.provider || 'email',
                loginAt: new Date().toISOString(),
                ...metadata,
            }
    })
    return session;
    }
}