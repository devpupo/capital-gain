export class JsonParser {

    parseInput(data) {
        if (typeof data !== 'string') {
            throw new Error(`expected string but got ${typeof data}`);
        }

        if (data.trim() === "") {
            throw new Error("empty JSON string");
        }

        try {
            const parsedData = JSON.parse(data);

            if (typeof parsedData === 'object' && Object.keys(parsedData).length === 0) {
                throw new Error("empty JSON object or array");
            }

            return parsedData;
        } catch (error) {
            throw new Error(`Invalid input JSON: ${error.message}`);
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