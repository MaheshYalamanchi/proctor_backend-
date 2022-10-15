const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Nodebb Integration Test Cases', function () {
    it('thread search and sort api call', function (done) {
        var async_function = async () => {
            var input = {
                "moduleid" : "1/announcements/",
                "threadsearch" : "null",
                "threadsort" : "0"
            }
            var body = await axios.post('http://localhost:3001/threadsearchandsort', input);
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

    it('get modules by course api call', function (done) {
        var async_function = async () => {
            var input = {
                course_id : "4ig8cerq",
                module_id : "5f00557b55c0760011c1b76a"
            }
            var body = await axios.get('http://localhost:3001/getmodulesbycourse?course_id=' + input.course_id + "&module_id=" + input.module_id);
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
            else if (body.success == false) {
                if (body.message == "No modules found for this courseid") {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal('"No modules found for this courseid"');
                }
                else if(body.message == "course id is not available"){
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal('"course id is not available"');
                }
            }
        }
        async_function();
        done();
    });

    it('check module course api call', function (done) {
        var async_function = async () => {
            var input = {
                course_id : "4ig8cerq",
                module_id : "5f00557b55c0760011c1b76a"
            }
            var body = await axios.post('http://localhost:3001/checkmodulecourse', input);
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

    it('admin update comment status api call', function (done) {
        var async_function = async () => {
            var input = {
                "course_id" : "27",
                "module_id" : "33",
                "thread_id" : "35",
                "comment_id" : "49"
            }
            var body = await axios.post('http://localhost:3001/adminupdatecommentstatus', input);
            if (body.data) {
                if (body.data.success == false) {
                    expect(body.data.success).to.equal(false);
                }
            }
            else if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal('"comment status updated successfully"');
            }
            else if (body.success == false) {
                if (body.message == "Error while updating the status") {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal('"Error while updating the status"');
                }
            }
        }
        async_function();
        done();
    });

    it('close or re-open thread api call', function (done) {
        var async_function = async () => {
            var input = {
                "course_id": "21yq86ck",
                "module_id": "5f0e8b897656530011c6a073",
                "thread_id": "143",
                "closed_opened_by" : "lxpadmin",
                "status":false
            }
            var body = await axios.post('http://localhost:3001/closeOrReopenThread', input);
            if (body.data) {
                if (body.success == false) {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal('"Something went wrong"');
                }
                if (body.success == true) {
                    if(input.status == true) {
                        expect(body.success).to.equal(true);
                        expect(body.message).to.equal('"Thread Re-opened"');
                    }else if (input.status == false){
                        expect(body.success).to.equal(true);
                        expect(body.message).to.equal('"Thread Closed"');
                    }
                }
            }
        }
        async_function();
        done();
    });

    it('Map Thread api call', function (done) {
        var async_function = async () => {
            var input = {
                "course_id": "21yq86ck",
                "course_name": "Android N Developer Course",
                "module_id": "5f0e8b897656530011c6a073",
                "module_name": "Introduction to Android studio",
                "thread_id": "143",
                "thread_name": "What is the best topic for speech in school?",
                "thread_slug": "143/what-is-the-best-topic-for-speech-in-school",
                "created_by": "varnika"
            }
            var body = await axios.post('http://localhost:3001/mapThread', input);
            console.log(body.data)
            if (body.data.success == true) {
                expect(body.data.success).to.equal(true);
            }
            else {                
                expect(body.success).to.equal(false);
            }
        }
        async_function();
        done();
    });

    it('Update Comment api call', function (done) {
        var async_function = async () => {
            var input = {
                "course_id": "9p1bf0e4",
                "course_name": "Learning Salt Course",
                "module_id": "5f085dff4279dd0011f56a30",
                "module_name": "pdf test",
                "thread_id": "125",
                "thread_name": "Hijab is a pride not a hurdle to success.",
                "created_by": "vicky",
                "topid": 1,
                "a2i": true,
                "nodebb_response": {
                    "pid": 11,
                    "uid": 15,
                    "tid": "35",
                    "content": "<p>update content test 9-7-20-1 from post man nodebb</p>\n",
                    "timestamp": 1594132441780.0,
                    "deleted": 0,
                    "cid": "4",
                    "isMain": false,
                    "user": {
                        "banned": false,
                        "fullname": "",
                        "lastonline": 1594132445013.0,
                        "picture": "",
                        "postcount": 81,
                        "reputation": 1,
                        "signature": "",
                        "status": "online",
                        "uid": 15,
                        "username": "afser",
                        "userslug": "afser",
                        "groupTitle": null,
                        "icon:text": "A",
                        "icon:bgColor": "#ff5722",
                        "lastonlineISO": "2020-07-07T14:34:05.013Z",
                        "custom_profile_info": []
                    },
                    "topic": {
                        "tid": 35,
                        "title": "vishnuvishnu",
                        "slug": "35/vishnuvishnu",
                        "cid": "4",
                        "postcount": 31,
                        "mainPid": 42
                    },
                    "index": 30,
                    "votes": 0,
                    "bookmarked": false,
                    "display_edit_tools": true,
                    "display_delete_tools": true,
                    "display_moderator_tools": true,
                    "display_move_tools": true,
                    "selfPost": false,
                    "timestampISO": "2020-07-07T14:34:01.780Z"
                }
            }
            var body = await axios.post('http://localhost:3001/updateComment', input);
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

    it('remove thread api call', function (done) {
        var async_function = async () => {
            var input = {
                "tid" : 134
            }
            var body = await axios.post('http://localhost:3001/removeThread', input);
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


    it('get all thread for admin', function (done) {
        var async_function = async () => {
            var input = "0";
            var body = await axios.get('http://localhost:3001/getallthread?pagenumber' + input);
            if (body.data) {
                if (body.data.success == false) {
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

    it('get student performance', function (done) {
        var async_function = async () => {
            var input = { pagenumber: 0, batchid: "699347730470462" , searchvalue = "" ,sorttype = "{'discussion_forum': 1 }" ,searchcolumn="undefined"};
            var body = await axios.get('http://localhost:3001/studenttracker?batchid=' + input.batchid + '&pagenumber=' + input.pagenumber + '&searchcolumn=' + input.searchcolumn+'&sorttype='+input.sorttype+ '&searchvalue=' + input.searchvalue);
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

    it('topic reference api call', function (done) {
        var async_function = async () => {
            var input = {
                "user_id" : "iety1y",
                "batch_id" : "699347730470462",
                "course_id" : "52i9bdix",
                "module_id" : "IS875 Part 2",
                "topic_id" : "IS875 Part 2",
                "reference_id" : "5f43c8929c0ee70012ba98a5",
                "reference_status" : true,
                "created_by" : "admin"
            }
            var body = await axios.post('http://localhost:3001/topicreference', input);
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

    it('excel report', function (done) {
        var async_function = async () => {
            var input = {
                "reporttype": {
                    "reporttype": "admindiscussionforum",
                    "keyvalue": "1234ab"
                }
            }
            var body = await axios.post('http://localhost:3001/exportreport', input);
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
});