$('#btnSendMail').click(function () {
    saveDraftMail(1, function (res) {
        if (res.ERROR == '') {
            responseSuccessForward('The mail is sent', true, null, './#ajax/mail-sent.php?id=' + res.id, 'Go to view');
        } else {
            messageForm('Error! An error occurred. ' + res.ERROR, false);
        }
    });
});

$('#mailComment').summernote({
    height: 300,
    focus: false,
    tabsize: 2,
    placeholder: 'Enter content',
    toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        // ['view', ['fullscreen', 'codeview', 'help']]
    ]
})

// Initialize Select2
$('.mailTo').select2({
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
        return result;
    },
    templateSelection: function (data) {
        if (!data.contact_name) {
            if (data.text) return data.text;
            else return data.id;
        }
        return data.contact_name;
    }
});

function saveDraftMail(draft, callback) {
    if (draft == undefined || draft == null) draft = 0;
    var _mydata = {
        token: localStorage.getItemValue('token'),
        jwt: localStorage.getItemValue('jwt'),
        private_key: localStorage.getItemValue('userID')
    };
    _mydata.draft = draft;
    _mydata.receiverID = JSON.stringify($('.mailTo').val());
    _mydata.senderID = localStorage.getItemValue('userID');
    _mydata.subject = $('#mailSubject').val();
    _mydata.description = $('#mailComment').summernote('code');
    if ($('#id').val() && $('#id').val() != '') {
        _mydata.id = $('#id').val();
    }
    var check = []
    if ($('.mailTo').val() instanceof Array) {
        $('.mailTo').val().forEach(function (item) {
            check.push({ receiverID: item + '', checked: 0 });
        })
    }

    _mydata.checked = JSON.stringify(check);

    if ((_mydata.receiverID && _mydata.receiverID.length > 0 && _mydata.receiverID != '[]') || _mydata.subject != '' || _mydata.description != '') {
        $.ajax({
            url: link._emailComposer,
            type: 'post',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                if (callback) callback(res);
            },
            error: function (e) {

            }
        })
    }
}

$('a[href*="#ajax"], button:not(#btnSendMail)').bind('click', function (e) {
    if (($(this).attr('href') && $(this).attr('href') != '' && $(this).attr('href') != '#') || $(this).prop('type').indexOf('button') >= 0 || $(this).prop('type').indexOf('submit') >= 0) {
        saveDraftMail(0);
        $('a[href*="#ajax"], button:not(#btnSendMail)').unbind('click');
    }
});

