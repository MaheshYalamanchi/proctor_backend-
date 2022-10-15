var url = require('url');
module.exports = {
    parseSession: function (req) {
        var db = (req.session) ? req.session.db : null;
        var requestJSON = [],
            url_parts = url.parse(req.url, true),
            query = url_parts.query;
        return JSON.parse(JSON.stringify({
            database:(db)? db.database:null,
            db: (db) ? db.url + db.database : null,
            q: query,
            b: req.body
        }));
    }
}