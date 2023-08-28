$("#sms_reply").mouseover(function(){
    //$("#sms_reply").css("background-color", "yellow");
    $("#sms_reply").css({"background-color": "#B8B1AF ", "cursor": "pointer","border-radius":"50%","padding":"4px"});
    //cursor: pointer;
});

$("#sms_reply").mouseout(function(){
    $("#sms_reply").css({"background-color": "initial", "border-radius":"50%","padding":"4px"});
});


//reply SMS button click event
$('#content>div').delegate('#sms_reply','click',function() {
    // your code here ...
    this.disabled=true;
    //alert("what the heck man??");


    var send_to_num = $('#sms_from').val();
    //alert(send_to_num);
    var reply_template = '<div class="mail-box">' +
        '<div class="form-group">' +
        '<label for="To">To:</label>' + '  ' +
        '<input class="form-control hidden smsFrom"  style="width: 100%;">' +
        send_to_num +
        '</input>' +
        '</div>' +

        '<div class="form-group">' +
        '<label for="comment">Content:</label>' +
        '<textarea class="form-control" rows="10" id="mailComment"></textarea>' +
        '</div>' +

        '<div class="form-group">' +
        '<button type="button" class="btn btn-primary" id="btnSendMail">Send</button>' +
        '</div>' +

        'this is the part of replying,ok?' +
        '</div>';

    $('.mail-detail').append(reply_template);
    document.getElementById("mailComment").focus();
});

// Send SMS reply button
$('#content>div').delegate('#btnSendMail','click',function() {
    //    alert("Are you sure man??");
    //    alert("Are you sure man??");

    var _data = {};

    _data.send_out = 0;
    _data.original_msg_id = $('#sms_or_msg_id').val();
    _data.original_body = $("#sms_or_body").val() ;
    _data.setBody = $('#mailComment').val() ;
    _data.setTo = $('#sms_from').val();
    _data.setSource = "salescontroller.com";
    _data.setFrom = $('#sms_to').val();

    $.ajax({
        url: 'https://api.warrantyproject.com/_smSendSMS.php',
        type: 'post',
        data: _data,
        dataType: 'json',
        success: function (res) {
            // if (callback) callback(res);
            alert("Sent successfully!");
        },
        error: function (e) {

        }
    })

});