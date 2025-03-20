export class JsonParser {

    parseInput(data) {
        if (typeof data !== 'string') {
            throw new Error(`Invalid input: expected string but got ${typeof data}`);
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Invalid input json: ${error.message}`);
        }
    }

    formatOutput(data) {
        try {
            return JSON.stringify(data);
        } catch (error) {
            throw new Error(`Failed to format output: ${error.message}`);
        }
    }
}