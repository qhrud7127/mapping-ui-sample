export interface Transformation {
  id: string
  type: string
  value: string
}

export const TransformationTypes = [
  'Mask',
  'Prefix',
  'Append',
  'Capitalize',
  'UpperCase',
  'LowerCase',
  'SubString',
  'ReplaceAll',
]
