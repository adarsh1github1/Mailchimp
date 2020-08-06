const express = require('express');
const bodyPaser = require('body-parser');
const request = require('request');
const https = require('https');


const app = express();
app.use(bodyPaser.urlencoded({extended:true}));
// function of express to load statoc style sheet
app.use(express.static("public"))  // public is our static folder, we have moved our stylesheet and images in public as they are static, now we need to give location of the style sheet (assume you are under public folder and then give the address)  eg  - css/styles.css   or images/newslogo.png

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_addess: email,
            status: "subscribed",
            merge_filds: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    const jsonData = JSON.stringify(data);
    // http also has a request to post data .. in http.request we have an option called method - it helps to specify the type of request we want to make , eg get , post etc
    
                                          // it comes form mailchimp endpoint
    

    const url =  "https://us17.api.mailchimp.com/3.0/lists/28cb558cad";
    const options = {
        method: "POST",            // for authentication we can use any username and the given authentication key
        auth: "adarsh:eaaa730f23fa142f9dcb26f46af0f385-us17"      // format is "any_username:authentication key"
    }
    
    const request = https.request(url, options, function(response){
        response.on("data", function(data){

            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(JSON.parse(data));
        });
    });                        // we catch the data info. sent by the mailchimp 

    request.write(jsonData);      // we sent the data to mailchimp
    request.end();     // we are donew with request 

    
});

app.post("/failure", function(req, res){
    res.redirect("/");       // this is post request to reach to whenver we reach the failure page the try again will redirect to home route
})

app.listen(process.env.PORT || 3000, function(){   // we are using the different port to allow heroku choose the port as we are running on their server or we can use || to run it both locally and remotely
    console.log("server is runing on port 3000"); 
});

// web: node index.js  -- to run the webservice 
// api key
// eaaa730f23fa142f9dcb26f46af0f385-us17
// mailchimp api reference - https://mailchimp.com/developer/api/marketing/root
// audidence id/ list id - 28cb558cad         // helps mailchip identify which list do you want to add your subscribers 