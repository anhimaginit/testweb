function OrderProducts() { }
OrderProducts.prototype.constructor = OrderProducts;
var productBySKU = [];
var productByName = [];
var hasWarranty = false;
var hasWarrantyIndex = -1;
var productSelected = {};
var productSelectArray = [];

OrderProducts.prototype = {
    init: function () {
        table = $('#table_product_ordered');
        //   this.bindEvent();
        this.loadProductData(this.bindEvent);
        setProductData = this.setProductData;
    },
    loadProductData: function (callback) {
        var dataSKU = $.extend({}, template_data);
        dataSKU.SKU = '';
        $.ajax({
            url: link._productsForOrder,
            type: 'post',
            data: dataSKU,
            dataType: 'json',
            success: function (res) {
                productBySKU = res;
                productBySKU.sort(function (a, b) {
                    return a.SKU.toLowerCase().localeCompare(b.SKU.toLowerCase())
                });
                productByName = res;
                productByName.sort(function (a, b) {
                    return a.prod_name.toLowerCase().localeCompare(b.prod_name.toLowerCase())
                });
            }
        });
        if (callback) callback();
    },
    bindEvent: function () {

        var _self = this;

        $('#init_fee, #processing_fee, #period').bind('change', function () {
            _orderProducts.getTotalPrice();
        });

        $(document).on('change', '.discount_type', function () {
            if (this.value == '%') {
                $(this).closest('tr').find('.discount').removeClass('input-currency');
                $(this).closest('tr').find('.discount').val(numeral($(this).closest('tr').find('.discount').val()).value());
            } else {
                $(this).closest('tr').find('.discount').addClass('input-currency');
                $(this).closest('tr').find('.discount').val(numeral($(this).closest('tr').find('.discount').val()).format('$ 0,0.00'));
            }
        })

        $('.btnRemoveProduct').click(function () {
            var row = $(this).closest('tr');
            var length = $('#table_product_ordered tbody').find('tr').length;
            var index = row.index();
            if (index >= 0 && index < productSelectArray.length && productSelectArray[index].sku && index < length - 1) {
                delete productSelected[productSelectArray[index].sku];
                if (productSelectArray[index].prod_class == 'Warranty') {
                    hasWarranty = false;
                    hasWarrantyIndex = -1;
                }
                productSelectArray.splice(index, 1);
                row.remove();
                _self.getTotalPrice();
            }
        })

        $('input.quantity, input.discount, .discount_type, input.price').bind('change', function () {
            var index = $(this).closest('tr').index();
            var discount = $(this).closest('tr').find('input.discount');
            var value = $(this).closest('tr').find('select.discount_type').val();
            if (value == '%') {
                discount.attr({ max: 100, min: 0 });
                if (discount.val() != '' && 100 < numeral(discount.val()).value()) {
                    discount.after('<label class="error discount-tooltip">Please enter discount equal or less than 100</label>');
                    setTimeout(function () {
                        $('.discount-tooltip').remove();
                        discount.val(100);
                    }, 2000);
                }
            } else if (value == '$') {
                var price = numeral($(this).closest('tr').find('input.price').val()).value();
                if (discount.val() != '' && price < numeral(discount.val()).value()) {
                    discount.after('<label class="error discount-tooltip">Please enter discount value equal or less than price</label>');
                    setTimeout(function () {
                        $('.discount-tooltip').remove();
                        discount.val(price);
                    }, 2000);
                }
                discount.attr({ max: price, min: 0 });
            }
            $(this).closest('tr').find('input.line').val(numeral(_orderProducts.getTotalLine(null, index)).format('$ 0,0.00'));
            _orderProducts.getTotalPrice();
        });

        $('.SKU_search').typeahead({
            hint: false,
            highlight: true,
            minLength: 0,

        }, {
            name: 'SKU_searchs',
            display: 'SKU',
            limit: Infinity,
            templates: {
                empty: '<div>Not found SKU</div>',
                pending: '<div>Loading...</div>',
                suggestion: function (data) {
                    var style = '';
                    if (productSelected[data.SKU]) style = ' style="background:#3276b1; color: black;"';
                    var _html =
                        '<div class="media product_' + data.prod_id + '"' + style + '>' +
                        '<div class="media-left">' +
                        '<img src="' + (data.prod_photo && data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object img img-responsive img-thumbnail" style="width:40px">' +
                        '</div>' +
                        '<div class="media-body">' +
                        '<div class="media-heading username">SKU: ' + data.SKU + '<small class="pull-right">' + data.prod_class + '</small></div>' +
                        '<p>' + numeral(data.prod_price).format('$ 0,0.00') + '</p>' +
                        '</div>' +
                        '</div>';

                    return _html;
                }
            },
            source: function (query, callback) {
                // if (hasWarranty) {
                //     callback(productBySKU.filter(function (data) {
                //         return data.SKU.toLowerCase().includes(query.toLowerCase()) && data.prod_class != 'Warranty';
                //     }));
                // } else {

                callback(productBySKU.filter(function (data) {
                    return data.SKU.toLowerCase().includes(query.toLowerCase());
                }));
                // }
            },
        }).bind("typeahead:selected", function (obj, data) {
            setProductData(this, data);
                //close type head
                $('.tt-open').css({"display":"none"})
                $('.tt-open').removeClass("tt-open")

        });

        $('.product_search').typeahead({
            hint: false,
            highlight: true,
            minLength: 0,

        }, {
            name: 'product_searchs',
            display: 'prod_name',
            limit: Infinity,
            templates: {
                empty: '<div>Not found product</div>',
                pending: '<div>Loading...</div>',
                suggestion: function (data) {
                    var style = '';
                    if (productSelected[data.SKU]) style = ' style="background:#3276b1; color: black;"';
                    var _html =
                        '<div class="media"' + style + '>' +
                        '<div class="media-left">' +
                        '<img src="' + (data.prod_photo && data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object img img-responsive img-thumbnail" style="width:40px">' +
                        '</div>' +
                        '<div class="media-body">' +
                        '<div class="media-heading username">' + data.prod_name + '<small class="pull-right">' + data.prod_class + '</small></div>' +
                        '<p>' + numeral(data.prod_price).format('$ 0,0.00') + '</p>' +
                        '</div>' +
                        '</div>';

                    return _html;
                    //   return '<div>
                    // <span>' + elem.prod_name + '</span> [<span>' + elem.SKU + '</span>]<span class="pull-right">' + elem.prod_class + '</span></div>'
                }
            },
            source: function (query, callback) {
                // if (hasWarranty) {
                //     callback(productByName.filter(function (data) {
                //         return data.prod_name.toLowerCase().includes(query.toLowerCase()) && data.prod_class != 'Warranty';
                //     }));
                // } else {
                callback(productByName.filter(function (data) {
                    return data.prod_name.toLowerCase().includes(query.toLowerCase());
                }));
                // }
            },
        }).bind("typeahead:selected", function (obj, data) {
            setProductData(this, data);
        });
    },
    setProductData: function (elem, data) {
        if (!elem || !data) {
            return;
        } else {
            var index = $(elem).closest('tr').index();
            if (productSelectArray[index] && data.sku == productSelectArray[index].sku) return;

            if (typeof data != 'undefined' && typeof data == 'string')
                data = JSON.parse(data);
            //default value
            if (!data.quantity) data.quantity = 1;
            if (!data.discount) data.discount = 0;
            if (!data.price && data.prod_price) data.price = data.prod_price;
            if (!data.sku && data.SKU) data.sku = data.SKU;
            if (!data.name && data.prod_name) data.name = data.prod_name;
            if (_orderProducts.checkSKU(data.sku)) {
                $('#table_product_ordered tbody').find('td._itemSKU_' + data.sku).closest('tr').addClass('danger')
                setTimeout(function () {
                    $('#table_product_ordered tbody').find('td._itemSKU_' + data.sku).closest('tr').removeClass('danger').fadeIn(200)
                }, 1000);
                $(elem).typeahead('val', '');
                return;
            }
            if (data.prod_class == 'Warranty') {
                // check if haswarrantyIndex different from another product
                if (_orderProducts.checkHasWarranty(index)) {
                    messageForm('The order has only a warranty product', 'warning', $('#table_product_ordered').parent().find('.message_table:first'));
                    $(elem).typeahead('val', '');
                    return;
                } else {
                    //setting order has warranty
                    hasWarranty = true;
                    hasWarrantyIndex = index;
                }
            }
            var tds = $(elem).closest('tr').find('td');//anh
            if (index < productSelectArray.length) {
                tds.find('._itemSKU_' + productSelectArray[index].sku).removeClass('._itemSKU_' + productSelectArray[index].sku);
                delete productSelected[productSelectArray[index].sku];
                productSelectArray.splice(index, 1, data);
            } else {
                productSelectArray.push(data);
            }

            productSelected[data.sku] = data;

            if (index + 1 == $('#table_product_ordered tbody').children().length) {
                _orderProducts.createInputFields();
            }

            //var tds = $(elem).closest('tr').find('td'); //anh
            var id = data.id ? data.id : data.ID;
            tds.eq(0).find('input').val(id);
            if (data.prod_class == 'Warranty' && data.quantity > 1) {
                messageForm('The Warranty class products can be only one in an order', 'warning', $('#tb_product_show').parent().find('.message_table:first'));
                tds.find('input.quantity').val('1');
            } else {
                tds.find('input.quantity').val(data.quantity);
            }
            if (data.prod_class == 'Discount') {
                tds.find('input.discount').prop('readonly', true);
                tds.find('.discount_type').prop('readonly', true);
            }
            tds.find('.SKU_search').val(data.sku);
            tds.find('.SKU_search').addClass('_itemSKU_' + data.sku);
            tds.find('.product_search').val(data.name);
            tds.find('.prod_class').val(data.prod_class);
            tds.find('.price').val(numeral(data.price).format('$ 0,0.00'));
            tds.find('.discount').val(data.discount).focusout();
            if (!data.quantity) data.quantity = tds.find('input.quantity').val() != '' ? tds.find('input.quantity').val() : 1;
            if (!data.discount_type) data.discount_type = tds.find('select.discount_type').val() != '' ? tds.find('select.discount_type').val() : '%';
            if (data.prod_class == 'Discount') {
                tds.find('input.line').val('$ 0.00');
            } else {
                tds.find('input.line').val(numeral(_orderProducts.getTotalLine(data, index)).format('$ 0,0.00'));
            }

            setTimeout(function(){
               // focus last line
                tds.closest('tbody').find('tr:last-child').find('.quantity').focus();
                tds.find('.SKU_search').val(data.sku);
                tds.find('.product_search').val(data.name);

            },10)
            _orderProducts.getTotalPrice();
            orderDiscount.displayDiscount();
        }
    },

    getTotalLine: function (data, row) {
        if (!data && row != undefined && row > -1) {
            data = {};
            data.quantity = $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(1)').find('input').val();
            data.prod_class = $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(4)').find('input').val();
            data.price = $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(5)').find('input').val();
            data.discount = $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(6)').find('input').val();
            data.discount_type = $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(7)').find('select').val();
        }
        if (data) {
            if (data.prod_class == 'Warranty' && data.quantity > 1) {
                if (row != undefined && row > -1) {
                    messageForm('Warranty products can be only one in an order', 'warning', $('#tb_product_show').parent().find('.message_table:first'));
                    $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(1) input').val(1);
                    data.quantity = 1;
                }
            }
            var quantity = numeral(data.quantity ? data.quantity : 1).value();
            var price = numeral(data.price).value();
            var discount = numeral(data.discount).value();
            var discount_type = data.discount_type;

            if (discount_type == '%') {
                return quantity * (price - price * discount / 100);
            } else {
                return (price - discount) * quantity;
            }

        } else {
            return 0.00;
        }
    },

    getDiscount: function () {
        table = '#table_product_ordered';
        var result = 0.00;
        $(table + ' tbody').find('tr').each(function (row, elem) {
            var $tds = $(this).find('td'),
                _class = $tds.find('.prod_class').val(),
                quantity = numeral($tds.find('input.quantity').val()).value(),
                price = numeral($tds.find('.price').val()).value(),
                discount = numeral($tds.find('input.discount').val()).value(),
                discount_type = $tds.find('select.discount_type').val();
            if (_class == 'Discount') {
                result -= price * quantity;
            } else {
                result += price * quantity - opTotalLine(price, quantity, discount, discount_type);
            }
        });
        return result;
    },

    opTotalLine: function (price, quantity, discount, discount_type) {
        price = numeral(price).value();
        quantity = numeral(quantity).value();
        discount = numeral(discount).value();
        if (discount_type == '%') {
            return quantity * (price - price * discount / 100);
        } else {
            return (price - discount) * quantity;
        }
    },


    getTotalPrice: function (old_total = 0) {
        table = '#table_product_ordered';
        var result = 0.00;
        $(table + ' tbody').find('tr').each(function (index, elem) {
            var $tds = $(this).find('td'),
                id = $tds.eq(0).find('input').val(),
                quantity = numeral($tds.find('input.quantity').val() || $tds.eq(1).text()).value(),
                prod_class = $tds.find('.prod_class').val() || $tds.eq(4).text(),
                price = numeral($tds.find('.price').val() || $tds.eq(5).text()).value();

            if (prod_class != 'Discount' && id != '') {
                result += quantity * price;
            }
        });

        var discount = this.getDiscount();
        // $('#_discount').html('(' + numeral(discount).format('$ 0,0.00') + ')');
        // $('#_total_table').html(numeral(result).format('$ 0,0.00'));
        // $('#_discount').closest('td').removeClass('hidden');
        // $('#_total_table').closest('td').removeClass('hidden');

        var init_fee = numeral($('#init_fee').val()).value();
        var processing_fee = numeral($('#processing_fee').val()).value();
        var paymentNumber = numeral($('#period').val()).value();
        var other_fee = init_fee + processing_fee * paymentNumber;
        var discount_code_value = orderDiscount.getPriceToDiscount();

        // $('#_init_fee').text(numeral(init_fee).format('$ 0,0.00'));
        // $('#_processing_fee').text(numeral(processing_fee).format('$ 0,0.00'));
        // $('#_total_processing_fee').text(numeral(processing_fee * paymentNumber).format('$ 0,0.00'));
        // $('#_period').text(paymentNumber);
        total = result - discount + other_fee - discount_code_value;

        if (total < old_total) total = old_total;
        // $('#_total').text(numeral(total).format('$ 0,0.00'));

        this.displayFooter({
            total: total,
            total_table: result,
            discount: discount,
            discount_code: discount_code_value,
            init_fee: init_fee,
            processing_fee: processing_fee,
            payment_period: paymentNumber,
            grand_total : total + window.contract_overage
        })

        _billing.setPaymentAmount();
        return total;
    },
    /**
     * 
     * @param {JSON} data : total, discount, discount_code, init_fee, processing_fee, 
     */
    displayFooter: function (data) {
        if (data.discount != undefined) {
            $('#_discount').html('(' + numeral(data.discount).format('$ 0,0.00') + ')');
            $('#_discount').closest('td').removeClass('hidden');
        }
        if (data.total_table != undefined) {
            $('#_total_table').html(numeral(data.total_table).format('$ 0,0.00'));
            $('#_total_table').closest('td').removeClass('hidden');
        }

        if (data.init_fee != undefined) {
            $('#_init_fee').text(numeral(data.init_fee).format('$ 0,0.00'));
        }

        if (data.processing_fee != undefined) {
            $('#_processing_fee').text(numeral(data.processing_fee).format('$ 0,0.00'));
        }

        if (data.payment_period != undefined) {
            $('#_period').text(data.payment_period);
        }

        if (data.total != undefined) {
            $('#_total').text(numeral(data.total).format('$ 0,0.00'));
        }

        if (data.grand_total != undefined) {
            $('#_grand_total').text(numeral(data.grand_total).format('$ 0,0.00'));
            window.grand_total = data.grand_total;
        }

        if (data.processing_fee != undefined && data.payment_period != undefined) {
            $('#_total_processing_fee').text(numeral(data.processing_fee * data.payment_period).format('$ 0,0.00'));
        }

        let contract_overage = data.contract_overage;
        if (contract_overage != undefined && contract_overage > 0) {
            window.contract_overage = numeral(contract_overage).value();
            $('#_contract_overage').text(numeral(data.contract_overage).format('$ 0,0.00'));
        } else if (contract_overage != undefined && contract_overage <= 0) {
            window.contract_overage = 0;
            $('#_contract_overage').text('$ 0.0');
        }
    },
    checkDisplayHasWarranty: function () {
        let has = hasWarranty;
        $('#table_product_ordered tbody tr').each(function () {
            $input = $(this).find('td:eq(4) input');
            if ($input.val() == 'Warranty') has = true;
        })
        if (has && !window.order_warranty_id) {
            $('#btnForwardOrderToWarranty').show();
        } else {
            $('#btnForwardOrderToWarranty').hide();
        }
        return has;
    },

    checkHasWarranty: function (index) {
        let has = hasWarranty && index != hasWarrantyIndex;
        this.checkDisplayHasWarranty();
        return has;
        // return has;
    },
    checkSKU: function (sku) {
        return $('#table_product_ordered tbody').find('input._itemSKU_' + sku).length > 0;
    },

    createInputFields: function (data, unbindEvent) {
        if (data) {
            productSelected[data.sku] = data;
            productSelectArray.push(data);
        }
        if (!data) { data = { quantity: 1, discount: 0.00, discount_type: '$', line_total: 0.00 } };
        if (data && data.quantity && data.prod_class && data.class == 'Warranty' && data.quantity > 1) {
            hasWarranty = true;
            hasWarrantyIndex = $('#table_product_ordered tbody').find('tr').length;
            data.quantity = 1;
            if (!data.line_total)
                data.line_total = opTotalLine(data.price, data.quantity, data.discount, data.discount_type);
        }
        var _html =
            '<tr>' +
            '<td class="hidden"><input type="hidden" value="' + (data.prod_id ? data.prod_id : data.id ? data.id : '') + '"></td>' +
            '<td class="hasinput input"><input type="number" value="' + (data.quantity ? data.quantity : data.qty ? data.qty : 1) + '" min="1" class="form-control quantity" placeholder="Quantity"></td>' +
            '<td class="hasinput input"><input type="text" value="' + (data.sku ? data.sku : '') + '" class="form-control SKU_search input_search search" placeholder="SKU"></td>' +
            '<td class="hasinput input"><input type="text" value="' + (data.prod_name ? data.prod_name : '') + '" class="form-control product_search input_search search" placeholder="Name"></td>' +
            '<td class="hasinput input"><input type="text" value="' + (data.prod_class ? data.prod_class : '') + '" class="form-control prod_class" placeholder="Class">' +
            '<td class="hasinput input text-right"><input type="text" value="' + numeral(data.price ? data.price : '0').format('0,0.00') + '" class="form-control input-currency price" class="text-right" placeholder="Price"></td>' +
            '<td class="hasinput input text-right" style="max-width:80px;"><input value="' + (data.discount ? data.discount : '0') + '" class="form-control' + (data.discount_type == '$' ? ' input-currency' : ' text-currency') + ' discount" placeholder="Discount"></td>' +
            '<td class="hasinput input" style="width:40px;">' +
            '<select class="form-control discount_type">' +
            '<option value="$" ' + (data.discount_type == '$' ? 'selected' : '') + '>$</option>' +
            '<option value="%" ' + (data.discount_type == '%' ? 'selected' : '') + '>%</option>' +
            '</select>' +
            '</td>' +
            '<td class="hasinput text-right" style="max-width:50px;"><input class="form-control input-currency bold line input-readonly" readonly="true" placeholder="0.00" value="' + numeral(data.line_total ? data.line_total : '0.00').format('0,0.00') + '"></td>';
        if (!unbindEvent) {
            _html += '<td class="hasinput input" style="width:fit-content">' +
                '<button type="button" title="Remove this product" class="btn btn-sm btn-default label btnRemoveProduct"><i class="fa fa-trash text-danger"></i></button>' +
                '</td>';
        }
        _html += '</tr>';

        $('#table_product_ordered tbody').append(_html);
        if (!unbindEvent) {
            this.bindEvent();
        }
    },
    getProductsData: function () {
        table = '#table_product_ordered';
        var result = [];
        $(table + ' tbody').find('tr').each(function (row, elem) {
            var $tds = $(elem).find('td');
            var ob = {};
            ob.id = $tds.eq(0).find('input').val();
            ob.quantity = numeral($tds.find('input.quantity').val()).value();
            ob.sku = $tds.find('.SKU_search').val();
            ob.prod_name = $tds.find('.product_search').val();
            ob.prod_class = $tds.find('.prod_class').val();
            ob.price = numeral($tds.find('.price').val()).value();
            ob.discount = numeral($tds.find('input.discount').val()).value();
            ob.discount_type = $tds.eq(7).find('select').val();

            ob.discount == '' ? ob.discount = 0 : '';

            ob.line_total = numeral($tds.eq(8).find('input').val()).value();

            if (ob.quantity == NaN) quantity = 1;
            if (ob.prod_class == 'Warranty') quantity = 1;
            /**
             * no push to order products list when:
             * quantity <= 0;
             * no have or blank sku | name | price | id | class
             */
            //if (ob.quantity <= 0 || !ob.sku || !ob.prod_name || !ob.price || !ob.id || !ob.prod_class ||
            //    ob.sku == '' || ob.prod_name == '' || ob.price == '' || ob.id == '' || ob.prod_class == '') {
            if (ob.quantity <= 0 || !ob.sku || !ob.prod_name  || !ob.id || !ob.prod_class ||
                ob.sku == '' || ob.prod_name == '' || ob.id == '' || ob.prod_class == '') {

            } else {
                result.push(ob)
            }
        });
        return result;
    },

}

var _orderProducts = new OrderProducts();
_orderProducts.init();
var orderDiscount = new OrderDiscount();
orderDiscount.init();