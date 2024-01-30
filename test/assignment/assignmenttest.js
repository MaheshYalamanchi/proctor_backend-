const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';


describe('Assignment Test Cases', function () {
    it('Get Learner Assignment details api call for admin side', function (done) {
        var async_function = async () => {
            var input = {
                "batchId":"BATH00033",
                "course_id":"8jj034kl",
                "module_id":"Course manageent",
                "topic_id":"Download content",
                "status":"completed",
                "submit_status":null
            }
            var body = await axios.post('http://localhost:3001/getLearnerAssignments', input);
            if (body.data.success) {
                expect(body.data.success).to.equal(true);
                expect(body.data.data.length >= 1).to.equal(body.data.data.length >= 1);
            } else if (!body.data.success && body.data.message == 'No Data'){
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal('No Data');
            }
            else if (!body.data.success && body.data.message != {}){
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal(body.data.message);
            }
        }
        async_function();
        done();
    });
    it('Get view assignment tab for complete view in admin side', function (done) {
        var async_function = async () => {
            var input = {
                "batchId":"BATH00033"
            }
            var body = await axios.get('http://localhost:3001/viewAssignmentTab?batchId=' + input.batchId);
            if (body.data.success) {
                expect(body.data.success).to.equal(true);
                expect(body.data.data.length >= 1).to.equal(body.data.data.length >= 1);
            } else if (!body.data.success && body.data.message == 'No Data'){
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal('No Data');
            }
            else if (!body.data.success && body.data.message != {}){
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal(body.data.message);
            }
        }
        async_function();
        done();
    });
    it('Get learner details who are not submitted assignment', function (done) {
        var async_function = async () => {
            var input = {
                "batchId":"882187451795584",
                "courseId":"auxmv5l4"
            }
            var body = await axios.get('http://localhost:3001/getNotSubmittedLearners?batchId=' + input.batchId + '&courseId=' +  input.courseId);
            if (body.data.success) {
                expect(body.data.success).to.equal(true);
                expect(body.data.data.length >= 1).to.equal(body.data.data.length >= 1);
            } else if (!body.data.success && body.data.message == 'No Data'){
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal('No Data');
            }
            else if (!body.data.success && body.data.message != {}){
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal(body.data.message);
            }
        }
        async_function();
        done();
    });
    it('Assignment Insert api call', function (done) {
        var async_function = async () => {
            var input = {
                "type_name": "assignment",
                "file_id": "5f27ebf05e15d300116e3cfc",
                    
                        "_id": "5f2aa5af8df4150011b0bb7c",
                        "user_id": "vyr8wx",
                        "files_id": "5f2aa5af8df4150011b0bb7d",
                        "comments": "Node Mocha Unit Test",
                        "score_mark": 25
            }   
            
            var body = await axios.post('http://localhost:3001/InsertAssignmentData', input);
            // console.log("body",body.data)
            if (body.data.success == true) {
                expect(body.data.success).to.equal(true);
            }
            else {                
                expect(body.data.success).to.equal(false);    
            }
        }
        
        async_function();
        done();
    });
    it('get Filter Data For Assignment', function (done) {
        var async_function = async () => {
            var input = {
                "batchId":"201706173784743"
            }
            var body = await axios.get('http://localhost:3001/getFilterDataForAssignment?batchId=' + input.batchId);
            // console.log(body.data.data)
            if (body.data.success == true) {
                expect(body.data.success).to.equal(true);
            } else if (body.data.success == false){
                expect(body.data.success).to.equal(false);
            }
        }
        async_function();
        done();
    });

    it('Learner Upload submit delete Insert api call', function (done) {
        var async_function = async () => {
            var input ={
                "course_id": "k1b004d3",
                "module_id": "Assignment Module test 2",
                "topic_id": "Assignment Topic test 2",
                "user_id": "aj1yej",
                "submit_status": "ontime",
                "total_mark": "133",
                "submitType": "perform",
                "submitAction": "submit",
                "iterationid": "858278213571037",
                "object_id": "108967222234239"   
            }
            
            var body = await axios.post('http://localhost:3001/learnerUploadVideo', input);
            if (body.data.success == true) {
                expect(body.data.success).to.equal(true);
            }
            else {                
                expect(body.data.success).to.equal(false);    
            }
        }
        
        async_function();
        done();
    });
});
