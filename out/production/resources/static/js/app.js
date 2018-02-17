var stompClient = null;
var minId = null;
var ownPost = [];
var pendingDraft = [];

function connect() {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/subscribe/draft', function (data) {
            addPendingDraft(JSON.parse(data.body));
            refreshPendingDraft();
        });
        stompClient.subscribe('/subscribe/comment', function (data) {
            data = (JSON.parse(data.body));
            $("#commentFor" + data.draft.id).append(`<div class='commentItem'>${urlify(esc(data.body))}</div><br/>`);
            addCommentCounter(data.draft.id);
        });
    });
}

function refreshPendingDraft(){
    ownPost.forEach((postItem) => {
        pendingDraft.forEach((pendingItem) => {
            if(postItem === pendingItem.id){
                extractPendingDraft();
                return;
            }
        });
    });
}

function extractPendingDraft(){
    $("#extractPendingDraft").hide();
    pendingDraft.forEach((item) => {
        $("#draftList").prepend(newDraft(item));
        getComment(item.id);
        addScanner(item.id);
    });
    pendingDraft = [];
}

function addPendingDraft(data){
    pendingDraft.push(data);
    $("#extractPendingDraft").html("<b>See new draft.. (" + pendingDraft.length + ")</b>");
    $("#extractPendingDraft").show();
}

function toggleComment(id){
    var obj = $("#commentSectionFor" + id);
    if(obj.css("display") == "block")obj.hide();
    else obj.show();
}

function addScanner(id){
    $('#inputComment' + id).keypress(function (e) {
        if (e.which == 13) {
            $('#buttonCommentFor' + id).click();
            return false;
        }
    });
}


function newDraft(data){
    return `<div class='panel panel-primary'>
                <div class='panel-body draft-body'>
                    <b style="font-size:18px;">From: </b>${esc(data.sender)}<br/>
                    <b style="font-size:18px;">To: </b>${esc(data.receiver)}<br/>
                    <b style="font-size:18px;">Message: </b>${urlify(esc(data.body))}<br/>
                </div>
                <div style='padding:20px;'>
                <b style='cursor:pointer;' onclick='toggleComment(${data.id})'><span id='commentCounterFor${data.id}'></span> <span class='glyphicon glyphicon-comment'></span></b> 
                    <span onclick='copyLink(${data.id})' style='cursor:pointer;margin-left:20px;' class='glyphicon glyphicon-link'></span>
                </div>
                <div class='panel-footer commentSection' id='commentSectionFor${data.id}' style='display:none;'>
                    <div id='commentFor${data.id}'></div>
                    <div class='input-group'>
                        <input type='text' maxlength='255' id='inputComment${data.id}' placeholder='Write a comment..' class='form-control commentInput'/>
                        <span class='input-group-btn'>
                            <button class='btn btn-primary' id='buttonCommentFor${data.id}'type='button' onclick='addComment(${data.id})'>Send</button>
                        </span>
                    </div>
                </div>
            </div>`;
}

function getLatestDraft(){
    $.ajax({
        type: "json",
        method: "GET",
        url: "/draft/get/latest",
        data: {},
        success: (data) => {
            data.forEach(item => {
                $("#draftList").append(newDraft(item));
                getComment(item.id);
                addScanner(item.id);
                minId = item.id;
            });
            if(minId <= 1)$("#getNextDraft").hide();
            else $("#getNextDraft").show();
        }
    });
}

function searchDraft(){
    $.ajax({
        type: "json",
        method: "GET",
        url: "/draft/get/search",
        data: {"key" : getParameterByName("key")},
        success: (data) => {
            data.forEach(item => {
                $("#draftList").append(newDraft(item));
                getComment(item.id);
                addScanner(item.id);
            });
            if(data.length === 0)
                $("#draftList").append(`<div class="panel panel-primary"><div class="panel-body"><center>Nothing found</center></div></div>`);
        }
    });
}

function getNextDraft(){
    $("#getNextDraft").html("loading..");
    $("#getNextDraft").prop("disabled", true);
    $.ajax({
        type: "json",
        method: "GET",
        url: "/draft/get/next",
        data: {"after":minId},
        success: (data) => {
            data.forEach(item => {
                $("#draftList").append(newDraft(item));
                getComment(item.id);
                addScanner(item.id);
                minId = item.id;
            });
            $("#getNextDraft").html("Load more..");
    		$("#getNextDraft").prop("disabled", false);
            if(minId <= 1)$("#getNextDraft").hide();
            else $("#getNextDraft").show();
        },
        error: () => {
        	notifError("Error to load data");
            $("#getNextDraft").html("Load more..");
    		$("#getNextDraft").prop("disabled", false);
        }
    });
}

