function Billing() { }

var template_field = {
    billingCircleEvery: "month",
    billingDate: "1st of month",
    endDate: '',
    initiedFee: 0,
    name: "Month to Month Billing",
    offSecondPayFee: false,
    optionPayingLater: false,
    paymentAmount: 0,
    paymentPeriod: 1,
    processingFee: 0,
}
Billing.prototype = {
    constructor: Billing,
    init: function () {
        this.loadBilling();
        this.bindEvent();
    },

    bindEvent: function () {
        var $this = this;
        $('select[name=subscription]').change(function (e) {
            // if (window.location.href.includes('warranty-form-addnew')) {
            //     $this.loadBillingDetailFromAddnew(this.value);
            // } else {
                $this.loadBillingDetail(this.value);
            // }
        });
    },

    loadBilling: function () {
        $.ajax({
            url: link._subName,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json',
            success: function (res) {
                if (res.ERROR == '') {
                    var select = $('select[name=subscription]');
                    var options = select.prop('options');
                    if(!options) return;
                    $('option', select).remove();
                    options[0] = new Option('None', '', true, true);
                    res.sub.forEach(function(temp){
                        options[options.length] = new Option(temp.name, temp.id);
                    });
                }
            },
            error: function (e) { }
        });
    },

    getNumberOfPay: function (data, callback) {
        data.token = localStorage.getItemValue('token');
        $.ajax({
            url: link._subGetNunOfPayment,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (res) {
                $('#_period').text(res.numberOfPay);
                template_field.processingFeeOld = res.prcessingFreeOld;
                template_field.numberOfPay = res.numberOfPay;
                $('#period').val(res.numberOfPay).change();
                if (callback)
                    callback(res);
            },
        })
    },
    loadBillingDetailFromAddnew: function (id) {
        var _self = this;
        if (!id) id = $('select[name=subscription]').val();
        if (!id || id == '') {
            $('#an_init_fee').html('$ 0.00');
            $('#an_processing_fee').html('$ 0.00');
            $('#an_period').html('0');
            $('#an_total_processing_fee').html('$ 0.00');
        } else {
            var _data = $.extend({}, template_data);
            _data.id = id;
            $.ajax({
                url: link._subTemplate,
                type: 'post',
                data: _data,
                dataType: 'json',
                success: function (res) {
                    if (res.ERROR == '' && res.sub.json) {

                        var data = res.sub.json;
                        var initiedFee = 0;

                        var oldPaymentAmount = template_field.paymentAmount;
                        var detail = res.sub.json;
                        for (var key in detail) {
                            template_field[key] = detail[key];
                        }
                        template_field.paymentAmount = oldPaymentAmount;

                        var dataNB = {
                            order_id: $('[name=order_id]').val(),
                            balance: $('[name=balance]').val(),
                            payment: $('[name=payment]').val(),
                            subscription: JSON.stringify(template_field)
                        }
                        dataNB.token = localStorage.getItemValue('token');
                        $.ajax({
                            url: link._subGetNunOfPayment,
                            type: 'post',
                            data: dataNB,
                            dataType: 'json',
                            success: function (res) {

                                if (typeof data.initiedFee === "number") {
                                    initiedFee = data.initiedFee;
                                }
                                else {
                                    initiedFee = Number(data.initiedFee.replace(/[^0-9.-]+/g, ""));
                                }

                                initiedFee = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(initiedFee);
                                $('#an_init_fee').html(initiedFee);

                                var processingFee = 0;

                                if (typeof data.processingFee === "number") {
                                    processingFee = data.processingFee;
                                }
                                else {
                                    processingFee = Number(data.processingFee.replace(/[^0-9.-]+/g, ""));
                                }

                                processingFee = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(processingFee);
                                $('#an_processing_fee').html(processingFee);

                                // var paymentPeriod = Number(data.paymentPeriod.replace(/[^0-9.-]+/g, ""));
                                // paymentPeriod = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(paymentPeriod);
                                $('#an_period').html(data.paymentPeriod);

                                if (typeof data.processingFee === "number") {
                                    processingFee = data.processingFee;
                                }
                                else {
                                    processingFee = Number(data.processingFee.replace(/[^0-9.-]+/g, ""));
                                }

                                data.numberOfPay = res.numberOfPay;

                                if (typeof data.numberOfPay === "number") {
                                    numberOfPay = data.numberOfPay;
                                }
                                else {
                                    numberOfPay = Number(data.numberOfPay.replace(/[^0-9.-]+/g, ""));
                                }

                                an_total_processing_fee = processingFee * numberOfPay;
                                an_total_processing_fee = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(an_total_processing_fee);

                                $('#an_total_processing_fee').html(an_total_processing_fee);

                                loadTotalDiscount();

                            }
                        });
                    } else { }
                }
            })
        }
    },
    /**
     * 
     * @param {Integer} id : Subscription template id
     */
    loadBillingDetail: function (id) {
        var _self = this;
        if (!id) id = $('select[name=subscription]').val();
        if (!id || id == '') {
            template_field = { initiedFee: 0.00, processingFee: 0.00, paymentPeriod: 1 };
            template_field.paymentAmount = numeral($('#_total').text()).value();
            _self.getNumberOfPay({
                order_id: $('[name=order_id]').val(),
                balance: $('[name=balance]').val(),
                payment: $('[name=payment]').val(),
                subscription: ''
            });
            $('#init_fee').val(0.00);
            $('#processing_fee').val(0.00);
            $('#period').val(1).change();
        } else {
            var _data = $.extend({}, template_data);
            _data.id = id;
            $.ajax({
                url: link._subTemplate,
                type: 'post',
                data: _data,
                dataType: 'json',
                success: function (res) {
                    if (res.ERROR == '' && res.sub.json) {
                        var detail = res.sub.json;

                        $('#init_fee').val(detail.initiedFee);
                        $('#_init_fee').text(numeral(detail.initiedFee).format('$ 0,0.00'));
                        $('#processing_fee').val(detail.processingFee);
                        $('#_processing_fee').text(numeral(detail.processingFee).format('$ 0,0.00'));
                        // $('#period').val(detail.paymentPeriod).change();
                        $('#_circle_payment').text(detail.billingCircleEvery);

                        var oldPaymentAmount = template_field.paymentAmount;

                        for (var key in detail) {
                            template_field[key] = detail[key];
                        }
                        template_field.paymentAmount = oldPaymentAmount;

                        _self.getNumberOfPay({
                            order_id: $('[name=order_id]').val(),
                            balance: $('[name=balance]').val(),
                            payment: $('[name=payment]').val(),
                            subscription: JSON.stringify(template_field)
                        });

                    } else { }
                }
            })
        }
    },
    setPaymentAmount: function () {
        var total = numeral($('#_total_table').text()).value();
        amount = numeral(total / numeral(template_field.numberOfPay | 1).value() + parseFloat(template_field.processingFee) + (template_field.processingFeeOld | 0)).value().toFixed(2);
        template_field.paymentAmount = amount;
        return amount;
    },

    getBetweenToPay: function () {
        if (template_field) {
            if (!template_field.betweenToPay) {
                return 1;
            } else return template_field.betweenToPay;
        }
    },

    getSubscription: function () {
        if (!$('select[name=subscription]').val() || $('select[name=subscription]').val() == '') {
            return '';
        } else {
            template_field.subscription = $('select[name=subscription]').val();

            var endDate = new Date();

            //payment amount
            this.setPaymentAmount();
            this.getBetweenToPay();

            //get payment:
            var payment = $('[name=payment]').val();
            var createTime = $('[name=createTime]').val();
            if (createTime != '' && payment && payment != '0' && payment != '' && payment != 0) {
                endDate = new Date(createTime);
            }
            var year = endDate.getFullYear() + 1
            endDate.setYear(year);

            template_field.endDate = endDate.toISOString().split('T')[0];
            if (!template_field.offSecondPayFee)
                template_field.offSecondPayFee = false;
            if (!template_field.optionPayingLater)
                template_field.optionPayingLater = false;

            if (typeof $('[name=offSecondPayFee]').prop('checked') !== 'undefined') {
                template_field.offSecondPayFee = $('[name=offSecondPayFee]').prop('checked');
            }
            if (typeof $('[name=optionPayingLater]').prop('checked') !== 'undefined') {
                template_field.optionPayingLater = $('[name=optionPayingLater]').prop('checked');
            }

            return JSON.stringify(template_field);
        }
    }

}

var _billing = new Billing();
_billing.init();