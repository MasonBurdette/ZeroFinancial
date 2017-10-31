//
//	ZeroFinancial Referral Generator
//	github.com/masonburdette
//

// edit the variables below
const referralCode = 'REFERRAL CODE GOES HERE'; // the code you were given after signup
const identifier = 'masonburdette'; // string applied to the disposable email (make this unique to you)
const amount = 100; // amount of accounts to make
const wait = 50; // time to wait after signups (in milliseconds)

// range for random number in gmail jig
const min_int = 1;
const max_int = 10000;

// module for clearing the console
const clear = require('clear');
clear();

// module for sending HTTP requests
const request = require('request');
request.defaults = {
	gZip: true,
	followAllRedirects: true
};

// function that returns a fake email
function createRandomEmail() {
	let mainEmail = '{}@maildrop.cc'; // catchall email
	let number = Math.floor(Math.random() * max_int) + min_int; // defines a random number between min_int and max_int
	let email = mainEmail.replace('{}', identifier + number);
	return email;
}

// function to make a signup
function signUp(email) {
	console.log('--');
	console.log(email);
	let form = {
		'email': email,
		'access_code': referralCode,
		'is_mobile': false,
		'source': 'none',
		'campaign': 'none'
	};
	request({
		url: 'https://zerofinancial.com/api/v1/user/',
		method: 'POST',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
			'Content-Type': 'application/json'
		},
		form: form
	}, function(err, res, body) {
		let parsed_response = JSON.parse(body);
		if (res.statusCode == 200) {
			console.log("Successfully created a signup!");
			setTimeout(function() {
				signUp(createRandomEmail())
			}, wait)
		} else if (res.statusCode == 400) {
			if (parsed_response["error"]["error_code"] == "3") {
				console.log("You have been most likely flagged by ZeroFinancial.");
				process.exit();
			} else if (parsed_response["error"]["error_code"] == "2") {
				console.log("The email sent was already registered!");
				setTimeout(function() {
					signUp(createRandomEmail())
				}, wait)
			}
		} else {
			console.log("An unknown response was returned.");
			process.exit();
		}
	})
}

//init
console.log('/////////////////////////////////////\n  ZeroFinancial Referral Generator\n  github.com/masonburdette\n/////////////////////////////////////\n\n');
signUp(createRandomEmail());
