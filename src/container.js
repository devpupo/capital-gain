import { createContainer, asClass, asValue } from 'awilix'

import { ReadlineFactory } from './infrastructure/io/readline-factory.js'
import { InputHandler } from './infrastructure/io/input-handler.js'
import { OutputHandler } from './infrastructure/io/output-handler.js'
import { InputParser } from './infrastructure/parsers/input-parser.js'
import { OutputParser } from './infrastructure/parsers/output-parser.js'

import { Operation } from './domain/entities/operation.js'
import { Portfolio } from './domain/entities/portfolio.js'
import { TaxCalculator } from './domain/services/tax-calculator.js'

import { OperationProcessor } from './application/operation-processor.js'
import { App } from './application/app.js'

const container = createContainer()

container.register({
    container: asValue(container),

    /* Domain */
    operation: asClass(Operation).scoped(),
    portfolio: asClass(Portfolio).scoped(),
    taxCalculator: asClass(TaxCalculator).scoped(),

    /* Infrastructure  */
    inputParser: asClass(InputParser).singleton(),
    outputParser: asClass(OutputParser).singleton(),
    readlineFactory: asClass(ReadlineFactory).singleton(),
    inputHandler: asClass(InputHandler).singleton(),
    outputHandler: asClass(OutputHandler).singleton(),

    /* Application */
    operationProcessor: asClass(OperationProcessor).scoped(),
    app: asClass(App).singleton(),
})

export default container
