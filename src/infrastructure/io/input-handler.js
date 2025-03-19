import { EventEmitter } from 'events'

export class InputHandler extends EventEmitter {

    constructor({ readlineFactory }) {
        super()

        this.readline = readlineFactory.createInterface()

        this.setupEventListeners()
    }

    setupEventListeners() {
        this.readline.on('line', (line) => {
            if (line.trim() === '') {
                this.close()
                return
            }

            this.emit('data', line)
        })

        this.readline.on('close', () => {
            this.emit('end')
        })
    }

    close() {
        this.readline.close()
    }
}

