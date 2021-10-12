var express = require('express');
const { session } = require('passport');
const router = express.Router();
const passport = require('passport');




router.post("/login", (req, res, next) => {
	passport.authenticate("customer-login", (err, user, info) => {
	  if (err) throw err;
	  if (!user) res.send(false);
	  else {
		req.logIn(user, (err) => {
		  if (err) throw err;
		  res.send("Successfully Authenticated");
		  console.log(req.user);
		});
	  }
	})(req, res, next);
  });


  router.post("/register", (req, res, next) => {
	passport.authenticate("customer-signup", (err, user, info) => {
	  if (err) throw err;
	  if (!user) res.send(false);
	  else {
		req.logIn(user, (err) => {
		  if (err) throw err;
		  res.send("Successfully Authenticated");
		  console.log(req.user);
		});
	  }
	})(req, res, next);
  });


router.post('/logout',function(req,res){
    console.log("logging out..")
    req.logout();
    req.session.destroy();
    // req.flash('');
    res.send('succesfully logout');
})

module.exports = router;