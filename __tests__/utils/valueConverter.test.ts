import { sqlValueToJsValidValue } from '../../src/utils/valueConverter'

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
