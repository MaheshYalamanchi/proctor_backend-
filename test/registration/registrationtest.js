const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Registration Test Cases', function () {
    it('Registration api call', function (done) {
        var async_function = async () => {
            var input = {
                full_name: "Pradeep",
                email: "pradeepkumar.j@cintanatech.com",
                term_condition: true
            }
            var body = await axios.post('http://localhost:3001/registration', input);
            if (body.success == true) {
                if (body.message == 'Activation link had been sent to your registered email.') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Activation link had been sent to your registered email.'");
                    expect(body.data).to.equal(body.data.length > 1);
                }
            }
            else if (body.success == false) {
                if (body.message == 'Registration Link has been already sent to this email id') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Registration Link has been already sent to this email id'");
                }
                else if (body.message == 'User Already mapped to a group') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'User Already mapped to a group'");
                }
            }
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('OTP send api call', function (done) {
        var async_function = async () => {
            var input = {
                mobile_number: 9566232823
            }
            var body = await axios.post('http://localhost:3001/otpsend', input);
            if (body.success == true) {
                if (body.message) {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal(body.message.length > 1);
                }
            }
            else if (body.success == false) {
                if (body.message) {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);
                }
            }
        }
        async_function();
        done();
    });
    it('Verify OTP api call', function (done) {
        var async_function = async () => {
            var input = {
                mobile_number: 9566232823,
            }
            var body = await axios.post('http://localhost:3001/verifyotp', input);
            if (body.success == true) {
                if (body.message == ' OTP verified successfully.') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("' OTP verified successfully.'");
                    expect(body.data).to.equal(body.data.length > 1);
                }
            }
            else if (body.success == false) {
                if (body.message == 'Invalid OTP') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Invalid OTP'");
                }
                else if (body.message == 'OTP has expired') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'OTP has expired'");
                } else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);
                }
            }
        }
        async_function();
        done();
    });
    it('Register User api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "vpe6bu",
                username: "TestMahi5289",
                password: "123Aa!",
                created_by_ip: "42342"
            }
            var body = await axios.post('http://localhost:3001/registeruser', input);
            if (body.success == true) {
                if (body.message == 'Your registration is successful. ') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Your registration is successful. '");
                }
            }
            else if (body.success == false) {
                if (body.message == 'Username cannot be blank.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Username cannot be blank.'");
                }
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);
                }
            }
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('Delete qualification in profile api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "6u9shk",
                qualification: "5ea2b13202cfd9f9b208e15a"
            }
            var body = await axios.post('http://localhost:3001/deletequalification', input);
            if (body.success == true) {
                if (body.message) {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal(body.message.length > 1);
                }
            }
            else if (body.success == false) {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);
            }
        }
        async_function();
        done();
    });
    it('User Name suggestion api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "eqwl1e"
            }
            var body = await axios.post('http://localhost:3001/usernamesuggestion', input);
            if (body.success == true) {
                if (body.message == 'All username printed successfully.') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'All username printed successfully.'");
                    expect(body.data).to.equal(body.data.length > 1);
                }
            }
            else if (body.success == false) {
                if (body.message == 'There is no suggestion.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'There is no suggestion.'");
                }
                else if (body.message == 'Please pass user id') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Please pass user id'");
                }
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);  
                }
            }
        }
        async_function();
        done();
    });
    it('Email Verification api call', function (done) {
        var async_function = async () => {
            var input = {
                email: "pradeepkumar.j@cintanatech.com",
                is_active: true
            }
            var body = await axios.get('http://localhost:3001/emailverification?email='+ input.email + '&is_active=' + input.is_active);
            if (body.success == true) {
                if (body.message == ' Email verified successfully ') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("' Email verified successfully '");
                    expect(body.data).to.equal(body.data.length > 1);
                }
            }
            else if (body.success == false) {
                if (body.message == ' Email verified. ') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("' Email verified. '");
                }
                else if (body.message == 'Please provide email id.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Please provide email id.'");
                }
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);  
                }
            }
        }
        async_function();
        done();
    });
    it('View Profile api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id : "eqwl1e"
            }
            var body = await axios.post('http://localhost:3001/viewprofile', input);
            if (body.success == false) {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);  
            }
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('Check for link expired or not api call', function (done) {
        var async_function = async () => {
            var input = {
                username: "pradeep"
            }
            var body = await axios.get('http://localhost:3001/getuserusingusername?username='+ input.username);
            if (body.success == false) {
                if (body.message == 'Link not expired') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Link not expired'");
                }
                else if (body.message == 'Link expired') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Link expired'");
                }
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);  
                }
            }
        }
        async_function();
        done();
    });
    it('Forgot User Pass api call', function (done) {
        var async_function = async () => {
            var input = {
                type: "username",
                subtype: "mobile",
                mobile_number: 9566232823
            }
            var body = await axios.post('http://localhost:3001/forgotUserPass', input);
            if (body.success == true) {
                if (body.message == 'Your username has been sent to your registered Mobile') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Your username has been sent to your registered Mobile'");
                }
                else if (body.message == 'Your username has been sent to your registered email id') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Your username has been sent to your registered email id'");
                }
                else if (body.message == 'Reset password link has been sent to your email account.') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Reset password link has been sent to your email account.'");
                }     
            }
            else if (body.success == false) {
                if (body.message == 'User does not exist.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'User does not exist.'");
                }
                else if (body.message == 'Email id is not registered.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Email id is not registered.'");
                }
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);  
                }
            }
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('Get User detail by username api call', function (done) {
        var async_function = async () => {
            var input = {
                username : "pradeep"
            }
            var body = await axios.post('http://localhost:3001/getuserdtlbyusername', input);
            if(body.success == true) {
                if(body.message == 'Detail of user info') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Detail of user info'"); 
                    expect(body.data).to.equal(body.data.length > 1);  
                }
            } 
            else if (body.success == false) {
                if(body.message == 'Username cannot be empty.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Username cannot be empty.'");
                }  
            }
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('Reset Password api call', function (done) {
        var async_function = async () => {
            var input = {
                username : "pradeep",
                password: "123Aa!"
            }
            var body = await axios.post('http://localhost:3001/resetpassword', input);
            if(body.success == true) {
                if(body.message == 'Password updated successfully.') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Password updated successfully.'"); 
                }
                else {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal(body.message.length > 1);  
                }
            } 
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('Update verified mobile api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id : "eqwl1e"
            }
            var body = await axios.post('http://localhost:3001/updateverifiedmobile', input);
            if(body.success == true) {
                if(body.message == ' OTP verified successfully.') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("' OTP verified successfully.'"); 
                    expect(body.data).to.equal(body.data.length > 1);  
                }
            } 
            else if(body.success == false) {
                if(body.message == 'Invalid OTP') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Invalid OTP'"); 
                } 
                else if(body.message == 'OTP has expired') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'OTP has expired'"); 
                } 
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1); 
                }
            }
        }
        async_function();
        done();
    });
    it('Resend OTP api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id : "eqwl1e"
            }
            var body = await axios.post('http://localhost:3001/resendotp', input);
            if(body.success == true) {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal(body.message.length > 1);  
            } 
            else if(body.success == false) {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1); 
            }
            else {
                expect(body).to.equal(body.length > 1);
            }
        }
        async_function();
        done();
    });
    it('Check For existing user api call', function (done) {
        var async_function = async () => {
            var input = {
                username : "pradeep"
            }
            var body = await axios.post('http://localhost:3001/checkexistinguser?username='+ input.username);
            if(body.success == true) {
                if(body.message == 'Username not exists') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Username not exists'"); 
                }
            } 
            else if (body.success == false) {
                if(body.message == 'Username already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Username already exists'");
                } 
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1); 
                }  
            }
        }
        async_function();
        done();
    });
    
    it('store hash password', function (done) {
        var async_function = async () => {
            var input = {
                "user_id": "23456",
                "hashedpassword": "48cc8c14522be001e45f4f0a64cf8ff6a7fc412e9"
            }
            var body = await axios.post('http://localhost:3001/storehashpassword', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = [body.message];
                expect(body.message).to.equal(response_arr.length >= 0);
            } else {
                if (body.message == 'Error in updating password') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Error in updating password'");
                }
            }
        }
        async_function();
        done();
    });
});