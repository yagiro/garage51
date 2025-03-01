import { auth0 } from "./auth0";

export async function getUser() {
    const session = await auth0.getSession();
    return session?.user
}

export async function getUserEmail() {
    const user = await getUser()
    const email = user?.email
    if (!email) {
        throw Error('Missing user email')
    }
    return email
}
