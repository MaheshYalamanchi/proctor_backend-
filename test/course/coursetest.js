const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Course Test Cases', function () {
    it('Course Status api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id": "ls4n3p",
                "user_obj_id": "5e9693b2a5c649722e94351c",
                "course_dtl": [{
                    "status": "incomplete",
                    "knowledge_data" : {
                        "score_raw" : "25",
                        "score_min" : "0",
                        "score_max" : "100",
                        "score_scaled" : "0.25"
                    },
                    "module": [
                        {
                            "module_name": "Welcome to the course",
                            "topic": [
                                {
                                    "topic_name": "Download course content",
                                    "status": "Passed"
                                }
                            ]
                        }
                    ],
                    "course_id": "jbe0ymt0"
                }]
            }
            var body = await axios.post('http://localhost:3001/coursestatus', input);
            console.log(body, "####")
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
    it('Get Player Status api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "3qpai7"
            }
            var body = await axios.post('http://localhost:3001/getplayerstatus', input);
            if (body.data.success == true) {
                if (body.data.message.length > 1) {
                    expect(body.data.success).to.equal(true);
                    expect(body.data.message.length).to.greaterThan(0);
                } else if (body.data.message.length == 0) {
                    expect(body.data.success).to.equal(true);
                    expect(body.data.message.length).to.equal(0);
                }
            }
        }
        async_function();
        done();
    });

    it('get course activities', function (done) {
        var async_function = async () => {
            var input = { pagenumber: "0", user_id: "iety1y" };
            var body = await axios.get('http://localhost:3001/getcourseactivities?pagenumber=' + input.pagenumber + '&user_id=' + input.user_id);
            if (body.data) {
                if (body.success == false) {
                    expect(body.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal(body.message.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('get course activities count', function (done) {
        var async_function = async () => {
            var input = {user_id: "iety1y" };
            var body = await axios.get('http://localhost:3001/getactivitescountforcourse?user_id=' + input.user_id);
            if (body.data) {
                if (body.success == false) {
                    expect(body.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal(body.message.length >= 0);
            }
        }
        async_function();
        done();
    });
});