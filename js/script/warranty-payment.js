function WarrantyPayment() { }
WarrantyPayment.prototype = {
   constructor: WarrantyPayment,
   init: function () {
      this.bindEvent();
   },
   bindEvent: function () {
      var coll = document.getElementsByClassName("collapsible");
      for (var i = 0; i < coll.length; i++) {
         coll[i].addEventListener("click", function () {
            var content = $('.payment_content[data-id=' + $(this).data('id') + ']');
            $('#fs_payment_method').slideToggle(200);
            $('#warranty_form').slideToggle(200);
            content.slideToggle(200);
         });
      }
      $('#warranty_form [name=warranty_payer_type]').change(function () {
         var buyer_id = localStorage.getItemValue('userID');
         switch (this.value) {
            case '1':
            case 1:
               buyer_id = $('#warranty_form .warranty_buyer_id').val();
               break;
            case '2':
            case 2:
               buyer_id = $('#warranty_form .warranty_buyer_agent_id').val();
               break;
            case '3':
            case 3:
               buyer_id = $('#warranty_form .warranty_seller_agent_id').val();
               break;
            case '4':
            case 4:
               buyer_id = $('#warranty_form .warranty_escrow_id').val();
               break;
            case '5':
            case 5:
               buyer_id = $('#warranty_form .warranty_mortgage_id').val();
               break;
         }
         if (!buyer_id || buyer_id == '') {
            messageForm('Please select ' + $(this).closest('section').find('label.input:first').text(), 'warning');
            $(this).prop('checked', false);
         } else {
            WarrantyPayment.prototype.fillUserInfo(buyer_id);
         }
      });

      $('#warranty_form .warranty_buyer_id, #warranty_form .warranty_seller_agent_id, #warranty_form .warranty_buyer_agent_id, #warranty_form .warranty_mortgage_id, #warranty_form .warranty_escrow_id').change(function () {
         var check = $(this).parent().find('input[name=warranty_payer_type]:first').prop('checked')
         if (check) {
            WarrantyPayment.prototype.fillUserInfo(this.value);
         }
      });

      $('.pane_payment_credit [name=cardNumber]').keydown(function (e) {
         var keyChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', 'Backspace', 'Tab', 'Ctrl', 'a']
         if (!keyChar.includes(e.key)) {
            e.preventDefault();
            return;
         }
         if (e.key == 'Backspace') {
            var tmp = 1;
            var vl = this.value.split('');
            vl.pop();
            if (vl.join('').endsWith(' ')) tmp = 2;
            this.value = this.value.substring(0, this.value.length - tmp);
            e.preventDefault();
         } else if (e.key == 'Tab') {
         } else {
            if ([4, 9, 14].includes(this.value.length)) {
               this.value = this.value + ' ';
            }
         }
      });

      $('.payment-methods button').click(function () {
         switch (this.innerHTML) {
            case 'Check':
               $('.pane_payment_credit').hide(200);
               break;
            case 'Bank to bank':
               $('.pane_payment_credit').hide(200);
               break;
            case 'Cash':
               $('.pane_payment_credit').hide(200);
               break;
            case 'Credit':
               $('.pane_payment_credit').show(200);
               break;

         }
         $('.payment-methods button').removeClass('active btn-info');
         $(this).addClass('active btn-info');
         $('[name=warranty_payer_typement_type]').val(this.innerHTML);
      });

      $('.acceptPay').click(function () {
         window.payment_submit_form = 'acceptPay';
         $('#warranty_form').submit();
      });

      

      $('button.collapsible, .btn-payment.btn-credit').click();

      $('.backPay').click(function () {
         $('#fs_payment_method').slideToggle(200);
         $('#warranty_form').slideToggle(200, function () {
            var scrollHeight = $(document).height();
            var scrollPosition = $(window).height() + $(window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
               // when scroll to bottom of the page
            }
         });
      });

      $('.pane_payment_credit input').focusin(function () {
         var name = this.getAttribute('name');
         var img = $('.img-credit-card:first');
         var widthImg = img.width();
         var heightImg = img.height();
         var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="credit-card_svg" style="width:' + widthImg + 'px;height:' + heightImg + 'px;">';
         var x = 0, y = 0, w = 10, h = 10;
         switch (name) {
            case 'cardNumber':
               x = widthImg / 10;
               y = heightImg / 1.94;
               w = widthImg / 10 * 7.8;
               h = heightImg / 10 * 1.2;
               break;
            case 'card_holder':
               x = widthImg / 9.3;
               y = heightImg / 10 * 8;
               w = widthImg / 3;
               h = heightImg / 10 * 1.1;
               break;
            case 'expirationDate':
               x = widthImg / 10 * 4.2;
               y = heightImg / 10 * 6.8;
               w = widthImg / 5.4;
               h = heightImg / 10 * 1.1;
               break;
            default:
               return;

         }
         svg += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" stroke="red" fill="none"/>';
         svg += '</svg>';
         // $('.credit-card_container svg').remove();
         $('.credit-card_container').prepend(svg);

      }).focusout(function () {
         $('.credit-card_container svg').remove();
      });

   },
   getPayment: function () {
      var _data = {};
      var hasData = false;
      $('.pane_payment_credit input, .pane_payment_credit textarea').each(function () {
         if (this.value != '') hasData = true;
         _data[this.getAttribute('name')] = this.value;
      });
      _data.amount = numeral($('#warranty_form #_total').text()).value();
      _data.sale_id = $('#warranty_form [name=salesperson]').val();
      if (_data.amount !== undefined && _data.sale_id !== '') {
         hasData = true;
      }
      if (window.payment_user_info) {
         hasData = true;
         _data.buyer_id = window.payment_user_info.buyer_id;
      } else {
         hasData = false;
      }
      if (!hasData) return null;
      _data.cardNumber = _data.cardNumber ? _data.cardNumber.replace(/ /g, '') : '';
      return _data
   },
   fillPayment: function (data) {
      $('.btn-payment').removeClass('active btn-info');
      $('.btn-payment.btn-credit').addClass('active btn-info');
      for (var key in data) {
         $('.pane_payment_credit [name="' + key + '"]').val(data[key]);
      }
   },
   fillUserInfo: function (id) {
      $.ajax({
         url: link._warrantyPayee,
         type: 'post',
         dataType: 'json',
         data: { token: localStorage.getItemValue('token'), ID: id },
         success: function (res) {
            WarrantyPayment.prototype.fillPayment(res.list);
            res.buyer_id = id;
            window.payment_user_info = res.list;
         },
         error: function (e) {

         }
      })
   },
   sendPay: function (callback) {
      var myData = WarrantyPayment.prototype.getPayment();
      if (!myData) {
         messageForm('Please choose warranty payee', 'warning');
         return;
      }
      myData.token = localStorage.getItemValue('token');
      myData.warranty_order_id = $('#warranty_order_id').val();
      if (myData.warranty_order_id instanceof Array) myData.warranty_order_id = myData.warranty_order_id.join(',');
      $.ajax({
         url: link._sandBoxPayment,
         type: 'post',
         dataType: 'json',
         data: myData,
         success: function (res) {
            if (res.Success == 1 && res.idtransaction != '' && res.idtransaction != 0) {
               var _html =
                  '<div class="alert alert-success" role="alert">' +
                  '<div>The payment is successful</div>' +
                  '<div>Transaction ID: ' + res.TransactionID + '</div>' +
                  '<div>Warranty Transaction ID: ' + res.idtransaction + '</div>' +
                  '<div>Please Click on Submit to complete warranty</div>' +
                  '</div>';
               $('#payment_trans_notify').html(_html).delay(10000).fadeOut(200, function () {
                  if (callback) callback(true);
               });
               messageForm('The payment is successful', true)
            } else {
               $('#payment_trans_notify').html('<div class="alert alert-danger" role="alert">An Error was occured. Please check again</div>').delay(5000).fadeOut(200, function () {
                  if (callback) callback(false);
               });

            }

         },
         error: function (e) {
            $('#payment_trans_notify').html('<div class="alert alert-danger" role="alert">An Error was occured. Please check again</div>').delay(5000).fadeOut(200, function () {
               if (callback) callback(false);
            });;
         }
      });

   }
}

new WarrantyPayment().init();
