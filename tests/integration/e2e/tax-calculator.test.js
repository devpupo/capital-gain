import { describe, test, expect, beforeEach } from '@jest/globals';
import { TaxCalculator } from '../../../src/domain/services/tax-calculator.js';
import { Decimal } from '../../../src/infrastructure/utils/decimal-utils.js';

describe('TaxCalculator', () => {

    test('should not tax buy operations', () => {
        const taxCalculator = new TaxCalculator();
        const tax = taxCalculator.calculateBuyTax();
        expect(tax).toBe(0);
    });

    test('should not tax when sale value is less than or equal to R$ 20,000', () => {
        const taxCalculator = new TaxCalculator();
        const saleValue = new Decimal(20000);
        const costBasis = new Decimal(10000);

        const tax = taxCalculator.calculateSellTax(saleValue, costBasis);

        expect(tax).toBe(0);
    });

    test('should tax 20% of profit when sale value is greater than R$ 20,000', () => {
        const taxCalculator = new TaxCalculator();
        const saleValue = new Decimal(50000);
        const costBasis = new Decimal(30000);

        const tax = taxCalculator.calculateSellTax(saleValue, costBasis);

        // Profit is 20,000, tax is 20% of that = 4,000
        expect(tax).toBe(4000);
    });

    test('should not tax when there is a loss', () => {
        const taxCalculator = new TaxCalculator();
        const saleValue = new Decimal(30000);
        const costBasis = new Decimal(40000);

        const tax = taxCalculator.calculateSellTax(saleValue, costBasis);

        expect(tax).toBe(0);
    });

    test('should accumulate losses and deduct from future profits', () => {
        const taxCalculator = new TaxCalculator();
        // First operation: Loss of 10,000
        const saleValue1 = new Decimal(30000);
        const costBasis1 = new Decimal(40000);

        const tax1 = taxCalculator.calculateSellTax(saleValue1, costBasis1);

        expect(tax1).toBe(0);
        expect(taxCalculator.getAccumulatedLoss().toNumber()).toBe(10000);

        // Second operation: Profit of 20,000, but with 10,000 accumulated loss
        const saleValue2 = new Decimal(50000);
        const costBasis2 = new Decimal(30000);

        const tax2 = taxCalculator.calculateSellTax(saleValue2, costBasis2);

        // Taxable profit is 10,000 (20,000 - 10,000), tax is 20% of that = 2,000
        expect(tax2).toBe(2000);
        expect(taxCalculator.getAccumulatedLoss().toNumber()).toBe(0);
    });

    test('should reset accumulated loss', () => {
        const taxCalculator = new TaxCalculator();
        // Accumulate some loss
        const saleValue = new Decimal(30000);
        const costBasis = new Decimal(40000);

        taxCalculator.calculateSellTax(saleValue, costBasis);

        expect(taxCalculator.getAccumulatedLoss().toNumber()).toBe(10000);

        // Reset accumulated loss
        taxCalculator.resetAccumulatedLoss();

        expect(taxCalculator.getAccumulatedLoss().toNumber()).toBe(0);
    });
});