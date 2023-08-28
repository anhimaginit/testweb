function Warranty() { }
var _products = [];
Warranty.prototype.constructor = Warranty;
Warranty.prototype = {
    init: function () {
        $('#transaction_table_form').closest('fieldset').hide();
        state = new State({ element: '#warranty_form' });

        _notewarranty = new NoteTable({
            form: 'Warranty',
            table: '#warranty_form #table_note_info'
        });
        _notewarranty.init();

        _selectLoader = new SelectLoader();

        let repre = getUrlParameter('repre');
        _selectLoader.loadCharityChoiceList('warranty_charity_of_choice');
        _selectLoader.loadDataSelectContact(link._salesmanList, 'salesperson', 'SID', repre);
        loadProductFolowEagleRenewal('', '');
        // loadSalesmanFolowState('ALL');
        // _selectLoader.loadALaCartrProductList('warranty_order_id');
        _purchaseProduct.createInputFields();
        this.setView();
        this.bindEvent();
        this.forwardFromContact();
    },
    setView: function () {

        // '#warranty_form [name=salesperson]',
        var fields = [
            '#warranty_form [name=bill_to]',
            '#warranty_form [name=warranty_seller_agent_id]',
            '#warranty_form [name=warranty_buyer_agent_id]',
            '#warranty_form [name=warranty_mortgage_id]',
            '#warranty_form [name=warranty_escrow_id]'
        ];
        // salesperson: _linkSelect.salesperson,
        new ControlSelect2(fields, {
            bill_to: _linkSelect.bill_to,
            warranty_seller_agent_id: _linkSelect.bill_to,
            warranty_buyer_agent_id: _linkSelect.bill_to,
            warranty_mortgage_id: _linkSelect.bill_to,
            warranty_escrow_id: _linkSelect.bill_to
        });
        var selectFieldSelect2 = [
            'salesperson',
            'warranty_order_id',
            'warranty_charity_of_choice',
            'subscription',
            'payment_type',
        ];
        selectFieldSelect2.forEach(function (item) {
            var type = $('[name="' + item + '"]').prop('type');
            if (type && type.includes('select')) {
                $('#warranty_form [name="' + item + '"]').select2();
            }
        });

        $('input[name="warranty_start_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="warranty_end_date"]').datepicker('option', 'minDate', selectedDate);
                $('input[name="warranty_closing_date"]').datepicker('option', 'minDate', selectedDate);
                var newDate = new Date(selectedDate);
                newDate.setFullYear(newDate.getFullYear() + 1);
                $('[name="warranty_end_date"]').datepicker('setDate', newDate);
            },
        });

        $('input[name="warranty_end_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="warranty_start_date"]').datepicker('option', 'maxDate', selectedDate);
            },
        });

        $('input[name="warranty_closing_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            minDate: new Date(),
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="warranty_start_date"]').datepicker('option', 'maxDate', selectedDate);
            }
        });

    },
    bindEvent: function () {

        $("span#select2-billToId-container").bind('keyup', function (e) {
            // Do Stuff
            alert("ok??");
        });

        $('#btnSubmitWarranty').unbind('click').bind('click', function () {
            $('#btnSubmitWarranty').prop('disabled', true)
            $('#warranty_form').submit();
            setTimeout(function () {
                $('#btnSubmitWarranty').prop('disabled', false)
            }, 2000)
        });

        $("#warranty_discount_code").bind('change', function () {
            loadTotalDiscount();
        });

        $("#billToId, input[name=iptWarrantyContactHiden]").bind('change', function () {
            var _mydata = {};
            _mydata.token = localStorage.getItemValue('token');
            _mydata.contactID = $('#billToId').val();
            if ($('input[name=iptWarrantyContactHiden]').is(":checked") && _mydata.contactID != '') {
                $.ajax({
                    url: link._contactAddress_id,
                    type: 'post',
                    data: _mydata,
                    dataType: 'json',
                    success: function (res) {
                        // load Policyholder Contact
                        $("#salespersonId").val(res.contact_salesman_id).trigger('change');
                        loadPolicyholderContact(res);
                        loadSalesmanFolowState(res.primary_state);
                        //alert(res.contact_salesman_id);
                    }
                });
            } else {
                data = {};
                data.primary_street_address1 = '';
                data.primary_street_address2 = '';
                data.primary_city = '';
                data.primary_state = '';
                data.primary_postal_code = '';
                loadPolicyholderContact(data);
            }
        });

        $(".iptWarrantyCheckHashtag").click(function () {

            var warranty_eagle = "";
            var warranty_renewal = "";

            if ($('input[name=warranty_eagle]').is(":checked")) {
                warranty_eagle = $("input[name=warranty_eagle]").val();
            }

            if ($('input[name=warranty_renewal]').is(":checked")) {
                warranty_renewal = $("input[name=warranty_renewal]").val();
            }

            loadProductFolowEagleRenewal(warranty_eagle, warranty_renewal);

        });

        // load agian saleman
        $('select[name=warranty_state]').change(function () {
            // load agian saleman
            loadSalesmanFolowState($(this).val());
        });

        $('.btn-add-contact').click(function () {
            if ($(this).data('form') != 'Policy Holder') {
                window.a_type = $(this).data('form')
                window.c_type = 'Affiliate';

            } else {
                delete window.a_type;
                window.c_type = 'Policy Holder';
            }
            window.c_type_select = $(this).data('select');
            $('#contact_form [name=contact_tags]').removeTag($('#contact_form [name=contact_tags]').val());
            $('#contact_form').trigger('reset');
            $('#contact_form select.select2-hidden-accessible').val(null).trigger('change');
            if (_contactPhone) {
                $(_contactPhone.table_id + 'tbody tr:nth-child(n+2)').each(function () {
                    $(this).remove();
                })
                _contactPhone.setPrimaryPhone('');
            }

            // $('#contact_form [name="contact_type"]').prop('checked', false);
            $('#contact_form [name="contact_type"][value="' + window.c_type + '"]').prop('checked', true);
            $('#add_new_contact').modal('show');
        });

        this.productEvent();

        $('#warranty_form #sales_corporate').unbind('click').bind('click', function () {
            var corporate = 0;
            var corporate_state = '';
            corporate_state = $('select[name="warranty_state"]').val();
            if (corporate_state == null || corporate_state == undefined) corporate_state = '';

            if ($(this).is(":checked")) {
                corporate = 1;
                loadSalesmanFolowCorporate(corporate);
            } else {
                corporate = 0;
                loadSalesmanFolow_State(corporate_state);
            }
        });

        $('#warranty_form [name=warranty_contract_amount]').change(function () {
            _pricePurchase.getTotalPrice();
        })

    },

    productEvent: function () {
        $(document).unbind('select2:select', '#product_warranty_order_id')
        $(document).on('select2:select', '#product_warranty_order_id', function (e) {
            var data = e.params.data;
            $('#iptProductQuantity').text(1);
            $('#iptProductSKU').text(data.SKU);
            $('#iptProductName').text(data.prod_name);
            $('#iptProductClass').text(data.prod_class);
            data.prod_price = numeral(data.prod_price).format('$ 0,0.00');
            $('#iptProductPrice').text(data.prod_price);
            $('#iptProductDiscountLineTotal').text(data.prod_price);
            _pricePurchase.getTotalPrice();
        })
    },

    formWarrantyValidatorOption: {
        ignore: [],
        rules: {
            warranty_order_id: { required: true },
            warranty_postal_code: { maxlength: 20, number: true },
            warranty_address1: { required: true, maxlength: 100 },
            warranty_buyer_id: { required: true },
            bill_to: { required: true },
            warranty_salesman_id: {},
            warranty_charity_of_choice: { required: true, maxlength: 20 },
            // warranty_serial_number: { number: true, required: true },
            warranty_address2: { maxlength: 100 },
            warranty_buyer_agent_id: { required: function () { return $('[name=warranty_payer_type][value=2]').prop('checked') || $('[name=warranty_submitter_type][value=2]').prop('checked') } /** notEqual: '.warranty_seller_agent_id' */ },
            warranty_seller_agent_id: { required: function () { return $('[name=warranty_payer_type][value=3]').prop('checked') || $('[name=warranty_submitter_type][value=3]').prop('checked') } /** notEqual: '.warranty_buyer_agent_id' */ },
            warranty_escrow_id: { required: function () { return $('[name=warranty_payer_type][value=4]').prop('checked') || $('[name=warranty_submitter_type][value=4]').prop('checked') } },
            warranty_mortgage_id: { required: function () { return $('[name=warranty_payer_type][value=5]').prop('checked') || $('[name=warranty_submitter_type][value=5]').prop('checked') } },
        },
        messages: {
            // warranty_seller_agent_id: { notEqual: 'Seller Agent and Buyer Agent must be different' },
            // warranty_buyer_agent_id: { notEqual: 'Buyer Agent and Seller Agent must be different' }
        },
        submitHandler: function (e) {

            var _formOrderData = $.extend({}, template_data);

            var _data = $("#form_order").serializeArray()
            _data.forEach(function (elem) {
                if (elem.name != '' && elem.value != '') {
                    _formOrderData[elem.name] = elem.value;
                }
            });

            _formOrderData.products_ordered = _purchaseProduct.getProductsData();

            if (_formOrderData.products_ordered.length == 0) {
                messageForm('Please select least a product', false);
                return;
            }

            _formOrderData.notes = [];

            var textOrderTotal = numeral($('#_total_table').text()).value();
            var textTotal = numeral($('#_total').text()).value();
            var contractAmount = numeral($('[name=warranty_contract_amount]').val()).value();
            let grand_total = numeral($('#_grand_total').text()).value();
            if (contractAmount > textOrderTotal) textOrderTotal = contractAmount;

            _formOrderData.total = textOrderTotal;
            _formOrderData.contract_overage = grand_total - textTotal;
            _formOrderData.grand_total = grand_total;

            _formOrderData.order_total = textTotal;
            _formOrderData.discount_code = $('#warranty_discount_code').val();
            _formOrderData.balance = textTotal;
            _formOrderData.payment = 0;
            _formOrderData.createTime = getDateTime();
            _formOrderData.updateTime = getDateTime();
            _formOrderData.subscription = _billing.getSubscription();
            _formOrderData.warranty_contract_amount = numeral(_formOrderData.warranty_contract_amount).value();

            _formOrderData.bill_to = $('#billToId').val();
            _formOrderData.salesperson = $('#salespersonId').val();

            _link = link._orderAddNew;
            if (window.order_warranty && window.order_warranty.order_id != '') {
                _link = link._orderEdit;
                _formOrderData.order_id = window.order_warranty.order_id;
            }

            $.ajax({
                url: _link,
                type: 'post',
                data: _formOrderData,
                dataType: 'json',
                success: function (res) {
                    if (res["SAVE"] == 'FAIL') {
                        messageForm('Error! An error occurred. ' + res['ERROR'], false);
                    } else if (res["SAVE"] == 'SUCCESS') {
                        if (res.ID) {
                            _formOrderData.order_id = res.ID;
                            $('#warranty_order_id').val(res.ID);
                        }
                        window.order_warranty = _formOrderData;


                        $('select[name=warranty_salesman_id]').prop('disabled', false);
                        $('select[name=warranty_buyer_id]').prop('disabled', false);
                        _formData = $.extend({}, template_data);
                        _formData.warranty_order_id = window.order_warranty.order_id;
                        _formData.warranty_payer_type = $('[name=warranty_payer_type]:checked').val();
                        _formData.warranty_submitter_type = $('[name=warranty_submitter_type]:checked').val() || 0;
                        if (_formData.warranty_submitter_type && _formData.warranty_submitter_type != '' && _formData.warranty_submitter_type != 0) {
                            _formData.warranty_submitter = $('[name=warranty_submitter_type]:checked').closest('.input-group').find('select').val();
                        }

                        var sameNameFields = ['warranty_address1', 'warranty_address2', 'warranty_city', 'warranty_state',
                            'warranty_postal_code', 'warranty_contract_amount', 'warranty_charity_of_choice', 'warranty_discount_number',
                            'warranty_discount_type', 'payment_type', 'warranty_buyer_agent_id', 'warranty_seller_agent_id',
                            'warranty_escrow_id', 'warranty_mortgage_id', 'warranty_closing_date'];

                        sameNameFields.forEach(function (item) {
                            _formData[item] = $('[name="' + item + '"]').val();;
                        });
                        if (_formData.warranty_serial_number == '' || _formData.warranty_serial_number == undefined) { _formData.warranty_serial_number = Warranty.prototype.createSerialNumber(); }

                        _formData.notes = _notewarranty.getNotes();
                        if (_formData.warranty_closing_date == undefined) { _formData.warranty_closing_date = getDateTime(new Date()) }

                        var product_id = [];
                        _formOrderData.products_ordered.forEach(item => {
                            if (['Warranty', 'A La Carte'].includes(item.prod_class)) {
                                product_id.push(item.id);
                                if (numeral(item.quantity).value() > 1) {
                                    for (let i = 1; i < numeral(item.quantity).value(); i++) {
                                        product_id.push(item.id);
                                    }
                                }
                            }
                        });
                        _formData.pro_ids = product_id.join(',');
                        _formData.warranty_buyer_id = $('#billToId').val();
                        _formData.warranty_salesman_id = $('#salespersonId').val();

                        _formData.warranty_inactive = $('input[name="warranty_inactive"]').prop('checked') == true ? 1 : 0;
                        _formData.warranty_eagle = $('input[name=warranty_eagle]').prop('checked') == true ? 1 : 0;
                        _formData.warranty_renewal = $('input[name=warranty_renewal]').prop('checked') == true ? 1 : 0;
                        _formData.warranty_contract_amount = numeral(_formData.warranty_contract_amount).value();
                        _formData.skip_email = $('[name=skip_email]').prop('checked') == true ? 1 : 0;
                        _formData.diff_address = $('[name="iptWarrantyContactHiden"]').prop('checked') == true ? 1 : 0;
                        _formData.total = numeral($('#_total').text()).value();
                        _formData.contract_overage = numeral($('#warranty_form #_contract_overage').text()).value();

                        _formData.warranty_corporate = 0;
                        _formData.ID = $('#warranty_form [name=ID]').val();
                        if ($('#warranty_form #sales_corporate').is(":checked")) {
                            _formData.warranty_corporate = 1;
                        }

                        _link = link._warrantyAddNewNotLogin;

                        if (_formData.ID && _formData.ID != '') {
                            _link = link._warrantyEdit;
                        } else {
                            delete _formData.ID;
                        }
                        $.ajax({
                            url: _link,
                            type: 'post',
                            data: _formData,
                            dataType: 'json',
                            success: function (res2) {
                                if (res["SAVE"] == 'FAIL') {
                                    messageForm('Error! An error occurred. ' + res2['ERROR'], false)
                                    return
                                } else if (res2["SAVE"] == 'SUCCESS') {
                                    if (res2.ID) {
                                        _formData.ID = res2.ID;
                                        $('#warranty_form [name=ID]').val(res2.ID);
                                    }
                                    if (document.location.href.indexOf('warranty-form') > 0) {
                                        if (!window.payment_submit_form) {
                                            responseSuccessForward('You have successfully ' + (res2.ID ? 'added new' : 'edited the') + ' warranty', true, '#warranty_form #message_form', './#ajax/warranty-form.php?id=' + _formData.ID, 'Go to edit warranty');
                                        } else {
                                            messageForm('You have successfully added new warranty', true);
                                        }
                                    } else {
                                        messageForm('You have successfully added new warranty', true);
                                    }
                                    if (window.payment_submit_form && $('#fs_payment_method [name=warranty_payer_typement_type]:checked').val() == 'Credit') {
                                        new WarrantyPayment().sendPay();
                                    } else if (window.payment_submit_form) {
                                        responseSuccessForward('You have successfully added new warranty', true, '#warranty_form #message_form', './#ajax/warranty-form.php?id=' + _formData.ID, 'Go to edit warranty');
                                    }
                                    delete window.payment_submit_form;
                                    return;
                                }

                            },
                            error: function (e) {
                            }
                        });


                    }
                },
                error: function (e) {
                    messageForm('Error! An error occurred. Please try later', false);
                }
            });
        }
    },

    createSerialNumber: function () {
        var _date = new Date();
        return _date.toISOString().split('.')[0].replace(/[T:-]/g, '');
    },

    forwardFromContact: function () {
        if (getUrlParameter('contactid')) {
            var bill_to = getUrlParameter('contactid');
            var buyer_name = getUrlParameter('contactname');
            $('select[name="bill_to"]').append('<option value="' + bill_to + '">' + buyer_name + '</option>').trigger('change');
        }
    }
}

