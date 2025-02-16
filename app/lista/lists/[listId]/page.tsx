import { Metadata } from 'next'
import ListPage from './ListPage'
import { getList } from '@/app/lista/serverActions'

interface Params {
  listId: string
}

export async function generateMetadata(
    { params }: {params: Promise<Params>},
  ): Promise<Metadata> {
    const listId = (await params).listId
    const list = await getList(listId)
   
    return {
      title: (list?.name ?? 'Nope') + ' | List',
    }
  }

export default async function Page({params}: {params: Promise<Params>})  {
    const { listId } = await params
    return <ListPage listId={listId} />
}
