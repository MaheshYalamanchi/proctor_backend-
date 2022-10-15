const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Get learner dashboard Test Cases', function () {
    it('Get learner dashboard api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id : "r9aahl"
            }
            var body = await axios.get('http://localhost:3001/getlearnerdashboarddetails?user_id='+ input.user_id);
            
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.data).to.equal(body.data.length > 1);
            }
            else if (body.success == false) {
                    expect(body.success).to.equal(false);
                    // expect(body.message).to.equal("'No Data Found'");
            }
        }
        async_function();
        done();
    });

    it('new learner dashboard api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id:"uss10r",
                user_obj_id: "5f6c83db251c670011a06af4",
                pagenumber: 0, // undefined
                request_type: "ongoing", // completed // all
                course_type: "batch" // enrolment
            }
            var body = await axios.get('http://localhost:3001/learnerdashboard?user_id='+ input.user_id + '&user_obj_id=' + input.user_obj_id + '&pagenumber=' + input.pagenumber + '&request_type=' + input.request_type + '&course_type=' + input.course_type);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                body.message = [body.message];
                expect(body.message).to.equal(body.data.length > 1);
            }
            else if (body.success == false) {
                    expect(body.success).to.equal(false);
            }
        }
        async_function();
        done();
    });

    it('Getting Instructor lead session details based on courseid and batchid for admin', function (done) {
        var async_function = async () => {
            var input = {
                "batchid" : "663488531077327",
                "courseid" : "gc8uh594",
                "search_string" : "undefined" // "utilization"
            }
            var body = await axios.get('http://localhost:3001/liveclassroomdata', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                body.message = [body.message];
                expect(body.message).to.equal(body.data.length > 1);
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
            }
        }
        async_function();
        done();
    });
});