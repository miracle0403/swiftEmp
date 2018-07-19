var express = require('express');
var passport = require('passport');
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var router = express.Router();
var db = require('../db.js');
var expressValidator = require('express-validator');

var bcrypt = require('bcrypt');
const saltRounds = 15;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  console.log(req.isAuthenticated())
  res.render('index', { title: 'SWIFT EMPOWER' });
});

// get join
router.get('/join', authentificationMiddleware(), function (req, res, next) {
  res.render('join', {title: "JOIN MATRIX"});
});

// get terms and conditions
router.get('/terms', function (req, res, next) {
  res.render('terms', {title: "TERMS AND CONDITIONS"});
});

// get fast teams
router.get('/fastteams', function (req, res, next) {
  res.render('fastteams', {title: "FASTEST TEAMS"});
});

//test flash
router.get('/addFlash', function (req, res) {
  req.flash('info', 'Flash Message Added');
  res.redirect('/');
});

//get register with referral link
router.get('/register/:username', function(req, res, next) {
  const db = require('../db.js');
  var username = req.params.username;
  // get the list of supported countries
  db.query('SELECT * FROM countries_supported', function(err, results, fields){
    if (err) throw err;
    var country = results;
    //get the sponsor name on the registration page
    db.query('SELECT username FROM user WHERE username = ?', [username],
    function(err, results, fields){
      if (err) throw err;

      if (results.length === 0){
        res.render('register')
        console.log('not a valid sponsor name');
      }else{
        var sponsor = results[0].username;
        console.log(sponsor)
        if (sponsor){
          console.log(JSON.stringify(sponsor));
          res.render('register', { title: 'REGISTRATION', country: country, sponsor: sponsor });
        }     
      }
    });  
  });
});

//register get request
router.get('/register', function(req, res, next) {
  // get the list of supported countries
  db.query('SELECT * FROM countries_supported', function(err, results, fields){
    if (err) throw err;
    var country = results;
    res.render('register', { title: 'REGISTRATION', country: country });
  });
});

//get login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOG IN'});
});

//get referrals
router.get('/referrals', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  //get sponsor name from database to profile page
  db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    var sponsor = results[0].sponsor;
    db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      //get the referral link to home page
      var website = "localhost:3002/";
      var user = results[0].username;
      var reg = "register/";
      var link = website + user;
      var register = website + reg + user
      db.query('SELECT * FROM user WHERE sponsor = ?', [user], function(err, results, fields){
        if (err) throw err;
        console.log(results)
        res.render('referrals', { title: 'Referrals', register: register, referrals: results, sponsor: sponsor, link: link});
      });
    });
  });
});
 

//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//get dashboard
router.get('/dashboard', authentificationMiddleware(), function(req, res, next) {
  var db = require('../db.js');
  var currentUser = req.session.passport.user.user_id;

  //get sponsor name from database to profile page
  db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;

    var sponsor = results[0];
    if (sponsor){
      res.render('dashboard', { title: 'USER DASHBOARD', sponsor:sponsor });
    }
  });
});

//get profile
router.get('/profile', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  //get user details to showcase
  db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    console.log(results)
    //get from profile table
    db.query('SELECT * FROM profile WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      console.log(results)
      res.render('profile', {title: 'PROFILE'});
    });
  });
});


