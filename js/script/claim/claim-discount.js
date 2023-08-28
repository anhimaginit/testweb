delete ClaimDiscount;
function ClaimDiscount() { }
var discountItem = null;
ClaimDiscount.prototype = {
   constructor: ClaimDiscount,
   init: function () {
      this.bindEvent();
      return this;
   },
   bindEvent: function () {
      var _self = this;
      $('[name=discount_code]').change(function () {
         if (this.value == '') {
            discountItem = null;
            $('#discount_code-error').remove();
            $('#discount_code-info').remove();
            $('#_discount_code').text(numeral(0).format('$ 0,0.00'));
            return;
         }
         _self.searchDiscount(this.value);
      })
   },
   searchDiscount: function (discount, callback) {
      var _self = this;
      var data = $.extend({}, template_data);
      data.discount_code = discount;
      data.discount_name = discount;
      $.ajax({
         url: link._discountGetByDiscountCodeByName,
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
                  _self.displayDiscount();
               } else {
                  discountItem = null;
                  $('[name=discount_code]').after('<label class="error" id="discount_code-error">Cannot find discount code</label>');
                  $('#discount_code-info').remove();
               }
            }
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
         _html += '<div>Discount Name: <b>' + discountItem.discount_name + '</b></div>';
         _html += '<div>Expired: <b>' + (discountItem.nerver_expired == '1' ? 'Unlimit' : discountItem.stop_date) + '</b></div>';
         _html += '<div class="discount_code">Discount Code: <b>' + discountItem.discount_code + '</b></div>';
         _html += '<div class="discount_value">Discount Value: <b>' + value + '</b></div>';
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
      $('#discount_pane').html(_html);
      if (callback) callback(_html);
   },

   getDiscountCodeValue : function(price){
      if (!discountItem) {
         $('#_payment_discount_code').text(numeral(0).format('$ 0,0.00'));
         return 0.00;
     }
     if(!price) price = numeral($('#_payment_service_fee').text()).value();
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
     $('#_payment_discount_code').text(numeral(result).format('$ 0,0.00'));
     return result;
   }
}

var claimDiscount = new ClaimDiscount();
claimDiscount.init();