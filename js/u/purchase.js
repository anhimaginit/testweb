function PurchaseProduct() { }

var productBySKU = [];
var productByName = [];
var hasWarranty = false;
var hasWarrantyIndex = -1;
var productSelected = {};
var productSelectArray = [];

PurchaseProduct.prototype = {
  constructor: PurchaseProduct,
  init: function (cb) {

    table = $('#table_product_ordered');
    setProductData = this.setProductData;
    this.loadProductData(this.bindEvent);
    if (cb) cb();
  },

  bindEvent: function () {
    $('input.quantity, input.price, [name="warranty_contract_amount"]').bind('change', function () {
      $(this).closest('tr').find('.line_total').val(numeral(_pricePurchase.autoFillLinePrice(this)).format('0,0.00'));
      _pricePurchase.getTotalPrice();
    });

    $('.btnRemoveProductAlaCarte').unbind('click').bind('click', function () {
      var row = $(this).closest('tr');
      var length = $('#table_product_ordered tbody').find('tr').length;
      var index = row.index();
      if (index >= 0 && index < productSelectArray.length && productSelectArray[index].sku && index < length - 1) {
        delete productSelected[productSelectArray[index].sku];
        productSelectArray.splice(index, 1);
        row.remove();
        _pricePurchase.getTotalPrice();
      }
    });

    $('#init_fee, #processing_fee, #period').bind('change', function () {
      _pricePurchase.getTotalPrice();
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
            '<div class="media-heading username bold">SKU: ' + data.SKU + '<small class="pull-right">' + data.prod_name + '</small></div>' +
            '<p>' + (data.prod_price && data.prod_price != 0 && data.prod_price != '0' ? numeral(data.prod_price).format('$ 0,0.00') : '') + '</p>' +
            '</div>' +
            '</div>';

          return _html;
        }
      },
      source: function (query, callback) {
        getFilterList(productBySKU, query, 0, productBySKU.length - 1, 'SKU', [], function (listFilter) {
          callback(listFilter);
        })
      },
    }).bind("typeahead:selected", function (obj, data) {
      setProductData(this, data);
    });;

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
            '<div class="media-heading username bold">' + data.prod_name + '<small class="pull-right">' + data.SKU + '</small></div>' +
            '<p>' + (data.prod_price && data.prod_price != 0 && data.prod_price != '0' ? numeral(data.prod_price).format('$ 0,0.00') : '') + '</p>' +
            '</div>' +
            '</div>';

          return _html;
          //   return '<div>
          // <span>' + elem.prod_name + '</span> [<span>' + elem.SKU + '</span>]<span class="pull-right">' + elem.prod_class + '</span></div>'
        }
      },
      source: function (query, callback) {
        getFilterList(productByName, query, 0, productByName.length - 1, 'prod_name', [], function (listFilter) {
          callback(listFilter);
        })
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
      if (index < productSelectArray.length && productSelectArray[index] && data.sku == productSelectArray[index].sku) return;

      if (typeof data != 'undefined' && typeof data == 'string')
        data = JSON.parse(data);
      //default value
      if (!data.quantity) data.quantity = 1;
      if (!data.price && data.prod_price) data.price = data.prod_price;
      if (!data.sku && data.SKU) data.sku = data.SKU;
      if (!data.name && data.prod_name) data.name = data.prod_name;
      if (_purchaseProduct.checkSKU(data.sku, index)) {
        $('#table_product_ordered tbody').find('td._itemSKU_' + data.sku).closest('tr').addClass('danger')
        setTimeout(function () {
          $('#table_product_ordered tbody').find('td._itemSKU_' + data.sku).closest('tr').removeClass('danger').fadeIn(200);
        }, 1000);
        $(elem).typeahead('val', '');
        return;
      }
      if (!data.price || data.price == '' || data.price == 0 || data.price == '0') {
        var contract_amount = numeral($('[name=warranty_contract_amount]').val()).value();
        var total_table = numeral($('#_total_table').text()).value();
        if (contract_amount >= total_table)
          data.price = contract_amount - total_table;
        else data.price = 0;
      }

      var tds = $(elem).closest('tr');

      if (index < productSelectArray.length) {
        tds.find('._itemSKU_' + productSelectArray[index].sku).removeClass('._itemSKU_' + productSelectArray[index].sku);
        delete productSelected[productSelectArray[index].sku];
        productSelectArray.splice(index, 1, data);
      } else {
        productSelectArray.push(data);
      }
      productSelected[data.sku] = data;
      if (index + 1 == $('#table_product_ordered tbody').children().length) {
        _purchaseProduct.createInputFields();
      }
      var id = data.id ? data.id : data.ID;
      tds.find('input:first').val(id);
      tds.find('input.quantity').val(data.quantity);
      tds.find('input.SKU_search').typeahead('val', data.sku);
      tds.find('input.SKU_search').closest('td').addClass('_itemSKU_' + data.sku);
      // tds.eq(2).find('input').val(data.sku);
      tds.find('input.product_search').typeahead('val', data.name);
      tds.find('input.product_class').val(data.prod_class);
      tds.find('input.price').val(numeral(data.price).format('$ 0,0.00'));
      tds.find('input.line_total').val(numeral(_purchaseProduct.opTotalLine(data.price, data.quantity)).format('$ 0,0.00'));
      _pricePurchase.getTotalPrice();
    }
  },

  opTotalLine: function (price, quantity) {
    if (!price || !quantity) return 0;
    price = numeral(price).value();
    quantity = numeral(quantity).value();
    return price * quantity;
  },
  loadProductData: function (callback) {
    var dataSKU = $.extend({}, template_data);
    dataSKU.SKU = '';
    $.ajax({
      url: link._productClssALaCarte,
      type: 'post',
      data: dataSKU,
      dataType: 'json',
      success: function (res) {
        productBySKU = res.list;
        productBySKU.sort(function (a, b) {
          return a.SKU.toLowerCase().localeCompare(b.SKU.toLowerCase())
        });
        productByName = res.list;
        productByName.sort(function (a, b) {
          return a.prod_name.toLowerCase().localeCompare(b.prod_name.toLowerCase())
        });
        if (callback) callback();
      }
    });

  },
  checkSKU: function (sku) {
    var hasSKU = productSelected[sku]
    if (hasSKU) return true; else return false;
  },

  createInputFields: function (data, unbindEvent) {
    if (data) {
      productSelected[data.sku] = data;
      productSelectArray.push(data);
    }
    if (!data) { data = {} };
    if (data && data.quantity && data.prod_class && data.class == 'Warranty' && data.quantity > 1) {
      hasWarranty = true;
      hasWarrantyIndex = $('#table_product_ordered tbody').find('tr').length;
      data.quantity = 1;
      if (!data.line_total)
        data.line_total = _purchaseProduct.opTotalLine(data.price, data.quantity);
    }
    var _html =
      '<tr>' +
      '<td class="hidden"><input type="hidden" value="' + (data.prod_id ? data.prod_id : data.id ? data.id : '') + '"></td>' +
      '<td class="hasinput input"><input type="number" value="' + (data.quantity ? data.quantity : data.qty ? data.qty : 1) + '" min="1" class="form-control quantity" placeholder="Quantity"></td>' +
      '<td class="hasinput input"><input type="text" value="' + (data.sku ? data.sku : '') + '" class="form-control SKU_search input_search search" placeholder="SKU"></td>' +
      '<td class="hasinput input"><input type="text" value="' + (data.prod_name ? data.prod_name : '') + '" class="form-control product_search input_search search" placeholder="Name"></td>' +
      '<td class="hasinput input"><input type="text" value="' + (data.prod_class ? data.prod_class : '') + '" class="form-control product_class" placeholder="Class"></td>' +
      '<td class="hasinput input text-right"><input type="text" value="' + numeral(data.price ? data.price : '0').format('$ 0,0.00') + '" class="form-control input-currency price" class="text-right" placeholder="Price"></td>' +
      '<td class="hasinput input text-right" style="max-width:50px;"><input class="form-control input-currency bold line_total" readonly placeholder="0.00" value="' + numeral(data.line_total ? data.line_total : '$ 0.00').format('$ 0,0.00') + '"></td>' +
      '<td class="hasinput input" style="width:fit-content">' +
      '<button type="button" title="Remove this product" class="btn btn-sm btn-default label btnRemoveProductAlaCarte"><i class="fa fa-trash text-danger"></i></button>' +
      '</td>' +
      '</tr>';

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
      ob.sku = $tds.find('input.SKU_search').val();
      ob.prod_name = $tds.find('input.product_search').val();
      ob.prod_class = $tds.find('input.product_class').val();
      ob.price = numeral($tds.find('input.price').val()).value();
      ob.line_total = numeral($tds.find('input.line_total').val()).value();

      if (ob.quantity == NaN) ob.quantity = 1;
      /**
       * no push to order products list when:
       * quantity <= 0;
       * no have or blank sku | name | price | id | class
       */
      if (ob.quantity <= 0 || !ob.sku || !ob.prod_name || !ob.id || !ob.prod_class ||
        ob.sku == '' || ob.prod_name == '' || ob.id == '' || ob.prod_class == '') {

      } else {
        result.push(ob)
      }
    });

    if ($('#product_warranty_order_id').val() != '') {
      var productClassWarranty = {
        id: $('#product_warranty_order_id').val(),
        quantity: numeral($('#iptProductQuantity').text()).value(),
        sku: $('#iptProductSKU').text(),
        prod_name: $('#iptProductName').text(),
        prod_class: $('#iptProductClass').text(),
        price: numeral($('#iptProductPrice').text()).value(),
        line_total: numeral($('#iptProductDiscountLineTotal').text()).value()
      };
      if (productClassWarranty.id != undefined && productClassWarranty.id != '') {
        result.push(productClassWarranty);
      }
    }

    return result;
  },

}

var _purchaseProduct = new PurchaseProduct();
_purchaseProduct.init();