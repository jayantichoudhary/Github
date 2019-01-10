var express = require('express');
//var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var weburls = require('./models/weburls');
var app = express();
var url = "mongodb://localhost:27017/admin";
var port = 3000;
 
// all environments
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect(url, { useNewUrlParser: true });

app.get('/weburls/:domainname', function(req,res,next){
    var domainname=req.params.domainname;
    weburls.find({domain : domainname},function(err,eachOne) {
        if(err || eachOne.length<=0)
        {
            res.send('No domain name '+domainname+' found in the schema');
            next(err);
        }
        else{
            res.json(eachOne.length);
        }
    });
});


app.post('/weburls/report',function(req,res)
{
    console.log("Boom");
    const q1 = weburls.find({$or: [{$where: "this.phone.length>0"}, {$where: "this.mobile.length>0"}, {$where: "this.email.length>0"}]},{_id:1}).exec(function(err,item1){
        console.log("boom1");
        if(!err && item1)
        {   
            const q2= weburls.find({isCrawled : false, depth : 1},{_id:1}).exec(function(err,item2){   
                console.log("boom2");
                if(!err && item2)
                {
                    const q3= weburls.find({isCrawled : true},{_id:1}).exec(function(err,item3){
                        console.log("boom3");
                        if(!err && item3)
                        {
                              var obj={};
                              obj.q1=item1.length;
                              obj.q2=item2.length;
                              obj.q3=item3.length;

                              res.json(obj);
                            console.log(obj);
                        }    
                    });
                }
                
            });


        }
        else
        {
                    console.log("Error: " + err);
                    res.json({message: "Error in mongo"});
        }
            });    
    });
    // var q2= weburls.findOne({isCrawled : false, depth:1}).exec(function(err,item2){
    //     res.json(item2);
    // });

    // var q3=weburls.findOne({isCrawled : true}).exec(function(err,itm){
    //     res.json(itm);
    // })
    // var q2 = weburls.find({},{}).exec(function(error, q2){

    // });
    //  var q3 = weburls.find({},{}).exec(function(error, q3){

    //  });



// app.get('/weburls/:domainname', function(req,res){
//         var domainname=req.params.domainname;
//     	weburls.find({domain : domainname}).then(eachOne => {
//         res.json(eachOne.length);
//         console.log(eachOne);
//     	});
//     });
//app.use(express.static(path.join(__dirname, 'public')));
 
// mongoose.Promise = global.Promise;
// mongoose.set('useCreateIndex', true)



// app.get('/dbusiness/:var1', function(req, res){
//     //console.log('home');
//     var var1 = req.params.var1;
    
//     if(var1 == "2"){
//         res.json(var1);
//     }else{
//         weburls.find({domain:"business"}).then(eachOne => {
//             res.json(eachOne.length);
//             //console.log(eachOne);
//             });
//     }
    

	
// });

// app.post('/thisisapostrequest', function(req, res){
//     var infoSent = req.body;
//     console.log(infoSent);
//     res.json(true);
// });
// app.get('/dgt2', function(req, res){
//     console.log('home');
// 	weburls.find({depth: {'$gt':2}}).then(eachOne => {
//     res.json(eachOne);
//     console.log(eachOne);
// 	});
// });
// app.get('/errort', function(req, res){
//     console.log('home');
// 	weburls.find({"_error":true}).then(eachOne => {
//     res.json(eachOne);



//     console.log(eachOne);
// 	});
// });
// app.get('/uph', function(req, res){
//     console.log('home');
// 	weburls.find({ "url.protocol": "http:"}).then(eachOne => {
//     res.json(eachOne);
//     console.log(eachOne);
// 	});
// });


app.listen(port, function(){
    console.log('hii i am listing to '+port);
})