var loadTotalDiscount = function (callback) {
    var _mydata = {};
    _mydata.token = localStorage.getItemValue('token');
    _mydata.discount_code = $("#warranty_discount_code").val();
    _mydata.discount_name = $("#warranty_discount_code").val();
    $("#discountDescription").empty();
    if (_mydata.discount_code.length > 0) {
        $.ajax({
            // url: link._discountGetByDiscountCode,
            url: link._discountGetByDiscountCodeByName,
            type: 'post',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                if (res && res.item) {
                    _pricePurchase.displayDiscount(res.item);
                } else {
                    $("#discountDescription").html("<p class='error'>Discount Code is not exist</p>");
                }
                _pricePurchase.getTotalPrice();
                if (callback) callback()
            }
        });
    } else {
        _pricePurchase.getTotalPrice();
        delete window.discount_code_value;
    }


};
var addValueToiptDiscountCode = function (code) {
    $("#warranty_discount_code").val(code);
    loadTotalDiscount();
};

var loadSalesmanFolowState = function (_stateName) {
    if (!_stateName || _stateName == '') {
        return;
    }
    /**
     * #salespersonId
     */
    var corporate = '';
    if ($('#warranty_form #sales_corporate').is(":checked")) {
        corporate = 1;
    }
    var _mydata = {};
    _mydata.token = localStorage.getItemValue('token');
    _mydata.state = _stateName;
    _mydata.corporate = corporate;
    $.ajax({
        url: link._salesmanList_state,
        type: 'post',
        data: _mydata,
        success: function (res) {
            var data = JSON.parse(res);
            let s_id = $("#salespersonId").val() != undefined && $("#salespersonId").val() != '' ? $("#salespersonId").val() : null;

            // first_name + middle_name + last_name //
            $("#salespersonId").empty();

            data.forEach(function (item) {
                $("#salespersonId").append(new Option(item.first_name + ' ' + item.middle_name + ' ' + item.last_name, item.SID));;
            });
            $("#salespersonId").val(s_id).trigger('change');
        }
    });


};

