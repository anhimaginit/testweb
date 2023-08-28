function Price() { }

Price.prototype = {
  constructor: Price,

  getLinePrice: function (elem) {
    var quantity = numeral($(elem).closest('tr').find('.quantity').val()).value();
    var price = numeral($(elem).closest('tr').find('.price').val()).value();
    return price * quantity;
  },

  autoFillLinePrice: function (elem) {
    var quantity = numeral($(elem).closest('tr').find('.quantity').val()).value();
    var price = numeral($(elem).closest('tr').find('.price').val()).value();
    return price * quantity;
  },

  displayDiscount: function (discountItem, callback) {
    var _html = '';
    if (discountItem) {
      window.discount_code_value = discountItem;

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
    $('#discountDescription').html(_html);
    if (callback) callback(_html);
  },

  getDiscountCodeValue: function (total) {
    if (!window.discount_code_value) return 0;

    if (!total) total = _pricePurchase.getTotalPriceNoDiscount();
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    var validDiscount = false;
    if (new Date(window.discount_code_value.stop_date).getTime() - date.getTime() >= 0) validDiscount = true;
    if (window.discount_code_value.nerver_expired == '1' || window.discount_code_value.nerver_expired == 1 || validDiscount) {
      var discount_value = parseFloat(window.discount_code_value.apply_to.value.discount),
        discount_type = window.discount_code_value.apply_to.value.discount_type,
        type = window.discount_code_value.apply_to.type,
        products = window.discount_code_value.apply_to.products;
      var table = '#table_product_ordered';
      var prods = [],
        quantities = {};
      prods.push($('#product_warranty_order_id').val());
      quantities[$('#product_warranty_order_id').val()] = $('#iptProductQuantity').text();

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
      if (type == '1') {
        if (discount_type == '%') {
          result = total * parseFloat(discount_value) / 100;
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
      return result;
    } else {
      return 0;
    }
  },

  getTotalPriceNoDiscount: function () {
    //A La Carte Product
    table = '#table_product_ordered';
    var result = 0.00;
    $(table + ' tbody').find('tr').each(function (index, elem) {
      var $tds = $(this).find('td'),
        quantity = numeral($tds.find('input.quantity').val()).value(),
        price = numeral($tds.find('input.price').val()).value();
      result += quantity * price;
    });
    // Warranty Product
    var productWarrantyTotalLine = numeral($('#iptProductDiscountLineTotal').text()).value();
    result += productWarrantyTotalLine;
    return result;
  },

  getTotalPrice: function () {
    var total_no_discount = _pricePurchase.getTotalPriceNoDiscount();
    var discount_code_value = _pricePurchase.getDiscountCodeValue(total_no_discount);
    var init_fee = numeral($('#init_fee').val()).value();
    var processing_fee = numeral($('#processing_fee').val()).value();
    var period = numeral($('#period').val()).value();

    var total = total_no_discount - discount_code_value + init_fee + processing_fee * period;
    var contract_amount = numeral($('#warranty_form [name=warranty_contract_amount]').val()).value();
    let grand_total = total;
    if (contract_amount > total) grand_total = contract_amount;

    //set View
    _pricePurchase.displayPrice({
      total_order: total_no_discount,
      discount: discount_code_value,
      total: total,
      grand_total: grand_total,
      contract_overage: grand_total - total
    });

    return total;
  },

  displayPrice: function (data) {
    $('#_total_table').text(numeral(data.total_order).format('$ 0,0.00'));
    $('#_discount').text(numeral(data.discount).format('$ 0,0.00'));
    $('#_discount_code').text(numeral(data.discount).format('$ 0,0.00'));
    $('#_total').text(numeral(data.total).format('$ 0,0.00'));
    $('#_total_p_method').text(numeral(data.total).format('$ 0,0.00'));
    if (data.total <= 0) {
      $('.buttonPaymentWarranty').prop('disabled', 'disabled');
    } else {
      $('.buttonPaymentWarranty').prop('disabled', false);
    }

    if (data.grand_total !== undefined) {
      $('#_grand_total').text(numeral(data.grand_total).format('$ 0,0.00'));
      window.grand_total = data.grand_total;
    }

    if (data.contract_overage !== undefined) {
      if (numeral(data.contract_overage).value() > 0) {
        $('#_contract_overage').text(numeral(data.contract_overage).format('$ 0,0.00'));
      } else {
        $('#_contract_overage').text('$ 0.00');
      }
    }
  }
}

var _pricePurchase = new Price();