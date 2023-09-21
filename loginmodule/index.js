const express = require("express")
const bodyParse = require("body-parser")
const dbConnection = require("./connection/db")
const path = require("path")
const cors = require("cors")


// db connection 

dbConnection.authenticate()
    .then(() => {
        console.log("Connection Established!!")
    }).catch((err) =>
        console.error("Connection not established", err))

const app = express()
app.use(cors())


//use public folder to serve webpages

app.use(express.static(path.join(__dirname,"public")))


// parse application/json & form-urlencoded

app.use(bodyParse.json())

app.unsubscribe(bodyParse.urlencoded({
    extended:true
}))


//api routes

app.use("",require("./api/user"));
app.use("/teacher",require("./api/teacher"));
app.use("/student",require("./api/student"));

app.get("/*",(req,res)=> res.sendFile(__dirname,"public/index.html"))

app.listen(process.eventNames.PORT || 3000, () => console.log("Server is up"))

