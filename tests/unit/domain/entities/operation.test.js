import { describe, test, expect } from '@jest/globals'
import { Operation } from '../../../../src/domain/entities/operation.js'

describe('Operation', () => {
    let operationInstance

    beforeEach(() => {
        operationInstance = new Operation('buy', 10, 100)
    });

    describe('Constructor', () => {
        test('should correctly assign values for BUY operation', () => {
            const operation = new Operation('buy', 10, 100)
            expect(operation.type).toBe('buy')
            expect(operation.unitCost).toBe(10)
            expect(operation.quantity).toBe(100)
        })

        test('should correctly assign values for SELL operation', () => {
            const operation = new Operation('sell', 20, 50)
            expect(operation.type).toBe('sell')
            expect(operation.unitCost).toBe(20)
            expect(operation.quantity).toBe(50)
        })
    })

    describe('isBuy', () => {
        test('should return true for BUY operation', () => {
            const operation = new Operation('buy', 10, 100)
            expect(operation.isBuy()).toBe(true)
        })

        test('should return false for SELL operation', () => {
            const operation = new Operation('sell', 20, 50)
            expect(operation.isBuy()).toBe(false)
        })
    })

    describe('isSell', () => {
        test('should return true for SELL operation', () => {
            const operation = new Operation('sell', 20, 50)
            expect(operation.isSell()).toBe(true)
        })

        test('should return false for BUY operation', () => {
            const operation = new Operation('buy', 10, 100)
            expect(operation.isSell()).toBe(false)
        })
    })

    describe('getTotalValue', () => {
        test('should calculate total value correctly for BUY operation', () => {
            const operation = new Operation('buy', 10, 100)
            expect(operation.getTotalValue()).toBe(1000)
        })

        test('should calculate total value correctly for SELL operation', () => {
            const operation = new Operation('sell', 20, 50)
            expect(operation.getTotalValue()).toBe(1000)
        })
    })

    describe('fromRawData', () => {
        test('should create an Operation instance from raw data', () => {
            const rawData = {
                operation: 'buy',
                'unit-cost': 10,
                quantity: 100
            };
            const operation = operationInstance.fromRawData(rawData)
            expect(operation.type).toBe('buy');
            expect(operation.unitCost).toBe(10);
            expect(operation.quantity).toBe(100);
        });

        test('should create an Operation instance from raw data with SELL operation', () => {
            const rawData = {
                operation: 'sell',
                'unit-cost': 20,
                quantity: 50
            };
            const operation = operationInstance.fromRawData(rawData)
            expect(operation.type).toBe('sell');
            expect(operation.unitCost).toBe(20);
            expect(operation.quantity).toBe(50);
        });
    });
})