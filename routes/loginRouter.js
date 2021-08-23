var express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/home', async (req,res) => {
    try {
      res.render('home');
    } catch (err) {
      console.log(err)
    } 
});
  

router.get('/login', async (req,res) => {
    try{
      res.render('login')
    } catch (err) {
      res.render(404)
    }
  });

router.post('/login', passport.authenticate('customer-login', {
successRedirect: '/home',
failureRedirect: '/login',
failureFlash: true
}));

router.get('/register', async (req,res) => {
    try {
      res.render('register');
    } catch (err){
    res.render(404);
    }
});

router.post('/register', passport.authenticate('customer-signup', {
    successRedirect: '/home',
    failureRedirect: '/register',
    failureFlash: true
}));

router.post('/logout',function(req,res){
    console.log("logging out..")
    req.logout();
    req.flash('');
    res.redirect('back');
})

module.exports = router;