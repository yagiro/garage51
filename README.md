This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Data
```
lists: collection<list>
    id: string
    title: string
    ownerId: string (fk -> users.id)
    collaborators: collaborator[]
        userId: string (fk -> users.id)
        role: string (read/write)
    items: subcollection<item>
        id: string
        title: string
        checked: boolean
users: collection<user>
    id: string
    listIds: string[] (fk -> lists.id)
```

chatgpt convo about firebase subcollections:
https://chatgpt.com/c/67af453e-ac70-800a-8a95-51e06f85ee50

## Firestore

Manage:  
https://console.cloud.google.com/firestore/databases/garage51-db/data/panel/lista_lists/feature_ideas?inv=1&invt=AbqxGg&project=garage51  

Docs:  
https://firebase.google.com/docs/firestore/query-data/queries  

https://googleapis.dev/nodejs/firestore/latest/  

## Auth0

quickstart v2
https://auth0.com/docs/quickstart/webapp/nextjs/interactive

auth0 sdk  
https://github.com/auth0/nextjs-auth0

Post-user Registration Trigger  
https://auth0.com/docs/customize/actions/explore-triggers/signup-and-login-triggers/post-user-registration-trigger#notify-slack-when-a-new-user-registers

Update a user's user_metadata  
https://github.com/auth0/node-auth0/blob/master/EXAMPLES.md#update-a-users-user_metadata


## TODO

### TODO: Instead of using email as foreign key to a user, do the following:
1. create an endpoint 'onUserRegistered'.
2. have this endpoint be triggered by auth0 Post-user Registration Trigger (see ref below)
3. This endpoint should update the user's metadata

> Ref:  
> Post-user Registration Trigger  
> https://auth0.com/docs/customize/actions/explore-triggers/signup-and-login-triggers/post-user-registration-trigger#notify-slack-when-a-new-user-registers  
> 
> Update a user's user_metadata  
> https://github.com/auth0/node-auth0/blob/master/EXAMPLES.md#update-a-users-user_metadata  


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Garage51

### Heroicons
https://github.com/tailwindlabs/heroicons?tab=readme-ov-file
