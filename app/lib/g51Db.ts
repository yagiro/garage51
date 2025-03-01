import { firestore } from '@/app/lib/firestore'

interface DbUser {
    // todo: add relevant data (email, etc..)
    id: string;
}

const g51UsersRef = firestore.collection('g51_users')

export async function getDbUser(userEmail: string): Promise<DbUser> {
    // todo: code style
    // todo: create AppServerError class
    const querySnap = await g51UsersRef
        .where('email', '==', userEmail).get()

    if (querySnap.size == 0) {
        throw Error('Email not found: ' + userEmail)
    }
    if (querySnap.size > 1) {
        throw Error('Email ambigous: ' + userEmail)
    }
    let user: DbUser | undefined
    querySnap.forEach(docSnap => {
        
        const docData = docSnap.data()
        if (docData) {
            user = docData as DbUser
            user.id = docSnap.id
        }
    })
    if (!user) {
        throw Error('User not found: ' + userEmail)
    }
    return user
}
