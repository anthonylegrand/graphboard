const graphsboard = require('./../../')
graphsboard.server()

const graph = graphsboard.Graph('Total Users', {
    type: 'line',
    absolute: true
})
graph.add({user: 1})