const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require("./auth");
const pg = require("pg");
const { parse } = require("dotenv");
var category;
var SDG_number;
var photo;
var school;
var student_id;
var teacher_id;
var data1;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "IDP Registration Portal",
  password: "aryansaini9999",
  port: 5432,
});
db.connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
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
// app.use(bodyParser.json()); // necessary to configure server to receive variables from xml requests
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
  res.render("login", { flag: false });
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
  let name, email, admission, enrollment, program, contact;
  photo = req.user.photos[0].value;
  const response = await db.query("select * from student where email=$1", [
    req.user.email,
  ]);
  result = response.rows;
  result = result[0];
  // console.log(result);
  // console.log(req.user.photos[0].value);//can't access photos of official ids, don't know why
  if (req.user.email == "idphead.gdgu@gmail.com") {
    res.render("admin");
  } else if (result == undefined) {
    res.render("login", { flag: true });
  } else {
    student_id = result.id;
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
app.get("/Research", (req, res) => {
  category = "Research";
  // console.log(photo);
  res.render("SDG", { category, photo, flag: false });
});
app.get("/Business", (req, res) => {
  category = "Business";
  // console.log(photo);
  res.render("SDG", { category, photo, flag: false });
});
app.get("/Research/SDG", (req, res) => {
  const query = req.query.q;
  SDG_number = query;
  // console.log(query);
  res.redirect("/topic");
});
app.get("/Business/SDG", (req, res) => {
  const query = req.query.q;
  SDG_number = query;
  // console.log(query);
  res.redirect("/topic");
});
app.get("/topic", async (req, res) => {
  let current_school = school;
  let available_topics = [];
  let available_topics_id = [];
  let teachers = [];
  let designation = [];
  const response = await db.query(
    "select distinct project_title,id,name,designation from faculty where project_type=$1 and sdg=$2",
    [category, SDG_number]
  );
  const result = response.rows;
  // console.log(result);
  if (result.length == 0) {
    res.render("SDG", { category, photo, flag: true });
  }
  result.forEach(async (element, index) => {
    let prohibitedSchools = [];
    let schoolFlag=true;
    const response3 = await db.query(
      "select school from student where teacher_id=$1",
      [element.id]
    );
    const result3 = response3.rows;
    result3.forEach((element1, index1) => {
      let count = 0;
      for (let i = index1 + 1; i < result3.length; i++) {
        if (element1.school == result3[i].school) {
          // console.log(element1.school);
          count++;
          if (count == 3) {
            prohibitedSchools.push(element1.school);
            break;
          }
        }
      }
    });
    // console.log("prohibitedSchools", prohibitedSchools);
    if (prohibitedSchools.includes(current_school)) {
      schoolFlag=false;
    }
    const response1 = await db.query(
      "select id from student where teacher_id=$1",
      [element.id]
    );
    const result1 = response1.rows;
    if(schoolFlag){
      if (result1.length < 6) {
        available_topics.push(element.project_title);
        available_topics_id.push(element.id);
        teachers.push(element.name);
        designation.push(element.designation);
      } else {
        // console.log(element.project_title);
        const response2 = await db.query(
          "select distinct school from student where teacher_id=$1",
          [element.id]
        );
        const distinct_schools = response2.rows;
        // the distinct_schools array contains two objects, each with a school property
        if (distinct_schools.length == 3 && result1.length < 8) {
          // console.log(element.project_title);
          available_topics.push(element.project_title);
          available_topics_id.push(element.id);
          teachers.push(element.name);
          designation.push(element.designation);
        } else if (distinct_schools.length == 2 && result1.length == 6) {
          available_topics.push(element.project_title);
          available_topics_id.push(element.id);
          teachers.push(element.name);
          designation.push(element.designation);
        } else if (
          distinct_schools.length == 2 &&
          result1.length == 7 &&
          !distinct_schools.some((obj) => obj.school === current_school)
        ) {
          // here we are selecting each object of array distinct_schools and we are comparing values of "school" property against our variable current_school
          available_topics.push(element.project_title);
          available_topics_id.push(element.id);
          teachers.push(element.name);
          designation.push(element.designation);
        } else if (
          distinct_schools.length == 1 &&
          result1.length == 6 &&
          !distinct_schools.some((obj) => obj.school === current_school)
        ) {
          available_topics.push(element.project_title);
          available_topics_id.push(element.id);
          teachers.push(element.name);
          designation.push(element.designation);
        }
      }
    }
    if (index == result.length - 1) {
      // console.log("available topics=>",available_topics);
      // console.log("available_topics_id",available_topics_id);
      // console.log("teachers",teachers);
      // console.log("designation",designation);
      res.render("topics", {
        available_topics,
        available_topics_id,
        teachers,
        designation,
      }); // we can't use this outside the forEach function as this function is set as async so if we render the file outside this function then the containers will be empty as the data assignment in those containers is taking place in an async function i.e. "forEach"
    }
  });
});
app.get("/confirmation", async (req, res) => {
  let sdg_list = [];
  const query = req.query.q;
  teacher_id = query;
  // res.sendStatus(200);
  const response = await db.query(
    "select name, project_title from faculty where id=$1",
    [teacher_id]
  );
  const result = response.rows;
  const response1 = await db.query(
    "select sdg from faculty where project_title=$1",
    [result[0].project_title]
  );
  const result1 = response1.rows;
  // console.log(result1);
  result1.forEach((element) => {
    // console.log(element);
    sdg_list.push(element.sdg);
  });
  // console.log(sdg_list);
  res.render("confirmation", {
    topic: result[0].project_title,
    SDG_number: sdg_list,
    teacher: result[0].name,
    photo,
  });
});
app.get("/selection", async (req, res) => {
  await db.query("update student set teacher_id=$1 where id=$2", [
    teacher_id,
    student_id,
  ]);
  res.render("final", [photo]);
});
function removeObjectsWithSameName(array) {
  const data = new Set();
  return array.filter((obj) => {
    if (!data.has(obj.name)) {
      data.add(obj.name);
      return true;
    }
    return false;
  });
}
app.get("/admin/view", async (req, res) => {
  const response = await db.query(
    "select name,id,project_title,score from faculty"
  );
  let data = response.rows;
  data = removeObjectsWithSameName(data);
  const response1 = await db.query("select * from student");
  data1 = response1.rows;
  // console.log("result", data1);
  res.render("view", { data, data1, flag1 });
  flag1 = false;
});
let flag1 = false;
app.get("/admin/score", async (req, res) => {
  const response = await db.query("select name,id,project_title from faculty");
  let data = response.rows;
  data = removeObjectsWithSameName(data);
  const response1 = await db.query("select * from student");
  data1 = response1.rows;
  // console.log("result", data1);
  res.render("score", { data, data1, flag1 });
  flag1 = false;
});
app.get("/search", async (req, res) => {
  const query = req.query.q.replace(/\b\w/g, (match) => match.toUpperCase());
  // console.log(query);
  try {
    const response = await db.query(
      "SELECT * FROM faculty WHERE LOWER(name) LIKE $1",
      [`%${query.toLowerCase()}%`]
    );
    const result = response.rows;
    const data = removeObjectsWithSameName(result);
    // console.log(
    //   "here======================================================>",
    //   data
    // );
    const combinedData = {
      data: data,
      data1: data1,
    };
    res.json(combinedData);
  } catch (error) {
    console.log(error);
  }
});
app.post("/scoring", async (req, res) => {
  // console.log(req.body);
  const student_ids = req.body.student_ids;
  const teacher_id = req.body.teacher_id;
  // console.log(teacher_id);
  let criteria1Marks = req.body.Criteria1;
  criteria1Marks = criteria1Marks.map(function (id) {
    return parseInt(id, 10);
  });
  let criteria2Marks = req.body.Criteria2;
  criteria2Marks = criteria2Marks.map(function (id) {
    return parseInt(id, 10);
  });
  let criteria3Marks = req.body.Criteria3;
  criteria3Marks = criteria3Marks.map(function (id) {
    return parseInt(id, 10);
  });
  let criteria4Marks = req.body.Criteria4;
  criteria4Marks = criteria4Marks.map(function (id) {
    return parseInt(id, 10);
  });
  let criteria5Marks = req.body.Criteria5;
  criteria5Marks = criteria5Marks.map(function (id) {
    return parseInt(id, 10);
  });
  // console.log(criteria1Marks);
  // const studentsFinalMarks = [];
  let groupFinalMarks = 0;
  for (let i = 0; i < student_ids.length; i++) {
    let marks =
      criteria1Marks[i] +
      criteria2Marks[i] +
      criteria3Marks[i] +
      criteria4Marks[i] +
      criteria5Marks[i];
    groupFinalMarks += marks;
    await db.query("update student set total=$1 where id=$2", [
      marks,
      student_ids[i],
    ]);
  }
  await db.query("update faculty set score=$1 where id=$2", [
    groupFinalMarks,
    teacher_id,
  ]);
  // console.log(studentsFinalMarks);
  flag1 = true;
  res.redirect("/admin/score");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
