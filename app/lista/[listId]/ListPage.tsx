'use client'

import Col from '@/app/components/layout/Col'
import { ListItem } from '../types'
import { addListItem, getListItems, removeListItem, setItemChecked } from '../serverActions'
import TextInput from '@/app/components/basic/textInput/TextInput'
import Button from '@/app/components/basic/button/Button'
import Row from '@/app/components/layout/Row'
import Link from 'next/link'
import { PropsWithChildren, useEffect, useState } from 'react'
import xMarkIcon from '@/app/icons/x-mark.svg'
import Checkbox from '@/app/components/basic/checkbox/Checkbox'
import clsx from 'clsx'
import Image from 'next/image'

// todo: code style

interface Props {
    listId: string
}

const Contr = (props: PropsWithChildren) => (
    <Col className='p-5 bg-white h-screen text-gray-600 gap-3'>
        {props.children}
    </Col>
)

type RemoveItemHandler = (itemId: string) => unknown
type ItemCheckChangeHandler = (itemId: string, checked: boolean) => unknown

function renderItems(
    items: ListItem[],
    onRemoveItem: RemoveItemHandler,
    onItemCheckToggle: ItemCheckChangeHandler
) {
    return items.map(item => {
        return (
            <Row key={item.id} className='p-2 gap-3 bg-violet-200 max-w-max justify-between'>
                <Checkbox value={item.checked} onChange={(checked) => onItemCheckToggle(item.id, checked)} />
                <div className='shrink'>{item.title as string ?? 'noname'}</div>
                <Image
                    src={xMarkIcon}
                    alt="X"
                    className="cursor-pointer"
                    onClick={() => onRemoveItem(item.id)}
                />
            </Row>
        )
    })
}

function buildValuesConcat(listItem: ListItem) {
    return [ listItem.title ].map(v => v + '').join(' ')
    // return Object.values(listItem).map(v => v + '').join(' ')
}

const emptyArr: unknown[] = []

export default function ListPage({listId}: Props)  {

    const [textFilter, setTextFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [listItems, setListItems] = useState(emptyArr as ListItem[])
    const [stale, setStale] = useState(true)
    const [itemTitle, setItemTitle] = useState('')
    const [showChecked, setShowChecked] = useState(true)

    useEffect(() => {
        if (!stale) return;
        setFetching(true)
        getListItems(listId)
            .then(_listItems => _listItems.map(listItem => ({
                ...listItem,
                valuesConcat: buildValuesConcat(listItem),
            })))
            .then(setListItems)
            .finally(() => (setFetching(false), setStale(false), setLoading(false)))
    }, [ listId, stale ])

    if (loading) {
        return (
            <Contr>
                <div className='text-xl'>Loading list data ...</div>
            </Contr>
        )
    }

    if (!listItems) {
        return (
            <Contr>
                <div className='text-xl'>Could not find list: { listId }</div>
            </Contr>
        )
    }

    const filteredItems = listItems
        .filter(item => (item.valuesConcat as string).includes(textFilter))
        .filter(item => showChecked || !item.checked)

    const handleRemoveItem = async (itemId: string) => {
        await removeListItem(itemId)
        setStale(true)
    }

    const addItem = async (formData: FormData): Promise<void> => {
        await addListItem(formData)
        setStale(true)
        setItemTitle('')
    }

    const handleItemCheckToggle = async (itemId: string, checked: boolean) => {
        setFetching(true)
        await setItemChecked(itemId, checked)
        setStale(true)
    }

    return (
        <Col className='p-5 bg-white h-screen bg-gray-100 text-gray-600 gap-3'>
            <Col>
                <Row className='text-md text-gray-500 gap-1'>
                    <Link href="/lista">Lists</Link>
                    <span>&gt;</span>
                </Row>
                <Row className='gap-4 items-end'>
                    <div className='text-4xl'>{listId}</div>
                    <span className={clsx('text-sm bg-amber-200 px-1 py-0.5 rounded', {'invisible': !fetching})}>Syncing</span>
                </Row>
            </Col>
            <Row className="gap-8 items-end">
                <TextInput label="Filter" value={textFilter} onChange={e => setTextFilter(e.target.value)} className="grow max-w-xl" />
            </Row>
            <Row className='gap-1'>
                <Checkbox value={showChecked} onChange={setShowChecked}/>
                <span>Show Checked</span>
            </Row>
            <Col className='min-h-60 gap-4'>
                <Row className="text-sm">Showing {filteredItems.length} of {listItems.length} items</Row>
                <Col className='min-h-60 gap-3'>
                    { renderItems(filteredItems, handleRemoveItem, handleItemCheckToggle) }
                </Col>
            </Col>
            <form action={addItem}>
                <div className='flex flex-col sm:flex-row sm:items-end gap-3 w-full items-stretch max-w-xl'>
                    <TextInput
                        className='hidden'
                        name="listId" 
                        value={listId}
                        readOnly
                    />
                    <TextInput
                        label="Title"
                        name="itemTitle"
                        value={itemTitle}
                        onChange={e => setItemTitle(e.target.value)}
                        className="grow"
                    />
                    <Button className='self-end sm:h-[42px]' disabled={!itemTitle} type="submit">Create Item</Button>
                </div>
            </form>
        </Col>
    )
}