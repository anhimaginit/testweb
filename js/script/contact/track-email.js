
function trackEmail() { }
trackEmail.NAME = "trackEmail";
trackEmail.VERSION = "1.2";
trackEmail.DESCRIPTION = "Class TrackEmail";

trackEmail.prototype.constructor = trackEmail;
trackEmail.prototype = {
    init: function () {
        show_content_email = this.show_content_email;
        accept_resend_mail = this.accept_resend_mail;
        close_resend_mail = this.accept_resend_mail;
        resend_mail = this.resend_mail;

        $('.ui-chatbox a i.fa.fa-times').parent().click(function () {
            $('.ui-chatbox').hide();
        });

        $('.ui-chatbox a i.fa-minus').parent().click(function () {
            $('.ui-chatbox .ui-chatbox-content').hide();
            $(this).hide();
            $('.ui-chatbox a i.fa-plus').parent().show();
        });

        $('.ui-chatbox a i.fa-plus').parent().click(function () {
            $('.ui-chatbox .ui-chatbox-content').show();
            $(this).hide();
            $('.ui-chatbox a i.fa-minus').parent().show();
        });
    },

    addTrackMail: function (el) {
        _html = '<tr>' +
            '<td style="color:green">Sent</td>' +
            '<td style="color:orange" onclick="show_content_email(this)">Unopened</td>' +
            '<td>' + new Date().toISOString().split('T')[0] + '</td>' +
            '<td>' + el.email + '</td>' +
            '<td>' + el.title + '</td>' +
            '<td class="hasinput"><button class="btn btn-sm btn-danger" type="button" onclick="resend_mail(this)">Resend</button></td>' +
            '</tr>';
        $('#table_track_email tbody').append(_html);
    },

    show_track_email: function (list) {
        if (list != undefined && list.length > 0) {
            var _html = '';
            list.forEach(function (el) {
                if (el.status == null) el.status = "";
                if (el.opened == null) el.opened = "";
                var status_color = "";
                var opened_color = "";
                if (el.status == "Sent") {
                    status_color = "green";
                } else if (el.status == "Bounce") {
                    status_color = "red";
                }

                if (el.opened == "Opened") {
                    opened_color = "green";
                } else if (el.opened == "Unopened") {
                    opened_color = "orange";
                }

                _html += '<tr>' +
                    '<td style="color:' + status_color + '">' + el.status + '</td>' +
                    '<td style="color:' + opened_color + '" onclick="show_content_email(this)">' + el.opened + '</td>' +
                    '<td>' + el.date_sent + '</td>' +
                    '<td>' + el.email + '</td>' +
                    '<td>' + el.title + '</td>' +
                    '<td class="hasinput"><button class="btn btn-sm btn-danger" type="button" onclick="resend_mail(this)">Resend</button></td>' +
                    '</tr>'

            });
            $('#table_track_email tbody').append(_html);
        } else {
            return;
        }
    },
    show_content_email: function (elem) {
        if (!contact_old) {
            return;
        } else {
            var list = contact_old.track_mail;
            var index = $(elem).closest('tr').index();
            if (index < list.length) {
                content = list[index];
                if (content) {
                    $('#lblTitle').text(content.title);
                    $('#lblSendDate').text(content.date_sent);
                    $('#lblSendTo').text(content.email);
                    $('#lblSendStatus').text(content.status);
                    $('#lblOpened').text(content.opened);
                    $('#lblContent').html(content.content);
                    $('#pane_content_email').modal('show');
                }
            }
        }
    },
    resend_mail: function (elem) {
        if (!contact_old) {
            return;
        } else {
            var list = contact_old.track_mail;
            var index = $(elem).closest('tr').index();
            if (index < list.length) {
                content = list[index];
                $('#resend_mail_popup #mail_send_to').val(content.email);
                $('#resend_mail_popup #mail_title').val(content.title);
                $('#resend_mail_popup #mail_content').summernote('code', content.content);
                $('#resend_mail_popup #accept_resend_mail').unbind('click').bind('click', function () {
                    accept_resend_mail(content);
                })
                $('#resend_mail_popup').show();

            }
        }
    },
    //'token','id','email','subject','content','jwt','private_key'
    accept_resend_mail: function (content) {
        if (!content) {
            return;
        } else {
            // var list = contact_old.track_mail;
            // var index = $(elem).closest('tr').index();
            // if(index<list.length){
            //     content = list[index];
            var _data = $.extend({}, template_data);
            _data.id = content.id
            _data.email = $('#resend_mail_popup #mail_send_to').val();
            _data.title = $('#resend_mail_popup #mail_title').val();
            _data.content = $('#resend_mail_popup #mail_content').summernote('code');

            $.ajax({
                url: link._emailResend,
                type: 'post',
                data: _data,
                dataType: 'json',
                success: function (res) {
                    if (res.ERROR == '') {
                        contact_old.track_mail.push(_data);
                        messageForm('The mail sent to ' + _data.email, true, $('#table_track_email').prev('.message_table'));
                        $('.ui-chatbox').css('display', 'none');
                        _notecontact.createTableNoteRow({
                            create_date: getDateTime(new Date()),
                            note: 'Resend email to ' + _data.email,
                            description: 'Resend email',
                            type: 'Contact',
                            contactID: $('input[name=ID]').val(),
                            enter_by: localStorage.getItemValue('userID'),
                            enter_by_name: localStorage.getItemValue('user_name'),
                            internal_flag: 1
                        });
                        trackEmail.prototype.addTrackMail(_data);
                    } else {
                        messageForm('The error occured. Please try again', 'warning', $('#table_track_email').prev('.message_table'));
                    }
                }
            });
            // }
        }
    },
    close_resend_mail: function () {
        $('#mail_send_to').val('');
        $('#mail_title').val('');
        $('#mail_send_to').val('');
        $('.ui-chatbox').css('display', 'none');
    }
}
track = new trackEmail();
$(function () {
    track.init();
});