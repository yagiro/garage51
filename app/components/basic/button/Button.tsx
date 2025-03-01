import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

const classes = {
    common: 'px-4 py-1.5 md:px-5 md:py-2 text-base text-white rounded whitespace-nowrap border-none shadow-sm',
    enabled: 'bg-amber-400 text-yellow-800 border-2 hover:bg-yellow-300',
    disabled: 'bg-gray-300 text-gray-600',
}

export default function Button(props: Props) {
    const className = clsx(twMerge(
        classes.common,
        props.disabled ? classes.disabled : classes.enabled,
        props.className,
    ))
    return (
        <button { ...props } className={ className } />
    )
}