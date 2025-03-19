export class InputParser {

    parse(jsonString) {
        try {
            return JSON.parse(jsonString)
        } catch (error) {
            throw new Error(`Invalid input format: ${error.message}`)
        }
    }
}

