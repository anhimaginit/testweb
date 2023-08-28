function OrderDiscount() { }
var discountItem = null;
OrderDiscount.prototype = {
    constructor: OrderDiscount,
    init: function () {
        this.bindEvent();
        // if(document.location.href.indexOf('order-form')>0){
        // this.loadDiscountList();
        // }
    },
    bindEvent: function () {
        var _self = this;
        $('[name=discount_code]').change(function () {
            $('.box-border').css({
                'background-color': 'white'
            });

            if (this.value == '') {
                discountItem = null;
                $('#discount_code-error').remove();
                $('#discount_code-info').remove();
                $('#_discount_code').text(numeral(0).format('$ 0,0.00'));
                _orderProducts.getTotalPrice();
                return;
            }
            _self.searchDiscount(this.value, function (data) {
                if (data.item && data.item.id) {
                    discountItem = data.item;
                    $('#discount_code-error').remove();
                    _orderProducts.getTotalPrice();
                    // var discount = _self.getPriceToDiscount();

                    _self.displayDiscount(data.item);
                    $('#_card_' + discountItem.discount_code).css({
                        'background-color': '#ffd460'
                    });
                } else {
                    discountItem = null;
                    $('[name=discount_code]').after('<label class="error" id="discount_code-error">Cannot find discount code</label>');
                    $('#discount_code-info').remove();
                    _orderProducts.getTotalPrice();
                }
            });
        });
    },
    searchDiscount: function (discount, callback) {
        var _self = this;
        var data = $.extend({}, template_data);
        data.discount_code = discount;
        data.discount_name = discount;
        $.ajax({
            // url: link._discountGetByDiscountCode,
            url : link._discountGetByDiscountCodeByName,
            
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (res) {
                if (callback) {
                    callback(res);
                } else {
                    if (res.item && res.item.id) {
                        discountItem = res.item;
                        $('#discount_code-error').remove();
                        // var discount = _self.getPriceToDiscount();

                        _self.displayDiscount();
                        _orderProducts.getTotalPrice();
                        $('#_card_' + discountItem.discount_code).css({
                            'background-color': '#ffd460'
                        });
                    } else {
                        discountItem = null;
                        $('[name=discount_code]').after('<label class="error" id="discount_code-error">Cannot find discount code</label>');
                        $('#discount_code-info').remove();
                        _orderProducts.getTotalPrice();
                    }
                }
            },
        })
    },

    loadDiscountList: function () {
        $.ajax({
            url: link._discountListAct,
            type: 'post',
            dataType: 'json',
            data: { token: localStorage.getItemValue('token') },
            success: function (res) {
                var _html = '<h4>Discount Card</h4>';
                res.list.forEach(function (discount) {
                    _html += '<section class="col col-md-3 col-sm-4 col-xs-12">';
                    _html += '<div class="box-border padding-10" id="_card_' + discount.discount_code + '" title="Apply" onclick="jQuery(\'[name=discount_code]\').val(\'' + discount.discount_code + '\').change();">';
                    _html += '<label class="pull-right"><i class="fa fa-2x fa-location-arrow text-success"></i></label>';
                    _html += '<h3 class="name discount-name"' + (discount.discount_name.length > 45 ? ' title="' + discount.discount_name + '"' : '') + '>' + (discount.discount_name.length > 50 ? discount.discount_name.substring(0, 45) + '...' : discount.discount_name) + '</h3>';
                    _html += '<p class="discount-value">Value: ' + (discount.apply_to.value.discount_type == '%' ? discount.apply_to.value.discount + '%' :
                        numeral(discount.apply_to.value.discount).format('$ 0,0.00') + '/product') + '</p>';
                    _html += '<p class="discount-code">Code: ' + discount.discount_code + '</p>'
                    _html += '</div>';
                    _html += '</section>';
                });
                $('#discount_pane').html(_html);
                return _html;
            },
        })
    },

    displayDiscount: function (discount, callback) {
        if (discount) discountItem = discount;
        var _html = '';
        if (discountItem) {

            var value = discountItem.apply_to.value.discount_type == '%' ? discountItem.apply_to.value.discount + '%' :
                numeral(discountItem.apply_to.value.discount).format('$ 0,0.00') + '/product';
            _html += '<section id="discount_code-info" class="col col-md-12 col-sm-12 col-xs-12 box-border padding-10 discount_' + discountItem.discount_code + '">';
            _html += '<h3 class="name"><i class="fa fa-list-alt"></i> Discount information</h3>';
            _html += '<div>Discount Name: ' + discountItem.discount_name + '</div>';
            _html += '<div>Expired: ' + (discountItem.nerver_expired == '1' ? 'Unlimit' : discountItem.stop_date) + '</div>';
            _html += '<div class="discount_code">Discount Code: ' + discountItem.discount_code + '</div>';
            _html += '<div class="discount_value">Discount Value: ' + value + '</div>';
            if (discountItem.apply_to.type == '2' || discountItem.apply_to.type == '3') {
                _html += '<div>Apply to product:</div>';
                _html += '<table class="table table-discount" style="width:100%">';
                _html += '<thead>';
                _html += '<tr>';
                _html += '<td>Product</td>';
                _html += '<td>Product Name</td>';
                _html += '<td>SKU</td>';
                _html += '<td>Product Class</td>';
                _html += '<td class="text-right">Price</td>';
                _html += '</tr>';
                _html += '</thead>';
                _html += '<tbody>';
                discountItem.apply_to.products.forEach(function (prod) {
                    var hasProduct = '';
                    if ($('#table_product_ordered tbody').find('input._itemSKU_' + prod.SKU).length > 0) {
                        hasProduct = ' class="success" title="The product into order"';
                    }

                    _html += '<tr' + hasProduct + '>';
                    _html += '<td>' + prod.ID + '</td>';
                    _html += '<td>' + prod.prod_name + '</td>';
                    _html += '<td>' + prod.SKU + '</td>';
                    _html += '<td>' + prod.prod_class + '</td>';
                    _html += '<td class="text-right">' + numeral(prod.prod_price).format('$ 0,0.00') + '</td>';
                    _html += '</tr>';
                });
                _html += '</tbody>';
                _html += '</table>';
            }
            _html += '</section>';
        }
        if (document.location.href.indexOf('order-form') > 0) {
            $('#discount_code-info').remove();
            $('[name=discount_code]').closest('section').after(_html);
        }
        if (callback) callback(_html);
    },
    getDiscountValue: function () {
        if (!discountItem) return 0.00;
        return numeral($('#_discount_code').text()).value();
    },
    getPriceToDiscount: function (price) {
        if (!discountItem) {
            $('#_discount_code').text(numeral(0).format('$ 0,0.00'));
            return 0.00;
        }
        if(!price) price = numeral($('#_total_table').text()).value();
        var currentDay = new Date();
        currentDay.setUTCHours(0, 0, 0, 0);
        var stopDate = new Date(discountItem.stop_date);
        stopDate.setUTCHours(0, 0, 0, 0);
        var type = discountItem.apply_to.type,
            discount_value = discountItem.apply_to.value.discount,
            discount_type = discountItem.apply_to.value.discount_type,
            products = discountItem.apply_to.products,
            isValid = discountItem.nerver_expired == '1' || discountItem.nerver_expired == 1 || stopDate.getTime() > currentDay.getTime();

        var table = '#table_product_ordered';
        var prods = [],
            quantities = {};

        $(table + ' tbody').find('tr').each(function (row, elem) {
            var $tds = $(elem).find('td');
            var id = $tds.eq(0).find('input').val();
            if (!id) id = $tds.eq(0).text();
            if (id && id != '') {
                prods.push(id);
                var quantity = $tds.find('input.quantity').val();
                if (!quantity) quantity = $tds.eq(1).text()
                if (quantity && quantity != '') quantity = parseInt(quantity);
                else quantity = 1;
                quantities[id] = quantity
            }
        });

        var result = 0.00;
        if (isValid) {
            if (type == '1') {
                if (discount_type == '%') {
                    result = price * parseFloat(discount_value) / 100;
                } else if (discount_type == '$') {
                    result = parseFloat(discount_value);
                }
            } else if (type == '2' || type == '3') {
                products.forEach(function (prod) {
                    if (prods.includes(prod.ID)) {
                        if (discount_type == '%') {
                            result += parseFloat(prod.prod_price) * parseFloat(discount_value) / 100 * quantities[prod.ID];
                        } else if (discount_type == '$') {
                            if (parseFloat(discount_value) > parseFloat(prod.prod_price))
                                discount_value = prod.prod_price;
                            result += parseFloat(discount_value) * quantities[prod.ID];
                        }
                    }
                });
            }
        }
        $('#_discount_code').text(numeral(result).format('$ 0,0.00'));
        return result;
    }
}