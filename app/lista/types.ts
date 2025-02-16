export enum ListSchemaFieldType {
    Text = 'Text',
    Number = 'Number',
}

export interface ListSchemaField {
    tempId: string
    name: string
    type: ListSchemaFieldType
}

export interface NewList {
    id: string
    name: string
    fields: ListSchemaField[]
}

export type List = NewList

export type NewListItem = Record<string, unknown> & {
    list_id: string
    checked?: boolean
}

export type ListItem = NewListItem & {
    id: string
}
