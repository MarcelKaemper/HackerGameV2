var express = require('express');
var router = express.Router();
var pool = require('../public/javascripts/dbconn.js');
var pwh = require('password-hash');
var validateEmail = require('../public/javascripts/validateEmail.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Hackergame', loggedIn: req.session.loggedIn, id:req.session.userid});
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Sign up', message: req.query.error, loggedIn: req.session.loggedIn });
});

router.get('/login', function(req, res, next){
	res.render('login', {title: 'Login', message: req.query.error, loggedIn: req.session.loggedIn});
});

router.get('/logout', function(req,res,next){
	req.session.destroy();
	res.redirect('/');
});

router.post('/login', function(req,res,next){
	var login = req.body.login;
	var password = req.body.password;
	var exists = false;
	var sql; 

	// Define sql query for username or mail
	if(validateEmail(login)){
		sql = "SELECT * FROM logins WHERE mail='"+login+"'";
	}else{
		sql = "SELECT * FROM logins WHERE name='"+login+"'";
	}

	pool.getConnection(function(err, con){
		// Get the names and mail addresses
		con.query("SELECT name,mail FROM logins", function(err, results){
			// Check if the username exists
			for(var i in results){
				if(results[i].name == login || results[i].mail == login){
					exists = true;
					break;
				}
			}
			//If username or email exists in database
			if(exists){
				con.query(sql,function(err, results){
					con.release();
					// Compare entered pw to hashed pw
					// If password correct
					if(pwh.verify(password, results[0].password)){
						req.session.userid = results[0].id;
						req.session.loggedIn = true;
						res.redirect('/');
					// If password not correct
					}else{
						res.redirect('/login?error=loginFailed');
					}
				});
			// If login doesn't exists
			}else{
				con.release();
				res.redirect('/login');
		}
		});
	});


});

router.post('/signup', function(req, res, next){
	var mail = req.body.mail;
	var name = req.body.username;
	var password = req.body.password;

	var takenNames = [];
	var takenMails = [];

	pool.getConnection(function(err, con){
		var sql = "SELECT mail, name, id FROM logins";

		// Load the list of already taken emails and usernames
		con.query(sql, function(err, results){
			con.release();
			for(var i in results){
				takenNames.push(results[i].name);
				takenMails.push(results[i].mail);
			}
			//Check if the email format is correct, the password length, and
			//for duplicate emails and usernames
			if(validateEmail(mail) &&
				password.length >= 4 &&
				takenNames.indexOf(name) <= -1 &&
				takenMails.indexOf(mail) <= -1){

				password = pwh.generate(password);

				pool.getConnection(function(err, con){

				var sql = "INSERT INTO logins(mail, name, password) VALUES('"+mail+"','"+name+"','"+password+"')";	
				var sql2 = "INSERT INTO money(money,robbable) VALUES ('10000', '2500')";
				con.query(sql, function(err, results){
					con.query(sql2, function(err, results){
						con.release();
						res.redirect('/login');
					});
				});
			});
			//Redirect with error msg
			}else{
				res.redirect('signup?error=invalidEmail');
			}
		});
	});
});

module.exports = router;
