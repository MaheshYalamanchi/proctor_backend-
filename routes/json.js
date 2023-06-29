let videoassData = async (params) => {
    let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_');
    let addons;
    if (params.videoass == "VA"){
        addons = ["check","track","record","preview","finish","auto"];
    } else if (params.videoass == "QUE"){
        addons = ["record","track","preview","auto"]
    }
    
    let videoassData = {
        "_id" : params.id,
        "timesheet" : {
            "xaxis" : [],
            "yaxis" : []
        },
        "invites" : [],
        "quota" : 0,
        "concurrent" : 0,
        "members" : [],
        "addons" : addons,
        "metrics" : [
            "b1",
            "b2",
            "b3",
            "c1",
            "c2",
            "c3",
            "c4",
            "c5",
            "h1",
            "k1",
            "m1",
            "m2",
            "m3",
            "n1",
            "n2",
            "s1",
            "s2"
        ],
        "weights" : [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ],
        "status" : "created",
        "tags" : [ 
            params.nickname
        ],
        "subject" : params.subject,
        "locale" : null,
        "timeout" : 90,
        "rules" : "https://info.lntiggnite.com/Video/clip_en.html",
        "threshold" : 0,
        "createdAt" : new Date(),
        "updatedAt" : new Date(),
        "api" : null,
        "comment" : null,
        "complete" : false,
        "conclusion" : null,
        "deadline" : null,
        "stoppedAt" : null,
        "timezone" : null,
        "url" : null,
        "lifetime" : null,
        "error" : null,
        "scheduledAt" : new Date(),
        "duration" : null,
        "incidents" : null,
        "integrator" : "sdk",
        "ipaddress" : null,
        "score" : null,
        "signedAt" : new Date(),
        "startedAt":null,
        "useragent" : null,
        "proctor" : null,
        "student" : username,
        "template" : params.template,
        "averages" : {}
    }
    return videoassData;
    
};
let roomsData =  async (params) => {
    let addons = ["track","record","finish","auto","screen","chat","preview","check","face","passport","content","upload"]
    let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_')
    let getrooms = {
        "_id" : params.id,
        "timesheet" : {
            "xaxis" : [],
            "yaxis" : []
        },
        "invites" : [],
        "quota" : 0,
        "concurrent" : 0,
        "members" : [],
        "addons" : addons,
        "metrics" : [
            "b1",
            "b2",
            "b3",
            "c1",
            "c2",
            "c3",
            "c4",
            "c5",
            "h1",
            "k1",
            "m1",
            "m2",
            "m3",
            "n1",
            "n2",
            "s1",
            "s2"
        ],
        "weights" : [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ],
        "status" : "created",
        "tags" : [ 
            params.nickname
        ],
        "subject" : params.subject,
        "locale" : null,
        "timeout" : 90,
        "rules" : "https://info.lntiggnite.com/Video/clip_en.html",
        "threshold" : 0,
        "createdAt" : new Date(),
        "updatedAt" : new Date(),
        "api" : null,
        "comment" : null,
        "complete" : false,
        "conclusion" : null,
        "deadline" : null,
        "stoppedAt" : null,
        "timezone" : null,
        "url" : null,
        "lifetime" : null,
        "error" : null,
        "scheduledAt" : new Date(),
        "duration" : null,
        "incidents" : null,
        "integrator" : "sdk",
        "ipaddress" : null,
        "score" : null,
        "signedAt" : new Date(),
        "startedAt":null,
        "useragent" : null,
        "proctor" : null,
        "student" : username,
        "template" : params.template,
        "averages" : {}
    }
    return getrooms;
    
}

module.exports = {
    videoassData,
    roomsData
}


