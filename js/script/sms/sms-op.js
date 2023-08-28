function SMSInbox() {
    window.linkForTable = '';
    window.SMSTable = '';
    delete window.myDataTable;
}

SMSInbox.prototype = {
    constructor: SMSInbox,

    bindEvent: function () {
        $("#sms_reply").mouseover(function(){
            //$("#sms_reply").css("background-color", "yellow");
            $("#sms_reply").css({"background-color": "#B8B1AF ", "cursor": "pointer","border-radius":"50%","padding":"4px"});
            //cursor: pointer;
        });

        $("#sms_reply").mouseout(function(){
            $("#sms_reply").css({"background-color": "initial", "border-radius":"50%","padding":"4px"});
        });

        $(document).unbind('click', '.btnReplySMS').on('click', '.btnReplySMS', function () {
            //alert("this is working");
            //$(this).removeClass('unread');
            var note = $(this).closest('tr').find('td');
            $('#reply_sms_body .resend_name').val(note.eq(7).text());
            //alert(note.eq(0).text());
            $('#reply_sms_body .original_msg').val(note.eq(3).text());
            $('#reply_sms_body .sender_id').val(note.eq(5).text());
            $('#reply_sms_body .receiver_id').val(note.eq(6).text());
            $('#reply_sms_body .resend_from').val(note.eq(8).text());
            $('#reply_sms').show();
        });



        $(document).unbind('click', '.btnforwardSMS').on('click', '.btnforwardSMS', function () {
        //    alert("this is the forwarding button");
            var note = $(this).closest('tr').find('td');        
            $("#forward_sms_body .resend_content").summernote("code",'<br>'+ '<br>'+ '<span>--------Forwarded message--------</span>' + '<br>'  + '<span>From:  ' + ' '  + note.eq(2).text() + '</span>' + '<span>' + ' ' +  '<'  + note.eq(1).text() + '>' + '<br>' +  '</span>' + '<span>Date: ' + ' '  + note.eq(4).text() + '</span>' + '<br>' + '<span>To: ' + note.eq(8).text() + '</span>' + '<br>' + '<br>' +'<span>' + " "  + note.eq(3).text() + '</span>');

            $('.resend_content').val(note.eq(2).text());
            $('#forward_sms_body .msg_id').val(note.eq(10).text());
            $('#forward_sms_body .receiver_name').val(note.eq(11).text());
            
            $('#forward_sms').show();
        });

        
        $("#forward_sms_btn").on('click',function(){
            var text = $("#forward_sms_body .resend_content").summernote('code');
            var forward_to = $( "#forward_to_contact option:selected" ).val();
            var forward_from = $("#contact_inbox_get").val();
            var _message_id = $('#forward_sms_body .msg_id').val();
            var senderName = $('#forward_sms_body .receiver_name').val();
            var receiverName = $( "#forward_to_contact option:selected" ).text();
            var time =  (Date.now()/1000);

            $.ajax({
                url: link._smsForward,
                type: 'post',
                dataType: 'json',
                data: {
                    token: localStorage.getItemValue('token'),
                    senderID: forward_from ,
                    senderName: senderName,
                    receiverID: forward_to,
                    receiverName: receiverName,
                    forwarded_content: text,
                    timestamp : time
                },
                success: function (res) {
                    messageForm('Message have been forwarded succesfully', true, '#forward_sms .message_chat');
                },
                error: function (e) {
                }
            })
        });


        $("#reply_sms_btn").on('click',function(){
            var _data = {};
            _data.contactID = $(".receiver_id").val();
            //get SMS API key first, if have continue
            $.ajax({
                url: link._sms_getAPIkey,
                type: 'post',
                dataType: 'json',
                data: _data,
                success: function (res) {
                    if(!res.list.sms_api_username && !res.list.sms_api_key) {
                    //    alert("this is empty");
                        messageForm('You do not have privilege to send SMS', false, '#reply_sms .message_chat');
                    } else {
                        _data.sms_api_username = res.list.sms_api_username;
                        _data.sms_api_key = res.list.sms_api_key;
                        var a = "1";
                        var to = $(".resend_name").val();
                        var from = $(".resend_from").val();
                        var new_from = from.match(/\d+/g).join([]);
                        var body = $(".resend_content").val();
                        var doc = new DOMParser().parseFromString(body, 'text/html');

                        _data.setBody = doc.body.textContent ;
                        _data.setTo = to;
                        _data.setSource = "http://salescontrolcenter.com/";
                        _data.setFrom = parseInt(new_from);

                        var _dedicated_list = [];
                        var sender_id = $(".sender_id").val();
                        var receiver_id = $(".receiver_id").val();
                        $.ajax({
                            url: link._sms_dedicated_number_list,
                            type: 'post',
                            data: _data,
                            dataType: 'json',
                            success: function (res) {
                                for (var i = 0; i < res.list.length; i++){
                                    var obj = res.list[i];
                                    var result = obj.dedicated_number.match(/\d+/g).join([]);
                                    _dedicated_list.push(result);
                                }

                                console.log(_dedicated_list);
                                if(_dedicated_list.includes(new_from)) {
                                //    alert("employee sending");
                                    _data.send_out = 1;
                                    _data.senderID = receiver_id ;
                                    _data.receiverID = sender_id;
                                    console.log(_data);

                                } else {
                                    _data.send_out = 0;
                                }

                                $.ajax({
                                    url: link._smsComposer,
                                    type: 'post',
                                    data: _data,
                                    dataType: 'json',
                                    success: function (res) {
                                        //alert("Sent succesfully");
                                        if (res.ERROR != '') {
                                            messageForm(res.ERROR, false, '#reply_sms .message_chat');
                                        } else {
                                            messageForm('Sent message succesfully', true, '#reply_sms .message_chat');
                                        }
                                    },
                                    error: function (e) {

                                    }
                                })
                            },
                            error: function (e) {
                                alert("no");
                            }
                        })

                    }
                },
                error: function (e) {

                }
            })





        });
    },

    setLink: function (linkSet) {
        window.linkForTable = linkSet;
    },

    loadListSMS: function (linkURL, table) {
        SMSInbox.prototype.setLink(linkURL);
        if (!linkURL || !table) return;
        var contact = $("#contact_inbox_get").val();
        var _data = {
            token: localStorage.getItemValue('token'),
            contactID: contact

        };

        $.ajax({
            url: linkURL,
            type: 'post',
            dataType: 'json',
            data: _data,
            success: function (res) {
                SMSInbox.prototype.displayListSMS(res.list, table);
            },
            error: function (e) {

            }
        })
    },

    displayListSMS: function (list, table) {
        let that = this;
        window.SMSTable = table;
        window.myDataTable = $(table).DataTable({
            destroy: true,
            data: list,
            filter: false,
            search: false,
            paging: true,
            bInfo: false,
            /*fnDrawCallback: function (oSettings) {
                $(oSettings.nTHead).hide();
            },*/
            order: [[0, 'desc']],
            columns: [
                { data: function (data) { return data.ID }, className: 'hidden' },
            //    { data: function (data) { return '<label class="checkbox"><input type="checkbox" class="mail-checkbox" value="' + data.id + '"><i></i></label>' }, className: 'inbox-small-cells' },
                { data: function (data) {
                    if (data.msg_from) {

                        return  data.msg_from;
                    }
                    else { return '' }
                }, className: 'view-message dont-show text-left' },
                { data: function (data) {
                    return '<span>' + '<a href="#ajax/contact-form.php?id='+ data.senderID + '">'+ data.senderName + '</a>'+ '</span>';
                }, className: 'view-message' },

                { data: function (data) { return data.body }, className: 'view-messag' },
                { data: function (data) {
                    if(data.timestamp !=null) {
                        var d = new Date(data.timestamp * 1000);    // Convert the passed timestamp to milliseconds
                        var yyyy = d.getFullYear();
                        var mm = ('0' + (d.getMonth() + 1)).slice(-2);  // Months are zero based. Add leading 0.
                        var dd = ('0' + d.getDate()).slice(-2);         // Add leading 0.
                        var hh = d.getHours();
                        var h = hh;
                        var min = ('0' + d.getMinutes()).slice(-2); // Add leading 0.
                        var ampm = 'AM';
                        var time;

                        if (hh > 12) {
                            h = hh - 12;
                            ampm = 'PM';
                        } else if (hh === 12) {
                            h = 12;
                            ampm = 'PM';
                        } else if (hh == 0) {
                            h = 12;
                        }

                        // ie: 2013-02-18, 8:35 AM
                        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
                        return time
                    }
                    return ''
                }, className: '' },
                { data: function (data) { return data.senderID }, className: 'hidden' },
                { data: function (data) { return data.receiverID }, className: 'hidden' },
                { data: function (data) { return data.msg_from }, className: 'hidden' },
                { data: function (data) { return data.msg_to }, className: 'hidden' },
                { data: function(data){return data.is_read }, title: 'ID', class: 'hidden' },
                { data: function(data){return data.message_id }, title: 'msgid', class: 'hidden' },
                { data: function(data){return data.receiverName }, title: 'receiverName', class: 'hidden' },
                { data: function (data) { return ' <i class="fa fa-mail-forward btnforwardSMS"  id="sms_forward" style="font-size:25px; background-color: initial; cursor: pointer; border-radius: 50%; padding: 4px;"><span class="tooltiptext">Forward</span></i>'}, className: '' },
                { data: function (data) { return ' <i class="fa fa-envelope-open" id="sms_mark_read" style="font-size: 25px; background-color: initial; cursor: pointer; border-radius: 50%; padding: 4px;"><span class="tooltiptext">Mark As Read</span></i>'}, className: '' },
                { data: function (data) {

                    if(data.is_forwarded !=1) {
                        return ' <i class="fa fa-reply btnReplySMS" id="sms_reply" style="font-size: 25px; background-color: initial; cursor: pointer; border-radius: 50%; padding: 4px;"><span class="tooltiptext">Reply</span></i>'
                    } else {
                        return '<span class="hidden"></span>'
                    }

                }, className: ''}
            ],

            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td > i.fa-envelope-open', nRow).on('click', function() {
                //    alert("this is the envelop");
                    var _data = {};
                    _data.message_id = aData.message_id;
                    //alert($("#count_unread_sms_noti").val());
                    var count_sms = $("#count_unread_sms_noti span.badge").text();
                    //$("#count_unread_sms_noti span.badge").text(100);


                    $.ajax({
                        url: link._sms_update_as_read,
                        type: 'post',
                        data: _data,
                        dataType: 'json',
                        success: function (res) {
                            //if($(nRow).hasClass("unread"))
                            if($(nRow).hasClass("unread")) {
                                $(nRow).removeClass('unread');
                                if(count_sms>=1) {
                                    $("#count_unread_sms_noti span.badge").text(count_sms-1);
                                }
                            }
                        },
                        error: function (e) {

                        }
                    });

                    // if you have the property "data" in your columns, access via aData.property_name
                    // if not, access data array from parameter aData, aData[0] = data for field 0, and so on...
                });

                $('td > i.fa-reply', nRow).on('click', function() {
                    var _data = {};
                    _data.message_id = aData.message_id;
                    //alert($("#count_unread_sms_noti").val());
                    var count_sms = $("#count_unread_sms_noti span.badge").text();
                    //$("#count_unread_sms_noti span.badge").text(100);


                    $.ajax({
                        url: link._sms_update_as_read,
                        type: 'post',
                        data: _data,
                        dataType: 'json',
                        success: function (res) {
                            //if($(nRow).hasClass("unread"))
                            if($(nRow).hasClass("unread")) {
                                $(nRow).removeClass('unread');
                                if(count_sms>=1) {
                                    $("#count_unread_sms_noti span.badge").text(count_sms-1);
                                }
                            }
                        },
                        error: function (e) {

                        }
                    });
                    // if you have the property "data" in your columns, access via aData.property_name
                    // if not, access data array from parameter aData, aData[0] = data for field 0, and so on...
                });
            },

            createdRow: function (row, data, dataIndex) {
                //$(row).attr('title', 'Click to go to inbox with id is ' + data.ID);
                if ((data.is_read != 1)) {
                    $(row).addClass('unread');
                }
            },
            initComplete: function () {

            }
        });
    },
}










