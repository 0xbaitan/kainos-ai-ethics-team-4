var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({dest: "db/curriculum-vitae/"})
var fs = require('fs');


const DashboardService = require("../services/dashboardService");
const dashboardService = new DashboardService();

const UserService = require("../services/userService");
const userService = new UserService();
const dayjs = require("dayjs");
const advancedFormat = require("dayjs/plugin/advancedFormat");

dayjs.extend(advancedFormat);


// Read all CVs
router.get('/', (req, res) => {
  const cvs = dashboardService.readDashboard();
  res.render("dashboard", { cvs: cvs, dayjs: dayjs, dashboardService: dashboardService })
});

router.get('/add', (req, res) => {
  res.render('dashboard/addCurriculumVita');
});

router.post('/add', upload.single("CV"), function(req, res) {

});


//view single item in table 
router.get("/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.render("error", { message: "Invalid user ID" });
  }

  const doesUserExist = userService.getUserById(userId);
  if (!doesUserExist) {
    return res.render("error", { message: "User not found" });
  }

  let cvs = dashboardService.getCurriculumVitaeByUserId(userId);
  if (!Array.isArray(cvs)) {
    cvs = [cvs];
  }
  console.log(cvs);
  res.render("dashboard", { cvs: cvs, dayjs: dayjs, dashboardService: dashboardService });
});

module.exports = router;
