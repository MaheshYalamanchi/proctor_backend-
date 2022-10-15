const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('File upload Routes api Test Cases', function () {
    it('Change Password Profile api call', function (done) {
        var async_function = async () => {
            var input = {
                username: "eqwl1e",
                old_password: "123Aa!",
                password: "123Aa!"
            }
            var body = await axios.post('http://localhost:3001/changePasswordProfile', input);
            if (body.data.success == false) {
                expect(body.data.success).to.equal(false);
                expect(body.data.message.length).to.greaterThan(1);
            }
            else if(body.data.success == true) {
                expect(body.data.message.length).to.equal(0);
            }
        }
        async_function();
        done();
    });
    it('Update mobile api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "eqwl1e",
                mobile_number: 9940156725
            }
            var body = await axios.post('http://localhost:3001/updatemobile', input);
            console.log(body.data,"body")
            if (body.success == false) {
                if (body.data.message == 'Mobile number already exist.') {
                    expect(body.data.success).to.equal(false);
                    expect(body.data.message).to.equal("'Mobile number already exist.'");
                } else {
                    expect(body.data.success).to.equal(false);
                    expect(body.data.message.length).to.greaterThan(1);
                }
            }
            else {
                expect(body.data.success).to.equal(true);
                expect(body.data.message.length).to.greaterThan(1);
            }
        }
        async_function();
        done();
    });
    it('Update email api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "eqwl1e",
                email: "pradeepkumar.j@cintanatech.com"
            }
            var body = await axios.post('http://localhost:3001/updateemail', input);
            if (body.success == true) {
                if (body.message == 'Activation link has been sent to the updated E-Mail ID') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Activation link has been sent to the updated E-Mail ID'");
                }
                else if (body.message == 'Email id already exist.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Email id already exist.'");
                }
            }
            else if (body.success == false) {
                if (body.message == 'Please provide email id') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Please provide email id'");
                }
            }
        }
        async_function();
        done();
    });
    it('Get User using email api call', function (done) {
        var async_function = async () => {
            var input = {
                email: "9ecc1c038c14f5f8aeb75da4bcfc0e8b2ee29a225274994f8e4d5924bf39dab98e8327b03b8ec93594d82f93ee7db7baf00d8a3a273eb513922268c452a3ef120e30220ee13be874b7c3a0bffe7a98f421d5151f014c47720cd477a7338951f492247a7bb86bae59cca694a33bea5fdf8633fa103b81c76d1eef41211b7b"
            }
            var body = await axios.get('http://localhost:3001/getuserusingemail?email=' + input.email);
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
    it('Update email in profile api call', function (done) {
        var async_function = async () => {
            var input = {
                user_id: "39ba332457b3d5b0fc443a24ed56158dfaf5a220e26914a6d9c4d3e79012af1ed7253dbec26f4fc56ed30f9f5b989f2a8b42d0bd82a32ccda06db499a12b21072d841b45f2b59d05b1043250556612dd64f9cbd672ee89a2a03efb6185bba4df0ceb6e95745b",
                email: "9ecc1c038c14f5f8aeb75da4bcfc0e8b2ee29a225274994f8e4d5924bf39dab98e8327b03b8ec93594d82f93ee7db7baf00d8a3a273eb513922268c452a3ef120e30220ee13be874b7c3a0bffe7a98f421d5151f014c47720cd477a7338951f492247a7bb86bae59cca694a33bea5fdf8633fa103b81c76d1eef41211b7b"
            }
            var body = await axios.get('http://localhost:3001/updateemailinprofile?email=' + input.email + '&user_id=' + input.user_id);

            expect(body).to.equal(body.length > 1);
        }
        async_function();
        done();
    });
    it('Remove reference document api call', function (done) {
        var async_function = async () => {
            var input = {
                doc_id: "5ead7092baa6e7b46fa7c1b5"
            }
            var body = await axios.get('http://localhost:3001/removedocref?doc_id=' + input.doc_id);
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
    it('Get all reference document api call', function (done) {
        var async_function = async () => {
            var input = {
                pagenumber: 1
            }
            var body = await axios.get('http://localhost:3001/getallrefdoc?pagenumber=' + input.pagenumber);

            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.data).to.equal(body.data.length > 1);
                expect(body.count).to.equal(body.count >= 0);
            }
            else if (body.success == false) {
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
    it('Get module and topic api call', function (done) {
        var async_function = async () => {

            var body = await axios.get('http://localhost:3001/getmoduleandtopic');

            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.data).to.equal(body.data.length > 1);
            }
            else if (body.success == false) {
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
    it('Get module based on course api call', function (done) {
        var async_function = async () => {
            var input = {
                courseid: "wvkkvrrj",
                user_id: "cpxfg3"
            }
            var body = await axios.get('http://localhost:3001/getmodulebasedoncourse?courseid='+input.courseid +'&user_id='+input.user_id);
            if (body.success == false) {
                expect(body.success).to.equal(false);
                expect(body.message).to.equal("'No more record'");
            }
            else if (body.message == 'All Record'){
                expect(body.success).to.equal(true);
                expect(body.data).to.equal(body.data.length > 0);
                expect(body.message).to.equal("'All Record'");
            }
        }
        async_function();
        done();
    });
    it('Get assignment based on course api call', function (done) {
        var async_function = async () => {
            var input = {
                courseid: "8jj034kl",
                user_id: "1234ab"
            }
            var body = await axios.get('http://localhost:3001/getassignmentbasedoncourse?courseid=' + input.courseid + '&user_id=' + input.user_id);
            if (body.success == false) {
                expect(body.success).to.equal(false);
                expect(body.message).to.equal("'No more record'");
            }
            else if (body.message == 'All Record') {
                expect(body.success).to.equal(true);
                expect(body.data).to.equal(body.data.length > 0);
                expect(body.message).to.equal("'All Record'");
            }
        }
        async_function();
        done();
    });
    it('Get assignment details based on course for batch api call', function (done) {
        var async_function = async () => {
            var input = {
                courseid: "8jj034kl"
            }
            var body = await axios.get('http://localhost:3001/assignmentDetailsForBatch?courseid=' + input.courseid);
            if (body.data.success) {
                expect(body.data.success).to.equal(true);
                expect(body.data.message).to.equal('Asssignment Data for Course');
            }
            else {
                expect(body.data.success).to.equal(false);
                expect(body.data.message).to.equal('No Data');
            }
        }
        async_function();
        done();
    });
    it('Get Topic api call', function (done) {
        var async_function = async () => {
            var input = {
                _id: "5ea842d510d58c3cd7b6c2d0",
                module_name: "test2"
            }
            var body = await axios.get('http://localhost:3001/gettopic', input);

            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.data).to.equal(body.data.length > 1);
            }
            else if (body.success == false) {
                if (body.message == 'Not valid params') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'Not valid params'");
                } else {
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

    it('upload learner doc api call', function (done) {
        var async_function = async () => {
            var input = {
                module_id: 'Course manageent',
                course_id: '8jj034kl',
                topic_id: 'Download content',
                user_id: '3qpai7',
                file_id: '5f08147f4279dd0011f569660',
                type_name: 'assignment',
                files: [
                    {
                        course_id: '8jj034kl',
                        module_id: 'Course manageent',
                        topic_id: 'Download content',
                        doc_type: 'application/pdf',
                            path: 'https://edutechstorage.blob.core.windows.net/container1/files/24066588315933557-aa12.pdf',
                        flag: true,
                        filename: 'aa12.pdf',
                        type_name: 'assignment',
                        file_id: '5f08147f4279dd0011f569660',
                        status: 'pending',
                        submit_status: 'ontime',
                        resubmit: false
                    }
                ],
                is_active: true
            }
            var body = await axios.post('http://localhost:3001/uploadlearnerdoc', input);
            if (body.data.success == true) {
                expect(body.data.success).to.equal(true);
                expect(body.data.message).to.equal('"file uploaded successfully."');
            }
            else if (body.data.success == false) {
                if(body.data.message == 'File already uptodate.'){
                    expect(body.data.success).to.equal(false);
                    expect(body.data.message).to.equal('"file uploaded successfully."');
                } else if(body.data.message == 'Error while uploading document.'){
                    expect(body.data.success).to.equal(false);
                    expect(body.data.message).to.equal('"Error while uploading document."');
                }
            }
        }

        async_function();
        done();
    });

});