export class OperationProcessor {

    constructor({
        portfolio,
        operation,
        taxCalculator,
        operationStrategyFactory
    }) {
        this.portfolio = portfolio;
        this.operation = operation;
        this.taxCalculator = taxCalculator;
        this.operationStrategyFactory = operationStrategyFactory;
    }

    processOperations(rawOperations) {
        const results = [];

        this.taxCalculator.resetAccumulatedLoss();

        for (const rawOp of rawOperations) {
            const operation = this.operation.fromRawData(rawOp);
            const taxResult = this.processOperation(operation);
            
            results.push({ tax: taxResult });
        }

        return results;
    }

    processOperation(operation) {
        const strategy = this.operationStrategyFactory.createStrategy(operation.type, this);

        return strategy(operation);
    }
}