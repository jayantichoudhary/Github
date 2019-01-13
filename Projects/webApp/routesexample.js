var express=require ('express');
var bodyparser=require('body-parser');
var mongoose=require('mongoose');
var path=require('path');
var weburls=require('./models/weburls.js');
var app=express();
var url = "mongodb://localhost:27017/admin";
var port = 3010;

 
// all environments
app.set('port', process.env.PORT || 3010);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

mongoose.connect(url, { useNewUrlParser: true });

app.get('/weburls/:a',function(req,res)
{
    var var1=req.params.a;
    console.log(var1);
    res.json(var1);
});

app.get('/:b',function(req,res)
{
    console.log(req);
    var var2=req.params.b;
    console.log(var2);
    res.json(var2);
});

app.get('/meme/json',function(req,res)
{
    var var3;
    res.json(var3);
    //in this case it would return nothing
});

app.get('/web/request/:a/run/:b',function(req,res)
{
    var var3=req.body.a;
    var var4=req.body.b;
    res.json(var3);
    //in this case it would return nothing
});



app.listen(port, function(){
    console.log('hii i am listing to '+port);
})