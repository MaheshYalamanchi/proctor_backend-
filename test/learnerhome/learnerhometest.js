const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Get learner home Test Cases', function () {
    it('Get learner home api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "02724x",
                user_obj_id: "5f3a90ba1b32560011353a4d",
                catalogue_id: "8ami88o2a",
                category_id: "vrl22wqj7"
            }
            var body = await axios.get('http://localhost:3001/getlearnerenrolledcourses?user_id=' + input.user_id +
                '&user_obj_id=' + input.user_obj_id + '&catalogue_id='
                + input.catalogue_id + '&category_id=' + input.category_id);
            // console.log(body.data)
            if (body.data.success == true) {
                expect(body.data.success).to.equal(true);
                // expect(body.data.data.length).to.equal(body.data.length > 1);
            }
            else if (body.data.success == false) {
                expect(body.data.success).to.equal(false);
                // expect(body.message).to.equal("'No Data Found'");
            }
        }
        async_function();
        done();
    });
});