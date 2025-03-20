export class OperationStrategyFactory {
    constructor({ sellOperationStrategy, buyOperationStrategy }) {
        this.sellOperationStrategy = sellOperationStrategy;
        this.buyOperationStrategy = buyOperationStrategy;

        this.strategyMap = {
            'buy': this.buyOperationStrategy,
            'sell': this.sellOperationStrategy,
        };
    }

    createStrategy(operationType, context) {
        const strategy = this.strategyMap[operationType];

        if (!strategy) {
            throw new Error(`Unknown operation type: ${operationType}`);
        }

        return strategy.process.bind(context);
    }
}