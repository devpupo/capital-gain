import { describe, expect, jest, beforeEach } from '@jest/globals';
import { OperationStrategyFactory } from '../../../../src/application/strategies/operation-strategy-factory.js';

describe('OperationStrategyFactory', () => {
    let mockSellOperationStrategy;
    let mockBuyOperationStrategy;
    let mockContext;

    beforeEach(() => {
        mockSellOperationStrategy = {
            process: jest.fn(),
        };

        mockBuyOperationStrategy = {
            process: jest.fn(),
        };

        mockContext = {};
    });

    describe('createStrategy', () => {
        it('should return the sell strategy for operation type "sell"', () => {
            const operationStrategyFactory = new OperationStrategyFactory({
                sellOperationStrategy: mockSellOperationStrategy,
                buyOperationStrategy: mockBuyOperationStrategy,
            });

            const strategy = operationStrategyFactory.createStrategy('sell', mockContext);

            expect(typeof strategy).toBe('function');

            const testOperation = { type: 'sell' };
            strategy(testOperation);

            expect(mockSellOperationStrategy.process).toHaveBeenCalledWith(testOperation);
        });

        it('should return the buy strategy for operation type "buy"', () => {
            const operationStrategyFactory = new OperationStrategyFactory({
                sellOperationStrategy: mockSellOperationStrategy,
                buyOperationStrategy: mockBuyOperationStrategy,
            });

            const strategy = operationStrategyFactory.createStrategy('buy', mockContext);

            expect(typeof strategy).toBe('function');

            const testOperation = { type: 'buy' };
            strategy(testOperation);

            expect(mockBuyOperationStrategy.process).toHaveBeenCalledWith(testOperation);
        });

        it('should throw an error for unknown operation types', () => {
            const operationStrategyFactory = new OperationStrategyFactory({
                sellOperationStrategy: mockSellOperationStrategy,
                buyOperationStrategy: mockBuyOperationStrategy,
            });

            expect(() => {
                operationStrategyFactory.createStrategy('unknown', mockContext);
            }).toThrow('Unknown operation type: unknown');
        });

        it('should bind the context to the strategy process method', () => {
            const operationStrategyFactory = new OperationStrategyFactory({
                sellOperationStrategy: mockSellOperationStrategy,
                buyOperationStrategy: mockBuyOperationStrategy,
            });

            const strategy = operationStrategyFactory.createStrategy('buy', mockContext);

            expect(typeof strategy).toBe('function');

            const testOperation = { type: 'buy' };
            strategy(testOperation);

            expect(mockBuyOperationStrategy.process).toHaveBeenCalledWith(testOperation);
        });
    });
});