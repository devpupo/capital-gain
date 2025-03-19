import { Decimal } from '../../utils/decimal-utils.js'

export class TaxCalculator {
    constructor() {
        this.accumulatedLoss = new Decimal(0)
        this.TAX_RATE = new Decimal(0.2) // 20%
        this.TAX_EXEMPTION_THRESHOLD = new Decimal(20000)
    }

    calculateBuyTax() {
        return 0
    }

    calculateSellTax(saleValue, costBasis) {
        const profit = saleValue.minus(costBasis)

        if (profit.lessThanOrEqualTo(0)) {
            this.accumulatedLoss = this.accumulatedLoss.plus(profit.abs())
            return 0
        }

        const isTaxExempt = saleValue.lessThanOrEqualTo(this.TAX_EXEMPTION_THRESHOLD)
        if (isTaxExempt) {
            return 0
        }

        let taxableProfit = profit
        if (this.accumulatedLoss.greaterThan(0)) {
            if (this.accumulatedLoss.greaterThanOrEqualTo(profit)) {
                this.accumulatedLoss = this.accumulatedLoss.minus(profit)
                taxableProfit = new Decimal(0)
            } else {
                taxableProfit = profit.minus(this.accumulatedLoss)
                this.accumulatedLoss = new Decimal(0)
            }
        }

        const tax = taxableProfit.times(this.TAX_RATE)
        return Number(tax.toFixed(2))
    }

    getAccumulatedLoss() {
        return this.accumulatedLoss
    }

    resetAccumulatedLoss() {
        this.accumulatedLoss = new Decimal(0)
    }
}
