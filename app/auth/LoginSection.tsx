import Col from '@/app/components/layout/Col'
import Button from '@/app/components/basic/button/Button'
import { authRoutes } from "./common"
import G51Logo from '@/app/components/G51Logo'

// todo: add returnTo (according to prop OR current app base route [and each app route will be in auth0 whitelist])

// const returnTo = '/lista/authcb/login'
// &returnTo=${returnTo}

export default async function LoginSection() {
    return (
        <Col className="h-screen justify-center p-5 gap-6 items-center w-full">
            <G51Logo/>
            <Col>Se voui entrare,</Col>
            <Col className="gap-2 items-center">
                <a href={ authRoutes.signup }>
                    <Button className="w-[100px]">Sign up</Button>
                </a>
                <a href={ authRoutes.login }>
                    <Button className="w-[100px]">Log in</Button>
                </a>
            </Col>
        </Col>
    )
}
