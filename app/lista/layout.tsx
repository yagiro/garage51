import Col from '@/app/components/layout/Col';
import { PropsWithChildren } from 'react';
import ProtectedServer from '../auth/ProtectedServer';

async function Layout({ children }: PropsWithChildren) {
    return (
        <Col className="p-3 md:p-5 gap-10">
            { children }
        </Col>
    )
}

export default async function ProtectedLayout(props: PropsWithChildren) {
    return (
        <ProtectedServer render={ () => <Layout {...props}/> } />
    )
}
