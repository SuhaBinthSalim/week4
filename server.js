const express = require('express');
const session = require('express-session');
const nocache = require('nocache');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret: "secrete",
    saveUninitialized:true,
    resave:false,
    cookie:{
        maxAge: 10000
    }
}))

app.use(nocache());

app.set('view engine','hbs');


const user = {
    username: "suha",
    password: "suha123"
}

app.get('/',(req,res)=>{

    if(req.session.loggedin) return res.redirect('/home');

    return (req.session.invalid)? res.render('login',{msg: 'Invalid Credentials'}) : res.render('login');
                
})

app.post('/verify',(req,res)=>{

    const {username , password} = req.body;

    if(req.session.loggedin) return res.redirect('/home');

    if(username != user.username || password != user.password){
        req.session.invalid = true;
        return res.redirect('/');
    }
    req.session.loggedin = true;
    req.session.invalid = false;
    res.redirect('/');
})


app.get('/home',(req,res)=>{
    if(!req.session.loggedin) return res.redirect('/');
    res.render('home');
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});


app.listen(3000,()=>{
    console.log("server is running");
})
