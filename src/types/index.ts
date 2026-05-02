export type FieldType = 'string' | 'number' | 'boolean' | 'date'

export interface Field {
  id: string
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
}

export interface Entity {
  id: string
  name: string
  description?: string
  fields: Field[]
}

export interface DataRow {
  [key: string]: unknown
}

export interface DataQueryResponse {
  rows: DataRow[]
}

export interface AIModelResponse {
  entity: string
  model: string
  description?: string
  fields?: Field[]
}

export interface PromptModelResponse {
  entity: string
  model: string
  description?: string
}
