import { firestore } from '@/app/lib/firestore'

const listsRef = firestore.collection('lista_lists')
const listItemsRef = firestore.collection('lista_list_items')

import { List, ListItem, NewList, NewListItem } from '../types'
import { QuerySnapshot } from '@google-cloud/firestore'
// import { List, ListItem } from '../types'

// todo: code style

type NewListDoc = NewList

interface ListDocData extends NewListDoc {
    id: string
}

const buildNewListDoc = (newList: NewList): NewListDoc => newList

function listFromDoc(docId: string, docData: ListDocData): List {
    return {
        id: docId,
        name: docData.name,
        fields: [], // todo: fix!!
    }
}

async function getAllLists(userEmail: string): Promise<List[]> {
    const querySnap = await listsRef.where('user_email', '==', userEmail).get()
    const lists: List[] = []
    querySnap.forEach(docSnap => {
        const docData = docSnap.data()
        if (docData) {
            const list = listFromDoc(docSnap.id, docData as ListDocData)
            lists.push(list)
        }
    })
    return lists
}

async function addList(newList: NewList): Promise<List> {
    const listDocToAdd = buildNewListDoc(newList)
    const docRef = listsRef.doc(newList.id)
    const docSnap = await docRef.get()
    if (!docSnap.exists) {
        docRef.set(listDocToAdd)
    } else {
        throw Error('List name already in use.')
    }
    return docSnap.data() as List
}

async function getList(listName: string): Promise<List> {
    const listDoc = await listsRef.doc(listName).get()
    return listDoc.data() as List
}

async function removeList(listId: string) {
    await listsRef.doc(listId).delete()
    const listItemsSnapshot = await listItemsRef.where('list_id', '==', listId).get()
    await deleteDocsInBatch(listItemsSnapshot)
}

async function deleteDocsInBatch(snapshot: QuerySnapshot) {
  const batch = firestore.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  });
  await batch.commit()
}

async function getListItems(listId: string): Promise<ListItem[]> {
    const snapshot = await listItemsRef.where('list_id', '==', listId).get()
    const listItems: ListItem[] = []
    snapshot.forEach(doc => {
        listItems.push({id: doc.id, ...doc.data()} as ListItem)
    });
    return listItems
}


async function addListItem(item: NewListItem): Promise<ListItem> {
    const itemDocRef = await listItemsRef.add(item)
    const addedItem = {
        ...item,
        id: itemDocRef.id,
    }
    return addedItem
}

async function removeListItem(itemId: string) {
    await listItemsRef.doc(itemId).delete()
}

async function setItemChecked(itemId: string, checked: boolean) {
    await listItemsRef.doc(itemId).set({ checked }, { merge: true })
}

const db = {
    getAllLists,
    addList,
    removeList,
    getList,
    getListItems,
    addListItem,
    removeListItem,
    setItemChecked,
}

export default db
