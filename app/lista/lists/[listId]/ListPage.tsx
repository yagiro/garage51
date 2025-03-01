'use client'

import Col from '@/app/components/layout/Col'
import { List, ListItem } from '@/app/lista/types'
import { addListItem, getList, getListItems, removeListItem, setItemChecked } from '@/app/lista/serverActions'
import TextInput from '@/app/components/basic/textInput/TextInput'
import Button from '@/app/components/basic/button/Button'
import Row from '@/app/components/layout/Row'
import { useEffect, useState } from 'react'
import xMarkIcon from '@/app/icons/x-mark.svg'
import Checkbox from '@/app/components/basic/checkbox/Checkbox'
import clsx from 'clsx'
import Image from 'next/image'
import MainBreadcrumbs from '../../components/MainBreadcrumbs'
import Title from '@/app/lista/components/Title'

// todo: code style

interface Props {
    listId: string
}

type RemoveItemHandler = (itemId: string) => unknown
type ItemCheckChangeHandler = (itemId: string, checked: boolean) => unknown

function renderItems(
    items: ListItem[],
    onRemoveItem: RemoveItemHandler,
    onItemCheckToggle: ItemCheckChangeHandler
) {
    return items.map(item => {
        return (
            <Row key={item.id} className='p-2 gap-3 bg-yellow-200 text-neutral-700 max-w-max justify-between'>
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

    const [list, setList] = useState<List>()

    const [textFilter, setTextFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [listItems, setListItems] = useState(emptyArr as ListItem[])
    const [stale, setStale] = useState(true)
    const [itemTitle, setItemTitle] = useState('')
    const [showChecked, setShowChecked] = useState(true)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        getList(listId)
            .then(list => setList(list))
    }, [ listId ])

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
            <div className='text-xl'>Loading list data ...</div>
        )
    }

    if (!listItems) {
        return (
            <div className='text-xl'>Could not find list: { listId }</div>
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
        <Col className="gap-2 md:gap-3">
            <Row className="justify-between">
                <Col>
                    <MainBreadcrumbs />
                    <Row className='gap-4 items-end'>
                        <Title>{ list?.name ?? listId}</Title>
                        <span className={clsx('text-sm bg-amber-200 px-1 py-0.5 rounded', {'invisible': !fetching})}>Syncing</span>
                    </Row>
                </Col>
                <Col>
                    <Row className='gap-1' onClick={ () => setShowFilters(prev => !prev) }>
                        <Checkbox value={showFilters}/>
                        <span>Filters</span>
                    </Row>
                </Col>
            </Row>
            <Col className={ clsx('filters bg-indigo-100 p-2 gap-2 rounded', {'hidden': !showFilters}) }>
                <Row className="items-end">
                    <TextInput label="Filter" value={textFilter} onChange={e => setTextFilter(e.target.value)} className="grow max-w-xl" />
                </Row>
                <Row className='gap-1 text-sm items-center'>
                    <Checkbox value={showChecked} onChange={setShowChecked}/>
                    <span>Show Completed</span>
                </Row>
                <Row className="text-sm">Showing {filteredItems.length} of {listItems.length} items</Row>
            </Col>
            <Col className='gap-4 items-start'>
                <Col className={ clsx(
                    'gap-3 overflow-y-auto pr-4',
                    showFilters ? 'max-h-[40vh]' : 'max-h-[55vh]',
                ) }>
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