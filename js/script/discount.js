function Discount(option) {
    if (!option) option = { form: '#discount_form' };
    this.option = option;
}

var listProduct = [];
var listProductWarranty = [];
var apply_product = [];
var apply_addon = [];
Discount.prototype = {
    constructor: Discount,
    init: function () {
        this.setView();
        this.loadListProduct();
        this.bindEvent();
        var $self = this;
        removeProduct = function (index) {
            var type = $('[name=apply_to]:checked').val();
            if (type == '2' && apply_product.length - 1 >= parseInt(index)) {

                let dataRemove = apply_product.splice(index, 1);
                $('[data-pid="' + dataRemove[0].ID + '"]').removeClass('active');
                $self.createTabListProduct(apply_product);
            } else if (type == '3' && apply_addon.length - 1 >= parseInt(index)) {
                let dataRemove = apply_addon.splice(index, 1);
                $('[data-pid="' + dataRemove[0].ID + '"]').removeClass('active');
                $self.createTabListProduct(apply_addon);
            }
        }
    },

    setView: function () {

        var $self = this;
        var width = $($self.option.form + ' input[name=discount_name]').width() - $($self.option.form + ' #discount_type').width() - 25;
        $($self.option.form + ' #discount_number').css({ 'width': width });

        $('input[name="start_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="stop_date"]').datepicker('option', 'minDate', selectedDate);
            },
            onChange: function (selectedDate) {
                $('input[name="stop_date"]').datepicker('option', 'minDate', new Date(selectedDate));
            }
        });

        $('input[name="stop_date"]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            onSelect: function (selectedDate) {
                $('input[name="start_date"]').datepicker('option', 'maxDate', selectedDate);
            },
            onChange: function (selectedDate) {
                $('input[name="start_date"]').datepicker('option', 'maxDate', new Date(selectedDate));
            }
        });

    },
    bindEvent: function () {
        var $self = this;
        $(window).bind('resize', function () {
            var width = $($self.option.form + ' input[name=discount_name]').width() - $($self.option.form + ' #discount_type').width() - 25;
            $($self.option.form + ' #discount_number').css({ 'width': width });
        }).trigger('resize');

        $('[name=apply_to]').change(function () {
            $self.apply_expand(this);
        });

        $($self.option.form).validate($self.validateDiscountOptions);
        $('#btnSubmitDiscount').click(function () {
            $($self.option.form).submit();
        })
    },

    validateDiscountOptions: {
        ignore: [],
        rules: {
            discount_name: { required: true },
            apply_to: { required: true },
            start_date: {},
            stop_date: {
                required: function (e) { return $('[name=nerver_expired]').prop('checked') == false }
            },
            // discount_number: {
            //     min: 0,
            //     max: function() {
            //         var type = $('#discount_type').val();
            //         if (type == '%') return 100;
            //         else return Number.MAX_VALUE;
            //     }
            // }
        },
        submitHandler: function (e) {
            Discount.prototype.submitForm();
        }
    },

    loadDiscountType: function (arr, value) {
        var select = $('#discount_type');
        var options = select.prop('options');
        $('option', select).remove();
        arr.forEach(function (element) {
            options[options.length] = new Option(element, element);;
        });
        if (value) {
            $('#discount_type').val(value);
        }
    },

    apply_expand: function (elem, status, value) {
        if (!status) status = $(elem).prop('checked');
        var $self = this;
        var type = $(elem).val();
        var _html = '';

        if (type == '1') {
            if (!value) value = '$';
            _html = '<div class="inline-group">';
            _html +=
                '<label class="input">Discount type</label>' +
                '<label class="radio"><input type="radio" name="apply_to_1" value="$"' + (value == '$' ? ' checked' : '') + '><i></i>$</label>' +
                '<label class="radio "><input type="radio" name="apply_to_1" value="%"' + (value == '%' ? ' checked' : '') + '><i></i>%</label>';
            _html += '</div>';
            $('#pane_apply_expand').html(_html);
            $('#product_info').empty();
            $self.loadDiscountType([value]);

            $('[name=apply_to_1]').change(function () {
                $self.loadDiscountType([this.value]);
            });
        } else if (type == '2' || type == '3') {
            _html = '<div>';
            _html += '<input class="typeahead form-control" id="apply_to_product" placeholder="Select Product">';
            _html += '<input type="hidden" id="apply_to_product_value">';
            _html += '<input type="hidden" id="apply_to_product_id">';
            _html += '</div>';

            $('#pane_apply_expand').html(_html);
            var setList = [],
                listData = [];
            if (type == '2') {
                $self.createTabListProduct(apply_product);
                setList = apply_product;
                listData = listProductWarranty;
            } else if (type == '3') {
                $self.createTabListProduct(apply_addon)
                setList = apply_addon;
                listData = listProduct;
            }

            
            $self.loadDiscountType(['$', '%']);
            
            $('#apply_to_product').typeahead({
                hint: false,
                highlight: true,
                minLength: 0,
            }, {
                display: 'prod_name',
                displayKey: 'prod_name',
                limit: Infinity,
                templates: {
                    empty: '<div>Not found Product</div>',
                    pending: '<div>Loading...</div>',
                    suggestion: function (data) {
                        let selectedProduct = setList.map(function(t){return t.ID});
                        if (!data.ID) { return '<div></div>'; }
                        return '<div data-pid="' + data.ID + '"'+(selectedProduct.includes(data.ID) ? ' class="active"': '')+'>' +
                            '<div class="media">' +
                            '<div class="media-left">' +
                            '<img src="' + (data.prod_photo && data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object img img-responsive img-thumbnail" style="width:40px">' +
                            '</div>' +
                            '<div class="media-body">' +
                            '<h4 class="media-heading username">' + data.prod_name + '<small class="pull-right">(' + data.SKU + ')</small></h4>' +
                            '<p' + (data.prod_desc && data.prod_desc.length >= 50 ? ' title="' + data.prod_desc + '"' : '') + '>' +
                            (data.prod_desc ? (data.prod_desc && data.prod_desc.length < 50 ? data.prod_desc : data.prod_desc.substring(0, 48) + '...') : '') +
                            '<small class="pull-right">' + data.prod_class + '</small>' +
                            '</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }
                },
                source: function (query, callback) {
                    callback(listData.filter(function (item) { return item.prod_name.toLowerCase().indexOf(query.toLowerCase()) >= 0 || item.SKU.toLowerCase().indexOf(query.toLowerCase()) >= 0 || item.prod_class.toLowerCase().indexOf(query.toLowerCase()) >= 0 }));
                },
            }).bind("typeahead:selected", function (obj, data) {
                if (type == '2') {
                    if (!apply_product.includes(data))
                        apply_product.push(data);
                    $self.createTabListProduct(apply_product, data)
                } else if (type == '3') {
                    if (!apply_addon.includes(data))
                        apply_addon.push(data);
                    $self.createTabListProduct(apply_addon, data)
                }
                $('[data-pid="' + data.ID + '"]').addClass('active');
                $(this).typeahead('val', '');
                $(this).typeahead('close');
                $(this).focusout();

            });
        }
    },

    createTabListProduct: function (listProduct, newProduct) {
        if (!listProduct || listProduct.length == 0) {
            $('#product_info').empty();
            return;
        }
        var _html = [];
        var _content = [];
        _html.push('<div class="tabbable">');
        _html.push('<ul class="nav nav-tabs bordered">');
        listProduct.forEach(function (product, index) {
            var li = '<li>';
            var tabpane_active = '';
            if ((newProduct && newProduct.SKU == product.SKU) || (!newProduct && index == 0)) {
                li = '<li class="active">';
                tabpane_active = ' active'
            }
            _html.push(li + '<a href="#_product' + product.SKU + '" data-toggle="tab" rel="tooltip" data-placement="top">' + product.prod_name + ' <i class="fa fa-times pull-right" onclick="removeProduct(' + index + ')"></i></a></li>');
            _content.push(
                '<div class="tab-pane' + tabpane_active + '" id="_product' + product.SKU + '">' +
                '<div class="row">' +
                '<div class="col col-md-3 col-sm-4">' +
                '<img src="' + (product.prod_photo && product.prod_photo ? host + product.prod_photo : urlPhoto.itemProduct) + '" style="width:100%;">' +
                '</div>' +
                '<div class="col col-md-9 col-sm-8">' +
                '<h2 class="name bold text-primary">' + product.prod_name + '</h2>' +
                '<div>SKU: ' + product.SKU + '</div>' +
                '<div>Class: ' + product.prod_class + '</div>' +
                '<div class="price-container" style="padding-top:5px">' +
                '<b style="background:orange; padding:5px; border-radius:4px;">Price: <font color="red">' + numeral(product.prod_price).format('$ 0,0.00') + '</font></b>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
        });
        _html.push('</ul>');
        _html.push('<div class="tab-content padding-10">');
        _html.push(_content.join(''));
        _html.push('</div>'); //tab-content
        _html.push('</div>'); //tabbable
        $('#product_info').html(_html.join(''));
    },

    loadListProduct: function (callback) {
        $.ajax({
            // url: link._productFilterList,
            // url: link._productClssWarrAlacate,
            url: link._productClssALaCarte,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json',
            success: function (res) {
                listProduct = res.list;
                if (callback)
                    callback(listProduct);
            }
        });

        $.ajax({
            url: link._productClssWarranty,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json',
            success: function (res) {
                listProductWarranty = res.list;
            }
        });
    },
    getApplyTo: function () {
        var result = {};
        var type = $(this.option.form + ' [name=apply_to]:checked').val();

        result.type = type;
        result.value = {
            discount_type: $(this.option.form + ' #discount_type').val() || '$',
            discount: numeral($(this.option.form + ' #discount_number').val()).value()
        }
        if (result.value.discount_type == '%' && result.value.discount > 100) result.value.discount = 100;
        if (result.value.discount < 0) result.value.discount = 0;

        if (type == '1') {
            //
        } else if (type == '2') {
            result.products = apply_product;
        } else if (type == '3') {
            result.products = apply_addon;
        }
        return JSON.stringify(result);
    },
    getDiscountValue: function () {
        return {
            discount_type: $(this.option.form + ' #discount_type').val(),
            discount: $(this.option.form + ' #discount_number').val()
        }
    },

    submitForm: function () {
        var _formData = $.extend({}, template_data);
        if (!this.option) this.option = { form: '#discount_form' };

        _formData.discount_name = $(this.option.form + ' [name="discount_name"]').val();

        _formData.apply_to = this.getApplyTo();

        _formData.start_date = $(this.option.form + ' [name="start_date"]').val() || new Date().toISOString().split('T')[0];
        _formData.stop_date = $(this.option.form + ' [name="stop_date"]').val();

        _formData.excludesive_offer = $(this.option.form + ' [name="excludesive_offer"]').prop('checked') ? 1 : 0;
        _formData.nerver_expired = $(this.option.form + ' [name="nerver_expired"]').prop('checked') ? 1 : 0;
        _formData.active = $(this.option.form + ' [name="active"]').prop('checked') ? 1 : 0;

        _formData.id = $(this.option.form + ' [name="id"]').val();
        var _link = link._discountAddNew
        if (_formData.id && _formData.id != '') {
            _link = link._discountUpdate;
            _formData.discount_code = $(this.option.form + ' [name="discount_code"]').val();
        } else {
            delete _formData.id;
        }
        $.ajax({
            url: _link,
            type: 'post',
            dataType: 'json',
            data: _formData,
            success: function (res) {
                if (res.ERROR == '') {
                    if (_link == link._discountAddNew) {
                        let _href = document.location.href.indexOf('?') >= 0 ? document.location.href + "&id=" + res.ID : document.location.href + "?id=" + res.ID;
                        responseSuccessForward('You have successfully added new discount', true, null, _href, 'Go to edit discount');
                    } else {
                        messageForm('You have successfully edited the discount', true);
                    }
                }
            },
        })
    }
}

var _discount = new Discount();
_discount.init();