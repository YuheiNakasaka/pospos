export enum QueryType {
  SELECT = 'select',
  OTHER = 'other',
  INVALID = 'invalid'
}

export type Query = {
  type: QueryType
  content: string
}