function addDraft(){
    if($("#from").val() === "" || $("#to").val() === "" || $("#message").val() === "")
        return;
    
    $("#from").prop('disabled', true);
    $("#to").prop('disabled', true);
    $("#message").prop('disabled', true);
    $("#addDraft").html("sending...");
    $("#addDraft").prop('disabled', true);
    
    $.ajax({
        type: "json",
        method: "POST",
        url: "/draft/add",
        data: {"from": $("#from").val(),
                "to": $("#to").val(),
                "message": $("#message").val()},
        success: (data) => {
            ownPost.push(data);
            refreshPendingDraft();
            $("#from").val("");
            $("#to").val("");
            $("#message").val("");
            $("#from").prop('disabled', false);
            $("#to").prop('disabled', false);
            $("#message").prop('disabled', false);
            $("#addDraft").html("Post!");
            $("#addDraft").prop('disabled', false);
        },
        error: (jqXHR, textStatus, errorThrown ) => {
            notifError("Error to add new draft");
            $("#from").prop('disabled', false);
            $("#to").prop('disabled', false);
            $("#message").prop('disabled', false);
            $("#addDraft").html("Post!");
            $("#addDraft").prop('disabled', false);
        }
    });
}

function addComment(id){
    if($("#inputComment"+id).val() === "")
        return;
    $("#inputComment"+id).prop("disabled", true);
    $.ajax({
        type: "json",
        method: "POST",
        url: "/comment/add",
        data: {"id": id,
                "body": $("#inputComment"+id).val()},
        success: (data) => {
            $("#inputComment" + id).val("");
            $("#inputComment"+id).prop("disabled", false);
        },
        error: (jqXHR, textStatus, errorThrown ) => {
            notifError("Error to add new comment");
            $("#inputComment"+id).prop("disabled", false);
        }
    });
    
}

function notifError(text){
    $.notify({
        message: text
    },{
        type: 'danger',
        placement: {
            from: "top",
            align: "center"
        },
        delay: 600,
        timer: 200,
    });
}

function getComment(id){
    $.ajax({
        type: "json",
        method: "GET",
        url: "/comment/get",
        data: {'id':id},
        success: (data) => {
            data.forEach(item => {
                $("#commentFor"+id).append(`<div class='commentItem'>${urlify(esc(item.body))}</div><br/>`);
                addCommentCounter(id);
            });
        }
    });
}

function addCommentCounter(id){
    if($("#commentCounterFor"+id).html()==="")
        $("#commentCounterFor"+id).html(1);
    else
        $("#commentCounterFor"+id).html(parseInt($("#commentCounterFor"+id).html())+1);
}

function getSingleDraft(){
    id = getParameterByName("id");
    $.ajax({
        type: "json",
        method: "GET",
        url: "/draft/get/id",
        data: {'id':id},
        success: (data) => {
            if(data===""){
                window.location.replace("404.html");
            }else{
                $("#draft").append(newDraft(data))
                getComment(data.id);
                addScanner(data.id);
                toggleComment(data.id);
            }
        },
        error: () => {
            window.location.replace("404.html");
        }
    });
}

function copyLink(id) {
    var text = "draft-online.herokuapp.com/detail.html?id=" + id;
    var textArea = document.createElement("textarea");
  
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    var successful = document.execCommand('copy');
    $.notify({
        message: 'Link successfully copied to clipboard' 
    },{
        type: 'success',
        placement: {
            from: "top",
            align: "center"
        },
        delay: 200,
        timer: 100,
    });
    document.body.removeChild(textArea);
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function esc(word){
    var lt = /</g,  gt = />/g,  ap = /'/g,  ic = /"/g;
    return word.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
}

function urlify(text) {
    var ret = [];
    var splittedText = text.split(" ");
    splittedText.forEach(word => {
        if(word.length <= 1 || word.charAt(0) !== "#" || word.split("#").length > 2) ret.push(word);
        else ret.push('<a style="color:black;" href="search.html?key=' + word.replace("#", "%23") + '"><b>' + word + '</b></a>');
    });
    return ret.join(" ");
}

function getTrends(){
    $("#refresh").attr("class", "glyphicon glyphicon-refresh");
    $("#refresh").attr("id", "refreshing");
    $("#refreshButton").prop("disabled", true);
    $.ajax({
        type: "json",
        method: "GET",
        url: "/trends/get",
        success: (data) => {
            $("#trendsList").html("");
            data.forEach(item => $("#trendsList").append(`${urlify(esc(item.body))}<br/>`));
            $("#refreshing").attr("class", "glyphicon glyphicon-repeat");
            $("#refreshing").attr("id", "refresh");
    		$("#refreshButton").prop("disabled", false);
        },
        error: () => {
            notifError("Error to get data");
            $("#refreshing").attr("class", "glyphicon glyphicon-repeat");
            $("#refreshing").attr("id", "refresh");
    		$("#refreshButton").prop("disabled", false);
        }
    });
}