'use client'

import { useEffect, useState } from 'react'
import Col from '../../components/layout/Col'
import { addList, getAllLists, removeList } from '../serverActions'
import TextInput from '../../components/basic/textInput/TextInput'
import { List } from '../types'
import Row from '@/app/components/layout/Row'
import Link from 'next/link'
import Button from '@/app/components/basic/button/Button'
import XMark from '@/app/icons/x-mark.svg'
import clsx from 'clsx'
import briefcaseIcon from '@/app/icons/briefcase.svg'
import Image from 'next/image'

// todo: code style

interface Props {
    initialLists: List[]
}
interface ListInfoProps {
    list: List
    onRemove: () => void
}

function ListInfo(props: ListInfoProps) {
    const { list, onRemove } = props
    return (
        <Link href={`/lista/${list.id}`}>
            <Row key={list.id} className='gap-5 p-3 bg-violet-200 shadow-sm justify-between'>
                {list.name}
                <Image
                    src={XMark}
                    alt="X"
                    className='cursor-pointer'
                    onClick={ (e) => (onRemove(), e.preventDefault())}
                />
            </Row>
        </Link>
    )
}

const classes = {
    widthLimits: 'min-w-[150px] max-w-[300px]',
}

export default function Home(props: Props) {
    const [lists, setLists] = useState<List[]>(props.initialLists)
    const [isListsStale, setListsStale] = useState<boolean>(false)
    const [newListName, setNewListName] = useState<string>('')
    useEffect(() => {
        if (isListsStale) {
            getAllLists()
                .then(_lists => setLists(_lists))
                .catch(err => {
                    console.error('failed ot get all lists', err)
                    // todo: handl error (retry and remove finally block)
                })
                .finally(() => setListsStale(false))
        }
    }, [isListsStale])

    const addListAndRefetch = async () => {
        try {
            await addList(newListName)
            setListsStale(true)
            setNewListName('')
        } catch(err) {
            console.error('failed to add list', newListName, err)
        }
    }

    const removeListAndRefetch = async (listId: string) => {
        try {
            await removeList(listId)
            setListsStale(true)
        } catch(err) {
            console.error('failed to remove list', listId, err)
        }
    }
    
    return (
        <Col className="p-7 gap-10 bg-gray-100 text-gray-600 h-screen">
            <Col className="gap-7 self-stretch">
                <Row className={`text-2xl gap-3`}>
                    <Image src={briefcaseIcon} alt="Briefcase" />
                    <span>My Lists</span>
                </Row>
                <Col className={clsx("gap-3", classes.widthLimits)}>
                    { lists.map((list) => {
                        return (
                            <ListInfo
                                key={list.id}
                                list={list}
                                onRemove={() => removeListAndRefetch(list.id)}
                            />
                        )
                    }) }
                </Col>
            </Col>
            <Col className={clsx("gap-2", classes.widthLimits)}>
                <TextInput label="List Name" value={newListName} onChange={e => setNewListName(e.target.value)} />
                <Button disabled={!newListName} className={`p-2 text-lg font-bold cursor-pointer bg-blue-200`} onClick={addListAndRefetch}>
                    Create List
                </Button>
            </Col>
        </Col>
    )
}