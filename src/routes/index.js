const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isNotLoggedIn, isloggedIn } = require('../lib/auth');


router.get('/', isNotLoggedIn, (req, res) => {
    res.render('index');
});

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('log/signin')
});

router.get('/admin/signin', isNotLoggedIn, (req, res) => {
    res.render('log/signin_admin')
});

router.get('/root/signin', isNotLoggedIn, (req, res) => {
    res.render('log/signin_root')
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    req.logOut();
    res.redirect('/');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/user/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.post('/admin/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin.admin', {
        successRedirect: '/admin/',
        failureRedirect: '/admin/signin',
        failureFlash: true
    })(req, res, next);
});

router.post('/root/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin.root', {
        successRedirect: '/root/',
        failureRedirect: '/root/signin',
        failureFlash: true
    })(req, res, next);
});

router.post('/root/signup', isNotLoggedIn, passport.authenticate('local.signup.root', {
    successRedirect: '/root/',
    failureRedirect: '/root/signin',
    failureFlash: true
}));



module.exports = router;