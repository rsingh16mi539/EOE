var express = require('express');
var router = express.Router();
var { ensureAuthenticated } = require('../config/auth');
/* GET home page. */
router.get('/', (req, res) => res.render('welcome'));
//Dashboard
//router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    var User = req.session.passport.user;
    if (User.type === 1) {
        req.logout();
        res.redirect('/')
    } else {
        res.render('dashboard', {name: req.user.name});
    }
});

router.get('/admin_dashboard', ensureAuthenticated, (req, res) => {
    var User = req.session.passport.user;
    if (User.type === 1) {
        res.render('admin_dashboard', { name: req.user.name });
    } else {
        req.logout();
        res.redirect('/');
    }
});

module.exports = router;
