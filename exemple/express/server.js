const express = require("express")
const app = express()
const graphsboard = require('./../../')

app.use(graphsboard.middleware())

app.listen(80, () => {
    console.log(`Express server is running : http://localhost/`)
})