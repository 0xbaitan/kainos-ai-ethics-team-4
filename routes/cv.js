var express = require('express');
var router = express.Router();

const CVService = require('../services/cvService');
const cvService = new CVService();

// Create a new cv form
router.get('/add', (req, res) => {
  res.render('addCV')
});

// Create a new cv submit
router.post('/add', (req, res) => {
    const newCV = req.body;
    const createdCV = cvService.createCV(newCV);
    res.redirect('/cv/' + createdCV.id)
  });
  
  // Read all users
  router.get('/', (req, res) => {
    const cvs = cvService.getAllCVs();
    res.render('cv', { cvs: cvs })
  });
  
  // Read a user by ID
  router.get('/:id', (req, res) => {
    const cv = cvService.getCVById(parseInt(req.params.id));
    if (!cv) return res.status(404).send('CV not found');
    res.render('CV', { cv: cv })
  });
  /*
  // Update a user by ID form
  router.get('/update/:id', (req, res) => {
    const user = userService.getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.render('updateUser', {user: user})
  });
  
  // Update a user by ID
  router.post('/update/:id', (req, res) => {
    const updatedUser = userService.updateUser(parseInt(req.params.id), req.body);
    if (!updatedUser) return res.status(404).send('User not found');
    res.redirect('/users/' + updatedUser.id)
  });
  
  // Delete a user by ID form
  router.get('/delete/:id', (req, res) => {
    const user = userService.getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.render('deleteUser', {user: user})
  });
  
  // Delete a user by ID
  router.post('/delete/:id', (req, res) => {
    const deletedUser = userService.deleteUser(parseInt(req.params.id));
    if (!deletedUser) return res.status(404).send('User not found');
    res.redirect('/users')
  });
  */
  module.exports = router;
  