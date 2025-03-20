import { describe, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { ReadlineFactory } from '../../../../src/infrastructure/io/readline-factory.js'
import readline from 'readline'

describe('ReadlineFactory', () => {
    let mockCreateInterface
    let mockInterface

    beforeEach(() => {
        mockInterface = {
            on: jest.fn(),
            close: jest.fn(),
            question: jest.fn(),
        }

        mockCreateInterface = jest.fn().mockReturnValue(mockInterface)
        jest.spyOn(readline, 'createInterface').mockImplementation(mockCreateInterface)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createInterface', () => {
        it('should call readline.createInterface with default parameters', () => {
            const readlineFactory = new ReadlineFactory()
            const result = readlineFactory.createInterface()

            expect(readline.createInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: process.stdout,
                terminal: false,
            })
            expect(result).toBe(mockInterface)
        })

        it('should use custom input stream if provided', () => {
            const readlineFactory = new ReadlineFactory()
            const customInputStream = { on: jest.fn() }

            readlineFactory.inputStream = customInputStream

            readlineFactory.createInterface()

            expect(readline.createInterface).toHaveBeenCalledWith({
                input: customInputStream,
                output: process.stdout,
                terminal: false,
            })
        })

        it('should use custom output stream if provided', () => {
            const readlineFactory = new ReadlineFactory()
            const customOutputStream = { write: jest.fn() }

            readlineFactory.outputStream = customOutputStream

            readlineFactory.createInterface()

            expect(readline.createInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: customOutputStream,
                terminal: false,
            })
        })

        it('should use custom terminal setting if provided', () => {
            const readlineFactory = new ReadlineFactory()
            readlineFactory.terminal = true 

            readlineFactory.createInterface()

            expect(readline.createInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: process.stdout,
                terminal: true,
            })
        })
    })
})