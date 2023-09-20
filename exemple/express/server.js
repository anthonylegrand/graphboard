const express = require("express")
const app = express()
const graphsboard = require('./../../')

app.use(graphsboard.middleware())

const graph = graphsboard.Graph('Total Users', {
    type: 'line',
    absolute: true
})

app.get('/register', (req, res) => {
    graph.add({user: 1})
    res.status(200).json({ result: true })
})

app.get('/error', (req, res) => {
    res.status(404).json({ result: true })
})

app.listen(81, () => {
    console.log(`Express server is running : http://localhost/`)
})