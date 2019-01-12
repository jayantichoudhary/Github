var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var weburls = require('./models/weburls');
var app = express();
var url = "mongodb://localhost:27017/admin";
var port = 3080;

app.set('port', process.env.PORT || 3080);
console.log('hey..i am listening to port ' + port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(url, { useNewUrlParser: true });

//Ques1. How many hrefs within weburls collection are of facebook?
app.get('/facebook', function (req, res) {
    weburls.find({ "url.parseDomain.domain": "facebook" }, { href: 1 }).exec(function (err, eachOne) {
        res.json(eachOne.length);
    });
});

//Ques2. Build a route which when supplied a mobile number, tells you all the hrefs where that mobile number was found.
app.get('/mob/:mobile', function (req, res) {
    var mobile1 = req.params.mobile;
    weburls.find({ "mobile": mobile1 }, { href: 1, mobile: 1 }).exec(function (err, eachOne) {
        res.json(eachOne);
    });
});


//Ques3. Build a route which tells the count of all hrefs with atleast one valid mobile number
app.get('/email1',function(req,res){
    var pattern=/^[a-z\_\.]+(@)[a-z]+\.[a-z]{2,3}$/;
   const q1=weburls.find({email: {$regex : pattern }},{href:1 , email:1}).exec(function(err,item){
            res.json(item.length);
    });
});

//Ques3. Build a route which tells the count of all hrefs with atleast one valid email

//function to match your Email pattern
function validEmail(thisEmail){
    var isMatch = thisEmail.match(/^[a-z0-9\_\.]+(@)[a-z0-9\-]+\.[a-z]{2,3}$/)
    if(isMatch){
        return true;
    }else{
        return false;
    }
}

app.get('/email', function (req, res) {
    console.log("Counting HREFs with atleast one valid email!");
    var countHREFwithValidEmail = 0;

    //array of all weburl
    var allWebURLS = weburls.find({ $where: "this.email.length > 0" }, { email: 1 }).exec(function (err, allWebURLS) {
       
        if(err){
            res.json("Mongodb Error!!");
        }else{
            if(allWebURLS && allWebURLS.length > 0)
            {
                allWebURLS.forEach(function(thisURL, uindex) //would check for each array of all webURLs
                { 
                    var atleastOneValidEmail = false;
                    var thisEmailArr = thisURL.email; //array of email
    
                    //console.log(thisEmailArr.length);//count of all emails
                    if(thisEmailArr && thisEmailArr.length > 0)
                    {
                        thisEmailArr.forEach(function(thisEmail, eindex) //would check for each array of email
                        { 
                            //would iterate for each email Array
                            console.log(thisEmail);
                            if(validEmail(thisEmail))//call the function validEmail
                            //if atleast one valid email would be true, it would mark atleastOneValidEmail to be true.
                            {
                                atleastOneValidEmail = true;
                            }
                        });
                        //if atleastOneValidEmail is true, increase the href as one
                        if(atleastOneValidEmail)
                        {
                            countHREFwithValidEmail += 1;
                        }
                        
                    } 
                });
                console.log(countHREFwithValidEmail);
                //renders the response 
                res.json(countHREFwithValidEmail);
            }else{
                res.json("Mongodb Error!! Found not weburls");
            }


        }
        
    });

});

//Ques4.  Build a route which tells the count of all hrefs with atleast one valid mobile number

//function to match your mobile number
function validMobile(thisMobile){
    var isMatch = thisMobile.match(/^([6-9]{1})([0-9]{9})$/)  
    if(isMatch)
    {
        return true;
    }
    else
    {
        return false;
    }
}

app.get('/mobile', function (req, res) {
    console.log("Counting HREFs with atleast one valid mobile!");
    var countHREFwithValidMobile = 0;
    var allWebURLS = weburls.find({ $where: "this.mobile.length > 0" }, { mobile: 1 }).exec(function (err, allWebURLS) {
      //array of all weburl
        // console.log(allWebURLS);
       // console.log(allWebURLS.length);
        
        if(err){
            res.json("Mongodb Error!!");
        }else{
            if(allWebURLS && allWebURLS.length > 0)
            {
                allWebURLS.forEach(function(thisURL, uindex) 
                { 
                    var atleastOneValidMobile = false;
                    var thisMobileArr = thisURL.mobile; //array of mobile

                    //console.log(thisMobileArr.length);//count of all mobile
                    if(thisMobileArr && thisMobileArr.length > 0)
                    {
                        thisMobileArr.forEach(function(thisMobile, eindex) 
                        { 
                            console.log(thisMobile);
                            if(validMobile(thisMobile))
                            {
                                atleastOneValidMobile = true;
                            }
                        });
                        if(atleastOneValidMobile)
                        {
                            countHREFwithValidMobile += 1;
                        }
                        
                    } 
                });
                console.log(countHREFwithValidMobile);
                res.json(countHREFwithValidMobile);
            }else{
                res.json("Mongodb Error!! Found not weburls");
            }


        }
        
    });

});

//Ques5. Build a route which calculates the sum of all valid mobile numbers, all valid email addresses
app.get('/adding', function (req, res) {
    console.log("Counting HREFs with atleast one valid mobile!");
    var countHREFwithValidMobile = 0;
    var countHREFwithValidEmail = 0;
    var allWebURLS = weburls.find({$or: [{$where: "this.mobile.length>0"}, {$where: "this.email.length>0"}]},{_id:1}).exec(function (err, allWebURLS) 
    {

        if(err){
            res.json("Mongodb Error!!");
        }else{
            if(allWebURLS && allWebURLS.length > 0)
            {
                allWebURLS.forEach(function(thisURL, uindex) 
                { 
                    var atleastOneValidMobile = false;
                    var atleastOneValidEmail = false;
                    var thisMobileArr = thisURL.mobile;
                    var thisEmailArr = thisURL.email;
                   
                    if(thisMobileArr && thisMobileArr.length > 0)
                    {
                        thisMobileArr.forEach(function(thisMobile, eindex) 
                        { 
                            if(validMobile(thisMobile))
                            {
                                atleastOneValidMobile = true;
                            }
                        });
                        if(atleastOneValidMobile)
                        {
                            countHREFwithValidMobile += 1;
                        }
                        
                    } 

                    if(thisEmailArr && thisEmailArr.length > 0)
                    {
                        thisEmailArr.forEach(function(thisEmail, uindex) 
                        { 
                            if(validEmail(thisEmail))
                            {
                                atleastOneValidEmail = true;
                            }
                        });
                        if(atleastOneValidEmail)
                        {
                            countHREFwithValidEmail += 1;
                        }
                        
                    }  
             }); 
        
              //console.log(countHREFwithValidMobile);
             //  console.log(countHREFwithValidEmail);
                var obj={};
                obj.allWebURLS=countHREFwithValidMobile;
                obj.allWebURLS=countHREFwithValidEmail;
                res.json(obj);
            
            }else{
                res.json("Mongodb Error!! Found not weburls");
            }
      }
        
    });

});

app.listen(port);