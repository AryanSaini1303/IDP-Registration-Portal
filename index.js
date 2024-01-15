const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require("./auth");
const pg = require("pg");
var category;
var SDG_number;
var photo;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "IDP Registration Portal",
  password: "aryansaini9999",
  port: 5432,
});
db.connect();

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
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialised: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("login",{flag:false});
});

app.get("/category", (req, res) => {
  res.render("index");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account", // to prevent autoselecting of the account and give user an option to select
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/success", isLoggedIn, async (req, res) => {
  let result;
  let name, email, admission, enrollment, school, program, contact;
  photo=req.user.photos[0].value;
  // console.log(req.user.email);
  const response = await db.query("select * from student where email=$1", [
    req.user.email,
  ]);
  result = response.rows;
  result = result[0];
  // console.log(req.user.photos[0].value);//can't access photos of official ids, don't know why
  if (result == undefined) {
    res.render("login",{flag:true});
  } else {
    name = result.name ? result.name : "--";
    email = req.user.email ? req.user.email : "--";
    admission = result.admission ? result.admission : "--";
    enrollment = result.enrollment ? result.enrollment : "--";
    school = result.school ? result.school : "--";
    program = result.program ? result.program : "--";
    contact = result.contact ? result.contact : "--";
    // res.send(`hey ${req.user.displayName}, email: ${req.user.email}`)
    res.render("index", {
      name,
      email,
      photo,
      admission,
      enrollment,
      school,
      program,
      contact,
    });
  }
});
app.get("/auth/google/failure", isLoggedIn, (req, res) => {
  alert("Invalid user");
  res.redirect("/");
});
app.get("/auth/google/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.get("/Research", async (req, res) => {
  category='Research';
  // console.log(photo);
  res.render("SDG",{category,photo});
  });
  app.get("/Business", async (req, res) => {
  category='Business';
  // console.log(photo);
  res.render("SDG",{category,photo});
});
app.get("/Research/SDG", async (req, res) => {
  const query=req.query.q;
  SDG_number=query;
  // console.log(query);
  res.sendStatus(200);
  });
  app.get("/Business/SDG", async (req, res) => {
  const query=req.query.q;
  SDG_number=query;
  // console.log(query);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
