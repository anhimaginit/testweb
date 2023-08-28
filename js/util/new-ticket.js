function Ticket() {
    window.imageScreenShots = [];
    window.imageScreenShotName = [];
}

Ticket.prototype = {
    constructor: Ticket,
    init: function () {
        ticketNote = new NoteTable({
            form: 'Help Desk',
            table: '#ticket_form #table_note_info'
        });
        ticketNote.init();
        this.setView();
        this.bindEvent();
        return this;
    },
    setView: function () {
        $('#contentMail').summernote({
            height: 300,
            focus: false,
            tabsize: 2,
            placeholder: 'Enter your problem',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ]
        });

        if (window.img_feedbacks) {
            this.appendImage({
                data: window.img_feedbacks,
                name: 'Screenshot-' + Math.random().toString().split('.').pop() + '.png'
            })
        }
        if (window.issue_form) {
            if ($('[name=form] option[value="' + window.issue_form + '"]')[0]) {
                $('[name=form]').val(window.issue_form);
            } else {
                $('[name=form]').prepend(`<option value="${window.issue_form}" selected>${window.issue_form}</option>`);
            }
        }
        if (window.link_ticket) {
            $('#contentMail').summernote('code', '<a href="' + window.link_ticket + '">Issue link to ' + window.link_ticket + '</a>');
        }

    },
    appendImage: function (data) {
        window.imageScreenShots.push(data.data);
        window.imageScreenShotName.push(data.name);
        $('#viewImagePane').append(
            `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pane_image">
            <i class="pull-right fa fa-times pointer removeImageViewPage" style="position:absolute; right:15px; top:5px; z-index:1; color:#ccc"></i>
            <img src="${data.data}" class="img img-responsive" style="width:100%">
        </div>`);
    },
    bindEvent: function () {
        let _self = this;
        $('#send').click(function () {
            _self.submitForm();
        });

        $('[name=screenshot]').change(function () {
            if (this.files && this.files[0]) {
                var _input_file = this.files;

                for (var i = 0; i < _input_file.length; i++) {
                    if (window.imageScreenShotName.length >= 5) {
                        messageForm('You can select maximum 5 images', 'warning', '#ticket_form #message_form');
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        let _data = e.target.result;
                        $('#viewImagePane').append(
                            `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pane_image">
                            <i class="pull-right fa fa-times pointer removeImageViewPage" style="position:absolute; right:15px; top:5px; z-index:1; color:#ccc"></i>
                            <img src="${_data}" class="img img-responsive" style="width:100%">
                        </div>`);
                        window.imageScreenShots.push(_data);
                    }
                    reader.readAsDataURL(_input_file[i]);
                    window.imageScreenShotName.push(Math.random().toString().split('.').pop() + '-' + _input_file[i].name);

                }
            }
        });
        $(document).unbind('click', '.removeImageViewPage').on('click', '.removeImageViewPage', function () {
            let pane = $(this).closest('.pane_image');
            let pane_index = pane.index();
            window.imageScreenShots.splice(pane_index, 1);
            window.imageScreenShotName.splice(pane_index, 1);
            pane.remove();
            $('[name=screenshot]')[0].files[pane_index] = null;
        });
    },
    getScreenShot: function () {
        if (window.imageScreenShots.length <= 0) return [];
        let result = [];
        window.imageScreenShots.forEach((item, index) => {
            if (!item.startsWith('data:image')) {
                result.push({ change: 1, image_name: window.imageScreenShotName[index], image: item });
            } else {
                result.push({ change: 0, image_name: window.imageScreenShotName[index], image: item });
            }
        })
        return result;
    },
    submitForm: function () {
        let _self = this;
        var _data = {
            token: localStorage.getItemValue('token'),
            form: $('[name="form"]').val(),
            subject: $('[name="subject"]').val(),
            problem: $('#contentMail').summernote('code'),
            contactID: localStorage.getItemValue('userID'),
            status: $('[name="status"]').val(),
            screenshot: _self.getScreenShot(),
            notes: ticketNote.getNotes()
        }
        let _link = link._heldDeskAddNew;
        if ($('[name="id"]').val() && $('[name="id"]').val() != '') {
            _data.id = $('[name="id"]').val();
            _link = link._heldDeskEdit;

        }

        if(_data.subject==''){
            messageForm('Please enter ticket subject');
            $('[name="subject"]').focus()
            return;
        }
        var $btn = $('#send');
        $btn.button('loading');

        $.ajax({
            url: _link,
            type: 'post',
            dataType: 'json',
            data: _data,
            success: function (res) {
                if (res.ID) {
                    $('[name="id"]').val(res.ID);
                }
                if (res.SAVE == 'SUCCESS') {
                    messageForm('Thanks for your ticket. We will check it later', true, '#ticket_form #message_form');
                } else {
                    messageForm('Sorry, system has problem. Please try again later', false, '#ticket_form #message_form');
                }
                $btn.button('reset');
            }
        })
    }
}

new Ticket().init();
