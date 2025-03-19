import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { OutputHandler } from '../../../../src/infrastructure/io/output-handler'

describe('OutputHandler', () => {
    let outputHandler
    let mockStdoutWrite
    let mockStderrWrite

    beforeEach(() => {
        outputHandler = new OutputHandler()
        mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
        mockStderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('write should call process.stdout.write with the correct message', () => {
        const message = 'Test message'
        outputHandler.write(message)
        expect(mockStdoutWrite).toHaveBeenCalledWith(`${message}\n`)
    })

    test('writeError should call process.stderr.write with the correct message', () => {
        const errorMessage = 'Test error message'
        outputHandler.writeError(errorMessage)
        expect(mockStderrWrite).toHaveBeenCalledWith(`${errorMessage}\n`)
    })

    test('write should handle empty message', () => {
        const message = ''
        outputHandler.write(message)
        expect(mockStdoutWrite).toHaveBeenCalledWith('\n')
    })

    test('writeError should handle empty message', () => {
        const errorMessage = ''
        outputHandler.writeError(errorMessage)
        expect(mockStderrWrite).toHaveBeenCalledWith('\n')
    })
})