const express = require("express")
const app = express()
const graphboard = require('./../../')

app.use(graphboard.middleware())

app.listen(80, () => {
    console.log(`Express server is running : http://localhost/`)
})