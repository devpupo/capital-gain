import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { EventEmitter } from 'events';
import { createContainer, asClass, asValue } from 'awilix';
import container from '../../../src/container.js';

import { App } from '../../../src/application/app.js';
import { OperationController } from '../../../src/application/operation-controller.js';
import { JsonParser } from '../../../src/infrastructure/parsers/json-parser.js';

describe('Capital Gains Calculator - End-to-End Tests', () => {
    let mockInputHandler;
    let mockOutputHandler;
    let testContainer;
    let app;
    let capturedOutput;

    beforeEach(() => {
        capturedOutput = [];

        mockInputHandler = new EventEmitter();

        mockOutputHandler = {
            write: jest.fn((output) => {
                capturedOutput.push(output);
            }),
            writeError: jest.fn((error) => {
                capturedOutput.push(`ERROR: ${error}`);
            })
        };

        testContainer = createContainer();

        const originalCradle = container.cradle;

        testContainer.register({
            container: asValue(testContainer),
            operation: asValue(originalCradle.operation),
            portfolio: asClass(originalCradle.portfolio.constructor).scoped(),
            taxCalculator: asClass(originalCradle.taxCalculator.constructor).scoped(),
            buyOperationStrategy: asValue(originalCradle.buyOperationStrategy),
            sellOperationStrategy: asValue(originalCradle.sellOperationStrategy),
            operationStrategyFactory: asValue(originalCradle.operationStrategyFactory),

            inputHandler: asValue(mockInputHandler),
            outputHandler: asValue(mockOutputHandler),
            ioParser: asClass(JsonParser).singleton(),

            operationController: asClass(OperationController).singleton(),
            operationProcessor: asClass(originalCradle.operationProcessor.constructor).scoped(),
        });
    });

    const simulateInputAndGetOutput = (inputLines) => {
        app = new App({
            inputHandler: mockInputHandler,
            operationController: testContainer.cradle.operationController
        }).start();

        for (const line of inputLines) {
            mockInputHandler.emit('data', line);
        }

        mockInputHandler.emit('end');

        return capturedOutput;
    };

    test('Case #1: Buy and sell operations with total value less than R$ 20,000', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 100}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 50}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 50}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 }
        ]);
    });

    test('Case #2: Buy and sell operations with profit and loss', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":5.00, "quantity": 5000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 10000.0 },
            { "tax": 0.0 }
        ]);
    });

    test('Case #3: Buy and sell operations with loss deduction from future profits', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":5.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 3000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 1000.0 }
        ]);
    });

    test('Case #4: Multiple buy operations with weighted average price calculation', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"buy", "unit-cost":25.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 10000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 }
        ]);
    });

    test('Case #5: Multiple buy and sell operations with weighted average price', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"buy", "unit-cost":25.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":25.00, "quantity": 5000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 10000.0 }
        ]);
    });

    test('Case #6: Complex scenario with loss deduction and tax calculation', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":2.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 2000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 2000}, ' +
            '{"operation":"sell", "unit-cost":25.00, "quantity": 1000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 3000.0 }
        ]);
    });

    test('Case #7: Very complex scenario with multiple operations', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":2.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 2000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 2000}, ' +
            '{"operation":"sell", "unit-cost":25.00, "quantity": 1000}, ' +
            '{"operation":"buy", "unit-cost":20.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":30.00, "quantity": 4350}, ' +
            '{"operation":"sell", "unit-cost":30.00, "quantity": 650}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 3000.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 3700.0 },
            { "tax": 0.0 }
        ]);
    });

    test('Case #8: Simple profit calculation with high values', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":50.00, "quantity": 10000}, ' +
            '{"operation":"buy", "unit-cost":20.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":50.00, "quantity": 10000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 80000.0 },
            { "tax": 0.0 },
            { "tax": 60000.0 }
        ]);
    });

    test('Case #9: Operations with decimal values and specific edge cases', () => {
        const input = [
            '[{"operation": "buy", "unit-cost": 5000.00, "quantity": 10}, ' +
            '{"operation": "sell", "unit-cost": 4000.00, "quantity": 5}, ' +
            '{"operation": "buy", "unit-cost": 15000.00, "quantity": 5}, ' +
            '{"operation": "buy", "unit-cost": 4000.00, "quantity": 2}, ' +
            '{"operation": "buy", "unit-cost": 23000.00, "quantity": 2}, ' +
            '{"operation": "sell", "unit-cost": 20000.00, "quantity": 1}, ' +
            '{"operation": "sell", "unit-cost": 12000.00, "quantity": 10}, ' +
            '{"operation": "sell", "unit-cost": 15000.00, "quantity": 3}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(1);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 1000.0 },
            { "tax": 2400.0 }
        ]);
    });

    test('Multiple independent simulations', () => {
        const input = [
            '[{"operation":"buy", "unit-cost":10.00, "quantity": 100}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 50}, ' +
            '{"operation":"sell", "unit-cost":15.00, "quantity": 50}]',

            '[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, ' +
            '{"operation":"sell", "unit-cost":20.00, "quantity": 5000}, ' +
            '{"operation":"sell", "unit-cost":5.00, "quantity": 5000}]'
        ];

        const output = simulateInputAndGetOutput(input);

        expect(output).toHaveLength(2);
        expect(JSON.parse(output[0])).toEqual([
            { "tax": 0.0 },
            { "tax": 0.0 },
            { "tax": 0.0 }
        ]);
        expect(JSON.parse(output[1])).toEqual([
            { "tax": 0.0 },
            { "tax": 10000.0 },
            { "tax": 0.0 }
        ]);
    });
});