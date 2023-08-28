function ProductTable(order_id, listProduct) {
   this.listProduct = listProduct;
   this.order_id = order_id;
}
ProductTable.listProduct = [];
ProductTable.order_id = 0;
ProductTable.prototype.constructor = ProductTable;
ProductTable.prototype = {
   createProductRow: function (count, prod, order_title, grand_total) {
      if (!order_title) order_title = 'Warranty Order ' + this.order_id;
      if (!prod.discount) prod.discount = 0;
      if (!prod.discount_type) prod.discount_type = '$';
      let _html = '<tr id="tr_order_' + this.order_id + '" class="product_item_table">';
      if (count == 0) {
         _html += '<td rowspan="' + this.listProduct.length + '" class="text-center"><a href="./#ajax/order-form.php?id=' + this.order_id + '" target="_blank">' + order_title + '</a></td>';
      }
      var price = (prod.price >= 0 ? numeral(prod.price).format('$ 0,0.00') : '(' + numeral(-prod.price).format('$ 0,0.00') + ')')
      var line_total = (prod.line_total >= 0 ? numeral(prod.line_total).format('$ 0,0.00') : '(' + numeral(-prod.line_total).format('$ 0,0.00') + ')')
      _html +=
         '<td class="hidden prod_id">' + prod.id + '</td>' +
         '<td><a href="./#ajax/product-form.php?id=' + prod.id + '" target="_blank">' + prod.sku + '</a></td>' +
         '<td class="prod_name">' + prod.prod_name + '</td>' +
         '<td class="prod_class">' + prod.prod_class + '</td>' +
         '<td class="text-right prod_price">' + price + '</td>' +
         '<td class="text-right prod_quantity">' + prod.quantity + '</td>' +
         '<td class="text-right">' + prod.discount_type.split('%').join('') + ' ' + prod.discount + prod.discount_type.split('$').join('') + '</td>' +
         '<td class="text-right lineTotal">' + line_total + '</td>';
      if (count == 0 && grand_total) {
         _html += '<td rowspan="' + this.listProduct.length + '" class="text-right">' + (numeral(grand_total).format('$ 0,0.00')) + '</td>';
      }
      _html += '</tr>';
      return _html;
   },
   createTableProduct: function (fillter, title, grand_total_price) {
      var _html = '', _html2 = '';
      if (fillter && typeof fillter == 'string') {
         fillter = [fillter];
      }
      var _self = this;
      _self.listProduct.forEach(function (prod, index) {
         var _s = _self.createProductRow(index, prod, title, grand_total_price);
         if (fillter && fillter.includes(prod.prod_class)) {
            _html += _s;
         }
         _html2 += _s;
      });
      if (fillter) {
         return _html;
      } else {
         return _html2;
      }
   },
}