//post register
router.post('/register', function(req, res, next) {
  console.log(req.body) 
  req.checkBody('sponsor', 'Sponsor must not be empty').notEmpty();
  req.checkBody('sponsor', 'Sponsor must be between 8 to 25 characters').len(8,25);
  req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100);
  req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100);
  req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
  req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('code', 'Country Code must not be empty.').notEmpty();
  req.checkBody('pass1', 'Password must match').equals(req.body.pass2);
  req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  //req.checkBody('pass1', 'Password must have upper case, lower case, symbol, and number').matches(/^(?=,*\d)(?=, *[a-z])(?=, *[A-Z])(?!, [^a-zA-Z0-9]).{8,}$/, "i")
 
  var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('register', { title: 'REGISTRATION FAILED', errors: errors});
    //return noreg
  }
  else {
    var username = req.body.username;
    var password = req.body.pass1;
    var cpass = req.body.pass2;
    var email = req.body.email;
    var sponsor = req.body.sponsor;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;

    var db = require('../db.js');
    
    //check if sponsor is valid
    db.query('SELECT username FROM user WHERE username = ?', [sponsor], function(err, results, fields){
      if (err) throw err;
      if(results.length===0){
        var sponsor = "This Sponsor does not exist"
        console.log(sponsor);
        res.render('register', {title: "REGISTRATION FAILED", sponsor: sponsor});
      }else{
        db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          if (err) throw err;
          if(results.length===1){
            var error = "Sorry, this username is taken";
            console.log(error)
            res.render('register', {title: "REGISTRATION FAILED", error: error});
          }else{
            db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){ 
              if (err) throw err;
              if(results.length===1){ 
                var error = "Sorry, this email is taken";
                console.log(error);
                res.render('register', {title: "REGISTRATION FAILED", email: error});
              }else{
                bcrypt.hash(password, saltRounds, function(err, hash){
                  db.query('INSERT INTO user (sponsor, full_name, phone, code, username, email, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [sponsor, fullname, phone, code, username, email, hash, 0], function(error, result, fields){
                    if (error) throw error;
                    console.log(hash);
                    console.log(results);
                    res.render('register', {title: "REGISTRATION SUCCESSFUL"});  
                  });
                });
              }
            });
          }
        });
      }
    });
  }
});
//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});


//get function for pin and serial number
function pin(){
  var charSet = new securePin.CharSet();
  charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
  securePin.generatePin(10, function(pin){
    console.log("Pin: "+ pin);
    securePin.generateString(10, charSet, function(str){
      console.log(str);
      bcrypt.hash(pin, saltRounds, function(err, hash){
        db.query('INSERT INTO pin (pin, serial) VALUES (?, ?)', [hash, str], function(error, results, fields){
          if (error) throw error;
          //console.log(results)
        });
      });
    });
  });
}
pin(); 
//authentication middleware snippet 
function authentificationMiddleware(){
  return (req, res, next) => {
    console.log(JSON.stringify(req.session.passport));
  if (req.isAuthenticated()) return next();

  res.redirect('/login'); 
  } 
}

//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/dashboard'
}));

//post profile
router.post('/profile', function(req, res, next) {
  console.log(req.body) 
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  req.checkBody('email', 'Email must be between 8 to 25 characters').len(8,25);
  req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('code', 'Country code must not be empty.').notEmpty();
  req.checkBody('account_number', 'Account Number must not be empty.').notEmpty();
  req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  //req.checkBody('pass1', 'Password must have upper case, lower case, symbol, and number').matches(/^(?=,*\d)(?=, *[a-z])(?=, *[A-Z])(?!, [^a-zA-Z0-9]).{8,}$/, "i")
 
  var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('profile', { title: 'UPDATE FAILED', errors: errors});

  }
  else {
    var password = req.body.password;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
    var bank = req.body.bank;
    var accountName = req.body.AccountName;
    var accountNumber = req.body.account_number;
    var currentUser = req.session.passport.user.user_id;

    //get sponsor name from database to profile page
    db.query('SELECT password FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      const hash = results[0].password;
      //compare password
      bcrypt.compare(password, hash, function(err, response){
        if(response === false){
          res.render('profile', { title: 'Profile Update failed', error: "Password is not correct"});
        }else{
          //check if email exist
          db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
            if (err) throw err;

            if (results.length===1){
              console.log('email exists')
              res.render('profile', { title: 'Profile Update failed', error: "Email exist in the database"});
            }else{
              //update user
              db.query('UPDATE user SET email = ?, full_name = ?, code = ?, phone = ? WHERE user_id = ?', [email, fullname, code, phone, currentUser], function(err, results,fields){
                if (err) throw err;

                //check if user has updated profile before now
                db.query('SELECT user_id FROM profile WHERE user_id = ?', [currentUser], function(err, results, fields){
                  if (err) throw err;
      
                  if (results.length===0){
                    db.query('INSERT INTO profile (user_id, bank, account_name, account_number) VALUES (?, ?, ?, ?)', [currentUser, bank, accountName, accountNumber], function(error, result, fields){
                      if (error) throw error;
                      console.log(results);
                      res.render('profile', {title: "UPDATE SUCCESSFUL"});  
                    });
                  }else{
                    db.query('UPDATE profile SET bank = ?, account_name = ?, account_number = ? WHERE user_id = ?', [bank, accountName, accountNumber, currentUser], function(err, results,fields){
                      if (err) throw err;
                      console.log(results);
                      res.render('profile', {title: "UPDATE SUCCESSFUL"});  
                    });
                  }
                });
              });
            }
          });
        }
      });
    });
  }
});

