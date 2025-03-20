import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { InputHandler } from '../../../../src/infrastructure/io/input-handler.js'

describe('InputHandler', () => {
    let inputHandler
    const mockReadlineInterface = {
        on: jest.fn(),
        close: jest.fn(),
    }

    const mockReadlineFactory = {
        createInterface: jest.fn().mockReturnValue(mockReadlineInterface),
    }

    beforeEach(() => {
        jest.clearAllMocks()
        inputHandler = new InputHandler({
            readlineFactory: mockReadlineFactory,
        })
    })

    test('should create readline interface using factory', () => {
        expect(mockReadlineFactory.createInterface).toHaveBeenCalled()
    })

    test('should emit data event when line is received', () => {
        const lineCallback = mockReadlineInterface.on.mock.calls.find((call) => call[0] === 'line')[1]
        const emitSpy = jest.spyOn(inputHandler, 'emit')

        lineCallback('test data')

        expect(emitSpy).toHaveBeenCalledWith('data', 'test data')
    })

    test('should close readline when empty line is received', () => {
        const lineCallback = mockReadlineInterface.on.mock.calls.find((call) => call[0] === 'line')[1]

        lineCallback('')

        expect(mockReadlineInterface.close).toHaveBeenCalled()
    })
})