import { describe, test, expect } from '@jest/globals'
import { Operation } from '../../../../src/domain/entities/operation.js'

describe('Operation', () => {

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
            const operationInstance = new Operation()

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
            const operationInstance = new Operation()

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