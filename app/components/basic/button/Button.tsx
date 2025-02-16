import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

const classes = {
    common: 'px-2 py-1 md:px-4 md:py-2 text-white rounded whitespace-nowrap border-2',
    enabled: 'bg-yellow-50 text-yellow-800 border-2 border-yellow-800 hover:bg-yellow-300',
    disabled: 'bg-gray-300 text-gray-600 border-gray-300',
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