var loadSalesmanFolowCorporate = function (_corporate) {

    var _mydata = {};
    _mydata.token = localStorage.getItemValue('token');
    _mydata.corporate = _corporate;

    $.ajax({
        url: link._salesmanList_corporate,
        type: 'post',
        data: _mydata,
        success: function (res) {
            var data = JSON.parse(res);
            // first_name + middle_name + last_name //
            $("#salespersonId").empty();
            data.forEach(function (item) {
                $("#salespersonId").append(new Option(item.first_name + ' ' + item.middle_name + ' ' + item.last_name, item.SID));;
            });
            $("#salespersonId").val(null).trigger('change');
        }
    });


};

var loadSalesmanFolow_State = function (_stateName) {

    /**
     * #salespersonId
     */
    var _mydata = {};
    _mydata.token = localStorage.getItemValue('token');
    _mydata.state = _stateName;

    $.ajax({
        url: link._salesmanList_state,
        type: 'post',
        data: _mydata,
        success: function (res) {
            var data = JSON.parse(res);
            // first_name + middle_name + last_name //
            $("#salespersonId").empty();
            data.forEach(function (item) {
                $("#salespersonId").append(new Option(item.first_name + ' ' + item.middle_name + ' ' + item.last_name, item.SID));;
            });
            $("#salespersonId").val(null).trigger('change');
        }
    });


};

