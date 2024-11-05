export interface Transformation {
  id: string
  type: string
  options: any
}

export const TransformationTypes = [
  'Mask',
  'Prefix',
  'Append',
  'Capitalize',
  'UpperCase',
  'LowerCase',
  'SubString',
]
