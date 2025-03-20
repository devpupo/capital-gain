export class Operation {

    constructor(type, unitCost, quantity) {
        this.type = type
        this.unitCost = unitCost
        this.quantity = quantity
    }

    getTotalValue() {
        return this.unitCost * this.quantity
    }

    fromRawData(data) {
        return new Operation(
            data.operation,
            data['unit-cost'],
            data.quantity
        )
    }
}