const express = require("express")
const app = express()
const graphsboard = require('./../../')

app.use(graphsboard.middleware())

const graph = graphsboard.Graph('Total Users', {
    type: 'line',
    absolute: true
})
const graph1 = graphsboard.Graph('Requests', {
    type: 'line'
})

app.get('/register', (req, res) => {
    graph.increment()
    graph1.increment()
    res.json({ result: true })
})

app.get('/set/:val', (req, res) => {
    graph.set(req.params.val)
    graph1.set(req.params.val)
    res.json({ result: true })
})

app.listen(81, () => {
    console.log(`Express server is running : http://localhost/`)
})