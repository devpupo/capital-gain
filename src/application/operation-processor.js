import { Operation } from '../domain/entities/operation.js'
import { Decimal } from '../utils/decimal-utils.js'

export class OperationProcessor {

    constructor({ portfolio, taxCalculator }) {
        this.portfolio = portfolio
        this.taxCalculator = taxCalculator
    }

    processOperations(rawOperations) {
        const results = []

        this.taxCalculator.resetAccumulatedLoss()

        for (const rawOp of rawOperations) {
            const operation = Operation.fromRawData(rawOp)
            const taxResult = this.processOperation(operation)
            results.push({ tax: taxResult })
        }

        return results
    }

    processOperation(operation) {
        if (operation.isBuy()) {
            return this.processBuyOperation(operation)
        } else if (operation.isSell()) {
            return this.processSellOperation(operation)
        } else {
            throw new Error(`Unknown operation type: ${operation.type}`)
        }
    }

    processBuyOperation(operation) {
        this.portfolio.addShares(operation.quantity, operation.unitCost)
        return this.taxCalculator.calculateBuyTax()
    }

    processSellOperation(operation) {
        const saleValue = new Decimal(operation.quantity).times(operation.unitCost)
        const costBasis = new Decimal(operation.quantity).times(this.portfolio.getWeightedAverage())

        this.portfolio.removeShares(operation.quantity)

        return this.taxCalculator.calculateSellTax(saleValue, costBasis)
    }
}

