const graphsboard = require('./../../')
graphsboard.server()

const graph = graphsboard.Graph('Total Users', {
    type: 'line',
    absolute: true
})
graph.add({user: 1})

graphsboard.Notification('Voici un test', 'Let\'s goo le new test trop long comme mesage !')