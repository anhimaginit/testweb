function HelpFile() { }
var validSubCategory = true;
HelpFile.prototype = {
    init: function () {
        this.setView();
        this.bindEvent();
    },

    setView: function () {
        $('#help_form #contentFile').summernote({
            height: 380,
            focus: false,
            tabsize: 2,
            placeholder: 'Enter content',
        });

        $('#help_form [name=category]').select2({
            placeholder: 'Select Category',
            allowClear: true,
            tags: true,
            language: {
                noResults: function () { return ''; }
            },
            createTag: function (newTag) {
                return {
                    id: newTag.term,
                    text: newTag.term,
                    isNew: true
                };
            }
        });

        $('#help_form [name=category]').trigger('change');
    },

    bindEvent: function () {
        let that = this;
        $('#help_form [name=title]').keyup(function () {
            $('#file_slug').text(that.createSlug(this.value));
        });

        $('#help_form [name=sub_category]').keyup(function () {
            let arr_char = this.value.split('/');
            if (arr_char.length > 5) {
                validSubCategory = false;
                tooltipInputError('The Sub Category has maximum 4 level', this);
            } else {
                validSubCategory = true;
                $(this).tooltip('hide');
                $(this).tooltip('destroy');
            }
        });

        $('#help_form .btn-clear-select').click(function () {
            $select = $('[name="' + $(this).data('select') + '"]');
            $select.val(null).trigger('change');
        })

        $('#help_form').validate(that.validateOption);
    },
    validateOption: {
        rules: {
            contentFile: { required: true },
            title: { required: true },
            category: { requied: true }
        },
        submitHandler: function (form) {
            if (!validSubCategory) {
                $('#help_form [name=sub_category]').val($('#help_form [name=sub_category]').val()).focus();
                return;
            }
            let _data = {
                id: $('#help_form [name=id]').val(),
                title: $('#help_form [name=title]').val(),
                slug: $('#file_slug').text(),
                category: $('#help_form [name=category]').val(),
                sub_category: $('#help_form [name=sub_category]').val(),
                content: $('#contentFile').summernote('code'),
                last_update_date: getDateTime()
            }
            if (_data.id == '') {
                delete _data.id;
                _data.created_date = getDateTime();
            } else {
                _data.created_date = $('#help_form [name=created_date]').val();
            }
            if (!_data.category || _data.category == '') {
                messageForm('Please select category', false);
                return;
            }

            $.ajax({
                url: host2 + 'php/action-help-file.php',
                type: 'post',
                data: _data,
                dataType: 'json',
                success: function (res) {
                    if (res.error == '') {
                        if (res.id && !_data.id) {
                            responseSuccessForward('You have successfully save help file', true, null, './#ajax/help-file.php?id=' + res.id, 'Go to edit help file');
                            $('#help_form [name=id]').val(res.id);
                        } else {
                            messageForm('You have successfully save help file', true);
                        }
                    } else {
                        messageForm(res.error, false);
                    }
                },
                error: function (e) {
                }
            })
        }
    },
    createSlug: function (text = 'untitle') {
        return text.trim().toLowerCase().replace(/ |\/|,/g, '_');
    }

}

var _helper = new HelpFile();
_helper.init();