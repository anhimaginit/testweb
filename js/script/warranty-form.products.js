function OrderProducts() { }
OrderProducts.prototype.constructor = OrderProducts;
var productBySKU = [];
var productByName = [];
var hasWarranty = false;
var hasWarrantyIndex = -1;
var productSelected = {};
OrderProducts.prototype = {
   init: function () {
      table = $('#table_product_ordered');
      this.loadProductData();
      this.bindEvent();
      setProductData = this.setProductData;
   },
   bindEvent: function () {
      $(document).on('change', 'input.quantity, input.discount, .discount_type, input.price', function () {
         var index = $(this).closest('tr').index();
         $(this).closest('tr').find('td:last').find('input').val(numeral(_orderProducts.getTotalLine(null, index)).format('$ 0,0.00'));
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
                  '<img src="' + (data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object img img-responsive img-thumbnail" style="width:40px">' +
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
            callback(productBySKU.filter(function (value) {
               return value.SKU.includes(query)
            }));
            // getFilterList(productBySKU, query, 0, productBySKU.length - 1, 'SKU', [], function (listFilter) {
            //    callback(listFilter);
            // })
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
                  '<div class="media-left padding-5">' +
                  '<img src="' + (data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object" style="width:40px">' +
                  '</div>' +
                  '<div class="media-body">' +
                  '<div class="username"><span>' + data.prod_name + '</span><small class="pull-right">' + data.prod_class + '</small></div>' +
                  '<p>' + numeral(data.prod_price).format('$ 0,0.00') + '</p>' +
                  '</div>' +
                  '</div>';

               return _html;
            }
         },
         source: function (query, callback) {
            callback(productByName.filter(function (value) {
               return value.prod_name.includes(query)
            }));
            // getFilterList(productByName, query, 0, productByName.length - 1, 'prod_name', [], function (listFilter) {
            //    callback(listFilter);
            // })
         },
      }).bind("typeahead:selected", function (obj, data) {
         setProductData(this, data);
      }).bind('change', function () {

      });
   },
   loadProductData: function (callback) {
      var dataSKU = $.extend({}, template_data);
      dataSKU.SKU = '';
      $.ajax({
         url: link._productsAlacarteForOrder,
         type: 'post',
         data: dataSKU,
         success: function (res) {
            productBySKU = JSON.parse(res);
            productBySKU.sort(function (a, b) {
               return a.SKU.toLowerCase().localeCompare(b.SKU.toLowerCase())
            })
            productByName = JSON.parse(res);
            productByName.sort(function (a, b) {
               return a.prod_name.toLowerCase().localeCompare(b.prod_name.toLowerCase())
            })
         }
      });
      if (callback) callback();
   },
   setProductData: function (elem, data) {
      if (!elem || !data) {
         return;
      } else {
         if (typeof data != 'undefined' && typeof data == 'string')
            data = JSON.parse(data);
         //default value
         if (!data.quantity) data.quantity = 1;
         if (!data.discount) data.discount = 0;

         if (_orderProducts.checkSKU(data.SKU)) {
            $('#table_product_ordered tbody').find('td:contains("' + data.SKU + '")').closest('tr').addClass('danger')
            setTimeout(function () {
               $('#table_product_ordered tbody').find('td:contains("' + data.SKU + '")').closest('tr').removeClass('danger').fadeIn(200)
            }, 1000);

            return;
         }
         var index = $(elem).closest('tr').index();

         if (index + 1 == $('#table_product_ordered tbody').children().length) {
            _orderProducts.createInputFields();
         } else {

         }
         var tds = $(elem).closest('tr').find('td');
         tds.eq(0).find('input').val(data.id);
         if (data.prod_class == 'Warranty' && data.quantity > 1) {
            messageForm('Warranty products can be only one in an order', false, $('#tb_product_show').parent().find('.message_table:first'));
            tds.find('input.quantity').val('1');
         } else {
            tds.find('input.quantity').val(data.quantity);
         }
         if (data.prod_class == 'Discount') {
            tds.find('input.discount').prop('readonly', true);
            tds.find('input.discount_type').prop('readonly', true);
         }
         productSelected[data.SKU] = data;
         tds.find('input.SKU_search').val(data.SKU);
         tds.find('input.product_search').val(data.prod_name);
         tds.eq(4).find('input').val(data.prod_class);
         tds.find('input.price').val(data.prod_price);
         if (data.prod_class == 'Discount') {
            tds.eq(8).find('input').val('$ 0.00')
         } else {
            tds.eq(8).find('input').val(numeral(_orderProducts.getTotalLine(data, index)).format('$ 0,0.00'));
         }
         _orderProducts.getTotalPrice();
      }
      //load agian Discount
      loadTotalDiscount();
   },

   getTotalLine: function (data, row) {
      if (!data && row != undefined && row > -1) {
         data = {};
         data.quantity = $('#table_product_ordered tbody tr:eq(' + row + ') .quantity').val();
         data.prod_class = $('#table_product_ordered tbody tr:eq(' + row + ') td:eq(4)').val();
         data.price = $('#table_product_ordered tbody tr:eq(' + row + ') .price').val();
         data.discount = $('#table_product_ordered tbody tr:eq(' + row + ') .disacount').val();
         data.discount_type = $('#table_product_ordered tbody tr:eq(' + row + ') .disacount_type').val();
      }
      if (data) {
         var quantity = numeral(data.quantity ? data.quantity : 1).value();
         var price = numeral(data.price ? data.price : data.prod_price ? data.prod_price : 0.00).value();
         var discount = numeral(data.discount ? data.discount : 0).value();
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


   getTotalPrice: function () {
      table = '#table_product_ordered';
      var result = 0.00;
      $(table + ' tbody').find('tr').each(function () {
         var $tds = $(this).find('td'),
            quantity = numeral($tds.find('input.quantity').val()).value(),
            price = numeral($tds.find('input.price').val()).value();

         result += quantity * price;
      });
      var discount = 0;
      $('#_discount').html('(' + numeral(discount).format('$ 0,0.00') + ')');
      $('#_total_table').html(numeral(result - discount).format('$ 0,0.00'));
      $('#_discount').closest('td').removeClass('hidden');
      $('#_total_table').closest('td').removeClass('hidden');

      var other_fee = numeral($('#other_fee').val()).value();

      $('#_other_fee').text(numeral(other_fee).format('$ 0,0.00'));
      $('#_total').text(numeral(result - discount + other_fee).format('$ 0,0.00'));
      $('#_total_p_method').text(numeral(result - discount + other_fee).format('$ 0,0.00'));
      _billing.setPaymentAmount();
      return result - discount + other_fee;
   },

   checkSKU: function (sku) {
      return sku && productSelected[sku] && productSelected[sku] != '';
   },

   createInputFields: function (data) {
      if (!data) { data = {} };
      if (data && data.quantity && data.prod_class && data.class == 'Warranty' && data.quantity > 1) {
         data.quantity = 1;
         data.line_total = opTotalLine(data.price, data.quantity, data.discount, data.discount_type);
      }
      var _html =
         '<tr>' +
         '<td class="hidden"><input type="hidden" value="' + (data.prod_id ? data.prod_id : data.id ? data.id : '') + '"></td>' +
         '<td class="hasinput"><input type="number" value="' + (data.quantity ? data.quantity : data.qty ? data.qty : 1) + '" min="1" class="form-control quantity" placeholder="Quantity"></td>' +
         '<td class="hasinput"><input type="text" value="' + (data.sku ? data.sku : '') + '" class="form-control SKU_search input_search search" placeholder="SKU"></td>' +
         '<td class="hasinput"><input type="text" value="' + (data.prod_name ? data.prod_name : '') + '" class="form-control product_search input_search search" placeholder="Name"></td>' +
         '<td class="hasinput"><input type="text" value="' + (data.prod_class ? data.prod_class : '') + '" class="form-control class" placeholder="Class">' +
         '<td class="hasinput"><input type="text" value="' + numeral(data.price ? data.price : '0').format('0,0.00') + '" class="form-control input-currency price" class="text-right" placeholder="Price"></td>' +
         '<td class="hasinput" style="max-width:80px;"><input value="' + (data.discount ? data.discount : '0') + '" class="form-control input-currency discount" placeholder="Discount"></td>' +
         '<td class="hasinput" style="max-width:30px;">' +
         '<select class="form-control discount_type">' +
         '<option value="%" ' + (data.discount_type == '%' ? 'selected' : '') + '>%</option>' +
         '<option value="$" ' + (data.discount_type == '$' ? 'selected' : '') + '>$</option>' +
         '</select>' +
         '</td>' +
         '<td class="hasinput" style="max-width:50px;"><input class="form-control input-currency bold" readonly="true" placeholder="0.00" value="' + numeral(data.line_total ? data.line_total : '0.00').format('0,0.00') + '"></td>' +
         '</tr>';

      $('#table_product_ordered tbody').append(_html);
      this.bindEvent();
   },
   getProductsData: function () {
      table = '#table_product_ordered';
      var result = [];
      $(table + ' tbody').find('tr').each(function (row, elem) {
         var $tds = $(elem).find('td');
         var ob = {};
         ob.id = $tds.eq(0).find('input').val();
         ob.quantity = numeral($tds.eq(1).find('input').val()).value();
         ob.sku = $tds.eq(2).find('input').val();
         ob.prod_name = $tds.eq(3).find('input').val();
         ob.prod_class = $tds.eq(4).find('input').val();
         ob.price = numeral($tds.eq(5).find('input').val()).value();
         ob.discount = numeral($tds.eq(6).find('input').val()).value();
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
         if (ob.quantity <= 0 || !ob.sku || !ob.prod_name || !ob.price || !ob.id || !ob.prod_class ||
            ob.sku == '' || ob.prod_name == '' || ob.price == '' || ob.id == '' || ob.prod_class == '') {

         } else {
            result.push(ob)
         }
      });
      return result;
   },

}

var _orderProducts = new OrderProducts();
_orderProducts.init();