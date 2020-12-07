const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const passport = require('passport');
//user model

const User = require('../models/User1')

const urlencodedParser = bodyParser.urlencoded({ extended: false })


//Login Page 
router.get('/login', (req, res) => res.render('login'));

//register page
router.get('/register', (req, res) => res.render('register'));

// router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/index', (req, res) => res.render('index'));
//welcome
router.get('/welcome', (req, res) => res.render('welcome'));
//register handle
router.post('/register', urlencodedParser ,(req, res) => {
    // res.send('welcome, ' + req.body.name)

    console.log(req.body);
    const { name, email, password, password2 } = req.body;
    let errors = [];
    
    //check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    //check password match
    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }
    //check pass length
    if(password.length < 6) {
        errors.push({msg: 'Password shouls be at least 6 characters'})
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name, 
            email, 
            password, 
            password2
        });

    } else {
        //validation passed
        User.findOne({email: email})
        .then(user => {
            if(user) {
                //user exist
                errors.push({msg: 'Email is already registered'})
                res.render('register', {
                    errors,
                    name, 
                    email, 
                    password, 
                    password2
                });
            } else {
                const newUser = new User({
                    name, 
                    email,
                    password
                });
                //hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //set password to hashed
                    newUser.password = hash;
                    //save user
                    newUser.save()
                      .then(user => {
                          res.redirect('/user/login');
                      })
                      .catch(err => console.log(err));
                }))

            }
        });
    }
});

//login handle
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/user/login',
        failureFlash: true
      })(req, res, next);

});


module.exports = router;