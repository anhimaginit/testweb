function Warranty() {
    this.warranty_salesman_id = '';
}

Warranty.prototype.constructor = Warranty;
var addresses = {};
var orderList = {};
var productList = {};
var roleViewWarranty = ['Affiliate'];
var onlyViewWarranty = false;
var _notewarranty;
// var onlyViewWarranty = roleViewWarranty.includes(localStorage.getItemValue('actor')) && getUrlParameter('id');
Warranty.prototype = {
    init: function (callback) {
        $('#transaction_table_form').closest('fieldset').hide();
        _selectLoader = new SelectLoader();
        _selectLoader.loadOrderList('warranty_order_id');
        _selectLoader.loadCharityChoiceList('warranty_charity_of_choice');
    //    _selectLoader.loadDataSelectContact(link._salesmanList, 'salesperson', 'SID');
        _selectLoader.loadDataSelectContact(link._salesmanList, 'warranty_salesman_id', 'SID');
        if (!onlyViewWarranty) {
            warrantyState = new State({ element: '#warranty_form' });
            this.setView();
            this.bindEvent();
        }
        _notewarranty = new NoteTable({
            form: 'Warranty',
            table: '#warranty_form #table_note_info'
        });
        _notewarranty.init();
        if (callback) callback();
    },
    setView: function () {

        var fields = [
            'select.warranty_buyer_id',
            // '[name=warranty_salesman_id]',
            '[name=warranty_seller_agent_id]',
            '[name=warranty_buyer_agent_id]',
            '[name=warranty_mortgage_id]',
            '[name=warranty_escrow_id]'
        ];
        var _dataLink = {
            warranty_buyer_id: _linkSelect.warranty_buyer_id,
            warranty_seller_agent_id: _linkSelect.customer,
            warranty_buyer_agent_id: _linkSelect.customer,
            warranty_mortgage_id: _linkSelect.customer,
            warranty_escrow_id: _linkSelect.customer
        }
        // if (getUrlParameter('id')) {
        //     new ControlSelect2(fields);
        // } else {
        //     new ControlSelect2(fields, _dataLink);
        // }
        new ControlSelect2(fields, _dataLink);
        var selectFieldSelect2 = [
            'warranty_salesman_id',
            'warranty_order_id',
            'warranty_charity_of_choice'
        ];
        selectFieldSelect2.forEach(function (item) {
            var type = $('[name="' + item + '"]').prop('type');
            if (type && type.includes('select')) {
                $('#warranty_form [name="' + item + '"]').select2().trigger('change');;
            }
        })

        $('input[name="warranty_start_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="warranty_end_date"]').datepicker('option', 'minDate', new Date(selectedDate));
                $('input[name="warranty_closing_date"]').datepicker('option', 'minDate', new Date(selectedDate));
                var newDate = new Date(selectedDate);
                newDate.setFullYear(newDate.getFullYear() + 1);
                $('[name="warranty_end_date"]').datepicker('setDate', newDate);
            }
        });

        $('input[name="warranty_end_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="warranty_start_date"]').datepicker('option', 'maxDate', new Date(selectedDate));
            },
        });

        $('input[name="warranty_closing_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="warranty_start_date"]').datepicker('option', 'maxDate', new Date(selectedDate));
            }
        });
        $('button[id="btnAddContactOrder"]').remove();
        $('button[id="btnForwardOrderToWarranty"]').remove();
    },
    bindEvent: function () {
        $(".warranty_buyer_id").bind('change', function () {
        //    alert("here");
            var _mydata = {};
            _mydata.token = localStorage.getItemValue('token');
            _mydata.contactID = $('.warranty_buyer_id').val();
        //    alert(_mydata.contactID);
            $.ajax({
                url: link._contactAddress_id,
                type: 'post',
                data: _mydata,
                dataType: 'json',
                success: function (res) {
                //    $("#salespersonId").append(new Option(res.first_name + ' ' + res.middle_name + ' ' + res.last_name, res.contact_salesman_id));
                    $('select[name="warranty_salesman_id"]').val(res.contact_salesman_id).trigger('change');
                }
            });
        });

        let that = this;
        $('#warranty_form').validate(this.formWarrantyValidatorOption);
        $('#warranty_order_id').on('select2:selecting', function (e) {
            var id = e.params.args.data.id;
            Warranty.prototype.search_order(id)
        }).on('select2:unselecting', function (e) {
            var tag = e.params.args.data.id;
            if (tag != '' && $("#tb_product_show tbody tr").is("#tr_order_" + tag)) {

                $('tr[id="tr_order_' + tag + '"]').remove();
                $('.discount_order_' + tag).remove();
                delete productList[tag];
                that.getTotalPriceTable();
            }
        }).on('select2:opening', function (e) {
            setTimeout(function () {
                that.checkHasWarranty();
            }, 200)
        });

        $('#btnSubmitWarranty').unbind('click').bind('click', function () {
            $('#warranty_form').submit()
        });

        $('input:checkbox[name="warranty_eagle"]').on('click', function () {
            if (this.checked) {
                if ($('input[name="warranty_start_date"]').val() == '' || $('input[name="warranty_start_date"]').val() == undefined) {
                    $('input[name="warranty_start_date"]').val(new Date().toISOString().split('T').shift());
                }
                var newDate = new Date(new Date($('input[name="warranty_start_date"]').val()).getTime() + 24 * 3600 * 1000 * 365.25 * 2).toISOString().split('T').shift();
                // var newDate = new Date(new Date($('input[name="warranty_start_date"]').val()).getTime() + 24 * 3600 * 1000 * 365.25 * 2).toISOString().split('T')[0];
                $('input[name="warranty_end_date"]').val(newDate);
            } else {
                var newDate = new Date(parseInt(new Date($('input[name="warranty_start_date"]').val() || new Date()).getTime()) + 24 * 3600 * 1000 * 365.25).toISOString().split('T')[0];
                $('input[name="warranty_end_date"]').val(newDate);
            }
        });

        $('#btnBackOrder').off('click');
        $('#btnBackOrder').text('Cancel');
        $('#btnBackOrder').on('click', function () {
            $('.modal').modal('hide');
            $('#table_product_ordered tbody').empty();
            _orderProducts.createInputFields();
        });


        $('#warranty_form [name=warranty_contract_amount]').change(function () {
            that.getTotalPriceTable();
        })


        $('#warranty_form [name=warranty_buyer_id]').on('select2:selecting', function (arg) {
            var data = arg.params.args.data;
            $('#order_form select[name=bill_to]').append('<option value="' + data.id + '" selected>' + data.text + '</option>').trigger('change');
            if ($('#warranty_form #contact_address').prop('checked') == true) {
                that.getAddress(data.id);
            }
        }).on('change', function () {
            if (this.value && this.value != '') {
                $('#view_contact_buyer').html('<a href="./#ajax/contact-form.php?id=' + this.value + '" target="_blank" style="cursor:pointer">Go to contact information <i class="fa fa-external-link"></i></a>')
            } else {
                $('#view_contact_buyer').empty();
            }
        });

        $('#warranty_form .warranty_salesman_id').change(function (e) {
            $('#order_form select[name=salesperson]').val(this.value).trigger('change');
            if (this.value && this.value != '') {
                $('#view_contact_salesman').data('salesman', this.value);
            } else {
                $('#view_contact_salesman').data('salesman', '');
                $('#view_contact_salesman').empty();
            }
        });

        $('#warranty_form input[name=warranty_address1]').change(function () {
            $('#order_form input[name=order_title]').val('Warranty - ' + this.value).trigger('change');
        });

        $('#warranty_form #contact_address').change(function () {
            Warranty.prototype.getAddress($('#warranty_form [name=warranty_buyer_id]').val());
        });

        $('#warranty_form .state').change(function () {
            if (this.value == '' || this.value == undefined) return;
            _selectLoader.loadSalesmanListState('warranty_salesman_id', 'SID', this.value);
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
            $('#contact_form [name="contact_type"]').prop('checked', false);
            $('#contact_form [name="contact_type"][value="' + window.c_type + '"]').prop('checked', true);
            $('#add_new_contact').modal('show');
        });

        $('#warranty_form #sales_corporate').unbind('click').bind('click', function () {
            var corporate = 0;
            var corporate_state = '';
            corporate_state = $('select[name="warranty_state"]').val();
            _selectLoader.loadSalesmanListState('warranty_salesman_id', 'SID', corporate_state, Warranty.prototype.salesman_select);
        })

    },

    initUpdate: function (_id) {
        var _mydata = $.extend({ ID: _id }, template_data);
        $.ajax({
            url: link._warrantyGetById,
            type: 'post',
            data: _mydata,
            success: function (res_data) {
                if (res_data.toString() != '[]') {
                    var _warr = JSON.parse(res_data)[0];

                    if (_warr.warranty_corporate == 1) $('#warranty_form #sales_corporate').prop("checked", true)

                    if (onlyViewWarranty) {
                        _warranty.getAddress(_warr.warranty_buyer_id);

                        $("#warranty_form input").each(function () {
                            var name = $(this).prop('name');
                            if (name && _warr[name] != undefined) {
                                var _type = ["text", "number", "date"];
                                var _type2 = ["checkbox", "radio"];
                                if (_type.includes($(this).prop("type"))) {
                                    $(this).replaceWith(_warr[name]);
                                } else if (_type2.includes($(this).prop("type"))) {
                                    $(this).prop('checked', $(this).val() == _warr[name]);
                                }
                            }
                        });

                        $("#warranty_form textarea").each(function () {
                            var name = $(this).prop('name');
                            if (name && _warr[name]) {
                                $(this).replaceWith(_warr[name]);
                            }
                        });

                        $('#warranty_form [name=warranty_salesman_id_name]').replaceWith(_warr.saleman_name);

                        $('#warranty_form [name=warranty_buyer_agent_id]').replaceWith(_warr.buyer_agent_name);
                        $('#warranty_form [name=warranty_seller_agent_id]').replaceWith(_warr.seller_agent_name);
                        $('#warranty_form [name=warranty_escrow_id]').replaceWith(_warr.affTitle_name);
                        $('#warranty_form [name=warranty_mortgage_id]').replaceWith(_warr.mortgage_name);

                        if (_warr.warranty_type) {
                            var _tmp = [], _tmp_name = [];
                            _warr.warranty_type.forEach(function (item) {
                                _tmp.push(item.ID);
                                _tmp_name.push(item.prod_name);
                            });
                            // $('#warranty_form [name=warranty_type]').val(_tmp.join(','));
                            $('#warranty_form [name=warranty_type_name]').replaceWith(_tmp_name.join(', '));
                        }

                        getContactName(_warr.warranty_buyer_id).then(function (res) {
                            $('[name="warranty_buyer_id_name"]').replaceWith(res[0].c_name);
                            $('#order_form [name=bill_to]').append('<option value="' + res[0].ID + '" selected>' + res[0].c_name + '</option>');
                        }).catch(function (e) { });

                        $("#warranty_form select").each(function () {
                            var name = $(this).prop('name');
                            var needGetName = ['warranty_seller_agent_id', 'warranty_buyer_agent_id', 'warranty_mortgage_id', 'warranty_escrow_id'];
                            var elem = this;
                            if (needGetName.includes(name) && _warr[name]) {
                            } else if ((['warranty_city', 'warranty_state', 'warranty_postal_code']).includes(name)) {
                                $(elem).replaceWith(_warr[name]);
                            } else if (name != 'warranty_order_id') {
                                $(elem).replaceWith($(elem).find('option[value=' + _warr[name] + ']').text());
                            }
                        });
                        if (_warr.warranty_order_id) {

                            _warr.warranty_order_id.split(',').forEach(function (elem) {
                                _warranty.search_order(elem);;
                            });
                        }
                        if (_warr.notes != undefined && _warr.notes.length > 0) {
                            _notewarranty.displayList(_warr.notes);
                        }

                        Warranty.warranty_order_id = _warr.warranty_order_id;
                        _warranty.old_warranty_address1 = _warr.warranty_address1;
                        new WarrantyClaim(_id).loadList();

                        $('label.input').css({ 'display': 'inline-block' });
                        let _createBy = '';
                        if (_warr.warranty_create_by == '202') {
                            _createBy = 'Come from https://www.freedomhw.com/'
                        } else {
                            _createBy = 'Create by ' + _warr.createby_name;
                        }
                        $('#_display_header').html(_warr.warranty_serial_number + ' - ' + _createBy);
                        $('#pane_address').css({ 'display': 'inline' });
                        $('#warranty_order_id').select2({
                            disabled: true
                        });
                    } else {
                        for (var key in _warr) {
                            if (['warranty_buyer_agent_id', "warranty_mortgage_id", "warranty_seller_agent_id", "warranty_escrow_id", 'warranty_salesman_id', 'warranty_buyer_id'].includes(key)) {

                            } else if ((['warranty_charity_of_choice']).includes(key)) {
                                $("#warranty_form select[name='" + key + "']").val(_warr[key]).trigger('change');
                            } else if (_warr[key] != null && _warr[key] != undefined && ['warranty_closing_date', 'warranty_start_date', 'warranty_end_date'].includes(key)) {
                                $("#warranty_form [name='" + key + "']").val(_warr[key].split(' ')[0]);
                            } else if ((['warranty_city', 'warranty_postal_code', 'warranty_postal_code']).includes('key')) {

                            } else if (['checkbox', 'radio'].includes($("#warranty_form [name='" + key + "']").prop('type'))) {
                                if (_warr[key] && typeof _warr[key] == 'string') {
                                    _warr[key].split(',').forEach(function (item) {
                                        $('#warranty_form [name=' + key + '][value=' + item + ']').prop('checked', true);;
                                    })
                                }
                            } else {
                                $("#warranty_form input[name='" + key + "']").val(_warr[key]);
                            }
                        }
                        if (_warr.warranty_buyer_agent_id && _warr.warranty_buyer_agent_id != '0' && _warr.warranty_buyer_agent_id != undefined && _warr.warranty_buyer_agent_id != null && _warr.buyer_agent_name) {
                            $("#warranty_form select[name='warranty_buyer_agent_id']").append('<option value="' + _warr.warranty_buyer_agent_id + '" selected>' + _warr.buyer_agent_name + '</option>').trigger('change');
                        }
                        if (_warr.warranty_mortgage_id && _warr.warranty_mortgage_id != '0' && _warr.warranty_mortgage_id != undefined && _warr.warranty_mortgage_id != null && _warr.mortgage_name) {
                            $("#warranty_form select[name='warranty_mortgage_id']").append('<option value="' + _warr.warranty_mortgage_id + '" selected>' + _warr.mortgage_name + '</option>').trigger('change');

                        }
                        if (_warr.warranty_seller_agent_id && _warr.warranty_seller_agent_id != '0' && _warr.warranty_seller_agent_id != undefined && _warr.warranty_seller_agent_id != null && _warr.seller_agent_name) {
                            $("#warranty_form select[name='warranty_seller_agent_id']").append('<option value="' + _warr.warranty_seller_agent_id + '" selected>' + _warr.seller_agent_name + '</option>').trigger('change');

                        }
                        if (_warr.warranty_escrow_id && _warr.warranty_escrow_id != '0' && _warr.warranty_escrow_id != undefined && _warr.warranty_escrow_id != null && _warr.affTitle_name) {
                            $("#warranty_form select[name='warranty_escrow_id']").append('<option value="' + _warr.warranty_escrow_id + '" selected>' + _warr.affTitle_name + '</option>').trigger('change');

                        }
                        if (_warr.warranty_buyer_id && _warr.warranty_buyer_id != '0' && _warr.warranty_buyer_id != undefined && _warr.warranty_buyer_id != null && _warr.buyer_name) {
                            $('#warranty_form select[name=warranty_buyer_id]').append('<option value="' + _warr.warranty_buyer_id + '" selected>' + _warr.buyer_name + '</option>').trigger('change');

                        }

                        // $('#warranty_form [name=warranty_payer_type]').filter('[value='+_warr.warranty_payer_type+']').prop('checked', true);
                        /**
                         * Set address, city, state, zipcode and salesman
                         */
                        _warranty.getAddress(null, _warr);

                        $('#warranty_form input[name="warranty_inactive"]').prop('checked', _warr.warranty_inactive == 1 ? true : false);
                        $('#warranty_form input[name="warranty_renewal"]').prop('checked', _warr.warranty_renewal == 1 ? true : false);
                        $('#warranty_form input[name="warranty_eagle"]').prop('checked', _warr.warranty_eagle == 1 ? true : false);
                        _warr.warranty_order_id.split(',').forEach(function (elem) {
                            _warranty.search_order(elem);
                        });
                        if (_warr.notes != undefined && _warr.notes.length > 0) {
                            _notewarranty.displayList(_warr.notes);
                        }

                        if (_warr.warranty_type) {
                            var
                                // _tmp = [], 
                                _tmp_name = [];
                            _warr.warranty_type.forEach(function (item) {
                                _tmp_name.push(item.prod_name);;
                            });
                            // $('#warranty_form [name=warranty_type]').val(_tmp.join(','));
                            $('#warranty_form [name=warranty_type_name]').val(_tmp_name.join(', '));
                            $('#warranty_form .warranty_agent select').trigger('select2:select');
                        }

                        Warranty.warranty_order_id = _warr.warranty_order_id;
                        _warranty.old_warranty_address1 = _warr.warranty_address1;
                        new WarrantyClaim(_id).loadList();
                        let _createBy = '';
                        if (_warr.warranty_create_by == '202') {
                            _createBy = 'Come from https://www.freedomhw.com/'
                        } else {
                            _createBy = 'Create by ' + _warr.createby_name;
                        }
                        $('#_display_header').html(_warr.warranty_serial_number + ' - ' + _createBy);

                        /** order form */
                        {
                            $('#order_form input[name=order_title]').val('Warranty' + (_warr.warranty_address1 ? ' - ' + _warr.warranty_address1 : ''));
                            $('#order_form select[name=bill_to]').append('<option value="' + _warr.warranty_buyer_id + '" selected>' + _warr.buyer_name + '</option>').trigger('change');
                        }
                    }
                    $('#warranty_form [name="warranty_contract_amount"]').addClass('input-readonly').prop('readonly', true);
                } else {
                    messageForm('No warranty found with id=' + _id + ', please check with an another id', false, '#warranty_form #message_form');
                    return
                }
            }
        })
    },
    initForwardFromOrder: function (_id) {
        if (_id) {
            setTimeout(function () {
                $("#warranty_order_id").val(_id).trigger("change.select2");
                _warranty.search_order(_id);
            }, 800);
        }
    },
    search_order: function (ids) {
        var id = (ids == undefined || ids == '' || ids == null ? $('#warranty_order_id').val() : ids);
        if (id != '') {
            var _mydata = $.extend({}, template_data);
            _mydata.order_id = id;
            var _self = this;
            $.ajax({
                url: link._orderGetByIdForWarranty,
                type: 'post',
                data: _mydata,
                dataType: 'json',
                success: function (_order) {
                    if (_order.order != undefined && _order.order[0] != undefined) {
                        orderList[_order.order[0].order_id + ''] = _order.order[0];
                        var warranty = _order.order[0].warranty;
                        if ((warranty == "0" || warranty == 0)) {
                            productList[_order.order[0].order_id + ''] = _order.products;
                            _warranty.createRowTable(_order);
                        } else {
                            var warranID = $('#warranty_form [name=ID]').val()
                            if (warranID == warranty) {
                                productList[_order.order[0].order_id + ''] = _order.products;
                                _warranty.createRowTable(_order);
                            } else {
                                Warranty.prototype.keepTableFromOrderID();
                                $('#warranty_order_id').closest('.col').children('p').html("<a href='./#ajax/warranty-form.php?id=" + warranty + "'><p><span class='error'>The order is used for warranty " + warranty + ".</span> Click to go to warranty " + warranty + "<p></a>")

                                return;
                            }
                        }

                        $("#warranty_order_id option[value=" + id + "]").prop("selected", true).trigger("change");
                        _self.getTotalPriceTable(_order.order);
                    } else {
                        Warranty.prototype.keepTableFromOrderID();
                        $("#warranty_order_id option[value=" + id + "]").prop("selected", false).parent().trigger("change");
                        $('#warranty_order_id').closest('.col').children('p').html("<p class='error'>Can't find order ID: " + id + "<p>")
                    };
                }
            });
        } else {
            Warranty.prototype.keepTableFromOrderID();
            $('#warranty_order_id').closest('.col').children('p').empty();
        }
    },

    keepTableFromOrderID: function () {
        $('#warranty_order_id').val().forEach(function (elem) {
            if (!($("#tb_product_show tbody tr").is("#tr_order_" + elem))) {
                $('tr[id="tr_order_' + elem + '"]').remove();
            }
            if (!($("#table_claim_limit tbody tr").is("#_" + elem))) {
                $('tr[id="_' + elem + '"]').remove();
            }
        });
    },

    getProductOrder: function () {
        var result = [];
        $('#tb_product_show tbody').find('tr').each(function (row, elem) {
            var $tds = $(this);
            var id = $tds.find('.prod_id').text();
            var prodClass = $tds.find('td.prod_class').text();
            var quantity = numeral($tds.find('td.prod_quantity').text()).value()
            if (id != '' && id != 'Select product' && (prodClass == 'Warranty' || prodClass == 'A La Carte')) {
                result.push(id);
                if (quantity > 1) {
                    for (let i = 1; i < quantity; i++) {
                        result.push(id);
                    }
                }
            }
        });
        return result;
    },

    getTotalPriceTable: function () {
        let _total = 0;
        let grand_total = 0;
        let isWarrantyPaid = false;
        let contract_overage_order = 0;
        for (var order_id in productList) {
            var products = productList[order_id + ''];
            let order = orderList[order_id];
            if (products) {
                grand_total += numeral(order.grand_total).value();
                products.forEach(function (item) {
                    if (!isWarrantyPaid) {
                        isWarrantyPaid = numeral(order.balance).value() <= 0 && item.prod_class == 'Warranty';
                        contract_overage_order = numeral(order.contract_overage).value();
                    }
                    _total += numeral(item.line_total).value();
                });
            }
        }
        let contract_amount = numeral($('#warranty_form [name=warranty_contract_amount]').val()).value();
        if (grand_total > _total) grand_total = _total;
        if (contract_amount > grand_total) grand_total = contract_amount;
        let contract_overage = grand_total - _total;
        /**
         * Check order has warranty paid.
         * if complete paid, the contract overage get by contract_overage_order
         */
        if (isWarrantyPaid) {
            contract_overage = contract_overage_order;
            grand_total = _total+ contract_overage_order;
        }

        $('#tb_product_show #warranty_total_price').text(numeral(_total).format('$ 0,0.00'));
        $('#tb_product_show #warranty_contract_overage').text(numeral(contract_overage).format('$ 0,0.00'));
        $('#tb_product_show #warranty_grand_total').text(numeral(grand_total).format('$ 0,0.00'));
        $('input[name="total"]').val(_total);
        $('#_total_p_method').text(numeral(_total).format('$ 0,0.00'));
        if (_total <= 0) {
            $('.buttonPaymentWarranty').prop('disabled', 'disabled');
        } else {
            $('.buttonPaymentWarranty').prop('disabled', false);
        }
        return _total;
    },

    formWarrantyValidatorOption: {
        ignore: [],
        rules: {
            warranty_order_id: { required: true },

            warranty_postal_code: { maxlength: 20, required: true, number: true },
            // warranty_city: { maxlength: 50, required: true },
            // warranty_state: { required: true, maxlength: 20 },
            warranty_address1: { required: true, maxlength: 100 },

            warranty_buyer_id: { required: true },
            warranty_salesman_id: {},

            warranty_start_date: { date: true },
            warranty_end_date: { date: true, },

            warranty_charity_of_choice: { required: true, maxlength: 20 },
            // warranty_serial_number: { number: true, required: true },

            // warranty_contract_amount: { number: true },
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

            var _formData = { token: localStorage.getItemValue('token'), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };

            var _data = $("#warranty_form").serializeArray()
            _data.forEach(function (elem) {
                if (elem.name != '' && elem.value != '') {
                    _formData[elem.name] = elem.value;
                }
            });
            _formData.warranty_order_id = $('#warranty_order_id').val().join(',');

            if (!_formData.warranty_buyer_id) _formData.warranty_buyer_id = localStorage.getItemValue('userID');

            if (_formData.warranty_serial_number == '' || _formData.warranty_serial_number == undefined) { _formData.warranty_serial_number = Warranty.prototype.createSerialNumber(); }
            _formData.warranty_inactive = $('input[name="warranty_inactive"]').prop('checked') == true ? 1 : 0;
            _formData.warranty_renewal = $('input[name="warranty_renewal"]').prop('checked') == true ? 1 : 0;
            if ($('#view_contact_salesman').data('salesman') != '' && !_formData.warranty_salesman_id) _formData.warranty_salesman_id = $('#view_contact_salesman').data('salesman');

            _formData.notes = _notewarranty.getNotes();
            if (_formData.warranty_closing_date == undefined) { _formData.warranty_closing_date = getDateTime(new Date()) }

            _formData.pro_ids = Warranty.prototype.getProductOrder().join(',');
            _formData.warranty_contract_amount = numeral(_formData.warranty_contract_amount).value();

            _formData.warranty_payer_type = $('[name=warranty_payer_type]:checked').val();
            _formData.warranty_submitter_type = $('[name=warranty_submitter_type]:checked').val() || 0;
            if (_formData.warranty_submitter_type && _formData.warranty_submitter_type != '' && _formData.warranty_submitter_type != 0) {
                _formData.warranty_submitter = $('[name=warranty_submitter_type]:checked').closest('.input-group').find('select').val();
            }

            _formData.contract_overage = numeral($('#warranty_form #warranty_contract_overage').text()).value();

            _formData.diff_address = $('#contact_address').prop('checked') == true ? 1 : 0;
            _formData.total = numeral($('#warranty_form #warranty_total_price').text()).value();

            _formData.warranty_corporate = 0;
            if ($('#warranty_form #sales_corporate').is(":checked")) {
                _formData.warranty_corporate = 1;
            }

            _link = link._warrantyAddNewNotLogin;
            if (_formData.ID && _formData.ID != '' && _formData.ID != '0') {
                _link = link._warrantyEdit;
                //relationship with order
                _formData.old_warranty_address1 = _warranty.old_warranty_address1;
            } else {
                _formData.skip_email = $('[name=skip_email]').prop('checked') == true ? 1 : 0;
            }

            $.ajax({
                url: _link,
                type: 'POST',
                data: _formData,
                dataType: 'json',
                statusCode: {
                    500: function (res) {
                        messageForm('Oooops, Something went wrong!<br>We are working hard to correct this issue', false, '#warranty_form #message_form');
                    },
                    404: function (res) {
                        messageForm('The action is not found!<br>Please create a ticket if you have this issue', false, '#warranty_form #message_form');
                    }
                },
                success: function (res) {
                    if (res["SAVE"] == 'FAIL') {
                        messageForm('Error! An error occurred. ' + res['ERROR'], false, '#warranty_form #message_form')
                        return
                    } else if (res["SAVE"] == 'SUCCESS') {
                        if (res.ID) {
                            _formData.ID = res.ID
                            $('#warranty_form [name=ID]').val(res.ID);
                        }
                        if (_link == link._warrantyAddNewNotLogin) {
                            if (document.location.href.indexOf('warranty') > 0) {
                                if (!window.payment_submit_form) {
                                    responseSuccessForward('You have successfully added anew warranty.', true, '#warranty_form #message_form', './#ajax/warranty-form.php?id=' + _formData.ID, 'Go to edit warranty');
                                }
                            } else {
                                messageForm('You have successfully added the new warranty', true, '#warranty_form #message_form');
                            }
                            if (window.payment_submit_form && $('#fs_payment_method [name=warranty_payer_typement_type]:checked').val() == 'Credit') {
                                new WarrantyPayment().sendPay();
                            } else if (window.payment_submit_form) {
                                responseSuccessForward('You have successfully added anew warranty.', true, '#warranty_form #message_form', './#ajax/warranty-form.php?id=' + _formData.ID, 'Go to edit warranty')
                            }
                            delete window.payment_submit_form;
                        } else {
                            if (!res.ID && getUrlParameter('id')) {
                                messageForm('You have successfully edited the warranty', true, '#warranty_form #message_form')
                            } else {
                                responseSuccessForward('You have successfully save the warranty.', true, '#warranty_form #message_form', './#ajax/warranty-form.php?id=' + _formData.ID, 'Go to edit warranty');
                            }
                            return
                        }
                    }
                }
            })
        }
    },

    getAddress: function (contactID, address, callback) {
        var _self = this;
        if ($('#contact_address').prop('checked') == false) {
            _self.unfillAddress(callback);
            return;
        }
        if (address) {
            _self.fillValueAddress(address, callback);
        } else if (contactID) {
            $.ajax({
                url: link._contactAddress_id,
                type: 'post',
                dataType: 'json',
                data: { token: localStorage.getItemValue('token'), contactID: contactID },
                success: function (res) {
                    var data = {
                        warranty_address1: res.primary_street_address1,
                        warranty_address2: res.primary_street_address2,
                        warranty_city: res.primary_city,
                        warranty_state: res.primary_state,
                        warranty_postal_code: res.primary_postal_code
                    }
                    _self.fillValueAddress(data, callback);
                }
            });
        } else {
            _self.unfillAddress(callback);
        }
    },

    fillValueAddress: function (data, callback) {
        if (data) {
            Warranty.prototype.salesman_select = data.warranty_salesman_id;
            $('#warranty_form [name=warranty_address1]').val(data.warranty_address1);
            $('#warranty_form [name=warranty_address2]').val(data.warranty_address2);
            warrantyState.setValue2('#warranty_form', data.warranty_city, data.warranty_state, data.warranty_postal_code, function () {
                _selectLoader.loadSalesmanListState('warranty_salesman_id', 'SID', data.warranty_state, data.warranty_salesman_id, callback);
            });
            // if (callback) callback();
        }
    },
    unfillAddress: function (callback) {
        $('#warranty_form [name=warranty_address1]').val('');
        $('#warranty_form [name=warranty_address2]').val('');
        $('#warranty_form [name=warranty_postal_code]').val('').trigger('change');
        $('#warranty_form [name=warranty_state]').val('').trigger('change');
        $('#warranty_form [name=warranty_city]').val('').trigger('change');
        _selectLoader.loadSalesmanListState('warranty_salesman_id', 'SID', 'ALL', null, callback);
        // if (callback) callback();
    },

    createRowTable: function (order) {
        if (order != undefined && order.order != undefined) {
            if (order.order[0] && order.order[0].order_id && order.products && order.products.length > 0) {
                var _ProductTable = new ProductTable(order.order[0].order_id, order.products, null);
                console.log(order.order[0]);

                let paid = '';
                if (order.order[0].balance <= 0) {
                    paid = ' <span class="text-success bold"> [Paid]</span>'
                }

                if (!($("#tb_product_show tbody tr").is("#tr_order_" + order.order[0].order_id))) {
                    $('#tb_product_show tbody').append(_ProductTable.createTableProduct(['Warranty', 'A La Carte'], order.order[0].order_title + paid, order.order[0].grand_total));
                }
                var __total = parseFloat($('input[name="total"]').val()) + _ProductTable.total;
                $('input[name="total"]').val(__total);

                $('#warranty_order_id').closest('.col').children('p').empty();
                return;
            } else {
                Warranty.prototype.keepTableFromOrderID();
                $('#warranty_order_id').closest('.col').children('p').html('<p class="error">Cannot find this order<p>')
            }
        } else {
            Warranty.prototype.keepTableFromOrderID();
            $('#warranty_order_id').closest('.col').children('p').html('<p class="error">Cannot find this order<p>')
        }
    },

    createSerialNumber: function () {
        var _date = new Date();
        return _date.toISOString().split('.')[0].replace(/[T:-]/g, '');
    },

    checkHasWarranty: function () {
        var result = [];
        var offset = $('#tb_product_show thead tr').find('th').length - $('#tb_product_show thead th:contains(SKU)').index() + 1;
        $('#tb_product_show tbody tr').each(function () {
            var $tds = $(this);
            var id = $tds.find('.prod_id').text();
            var prodClass = $tds.find('td.prod_class').text();
            if (id != '' && id != 'Select product' && (prodClass == 'Warranty')) {
                result.push(id);
            }
        });
        if (result.length > 0) {
            $('[class="select2-results__option"][role="group"][aria-label="Has Warranty"] .select2-results__option[aria-selected="false"]').addClass('hidden');
        } else {
            $('[class="select2-results__option"][role="group"][aria-label="Has Warranty"] .select2-results__option[aria-selected="false"]').removeClass('hidden');
        }
    },
}

if (document.location.href.indexOf('warranty') > 0) {
    var _warranty = new Warranty();
    _warranty.init(function () {
        if (getUrlParameter('id') && getUrlParameter('id') != '0' && document.location.href.indexOf('warranty') >= 0) {
            _warranty.initUpdate(getUrlParameter('id'));
        }
        if (getUrlParameter('orderid') && document.location.href.indexOf('warranty') >= 0) {
            _warranty.initForwardFromOrder(getUrlParameter('orderid'));
        }
    });
}