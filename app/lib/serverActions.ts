'use server'

import { getDbUser } from "./g51Db"

export async function getUser(userEmail: string) {
    // this is currently not in use
    return getDbUser(userEmail)
}
