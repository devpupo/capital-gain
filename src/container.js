import { createContainer, asClass, asValue } from 'awilix'

import { ReadlineFactory } from './infrastructure/io/readline-factory.js'
import { InputHandler } from './infrastructure/io/input-handler.js'
import { OutputHandler } from './infrastructure/io/output-handler.js'
import { JsonParser } from './infrastructure/parsers/json-parser.js'

import { Operation } from './domain/entities/operation.js'
import { Portfolio } from './domain/entities/portfolio.js'
import { TaxCalculator } from './domain/services/tax-calculator.js'

import { SellOperationStrategy } from './application/strategies/sell-operation-strategy.js'
import { BuyOperationStrategy } from './application/strategies/buy-operation-strategy.js'
import { OperationStrategyFactory } from './application/strategies/operation-strategy-factory.js'
import { OperationController } from './application/operation-controller.js'
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
    ioParser: asClass(JsonParser).singleton(),
    readlineFactory: asClass(ReadlineFactory).singleton(),
    inputHandler: asClass(InputHandler).singleton(),
    outputHandler: asClass(OutputHandler).singleton(),

    /* Application */
    buyOperationStrategy: asClass(BuyOperationStrategy).singleton(),
    sellOperationStrategy: asClass(SellOperationStrategy).singleton(),
    operationStrategyFactory: asClass(OperationStrategyFactory).singleton(),
    operationController: asClass(OperationController).singleton(),
    operationProcessor: asClass(OperationProcessor).scoped(),
    app: asClass(App).singleton(),
})

export default container
