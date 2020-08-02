const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signin', (req, res) => {
    res.render('log/signin')
});

router.get('/admin/signin', (req, res) => {
    res.render('log/signin_admin')
});

router.get('/root/signin', (req, res) => {
    res.render('log/signin_root')
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('message', "session finaliced");
    req.session.destroy();
    res.redirect('/');
});

router.post('/signin', (req, res) => {

});

router.post('/admin/signin', (req, res) => {

});

router.post('/root/signin', (req, res, next) => {
    passport.authenticate('local.signin.root', {
        successRedirect: '/root/',
        failureRedirect: '/root/signin',
        failureFlash: true
    })(req, res, next);
});

router.post('/root/signup', passport.authenticate('local.signup.root', {
    successRedirect: '/root/',
    failureRedirect: '/root/signin',
    failureFlash: true
}));



module.exports = router;