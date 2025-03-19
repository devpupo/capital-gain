import { describe, expect, beforeEach, test } from '@jest/globals'
import { JsonParser } from '../../../../src/infrastructure/parsers/json-parser.js'

describe('JsonParser', () => {
    let jsonParser

    beforeEach(() => {
        jsonParser = new JsonParser()
    })

    describe('parseInput', () => {
        test('should parse valid JSON string', () => {
            const input = '{"key": "value"}'
            const result = jsonParser.parseInput(input)
            expect(result).toEqual({ key: 'value' })
        })

        test('should throw error if input is not a string', () => {
            const invalidInput = { key: 'value' }
            expect(() => jsonParser.parseInput(invalidInput)).toThrow('Invalid input: expected string but got object')
        })

        test('should throw error if input is invalid JSON string', () => {
            const invalidJson = '{"key": "value"'
            expect(() => jsonParser.parseInput(invalidJson)).toThrow()
        })
    })

    describe('formatOutput', () => {
        test('should format valid data to JSON string', () => {
            const data = { key: 'value' }
            const result = jsonParser.formatOutput(data)
            expect(result).toBe('{"key":"value"}')
        })

        test('should throw error if data cannot be formatted to JSON', () => {
            const invalidData = { circularReference: null }
            invalidData.circularReference = invalidData
            expect(() => jsonParser.formatOutput(invalidData)).toThrow('Failed to format output:')
        })
    })
})