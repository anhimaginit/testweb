function BillingTemplate() { }

BillingTemplate.prototype = {
    constructor: BillingTemplate,
    init: function () {
        this.setView();
        // this.loadTemplateUI();
        this.bindEvent();
        if (getUrlParameter('id')) {
            this.loadBillingDetail(getUrlParameter('id'));
        }
        this.loadBillingTemplateDataTable();
    },
    setView: function () {
        // $('.datepicker').datepicker({
        //    dateFormat: 'yy-mm-dd',
        //    showButtonPanel: true,
        //    changeMonth: true,
        //    changeYear: true,
        //    minDate: new Date(),
        //    maxDate: '+2Y',
        // });
        // webshims.setOptions('forms-ext', {
        //    replaceUI: 'auto',
        //    types: 'number',
        //    iVal: { fieldWrapper: '.input-currency' },

        // });
        // webshims.polyfill('forms forms-ext');
    },
    bindEvent: function () {
        $("#billing_form").validate(this.validateOption);

        $('#agsBillingDate').change(function () {
            var value = parseInt(this.value);
            if ((value - 1) % 10 == 0) $('.agsBillingDateExtend').text('st');
            else if ((value - 2) % 10 == 0) $('.agsBillingDateExtend').text('nd');
            else if ((value - 3) % 10 == 0) $('.agsBillingDateExtend').text('rd');
            else $('.agsBillingDateExtend').text('th');
        });

        $('[name=billingCircleEvery]').change(this.billingEveryDay);

    },

    billingEveryDay: function () {
        if ($('[name=billingCircleEvery]').val() == 'day') {
            $('#pane_betweenToPay').show();
        } else {
            $('#pane_betweenToPay').hide();
        }
    },

    billingDateSelectOption: function (date, currentDay, startAtDay1st) {
        if (!date) date = new Date();
        if (!currentDay) currentDay = date.getDate();
        var start = currentDay;
        if (startAtDay1st) start = 1;
        var select = $('[name=billingDate]');
        select.empty();
        var options = $('[name=billingDate]').prop('options');
        if (!options) return;
        for (var i = start; i <= getDayOfMonth(date); i++) {
            options[options.length] = new Option(i, i);
        }
        select.val(currentDay).change();
    },

    loadBillingTemplate: function () {
        $.ajax({
            url: link._subName,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json',
            success: function (res) {
                if (res.ERROR == '') {
                    var select = $('select[name=subcription]');
                    var options = select.prop('options');
                    $('option', select).remove();
                    res.sub.forEach(function (temp) {
                        options[options.length] = new Option(temp.name, temp.id);;
                    });
                    select.val(res.sub[0].id).change();
                }
            },
            error: function (e) { }
        });
    },

    loadContentDetail: function (detail) {
        for (var key in detail) {
            if (key == 'billingDate') {
                var field = $('#billing_form [name=billingDate]').closest('section');
                field.addClass('col');
                var _subRadio = '';
                detail[key].split(',').forEach(function (item, index) {
                    _subRadio += '<label class="radio"><input type="radio" name="billingDate" value="' + item + '" ' + (index == 0 ? ' checked' : '') + '><i></i> ' + item + '</label>';;
                });
                field.html('<label class="input">Billing Date</label><div class="inline-group">' + _subRadio + '</div>')
            } else if (key != 'paymentAmount' && key != 'billingCircleEvery' && !key.includes('Date')) {
                $('#billing_form [name=' + key + ']').val(detail[key]);
            }
        }
        $('#billing_form [name=billingPeriod] option').prop('disabled', false);
        var setScore = { Month: 1, Quarter: 2, Year: 3 };
        if (!detail.billingPeriod) {
            $('#billing_form [name=billingPeriod]').val(parseInt(detail.subcription) < 3 ? detail.subcription : 3);
        } else {
            $('#billing_form [name=billingPeriod] option').each(function(index, elem) {

                if (elem.value == detail.billingPeriod) {
                    $(elem).prop('selected', true);
                } else {
                    if (setScore[elem.value] > setScore[detail.billingPeriod])
                        $(elem).prop('disabled', true);
                }
            });
        }
    },
    loadBillingDetail: function (id) {
        var _seft = this;
        if (!id) id = $('[name=ID]').val();
        var _data = $.extend({}, template_data);
        _data.id = id;
        $.ajax({
            url: link._subTemplate,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res.ERROR == '' && res.sub && res.sub.json) {
                    var detail = res.sub.json;
                    detail.id = res.sub.id;
                    detail.name = res.sub.name;
                    detail.status = res.sub.status == 1 || res.sub.status == '1' ? "true" : "false";
                    _seft.setSubcription(detail);
                } else {
                    messageForm('The Billing template ' + id + ' is not exist', false);
                }
            },
        })
    },
    setSubcription: function (detail) {
        for (var key in detail) {
            if ($('#billing_form [name=' + key + ']').prop('type') == 'checkbox' || $('#billing_form [name=' + key + ']').prop('type') == 'radio') {
                $('#billing_form [name=' + key + ']').prop('checked', detail[key]);
            } else {
                $('#billing_form [name=' + key + ']').val(detail[key]);
            }
        }
        $('#billing_form [name=billingDate]').val(numeral(detail.billingDate).value());
        this.billingEveryDay(detail.billingCircleEvery);

    },
    validateOption: {
        rules: {
            name: { required: true, maxlength: 50 },
            billingCircleEvery: { required: true },
            paymentPeriod: { required: true, digits: true },
            processingFee: { required: true},
            paymentAmount: { required: true},
            initiedFee: { required: true},
            betweenToPay: { required: function () { return $('[name=billingCircleEvery]').val() == 'day' }, digits: true }
        },
        submitHandler: function () {
            var _myData = $.extend({}, template_data);
            _myData.name = $('#billing_form [name=name]').val();
            _myData.id = $('#billing_form [name=id]').val();
            _myData.status = $('#billing_form [name=status]').val()=='true' ? 1: 0;
            var _link = link._subAddNew;
            if (!_myData.id || _myData.id == '' || _myData.id == '0') {
                delete _myData.id;
            } else {
                _link = link._subUpdate
            }
            _myData.json = BillingTemplate.prototype.getSubcription();
            $.ajax({
                url: _link,
                type: 'post',
                data: _myData,
                // dataType : 'json',
                success: function (res) {
                    res = JSON.parse(res);
                    if (res.ERROR == '') {
                        messageForm('You have successfully save the template', true);
                        BillingTemplate.prototype.loadBillingTemplateDataTable();
                    } else {
                        messageForm('Error! An error occurred. ' + res.ERROR, false);
                    }
                },
            })
        }
    },

    getSubcription: function () {
        var myData = {
            paymentPeriod: $('[name=paymentPeriod]').val(),
            processingFee: numeral($('[name=processingFee]').val()).value(),
            initiedFee: numeral($('[name=initiedFee]').val()).value(),
            billingCircleEvery: $('[name=billingCircleEvery]').val(),
            billingDate: $('[name=billingDate]').val(),
            betweenToPay: $('[name=betweenToPay]').val(),
            endDate: '',
            numberOfPay: '',
            optionPayingLater: $('[name=optionPayingLater]').prop('checked'),
            offSecondPayFee: false
        };
        return JSON.stringify(myData);
    },
    loadBillingTemplateDataTable: function () { //table_billing_template
        $.ajax({
            url: link._subcriptions,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json',
            success: function (res) {
                if (res.ERROR == '') {
                    $('#table_billing_template').DataTable({
                        sDom: "t" +
                            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                        data: res.list,
                        destroy: true,
                        columns: [
                            { data: 'id', title: "ID" },
                            { data: function (data) { return data.name ? data.name : '' }, title: 'Name' },
                            {
                                data: function (data) {

                                    if (data.json.billingDate && data.json.billingCircleEvery != 'day') {
                                        var value = numeral(data.json.billingDate).value();
                                        var extend = 'th';
                                        if ((value - 1) % 10 == 0) extend = 'st';
                                        else if ((value - 2) % 10 == 0) extend = 'nd';
                                        else if ((value - 3) % 10 == 0) extend = 'rd';
                                        return value + extend + ' of month';
                                    } else if (data.json.billingCircleEvery == 'day') {
                                        return 'Each ' + data.json.betweenToPay + ' days';
                                    } else {
                                        return '';
                                    }
                                }, title: 'Billing Date'
                            },
                            { data: function (data) { return data.json.billingCircleEvery ? data.json.billingCircleEvery : '' }, title: 'Billing Circle' },
                            { data: function (data) { return data.json.initiedFee ? data.json.initiedFee : '' }, title: 'Initial Fee', className: "text-right" },
                            { data: function (data) { return data.json.processingFee ? data.json.processingFee : '' }, title: 'Processing Fee', className: "text-right" },
                            { data: function (data) { return data.status == true || data.status == 'true' || data.status == 1 || data.status == '1' ? 'Active' : 'Inactive' }, title: 'Status' },
                        ],
                        createdRow: function (row, data, rowIndex) {
                            $(row).attr('title', 'Go to template ' + data.name);
                            $(row).click(function () {
                                window.open('./#ajax/billing-template.php?id=' + data.id, '_self');
                            });
                        }
                    })
                }
            },
            error: function (e) { }
        });
    }
}