import { Decimal } from '../../infrastructure/utils/decimal-utils.js'

export class SellOperationStrategy {

    process(operation) {
        const { quantity, unitCost } = operation

        if (quantity === 0) {
            return new Decimal(0);
        }

        const saleValue = new Decimal(quantity).times(unitCost)
        const costBasis = new Decimal(quantity).times(this.portfolio.getWeightedAverage())

        this.portfolio.removeShares(quantity)

        return this.taxCalculator.calculateSellTax(saleValue, costBasis)
    }
}