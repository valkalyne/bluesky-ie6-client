var postcount = 0
var feed
var parsedfeed
var auth
var cursor
var feedlength = 10

try{
    auth = JSON.parse($.jStorage.get("auth", null))
}
catch(error){  
    ;
}



function work() {
    refresh()
}

function login() {
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    XmlHttp.open("POST", "https://bsky.social/xrpc/com.atproto.server.createSession", false)
    XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    XmlHttp.send(JSON.stringify({
        "identifier": document.getElementById("usernameinput").value,
        "password": document.getElementById("passwordinput").value
    }));
    try{
        auth = JSON.parse(XmlHttp.responseText)
    }
    catch(error){
        alert("something has gone Horribly Wrong: " + error.message)
    }
    
    if (auth.active) {
        try{
            $.jStorage.set("auth",JSON.stringify(auth))
        }
        catch(error){
            alert("FUCK :( "+error )
        }
        //alert("success! reload to login")
        location.reload()
    }
    else {
        alert(JSON.parse(XmlHttp.responseText).message)
    }
}

function refreshsession() {
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    XmlHttp.open("POST", "https://bsky.social/xrpc/com.atproto.server.refreshSession", false)
    XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    XmlHttp.setRequestHeader("authorization", "Bearer " + auth.refreshJwt)
    XmlHttp.send(null);
    try{
        auth = JSON.parse(XmlHttp.responseText)
    }
    catch(error){
        var status = XmlHttp.status
        if (status = 403){
            alert("session expired. please log in again")
            auth = 
            logout()
        } 
        else{
            alert(XmlHttp.status)
        }
    }
    if (auth.active) {
        $.jStorage.set("auth",JSON.stringify(auth))
    }
    else {
        alert(XmlHttp.responseText)
    }
}

function refresh() {
    if (auth) {
        document.getElementById("bar").removeChild(document.getElementById("signedout"))
        document.getElementById("timelineheader").removeChild(document.getElementById("welcome"))
        document.getElementById("bar").style.display = "block"
        refreshsession()
        var XmlHttp
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            XmlHttp = new XMLHttpRequest()
        }
        else {
            // code for IE6, IE5
            XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        loaduserinfo(XmlHttp)
    }
    else {
        document.getElementById("bar").removeChild(document.getElementById("signedin"))
        document.getElementById("bar").style.display = "block"
    }
    refreshtimeline()
}

function logout() {
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    XmlHttp.open("POST", "https://bsky.social/xrpc/com.atproto.server.deleteSession", true)
    XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    XmlHttp.setRequestHeader("authorization", "Bearer " + auth.refreshJwt)
    XmlHttp.send(null);
    $.jStorage.deleteKey("auth")
    location.reload()
}


function loaduserinfo() {
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    XmlHttp.open("GET", "https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=" + auth.handle, false)
    XmlHttp.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
    XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    XmlHttp.send(null);
    var myprofile = JSON.parse(XmlHttp.responseText)
    document.getElementById("profilepaneusername").innerText = myprofile.handle
    document.getElementById("mypfp").src = myprofile.avatar
    document.getElementById("profilepanedisplayname").innerText = myprofile.displayName
    document.getElementById("followercount").innerText = myprofile.followersCount + " Followers"
    document.getElementById("followingcount").innerText = myprofile.followsCount + " Following"
    document.getElementById("postcount").innerText = myprofile.postsCount + " Posts"
}


function post(){
    refreshsession()
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }

    var post = {
        "collection": "app.bsky.feed.post",
        "record": {
            "$type": "app.bsky.feed.post",
            "createdAt": getcurrentiso(),
            "text": document.getElementById("newposttext").value
        },
        "repo": auth.handle
    }

    if (!document.getElementById("newposttext").value){
        alert("Write something!")
    }
    else{
        XmlHttp.open("POST", "https://bsky.social/xrpc/com.atproto.repo.createRecord", false)
        XmlHttp.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
        XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        XmlHttp.send(JSON.stringify(post));
        if (JSON.parse(XmlHttp.responseText).error){
            alert(JSON.parse(XmlHttp.responseText).message)
        }
        else{
            alert("post sent!")
            refreshtimeline()
        }
    }
}

function refreshtimeline(){
    document.getElementById("timeline").innerHTML = "Loading..."
    refreshtimelinebuffer()
}

function refreshtimelinebuffer(){
    if (auth){
        refreshsession()
    }
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    if (auth) {
        XmlHttp.open("GET", "https://bsky.social/xrpc/app.bsky.feed.getTimeline?limit="+feedlength+"&cursor="+getcurrentiso(), false)
        XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        XmlHttp.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
        XmlHttp.setRequestHeader("cache-control", "no-cache, no-store, max-age=0")
        XmlHttp.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT")
        XmlHttp.setRequestHeader("Pragma", "no-cache")
    }
    else {
        XmlHttp.open("GET", "https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot&limit="+feedlength+"&lang=en", false)
        //XmlHttp.open("GET", "stupid.json", false)
        XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    }
    XmlHttp.send(null);
    feed = XmlHttp.responseText
    parsedfeed = JSON.parse(feed)
    cursor = parsedfeed.cursor
    postcount = 0
    document.getElementById("timeline").innerHTML = ""
    for (var i in parsedfeed.feed) {
        htmlpost(parsedfeed.feed[i].post,parsedfeed.feed[i].reason,parsedfeed.feed[i].reply)
        postcount += 1
    }
}

function ShowMore(){
    if(cursor){
        if (auth){
            refreshsession()
        }
        var XmlHttp
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            XmlHttp = new XMLHttpRequest()
        }
        else {
            // code for IE6, IE5
            XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        if (auth) {
            XmlHttp.open("GET", "https://bsky.social/xrpc/app.bsky.feed.getTimeline?limit="+feedlength+"&cursor="+cursor, false)
            XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
            XmlHttp.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
            XmlHttp.setRequestHeader("cache-control", "no-cache, no-store, max-age=0")
            XmlHttp.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT")
            XmlHttp.setRequestHeader("Pragma", "no-cache")
        }
        else {
            XmlHttp.open("GET", "https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot&limit="+feedlength+"&lang=en&cursor="+cursor, false)
            //XmlHttp.open("GET", "stupid.json", false)
            XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        }
        XmlHttp.send(null);
        feed = XmlHttp.responseText
        parsedfeed = JSON.parse(feed)
        cursor = parsedfeed.cursor
        for (var i in parsedfeed.feed) {
            htmlpost(parsedfeed.feed[i].post,parsedfeed.feed[i].reason,parsedfeed.feed[i].reply)
            postcount += 1
        }
    }
    else {
        alert("japed. Sorry")
    }
}





