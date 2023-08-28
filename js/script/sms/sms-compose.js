$('#btnSendSMS').click(function () {
   // alert("we are here");
    var _data = {};

    var contactID = $('#sms-contact-ID').val();
    _data.contactID = contactID;

    //alert(contactID);

    $.ajax({
        url: link._sms_getAPIkey,
        type: 'post',
        dataType: 'json',
        data: _data,
        success: function (res) {
            //SMSInbox.prototype.displayListSMS(res.list, table);
            //alert("ok");
            console.log(res.list);
            if(!res.list.sms_api_username && !res.list.sms_api_key) {
                messageForm('You do not have privilege to send SMS', false, '#message_form');
            } else {
                 var check = []
                 $('.smsTo').val().forEach(function (item) {
                 check.push({ receiverPhone: item });
                 })

                _data.sms_api_username = res.list.sms_api_username;
                _data.sms_api_key = res.list.sms_api_key;

                 _data.send_out = 1;
                 _data.senderID =$('#sms-contact-ID').val() ;
                 _data.setBody = $('#mailComment').val() ;
                 _data.setSource = "salescontroller.com";
                 _data.setFrom = $( ".smsFrom option:selected" ).val();
                 var count=0;

                 for (var i=0; i<=check.length; i++) {
                 var ID_receiver = check[i].receiverPhone;
                 _data.receiverID = ID_receiver;

                 $.ajax({
                 url: link._sms_getPhone_byID,
                 type: 'post',
                 data: _data,
                 dataType: 'json',
                 beforeSend: function() {
                 $('#loading').show();
                 // alert("it is still loading.Please be freaking patient");
                 },
                 complete: function() {
                 $('#loading').hide();
                 //  alert("It is loaded successfully. You can do everything you want now!");
                 },
                 success: function (res) {
                 var result = res.list.primary_phone.match(/\d+/g).join([]);
                 _data.setTo = result;

                 $.ajax({
                 url: link._smsComposer,
                 type: 'post',
                 data: _data,
                 dataType: 'json',
                 success: function (res) {
                 count++;
                 // alert(count);
                 console.log(count);
                 // alert("Sent succesfully");
                 responseSuccessForward('Sent to'+ ' '+ count + ' ' + 'phone number successfully!', true, null, './#ajax/sms-sent.php', 'Go to Sent');
                 },
                 error: function (e) {

                 }
                 })

                 },
                 error: function (e) {

                 }
                 })
                 }

                 if(count>=1) {
                 //alert("we are here");
                 responseSuccessForward('Sent to'+ count + 'phone number successfully!', true, null, './#ajax/sms-sent.php', 'Go to Sent');
                 }
            //    messageForm('You do not have privilege to send SMS', false, '#message_form');

            }
        },
        error: function (e) {

        }
    })




});

$.fn.modal.Constructor.prototype.enforceFocus = $.noop;

// Initialize Select2
$('.smsTo').select2({
    tags: false,
    placeholder: "Select User",
    minimumInputLength: 1,
    language: {
        inputTooShort: function () {
            return 'Enter name';
        },
    },
    allowClear: true,
    multiple: true,
    ajax: {
        url: link._contactFilterList,
        type: 'post',
        dataType: 'json',
        delay: 300,
        data: function (params) {
            var _data = {
                token: localStorage.getItemValue('token'),
                jwt: localStorage.getItemValue('jwt'),
                private_key: localStorage.getItemValue('userID'),
                role: [{
                    department: localStorage.getItemValue('actor'),
                    level: localStorage.getItemValue('level')
                }],
                login_id: localStorage.getItemValue('userID'),
                search_all: params.term,
            }
            return _data;
        },
        processResults: function (data, params) {
            if (data && data.list) {
                data = data.list;
            }
            data.forEach(function (item, index) {
                data[index].id = item.ID;
            });
            return { results: data }
        },
        cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // var our custom formatter work
    templateResult: function (data) {
        if(!data.contact_name) {
            var result = data.text;
        } else {
            var result =
                '<div class="select2-result-repository clearfix padding-5">' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + data.contact_name +
                    '<div class="pull-right">' + data.primary_email + '</div>' +
                    '</div>' +
                    '<div class="">' +
                    '<div class="pull-right">' + data.primary_phone + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

        }
        return result;
    },
    templateSelection: function (data) {
        if (!data.contact_name) {
            if (data.text) return data.text;
            else return data.id;
        }
        return data.contact_name;
        //console.log(data);
    }


});


$('select.sms_template').on('change', function () {   
    var content = $("select.sms_template option:selected").val(); 
    $("#mailComment").val(content);
});



