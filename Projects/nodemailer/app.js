const express=require('express');
const bodyParser=require('body-parser');
const hb=require('express-handlebars');
const nodemailer=require('nodemailer');
const schedule=require('node-schedule');
//const CronJob=require('cron').CronJob;
const mongoose=require('mongoose');
const moment=require('moment-timezone');
const assert=require('assert');

const app=express();
const path=require('path');


//view engine setup
app.engine('handlebars',hb()); //app.engine will load the handlebar view engine
app.set('view engine','handlebars'); //handlebars was made so that developers cant write a lot of Javascript logic inside the template

//static folder
app.use('/public', express.static(path.join(__dirname,'public'))); //mainly deals with css, javascript


//body parser middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json()); //read more about json

//route
app.get('/',function(req,res){
    res.render('mail');
   
        
   
});

//database connection
const conString="mongodb://jaya:jaya123@ds141274.mlab.com:41274/exambazaar";
const User = mongoose.model("sent", {
        email: String,
        CC: String,
        BCC: String,
        Subject: String,
        message: String,
        date: String,
        status:Boolean,
    });

mongoose.connect(conString);

mongoose.connection.on('error', function(error) {
console.error('Database connection error:', error);
});

mongoose.connection.once('open', function() {
console.log('Database connected');
});






app.post('/send',function(req,res)
{
    const output=`
    <p> Hey! you receive a new mail</p>
    <h1>message<h1>
    ${req.body.message};
    
    
    `;
    
    console.log(date);
    // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.kamakhyacreation.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user:'test@kamakhyacreation.com', 
                pass: 'jayanti@2' 
            },
            tls:{
                rejectUnauthorized:false
            }

        });


        const email=`
            ${req.body.email}
           
        `;
        const emailcc=`
          
            ${req.body.emailcc}
        `;

        

        const emailbcc=`
            ${req.body.emailbcc}
        `;

        const sub=`
             ${req.body.subject} 
        `;
        var date=req.body.date;
        
        console.log(date);

        const data =
         {
            email: req.body.email,
            CC: req.body.emailcc,
            BCC: req.body.emailbcc,
            Subject: req.body.subject,
            message: req.body.message,
            date:req.body.date,
            status:false,
        } 

        
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'jayantichoudhary16@gmail.com', // sender address
            to: email, // list of receivers
            subject: sub, // Subject line
            cc:emailcc,
            bcc:emailbcc,
            text: 'welcome to exambazaar', // plain text body
            html: output// html body
        };
        
        // send mail with defined transport object
        if(date!="")
        {
            console.log('if condition');
            const date=req.body.date;
            console.log(date);
            var a= moment(date).tz("Europe/London").format();
            console.log(a);
            res.render('mail',{msg:'Email Scheduled'+a});
            const j = schedule.scheduleJob(a, function(){
                  
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            

            
            var user = new User(data);
            user.save();
            console.log('database saved');    
        });
    }); 
    }else
    {
         
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('mail',{msg:'Email sent successfully'});
console.log('else');

            var user = new User(data);
            user.save();
            console.log('database saved');
            
        
            
            
        });
    }

    });

//mlab connection  
/*  
 app.post('/send',function(req,res)
 {
    const data = 
    {
        email: req.body.email,
        CC: req.body.emailcc,
        BCC: req.body.emailbcc,
        Subject: req.body.subject,
        message: req.body.message
    } 

    var user = new User(data);
    user.save();
    console.log('database saved');


});  */

//load the data
// app.get('/get-data',function(req,res)
//      {
//          var users={};

//          User.find({},function(err,users){
//             if(err)
//             {
//                 res.send('something went wrong');
//                 next();
//             }
          

//             res.render('mail' )


//          });



app.get('/get-data',function(req,res)
     {
         var users={};
         User.find({},function(err,users){
            if(err)
            {
                res.send('something went wrong');
                next();
            }
            res.render('mail',{User:users})
         });


         
        //resultArray.push();
        //res.render('mail',{items:resultArray});
        // query.exec('sent',function(doc)
        // {
        //     assert.equal(null,err);
        //     resultArray.push(doc);
        // });
        //res.render('mail',{items:resultArray});
        // User.find('close',function(){
        //             res.render('mail',{items:resultArray});
        // }); 
    //});
}); 
 
app.listen(process.env.PORT || 8010,()=>console.log('all ok'));

