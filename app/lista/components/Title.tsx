import { PropsWithChildren } from "react";

export default function Title({ children }: PropsWithChildren) {
    return (
        <div className='text-2xl md:text-4xl'>{ children }</div>
    )
}