var loadPolicyholderContact = function (data) {
    if (!data.primary_city || data.primary_city == '') {
        if ($('select[name=warranty_city]').val() == '' || $('select[name=warranty_city]').val() == '') return;
        $('select[name=warranty_postal_code]').empty();
        $('select[name=warranty_postal_code]').val(null).trigger('change');

        $('select[name=warranty_state]').empty();
        $('select[name=warranty_state]').val(null).trigger('change');

        $('select[name=warranty_city]').empty();
        $('select[name=warranty_city]').val(null).trigger('change');

        loadSalesmanFolowState('ALL');

    } else {
        state.setValue2(null, data.primary_city, data.primary_state, data.primary_postal_code, function () {
            loadSalesmanFolowState(data.primary_state);
        });
        // load Salesman folow State of Policyholder
    }

    /**
     *
     * name=[warranty_address1]
     * name=[warranty_address2]
     * name=[warranty_city]
     * name=[warranty_state]
     * name=[warranty_postal_code]
     */


    $('input[name=warranty_address1]').val(data.primary_street_address1);
    $('input[name=warranty_address2]').val(data.primary_street_address2);

};

var loadProductFolowEagleRenewal = function (eagle, renewal) {
    var _mydata = {};
    _mydata.token = localStorage.getItemValue('token');
    _mydata.Eagle = eagle;
    _mydata.Renewal = renewal;
    $.ajax({
        url: link._productClssWarranty,
        type: 'post',
        data: _mydata,
        dataType: 'json',
        success: function (res) {
            if (res) {
                if (res.list) {
                    res.list.forEach(function (item, index) {
                        res.list[index].id = item.ID;
                        res.list[index].text = (item.prod_name ? item.prod_name : 'Warranty - ' + item.ID);
                    });
                }
                $('#product_warranty_order_id').empty();
                res.list.splice(0, 0, { id: '', text: 'Select product' });
                $('#product_warranty_order_id').select2(createSelectProductWarrantyOption({ placeholder: 'Select product', data: res.list }));
                $('#product_warranty_order_id').val(null).trigger('change');
            } else {
                $('#product_warranty_order_id').empty();
            }
        }
    });
};

function createSelectProductWarrantyOption(option) {
    if (!option) option = {};
    var opt = {
        minimumInputLength: 0,
        allowClear: true,
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (data) {
            var _html =
                '<div class="media padding-2 product_' + data.id + '">' +
                '<div class="media-left">' +
                '<img src="' + (data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object" style="width:40px; margin-top:3px;">' +
                '</div>' +
                '<div class="media-body">' +
                '<div class="username"><span class="bold">' + data.prod_name + '</span> <small class="pull-right">' + data.prod_class + '</small></div>' +
                '<div>SKU: ' + data.SKU + '<span class="pull-right">' + numeral(data.prod_price).format('$ 0,0.00') + '</span></div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        templateSelection: function (data) {
            if (typeof data == 'string') return data;
            if (!data.prod_name) return data.ID;
            return data.prod_name;
        }
    }
    return $.extend(opt, option);
}

if (document.location.href.indexOf('warranty-form') > 0) {

    var _warranty = new Warranty();
    _warranty.init();
    $('#warranty_form').validate(_warranty.formWarrantyValidatorOption);
}