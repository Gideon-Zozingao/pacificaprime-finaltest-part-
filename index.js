// port where the application server listens to.
const PORT=9090;
//incport the express  we framework
const express = require('express')
//include the cookie-parser library
//cookie parser will handle anspass cookie headers within the client and the server
const cookieParser = require('cookie-parser')

//import the custom routes module to handle all.
// the constrollers for incoming and outgoing request
// to and and from the server is implemented inside this moful the 
const routes = require('./routes/routes.js')

//instantiate the express application and store it in the app variale
const app = express()

// user EJS as template engine to rende the html contentes of the responses.
app.set('view engine', 'ejs')

//use the instance of the cookie parser in the application
app.use(cookieParser())

//use the express's url encoding lirary  to get all the form data and request parameters
app.use(express.urlencoded({extended:false}))

//use the the all the imported routes functions insid the application
app.use(routes)


//start  the server and listen on port 9090
app.listen(PORT,()=>{
	console.log(`Application Sever started and Running on localhost:${PORT}`)
})