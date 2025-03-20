import { describe, expect, jest, beforeEach } from '@jest/globals';
import { BuyOperationStrategy } from '../../../../src/application/strategies/buy-operation-strategy.js';

describe('BuyOperationStrategy', () => {
    let mockPortfolio;
    let mockTaxCalculator;

    beforeEach(() => {
        mockPortfolio = {
            addShares: jest.fn(),
        };

        mockTaxCalculator = {
            calculateBuyTax: jest.fn(),
        };
    });

    describe('process', () => {
        it('should add shares to the portfolio and calculate buy tax', () => {
            const buyOperationStrategy = new BuyOperationStrategy();
            buyOperationStrategy.portfolio = mockPortfolio;
            buyOperationStrategy.taxCalculator = mockTaxCalculator;

            mockTaxCalculator.calculateBuyTax.mockReturnValue(10);

            const operation = {
                quantity: 5,
                unitCost: 20,
            };

            const result = buyOperationStrategy.process(operation);

            expect(mockPortfolio.addShares).toHaveBeenCalledWith(5, 20);
            expect(mockTaxCalculator.calculateBuyTax).toHaveBeenCalled();
            expect(result).toBe(10);
        });

        it('should handle zero quantity correctly', () => {
            const buyOperationStrategy = new BuyOperationStrategy();
            buyOperationStrategy.portfolio = mockPortfolio;
            buyOperationStrategy.taxCalculator = mockTaxCalculator;

            mockTaxCalculator.calculateBuyTax.mockReturnValue(0);

            const operation = {
                quantity: 0,
                unitCost: 20,
            };

            const result = buyOperationStrategy.process(operation);

            expect(mockPortfolio.addShares).toHaveBeenCalledWith(0, 20);
            expect(mockTaxCalculator.calculateBuyTax).toHaveBeenCalled();
            expect(result).toBe(0);
        });

        it('should handle negative quantity correctly', () => {
            const buyOperationStrategy = new BuyOperationStrategy();
            buyOperationStrategy.portfolio = mockPortfolio;
            buyOperationStrategy.taxCalculator = mockTaxCalculator;

            mockTaxCalculator.calculateBuyTax.mockReturnValue(-5);

            const operation = {
                quantity: -5,
                unitCost: 20,
            };

            const result = buyOperationStrategy.process(operation);

            expect(mockPortfolio.addShares).toHaveBeenCalledWith(-5, 20);
            expect(mockTaxCalculator.calculateBuyTax).toHaveBeenCalled();
            expect(result).toBe(-5);
        });
    });
});