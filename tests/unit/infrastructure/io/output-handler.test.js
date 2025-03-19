import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals"
import { OutputHandler } from "../../../../src/infrastructure/io/output-handler.js"
import { Writable } from "stream"

describe("OutputHandler", () => {
    // Configuração para capturar saídas do console
    let stdoutSpy
    let stderrSpy

    beforeEach(() => {
        // Espionar stdout e stderr para verificar saídas
        stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => { })
        stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation(() => { })
    })

    afterEach(() => {
        // Restaurar os spies após cada teste
        stdoutSpy.mockRestore()
        stderrSpy.mockRestore()
    })

    describe("Default behavior (using process streams)", () => {
        test("should write messages to stdout by default", () => {
            // Arrange
            const handler = new OutputHandler()
            const message = "Test message"

            // Act
            handler.write(message)

            // Assert
            expect(stdoutSpy).toHaveBeenCalledWith(`${message}\n`)
        })

        test("should write error messages to stderr by default", () => {
            // Arrange
            const handler = new OutputHandler()
            const errorMessage = "Error occurred"

            // Act
            handler.writeError(errorMessage)

            // Assert
            expect(stderrSpy).toHaveBeenCalledWith(`${errorMessage}\n`)
        })
    })

    describe("Custom streams (for testing)", () => {
        test("should use injected streams when provided", () => {
            // Arrange - Create mock streams
            const mockOutput = { write: jest.fn() }
            const mockError = { write: jest.fn() }

            // Create handler with custom streams
            const handler = new OutputHandler({
                outputStream: mockOutput,
                errorStream: mockError,
            })

            // Act
            handler.write("Normal message")
            handler.writeError("Error message")

            // Assert
            expect(mockOutput.write).toHaveBeenCalledWith("Normal message\n")
            expect(mockError.write).toHaveBeenCalledWith("Error message\n")

            // Verify default streams weren't used
            expect(stdoutSpy).not.toHaveBeenCalled()
            expect(stderrSpy).not.toHaveBeenCalled()
        })
    })

    describe("Edge cases", () => {
        test("should handle empty messages", () => {
            // Arrange
            const handler = new OutputHandler()

            // Act
            handler.write("")
            handler.writeError("")

            // Assert
            expect(stdoutSpy).toHaveBeenCalledWith("\n")
            expect(stderrSpy).toHaveBeenCalledWith("\n")
        })

        test("should convert non-string messages to strings", () => {
            // Arrange
            const handler = new OutputHandler()
            const obj = { key: "value" }

            // Act
            handler.write(obj)

            // Assert - Object.toString() is called implicitly
            expect(stdoutSpy).toHaveBeenCalledWith(`${obj}\n`)
        })

        test("should handle null and undefined messages", () => {
            // Arrange
            const handler = new OutputHandler()

            // Act & Assert - Should not throw errors
            expect(() => {
                handler.write(null)
                handler.write(undefined)
                handler.writeError(null)
                handler.writeError(undefined)
            }).not.toThrow()

            // Verify correct string conversion
            expect(stdoutSpy).toHaveBeenCalledWith("null\n")
            expect(stdoutSpy).toHaveBeenCalledWith("undefined\n")
        })
    })

    describe("Real-world usage with streams", () => {
        test("should work with actual Writable streams", () => {
            // Arrange - Create actual Writable streams that capture output
            const outputs = []
            const errors = []

            const outputStream = new Writable({
                write(chunk, encoding, callback) {
                    outputs.push(chunk.toString())
                    callback()
                },
            })

            const errorStream = new Writable({
                write(chunk, encoding, callback) {
                    errors.push(chunk.toString())
                    callback()
                },
            })

            const handler = new OutputHandler({
                outputStream,
                errorStream,
            })

            // Act
            handler.write("Stream message")
            handler.writeError("Stream error")

            // Assert
            expect(outputs).toContain("Stream message\n")
            expect(errors).toContain("Stream error\n")
        })
    })
})

