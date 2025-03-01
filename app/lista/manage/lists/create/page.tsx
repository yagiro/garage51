'use client'

import Button from "@/app/components/basic/button/Button";
import Dropdown, { DropdownOption } from "@/app/components/basic/dropdown/Dropdown";
import TextInput from "@/app/components/basic/textInput/TextInput";
import Col from "@/app/components/layout/Col";
import Row from "@/app/components/layout/Row";
import MainBreadcrumbs from "@/app/lista/components/MainBreadcrumbs";
import Title from "@/app/lista/components/Title";
import { createList } from "@/app/lista/serverActions";
import { useEffect, useState } from "react";
import xMarkIcon from '@/app/icons/x-mark.svg'
import Image from "next/image";
import { ListSchemaField, ListSchemaFieldType } from "@/app/lista/types";
import { randomUUID } from "crypto";

// todo: code style

const fieldTypeOptions: DropdownOption[] = [
    // todo: generate this dynamically
    { value: ListSchemaFieldType.Text, title: ListSchemaFieldType.Text },
    { value: ListSchemaFieldType.Number, title: ListSchemaFieldType.Number },
]

function convertNameToId(listName: string) {
    return listName.toLowerCase().replace(/\s/g, '_')
}

function renderFields(
    fields: ListSchemaField[],
    onFieldChange: (field: ListSchemaField) => unknown,
    onFieldRemove: (fieldName: string) => unknown,
) {
    return fields.map(fld => {
        return (
            <Row key={fld.tempId} className="relative items-center gap-3 p-4 pr-10 flex-wrap bg-white shadow-sm shadow-gray-200">
                <Image src={xMarkIcon} alt="X" className="absolute -top-[10px] right-[2px] mt-[14px] cursor-pointer" onClick={() => onFieldRemove(fld.tempId)} />
                <Col className="gap-2 items-start">
                    <TextInput value={fld.name} onChange={e => onFieldChange({ ...fld, name: e.target.value })} />
                    <Dropdown
                        // label="Type"
                        value={fld.type}
                        options={fieldTypeOptions}
                        onChange={fldType => onFieldChange({ ...fld, type: fldType as ListSchemaFieldType })}
                    />
                </Col>
            </Row>
        )
    })
}

function getRandomUuid() {
    /*
    This function is invoked once on the server on initial SSR (used to create initialFields),
    and later, on the browser (on user interaction).
    */
    return randomUUID?.() ?? window.crypto.randomUUID()
}

const createNewField = (name = '', type = ListSchemaFieldType.Text): ListSchemaField => ({
    tempId: getRandomUuid(),
    name,
    type,
})

const initialFields = [ createNewField('Title') ]

function areFieldValid(fields: ListSchemaField[]): boolean {
    if (!fields.length) return false
    const fieldNamesSet = new Set(fields.map(fld => fld.name.trim()))
    if (fieldNamesSet.size != fields.length) return false
    if (fieldNamesSet.has('')) return false
    return true
}

export default function NewListPage() {
    const [listId, setListId] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [listName, setListName] = useState('')
    const [fields, setFields] = useState<ListSchemaField[]>(initialFields)

    useEffect(() => { setListId(convertNameToId(listName)) }, [listName, setListId])

    const fieldsValid = areFieldValid(fields)
    const valid = !!listName && !!listId && fieldsValid
    const addField = () => {
        setFields(_fields => _fields.concat([createNewField()]))
    }

    const onFieldChange = (updatedField: ListSchemaField) => {
        setFields(_fields => _fields
            .map(fld => fld.tempId !== updatedField.tempId ? fld
                : { ...fld, ...updatedField }
            )
        )
    }

    const onFieldRemove = (fieldId: string) => {
        setFields(_fields => _fields
            .filter(fld => fld.tempId !== fieldId)
        )
    }

    const submit = async () => {
        setErrorMessage('')
        const newList = {
            id: listId,
            name: listName,
            fields,
        }
        try {
            await createList(newList)
            window.location.href = `/lista/lists/${newList.id}`
        }
        catch(err) {
            console.error('Failed to create list', { newList }, err)
            const errMsg = (err as Error).message
            setErrorMessage(errMsg)
        }
    } 

    return (
        <Col className="gap-3 items-start">
            <Col>
                <MainBreadcrumbs />
                <Title>Create List</Title>
            </Col>
            <Row className="gap-3 flex-wrap">
                <TextInput label="Name" value={listName} onChange={e => setListName(e.target.value)} />
                <TextInput label="ID" value={listId} onChange={e => setListId(e.target.value)} />
            </Row>
            <Button onClick={addField}>Add Field</Button>
            <Col className="gap-4">
                { renderFields(fields, onFieldChange, onFieldRemove) }
            </Col>
            <Button
                onClick={submit}
                disabled={!valid}
            >Create List</Button>
            { !!errorMessage && <Col className="p-3 bg-red-100 rounded border-2 border-red-600 text-red-800">
                { errorMessage }
            </Col>}
        </Col>
    )
}
