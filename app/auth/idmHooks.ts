import { useUser as useAuth0User } from '@auth0/nextjs-auth0'

export function useUser() {
    return useAuth0User()
}
