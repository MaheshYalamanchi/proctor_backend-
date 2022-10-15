const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
var fs = require('fs');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('User Management Test Cases', function () {
    it('usergroup api call', function (done) {
        var async_function = async () => {
            var input = "1234ab";
            var body = await axios.get('http://localhost:3001/usergroup?user_id='+ input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('mapusergroup api call', function (done) {
        var async_function = async () => {
            var body = await axios.post('http://localhost:3001/mapusergroup');
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'User Mapped to group Successfully'");
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                if(body.message == "User Already mapped to a group"){
                    expect(body.message).to.equal("'User Already mapped to a group'");
                }
                else if(body.message == "Error in mapping User"){
                    expect(body.message).to.equal("'Error in mapping User'");
                }
            }
        }
        async_function();
        done();
    });

    it('userstatus api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id" : ["hspma4", "12345"],
                "is_active" : true
            }
            var body = await axios.post('http://localhost:3001/userstatus', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message.updated_users).to.equal(body.message.updated_users.length >= 0);
                expect(body.message.outdated_users).to.equal(body.message.outdated_users.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('blockuser api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id" : ["hspma4", "12345"],
                "is_blocked" : false
            }
            var body = await axios.post('http://localhost:3001/blockuser', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message.updated_users).to.equal(body.message.updated_users.length >= 0);
                expect(body.message.outdated_users).to.equal(body.message.outdated_users.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('getallusers api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3001/getallusers');
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('bulk user upload api call', function (done) {
        var async_function = async () => {
            var input = fs.readFileSync('./bulk_upload_user.csv')
            var body = await axios.post('http://localhost:3001/bulkuserupload', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                if(body.message == "Error while inserting users"){
                    expect(body.message).to.equal("'Error while inserting users'");
                }
                else if(body.message == "Records Already Exists"){
                    expect(body.message).to.equal("'Records Already Exists'");
                }
            }
        }
        async_function();
        done();
    });
    it('create user group api call', function (done) {
        var async_function = async () => {
            var input = {
                "group_name" : "new1",
                "group_type" : "new1",
                "parent_id" : [
                    "h1",
                    "h2"
                ],
                "admin_id" : "5e69f4ad139c79bbf14adc8a"
            }
            var body = await axios.post('http://localhost:3001/createusergroup', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
        }
        async_function();
        done();
    });
    it('get group api call', function (done) {
        var async_function = async () => {
            var input = {
                input_id : "lk753ll", // Can be group parent Id or hierarchy Id ex: "input_id" : "h1" for hierarchy
                type : "group", // Can be group or hieararchy ex: "type" : "hierarchy" for hierarchy
                pagenumber : 0, // pagenumber starts from 0
                user_id : "1234ab"
            }
            var body = await axios.get('http://localhost:3001/getgroup?input_id=' +input.input_id + "&type=" + input.type + "&pagenumber=" + input.pagenumber + "&user_id=" + input.user_id);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                expect(body.message).to.equal("'Invalid type'");
            }
        }
        async_function();
        done();
    });
    it('user group hierarchy api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3001/usergrouphierarchy');
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
        }
        async_function();
        done();
    });
    it('get notification reports api call', function (done) {
        var async_function = async () => {
            var input = {
                admin_id : "5e8ee9f539908f2584a63896"
            }
            var body = await axios.get('http://localhost:3001/getnotificationreports?admin_id=' +input.admin_id);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = body.message;
                expect(body.message).to.equal(response_arr.length >= 0);
            }
        }
        async_function();
        done();
    });
    
    it('update notification report api call', function (done) {
        var async_function = async () => {
            var input = {
                report_id : "d7ygio"
            }
            var body = await axios.post('http://localhost:3001/updatenotificationreport', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'Notification Deactivated Successfully'");
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                if(body.message == "Unable to deactivate the notification"){
                    expect(body.message).to.equal("'Unable to deactivate the notification'");
                }
            }
        }
        async_function();
        done();
    });

    it('groupstatus activation and deactivation api call', function (done) {
        var async_function = async () => {
            var input = {
                group_id : "d7ygio",
                is_active : true
            }
            var body = await axios.post('http://localhost:3001/groupstatus', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'Group Status updated Successfully'");
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                if(body.message == "Unable to update Group Status"){
                    expect(body.message).to.equal("'Unable to update Group Status'");
                }
            }
        }
        async_function();
        done();
    });

    it('user enrollment to a course api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "123123123",
                course_id: "123123123",
                group_id: "123123123"
            }
            var body = await axios.post('http://localhost:3001/enrollcourse', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'User enrolled successfully for the course'") || expect(body.message).to.equal("'User already enrolled for this course'");
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                if(body.message == "Unable to enroll user to the course"){
                    expect(body.message).to.equal("'Unable to enroll user to the course'");
                }
            }
        }
        async_function();
        done();
    });

    it('get course enrollments list api call', function (done) {
        var async_function = async () => {
            var input = {
                "query_type": "individual",
                "page": 0,
                "limit": 10,
                "query_by": "",
                "sort_by": "created_at",
                "sort_order": 1
            }
            var body = await axios.post('http://localhost:3001/getenrolledcourses', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response = body.message;
                expect(body.message).to.equal(response.data);
                expect(body.message.data).to.equal(response.data.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('approve enrollment api call', function (done) {
        var async_function = async () => {
            var input = {
                "update_type": "individual",
                "status_reason": "Approved!",
                "enrollments": [
                    {
                        "user_id": "alvbu0",
                        "group_id": "alqu43h",
                        "course_id": "vleo9ldb"
                    }
                ]
            }
            var body = await axios.post('localhost:3001/approveEnrollment', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'Enrollment Data Approved Successfully'");
            }
        }
        async_function();
        done();
    });

    it('reject enrollment api call', function (done) {
        var async_function = async () => {
            var input = {
                "update_type": "user_group",
                "status_reason": "Does not meet the requirements!",
                "enrollments":[{
                    "course_id": "jbe0ymt0",
                    "group_id": "alqu43h"
                }]
            }
            var body = await axios.post('localhost:3001/rejectEnrollment', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'Enrollments Rejected Successfully'");
            }
        }
        async_function();
        done();
    });

    it('get users by group', function (done) {
        var async_function = async () => {
            var input = {
                "group_id": [
                    "1"
                ],
                "pagenumber": "undefined",
                "searchcolumn" : "undefined",
                "sorttype" : "{'userdetail.username' : 1}",
                "searchvalue" : "undefined"
            }
            var body = await axios.post('http://localhost:3001/getusersbygroup', input);
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = [body.message];
                expect(body.message).to.equal(response_arr.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('get all user details api call', function (done) {
        var async_function = async () => {
            var input = {
                "count": "10",
                "search_string": "[{'user_id':{'$regex':'hvd154','$options':'i'}},{'email_details.email':{'$regex':'santro@gmail.com','$options':'i'}},{'email_details.full_name':{'$regex':'santro','$options':'i'}},{'organization_details.organization_name':{'$regex':'neworgcheck1','$options':'i'}},{'role_details.role_type.role_type':{'$regex':'sme','$options':'i'}},{'user_status':{'$regex':'Active','$options':'i'}}]",
                "sort_type": "{'user_id': -1}"
            }
            var body = await axios.post('http://localhost:3001/getalluserdetails', input);
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = [body.message];
                expect(body.message).to.equal(response_arr.length > -1);
            }
        }
        async_function();
        done();
    });

    it('get all user details by id api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id": "tff9dn"
            }
            var body = await axios.post('http://localhost:3001/getalluserdetailsbyid', input);
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = [body.message];
                expect(body.message).to.equal(response_arr.length > -1);
            }
        }
        async_function();
        done();
    });

    it('user status update api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id" : ["tff9dn","2hvmmk"],
                "is_active" : true
            }
            var body = await axios.post('http://localhost:3001/userstatusupdate', input);
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'User status updated successfully'");
            }
            else if(body.success == false){
                expect(body.success).to.equal(false);
                if(body.message == "Error while updating user status"){
                    expect(body.message).to.equal("'Error while updating user status'") || expect(body.message).to.equal("'is_active field must be boolean'");
                }
            }
        }
        async_function();
        done();
    });
});