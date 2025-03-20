import { describe, expect, jest, beforeEach } from '@jest/globals';
import { OperationProcessor } from '../../../src/application/operation-processor.js';

describe('OperationProcessor', () => {
    let mockPortfolio;
    let mockOperation;
    let mockTaxCalculator;
    let mockOperationStrategyFactory;
    let operationProcessor;

    beforeEach(() => {
        mockPortfolio = {};

        mockOperation = {
            fromRawData: jest.fn(),
        };

        mockTaxCalculator = {
            resetAccumulatedLoss: jest.fn(),
        };

        mockOperationStrategyFactory = {
            createStrategy: jest.fn(),
        };

        operationProcessor = new OperationProcessor({
            portfolio: mockPortfolio,
            operation: mockOperation,
            taxCalculator: mockTaxCalculator,
            operationStrategyFactory: mockOperationStrategyFactory,
        });
    });

    describe('processOperations', () => {
        it('should process multiple operations and return tax results', () => {
            const rawOperations = [
                { type: 'buy', quantity: 10, unitCost: 20 },
                { type: 'sell', quantity: 5, unitCost: 25 },
            ];

            const mockOperation1 = { type: 'buy', quantity: 10, unitCost: 20 };
            const mockOperation2 = { type: 'sell', quantity: 5, unitCost: 25 };

            mockOperation.fromRawData
                .mockReturnValueOnce(mockOperation1)
                .mockReturnValueOnce(mockOperation2);

            const mockStrategy1 = jest.fn().mockReturnValue(0);
            const mockStrategy2 = jest.fn().mockReturnValue(5);

            mockOperationStrategyFactory.createStrategy
                .mockReturnValueOnce(mockStrategy1)
                .mockReturnValueOnce(mockStrategy2);

            const results = operationProcessor.processOperations(rawOperations);

            expect(mockTaxCalculator.resetAccumulatedLoss).toHaveBeenCalled();

            expect(mockOperation.fromRawData).toHaveBeenCalledWith(rawOperations[0]);
            expect(mockOperation.fromRawData).toHaveBeenCalledWith(rawOperations[1]);

            expect(mockOperationStrategyFactory.createStrategy).toHaveBeenCalledWith('buy', operationProcessor);
            expect(mockOperationStrategyFactory.createStrategy).toHaveBeenCalledWith('sell', operationProcessor);

            expect(mockStrategy1).toHaveBeenCalledWith(mockOperation1);
            expect(mockStrategy2).toHaveBeenCalledWith(mockOperation2);

            expect(results).toEqual([{ tax: 0 }, { tax: 5 }]);
        });

        it('should handle empty operations array', () => {
            const rawOperations = [];

            const results = operationProcessor.processOperations(rawOperations);

            expect(mockTaxCalculator.resetAccumulatedLoss).toHaveBeenCalled();
            expect(mockOperation.fromRawData).not.toHaveBeenCalled();
            expect(mockOperationStrategyFactory.createStrategy).not.toHaveBeenCalled();

            expect(results).toEqual([]);
        });
    });

    describe('processOperation', () => {
        it('should create and execute the correct strategy for an operation', () => {
            const operation = { type: 'sell', quantity: 5, unitCost: 25 };

            const mockStrategy = jest.fn().mockReturnValue(10);
            mockOperationStrategyFactory.createStrategy.mockReturnValue(mockStrategy);

            const taxResult = operationProcessor.processOperation(operation);

            expect(mockOperationStrategyFactory.createStrategy).toHaveBeenCalledWith('sell', operationProcessor);
            expect(mockStrategy).toHaveBeenCalledWith(operation);
            expect(taxResult).toBe(10);
        });
    });
});