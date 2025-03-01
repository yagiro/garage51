import { PropsWithChildren } from 'react';
import ProtectedServer from '../auth/ProtectedServer';
import { getUserEmail } from '../auth/idm';
import Col from '../components/layout/Col';

const admins = new Set([
    'yagiro@gmail.com',
])

async function isAuthorized() {
    const userEmail = await getUserEmail()
    return admins.has(userEmail)
}

function DeniedAccessView() {
    return (
        <div className="flex text-9xl w-full h-[400px] justify-center items-center">
            401
        </div>
    )
}

async function AdminLayout(props: PropsWithChildren) {
    const authorized = await isAuthorized()
    if (!authorized) return <DeniedAccessView />
    return (
        <Col className="p-3 md:p-5 gap-10">
            { props.children }
        </Col>
    )
}

export default async function ProtectedLayout(props: PropsWithChildren) {
    return (
        <ProtectedServer render={ () => <AdminLayout {...props}/> } />
    )
}
