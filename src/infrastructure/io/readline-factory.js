import readline from 'readline'

export class ReadlineFactory {
    constructor() {
        this.inputStream = process.stdin
        this.outputStream = process.stdout
        this.terminal = false
    }

    createInterface() {
        return readline.createInterface({
            input: this.inputStream,
            output: this.outputStream,
            terminal: this.terminal,
        })
    }
}