function payacct() { }
window.is_overage = 0;
payacct.prototype = {
    constructor: payacct,
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        $('#template_data .acct_payment_type').unbind('click').bind('click', function (e) {
            if ($(this).val() == 'Cash') {
                $('#form_pay-acct #card-info').hide();
            } else if ($(this).val() == 'Check') {
                $('#form_pay-acct #card-info').hide();
            } else if ($(this).val() == 'OnAcct') {
                $('#form_pay-acct #card-info').hide();
            } else if ($(this).val() == 'CC') {
                $('#form_pay-acct #card-info').hide();
            }
        });

        $('#acct-pay-btn-sub').unbind('click').bind('click', function () {
            $('#form-pay-acct').submit()
        });

        $('#form-pay-acct #pay_date_acct').datetimepicker({
            formatDate: 'Y-m-d H:i:s',
            lang: 'en',
        });

        $(" #pay_amount_acct").keypress(function (e) {
            var str1 = $(this).val();
            var ch = (str1.split(".").length - 1);
            var length = str1.length;
            if (length < 1 && e.which == 46) {
                return false;
            }
            if (ch > 0 && e.which == 46) {
                return false;
            }
            if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
                if (e.keyCode === 13) {

                }
                return false;
            }

        });

        $('#pay_amount_acct').unbind('change').change(function () {
            _pay.checkPayAmount();
        });


    },

    ValidatorForm_acct: {
        ignore: [],
        rules: {
            pay_amount: { required: true }

        },
        submitHandler: function (e) {
            var _formData = $.extend({}, template_data);
            var _data = $("#form-pay-acct").serializeArray()
            _data.forEach(function (elem) {
                if (elem.name != '' && elem.value != '') {
                    _formData[elem.name] = elem.value;
                }
            });

            _formData.submit_by = localStorage.getItemValue('userID');
            _formData.approved = '';
            _formData.order_id = $('#form_invoice [name="order_id"]').val();
            _formData.customer = $('#form_invoice [name="customer"]').val();

            if (window.what_form == 'invoice') {
                if (window.invID == undefined && window.invID == null) {
                    _formData.invID = 0;
                } else {
                    _formData.invID = window.invID;
                }
            }
            let amount = numeral($('#pay_amount_acct').val()).value();
            let balance = numeral($('[name=balance]').val()).value();
            if (amount > balance) {
                // if (!window.payment_overage_check) {
                //     $('.payment_feedback').css({ border: '2px solid red' });
                //     return;
                // } else {
                _formData.overage = amount - balance;

                // }
            } else {
                _formData.overage = 0;
            }
            _formData.is_overage = _formData.overage > 0 ? 1 : 0;
            _formData.contract_overage = _formData.overage + window.contract_overage;
            _formData.grand_total = window.grand_total;
            _formData.pay_amount = amount;
            _formData.approved = localStorage.getItemValue('userID');
            _formData.payment_date = getDateTime(new Date($('#form-pay-acct #pay_date_acct').val()))

            //ajax
            _link = link._payAcctAddNewUpdateINV;

            $.ajax({
                data: _formData,
                type: 'post',
                dataType: 'json',
                url: _link
            }).done(function (res) {
                if (res["SAVE"] == 'SUCCESS') {
                    window.contract_overage += _formData.contract_overage;
                    if (Number.isInteger(res['pay_id'])) {

                        var tranID = res['pay_id'];

                        messageForm("Payment is successful, your transaction is " + tranID, true, $('#tb_acct_pay_show').parent().find('.message_table:first'));

                        $('.modal').modal('hide');
                        $('#form-pay-acct').trigger('reset');
                        $('.payment_feedback').remove();
                        payacct.prototype.createPaymentRow('#form_invoice #tb_acct_pay_show tbody', {
                            invoice_id: _formData.invID,
                            pay_id: res.pay_id,
                            pay_amount: _formData.pay_amount || '0',
                            pay_type: _formData.pay_type || '',
                            pay_date: _formData.payment_date || getDateTime(),
                            pay_note: _formData.pay_note || ''
                        }, _payaccList.length + 1, true)
                        if (window.what_form == 'invoice') {
                            Invoice.prototype.fromPayment(res, _formData)
                        }
                    }
                } else {
                    messageForm("Payment failed", false, '#form-pay-acct #message_form');
                }

            }).fail(function (jqXHR, textStatus, errorThrown) {
                messageForm("Payment failed", false, '#form-pay-acct #message_form');
                console.log(jqXHR)
            });

            //console.log(_formData);

        }

    },

    createPaymentRow: function (elem, data, index, isNew) {
        var amountoFix = numeral(data.pay_amount).format('$ 0,0.00');
        tr = '<tr data-invoice="' + data.invoice_id + '">' +
            '<td>' + index + '</td>' +
            '<td>' + data.pay_id + '</td>' +
            '<td class="text-right pay_amount">' + amountoFix + '</td>' +
            '<td>' + data.pay_type + '</td>' +
            '<td>' + (isNew ? data.pay_date : getDateTime(new Date(data.pay_date + ' UTC+0'))) + '</td>' +
            '<td>' + (data.pay_note || '') + '</td>' +
            '</tr>';

        $(elem).append(tr);
    },

    createPayAcctRows: function (element, obj) {
        let that = this
        var num_row = 1;
        obj.forEach(function (item) {
            that.createPaymentRow(element, item, num_row);
            num_row++;
        });
    },

    checkPayAmount: function () {
        let amount = numeral($('#pay_amount_acct').val()).value();
        let balance = numeral($('#form_invoice [name=balance]').val()).value();
        this.createDisplayPayOverage(amount - balance);
    },
    createDisplayPayOverage: function (amount = 0) {
        $('.payment_feedback').remove();
        delete window.payment_overage_check;
        if (amount > 0) {
            window.overage_amount = amount;
            let _html = `
           <section class="col col-6 payment_feedback">
                <label class="input">&nbsp;</label>
                <button type="button" class="btn btn-sm btn-default btn-radio" data-value="add"> Add Overage to Acct</button>
                <button type="button" class="btn btn-sm btn-default btn-radio" data-value="just">Adjust Payment</button>
                <button type="button" class="btn btn-sm btn-default btn-radio" data-dismiss="modal" data-value="cancel">Cancel</button>
           </section>
           `;
            $('#pay_amount_acct').closest('.row').append(_html);
            this.eventOverage();
        } else {
            delete window.overage_amount;
        }
    },
    eventOverage: function () {
        $('.btn-radio').click(function () {
            $('.btn-radio').removeClass('btn-warning');
            $('.payment_feedback').css({ 'border': 'unset' });
            let _overage_type = $(this).data('value');
            delete window.payment_overage_check;
            let balance = parseFloat($('[name=balance]').val());
            switch (_overage_type) {
                case 'cancel':
                    $('#form-pay-acct').trigger('reset');
                    $('.modal').modal('hide');
                    $('.payment_feedback').remove();
                    break;
                case 'just':
                    window.payment_overage_check = _overage_type;
                    delete window.overage_amount;
                    if (balance < 0) balance = 0;
                    $('#pay_amount_acct').val(balance).focusout();
                case 'add':
                    $(this).addClass('btn-warning');
                    window.payment_overage_check = _overage_type;
                    break;
                default:
                    window.payment_overage_check = _overage_type;
                    break;
            }
        });
    }
    ///-----------------
}

var _pay = new payacct();
_pay.init();
$('#form-pay-acct').validate(_pay.ValidatorForm_acct);