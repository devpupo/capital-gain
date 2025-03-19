import { Decimal } from '../../utils/decimal-utils.js'

export class Portfolio {
    constructor() {
        this.weightedAverage = new Decimal(0)
        this.totalShares = 0
    }

    addShares(quantity, unitCost) {
        const currentValue = new Decimal(this.totalShares).times(this.weightedAverage)
        const newValue = new Decimal(quantity).times(unitCost)
        const newTotalShares = this.totalShares + quantity

        if (newTotalShares > 0) {
            this.weightedAverage = currentValue.plus(newValue).dividedBy(newTotalShares)
        } else {
            this.weightedAverage = new Decimal(0)
        }

        this.totalShares = newTotalShares
    }

    removeShares(quantity) {
        if (quantity > this.totalShares) {
            throw new Error('Cannot sell more shares than available in portfolio')
        }

        this.totalShares -= quantity
    }

    getWeightedAverage() {
        return this.weightedAverage
    }

    getTotalShares() {
        return this.totalShares
    }
}
