const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')

const cors = require('cors')
const path = require("path");

const app = express()

app.use(myconn(mysql, {
    host: 'database-3.cnoxhuocv4d1.us-west-2.rds.amazonaws.com',
    port: 3306,
    user: "moroju109",
    password: 'xkqtop12',
    database: 'img'
}))
app.use(cors())
app.use(express.static(path.join(__dirname,'dbimages')))

app.use(require('./routes/routes'))

app.listen(9000, () => {
    console.log('server running on', 'http://localhost:' + 9000)
})