import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { OperationProcessor } from '../../../src/application/operation-processor.js'
import { Decimal } from '../../../src/utils/decimal-utils.js'

describe('OperationProcessor', () => {
    let portfolioMock;
    let taxCalculatorMock;
    let operationMock;
    let operationProcessor;

    beforeEach(() => {
        portfolioMock = {
            addShares: jest.fn(),
            removeShares: jest.fn(),
            getWeightedAverage: jest.fn().mockReturnValue(new Decimal(10)),
            getTotalShares: jest.fn(),
        };

        taxCalculatorMock = {
            calculateBuyTax: jest.fn().mockReturnValue(0),
            calculateSellTax: jest.fn().mockReturnValue(1000),
            resetAccumulatedLoss: jest.fn(),
        };

        operationMock = {
            TYPES: {
                BUY: 'buy',
                SELL: 'sell',
            },
            fromRawData: jest.fn().mockImplementation((data) => ({
                type: data.operation,
                quantity: data.quantity,
                unitCost: new Decimal(data['unit-cost']),
            })),
        };

        operationProcessor = new OperationProcessor({
            portfolio: portfolioMock,
            taxCalculator: taxCalculatorMock,
            operation: operationMock,
        });
    });

    describe('processSellOperation', () => {
        test('should remove shares from portfolio and calculate tax correctly', () => {
            const sellOperation = { type: 'sell', quantity: 50, unitCost: new Decimal(20) };
            const tax = operationProcessor.processSellOperation(sellOperation);

            expect(portfolioMock.removeShares).toHaveBeenCalledWith(50);
            expect(portfolioMock.getWeightedAverage).toHaveBeenCalled();

            const expectedSaleValue = new Decimal(50).times(new Decimal(20));
            const expectedCostBasis = new Decimal(50).times(new Decimal(10));
            expect(taxCalculatorMock.calculateSellTax).toHaveBeenCalledWith(expectedSaleValue, expectedCostBasis);

            expect(tax).toBe(1000);
        });
    });

    describe('processOperations', () => {
        test('should process multiple operations and return correct tax results', () => {
            const rawOperations = [
                { operation: 'buy', 'unit-cost': 10, quantity: 100 },
                { operation: 'sell', 'unit-cost': 20, quantity: 50 },
            ];

            const results = operationProcessor.processOperations(rawOperations);

            expect(taxCalculatorMock.resetAccumulatedLoss).toHaveBeenCalled();
            expect(operationMock.fromRawData).toHaveBeenCalledTimes(2);
            expect(results).toEqual([
                { tax: 0 },
                { tax: 1000 },
            ]);
        });
    });
});