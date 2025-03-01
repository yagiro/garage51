'use server'

import { List, ListItem, NewListDto } from './types'
import { revalidatePath } from 'next/cache'
import db from './lib/listaDb'
import { getUserEmail } from '../auth/idm'

export async function getAllLists(userEmail: string): Promise<List[]> {
    return db.getAllLists(userEmail)
}

export async function createList(newListDto: NewListDto): Promise<List> {
    const { id, name, fields } = newListDto
    if (!id || !name || fields.some(fld => !fld.name)) {
        console.error('bad request. cannot create list.', { id, name })
        throw Error('Invalid list arguments.')
    }
    const userEmail = await getUserEmail()
    const newList = { ...newListDto, user_email: userEmail }
    const createdList = await db.addList(newList)
    return createdList
}

export async function addListItem(formData: FormData): Promise<ListItem | undefined> {
    const listId = formData.get('listId') as string
    const formValues = Array.from(formData.entries())
    console.log({formValues})
    // todo: support lists with dynamic fields

    const itemTitle = formData.get('itemTitle')
    if (!listId || !itemTitle || typeof itemTitle !== 'string') {
        console.error('bad request. cannot add list item.')
        return;
    }

    const newItem = await db.addListItem({list_id: listId, title: itemTitle})
    return newItem
}

export async function removeListItem(itemId: string) {
    await db.removeListItem(itemId)
}

export async function setItemChecked(itemId: string, checked: boolean) {
    await db.setItemChecked(itemId, checked)
}

export async function removeList(listId: string) {
    await db.removeList(listId)
    revalidatePath('/lista')
}

export async function getList(listId: string): Promise<List> {
    return db.getList(listId)
}

export async function getListItems(listId: string): Promise<ListItem[]> {
    return await db.getListItems(listId)
}
