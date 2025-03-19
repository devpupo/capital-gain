import { describe, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { ReadlineFactory } from '../../../../src/infrastructure/io/readline-factory.js'
import readline from 'readline'

jest.mock('readline')

describe('ReadlineFactory', () => {
    let readlineFactory
    let mockCreateInterface
    let mockInterface

    beforeEach(() => {
        mockInterface = {
            on: jest.fn(),
            close: jest.fn(),
            question: jest.fn()
        }

        mockCreateInterface = jest.fn().mockReturnValue(mockInterface)
        readline.createInterface = mockCreateInterface

        readlineFactory = new ReadlineFactory()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('constructor', () => {
        it('should initialize with default values', () => {
            expect(readlineFactory.inputStream).toBe(process.stdin)
            expect(readlineFactory.outputStream).toBe(process.stdout)
            expect(readlineFactory.terminal).toBe(false)
        })
    })

    describe('createInterface', () => {
        it('should call readline.createInterface with correct parameters', () => {
            const result = readlineFactory.createInterface()

            expect(mockCreateInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            })
            expect(result).toBe(mockInterface)
        })

        it('should use custom input stream if provided', () => {
            const customInputStream = { on: jest.fn() }
            readlineFactory.inputStream = customInputStream

            readlineFactory.createInterface()

            expect(mockCreateInterface).toHaveBeenCalledWith({
                input: customInputStream,
                output: process.stdout,
                terminal: false
            })
        })

        it('should use custom output stream if provided', () => {
            const customOutputStream = { write: jest.fn() }
            readlineFactory.outputStream = customOutputStream

            readlineFactory.createInterface()

            expect(mockCreateInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: customOutputStream,
                terminal: false
            })
        })

        it('should use custom terminal setting if provided', () => {
            readlineFactory.terminal = true

            readlineFactory.createInterface()

            expect(mockCreateInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: process.stdout,
                terminal: true
            })
        })
    })

    describe('dependency injection capability', () => {
        it('should allow all properties to be customized', () => {
            const customInputStream = { on: jest.fn() }
            const customOutputStream = { write: jest.fn() }
            readlineFactory.inputStream = customInputStream
            readlineFactory.outputStream = customOutputStream
            readlineFactory.terminal = true

            readlineFactory.createInterface()

            expect(mockCreateInterface).toHaveBeenCalledWith({
                input: customInputStream,
                output: customOutputStream,
                terminal: true
            })
        })
    })
})