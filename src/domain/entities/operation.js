export class Operation {
    TYPES = {
        BUY: 'buy',
        SELL: 'sell'
    }

    constructor(type, unitCost, quantity) {
        this.type = type
        this.unitCost = unitCost
        this.quantity = quantity
    }

    getTotalValue() {
        return this.unitCost * this.quantity
    }

    isBuy() {
        return this.type === this.TYPES.BUY
    }

    isSell() {
        return this.type === this.TYPES.SELL
    }

    fromRawData(data) {
        return new Operation(
            data.operation,
            data['unit-cost'],
            data.quantity
        )
    }
}