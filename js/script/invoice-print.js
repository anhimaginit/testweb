function InvoiceFeature(data) {
  if (data) {
    for (var key in data) {
      this[key] = data[key];
    }
  }
}

InvoiceFeature.prototype = {
  constructor: InvoiceFeature,
  printInvoice: function (callback) {
    this.getInvoiceHtml(function (_html) {
      var printWindow = window.open();
      printWindow.document.write(_html);
      printWindow.print();
      printWindow.close();
      if (callback) callback(res);

    })
  },
  exportPDF: function () {
    window.open(host2 + 'php/make-pdf-invoice.php?invoice=' + this.invoiceid, '_blank');

  },
  getInvoiceHtml: function (callback) {
    $.ajax({
      url: host2 + '/invoice-print.php?invoice=' + this.invoiceid,
      type: 'get',
      dataType: 'html',
      success: function (res) {
        if (callback) callback(res);
      }
    })
  }

}

