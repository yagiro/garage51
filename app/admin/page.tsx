'use client'

import Button from "../components/basic/button/Button";
import Col from "../components/layout/Col";
import { connectAllListsToYagiro, deleteUserIdFromAllLists } from "../lib/mgmtServerActions";

export default function AdminPage() {
    return (
        <Col className="gap-4">
            <Col className="text-lg">
                Admin Client Comp
            </Col>
            <Col className="gap-2">
                <Button onClick={ connectAllListsToYagiro }>
                    Update all lists
                </Button>
                <Button onClick={ deleteUserIdFromAllLists }>
                    Delete userId from all lists
                </Button>
            </Col>
        </Col>
    )
}
