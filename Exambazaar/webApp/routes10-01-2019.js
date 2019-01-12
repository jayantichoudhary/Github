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

app.get('/facebook', function (req, res) {
    weburls.find({ "url.parseDomain.domain": "facebook" }, { href: 1 }).exec(function (err, eachOne) {
        res.json(eachOne.length);
    });
});

app.get('/mob/:mobile', function (req, res) {
    var mobile1 = req.params.mobile;
    weburls.find({ "mobile": mobile1 }, { href: 1, mobile: 1 }).exec(function (err, eachOne) {
        res.json(eachOne);
    });
});


// app.get('/email',function(req,res){
//     var pattern=/^[a-z\_\.]+(@)[a-z]+\.[a-z]{2,3}$/;
//    const q1=weburls.find({email: {$regex : pattern }},{href:1 , email:1}).exec(function(err,item){
//             res.json(item.length);
//     });
// });

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
    var allWebURLS = weburls.find({ $where: "this.email.length > 0" }, { email: 1 }).exec(function (err, allWebURLS) {
       // console.log(allWebURLS);
       // console.log(allWebURLS.length);
        //array of all weburl
        if(err){
            res.json("Mongodb Error!!");
        }else{
            if(allWebURLS && allWebURLS.length > 0)
            {
                allWebURLS.forEach(function(thisURL, uindex) 
                { 
                    var atleastOneValidEmail = false;
                    var thisEmailArr = thisURL.email; //array of email
                   //console.log(thisEmailArr);
                    //console.log(thisEmailArr.length);//count of all emails
                    if(thisEmailArr && thisEmailArr.length > 0)
                    {
                        thisEmailArr.forEach(function(thisEmail, eindex) 
                        { 
                            console.log(thisEmail);
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
                console.log(countHREFwithValidEmail);
                res.json(countHREFwithValidEmail);
            }else{
                res.json("Mongodb Error!! Found not weburls");
            }


        }
        
    });

});
function validMobile(thisMobile){
    var isMatch = thisMobile.match(/^[0-9]{10}$/)
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
       // console.log(allWebURLS);
       // console.log(allWebURLS.length);
        //array of all weburl
        if(err){
            res.json("Mongodb Error!!");
        }else{
            if(allWebURLS && allWebURLS.length > 0)
            {
                allWebURLS.forEach(function(thisURL, uindex) 
                { 
                    var atleastOneValidMobile = false;
                    var thisMobileArr = thisURL.mobile; //array of email
                   //console.log(thisEmailArr);
                    //console.log(thisEmailArr.length);//count of all emails
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

// app.post('/set',function(req,res)
// {
//     console.log("Boom");
//     console.log("Counting HREFs with atleast one valid mobile!");
//     var countHREFwithValidEmail = 0;
//     const q1 = weburls.find({$where: "this.email.length>0"},{email:1}).exec(function(err,item1){
//        // console.log(item);
//         if(!err && item1.length>0)
//         {   
//             item1.forEach(function(thisURL, uindex) 
//                 { 
//                     var atleastOneValidEmail = false;
//                     var thisEmailArr = thisURL.email; //array of email
//                    //console.log(thisEmailArr);
//                     //console.log(thisEmailArr.length);//count of all emails
//                     if(thisEmailArr && thisEmailArr.length > 0)
//                     {
//                         thisEmailArr.forEach(function(thisEmail, eindex) 
//                         { 
//                             console.log(thisEmail);
//                             if(validMobile(thisEmail))
//                             {
//                                 atleastOneValidEmail = true;
//                             }
//                         });
//                         if(atleastOneValidEmail)
//                         {
//                             countHREFwithValidEmail += 1;
//                         }
                        
//                     } 
//                 });
//                 console.log(countHREFwithValidEmail);
//               //  res.json(countHREFwithValidEmail);

//               console.log("Counting HREFs with atleast one valid mobile!");
//                  var countHREFwithValidMobile = 0;
//                 const q2= weburls.find({ $where: "this.mobile.length > 0" }, { mobile: 1 }).exec(function(err,item2)
//                     {
//                if(!err && item2.length > 0)
//                  {
//                 item2.forEach(function(thisURL, uindex) 
//                 { 
//                     var atleastOneValidMobile = false;
//                     var thisMobileArr = thisURL.mobile; //array of email
//                    //console.log(thisEmailArr);
//                     //console.log(thisEmailArr.length);//count of all emails
//                     if(thisMobileArr && thisMobileArr.length > 0)
//                     {
//                         thisMobileArr.forEach(function(thisMobile, eindex) 
//                         { 
//                             console.log(thisMobile);
//                             if(validMobile(thisMobile))
//                             {
//                                 atleastOneValidMobile = true;
//                             }
//                         });
//                         if(atleastOneValidMobile)
//                         {
//                             countHREFwithValidMobile += 1;
//                         }
                        
//                     } 
//                 });
//                 console.log(countHREFwithValidMobile);
//                // res.json(countHREFwithValidMobile);
//                               var obj={};
//                               obj.q1=countHREFwithValidEmail;
//                               obj.q2=countHREFwithValidMobile;
                              

//                               res.json(obj);
//                               console.log(obj);
                         
//              }
//         });
//     }
//         else
//         {
//                     console.log("Error: " + err);
//                     res.json({message: "Error in mongo"});
//         }   
//     });
// });   

app.get('/adding', function (req, res) {
    console.log("Counting HREFs with atleast one valid mobile!");
    var countHREFwithValidMobile = 0;
    var countHREFwithValidEmail = 0;
    var allWebURLS = weburls.find({$or: [{$where: "this.mobile.length>0"}, {$where: "this.email.length>0"}]},{_id:1}).exec(function (err, allWebURLS) {
       // console.log(allWebURLS);
       // console.log(allWebURLS.length);
        //array of all weburl
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
                     //array of email
                   //console.log(thisEmailArr);
                    //console.log(thisEmailArr.length);//count of all emails
                    if(thisMobileArr && thisMobileArr.length > 0)
                    {
                        thisMobileArr.forEach(function(thisMobile, eindex) 
                        { 
                            //console.log(thisMobile);
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
                        thisEmailArr.forEach(function(thisEmail, eindex) 
                        { 
                            //console.log(thisMobile);
                            if(validMobile(thisEmail))
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
                console.log(countHREFwithValidMobile);
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

// app.get('/mobile', function (req, res) {
    
//     weburls.find({ mobile: { $regex: pattern } }, { href: 1, mobile: 1 }).exec(function (err, item) {
//         res.json(item.length);
        // for(i=0;i<item.length;i++)
        // {
        //     if(pattern.matches(item))
        //         count++;
        // }
        // return count;
        // var obj={};
        // obj.q1=item.length;
        // res.json(item);
//     });
// });


app.listen(port);