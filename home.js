var postcount = 0
var feed
var parsedfeed
var auth
try{
    auth = JSON.parse(getCookie("auth"))
}
catch{  
    
}


function repostbanner(name){
    var banner = document.createElement("table")
    var wvgwbwgw = document.createElement("tr")
    var tbody = document.createElement("tbody")
    banner.appendChild(tbody)
    tbody.appendChild(wvgwbwgw)
    var iconparent = document.createElement("td")
    var text = document.createElement("td")
    wvgwbwgw.appendChild(iconparent)
    wvgwbwgw.appendChild(text)
    text.innerText = "Reposted by " + name
    var icon = document.createElement("img")
    icon.src = '/icons/arrow_refresh.png'
    iconparent.appendChild(icon)
    banner.className = "banner"
    return banner
}

function pinnedbanner(){
    var banner = document.createElement("table")
    var wvgwbwgw = document.createElement("tr")
    var tbody = document.createElement("tbody")
    banner.appendChild(tbody)
    tbody.appendChild(wvgwbwgw)
    var iconparent = document.createElement("td")
    var text = document.createElement("td")
    wvgwbwgw.appendChild(iconparent)
    wvgwbwgw.appendChild(text)
    text.innerText = "Pinned"
    var icon = document.createElement("img")
    icon.src = '/icons/anchor.png'
    iconparent.appendChild(icon)
    banner.className = "banner"
    return banner
}

function replybanner(name){
    var banner = document.createElement("table")
    var wvgwbwgw = document.createElement("tr")
    var tbody = document.createElement("tbody")
    banner.appendChild(tbody)
    tbody.appendChild(wvgwbwgw)
    var iconparent = document.createElement("td")
    var text = document.createElement("td")
    wvgwbwgw.appendChild(iconparent)
    wvgwbwgw.appendChild(text)
    text.innerText = "Replying to " + name
    var icon = document.createElement("img")
    icon.src = '/icons/comments.png'
    iconparent.appendChild(icon)
    banner.className = "banner"
    return banner
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


function htmlpost(postdata, reason, reply) {
    var post = document.createElement("div")
    post.className = "post oddpost"
    if (postcount % 2) {
        post.className = "post"
    }

    var postheader = document.createElement("table")
    postheader.className = "profileheader"

    var postheadertbody = document.createElement("tbody")
    postheader.appendChild(postheadertbody)
    var postheadertr = document.createElement("tr")
    postheadertbody.appendChild(postheadertr)


    var postpfpparent = document.createElement("td")
    postpfpparent.width = "32"

    var postusername = document.createElement("td")
    postusername.innerHTML = "<span class='displayname'>" + postdata.author.displayName + "</span><br><span class='username'>" + postdata.author.handle + "</span>"

    var postpfp = document.createElement("img")
    postpfp.src = postdata.author.avatar
    postpfp.className = "postpfp"
    postpfp.width = 32
    postpfp.height = 32

    postpfpparent.appendChild(postpfp)

    postheadertr.appendChild(postpfpparent)
    postheadertr.appendChild(postusername)

    var posttext = document.createElement("span")
    posttext.className = "posttext"
    posttext.innerText = postdata.record.text

    var postdate = document.createElement("span")
    postdate.className = "date"
    postdate.innerText = postdata.record.createdAt

    if (reason){
        if(reason.by){
            post.appendChild(repostbanner(reason.by.handle))
        }
        else if(reason.type = "app.bsky.feed.defss#reasonPin"){
            post.appendChild(pinnedbanner())
        }

    }
    if (reply){
        post.appendChild(replybanner(reply.parent.author.handle))
    }

    post.appendChild(postheader)
    post.appendChild(posttext)
    if (postdata.embed) {
        post.appendChild(document.createElement("br"))
        if (postdata.embed.images) {
            for (var i in postdata.embed.images) {
                var leimage = post.appendChild(document.createElement("img"))
                leimage.src = postdata.embed.images[i].thumb
                leimage.alt = postdata.embed.images[i].alt
                leimage.title = postdata.embed.images[i].alt
                leimage.className = "postimage"
            }
        }
        else if (postdata.embed.media) {
            if (postdata.embed.media.images){
                for (var i in postdata.embed.media.images) {
                    var leimage = post.appendChild(document.createElement("img"))
                    leimage.src = postdata.embed.media.images[i].thumb
                    leimage.alt = postdata.embed.media.images[i].alt
                    leimage.title = postdata.embed.media.images[i].alt
                    leimage.className = "postimage"
                }
            }
            if (postdata.embed.record){
                post.appendChild(document.createElement("br"))
                post.appendChild(document.createTextNode("[quote]"))
            }
        }
        else {
            post.appendChild(document.createTextNode("EMBED!!!"))
        }

    }
    post.appendChild(document.createElement("br"))
    post.appendChild(postdate)
    post.appendChild(postfooter(postdata))
    document.getElementById("timeline").appendChild(post)

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


function postfooter(postdata){
    var footertable = document.createElement("table")
    var footertabletbody = document.createElement("tbody")
    footertable.appendChild(footertabletbody)
    var footertabletr = document.createElement("tr")
    footertabletbody.appendChild(footertabletr)

    //----------------------------------------------------

    var likeimageparent = document.createElement("td")
    var likeimage = document.createElement("img")
    likeimage.src = "/icons/heart_add.png"

    var footerlikes = document.createElement("td")
    likeimageparent.appendChild(likeimage)
    footerlikes.appendChild(document.createTextNode(postdata.likeCount + " Likes"))

    footertabletr.appendChild(likeimageparent)
    footertabletr.appendChild(footerlikes)
    
    //-----------------------------------------------------

    //----------------------------------------------------

    var repostimageparent = document.createElement("td")
    var repostimage = document.createElement("img")
    repostimage.src = "/icons/arrow_refresh.png"

    var footerreposts = document.createElement("td")
    repostimageparent.appendChild(repostimage)
    footerreposts.appendChild(document.createTextNode(postdata.repostCount+postdata.quoteCount))

    footertabletr.appendChild(repostimageparent)
    footertabletr.appendChild(footerreposts)
    
    //-----------------------------------------------------

    //----------------------------------------------------

    var commentimageparent = document.createElement("td")
    var commentimage = document.createElement("img")
    commentimage.src = "/icons/comments.png"

    var footercomments = document.createElement("td")
    commentimageparent.appendChild(commentimage)
    footercomments.appendChild(document.createTextNode(postdata.replyCount))

    footertabletr.appendChild(commentimageparent)
    footertabletr.appendChild(footercomments)
    
    //-----------------------------------------------------
    return footertable
}











