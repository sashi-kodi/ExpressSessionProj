var express = require('express');
var app=express();
var bodyparser = require('body-parser');
var ejs= require('ejs');
var router = express.Router();
var users=[{name:'veda', password:'pass'}];

var session = require('express-session');
app.use(session({
    secret:'ilovenode',
    resave:true,
    saveUninitialized:true
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.use('/',router);

router.get('/', function(req,res){
    res.render('index',{message:""});
});

router.get('/profile/:name',checkauth,  function(req,res){
    var data={age:30, sal:100000, job:'UIDeveloper',hobbies:['coding', 'singing', 'reading']};
    res.render("profile", {person:req.params.name,data:data});
    
});
function checkauth(req,res,next){
    if(req.session.user){
        //user is authenticated 
        next();
    }
    else{
        console.log("not signed in.. pls login");
        res.render('index',{message:""});
    }
}
router.get('/logout', function(req,res){
    delete req.session.user;
    res.render('logout');
});
router.post('/login', function(req,res){
    
    var username =req.body.username;
    var passwd= req.body.passwd;
    var validuser = false;
    for(var i=0;i<users.length;i++){
        if(username=== users[i].name){
            if(passwd === users[i].password){
                validuser =true;
            }
        }
    }
    if(validuser){
        console.log("username and password are correct");
        req.session.user={name:username, password:passwd};
        console.log(req.session.user);
        res.redirect('/profile/'+ username);
    }
    else{
        res.render('index', {message:'Invalid credentials.. Please try again'});
    }
        
    
});
app.listen(3000);
console.log("server is listening at port 3000");

