const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Logout Test Cases', function () {
    it('logout api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: '5e6b2907396e26aaedcc5983',
                is_admin: false
            }
            var body = await axios.post('http://localhost:3001/logout', input);
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
                if (body.message == "is_admin field should be a boolean") {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal('"is_admin field should be a boolean"');
                }
                else if(body.message == "Error while logging out the user"){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal('"Error while logging out the user"');
                }
            }
        }
        async_function();
        done();
    });
});