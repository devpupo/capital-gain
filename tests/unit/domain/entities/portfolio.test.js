import { Portfolio } from '../../../../src/domain/entities/portfolio.js'
import { Decimal } from '../../../../src/utils/decimal-utils.js'

describe('Portfolio', () => {
    let portfolio

    beforeEach(() => {
        portfolio = new Portfolio()
    })

    describe('addShares', () => {
        test('should correctly add shares and update weighted average with rounding', () => {
            portfolio.addShares(10, new Decimal(20))
            portfolio.addShares(5, new Decimal(10))
            expect(portfolio.getTotalShares()).toBe(15)
            expect(portfolio.getWeightedAverage()).toEqual(new Decimal('16.67'))
        })

        test('should reset weighted average if total shares reach zero', () => {
            portfolio.addShares(100, new Decimal(10))
            portfolio.removeShares(100)
            portfolio.addShares(50, new Decimal(20))
            expect(portfolio.getTotalShares()).toBe(50)
            expect(portfolio.getWeightedAverage()).toEqual(new Decimal('20.00'))
        })
    })

    describe('removeShares', () => {
        test('should correctly remove shares', () => {
            portfolio.addShares(100, new Decimal(10))
            portfolio.removeShares(50)
            expect(portfolio.getTotalShares()).toBe(50)
        })

        test('should throw error when trying to remove more shares than available', () => {
            portfolio.addShares(100, new Decimal(10))
            expect(() => portfolio.removeShares(150)).toThrow('Cannot sell more shares than available in portfolio')
        })
    })

    describe('getWeightedAverage and getTotalShares', () => {
        test('should return correct weighted average and total shares with rounding', () => {
            portfolio.addShares(10, new Decimal(20))
            portfolio.addShares(5, new Decimal(10))
            expect(portfolio.getWeightedAverage()).toEqual(new Decimal('16.67'))
            expect(portfolio.getTotalShares()).toBe(15)
        })
    })
})