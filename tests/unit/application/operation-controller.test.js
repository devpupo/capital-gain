import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { OperationController } from '../../../src/application/operation-controller.js'

describe('OperationController', () => {
    let containerMock
    let outputHandlerMock
    let ioParserMock
    let operationController

    beforeEach(() => {
        containerMock = {
            createScope: jest.fn(() => ({
                cradle: {
                    operationProcessor: {
                        processOperations: jest.fn(),
                    },
                },
            })),
        }

        outputHandlerMock = {
            write: jest.fn(),
            writeError: jest.fn(),
        }

        ioParserMock = {
            parseInput: jest.fn(),
            formatOutput: jest.fn(),
        }

        operationController = new OperationController({
            container: containerMock,
            outputHandler: outputHandlerMock,
            ioParser: ioParserMock,
        })
    })

    describe('handleInputLine', () => {
        test('should parse input and add to operations', () => {
            const inputLine = '{"operation": "buy", "unit-cost": 10, "quantity": 100}'
            const parsedData = { operation: 'buy', 'unit-cost': 10, quantity: 100 }
            ioParserMock.parseInput.mockReturnValue(parsedData)

            operationController.handleInputLine(inputLine)

            expect(ioParserMock.parseInput).toHaveBeenCalledWith(inputLine)
            expect(operationController.operations).toContain(parsedData)
        })

        test('should handle parsing error and write error message', () => {
            const inputLine = 'invalid-json'
            const error = new Error('Invalid JSON')
            ioParserMock.parseInput.mockImplementation(() => {
                throw error
            })

            operationController.handleInputLine(inputLine)

            expect(ioParserMock.parseInput).toHaveBeenCalledWith(inputLine)
            expect(outputHandlerMock.writeError).toHaveBeenCalledWith(`Error: ${error.message}`)
        })
    })

    describe('processAllOperations', () => {
        test('should process all operations', () => {
            const operations = [
                { operation: 'buy', 'unit-cost': 10, quantity: 100 },
                { operation: 'sell', 'unit-cost': 20, quantity: 50 },
            ]
            operationController.operations = operations

            operationController.processAllOperations()

            expect(containerMock.createScope).toHaveBeenCalledTimes(operations.length)
        })
    })

    describe('processOperationBatch', () => {
        test('should process a batch of operations and write output', () => {
            const operations = [
                { operation: 'buy', 'unit-cost': 10, quantity: 100 },
                { operation: 'sell', 'unit-cost': 20, quantity: 50 },
            ]
            const results = [{ tax: 0 }, { tax: 1000 }]
            const formattedOutput = '[{"tax":0},{"tax":1000}]'

            const scopeMock = {
                cradle: {
                    operationProcessor: {
                        processOperations: jest.fn().mockReturnValue(results),
                    },
                },
            }
            containerMock.createScope.mockReturnValue(scopeMock)
            ioParserMock.formatOutput.mockReturnValue(formattedOutput)

            operationController.processOperationBatch(operations)

            expect(containerMock.createScope).toHaveBeenCalled()
            expect(scopeMock.cradle.operationProcessor.processOperations).toHaveBeenCalledWith(operations)
            expect(ioParserMock.formatOutput).toHaveBeenCalledWith(results)
            expect(outputHandlerMock.write).toHaveBeenCalledWith(formattedOutput)
        })

        test('should handle processing error and write error message', () => {
            const operations = [
                { operation: 'buy', 'unit-cost': 10, quantity: 100 },
                { operation: 'sell', 'unit-cost': 20, quantity: 50 },
            ]
            const error = new Error('Processing error')

            const scopeMock = {
                cradle: {
                    operationProcessor: {
                        processOperations: jest.fn().mockImplementation(() => {
                            throw error
                        }),
                    },
                },
            }
            containerMock.createScope.mockReturnValue(scopeMock)

            operationController.processOperationBatch(operations)

            expect(containerMock.createScope).toHaveBeenCalled()
            expect(scopeMock.cradle.operationProcessor.processOperations).toHaveBeenCalledWith(operations)
            expect(outputHandlerMock.writeError).toHaveBeenCalledWith(`Error processing operations: ${error.message}`)
        })
    })
})