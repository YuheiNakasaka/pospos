import {
  jsValueToSqlValidValue,
  sqlValueToJsValidValue
} from '../../src/utils/valueConverter'

describe('sqlValueToJsValidValue', () => {
  describe('when rawValue is null', () => {
    it('returns null', () => {
      expect(sqlValueToJsValidValue(null)).toBe(null)
    })
  })
  describe('when rawValue is Array', () => {
    it('returns {string} joined with comma', () => {
      expect(sqlValueToJsValidValue(['t', 'e', 's', 't'])).toBe('{t,e,s,t}')
    })
  })
  describe('when rawValue is the others', () => {
    it('returns string', () => {
      expect(sqlValueToJsValidValue("it's a test!")).toBe("it's a test!")
    })
  })
})

describe('jsValueToSqlValidValue', () => {
  describe('when value type is string', () => {
    it('returns string', () => {
      expect(jsValueToSqlValidValue('test', 'string')).toBe("'test'")
    })
  })
  describe('when value type is number', () => {
    it('returns number', () => {
      expect(jsValueToSqlValidValue(12345, 'number')).toBe(12345)
    })
  })
  describe('when value type is boolean', () => {
    it('returns number', () => {
      expect(jsValueToSqlValidValue(false, 'boolean')).toBe(false)
    })
  })
  describe('when value type is object', () => {
    describe('when value is null', () => {
      it('returns null', () => {
        expect(jsValueToSqlValidValue(null, 'object')).toBe(null)
      })
    })
    describe('when value is Array', () => {
      it('returns blob format representation', () => {
        expect(jsValueToSqlValidValue(['t', 'e', 's', 't'], 'object')).toBe(
          "'{t,e,s,t}'"
        )
      })
    })
  })
  describe('when value type is the others', () => {
    it('returns string', () => {
      expect(jsValueToSqlValidValue('abc', 'others')).toBe("'abc'")
    })
  })
})
