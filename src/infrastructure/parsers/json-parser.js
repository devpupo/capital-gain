export class JsonParser {

    parseInput(data) {
        if (typeof data !== 'string') {
            throw new Error(`Invalid input: expected string but got ${typeof data}`);
        }

        return JSON.parse(data);
    }

    formatOutput(data) {
        try {
            return JSON.stringify(data);
        } catch (error) {
            throw new Error(`Failed to format output: ${error.message}`);
        }
    }
}