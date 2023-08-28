function Ledgers(obj) {
   this.ID = obj.ID;
   this.ledger_credit = obj.ledger_credit;
   this.ledger_order_id = obj.ledger_order_id;
   this.ledger_payment_note = obj.ledger_payment_note ? obj.ledger_payment_note : '';
   this.ledger_type = obj.ledger_type ? obj.ledger_type : 'Cash';
   this.invoiceDate = obj.invoiceDate;
   this.payment_schedule_id = obj.payment_schedule_id;
   this.tran_id = obj.tran_id;
}

Ledgers.prototype.constructor = Ledgers
Ledgers.prototype = {
   createTableLedgerRow: function () {
      var _html = '<tr>' +
         '<td class="text-center id_item_ledger">' + (this.ID ? this.ID : '') + '</td>' +
         '<td class="text-right">' + (this.ledger_credit >= 0 ? numeral(this.ledger_credit).format('$ 0,0.00') : '(' + numeral(-this.ledger_credit).format('$ 0,0.00') + ')') + '</td>' +
         '<td>' + this.ledger_type + '</td>' +
         '<td>' + (this.ledger_payment_note && this.ledger_payment_note != '' ? this.ledger_payment_note : 'Payment ' + (this.ledger_credit >= 0 ? numeral(this.ledger_credit).format('$ 0,0.00') : '(' + numeral(-this.ledger_credit).format('$ 0,0.00') + ')')) + '</td>' +
         '<td class="text-center">' + this.invoiceDate + '</td>';
      _html += '</tr>';
      return _html;
   },
   decreaseCurrency: function (before) {
      return numeral(before - this.ledger_credit).value();
   },
   increaseCurrency: function (before) {
      return numeral(before + this.ledger_credit).value();
   },
   setID: function (id) {
      this.ID = id;
   },
   unsetID: function () {
      delete this.ID;
   }
}