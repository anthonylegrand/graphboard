const express = require("express")
const app = express()
const graphsboard = require('./../../')

app.use(graphsboard.middleware())

const graph = graphsboard.Graph('Total Users', {
    type: 'line',
    absolute: true,
    size: 3
})

app.get('/register', (req, res) => {
    graph.add({user: 1})
    res.status(200).json({ result: Math.random() })
})

app.get('/error', (req, res) => {
    res.status(404).json({ result: Math.random() })
})

app.listen(81, () => {
    console.log(`Express server is running : http://localhost/`)
    
    graphsboard.Notification('Express server is running : http://localhost/', 'Start at '+(new Date().toLocaleDateString()), { badge: 'sucess' })
})