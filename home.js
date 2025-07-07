var postcount = 0
var feed
var parsedfeed
var auth
try{
    auth = JSON.parse(getCookie("auth"))
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
    auth = JSON.parse(XmlHttp.responseText)
    if (auth.active) {
        setCookie("auth", JSON.stringify(auth), 7)
        location.reload()
    }
    else {
        alert(XmlHttp.responseText)
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
    auth = JSON.parse(XmlHttp.responseText)
    if (auth.active) {
        setCookie("auth", JSON.stringify(auth), 7)
    }
    else {
        alert(XmlHttp.responseText)
    }
}

function refresh() {
    if (auth) {
        var XmlHttp
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            XmlHttp = new XMLHttpRequest()
        }
        else {
            // code for IE6, IE5
            XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        refreshsession()
        document.getElementById("bar").removeChild(document.getElementById("signedout"))
        loaduserinfo(XmlHttp)
    }
    else {
        document.getElementById("bar").removeChild(document.getElementById("signedin"))
    }
    document.getElementById("bar").style.display = "block"

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
        XmlHttp.open("GET", "https://bsky.social/xrpc/app.bsky.feed.getTimeline?limit=50", false)
        XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        XmlHttp.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
        XmlHttp.setRequestHeader("cache-control", "no-cache, no-store, max-age=0")
        XmlHttp.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT")
        XmlHttp.setRequestHeader("Pragma", "no-cache")
    }
    else {
        XmlHttp.open("GET", "stupid.json", false)
        XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    }
    XmlHttp.send(null);
    feed = XmlHttp.responseText
    parsedfeed = JSON.parse(feed)
    postcount = 0
    for (var i in parsedfeed.feed) {
        htmlpost(parsedfeed.feed[i].post,parsedfeed.feed[i].reason,parsedfeed.feed[i].reply)
        postcount += 1
    }
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
    setCookie("auth", "", -10)
    location.reload()
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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
    var XmlHttp
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        XmlHttp = new XMLHttpRequest()
    }
    else {
        // code for IE6, IE5
        XmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    XmlHttp.open("GET", "https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + auth.handle, false)
    XmlHttp.setRequestHeader("authorization", "Bearer " + auth.accessJwt)
    XmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    XmlHttp.send(null);
}












