const graphsboard = require('./../../')
graphsboard.server()

const graph = graphsboard.graph('Total Users', {
    type: 'line',
    absolute: true
})
graph.increment()