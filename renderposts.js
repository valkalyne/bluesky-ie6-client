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
                var leimageparent = document.createElement("a")
                var leimage = document.createElement("img")
                leimage.src = postdata.embed.images[i].thumb
                leimage.className = "postimage"
                leimageparent.appendChild(leimage)
                post.appendChild(leimageparent)
                leimageparent.href = postdata.embed.images[i].fullsize
                leimageparent.target = "_blank"
            }
        }
        else if (postdata.embed.media) {
            if (postdata.embed.media.images){
                for (var i in postdata.embed.media.images) {
                    var leimageparent = document.createElement("a")
                    var leimage = document.createElement("img")
                    leimage.src = postdata.embed.media.images[i].thumb
                    leimage.className = "postimage"
                    leimageparent.appendChild(leimage)
                    post.appendChild(leimageparent)
                    leimageparent.href = postdata.embed.media.images[i].fullsize
                    leimageparent.target = "_blank"
                }
            }
            if (postdata.embed.record){
                post.appendChild(document.createElement("br"))
                post.appendChild(document.createTextNode("[quote]"))
            }
        }
        else {
            post.appendChild(document.createElement("br"))
            post.appendChild(document.createTextNode(postdata.embed.$type))
        }

    }
    post.appendChild(document.createElement("br"))
    post.appendChild(postdate)
    post.appendChild(postfooter(postdata))
    document.getElementById("timeline").appendChild(post)

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