const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('User Roles Integration Test Cases', function () {
    it('create user role api call', function (done) {
        var async_function = async () => {
            var input = {
                "role_name": "newrole7",
                "created_by": "35",
                "role_type_id" : "xq13oou",
                "role_type" : "sme",
                "organization_id" : "undefined"
            }
            var body = await axios.post('http://localhost:3001/createuserrole', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = [body.message];
                expect(body.message).to.equal(response_arr.length >= 0);
            } else {
                if (body.message == 'Role name already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Role name already exists'");
                }
            }
        }
        async_function();
        done();
    });

    it('get all user roles', function (done) {
        var async_function = async () => {
            var input = { pagenumber: "0", created_by: "b0swkxl" };
            var body = await axios.get('http://localhost:3001/getalluserroles?pagenumber=' + input.pagenumber + '&created_by=' + input.created_by);
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

    it('get all previleges', function (done) {
        var async_function = async () => {
            var input = "0";
            var body = await axios.get('http://localhost:3001/getallprevileges?pagenumber' + input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
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

    it('get previlege by role', function (done) {
        var async_function = async () => {
            var input = "0i73l34";
            var body = await axios.get('http://localhost:3001/getprevilegebyrole?role_id' + input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
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

    it('create previlege', function (done) {
        var async_function = async () => {
            var input = {
                "previlege_name" : "new previlege child 2's childs",
                "previlege_level" : "3",
                "previlege_parent" : "previl003",
                "created_by" : "1234ab",
                "created_by_ip" : "127.0.0.2",
                "previlege_id" : "sy1f6ley"
            }
            var body = await axios.post('http://localhost:3001/createprevilege', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'previlege created successfully'");
                expect(body.info).to.equal(body.info.length >= 0);
            }
            else if (body.success == false) {
                if (body.message == 'previlege name already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'previlege name already exists'");
                }
                else if (body.message == 'Error while Inserting previlege') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Error while Inserting previlege'");
                }
            }
        }
        async_function();
        done();
    });

    it('update previlege', function (done) {
        var async_function = async () => {
            var input = {
                "previlege_name" : "new previlege child 2's childs",
                "previlege_level" : "3",
                "previlege_parent" : "previl003",
                "created_by" : "1234ab",
                "created_by_ip" : "127.0.0.2",
                "previlege_id" : "sy1f6ley"
            }
            var body = await axios.post('http://localhost:3001/updateprevilege', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'previlege details updated successfully'");
                expect(body.info).to.equal(body.info.length >= 0);
            }
            else if (body.success == false) {
                if (body.message == 'previlege name already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'previlege name already exists'");
                }
                else if (body.message == 'Invalid previlege details') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Invalid previlege details'");
                }
            }
        }
        async_function();
        done();
    });

    it('update user role', function (done) {
        var async_function = async () => {
            var input = {
                "role_name": "newrole",
                "updated_by": "35",
                "role_id": "i9mov9i",
                "role_description": "test",
                "is_active": true,
                "status": true,
                "role_type_id" : "xq13oou",
                "role_type" : "sme",
                "organization_id" : "undefined"
            }
            var body = await axios.post('http://localhost:3001/updateuserrole', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                if (body.message == 'Role deleted successfully') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Role deleted successfully'");
                } else if (body.message == 'Role updated successfully'){
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Role updated successfully'");
                    expect(body.info).to.equal(body.info.length >= 0);
                }
            }
            else if (body.success == false) {
                if (body.message == 'Role name already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Role name already exists'");
                }
            }
        }
        async_function();
        done();
    });

    it('clone user role', function (done) {
        var async_function = async () => {
            var input = {
                "from_role_id": "kad1v92",
                "created_by": "35",
                "to_role_id": "i9mov9i"
            }
            var body = await axios.post('http://localhost:3001/cloneuserrole', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'Role cloned successfully'");
                expect(body.info).to.equal(body.info.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('create admin user api call', function (done) {
        var async_function = async () => {
            var input = {
                "username": "newname12",
                "full_name": "fullname",
                "email": "email9@gmail.com",
                "is_admin": true,
                "created_by_ip": "157.50.167.207",
                "role_id": ["b0swkxl"],
                "created_by": "35",
                "organization_id" : "v9k7h2s1h"
            }
            var body = await axios.post('http://localhost:3001/adminusercreation', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'User created successfully'");
                expect(body.info).to.equal(body.info.length >= 0);
            }
            else if (body.success == false) {
                if (body.message == 'Username already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Username already exists'");
                }
                if (body.message == 'Email already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Email already exists'");
                }
            }
        }
        async_function();
        done();
    });

    it('update admin user api call', function (done) {
        var async_function = async () => {
            var input = {
                "full_name":"fullnamee",
                "email":"email8@gmail.com",
                "role_id":["i9mov9i"],
                "updated_by": "35",
                "is_active": false,
                "organization_id" : "v9k7h2s1h",
                "status": false,
            }
            var body = await axios.post('http://localhost:3001/updateadminuser', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal("'User updated successfully'");
                expect(body.info).to.equal(body.info.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('get all admin users', function (done) {
        var async_function = async () => {
            var input = "0"
            var body = await axios.get('http://localhost:3001/getalladminusers?pagenumber='+ input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.info).to.equal(body.info.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('get previlege by parent', function (done) {
        var async_function = async () => {
            var input = {
                parent_id : "audit01",
                previlege_level : "2"
            }
            var body = await axios.get('http://localhost:3001/getprevilegebyparent?parent_id='+ input.parent_id + "&previlege_level=" + input.previlege_level);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.info).to.equal(body.info.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('duplicate previlege', function (done) {
        var async_function = async () => {
            var input = {
                "old_previlege_id" : "dpxcgchp",
                "previlege_name" : "duplicate previlege check"
            }
            var body = await axios.post('http://localhost:3001/duplicateprevilege', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                body.previlege_details = [body.previlege_details];
                expect(body.info).to.equal(body.previlege_details.length >= 0);
                expect(body.message).to.equal("'duplicate previlege created successfully'");
            }
            else if (body.success == false) {
                if (body.message == 'previlege name already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'previlege name already exists'");
                }
                else if(body.message == 'Error while duplicating a previlege'){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Error while duplicating a previlege'");
                }
            }
        }
        async_function();
        done();
    });

    it('role privilege mapping api call', function (done) {
        var async_function = async () => {
            var input = {
              "previlege_id": ["previl001","previl002"],
              "created_by": "35",
              "role_id": "i9mov9i"
            }
            var body = await axios.post('http://localhost:3001/roleprivilegemapping', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                    expect(body.message).to.equal("'Privilege mapped successfully'");
                    expect(body.info).to.equal(body.info.length >= 0);
            }
        }
        async_function();
        done();
    });

    it('get all admin for role', function (done) {
        var async_function = async () => {
            var input = { pagenumber: "0", role_id: "b0swkxl" };
            var body = await axios.get('http://localhost:3001/getalladminbyrole?pagenumber=' + input.pagenumber + '&role_id=' + input.role_id);
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

    it('remove previlege api call', function (done) {
        var async_function = async () => {
            var input = {
                "previlege_id" : "28ifcbra"
            }
            var body = await axios.post('http://localhost:3001/removeprevilege', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                    expect(body.message).to.equal("'Previlege removed successfully'");
            }
        }
        async_function();
        done();
    });

    it('get organization api call', function (done) {
        var async_function = async () => {
            var input = {pagenumber : 0,created_by :"1234ab" };
            var body = await axios.get('http://localhost:3001/getorganizationlist?pagenumber=' + input.pagenumber + '&created_by=' + input.created_by);
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

    it('insert organization api call', function (done) {
        var async_function = async () => {
            var input = {
                "organization_name": "new organization no1",
                "organization_logo": "https://www.google.com",
                "admin_email": "rahulsaivishnu1234@gmail.com",
                "admin_username": "rahuladmins",
                "role_id": "vr8741q",
                "role_name": "caps on testing",
                "created_by": "1234ab",
                "created_by_ip": "localhost"
            }
            var body = await axios.post('http://localhost:3001/addorganization', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                    expect(body.message).to.equal("'organization created successfully'");
                    body.organization_info = [body.organization_info];
                    expect(body.organization_info).to.equal(body.organization_info.length >= 0);
            }
            else if (body.success == false) {
                if (body.message == 'username already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'username already exists'");
                }
                else if(body.message == 'email already exists'){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'email already exists'");
                }
                else if(body.message == 'organization name already exists'){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'organization name already exists'");
                }
                else if(body.message == 'error while saving organization details'){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'error while saving organization details'");
                }
            }
        }
        async_function();
        done();
    });

    it('update organization api call', function (done) {
        var async_function = async () => {
            var input = {
                "is_active" : true,
                "organization_name" : "Google",
                "organization_logo" : "https://www.google.com",
                "organization_id" : "dwujfebmw",
                "admin_details" : {
                    "admin_email" : "rahulsaivishnu123@gmail.com",
                    "admin_username" : "rahul"
                },
                "role_details" : [
                    {
                        "role_id" : "vr8741q",
                        "role_name" : "caps on testing"
                    }
                ],
                "created_by" : "1234ab",
                "updated_by" : "1234ab"
            }
            var body = await axios.post('http://localhost:3001/updateorganization', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                if(body.message == "organization updated successfully"){
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'organization updated successfully'");
                } else if(body.message == "Organization deleted successfully"){
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Organization deleted successfully'");
                }
            }
            else if (body.success == false) {
                if (body.message == 'Error while updating the organization details') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Error while updating the organization details'");
                }
                else if(body.message == 'organization name already exists'){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'organization name already exists'");
                }
            }
        }
        async_function();
        done();
    });

    it('get organization detail by id api call', function (done) {
        var async_function = async () => {
            var input = "dwujfebmw";
            var body = await axios.get('http://localhost:3001/getorganizationdetailbyid?organization_id=' + input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.success).to.equal(false);
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

    it('get role types', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3001/getroletypes');
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

    it('roles by organization', function (done) {
        var async_function = async () => {
            var input = "v9k7h2s1h";
            var body = await axios.get('http://localhost:3001/rolesbyorganization?organization_id=' + input);
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

    it('bulk admin user upload', function (done) {
        var async_function = async () => {
            var input = {
                "request": [{
                    "Username": "Batchh",
                    "Full_name": "Test",
                    "Email": "bb1@gmail.com"
                },
                {
                    "Username": "Bxatcsn",
                    "Full_name": "Test",
                    "Email": "bbtesmmn2@gmail.com"
                }],
                "organization_id": "v9k7h2s1h",
                "role_id": ["ah5wxng"],
                "created_by": "1234ab",
                "created_by_ip": "127.0.0.1"
            }
            var body = await axios.post('http://localhost:3001/bulkadminuserupload', input);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                var response_arr = [body.message];
                expect(body.message).to.equal(response_arr.length > -1);
            } else {
                if (body.message == 'Role name already exists') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Role name already exists'");
                }
            }
        }
        async_function();
        done();
    });

    it('group by organization', function (done) {
        var async_function = async () => {
            var input = "5oxygd5y2";
            var body = await axios.get('http://localhost:3001/getgroupbyorganization?organization_id=' + input);
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