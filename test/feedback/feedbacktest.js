const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Feedback Test Cases', function () {
    it('learnerfeedback api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/learnerfeedback');
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal(body.message.length > 1);
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
            }
        }
        async_function();
        done();
    });
    it('feedbackinsert api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id":"yg",
                "question_id":"jhghgh",
                "rating":"kjhjj",
                "question_ans":[{"question":"","answer":""}]
            }
            var body = await axios.post('http://localhost:3004/feedbackinsert='+input);
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal(body.message.length > 1);
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
            }
        }
        async_function();
        done();
    });

});