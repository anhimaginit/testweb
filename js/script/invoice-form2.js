function Invoice(object) {
   if (object != undefined) {
      this.prototype = object;
   }
}
Invoice.invoice = null;

var pre_ordered = '';
var historyTable = null;
var scheduleTable = null;
var _selectLoader = new SelectLoader();
var _ledgerList = [];
var _payaccList = [];
var billingDate = '';
var isCompleteInvoice = false;
var invoice_payment = 0;
var products_for_invoice = [];
var init_fee_invoice = 0;
var processing_fee_invoice = 0;
var numofpay_invoice = 0;

window.grand_total = 0;
window.contract_overage = 0;

$('#display-acct-pay').parent().hide();
Invoice.prototype = {
   init: function (callback) {
      $('select[name="order_id"]').prop('disabled', 'disabled');
      confirmPayment = this.confirmPayment;

      if (!getUrlParameter('id')) {
         this.bindEvent();
         new ControlSelect2(['[name="customer"]']);
      }

      invoiceNote = new NoteTable({
         form: 'Invoice',
         table: '#form_invoice #table_note_info'
      });
      invoiceNote.init();
      this.setView();
      _selectLoader.loadDataSelectContact(link._salesmanList, 'salesperson', 'SID', callback);
   },

   setView: function () {
      $('#receiverMail #receiver_input').tagsInput({
         interactive: true,
         placeholder: 'ex: yourmail@mail.com',
         width: 'auto',
         height: 'auto',
         hide: true,
         removeWithBackspace: true,
         delimiter: [';'],
      });
   },

   bindEvent: function () {
      let that = this;
      $(document).on('change', '#receiverMail #receiver_input_tag', function () {
         var val = $(this).val();
         if ($('#receiverMail #receiver_input').val().split(';').includes(val)) {
            $(this).val('');
         } else {
            $('#receiverMail #receiver_input').addTag(val);
         }
      }).on('keyup', '#receiverMail #receiver_input_tag', function (e) {
         var key = e.key;
         /** 9 = tab, 13= enter, 37= ←, 38= ↑, 39= →, 40= ↓, 190= ., 106= *, 111= /, */
         var listList = ['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', ',', ';', '|', '*', '/']
         if (listList.includes(key)) {
            var val = $(this).val().substring(0, this.value.length - 1);
            if ($('#receiverMail #receiver_input').val().split(';').includes(val)) {
               $(this).val('');
            } else {
               $('#receiverMail #receiver_input').addTag(val);
               $(this).focus().val('');
            }
         }
      });
      $('#form_invoice').validate(Invoice.prototype.validateInvoiceOption);

      $('input[name="invoiceid"]').bind('change', function () {
         Invoice.prototype.checkInvoiceID().then().catch(function (e) { });
      });

      $('[name=salesperson]').select2({ placeholder: 'Select salesperson' })

      $('#order_search').bind('change', function () {
         Invoice.prototype.search_order();
      });

      $('select[name="customer"]').bind('change', function () {
         var selectCustom = $(this).val();
         if (selectCustom != '') {
            $('select[name="order_id"]').prop('disabled', false);
            _selectLoader.loadOrderByCustomer(selectCustom, 'order_id', $('select[name="order_id"]').val());
         }

         $('input').parent().children('p.error').remove();

         $('#tb_product_show tbody').empty();

         that.displayCurrency({
            total: 0,
            payment: 0,
            order: 0
         })

         // $('#_payment_order').text('$ 0.00');
         // $('#_balance_order').text('$ 0.00');
         // $('#_total_order').text('$ 0.00');
      });

      $('.print-invoice').click(function () {
         var invoiceID = $('[name=ID]').val();
         if (invoiceID && invoiceID != '') {
            _invoice.print();
         } else {
            $('#form_invoice').submit();
         }

      });

      $('.view-invoice').click(function () {
         var invoiceID = $('[name=ID]').val();
         if (invoiceID && invoiceID != '') {
            _invoice.viewInvoice();
         }
      });

      $('.btn-submit-sendMail').click(function () {
         var invoiceID = $('[name=ID]').val();
         if (invoiceID && invoiceID != '') {
            _invoice.sendInvoiceMail();
         }
      });

      $('.pdf-invoice').click(function () {
         var invoiceID = $('[name=ID]').val();
         if (invoiceID && invoiceID != '') {
            _invoice.exportPDF();
         } else {
            $('#form_invoice').submit();
         }
      });

      $('#form_invoice #display-acct-pay').unbind('click').bind('click', function () {
         if ($('#form_invoice #order_search option:selected').val() != '' &&
            $('#form_invoice #order_search option:selected').val() != 'Select Order' &&
            $('#form_invoice #order_search option:selected').val() != undefined) {
            $('#acct-pay-modal').modal('show');
            window.what_form = "invoice";
         } else {
            messageForm('Select order first', 'warning', '#form_invoice #message_form')
         }

      });
   },

   sendInvoiceMail: function () {
      $.ajax({
         url: link._invoice_mailto,
         type: 'post',
         dataType: 'json',
         data: {
            invoice_num: $('#invoice_extend_number').text() + $('[name=invoiceid]').val(),
            emails: $('#receiverMail .receiver_input').val(),
            subtitle: $('#receiverMail .title_input').val(),
            content: $('#receiverMail .content_mail').val(),
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID')
         },
         success: function (res) {
            if (res.send == true) {
               messageForm('The invoice mail is sent', true, '#form_invoice #message_form');
               $('.modal').modal('hide');
               $('#receiverMail .receiver_input').val('');
            } else {
               messageForm('Error! An error occurred. Please try later', false, '#form_invoice #message_form');
            }
         },
         error: function (e) {
         }
      })
   },

   print: function () {
      var data = {
         invoiceid: $('#invoice_extend_number').text() + $('[name=invoiceid]').val()
      }
      var printInvoice = new InvoiceFeature(data);
      printInvoice.printInvoice();
   },

   viewInvoice: function () {
      var data = {
         invoiceid: $('#invoice_extend_number').text() + $('[name=invoiceid]').val()
      }
      var viewInvoice = new InvoiceFeature(data);
      viewInvoice.getInvoiceHtml(function (_html) {
         $('#previewInvoice .modal-body').html(_html);
         $('#previewInvoice').modal('show');
      });
   },

   exportPDF: function () {
      var data = {
         invoiceid: $('#invoice_extend_number').text() + $('[name=invoiceid]').val()
      }
      var exportHTLM = new InvoiceFeature(data);
      exportHTLM.exportPDF();
   },


   initUpdate: function (id) {
      let that = this;
      if (id != '' && id != "0") {
         $.ajax({
            url: link._invoiceGetByID,
            type: 'post',
            data: { token: localStorage.getItemValue('token'), ID: id },
            success: function (res) {
               if (res.startsWith('{')) {
                  var __invoice = JSON.parse(res);
                  if (__invoice.ERROR == '' && __invoice.Invoice != '') {
                     $('#form_invoice #display-acct-pay').parent().show();

                     __invoice = __invoice.Invoice;
                     Invoice.invoiceid = __invoice.invoiceid;

                     if (__invoice.balance <= 0) {
                        isCompleteInvoice = true;
                        messageForm('The invoice for this order has been completed', true);
                        $('#schedule_table').remove();
                        $('#form_invoice #display-acct-pay').remove();
                        $('#btnSubmitInvoice').remove();
                        $('#acct-pay-modal').hide();
                     }

                     if (__invoice.payaccts) {
                        if (!__invoice.ledger) __invoice.ledger = [];
                        let payids = [];
                        let ledids = [];

                        for (var i = 0; i < __invoice.payaccts.length; i++) {
                           payids.push(__invoice.payaccts[i].pay_id)
                           _payaccList.push(__invoice.payaccts[i].pay_id)
                        }
                        for (var j = 0; j < __invoice.ledger.length; j++) {
                           ledids.push(__invoice.ledger[j].tran_id);
                        }

                        let diffArray = payids.filter(item => !ledids.includes(item));

                        __invoice.payaccts.forEach(function (item, index) {
                           if (diffArray.includes(item.pay_id)) {
                              __invoice.ledger.push({
                                 ledger_create_date: item.pay_date,
                                 ledger_credit: item.pay_amount,
                                 ledger_invoice_id: item.invoice_id,
                                 ledger_order_id: item.order_id,
                                 ledger_type: item.pay_type,
                                 tran_id: item.pay_id,
                              });
                           }
                        })
                     }

                     if (__invoice.ledger) {
                        var _html = '';
                        __invoice.ledger.forEach(function (elem) {
                           var __ledger = new Ledgers(elem);
                           invoice_payment += parseFloat(elem.ledger_credit)
                           _html += __ledger.createTableLedgerRow();
                        });
                        $('#tb_ledger_show tbody').append(_html);
                        _ledgerList = __invoice.ledger;
                     }
                     _selectLoader.loadOrderByCustomer(__invoice.customer, 'order_id', __invoice.order_id, __invoice.balance, function (isValid) {
                        if (isValid) {
                           $('input[name="ID"]').val(__invoice.ID);
                           $('select[name="order_id"]').val(__invoice.order_id);
                           $('input[name="warranty"]').val(__invoice.warranty);
                           $('input[name="invoiceid"]').val((__invoice.invoiceid).substring(4));
                           $('.invoice_file').html(__invoice.invoiceid);
                           $('input[name="paytype"]').val(__invoice.paytype);
                           var _cus_name = __invoice.b_first_name ? __invoice.b_first_name : '';
                           _cus_name += ' ';
                           _cus_name += __invoice.b_last_name ? __invoice.b_last_name : '';

                           var _sell_name = __invoice.s_first_name ? __invoice.s_first_name : '';
                           _sell_name += ' ';
                           _sell_name += __invoice.s_last_name ? __invoice.s_last_name : '';
                           if (__invoice.customer && __invoice.customer != '0') {
                              $('select[name="customer"]').append(new Option(_cus_name, __invoice.customer, true, true)).trigger('change');
                           }
                           if (__invoice.salesperson && __invoice.salesperson != '0') {
                              $('select[name="salesperson"]').append('<option value="' + __invoice.salesperson + '" selected>' + _sell_name + '</option>').trigger('change');
                           }
                           $('#invoice_extend_number').text(__invoice.invoiceid.substring(0, 4));
                           let payment = that.getTotalPaymentAmount();
                           var _data = {
                              payment: payment,
                              balance: __invoice.balance,
                              order_invoice_payment: __invoice.balance - __invoice.order_balance,
                              total: __invoice.total,
                              grand_total: __invoice.grand_total,
                              contract_overage: __invoice.contract_overage
                           }

                           window.grand_total = numeral(__invoice.grand_total).value();
                           window.contract_overage = numeral(__invoice.contract_overage).value();

                           $('input[name="total"]').val(__invoice.total);
                           _invoice.search_order(true, __invoice.order_id, _data);

                           $('select[name="customer"]').prop('disabled', true);
                           $('input[name="invoiceid"]').prop('readonly', true);
                           $('select[name="salesperson"]').prop('disabled', true);
                           $('select[name="order_id"]').prop('disabled', true);

                           $('select[name="order_id"]').prepend('<option value="' + __invoice.order_id + '" selected>Order-' + __invoice.order_id + '</select>');

                           if (parseFloat(_invoice.balance) <= 0) {
                              $('#form_invoice #display-acct-pay').hide()
                           }
                           $('[name="salesperson"]').closest('fieldset').prop('title', 'You cannot change fields when you update invoice');
                           Invoice.prototype.bindEvent();

                        } else {

                        }
                     });

                     if (__invoice.notes != undefined && __invoice.notes.length > 0) {
                        invoiceNote.displayList(__invoice.notes);
                     } else {
                        invoiceNote.displayList([]);
                     }
                     Invoice.invoice = __invoice;

                     //
                     window.invID = __invoice.ID
                     payacct.prototype.createPayAcctRows('#form_invoice #tb_acct_pay_show tbody', __invoice.payaccts);
                     // total overage
                     if (__invoice.total_overage) {
                        $('#form-pay-acct #on_account_amount').text(numeral(__invoice.total_overage).format('$ 0,0.00'));
                     }
                  }
               }
            },
         })
      }
   },

   search_order: function (isNotRemoveLedge, _order_id, currency) {
      if (!_order_id) _order_id = $('#form_invoice #order_search').val();
      var invoiceid = $('#form_invoice input[name=ID]').val();
      var postdata = { token: localStorage.getItemValue('token'), order_id: _order_id };
      if (invoiceid != '') {
         postdata.invoiceID = invoiceid;
         postdata.balance = $('#form_invoice input[name=balance]').val();
      }
      if (_order_id != '') {
         $.ajax({
            url: link._orderGetByIdForInvoice,
            type: 'post',
            data: postdata,
            dataType: 'json',
            success: function (order) {
               if (order.order) {
                  pre_ordered = _order_id;
                  window.order_editing = order.order;
                  if (!isNotRemoveLedge || isNotRemoveLedge == false || isNotRemoveLedge == undefined) { Invoice.prototype.removeLedger(); }

                  var _ProductTable = new ProductTable(_order_id, order.order.products_ordered);
                  products_for_invoice = order.order.products_ordered;
                  var total_product_price = 0;
                  order.order.products_ordered.forEach(function (item) {
                     total_product_price += numeral(item.line_total).value();
                  });

                  $('#tb_product_show tbody').empty();
                  $('#tb_product_show tbody').html(_ProductTable.createTableProduct(null, order.order.order_title));

                  //display currency in table footer
                  // order total = products_price + initFee + processing_fee*paymentPeriod - discount_code - discount_product
                  if (!currency) {
                     currency = {
                        payment: order.order.payment,
                        balance: order.order.balance,
                        total: order.order.total,
                        discount: total_product_price - parseFloat(order.order.total),
                        grand_total: order.order.grand_total,
                        contract_overage: order.order.contract_overage
                     }
                  }
                  if (order.order.subscription != [] && order.order.subscription != '' && order.order.subscription != '{}') {
                     currency.billingCircle = order.order.subscription.billingCircleEvery;
                     currency.processing_fee = order.order.subscription.processingFee;
                     billingDate = order.order.subscription.billingDate;
                     //=> discount = discount_code + discount_product = total - (products_price + initFee + processing_fee*paymentPeriod)
                     currency.discount = currency.discount + (numeral(order.order.subscription.initiedFee).value() + numeral(order.order.subscription.processingFee).value() * numeral(order.order.subscription.paymentPeriod).value());
                  } else {
                     billingDate = '';
                  }

                  if (order.order.order_title) {
                     $('select[name="order_id"] option:selected').text(order.order.order_title);
                  }
                  _invoice.displayCurrency(currency);

                  //add schedule
                  _invoice.loadSchedule(order.schedule_payment);

                  //add history
                  _invoice.loadHistory(order.history_payment);

               }
            },

         })
      } else {
         $('#search_order_error').empty();
      }
   },

   getTotalPaymentAmount: function () {
      let total = 0;
      $('#tb_acct_pay_show tbody tr[data-invoice="' + $('#form_invoice [name=ID]').val() + '"] td.pay_amount').each(function (index, elem) {
         total += numeral(elem.innerHTML).value();
      });
      return total;
   },

   displayCurrency: function (data) {
      if (data.payment !== undefined) {
         $('#_payment_order').text(numeral(data.payment).format('$ 0,0.00'));
         $('input[name="payment"]').val(numeral(data.payment).value());
      }
      if (data.balance !== undefined) {
         $('#_balance_order').text(numeral(data.balance).format('$ 0,0.00'));
         $('input[name="balance"]').val(numeral(data.balance).value());
         if (numeral(data.balance).value() <= 0) {
            $('#form_invoice #display-acct-pay').remove();
            $('#acct-pay-modal').modal('hide');
            // $('#acct-pay-modal').remove();
            // $('.modal-backdrop').remove();
            $('#form-pay-acct .payment_content').prepend('<div class="alert alert-warning">The invoice had been paid. The balance is ' + numeral(data.balance).format('$ 0,0.00') + '</div>');
         } else {
            $('#acct-pay-btn-sub').prop('disabled', false);
         }
      }
      if (data.total !== undefined) {
         $('#_total_order').text(numeral(data.total).format('$ 0,0.00'));
         $('input[name="total"]').val(numeral(data.total).value());
      }
      if (data.processingFee !== undefined) {
         $('#_processing_order').text(numeral(data.processing_fee ? data.processing_fee : 0).format('$ 0,0.00'));
      }
      if (data.discount !== undefined) {
         $('#_order_discount').text(numeral(data.discount).format('$ 0,0.00'));
      }
      if (data.order_discount !== undefined) {
         $('#_discount').text(numeral(data.order_discount).format('$ 0,0.00'))
      }
      if (data.billingCircle !== undefined) {
         $('#_billing_circle').text(data.billingCircle ? data.billingCircle : 'Month');
      }
      if (data.initFee !== undefined) {
         $('#_init_fee').text(numeral(data.initFee).format('$ 0,0.00'))
      }

      if (data.total_processing_fee !== undefined) {
         $('#_total_processing_fee').text(numeral(data.total_processing_fee).format('$ 0,0.00'))

      }

      if (data.order_invoice_payment) {
         $('#_order_invoice_payment').text(numeral(data.order_invoice_payment).format('$ 0,0.00'))
      }

      if (data.grand_total) {
         $('#_grand_total_order').text(numeral(data.grand_total).format('$ 0,0.00'))
      }

      if (data.contract_overage) {
         if (numeral(data.contract_overage).value() > 0) {
            $('#_contract_overage').text(numeral(data.contract_overage).format('$ 0,0.00'));
         } else {
            $('#_contract_overage').text('$ 0.00');
         }
      }
   },

   validateInvoiceOption: {
      ignore: [],
      rules: {
         order_id: { required: true, number: true },
         warranty: { required: true, number: true },
         customer: { required: true },
         salesperson: { required: true },
         total: { required: true, number: true },
         // balance: { required: true, number: true, min: 0, max: function () { var _max = parseFloat($('input[name="total"]').val()); return _max; } },
         // payment: { required: true, number: true, min: 0, max: function () { var _max = parseFloat($('input[name="total"]').val()); return _max; } },
         balance: { required: true, number: true },
         payment: { required: true, number: true },
         invoiceid: { required: true, digits: true, minlength: 1, maxlength: 15 },
      }, messages: {
         invoiceid: { digits: 'Invoice must be the digits' },
         order_id: { number: 'This field is required' }
      },
      submitHandler: function () {
         var _formData = $.extend({}, template_data);
         var _data = $("#form_invoice").serializeArray()
         _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
               _formData[elem.name] = elem.value;
            }
         });
         _formData.notes = invoiceNote.getNotes();
         _formData.invoiceid = $('#invoice_extend_number').text() + $('input[name="invoiceid"]').val();
         _formData.billingDate = billingDate;
         _formData.ledger = _ledgerList;
         _formData._payaccList = _payaccList;
         _formData.total = parseFloat(_formData.total);
         _formData.payment = Invoice.prototype.getTotalPaymentAmount();
         _formData.balance = _formData.total - _formData.payment;
         _formData.invoice_payment = invoice_payment;

         /*f($('#form_invoice #acct-approved').is(":checked")){
             _formData.approved= _formData.private_key;
         }*/

         var _link = link._invoiceAddNew;
         if ((getUrlParameter('id') && $('input[name="ID"').val() != '')) {
            _link = link._invoiceEdit;
            if (Invoice.invoice) {
               for (var key in Invoice.invoice) {
                  var includeField = ['salesperson', 'customer', 'invoiceid', 'ledger', 'order_id', 'total', 'notes'];
                  if (_formData[key] == undefined && includeField.includes(key)) {
                     _formData[key] = Invoice.invoice[key];
                  }
               }
            }

         } else {
            // _formData.balance = _formData.total;
            // _formData.payment = 0;
         }
         delete _formData.salesperson_display;
         delete _formData.payment_type;
         Invoice.prototype.checkInvoiceID().then(function () {
            $.ajax({
               url: _link,
               type: 'post',
               data: _formData,
               success: function (res) {
                  if (!res.startsWith('{')) {
                     messageForm('Error! An error occurred. Please try later', false);
                     return res;
                  } else {
                     var tmp = JSON.parse(res);
                     if (tmp["SAVE"] == 'FAIL') {
                        messageForm('Error! An error occurred. ' + tmp['ERROR'], false);
                        return;
                     } else if (tmp["SAVE"] == 'SUCCESS') {
                        if (_link == link._invoiceAddNew) {
                           _href = host2 + "#ajax/invoice-form.php?id=" + tmp.ID;
                           $('#form_invoice [name=ID]').val(tmp.ID);
                           responseSuccessForward('You have successfully added the new invoice', true, '#form_invoice #message_form', _href, 'Go to invoice');
                           return;
                        } else {
                           messageForm('You have successfully edited the invoice', true, '#form_invoice #message_form');
                           $('select[name="customer"]').prop('disabled', true);
                           $('input[name="invoiceid"]').prop('disabled', true);
                           return;
                        }
                     }
                  }
               }
            })
         }).catch(function (e) { })
      }
   },
   checkInvoiceID: function () {
      return new Promise(function (resolve, reject) {
         var currentYear = $('#invoice_extend_number').text();
         var inv_id = $('input[name="invoiceid"]').val();
         if (inv_id != '') {
            if (currentYear + inv_id == Invoice.invoiceid) {
               return resolve(true);
            }
            $.ajax({
               url: link._invoiceNumExisting,
               type: 'post',
               data: { token: localStorage.getItemValue('token'), invoiceid: currentYear + inv_id },
               success: function (res) {
                  if (res == 'false') {
                     $('input[name="invoiceid"]').removeClass('state-error');
                     $('input[name="invoiceid"]').addClass('state-success');

                     $('input[name="invoiceid"]').parent().children('span.item_addon').show();
                     $('#invoice_error').empty();
                     return resolve(true);
                  } else {
                     $('#invoice_error').html('<p class="error">This invoice number is already exist</p>');
                     $('input[name="invoiceid"]').addClass('state-error');
                     $('input[name="invoiceid"]').removeClass('state-success');
                     $('input[name="invoiceid"]').parent().children('span.item_addon').hide();
                     return reject(false);
                  }
               }
            });
         } else {
            return reject(false);
         }
      });
   },

   removeLedger: function () {
      $('#tb_product_show tbody').empty();
      $('#td_payment_number').text(1);
      $('#tb_ledger_show tbody').empty();
   },

   confirmPayment: function (elem) {
      if (elem != undefined) {
         var currentRow = $(elem).closest('tr').find('td');
         var item = {};
         item.payment_schedule_id = currentRow.eq(0).text();

         var ledger_payment_note = prompt("Please enter note", "Pay for schedule " + item.payment_schedule_id);

         if (ledger_payment_note != null) {

            item.ledger_order_id = currentRow.eq(1).text();
            item.ledger_credit = numeral(currentRow.eq(2).text()).value();
            item.ledger_payment_note = ledger_payment_note;
            item.ledger_type = 'Cash';
            item.invoiceDate = currentRow.eq(3).text();

            var ledger = new Ledgers(item);

            $('#tb_ledger_show tbody').append(ledger.createTableLedgerRow());

            _ledgerList.push(item);
            invoice_payment += item.ledger_credit;

            var balance_current = ledger.decreaseCurrency(numeral($('input[name="balance"]').val()).value());
            var payment_current = ledger.increaseCurrency(numeral($('input[name="payment"]').val()).value());

            $('#_balance_order').text(numeral(balance_current).format('$ 0,0.00'));
            $('#_payment_order').text(numeral(payment_current).format('$ 0,0.00'));

            $('input[name="balance"]').val(balance_current);
            $('input[name="payment"]').val(payment_current);

            $(elem).closest('tr').remove();
         }
      }
   },
   loadHistory: function (list) {
      if (list && list.length > 0) {
         historyTable = $('#tb_invoice_history').DataTable({
            sDom: "t" +
               "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            data: list,
            destroy: true,
            columns: [
               { data: 'id', title: '#', className: 'text-center' },
               {
                  data: function (data) {
                     var _html = '';
                     if (data.invoiceID && data.invoiceNum) {
                        _html = '<a href="./#ajax/invoice-form.php?id=' + data.invoiceID + '">' + data.invoiceNum + '</a>'
                     } else if (data.invoiceID) {
                        _html = '<a href="./#ajax/invoice-form.php?id=' + data.invoiceID + '">' + data.invoiceID + '</a>'
                     }
                     return _html;
                  }, title: 'Invoice&nbsp;#',
               },
               {
                  data: function (data) {
                     return numeral(data.amount).format('$ 0,0.00');
                  }, className: 'text-right', title: 'Payment Amount'
               },
               {
                  data: function (data) {
                     return numeral(numeral(data.amount).value() + numeral(data.fee ? data.fee : 0).value()).format('$ 0,0.00');
                  }, className: 'text-right', title: 'Total'
               },
               { data: 'invoiceDate', title: 'Invoice&nbsp;Date' }
            ]
         })
         $('#history_table').show();
      } else {
         if (historyTable)
            historyTable.clear().draw();
         $('#history_table').hide();
      }
   },
   loadSchedule: function (list) {
      if (list && list.length > 0) {
         var _html = [];
         list.forEach(function (item) {
            _html.push('<tr><td class="text-center">' + item.id + '</td>' +
               '<td class="text-center">' + (item.orderID ? item.orderID : '') + '</td>' +
               '<td class="text-right">' + numeral(item.amount).format('$ 0,0.00') + '</td>' +
               '<td class="text-center">' + (item.invoiceDate ? item.invoiceDate : '') + '</td>' +
               '<td class="text-center" style="max-width:40px;" onclick="confirmPayment(this)" role="tooltip" title="Click to confirm to pay for this schedule">' +
               '<a class="text-center" style="max-width:40px;">' +
               '<i class="fa fa-check-circle-o text-success" style="font-size:20px"></i>' +
               '</a>' +
               '</td></tr>'
            );
         });
         $('#tb_invoice_schedule tbody').html(_html.join(''));
         // $('#schedule_table').show();
      } else {
         $('#tb_invoice_schedule tbody').empty();
         $('#schedule_table').hide();
      }
   },

   fromPayment: function (responseData, formData) {
      //var currentRow = $(elem).closest('tr').find('td');
      var item = responseData.ledger
      // //item.payment_schedule_id ;
      // //var ledger_payment_note = prompt("Please enter note", "Pay for schedule " + item.payment_schedule_id);
      // item.ledger_order_id = $('#form_invoice #order_search option:selected').val();
      // item.ledger_credit = amount;
      // item.ledger_payment_note = note;
      // item.ledger_type = payType;
      // item.tran_id = tranID;
      // //item.invoiceDate ;

      var ledger = new Ledgers(item);

      $('#tb_ledger_show tbody').append(ledger.createTableLedgerRow());

      _ledgerList.push(item);

      //var acc_item={};
      //acc_item.tran_id = tranID;
      //acc_item.order_id = $('#form_invoice #order_search option:selected').val();
      _payaccList.push(responseData.pay_id);

      invoice_payment = parseFloat(invoice_payment) + parseFloat(item.ledger_credit);

      var balance_current = ledger.decreaseCurrency(numeral($('input[name="balance"]').val()).value());
      if (balance_current < 0) {
         $('#display-acct-pay').hide();
         balance_current = 0;
      }


      var payment_current = invoice_payment;

      this.displayCurrency({
         balance: balance_current,
         payment: payment_current,
      })

   },
   forwardFromOrder: function () {
      let c_id = getUrlParameter('c'),
         c_name = getUrlParameter('cn'),
         s_id = getUrlParameter('s'),
         s_name = getUrlParameter('sn'),
         order = getUrlParameter('o');

      $('[name=customer]').append('<option value="' + c_id + '" selected>' + c_name + '</option>').trigger('change');
      setTimeout(function () {
         $('[name=salesperson]').val(s_id).trigger('change');
         $('[name=order_id]').val(order).trigger('change');
         $('[name=order_id]').prop('disabled', false);
      }, 500);

   },

}
var _invoice = new Invoice();
_invoice.init(function () {
   delete window.invID
   if (getUrlParameter('id') != undefined && getUrlParameter('id') != '' && getUrlParameter('id') != '0') {
      _invoice.initUpdate(getUrlParameter('id'));
   } else if (getUrlParameter('c') && getUrlParameter('o')) {
      _invoice.forwardFromOrder();
   } else {
      $('select[name="order_id"] optgroup#optgroupPayAll').prop('disabled', 'disabled');
   }
});