// post join
router.post('/join',  function (req, res, next) {
  var pin = req.body.pin;
  var serial = req.body.serial;
  var currentUser = req.session.passport.user.user_id;
  console.log(req.body);
  //console.log(currentUser)

  //get the particular serial and pin from the database
  db.query('SELECT * FROM pin WHERE serial = ?', [serial], function(err, results, fields){
    if (err) throw err;
    if(results.length === 0){
      console.log('serial does not exist');
      res.render('join', {title: 'MATRIX UNSUCCESSCUL!'})
    }else{
      const hash = results[0].pin;
      bcrypt.compare(pin, hash, function(err, response){
        if(response === false){
          console.log('the pin or serial number does not exist');
          res.render('join', {title: 'MATRIX ENTRANCE UNSUSSESSFUL!'})
        }else{
          for( var i = 0; i < results.length; i++ );
          var user = results[i].user_id;
          console.log(user); 
          //make sure no one has used the pin before
          if(user !== null){
            console.log('pin has been  used already!');
            res.render('join', {title: 'MATRIX ENTRANCE UNSUSSESSFUL!'});
          }else{
            //check if the user has joined the matrix before now
            db.query('SELECT user_id FROM pin WHERE user_id = ?', [currentUser], function(err, results, fields){
              if (err) throw err;
              console.log('user id is ' + results[0]); 
              if(results.length===1){
                console.log('sorry, you are already in the matrix!');
                res.render('join', {title: 'UNSUCCESSFUL!'});
              }else{
                db.query('UPDATE pin SET user_id = ? WHERE serial = ?', [currentUser, serial], function(err, results,fields){
                  if (err) throw err;
                  console.log(results);
                  //select sponsor from user
                  db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
                    if (err) throw err;
                    var sponsor = results[0].sponsor;
                    console.log('sponsor name is:' + sponsor);
                    //get the sponsor id
                    db.query('SELECT user_id FROM user WHERE username = ?', [sponsor], function(err, results, fields){
                      if (err) throw err;
                      var id = results[0].user_id;
                      console.log('sponsor id is ' + id);
                      //change user to a paid member
                      db.query('UPDATE user SET paid = ? WHERE user_id = ?', ["yes", currentUser], function(err, results,fields){
                        if (err) throw err;
                        console.log(results);
                        //enter user to prestarter tree 
                        db.query('SELECT paid FROM user WHERE user_id = ?', [id], function(err, results, fields){
                          if (err) throw err; 
                          console.log(results)
                          var paid = results[0].paid;  
                          console.log('the paid value is ' + paid);
                          //if sponsor is paid
                          if(paid == "yes"){ 
                            //get the nodes and check if the user has completed or if he is empty...
                            db.query('SELECT * FROM prestarter WHERE user = ?', [id], function(err, results, fields){
                              if (err) throw err;
                              //assign variables to nodes
                              var level  = {
                                left: results[0].lft,
                                right: results[0].rgt,
                                user: results[0].user,
                                sponsor: results[0].sponsor
                              }
                              if (right === left + 1){
                                //add two to all greater nodes. search for them all.
                                db.query('SELECT * FROM prestarter WHERE rgt > ?', [level.left], function(err, results, fields){
                                  if (err) throw err;
                                  //loop with for
                                  for(var i = 0; i<results.length; i++);
                                  // create the variables
                                  var add1 = {
                                    left: results[i].length,
                                    right: results[i].length,
                                    user: results[i].length
                                    }
                                    //check if the left side is less than the level.left.
                                      if (add1.left > level.left){
                                        //add two to it
                                        add1.left += 2;
                                        //update in the database
                                        db.query('UPDATE starter SET lft = ? WHERE user = ?', [add1.left, add1.user], function(err, results,fields){
                                          if (err) throw err;
                                          //increase the immediate right by one.
                                          level.right += 1;
                                          db.query('UPDATE starter SET rgt = ? WHERE user = ?', [level.right, level.user], function(err, results,fields){
                                            if (err) throw err;
                                            //insert the user in the matrix
                                            db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                                              if (error) throw error;
                                            });
                                          });
                                        });
                                      }
                                      //if the right is greater
                                      if(add1.right > level.left){
                                        //add two to it
                                        add1.right += 2;
                                        //update in the database
                                        db.query('UPDATE starter SET rgt = ? WHERE user = ?', [add1.right, add1.user], function(err, results,fields){
                                          if (err) throw err;
                                          //increase the immediate right by one.
                                          level.right += 1;
                                          db.query('UPDATE starter SET rgt = ? WHERE user = ?', [level.right, level.user], function(err, results,fields){
                                            if (err) throw err;
                                            //insert the user in the matrix
                                            db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                                              if (error) throw error;
                                            });
                                          });
                                        });
                                      }
                                    });
                                  }
                              //if the person has two people
                              if (right === left + 3){
                                //add two to all greater nodes. search for them all.
                                db.query('SELECT * FROM prestarter WHERE rgt > ?', [level.left], function(err, results, fields){
                                  if (err) throw err;
                                  //loop with for
                                  for(var i = 0; i <results.length; i++);
                                  // create the variables
                                  var add2 = {
                                    left: results[i].length,
                                    right: results[i].length,
                                    user: results[i].length
                                  }
                                  //check if the left side is less than the level.left.
                                  if (add2.left > level.left){
                                    //add two to it
                                    add2.left += 2;
                                    //update in the database
                                    db.query('UPDATE starter SET lft = ? WHERE user = ?', [add2.left, add2.user], function(err, results,fields){
                                      if (err) throw err;
                                      //insert the user in the matrix
                                      db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                                        if (error) throw error;
                                      });
                                    });
                                  }
                                  //if the right is greater
                                  if(add2.right > level.left){
                                    //add two to it
                                    add2.right += 2;
                                    //update in the database
                                    db.query('UPDATE starter SET rgt = ? WHERE user = ?', [add2.right, add2.user], function(err, results,fields){
                                      if (err) throw err;
                                      //insert the user in the matrix
                                      db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                                        if (error) throw error;
                                      });
                                    });
                                  }
                                });    
                              }
                              //if the person has two people
                              if (right === left + 5){
                                //add two to all greater nodes. search for them all.
                                db.query('SELECT * FROM prestarter WHERE rgt > ?', [level.left], function(err, results, fields){
                                  if (err) throw err;
                                  //loop with for
                                  for(var i = 0; i <results.length; i++);
                                  // create the variables
                                  var add2 = {
                                    left: results[i].length,
                                    right: results[i].length,
                                    user: results[i].length
                                  }
                                  //check if the left side is less than the level.left.
                                  if (add2.left > level.left){
                                    //add two to it
                                    add2.left += 2;
                                    //update in the database
                                    db.query('UPDATE starter SET lft = ? WHERE user = ?', [add2.left, add2.user], function(err, results,fields){
                                      if (err) throw err;
                                      //insert the user in the matrix
                                      db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                                        if (error) throw error;
                                      });
                                    });
                                  }
                                  //if the right is greater
                                  if(add2.right > level.left){
                                    //add two to it
                                    add2.right += 2;
                                    //update in the database
                                    db.query('UPDATE starter SET rgt = ? WHERE user = ?', [add2.right, add2.user], function(err, results,fields){
                                      if (err) throw err;
                                      //insert the user in the matrix
                                      db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                                        if (error) throw error;
                                      });
                                    });
                                  }
                                });    
                              }    
                            });
                          }
                        });
                      });
                    });
                  });
                });
              }
            });
          }
        }
      });
    }
  });
});
module.exports = router;