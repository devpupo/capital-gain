import { Decimal } from '../utils/decimal-utils.js'

export class OperationProcessor {

    constructor({ portfolio, taxCalculator, operation }) {
        this.portfolio = portfolio
        this.taxCalculator = taxCalculator
        this.operation = operation

        this.operationStrategies = {
            [this.operation.TYPES.BUY]: this.processBuyOperation.bind(this),
            [this.operation.TYPES.SELL]: this.processSellOperation.bind(this)
        }
    }

    processOperations(rawOperations) {
        const results = []

        this.taxCalculator.resetAccumulatedLoss()

        for (const rawOp of rawOperations) {
            const operation = this.operation.fromRawData(rawOp)
            const taxResult = this.processOperation(operation)
            results.push({ tax: taxResult })
        }

        return results
    }

    processOperation(operation) {
        const strategy = this.operationStrategies[operation.type]

        if (!strategy) {
            throw new Error(`Unknown operation type: ${operation.type}`)
        }

        return strategy(operation)
    }

    processBuyOperation(operation) {
        this.portfolio.addShares(operation.quantity, operation.unitCost)
        return this.taxCalculator.calculateBuyTax()
    }

    processSellOperation(operation) {
        const { quantity, unitCost } = operation

        const saleValue = new Decimal(quantity).times(unitCost)
        const costBasis = new Decimal(quantity).times(this.portfolio.getWeightedAverage())

        this.portfolio.removeShares(quantity)

        return this.taxCalculator.calculateSellTax(saleValue, costBasis)
    }
}

