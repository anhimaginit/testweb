function TicketEdit() {
    window.imageScreenShots = [];
    window.imageScreenShotName = [];
}
TicketEdit.prototype = {
    constructor: TicketEdit,
    init: function () {
        ticketNote = new NoteTable({
            form: 'Help Desk',
            table: '#ticket_form #table_note_info'
        });
        
        ticketNote.init();
        this.setView();
        this.bindEvent();
        // $.removeCookie('ticket_edit');
        return this;
    },
    setView: function () {
        if(!ticketEdit) return;
        if (ticketEdit.screenshot) {
            ticketEdit.screenshot.forEach(element => {
                this.appendImage(element)
            });
        } else {
            $('#viewImagePane').html('<div class="padding-10 no-screenshot">No screenshot</div>');
        }
        if (ticketEdit.notes && ticketEdit.notes != null) {
            let _list = JSON.parse(JSON.stringify(ticketEdit.notes));
            ticketNote.displayList(_list);
        }

        if (ticketEdit.assign_to && ticketEdit.assign_to != '0') {
            $('[name=assign_to]').append('<option value="' + ticketEdit.assign_to + '" selected>' + ticketEdit.assign_to_name + '</option>')
        }
    },
    appendImage: function (data) {
        if(data.image.startsWith('/photo')){
            data.image = host + data.image;
        }
        window.imageScreenShots.push(data.image);
        window.imageScreenShotName.push(data.image_name);

        $('#viewImagePane').append(
            `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pane_image">
            <i class="pull-right fa fa-times pointer removeImageViewPage" style="position:absolute; right:15px; top:5px; z-index:1; color:#ccc"></i>
            <img src="${data.image}" class="img img-responsive" style="width:100%">
        </div>`);
    },
    makeCarousel: function (indexActive, callback) {
        let indicator = [];
        let inner = [];
        window.imageScreenShots.forEach(function (item, index) {
            
            indicator.push(`<li data-target="#carouselExampleIndicators" data-slide-to="${index}"></li>`);
            inner.push(`
            <div class="carousel-item${index== indexActive ? ' active' : ''}">
                <img src="${item}" class="img img-responsive w-100" alt="..." style="width:100%">
            </div>`);
        });

        $('#previewImage .modal-content .carousel-indicators').html(indicator.join(''));
        $('#previewImage .modal-content .carousel-inner').html(inner.join(''));
        if (callback) callback();

    },
    bindEvent: function () {
        let _self = this;
        $('#ticket_form').validate({
            rules: {
                assign_to: { required: false },
                status: { required: false },
            },
            submitHandler: function (form) {
                _self.submitForm();
            }
        });
        $('[name=assign_to]').select2({
            placeholder: 'Select Assigned to',
            containerCssClass: 'input-underline',
            minimumInputLength: 2,
            language: {
                inputTooShort: function () {
                    return 'Enter name';
                },
            },
            allowClear: true,
            ajax: {
                url: link._contacListSearch,
                type: 'post',
                dataType: 'json',
                delay: 300,
                data: function (params) {
                    var _data = {
                        token: localStorage.getItemValue('token'),
                        jwt: localStorage.getItemValue('jwt'),
                        private_key: localStorage.getItemValue('userID'),
                        login_id: localStorage.getItemValue('userID'),
                        contact_name: params.term
                    }
                    return _data;
                },
                processResults: function (data, params) {
                    return { results: data }
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; }, // var our custom formatter work
            templateResult: function (repo) {
                if (typeof repo == 'string') return repo;
                if (repo.loading) {
                    return repo.text;
                }

                var markup =
                    "<div class='select2-result-repository clearfix'>" +
                    "<div class='select2-result-repository__meta'>" +
                    "<div class='select2-result-repository__title'>" + repo.text + "</div>" +
                    "<div class='pull-right'></div>" +
                    "</div>" +
                    "</div>";
                return markup;
            },
            templateSelection: function (repo) {
                if (typeof repo == 'string') return repo;

                return repo.text;
            }
        });

        $('[name=screenshot]').change(function () {
            if (this.files && this.files[0]) {
                var _input_file = this.files;

                for (var i = 0; i < _input_file.length; i++) {
                    if (window.imageScreenShotName.length >= 5) {
                        messageForm('You can select maximum 5 images', 'warning');
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        let _image_data = e.target.result;
                        $('#viewImagePane').append(
                            `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pane_image">
                            <i class="pull-right fa fa-times pointer removeImageViewPage" style="position:absolute; right:15px; top:5px; z-index:1; color:#ccc"></i>
                            <img src="${_image_data}" class="img img-responsive" style="width:100%">
                        </div>`);
                        $('#viewImagePane>.no-screenshot').remove();
                        window.imageScreenShots.push(_image_data);
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
        });

        /**
         * Preview screenshot when click it
         */
        $(document).unbind('click', '#viewImagePane .pane_image img').on('click', '#viewImagePane .pane_image img', function () {
            let img_index = $(this).closest('.pane_image').index();
            _self.makeCarousel(img_index, function () {
                $('#previewImage').modal('show');
            });
        })
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
        });
        return result;
    },
    submitForm: function () {
        var _data = {
            id: ticketEdit.id,
            form: ticketEdit.form,
            subject: ticketEdit.subject,
            problem: ticketEdit.problem,
            last_update: localStorage.getItemValue('userID'),
            created_by: ticketEdit.created_by,
            assign_to: $('[name=assign_to]').val(),
            status: $('[name=status]').val(),
            screenshot: this.getScreenShot(),
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            notes: ticketNote.getNotes(),
        }

        var $btn = $('#sendTicket');
	    $btn.button('loading');

        $.ajax({
            url: link._heldDeskEdit,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res.SAVE == 'SUCCESS') {
                    messageForm('The ticket is updated successfully', true);
                } else {
                    messageForm('An error occured. Please try again later', false);
                }
                $btn.button('reset'); 
            },
            error: function (e) {
                messageForm('An error occured. Please try again later', false);
                $btn.button('reset'); 

            }
        })
    }
}

new TicketEdit().init();