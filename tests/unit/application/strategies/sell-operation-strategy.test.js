import { describe, expect, jest, beforeEach } from '@jest/globals';
import { SellOperationStrategy } from '../../../../src/application/strategies/sell-operation-strategy.js';
import { Decimal } from '../../../../src/infrastructure/utils/decimal-utils.js';

describe('SellOperationStrategy', () => {
    let mockPortfolio;
    let mockTaxCalculator;

    beforeEach(() => {
        mockPortfolio = {
            getWeightedAverage: jest.fn(),
            removeShares: jest.fn(),
        };

        mockTaxCalculator = {
            calculateSellTax: jest.fn(),
        };
    });

    describe('process', () => {
        it('should calculate saleValue and costBasis correctly', () => {
            const sellOperationStrategy = new SellOperationStrategy();
            sellOperationStrategy.portfolio = mockPortfolio;
            sellOperationStrategy.taxCalculator = mockTaxCalculator;

            mockPortfolio.getWeightedAverage.mockReturnValue(new Decimal(10));
            mockTaxCalculator.calculateSellTax.mockReturnValue(new Decimal(5));

            const operation = {
                quantity: 5,
                unitCost: 20,
            };

            const result = sellOperationStrategy.process(operation);

            expect(mockPortfolio.getWeightedAverage).toHaveBeenCalled();
            expect(mockPortfolio.removeShares).toHaveBeenCalledWith(5);

            const expectedSaleValue = new Decimal(5).times(20);
            expect(mockTaxCalculator.calculateSellTax).toHaveBeenCalledWith(
                expectedSaleValue,
                new Decimal(5).times(10)
            );

            expect(result).toEqual(new Decimal(5));
        });

        it('should handle zero quantity correctly', () => {
            const sellOperationStrategy = new SellOperationStrategy();
            sellOperationStrategy.portfolio = mockPortfolio;
            sellOperationStrategy.taxCalculator = mockTaxCalculator;

            mockPortfolio.getWeightedAverage.mockReturnValue(new Decimal(10));
            mockTaxCalculator.calculateSellTax.mockReturnValue(new Decimal(0));

            const operation = {
                quantity: 0,
                unitCost: 20,
            };

            const result = sellOperationStrategy.process(operation);

            expect(mockPortfolio.getWeightedAverage).not.toHaveBeenCalled();
            expect(mockPortfolio.removeShares).not.toHaveBeenCalled();
            expect(mockTaxCalculator.calculateSellTax).not.toHaveBeenCalled();

            expect(result).toEqual(new Decimal(0));
        });

        it('should handle negative quantity correctly', () => {
            const sellOperationStrategy = new SellOperationStrategy();
            sellOperationStrategy.portfolio = mockPortfolio;
            sellOperationStrategy.taxCalculator = mockTaxCalculator;

            mockPortfolio.getWeightedAverage.mockReturnValue(new Decimal(10));
            mockTaxCalculator.calculateSellTax.mockReturnValue(new Decimal(-5));

            const operation = {
                quantity: -5,
                unitCost: 20,
            };

            const result = sellOperationStrategy.process(operation);

            expect(mockPortfolio.getWeightedAverage).toHaveBeenCalled();
            expect(mockPortfolio.removeShares).toHaveBeenCalledWith(-5);

            const expectedSaleValue = new Decimal(-5).times(20);
            expect(mockTaxCalculator.calculateSellTax).toHaveBeenCalledWith(
                expectedSaleValue,
                new Decimal(-5).times(10)
            );

            expect(result).toEqual(new Decimal(-5));
        });
    });
});