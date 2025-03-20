export class BuyOperationStrategy {

    process(operation) {
        this.portfolio.addShares(operation.quantity, operation.unitCost);
        return this.taxCalculator.calculateBuyTax();
    }
}