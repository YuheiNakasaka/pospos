export const sqlValueToJsValidValue = (rawValue: any): any => {
  if (rawValue === null || rawValue === undefined) {
    return null
  } else if (typeof rawValue === 'object' && Array.isArray(rawValue)) {
    return `{${rawValue.join(',')}}`
  }
  return `${rawValue}`
}

export const jsValueToSqlValidValue = (
  value: any,
  type: string
): string | number | boolean | null => {
  switch (type) {
    case 'string':
      return `'${value}'`
    case 'number':
      return Number(value)
    case 'boolean':
      return value === true ? true : false
    case 'object':
      if (value === null) return null
      if (Array.isArray(value)) return `'{${value.join(',')}}'`
      return `'${value}'`
    default:
      return `'${value}'`
  }
}