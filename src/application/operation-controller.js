export class OperationController {

    constructor({ container, outputHandler, ioParser }) {
        this.container = container
        this.outputHandler = outputHandler
        this.ioParser = ioParser
        this.operations = []
    }

    handleInputLine(line) {
        try {
            const data = this.ioParser.parseInput(line)
            this.operations.push(data)
        } catch (error) {
            this.outputHandler.writeError(`Error: ${error.message}`)
        }
    }

    processAllOperations() {
        for (const operations of this.operations) {
            this.processOperationBatch(operations)
        }
    }

    processOperationBatch(operations) {
        try {
            const scope = this.container.createScope()
            const { operationProcessor } = scope.cradle

            const results = operationProcessor.processOperations(operations)
            const output = this.ioParser.formatOutput(results)

            this.outputHandler.write(output)
        } catch (error) {
            this.outputHandler.writeError(`Error processing operations: ${error.message}`)
        }
    }
}