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
            <Row key={fld.tempId} className="gap-3 p-3 flex-wrap bg-slate-200">
                <Image src={xMarkIcon} alt="X" className="mt-[14px] cursor-pointer" onClick={() => onFieldRemove(fld.tempId)} />
                <TextInput label="Name" value={fld.name} onChange={e => onFieldChange({ ...fld, name: e.target.value })} />
                <Dropdown
                    label="Type"
                    value={fld.type}
                    options={fieldTypeOptions}
                    onChange={fldType => onFieldChange({ ...fld, type: fldType as ListSchemaFieldType })}
                />
            </Row>
        )
    })
}

const createNewField = (name = '', type = ListSchemaFieldType.Text): ListSchemaField => ({
    tempId: window.crypto.randomUUID(),
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
        }
    } 

    return (
        <Col className="gap-5 items-start">
            <MainBreadcrumbs />
            <Title>Create List</Title>
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
        </Col>
    )
}
