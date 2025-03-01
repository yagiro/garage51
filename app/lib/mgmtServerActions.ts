'use server'

import { deleteFieldInCollection, updateFieldInCollection } from "./firestoreMgmtUtils"

export async function connectAllListsToYagiro() {
    updateFieldInCollection(
        'lista_lists',
        'user_email',
        'yagiro@gmail.com'
    )
}

export async function deleteUserIdFromAllLists() {
    deleteFieldInCollection(
        'lista_lists',
        'user_id'
    )
}
