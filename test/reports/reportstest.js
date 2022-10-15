const assert = require('chai').assert;
var expect = require('chai').expect;
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = "Bearer 104150f8e66cae68b40203e1dbba7b4529231970";
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('Registration Test Cases', function () {
 it('Organization Report api call', function (done) {
        var async_function = async () => {
            var body = await axios.get('http://localhost:3001/getOrganizationReportForDashboard');
            if (body.success == true) {
                if (body.message == 'Organization Report') {
                    expect(body.success).to.equal(true);
                    expect(body.message).to.equal("'Organization Report'");
                    expect(body.data).to.equal(body.data.length > 1);
                }
            }
            else if (body.success == false) {
                if (body.message == 'No Data.') {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal("'No Data.'");
                }
                else {
                    expect(body.success).to.equal(false);
                    expect(body.message).to.equal(body.message.length > 1);  
                }
            }
        }
        async_function();
        done();
    });
   
});