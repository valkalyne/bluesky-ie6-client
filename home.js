var postcount = 0
var feed
var parsedfeed
var auth
var cursor
var feedlength = 10

function newxhr(){
    var xhr
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP")
    }
    return xhr
}

try{
    auth = JSON.parse($.jStorage.get("auth", null))
}
catch(error){  
    ;
}

function work() {
    showthings()
    setTimeout(refresh,100)
}

function login() {
    var xhr = newxhr()
    xhr.open("POST", "https://bsky.social/xrpc/com.atproto.server.createSession", false)
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    xhr.send(JSON.stringify({
        "identifier": document.getElementById("usernameinput").value,
        "password": document.getElementById("passwordinput").value
    }));
    try{
        auth = JSON.parse(xhr.responseText)
    }
    catch(error){
        alert("something has gone Horribly Wrong: " + xhr.responseText)
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
        alert(JSON.parse(xhr.responseText).message)
    }
}

function refreshsession() {
    var xhr = newxhr()
    xhr.open("POST", "https://bsky.social/xrpc/com.atproto.server.refreshSession", false)
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    xhr.setRequestHeader("authorization", "Bearer " + auth.refreshJwt)
    xhr.send(null);
    try{
        auth = JSON.parse(xhr.responseText)
    }
    catch(error){
        var status = xhr.status
        if (status = 403){
            alert("session expired. please log in again")
            auth = 
            logout()
        } 
        else{
            alert(xhr.status)
        }
    }
    if (auth.active) {
        $.jStorage.set("auth",JSON.stringify(auth))
    }
    else {
        alert(xhr.responseText)
    }
}

function refresh() {
    document.getElementById("timeline").innerHTML = "Loading..."
    if (auth) {
        refreshsession()
        loaduserinfo()
    }
    setTimeout(refreshtimeline, 100)
}

function logout() {
    var xhr = newxhr()
    xhr.open("POST", "https://bsky.social/xrpc/com.atproto.server.deleteSession", true)
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    xhr.setRequestHeader("authorization", "Bearer " + auth.refreshJwt)
    xhr.send(null);
    $.jStorage.deleteKey("auth")
    location.reload()
}


function loaduserinfo() {
    var xhr = newxhr()
    xhr.open("GET", "https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=" + auth.handle, false)
    xhr.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    xhr.send(null);
    var myprofile = JSON.parse(xhr.responseText)
    document.getElementById("profilepaneusername").innerText = "@"+myprofile.handle
    document.getElementById("mypfp").src = myprofile.avatar
    document.getElementById("profilepanedisplayname").innerText = myprofile.displayName
    document.getElementById("followercount").innerText = myprofile.followersCount
    document.getElementById("followingcount").innerText = myprofile.followsCount
}


function post(){
    refreshsession()
    var xhr = newxhr()

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
        xhr.open("POST", "https://bsky.social/xrpc/com.atproto.repo.createRecord", false)
        xhr.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        xhr.send(JSON.stringify(post));
        if (JSON.parse(xhr.responseText).error){
            alert(JSON.parse(xhr.responseText).message)
        }
        else{
            alert("post sent!")
            document.getElementById("timeline").innerHTML = "Loading..."
            setTimeout(refreshtimeline,100)
        }
    }
}

function refreshtimeline(){
    var xhr = newxhr()
    if (auth) {
        xhr.open("GET", "https://bsky.social/xrpc/app.bsky.feed.getTimeline?limit="+feedlength+"&cursor="+getcurrentiso(), false)
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        xhr.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
        xhr.setRequestHeader("cache-control", "no-cache, no-store, max-age=0")
        xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT")
        xhr.setRequestHeader("Pragma", "no-cache")
    }
    else {
        //xhr.open("GET", "https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot&limit="+feedlength+"&lang=en", false)
        xhr.open("GET", "stupid.json", false)
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    }
    xhr.send(null);
    feed = xhr.responseText
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
        var xhr = newxhr()
        if (auth) {
            xhr.open("GET", "https://bsky.social/xrpc/app.bsky.feed.getTimeline?limit="+feedlength+"&cursor="+cursor, false)
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
            xhr.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
            xhr.setRequestHeader("cache-control", "no-cache, no-store, max-age=0")
            xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT")
            xhr.setRequestHeader("Pragma", "no-cache")
        }
        else {
            //xhr.open("GET", "https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot&limit="+feedlength+"&lang=en&cursor="+cursor, false)
            xhr.open("GET", "stupid.json", false)
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        }
        xhr.send(null);
        feed = xhr.responseText
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

function showthings(){
    if (auth) {
        document.getElementById("bar").removeChild(document.getElementById("signedout"))
        document.getElementById("timelineheader").removeChild(document.getElementById("welcome"))
    }
    else {
        document.getElementById("bar").removeChild(document.getElementById("signedin"))
        document.getElementById("timelineheader").removeChild(document.getElementById("timelinecontrols"))
        document.getElementById("timelineheader").removeChild(document.getElementById("feedname"))
        
    }
    document.getElementById("bar").style.display = "block"
    document.getElementById("timeline").innerHTML = "Loading..."
}



