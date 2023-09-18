const express = require("express")
const app = express()
const graphsboard = require('./../../')

app.use(graphsboard.middleware())


const graph = graphsboard.graph('Total Users', {
    type: 'line',
    absolute: true
})
graph.increment()

app.listen(80, () => {
    console.log(`Express server is running : http://localhost/`)
})