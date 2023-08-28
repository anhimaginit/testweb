function ClaimStart() { }
ClaimStart.prototype = {
   constructor: ClaimStart,
   claim_start_fee: function (callback) {
      $.get('php/getSession.php?data=settingPage', function (res) {
         if (res && res != '') {
            let setting = JSON.parse(res);
            if (setting.claim_start_fee && setting.claim_start_fee != '') {
               callback(Object.freeze(setting.claim_start_fee));
            }
            else {
               callback(Object.freeze(65.00));
            }
         } else {
            callback(Object.freeze(65.00));
         }
      })
   },
   init: function () {
      if (!window.claim_new_info) window.claim_new_info = {};
      if (!window.warranty_info && !getUrlParameter()) {
         if (window.location.href.indexOf('claim-start') > 0) {
            $.SmartMessageBox({
               title: "<label class='txt-color-orangeDark bold'>Invalid Information</label>",
               content: "Your information is invalid to implement start claim payment",
               buttons: '[OK]'

            }, function (ButtonPressed) {
               window.history.back();
            });
            return;
         }
      }
      let payee = '';

      if ((getUrlParameter('id') && window.location.href.indexOf('claim_form') > 0) || window.warranty_info) {
         if (window.warranty_info.warranty_payer_type) {
            switch (window.warranty_info.warranty_payer_type) {
               case 1:
                  payee = window.warranty_info.buyer_name;
                  break;
               case 2:
                  payee = window.warranty_info.buyer_agent_name;
                  break;
               case 3:
                  payee = window.warranty_info.seller_agent_name;
                  break;
               case 4:
                  payee = window.warranty_info.affTitle_name;
                  break;
               case 5:
                  payee = window.warranty_info.mortgage_name;
                  break;
            }
         }

         this.claim_start_fee(_payment_service_fee => {

            claim_start_fee = _payment_service_fee;
            if (!window.claim_new_info.total) window.claim_new_info.total = _payment_service_fee;
            if (!window.claim_new_info.balance) window.claim_new_info.balance = _payment_service_fee - window.claim_new_info.payment;
            if (!window.claim_new_info.payment) window.claim_new_info.payment = 0;

            $('#_customer').text(window.warranty_info.buyer_name);
            $('#_warranty').text(window.warranty_info.warranty_serial_number);
            $('#_payee').text(payee);

            $('#_payment_order_id').html('<a href="./#ajax/order-form.php?id=' + window.claim_new_info.order_id + '">#' + (window.claim_new_info.order_id || '') + '</a>');
            $('#_payment_invoice_id').html('<a href="./#ajax/invoice-form.php?id=' + window.claim_new_info.invID + '">#' + (window.claim_new_info.invID || '') + '</a>');
            $('#_payment_claim_id').text('#' + (window.claim_new_info.ID || ''));

            $('#_payment_on_account').text(numeral(window.claim_new_info.total_overage).format('$ 0,0.00'));
            $('#_payment_discount_code').text('$ 0.00');

            $('#_payment_service_fee').text(numeral(window.claim_new_info.total).format('$ 0,0.00'));
            $('#_payment_total').text(numeral(window.claim_new_info.total).format('$ 0,0.00'));
            $('.claim_start_info [name=acc_pay_amount]').val(window.claim_new_info.balance).focusout();
            if (window.claim_new_info.balance <= 0) {
               $('.claim_start_info:first').prepend('<img src="./img/invoice/paid.png" style="width: 65px; height: 55px; right:1px; top:40px; padding: 0px 15px; position: absolute; z-index: 1;transform: rotate(35deg);border: 2px solid red;" alt="">');
            }

            if (window.claim_new_info.payment_acct) {
               if (window.claim_new_info.payment_acct instanceof Array) {
                  if (window.claim_new_info.payment_acct.length > 0) {

                     let _notes = '<table class="table" style="width:100%"><tbody>';
                     let payment = 0;
                     window.claim_new_info.payment_acct.forEach(element => {
                        _notes += `
                     <tr>
                        <td style="width:60px;">${element.pay_type}</td>
                        <td style="width:70px;">${numeral(element.pay_amount).format('$0,0.00')}</td>
                        <td>${(element.pay_note && element.pay_note != '' ? element.pay_note : '<span style="color: #ccc; font-style: italic;">(Empty)</span>')}</td>
                        <td style="width:80px;">${(element.pay_date ? element.pay_date.split(' ').shift() : '')}</td>
                     </tr>`;
                        payment += numeral(element.pay_amount).value();
                     });
                     _notes += '</tbody></table>';

                     let balance = numeral(window.claim_new_info.total).value() - payment;
                     $('#_payment_note').html(_notes);
                     $('#_payment_balance').text(numeral(balance).format('$ 0,0.00'));
                     $('#_payment_payment').text(numeral(payment).format('$ 0,0.00'));

                     window.claim_new_info.payment = payment;
                     window.claim_new_info.balance = balance;
                  } else {
                     $('#_payment_note').html('<span style="color: #ccc; font-style: italic;">(Empty)</span>');
                     $('#_payment_balance').text('$ 0.00');
                     $('#_payment_payment').text('$ 0.00');
                  }
               } else if (typeof window.claim_new_info.payment_acct == 'string') {
                  $('#_payment_note').text(window.claim_new_info.payment_acct);
               } else {
               }
               $('#_payment_note').parent().removeClass('hidden');
            } else {
               $('#_payment_note').parent().addClass('hidden');
               $('#_payment_note').empty();
            }
         });
      }

      this.bindEvent();
   },
   bindEvent: function () {
      let _self = this;
      $('.btnConfirm, .btnConfirmPayment').click(function () {
         _self.submitForm();
      });
      $('[name="pay_type"]').change(function () {
         if (this.value == 'OnAcct') {
            let on_acc = numeral(window.claim_new_info.total_overage).value();
            let total = numeral(window.claim_new_info.balance).value();
            if (on_acc >= total) {
               window.payvalue = total;
            } else {
               messageForm('Your account isn\'t enough money to complete pay. This time you will pay ' + numeral(on_acc).format('$ 0,0.00') + '. The next time you need to complete payment', 'warning', '#message_invoice_service_fee');
               $('#_payment_total').text(numeral(total).format('$ 0,0.00'));
               $('.claim_start_info [name=acc_pay_amount]').val(numeral(on_acc).format('$ 0,0.00'))
               window.payvalue = on_acc;
            }
         } else {
            delete window.payvalue;
            $('#_payment_total').text(numeral(window.claim_new_info.balance).format('$ 0,0.00'));
         }
      });
   },
   submitForm: function () {
      let _self = this;
      let amount = numeral(window.claim_new_info.balance).value();
      let pay_amount_input = numeral($('.claim_start_info [name=acc_pay_amount]').val()).value();
      let pay_date = getDateTime(new Date($('.claim_start_info [name=acc_pay_date]').val()))
      // let discountValue = claimDiscount.getDiscountCodeValue(claim_start_fee);
      let _formData = $.extend({
         order_id: window.claim_new_info.order_id,
         invID: window.claim_new_info.invID,
         // pay_amount: window.payvalue ? window.payvalue : claim_start_fee,
         pay_amount: pay_amount_input <= amount ? pay_amount_input : amount,
         pay_type: $('[name=pay_type]:checked').val(),
         pay_note: $('[name=pay_note]').val(),
         approved: 0,
         bill_to: window.warranty_info.warranty_buyer_id,
         submit_by: localStorage.getItemValue('userID'),
         overage: 0,
         customer: $('#claim_form [name="customer"]').val(),
         payment_date: pay_date,
         is_overage: 1,
         contract_overage: 0
      }, template_data);
      $.ajax({
         url: link._payAcctAddNewUpdateINV,
         type: 'post',
         dataType: 'json',
         data: _formData,
         success: function (res) {
            if (res["SAVE"] == 'FAIL') {
               messageForm('Your payment is failed', false);
            } else {
               // _self.updateInvoice(res, _formData, function () {
               messageForm('Your payment is successful', true, '#claim_form #message_invoice_service_fee');
               window.claim_new_info.balance = window.claim_new_info.balance - _formData.pay_amount;
               window.claim_new_info.payment = numeral(window.claim_new_info.payment).value() + numeral(_formData.pay_amount).value();
               $('#_payment_balance').text(numeral(window.claim_new_info.balance).format('$ 0,0.00'));
               $('#_payment_payment').text(numeral(window.claim_new_info.payment).format('$ 0,0.00'));
               $('#_payment_total').text(numeral(window.claim_new_info.balance).format('$ 0,0.00'));
               $('#_payment_balance').closest('.item').appendTo('#_balance_target');
               $('.claim_start_info [name=acc_pay_amount]').val(window.claim_new_info.balance);
               if (window.claim_new_info.balance <= 0) {
                  window.complete_pay = btoa('' + window.claim_new_info.ID);
                  $('[name="pay_type"]').unbind('change');
                  $('.btnConfirmPayment').prop('disabled', true);
                  $('[name="paid"]').prop('disabled', false);
                  $('.claim_start_info:first').prepend('<img src="./img/invoice/paid.png" style="width: 65px; top:40px; height: 55px; right:1px; padding: 0px 15px; position: absolute; z-index: 1;transform: rotate(35deg);border: 2px solid red;" alt="">');
               }
               // })
            }
         },
         error: function (e) {

         }

      })
   },
   updateInvoice: function (resdata, formData, callback) {
      let invoice_data = $.extend({
         ID: window.claim_new_info.invID,
         customer: window.warranty_info.warranty_buyer_id,
         salesperson: window.warranty_info.warranty_salesman_id,
         total: window.claim_new_info.total,
         balance: window.claim_new_info.total - formData.pay_amount,
         payment: formData.pay_amount,
         invoice_payment: formData.pay_amount,
         order_id: formData.order_id,
         _payaccList: [resdata.pay_id],
         ledger: [{
            ledger_order_id: formData.order_id,
            ledger_credit: formData.pay_amount,
            ledger_payment_note: formData.pay_note,
            ledger_type: formData.pay_type,
            invoiceDate: getDateTime(),
            tran_id: resdata.pay_id
         }]
      }, template_data);

      $.ajax({
         url: link._invoiceEdit,
         type: 'post',
         dataType: 'json',
         data: invoice_data,
         success: function (res) {
            callback(res);
         },
         error: function (e) {

         }
      })
   }
}

