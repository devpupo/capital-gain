import { describe, test, expect, beforeEach } from '@jest/globals';
import { Portfolio } from '../../../src/domain/entities/portfolio.js';

describe('Portfolio', () => {

    test('should initialize with zero shares and zero weighted average', () => {
        const portfolio = new Portfolio();
        expect(portfolio.getTotalShares()).toBe(0);
        expect(portfolio.getWeightedAverage().toNumber()).toBe(0);
    });

    test('should add shares and calculate weighted average correctly', () => {
        const portfolio = new Portfolio();
        // Buy 10 shares at 20.00
        portfolio.addShares(10, 20.00);

        expect(portfolio.getTotalShares()).toBe(10);
        expect(portfolio.getWeightedAverage().toNumber()).toBe(20.00);

        // Buy 5 more shares at 10.00
        portfolio.addShares(5, 10.00);

        expect(portfolio.getTotalShares()).toBe(15);
        // Weighted average: ((10 * 20) + (5 * 10)) / 15 = 16.67
        expect(portfolio.getWeightedAverage().toNumber()).toBeCloseTo(16.67, 2);
    });

    test('should remove shares correctly', () => {
        const portfolio = new Portfolio();
        // Buy 10 shares
        portfolio.addShares(10, 20.00);

        // Sell 5 shares
        portfolio.removeShares(5);

        expect(portfolio.getTotalShares()).toBe(5);
        // Weighted average should remain the same
        expect(portfolio.getWeightedAverage().toNumber()).toBe(20.00);
    });

    test('should throw error when trying to sell more shares than available', () => {
        const portfolio = new Portfolio();
        // Buy 10 shares
        portfolio.addShares(10, 20.00);

        // Try to sell 15 shares
        expect(() => {
            portfolio.removeShares(15);
        }).toThrow('Cannot sell more shares than available in portfolio');
    });

    test('should handle case when all shares are sold', () => {
        const portfolio = new Portfolio();
        // Buy 10 shares
        portfolio.addShares(10, 20.00);

        // Sell all 10 shares
        portfolio.removeShares(10);

        expect(portfolio.getTotalShares()).toBe(0);
        expect(portfolio.getWeightedAverage().toNumber()).toBe(20.00); // Weighted average remains
    });

    test('should handle complex scenario with multiple buys and sells', () => {
        const portfolio = new Portfolio();
        // Buy 10 shares at 10.00
        portfolio.addShares(10, 10.00);

        // Buy 5 shares at 20.00
        portfolio.addShares(5, 20.00);

        // Weighted average: ((10 * 10) + (5 * 20)) / 15 = 13.33
        expect(portfolio.getWeightedAverage().toNumber()).toBeCloseTo(13.33, 2);

        // Sell 8 shares
        portfolio.removeShares(8);

        expect(portfolio.getTotalShares()).toBe(7);
        // Weighted average remains the same
        expect(portfolio.getWeightedAverage().toNumber()).toBeCloseTo(13.33, 2);

        // Buy 3 more shares at 30.00
        portfolio.addShares(3, 30.00);

        expect(portfolio.getTotalShares()).toBe(10);
        // New weighted average: ((7 * 13.33) + (3 * 30)) / 10 = 18.33
        expect(portfolio.getWeightedAverage().toNumber()).toBeCloseTo(18.33, 2);
    });
});