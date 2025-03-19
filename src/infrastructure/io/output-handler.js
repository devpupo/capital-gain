export class OutputHandler {

    constructor() {
        this.outputStream = process.stdout
        this.errorStream = process.stderr
    }

    write(message) {
        this.outputStream.write(`${message}\n`)
    }

    writeError(message) {
        this.errorStream.write(`${message}\n`)
    }
}

