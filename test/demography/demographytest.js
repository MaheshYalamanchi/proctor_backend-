const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Demography Test Cases', function () {
    it('getcountry api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/getcountry');
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

    it('getstate api call', function (done) {
        var async_function = async () => {
            var input = {
                "_id" : "5bd0597eb339b81c30d3e7f2"
            }
            var body = await axios.post('http://localhost:3004/getstate='+input);
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

    it('getdistrict api call', function (done) {
        var async_function = async () => {
            var input = {
                "country": "5bd0597eb339b81c30d3e7f2", 
                "state": "5bd05f02acc8d91d8f841ac5"
            }
            var body = await axios.post('http://localhost:3004/getdistrict');
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

    it('language api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/language');
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

    it('qualification api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/qualification');
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

    it('boarduniversity api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/boarduniversity');
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

    it('getdiscipline api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/getdiscipline');
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
    
    it('getspecification api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/getspecification');
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

    it('getinstitute api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3004/getinstitute');
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
