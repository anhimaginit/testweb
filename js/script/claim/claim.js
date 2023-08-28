function Claim() {
}
var transactionID = null;
var transactionList = [];
var oldTransaction = [];
var claimLimitList = [];
var total = 0;
var limit_table_length = 6;
var _selectLoader = new SelectLoader();
var vendors = [];
Claim.prototype = {
   constructor: Claim,
   init: function () {
      this.setView();
      this.bindEvent();
      sendMailForVendor = this.sendMailForVendor;
      contactToSupervisor = _claim.contactToSupervisor;
      claimNote = new NoteTable({
         form: 'Claim',
         table: '#claim_form #table_note_info'
      });
      claimNote.init();
   },
   setView: function () {
      $("#claim_form").validate(this.validateFormClaimOption);
      new ControlSelect2(['[name=customer]']);

      if ($('[name=value]').val() != '') {


         $('.datepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>'
         });

         $('[name=claim_assign]').select2({
            data: assigned_persons,
            // dropdownParent: $('#pane_assign'),
            minimumInputLength: 0,
            allowClear: true,
            escapeMarkup: function (markup) { return markup; },
            templateResult: function (data) {
               let $name = data.first_name ? data.first_name + ' ' : '';
               $name += data.last_name ? data.last_name : '';
               let $address = data.primary_city ? data.primary_city + ' - ' : '';
               $address += data.primary_state ? data.primary_state : '';
               let _html =
                  '<div class="media padding-2">' +
                  '<div class="media-body">' +
                  '<div class="username"><span class="bold">' + $name + '</span> <small class="pull-right">' + $address + '</small></div>' +
                  '<div>' + data.primary_email + '</div>' +
                  '</div>' +
                  '</div>';
               return _html;
            },
            templateSelection: function (data) {
               if (typeof data == 'string') return data;
               if (!data.first_name) return data.ID;
               return data.first_name + ' ' + data.last_name;
            }
         })
      }
   },
   bindEvent: function () {
      var _self = this;

      $('[name=warranty_ID]').change(function () {
         _self.setWarrantyDataID(this.value);
      });
      if ($('#claim_form [name=ID]').val() != '') {

         var approve_item = [];
         if (window.claim_config.approve_quote && (window.claim_config.approve_quote.edit == 'true' || window.claim_config.approve_quote.edit == true)) {
            approve_item.push('#approved_quote');
         } else {
            $('#approved_quote').prop('disabled', 'disabled');
         }
         if (window.claim_config.approve_invoice && (window.claim_config.approve_invoice.edit == 'true' || window.claim_config.approve_invoice.edit == true)) {
            approve_item.push('#approved_invoice');
         } else {
            $('#approved_invoice').prop('disabled', 'disabled');
         }

         if (approve_item.length > 0) {
            approve_item = approve_item.join(', ');
         }

         $(approve_item).change(function () {
            var id = $(this).attr('id');
            var lbl_id = '#lbl_' + id;
            _self.getApproved(this, lbl_id);
            $('#deny_type').val('owner');
            if ($(this).prop('checked')) {
               // _self.sendMailForVendor(true);
               $(this).closest('.onoffswitch-container').next('button.btnSendNotifyVendor').hide()
            } else {
               $(this).closest('.onoffswitch-container').next('button.btnSendNotifyVendor').show()
            }
         });

         if (window.claim_config.approve_pay && (window.claim_config.approve_pay.edit == 'true' || window.claim_config.approve_pay.edit == true)) {
            $('#please_pay').change(function () {
               $('#deny_type').val('acctant');
               if ($(this).prop('checked')) {
                  _self.sendMailForVendor(true);
               } else {
                  $('#deny_mail_popup').show();
               }
            })
         } else {
            $('#please_pay').prop('disabled', 'disabled');
         }
         $('.btnGetOverrideForm').click(function () {
            _self.getOverideForm();
         });
      }

      $('[name=customer]').change(function () {
         _self.loadWarranty($('select[name=warranty_ID]').val(), $(this).val());
      });
   },

   getApproved: function (elem, displayElem) {
      var status = $(elem).prop('checked');
      if (status == true) {
         if (displayElem)
            $(displayElem).text('Approved');
         return 1;
      } else {
         if (displayElem)
            $(displayElem).text('Decline');
         return 0;
      }
   },

   sendMailForVendor: function (status) {
      var mail_data = $.extend({}, template_data);;
      mail_data.create_by = $('[name=create_by]').val();
      mail_data.claim_assign = $('[name=claim_assign]').val();
      mail_data.warranty_ID = $('[name=warranty_ID]').val();
      mail_data.claim_ID = $('[name=ID]').val();
      mail_data.subject = $('#subject_deny').val();
      mail_data.body = $('#content_deny').val();
      mail_data.UID = $('[name=UID]').val().join(',');
      mail_data.warranty_total = numeral($('#_total').text()).value()
      mail_data.vendor_invoice_number = $('[name=vendor_invoice_number]').val();
      mail_data.data_quote = claimQuote.getQuoteData();

      var type = $('#deny_type').val();
      var _link = '';

      if (status) {// accept
         // delete mail_data.subject;
         // delete mail_data.body;
         if (type == 'owner') {
            _link = link._mailOwnerApprove;
         } else if (type == 'acctant') {
            _link = link._mailAcctantApprove;
         }
      } else {// deny
         if (type == 'owner') {
            _link = link._mailOwnerSendDeny;
         } else if (type == 'acctant') {
            _link = link._mailAcctantSendDeny;
         }
      }
      if (_link != '') {
         $.ajax({
            url: _link,
            type: 'post',
            data: mail_data,
            dataType: 'json',
            success: function (res) {
               $('#subject_deny').val('');
               $('#content_deny').val('');
               $('#deny_type').val('');
               $('#deny_mail_popup').hide();
               if (res.send == true && !status)

                  messageForm('The mail is sent', true, '#resend_mail_popup .message_chat');
            },
         })
      }
   },

   /**--------VENDOR---------------------------------- */
   /**
    * @param {Number} value : selected value
    */
   loadVendor: function (value) {
      if (!value) value = [];
      $.ajax({
         url: link._claimVendors,
         type: 'post',
         data: $.extend({}, template_data),
         dataType: 'json',
         success: function (res) {
            var $select = $('[name=UID]');
            $('option', $select).remove();
            var options = $select.prop('options');
            if (!options) return;
            res.list.forEach(function (item) {
               options[options.length] = new Option(item.vendor_name + (item.com_name ? ' - ' + item.com_name : ''), item.ID, false, false);;
            });
            var vendor = [];
            value.forEach(function (item) {
               vendor.push(item.ID);;
            })
            $select.val(vendor).trigger('change');
         }
      });
   },
   /**--------WARRANTY---------------------------------- */
   loadWarranty: function (warrantyID, customerID) {
      if (!customerID) customerID = $('[name=customer]').val();;
      if (!warrantyID) warrantyID = '';
      var myData = $.extend({}, template_data);
      myData.contactID = customerID;
      $.ajax({
         url: link._warrantyForClaim,
         type: 'post',
         data: myData,
         dataType: 'json',
         success: function (res) {
            var $select = $('[name=warranty_ID]');
            $('option', $select).remove();
            var options = $select.prop('options');
            if (!options) return;
            options[0] = new Option('Select Warranty', '');
            res.list.forEach(function (item) {
               var display = 'ID: ' + item.ID + ' - Buyer: ' + item.buyer;
               options[options.length] = new Option(display, item.ID, false, false);
            });
            $select.val(warrantyID).trigger('change');
         }
      })
   },

   loadCustomer: function (callback) {
      $.ajax({
         url: link._contactGetList,
         type: 'post',
         data: $.extend({}, template_data),
         dataType: 'json',
         success: function (res) {
            if (res && res.length > 0) {
               res.forEach(function (item, index) {
                  res[index].customer_name = item.first_name + ' ' + item.last_name;
                  if (index == res.length - 1) {
                     res.sort(function (a, b) {
                        return a.customer_name.localeCompare(b.customer_name)
                     })
                     if (callback) callback(res);
                  }
               })
            }
         }
      });
   },

   setWarrantyDataID: function (id, callback) {
      if (id) {
         var data = {};
         if (id == '') {
            this.setWarrantyData();
            return;
         }
         data.token = _token;
         data.jwt = localStorage.getItemValue('jwt');
         data.private_key = localStorage.getItemValue('userID');
         data.ID = id;
         $.ajax({
            url: link._warrantyGetById,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (res) {
               var _data = res[0];
               Claim.prototype.setWarrantyData(_data, callback);
            }
         })
      }
   },

   setWarrantyData: function (value, callback) {
      if (!value) {
         $('#warranty_card').empty();
         $('#warranty_card').hide();
         return;
      }
      window.warranty_info = value;
      if (typeof value == 'string') value = JSON.parse(value);
      $('[name=warranty_ID]').val(value.ID);

      let _addressCity = [];
      if (value.warranty_city && value.warranty_city != '') _addressCity.push(value.warranty_city);
      if (value.warranty_state && value.warranty_state != '') _addressCity.push(value.warranty_state);
      if (value.warranty_postal_code && value.warranty_postal_code != '') _addressCity.push(value.warranty_postal_code);

      var s = '<table id="warranty_infomation_table" style="border-collapse: separate; border-spacing: 8px; width:100%" class="text-dark" title="Go to warranty ' + value.warranty_serial_number + '"><tbody>' +
         '<tr><td class="bold">Warranty ID:</td><td>' + value.ID + '</td></tr>' +
         '<tr><td class="bold">Serial Number:</td><td>' + value.warranty_serial_number + '</td></tr>' +
         '<tr><td class="bold">Policy Holder:</td><td>' + value.buyer_name + '</td></tr>' +
         '<tr><td class="bold">Salesman:</td><td>' + (value.saleman_name ? value.saleman_name : '') + '</td></tr>' +
         '<tr><td class="bold">Start date:</td><td>' + (value.warranty_start_date ? value.warranty_start_date : '') + '</td></tr>' +
         '<tr><td class="bold">End date:</td><td>' + (value.warranty_end_date ? value.warranty_end_date : '') + '</td></tr>' +
         '<tr><td class="bold">Closing date:</td><td>' + (value.warranty_closing_date ? value.warranty_closing_date : '') + '</td></tr>' +
         '<tr><td class="bold" style="vertical-align: baseline;">Address:</td><td style="line-height:2;">' + value.warranty_address1 + '<br><span class="uppercase-character">' + _addressCity.join(', ') + '</span></td></tr>' +
         '<tr class="ignore_open_window" style="line-height:2;"><td class="bold">' +
         'Email:<br>' +
         'Phone:</td>' +
         '<td style="display:flex"><div class="pr-20">' +
         (value.buyer_email || '&nbsp;') + '<br>' +
         (value.buyer_phone || '&nbsp;') + '</div>' +
         (getUrlParameter('id') && ((value.buyer_email && value.buyer_email != '') || (value.buyer_phone && value.buyer_phone != ''))
            ? '<div style="display: inline-table;">' +
            //action onclick for .btnSendWarranty in js/script/claim/claim-send-mail.js (tr has class ignore_open_window)
            '<button type="button" title="" class="btn btn-sm btn-primary btnSendWarranty">Send mail</button>' +
            //insert more buttons here

            //action in new file or your custom
            '</div>'
            : '') +
         '</td></tr>' +
         //insert 1 infomation in 1 tr
         '</tbody></table>';
      $('#warranty_card').html(s);
      $('#warranty_card').show();
      if (callback) callback();
   },

   unsetClaimLimitData: function () {
      $('#transaction_table tbody').empty();
   },

   /**
    * --------TRANSACTION---------------------------------
    * 
    * @param {JSON} list : JSON claim limit
    */
   setEventClaimLimit: function () {
      var _self = this;
      $('#limit_table input').change(function () {
         var claim = numeral(this.value).value();
         var available = numeral($(this).closest('td').prev('td').prev('td').text()).value();
         if (claim <= available) {
            _self.editLimitTable($(this).closest('tr').index());
            // _self.addTransaction(this);
         } else {
            _self.changeClaimRow($(this).closest('tr').index());
         }
      });
   },

   addTransaction: function (elem) {
      var tds = $(elem).closest('tr').find('td');
      var data = {
         date: getDateTime(),
         name: tds.eq(0).text(),
         origin: tds.eq(1).text(),
         current: tds.eq(2).text(),
         available: tds.eq(3).text(),
         transaction: tds.eq(4).text(),
         claim: tds.eq(5).find('input').val(),
         person: localStorage.getItemValue('userID')
      }
      if (parseFloat(data.claim) > 0) {
         $(elem).val('0.00');
         transactionList.push(data);
      }
   },

   editLimitTable: function (index, isOverride) {
      if (claimLimitList[index]) {
         var value = numeral($('#limit_table tbody tr:eq(' + index + ') input').val()).value(),
            available = numeral($('#limit_table tbody tr:eq(' + index + ') td:eq(2)').val()).value() - value;
         claimLimitList[index].claim = value;
         claimLimitList[index].available = available;
         if (isOverride != undefined) {
            claimLimitList[index].isOverride = isOverride;
         }
         $('#limit_table tbody tr:eq(' + index + ') button').closest('td').remove();
         this.getTotal();
         this.changeTransaction(index);
      }
   },
   /**
    * 
    * @param {Integer} indexItem : index limit table change
    */
   changeTransaction: function (indexItem) {
      if (indexItem == undefined || indexItem == null || indexItem < 0 || indexItem > claimLimitList.length - 1) return;
      var isAdd = false;
      var tr = $('#limit_table tbody tr:eq(' + indexItem + ')');
      var value = numeral(tr.find('input').val()).value();
      var name = tr.find('.name').text();
      transactionList.forEach(function (item, index) {
         if (item.name == name) {
            transactionList[index].claim = value;
            isAdd = true;
            return;
         };
      });
      if (!isAdd) {
         transactionList.push({
            name: name,
            claim: value,
            origin: tr.find('.origin').text(),
            available: tr.find('.available').text(),
            current: tr.find('.current').text(),
            person: localStorage.getItemValue('userID'),
            date: getDateTime()
         })
      }
   },

   editTransactionFooter: function (elemRow, data) {
      $(elemRow).eq(3).text(numeral(data.available).format('0,0.00'));
      $(elemRow).eq(5).text('');
   },

   getTransactionList: function () {
      return transactionList;
   },

   getClaimLimit: function () {
      var result = [];
      claimLimitList.forEach(function (item, index) {
         result[index] = {};
         result[index][item.name] = item.claim ? item.claim : 0;
      })
      return JSON.stringify(result);
   },

   setClaimLimit: function (listData) {
      $('#limit_table tbody').find('tr').each(function (index, elem) {
         var value = listData[index][$(elem).eq(0).text()];
         if (!value) value = 0;
         $(elem).eq(5).find('input').val(value);
      })
   },

   changeClaimRow: function (index) {
      var _self = this;
      var row = $('#limit_table tbody').find('tr').eq(index),
         rows = row.find('td'),
         claim = numeral(rows.eq(5).find('input').val()).value(),
         available = numeral(rows.eq(3).text()).value();
      if (available >= claim) {
      } else {
         if (isAdmin()) {
            if (rows.length == limit_table_length) {
               row.append('<td class="hasinput col-1"><button type="button" class="btn btn-sm btn-default btnOverride">Overide</button></td>');
               $('.btnOverride').click(function () {
                  _self.showModal($(this).closest('tr').index());
               })
            }
         } else {
            if (rows.length == limit_table_length) {
               row.append('<td class="hasinput col-1"><button type="button" class="btn btn-sm btn-default" onclick="contactToSupervisor()">Contact</button></td>');;
            }
         }
      }
   },

   createTransactionList: function (list) {
      if (!list) return;
      var result = '';
      list.forEach(function (data, index) {
         if (!data.original) data.original = data.origin ? data.origin : 0;
         if (!data.transaction) data.transaction = 0;
         if (!data.current) data.current = data.original;
         if (!data.available) data.available = data.current - parseFloat(data.transaction);
         if (!data.claim) data.claim = 0;
         if (!data.person) data.person = localStorage.getItemValue('userID');
         var isOverride = null;
         if (data.claim > data.available) isOverride = true;
         list[index] = data;
         result += '<tr>' +
            '<td class="hasinput">' + data.name + '</td>' +
            '<td class="text-right hasinput">' + numeral(data.original).format('0,0.00') + '</td>' +
            '<td class="text-right hasinput">' + numeral(data.current).format('0,0.00') + '</td>' +
            '<td class="text-right hasinput">' + numeral(data.available).format('0,0.00') + '</td>' +
            '<td class="text-right hidden">' + numeral(data.transaction).format('0,0.00') + '</td>' +
            '<td class="text-right">' + numeral(data.claim).format('0,0.00') + '</td>' +
            '<td class="hidden">' + data.person + '</td>' +
            '<td class="hidden">' + (isOverride ? isOverride : '') + '</td>';
         result += '</tr>';
      });
      transactionList = list;
      $('#transaction_table tbody').html(result);
      return;
   },

   showModal: function (index) {
      var name = claimLimitList[index].name;
      var claim = numeral($('#limit_table tbody tr:eq(' + index + ') input').val()).value();
      var available = numeral($('#limit_table tbody tr:eq(' + index + ') td:eq(3)').text()).value();
      $('#overide_form input[name=overide_name]').val(name);
      $('#overide_form input[name=overide_available]').val((available));
      $('#overide_form input[name=overide_amount]').val(claim);
      $('#overide_form input[name=overide_index]').val(index)
      $('#modal_overide_claim').modal('show');
   },
   //_userCheckUserPass
   contactToSupervisor: function () {
      var modal = '<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="modal_contact_supervisor">' +
         '<div class="modal-dialog">' +
         '<div class="modal-content padding-10">' +
         '<div class="MessageBoxMiddle">' +
         '<span class="MsgTitle">' +
         '<span class="text-danger">Contact to supervisor</span>' +
         '</span>' +
         '<br><br>' +
         '<input class="form-control" type="text" placeholder="Username">' +
         '<input class="form-control" type="password" placeholder="Password">' +
         '<p class="pText padding-10">Choose your method to contact</p>' +
         '<div class="ButtonSection">' +
         '<button class="btn btn-default btn-sm"> Phone</button>' +
         '<button class="btn btn-default btn-sm"> Email</button>' +
         '<button class="btn btn-default btn-sm"> Cancel</button>' +
         '</div>' +
         '</div>' +
         '</div>' +
         '</div>' +
         '</div>';

      $('body').append(modal);
      $('#modal_contact_supervisor').modal('show');

      $('.ButtonSection button').on('click', function () {
         var ButtonPressed = $(this).text();
         var username = $('.MessageBoxMiddle input:text').val();
         var pass = $('.MessageBoxMiddle input:password').val();
         if (!pass || pass == '' || !username || username == '') {
            $('#modal_contact_supervisor input:text').prepend('<label class="error">Please enter your information</label>');
         } else {
            $.ajax({
               url: link._userCheckUserPass,
               type: 'post',
               data: { token: localStorage.getItemValue('token'), user_name: username, password: pass },
               dataType: 'json',
               success: function (res) {
                  if (res.ERROR == '' && res.check == 'Success') {
                     $('.MessageBoxMiddle .error').remove();
                     $('#modal_contact_supervisor').modal('hide');
                     if (ButtonPressed == 'Phone') {
                        var phone = window.hwcontact_phone;
                        window.location.href = "tel:+1" + numeral(phone).value();
                     } else if (ButtonPressed == 'Email') {
                     } else if (ButtonPressed == 'Cancel') {
                     }
                  } else {
                     $('.MessageBoxMiddle input:password').prepend('<label class="error">Your username or password is incorrect</label>');
                  }
               }, error: function (e) {

               }
            })
         }
      });

   },

   getOverideForm: function () {
      // row = $('#overide_form #overide_row').val(),
      var available = parseFloat($('#overide_form input[name=overide_available]').val()),
         amount = parseFloat($('#overide_form input[name=overide_amount]').val()),
         password = $('#overide_form input[name=overide_password]').val();
      // fields is required 

      var check = (amount >= available) || (amount < available && amount >= 0);
      if (!check) {
         messageForm('Values is invalid, Please enter again', 'warning', '#overide_form #message_form');
         return;
      }
      // check current password, 
      // if true, can overide
      var _self = this;
      this.checkPassword(password).then(function (result) {
         _self.editLimitTable(parseInt($('#overide_form input[name=overide_index]').val()), true);
         $('#overide_form input[name=overide_name]').val('');
         $('#overide_form input[name=overide_available]').val('');
         $('#overide_form input[name=overide_amount]').val('');
         $('#overide_form input[name=overide_password]').val('');
         $('#overide_form input[name=overide_index]').val('');
         $('.modal').modal('hide');
      }).catch(function (e) {
         if (e.ERROR) {
            messageForm('Your password is incorrect', false, '#overide_form #message_form');
         } else {
            messageForm('An error occured. Please try later', false, '#overide_form #message_form');
         };
      });
   },

   checkPassword: function (password) {
      return new Promise(function (resolve, reject) {
         if (!password) password = $('input[name=overide_password]').val();
         var _data = $.extend({}, template_data);
         _data.old_password = password;
         _data.id = localStorage.getItemValue('userID');
         $.ajax({
            url: link._userCheckOldPass,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
               if (res.check == 'Success') {
                  resolve(res);
               } else {

                  reject({ check: 'False', ERROR: res.ERROR });
               }
            },
            error: function (e) {
               reject(e);
            }
         })
      })
   },

   /**-------TABLE------------------------------ */
   /**
    * @param {*} list : claim limit template
    */
   createClaimLimitByList: function (list, value) {
      transactionList = [];
      if (!list) return;
      var result = '';
      var hasinput = (transactionID && window.claim_config.create_transaction && Boolean(window.claim_config.create_transaction.edit) == true) || (!transactionID && window.claim_config.create_transaction && Boolean(window.claim_config.create_transaction.add) == true);
      list.forEach(function (data, index) {
         if (!data.original) data.original = data.origin ? data.origin : 0;
         if (!data.transaction) data.transaction = 0;
         if (!data.current) data.current = data.original;
         if (!data.available) data.available = data.current - parseFloat(data.transaction);
         if (numeral(data.available).value() < 0) data.available = 0;
         var valueItem = value && value[index] && value[index][data.name] ? value[index][data.name] : 0;
         data.claim = valueItem;
         list[index] = data;
         result +=
            '<tr>' +
            '<td class="name">' + data.name + '</td>' +
            '<td class="text-right origin">' + numeral(data.original).format('0,0.00') + '</td>' +
            '<td class="text-right current">' + numeral(data.current).format('0,0.00') + '</td>' +
            '<td class="text-right available">' + numeral(data.available).format('0,0.00') + '</td>' +
            '<td class="hidden trans">' + data.transaction + '</td>' +
            '<td class="hasinput text-right">';
         if (hasinput && valueItem <= 0) {
            result += '<input class="form-control input-currency" value="' + valueItem + '" placeholder="0.00">';
         } else {
            result += '<label class="currency">' + numeral(valueItem).format('0,0.00') + '</label>';
            transactionList.push({
               date: getDateTime(),
               name: data.name,
               origin: data.original,
               current: data.current,
               available: data.available,
               transaction: data.transaction,
               claim: valueItem,
               person: localStorage.getItemValue('userID')
            });
         }
         result += '</td></tr>';
      });
      claimLimitList = list;
      $('#limit_table tbody').html(result);
      if (hasinput) {
         this.setEventClaimLimit();
      }
      this.getTotal();

   },
   /**----------GET DATA--------------------------- */
   /**
    * Form data
    */
   validateFormClaimOption: {
      rules: {
         warranty_ID: { required: true },
         // status: { required: true },
         assign_to: { required: true }
      },
      submitHandler: function () {
         try {
            Claim.prototype.submitForm();
         } catch (e) {
         }
      }
   },
   getTotal: function () {
      var total = 0;
      claimLimitList.forEach(function (trans) {
         total += numeral(trans.claim).value();;
      });
      var text = numeral(total).format('$ 0,0.00');
      $('#_total').text(text);
      return total;
   },

   setData: function (data, callback) {
      let _self = this;
      var warranty_ID = data.warranty_ID;
      $('[name=warranty_ID]').parent().replaceWith($('<label class="input"><input name="warranty_ID" value="' + warranty_ID + '" readonly></label>'));
      if (data.claim_assign) {
         setTimeout(function () {
            $('[name=claim_assign]').val(data.claim_assign).trigger('change');
         }, 1000);
      } else {
         $('[name=claim_assign]').val(null).trigger('change');
      }

      if (data.transactionID) {
         transactionID = data.transactionID;
      }
      claimQuote = new ClaimQuote();
      claimQuote.init(data.vendor);
      if (data.vendor && data.vendor.length > 0) {

         data.vendor.forEach(function (item, index) {
            data.vendor[index].full_name = data.vendor[index].full_name || ''
            window.quote_claim[item.id] = data.quote[index];
            $('[name=UID]').append(`<option value="${item.id}" data-type="${btoa(item.type)}" selected>${item.full_name}</option>`);
         });
         $('[name=UID]').trigger({
            type: 'select2:select',
            params: {
               data: data.vendor
            }
         });
         $('[name=UID]').trigger('change');
      }
      this.setWarrantyDataID(warranty_ID, function () {
         _claimStart = new ClaimStart();
         _claimStart.init();
      });
      this.loadDataClaimLimit(data.ID, data.warranty_ID, data.limit);
      this.loadDataClaimTransaction(data.ID);
      this.getTotal();

      setTimeout(function () {
         if (data.paid == 1 || data.paid == '1') {
            window.claim_complete = true;
            $('#claim_form [name=paid]').prop('checked', true);
            _self.lockViewPaidClaim();
         }
         if (callback) {
            callback();
         }
      }, 1000);
   },

   lockViewPaidClaim: function () {
      messageForm('This claim has been paid, You are only allowed to view', true);
      $('.hasinput').removeClass('hasinput input');
      $('.datetimepicker').datetimepicker('destroy');

      $('#claim_form select').each(function (index, elem) {
         if ($(elem).prop('multiple') == true) {
            let tmp_text = [];
            $(elem).find('option:selected').each(function () {
               tmp_text.push(this.innerHTML);
            })
            let it = $('<span class="padding-5">' + tmp_text.join(', ') + '</span>');
            // $(elem).select2('destroy');
            it.replaceAll(elem);
         } else {
            let it = $('<span class="padding-5">' + $(elem).find('option:selected').text() + '</span>');
            it.replaceAll(elem);
         }
      });
      $('#claim_form :checkbox').prop('disabled', true);

      $('#claim_form input:text, #claim_form textarea, #claim_form .form-control, #claim_form [type=date]').each(function (index, elem) {
         var it = $('<span>' + elem.value + '</span>');
         it.replaceAll(elem);
      });

      $('#claim_form .select2').remove();
      $('.select').removeClass('select');
      $('#btnAddTaskItem').remove();
      $('#btnSubmitClaim').remove();
      $('#claim_form fieldset:first').prepend('<img src="./img/invoice/paid.png" style="width: 85px; height: 55px; right:15px; padding: 0px 15px; position: absolute; z-index: 1;transform: rotate(-35deg);border: 2px solid red;" alt="">');
   },

   loadDataClaimLimit: function (ID, warranty_ID, valueClaim) {
      if (ID && ID != '') {
         $.ajax({
            url: link._claimGetCLLimitByClaimId,
            type: 'post',
            data: { ID: ID, warranty_ID: warranty_ID, token: _token, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
            dataType: 'json',
            success: function (res) {
               Claim.prototype.createClaimLimitByList(res, valueClaim);
               return;
            }
         })
      }
   },
   /**
    * 
    * @param {Integer} claim_ID : claim id
    */
   loadDataClaimTransaction: function (claim_ID) {
      if (claim_ID && claim_ID != '') {
         $.ajax({
            url: link._claimGetTransByClaimID,
            type: 'post',
            data: { claim_ID: claim_ID, token: _token, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
            dataType: 'json',
            success: function (res) {
               if (res.length > 0) {
                  Claim.prototype.createTransactionList(res[0].transaction);
                  if (res[0].ID) {
                     transactionID = res[0].ID;
                     oldTransaction = res[0].transaction;
                     return;
                  }
                  $('#limit_table').hide();
                  $('#transaction_table').show();
               } else {
                  $('#transaction_table').hide();
               }
            }
         })
      }
   },

   getFormData: function (isAddTransaction = true) {
      var _formData = $.extend({}, template_data);
      var _data = $("#claim_form").serializeArray()
      _data.forEach(function (elem) {
         if (elem.name != '' && elem.value != '') {
            _formData[elem.name] = elem.value;
         }
      });
      _formData.login_by = localStorage.getItemValue('userID');
      _formData.user_name = localStorage.getItemValue('user_name');
      _formData.notes = claimNote.getNotes();
      _formData.warranty_start_date = window.warranty_info.warranty_start_date;
      if (getUrlParameter('id') && _formData.ID) {
         _formData.UID = $('[name=UID]').val().join(',');
         _formData.paid = $('[name=paid]').prop('checked') == true ? 1 : 0;
         _formData.inactive = $('[name=inactive]').prop('checked') == true ? 1 : 0;
         _formData.warranty_total = this.getTotal();
         _formData.please_pay_flag = this.getApproved('#please_pay');
         _formData.claim_limit = this.getClaimLimit();
         if (jsonAssignTaskTable) {
            _formData.assign_task = jsonAssignTaskTable
         }
         _formData.data_quote = JSON.stringify(claimQuote.getQuoteData());

         _formData.quote_amount = numeral(_formData.quote_amount).value();
         _formData.invoice_amount = numeral(_formData.invoice_amount).value();

         /**
          * if switch please pay is checked
          * => add transaction
          */
         {
            // var _self = this;
            // if(isAddTransaction && window.claim_config.create_transaction){
            //    $('#limit_table tbody tr').each(function(){
            //       _self.addTransaction($(this).find('input'));
            //    });
            // }
         }
         delete _formData.id;
         delete _formData.body;
         delete _formData.subject;
         delete _formData.old_password;
         delete _formData.role;
         delete _formData.customer_name;
      }
      return _formData;
   },
   submitForm: function () {
      var _formData = this.getFormData(true);
      var _link = link._claimAddNew;
      if (getUrlParameter('id') && _formData.ID) {
         _link = link._claimUpdate;
      }
      var _self = this;
      $.ajax({
         url: _link,
         type: 'post',
         data: _formData,
         dataType: 'json',
         success: function (res) {
            if (res.SAVE == 'SUCCESS') {
               if (window.opener && _link == link._claimAddNew) {
                  var openerWindow = window.opener;
                  var data_claim_table = [{
                     ID: res.ID,
                     create_by: localStorage.getItemValue('userID'),
                     create_by_name: localStorage.getItemValue('user_name'),
                     contact_name: $('[name="customer"] option:selected').text(),
                     status: 'Open',
                     paid: false,
                     start_date: getDateTime()
                  }];
                  openerWindow.claimDataForward = data_claim_table;
                  window.close();
               } else if (_link == link._claimAddNew) {
                  window.claim_new_info = res;
                  responseSuccessForward('You have successfully added a new claim', true, '#claim_form #message_form', "./#ajax/claim-form.php?id=" + res.ID, 'Go to edit claim');
                  return;
               } else {
                  messageForm('You have successfully edited the claim', true, '#claim_form #message_form');
                  if (_formData.please_pay_flag == true && window.claim_config.create_transaction && (Boolean(window.claim_config.create_transaction.add) == true || Boolean(window.claim_config.create_transaction.edit) == true)) {
                     var _transData = {};
                     _transData.claimID = _formData.ID ? _formData.ID : res.ID;
                     _transData.warranty_ID = _formData.warranty_ID;
                     _self.submitTransaction(_transData);
                  }
                  // location.reload();
                  return;
               }
            } else {
               messageForm('Error! An error occurred. ' + res.ERROR, false, '#claim_form #message_form')
               return
            }
         },
      });
   },
   /**
    * 
    * @param {JSON {ClaimID, warranty_ID}} data 
    * 
    */
   submitTransaction: function (data) {
      if ($('#limit_table tbody').is(':empty')) return;
      var _myData = {
         token: localStorage.getItemValue('token'),
         jwt: localStorage.getItemValue('jwt'),
         private_key: localStorage.getItemValue('userID'),
         claim_ID: data.claimID,
         date_time: getDateTime(),
         warranty_id: data.warranty_ID,
         person: localStorage.getItemValue('userID'),
         // transaction: this.getTransactionList()
      };
      _myData.transaction = $('#please_pay').prop('checked') == true ? this.getTransactionList() : oldTransaction;
      if (_myData.transaction == oldTransaction) return;//no change => no update
      if (!_myData.transaction || _myData.transaction.length <= 0) return; // empty
      var _link2 = link._claimTransactionAddNew;
      if (transactionID) {
         _myData.ID = transactionID;
         _link2 = link._claimTransactionUpdate;
      }
      $.ajax({
         url: _link2,
         type: 'post',
         data: _myData,
         success: function (res) {
         }
      });
   },
}

var _claim = new Claim();
_claim.init();
// loadScript('js/script/contact/contact-notes.js');
$('#claim_form [name=customer]').trigger('change');

if (getUrlParameter('warrantyID')) {
   setTimeout(function () {
      $('[name=warranty_ID]').append('<option value="' + getUrlParameter('warrantyID') + '" selected>' + getUrlParameter('warrantyID') + '</option>').trigger('change');
   }, 1000);
}