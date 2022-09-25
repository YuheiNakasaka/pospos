export enum QueryType {
  SELECT = 'select',
  OTHER = 'other'
}

export type Query = {
  type: QueryType
}
