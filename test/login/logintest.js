const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Login Test Cases', function () {
    it('login api call', function (done) {
            var async_function = async () => {
                var input = {
                    username: 'rahulsaivishnu',
                    password: 'password',
                    is_admin: false
                }
                var body = await axios.post('http://localhost:3001/login', input);
                if (body.data) {
                    if (body.data.success == false) {
                        expect(body.data.success).to.equal(false);
                    }
                }
                else if (body.success == true) {
                    expect(body.success).to.equal(true);
                    var response_arr = [body.message];
                    expect(body.message).to.equal(response_arr.length > 1);
                }
                else if (body.success == false) {
                    expect(body.success).to.equal(false);
                    if(body.message == "access is denied, contact admin for further details"){
                        expect(body.message).to.equal('"access is denied, contact admin for further details"');
                    }
                    else if(body.message.message == "please update your profile details"){
                        expect(body.message).to.equal('"please update your profile details"');
                    }
                    else if(body.message == "User Id is missing in user profile"){
                        expect(body.message).to.equal('"User Id is missing in user profile"');
                    }
                    else{
                        expect(body.message).to.equal('"Invalid login. Please try again."');
                    }
                }
            }
            async_function();
            done();
    });
});