export class App {


    constructor({ container, inputHandler, operationController }) {
        this.container = container
        this.inputHandler = inputHandler
        this.operationController = operationController
    }

    start() {
        this.setupEventListeners()
        return this
    }

    setupEventListeners() {
        this.inputHandler.on('data', (line) => {
            this.operationController.handleInputLine(line)
        })

        this.inputHandler.on('end', () => {
            this.operationController.processAllOperations()
        })
    }
}