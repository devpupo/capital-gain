import { describe, test, expect } from '@jest/globals'
import { TaxCalculator } from '../../../../src/domain/services/tax-calculator.js'
import { Decimal } from '../../../../src/infrastructure/utils/decimal-utils.js'

describe('TaxCalculator', () => {

    describe('calculateBuyTax', () => {
        test('should always return 0 for buy operations', () => {
            const taxCalculator = new TaxCalculator()

            expect(taxCalculator.calculateBuyTax()).toBe(0)
        })
    })

    describe('calculateSellTax', () => {
        test('should return 0 if there is a loss', () => {
            const taxCalculator = new TaxCalculator()
            const saleValue = new Decimal(10000)
            const costBasis = new Decimal(15000)

            const tax = taxCalculator.calculateSellTax(saleValue, costBasis)

            expect(tax).toBe(0)
            expect(taxCalculator.getAccumulatedLoss().toString()).toBe('5000')
        })

        test('should return 0 if sale value is below tax exemption threshold', () => {
            const taxCalculator = new TaxCalculator()
            const saleValue = new Decimal(15000)
            const costBasis = new Decimal(10000)

            const tax = taxCalculator.calculateSellTax(saleValue, costBasis)

            expect(tax).toBe(0)
        })

        test('should calculate tax correctly for profitable sale above threshold', () => {
            const taxCalculator = new TaxCalculator()
            const saleValue = new Decimal(30000)
            const costBasis = new Decimal(10000)

            const tax = taxCalculator.calculateSellTax(saleValue, costBasis)

            expect(tax).toBe(4000) // (30000 - 10000) * 0.2 = 4000
        })

        test('should offset accumulated loss before calculating tax', () => {
            const taxCalculator = new TaxCalculator()

            taxCalculator.calculateSellTax(new Decimal(10000), new Decimal(15000))

            const saleValue = new Decimal(30000)
            const costBasis = new Decimal(10000)

            const tax = taxCalculator.calculateSellTax(saleValue, costBasis)

            expect(tax).toBe(3000) // (30000 - 10000 - 5000) * 0.2 = 3000
            expect(taxCalculator.getAccumulatedLoss().toString()).toBe('0')
        })

        test('should fully offset accumulated loss if profit is less than loss', () => {
            const taxCalculator = new TaxCalculator()

            taxCalculator.calculateSellTax(new Decimal(10000), new Decimal(20000))

            const saleValue = new Decimal(30000)
            const costBasis = new Decimal(25000)

            const tax = taxCalculator.calculateSellTax(saleValue, costBasis)

            expect(tax).toBe(0) // (30000 - 25000 - 10000) * 0.2 = 0 
            expect(taxCalculator.getAccumulatedLoss().toString()).toBe('5000')
        })
    })

    describe('getAccumulatedLoss and resetAccumulatedLoss', () => {
        test('should return accumulated loss correctly', () => {
            const taxCalculator = new TaxCalculator()

            taxCalculator.calculateSellTax(new Decimal(10000), new Decimal(15000))

            expect(taxCalculator.getAccumulatedLoss().toString()).toBe('5000')
        })

        test('should reset accumulated loss to 0', () => {
            const taxCalculator = new TaxCalculator()

            taxCalculator.calculateSellTax(new Decimal(10000), new Decimal(15000))
            taxCalculator.resetAccumulatedLoss()
            
            expect(taxCalculator.getAccumulatedLoss().toString()).toBe('0')
        })
    })
})