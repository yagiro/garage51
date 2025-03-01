import Home from './components/Home'
import { Metadata } from 'next'
import { getAllLists } from './serverActions'
import { getUserEmail } from '../auth/idm';

export const metadata: Metadata = {
    title: "Lista",
    description: "Lists App",
};

export const dynamic = 'force-dynamic'

export default async function Page() {
    // todo: better design (use cookies to get user?)
    const userEmail = await getUserEmail()
    const lists = await getAllLists(userEmail)
    return (
        <Home initialLists={lists} />
    )
}
