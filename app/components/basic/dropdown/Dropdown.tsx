'use client'

import clsx from "clsx";
import Col from "@/app/components/layout/Col";
import Row from "@/app/components/layout/Row";

// todo: code style

export type DropdownOptionValue = string

export type DropdownChangeHandler = (value: DropdownOptionValue) => unknown;

export interface DropdownOption {
    value: DropdownOptionValue
    title: string
}

interface Props {
    options: DropdownOption[]
    value?: DropdownOptionValue
    onChange?: DropdownChangeHandler
    label?: string

}

export default function Dropdown(props: Props) {
    const { options, value, onChange, label } = props
    return (
        <Col className="gap-1">
            { !!label && <Col className="text-sm">{ label }</Col>}
            <Row className="border border-solid border-slate-300">
                { options.map(opt => {
                    return (
                        <div key={opt.value}
                            onClick={() => onChange?.(opt.value)}
                            className={clsx(
                                'text-sm px-2 py-1 cursor-pointer',
                                // { 'bg-slate-300': opt.value === value },
                                opt.value === value ? 'bg-slate-300' : 'bg-slate-100',
                            )}
                        >
                            {opt.title}
                        </div>
                    )
                }) }
            </Row>
        </Col>
    )
}
