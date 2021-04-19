const { User, Message } = require('../models/models.js')
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const router = Router()


// home route
router.get('/', async function (req, res){
    let messages = await Message.findAll({})
    let data = { messages }

    res.render('index.ejs', data)
})

//proces the get request for accessin guser registration page and arender page
//  onto the client 
router.get('/createUser', async function(req, res){
    let token = req.cookies.token 
    if(token){
        res.redirect("/")
    }else{
        res.render('createUser.ejs')
    }
    
})

// access the logout request  from the client and destroy the current logedinsession
router.get("/logout",(req,res)=>{
    let token = req.cookies.token
    if(token){
        res.cookie("token","");
         res.redirect("/");
    }else{
        res.redirect("/");

    }
})

//recieves the post request for registraiton 
//gets all the form  data and processes the registration
router.post('/createUser', async function(req, res){
    let { username, password } = req.body

    try {
        await User.create({
            username,
            password,
            role: "user"
        }).then((user)=>{
            res.redirect('/login')
            console.log(user)
        })  
    } catch (e) {
        console.log(e)
        res.redirect("/error")
    }
    
})

//recieves the post request of mesage voting and process the\
// updating of voting scoresa nd returns to the main page
router.post("/vote",async(req,res)=>{
    let token=req.cookies.token;

    let messageId=req.body.message_Id;

    //checks for active loged in token
        if(token){
            // if the login token is present
        // search for existenc eof the voted message iniside database
        await Message.findOne({
            where:{
                id:messageId
            }
        }
        ).then((message)=>{
            if(message){
                //get the previous upVotes from the dataase and 
                //increment it by one and store in the score variale
                
                // update the message upvote score with the lates vote
                let score=message.upVotes+1
                                message.update({
                    upVotes:score
                }).then(()=>{
                         res.redirect("/")     
                })
               
            }else{
                //redirect to error handling route when the message is not present
                
                res.redirect("/error")
            }
        }).catch((error)=>{
            res.redirect("/error")
            console.log(error)
        })       
    }else{

        //if the  login token is not present
        //redirect to login page
            res.redirect("/login")
    }

    
})

//recievves  the request for accessig login page and process if
router.get('/login', function(req, res) {

    //checks for the loged in token stored insie the cookie variales
    let token = req.cookies.token 
    if(token){
        //reidirect to the home page if the token is present
        res.redirect("/")
    }else{

        // if the loged in toke is not present
        // render the logn page onto t client.
        res.render('login')
    }
    
})


//recieves the login post  request with the login credentilas and process it
router.post('/login', async function(req, res) {
    // get  the username from the form field and store it inside username variable
    let username=req.body.username;
    //get  the password from the form field and store it inside password variable
    let password=req.body.password;
//executes when there is no error
    try {

        //checks if all the form fields are present
        if(username!==""&&password!==""){
            //searces on the db  for the username
            //and valid pasword
          let user = await User.findOne({
            where: {username:username}
        }).then((user)=>{

            // checks if the user actually present
            if (user && user.password === password) {
                //stored the retrieved user data on the data object

        let data = {
            username: username,
            role: user.role
        }

//creates a JWT token with userdata and secret key
        let token = jwt.sign(data, "theSecret")
        // pass the token as cookies to the client and sotre it inside cookies variable
        res.cookie("token", token)
        // now rediect to the home page
        res.redirect('/')
    }else{

        //rediect to error page if   som eof the for field are missing
        res.redirect('/error')
    }
    })  
    }else{
            res.redirect('/error')
    }
        
    } catch (e) {
        console.log(e)
        res.redirect('/error')
    }
})

//recieves and processes the request for accesing sedd message page.
router.get('/message', async function (req, res) {
    //gets the token cokkie form the request an store it iside toke ariable
    let token = req.cookies.token 

    //chek if the token exist
    if (token) {                                      // very bad, no verify, don't do this
        res.render('message')
    } else {
        res.render('login')
    }
})

router.post('/message', async function(req, res){
    let { token } = req.cookies
    let { content } = req.body

    if (token) {
        let payload = await jwt.verify(token, "theSecret")  
 
        let user = await User.findOne({
            where: {username: payload.username}
        }).then((user)=>{
            if(user){
                let msg =  Message.create({
            content,
            userId: user.id,
            upVotes:0
        }).then((msg)=>{
            console.log(msg)
           res.redirect('/') 
        })
        
            }else{
              res.redirect('/error')  
            }
        }).catch((error)=>{
            console.log(error);
            res.redirect('/error')
        })
        
    } else {
        res.redirect('/login')
    }
})

router.get('/error', function(req, res){
    res.render('error')
})

router.all('*', function(req, res){
    res.send('404 dude')
})

module.exports = router