const express = require("express")
const app = express()
const morgan = require("morgan")
const { readdirSync } = require("fs")

app.use(morgan("dev"))
readdirSync("./routes").map((items)=> app.use('/api',require(`./routes/${items}`)))

app.listen(3001,console.log("puppeteer run on port 3001"))