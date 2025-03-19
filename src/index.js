import container from './container.js'

const app = container.resolve('app')

app.start()