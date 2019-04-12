var express = require('express');
var router = express.Router();
var passport = require('passport');

//User model
var User = require('../models/User');
var Admin = require('../models/Admin');
var Choice = require('../models/Choice');
var Subject = require('../models/Subject');

/* GET users listing. */
//Student login
router.get('/student_login', (req, res) => res.render('student_login'));

//Student Login Handle
router.post('/student_login', (req, res, next) => {
    passport.authenticate('student_login', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/student_login',
        failureFlash: true
    })(req, res, next);
});

//Student Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You Are Logged Out Successfully');
    res.redirect('/users/student_login');
});

//Admin Register
// router.post('/admin_login', (req, res) => {
//     console.log(req.body);
//     var { admin_id, password } = req.body;
//     var name = 'ABD';
//     var newAdmin = new Admin({
//         name,
//         admin_id,
//         password
//     });
//     newAdmin.save()
//         .then(admin => {
//             req.flash('success_msg', 'You are now registered and can log in');
//             res.redirect('/users/admin_login');
//         })
//         .catch(err => console.log(err));
// });

//Submit
router.post('/submit', (req, res) => {
    async function saveChoice(user) {
        var student_id = user.student_id;
        var cgpi = user.cgpi;
        var branch = user.branch;
        var subjects = await Subject.find({branch: {$nin: branch}}).exec();
        if (subjects.length === 0) {
            console.log('Subjects Not Found');
        } else {
            var subject_name = [];
            var choices = [];
            var sub;
            var formData = req.body;
            for (var i = 0; i < subjects.length; i++) {
                sub = subjects[i].subject_name;
                subject_name.push(sub);
                choices.push(formData[sub]);
            }
            User.findOneAndUpdate({student_id: student_id}, {$set: {filled: true}}, {new: true}, (err, doc) => {
                if (err) {
                    console.log("Something Wrong While Updating Data!");
                }
                console.log('Filled Set To True');
                console.log(doc);
            });
            var newChoice = new Choice({
                subject_name,
                student_id,
                choices,
                cgpi
            });
            newChoice.save()
                .then(choice => {
                    console.log('Choices Filled Successfully');
                    console.log(choice);
                })
                .catch(err => console.log(err));
        }
    }

    saveChoice(req.session.passport.user);
    req.logout();
    req.flash('success_msg', 'You Have Filled The Choices Successfully');
    res.redirect('/users/student_login');
});


module.exports = router;
