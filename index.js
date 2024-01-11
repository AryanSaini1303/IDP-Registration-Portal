const express=require('express')
const bodyParser=require('body-parser');
const passport=require('passport');
const session=require('express-session');
require('./auth');

const app = express();
const port = 3000;
app.use(
  "/public",
  express.static("public", {
    extensions: ["css"],
    setHeaders: (res, path, stat) => {
      res.set("Content-Type", "text/css");
    },
  })
);
app.use(bodyParser.json()); // necessary to configure server to receive variables from xml requests
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(
  "/scripts",
  express.static("scripts", {
    extensions: ["js"],
    setHeaders: (res, path, stat) => {
      res.set("Content-Type", "application/javascript");
    },
  })
);
function isLoggedIn(req,res,next){
  req.user?next():res.sendStatus(401);
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret:'mysecret',
  resave:false,
  saveUninitialised:true,
  cookie:{secure:false}
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
  res.render('login');
})

app.get("/category", (req, res) => {
  res.render("index");
});

app.get('/auth/google',
  passport.authenticate('google', { 
    scope:[ 'email', 'profile' ],
    prompt:'select_account'// to prevent autoselecting of the account and give user an option to select 
    }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/success',isLoggedIn,(req,res)=>{
  // console.log(req.user);
  // res.send(`hey ${req.user.displayName}, email: ${req.user.email}`)
  res.render('index',{name:req.user.displayName,email:req.user.email,photo:req.user.photos[0].value});
})
app.get('/auth/google/failure',isLoggedIn,(req,res)=>{
  alert("Invalid user");
  res.redirect('/');
})
app.get('/auth/google/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
