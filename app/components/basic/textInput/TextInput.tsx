import Row from '@/app/components/layout/Row'
import Col from '@/app/components/layout/Col'
import clsx from 'clsx'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    inputClass?: string;
}

export default function TextInput(props: TextInputProps) {
    const {
        name,
        label = name,
        className,
        inputClass,
        ...inputProps
    } = props
    return (
        <Col className={clsx(`text-input`, className)} data-field={name}>
            <Row className="text-sm">{ label }</Row>
            <input
                { ...inputProps }
                name={name}
                className={clsx("text-black p-2 border border-teal-700 rounded", inputClass)}
            ></input>
        </Col>
    )
}
