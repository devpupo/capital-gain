export class App {

    constructor({
        container,
        inputHandler,
        outputHandler,
        inputParser,
        outputParser
    }) {
        this.container = container
        this.inputHandler = inputHandler
        this.outputHandler = outputHandler
        this.inputParser = inputParser
        this.outputParser = outputParser

        this.operations = []
    }

    start() {
        this.setupEventListeners()
        return this
    }

    setupEventListeners() {
        this.inputHandler.on('data', (line) => {
            try {
                const jsonData = this.inputParser.parse(line)
                this.operations.push(jsonData)
            } catch (error) {
                this.outputHandler.writeError(`Error: ${error.message}`)
            }
        })

        this.inputHandler.on('end', () => {
            this.processOperations()
        })
    }

    processOperations() {
        for (const operations of this.operations) {
            try {
                const scope = this.container.createScope()
                const { operationProcessor } = scope.cradle

                const results = operationProcessor.processOperations(operations)
                const output = JSON.stringify(results)

                this.outputHandler.write(output)
            } catch (error) {
                this.outputHandler.writeError(`Error processing operations: ${error.message}`)
            }
        }
    }
}