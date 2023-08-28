function ClaimTransaction() { }

ClaimTransaction.prototype.constructor = ClaimTransaction;
var old_transaction_list = null;
var truePassword = false;
ClaimTransaction.prototype = {
   init: function () {
      selectClaim = this.selectClaim;
      this.bindEvent();
   },
   bindEvent: function () {
      $('#claim_transaction_form').validate(ClaimTransaction.prototype.validateClaimTransactionOption);
      $('#claim_list').change(function () {
         if ($(this).val() != '') {
            selectClaim($(this).val());
         } else {
            _claimTransaction.clearTransaction();
         }
      });
      $('#btnBackClaimTransaction').click(function () {
         window.history.back();
      });
      if ($('#claim_list').val() != '') {
         selectClaim($('#claim_list').val());
      }
   },
   validateClaimTransactionOption: {
      rules: {
         claim_ID: { required: true },
         warranty_id: { required: true },
      },
      submitHandler: function () {
         _claimTransaction.submitFormTransaction();
      }
   },
   submitFormTransaction: function () {
      var _formData = { token: _token, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
      _formData.claim_ID = $('input[name=claim_ID]').val();
      _formData.warranty_id = $('#warranty_id').val();
      _formData.date_time = $('input[name=date_time]').val() != '' ? $('input[name=date_time]').val() : getDateTime(new Date());
      _formData.person = localStorage.getItemValue('userID');
      _formData.transaction = this.getClaimTransactionList('#transaction_table_form');
      if (_formData.transaction == false) {
         messageForm('Please check transactions again', false);
      } else {
         _link = link._claimTransactionAddNew;
         if ($('input[name=ID]').val() != '') {
            _link = link._claimTransactionUpdate;
            _formData.ID = $('input[name=ID]').val();
         }
         $.ajax({
            url: _link,
            type: 'post',
            data: JSON.parse(JSON.stringify(_formData)),
            success: function (res) {
               var tmp = JSON.parse(res);
               if (tmp.ERROR != '') {
                  messageForm('Error! An error occurred. ' + tmp.ERROR, false)
                  return;
               } else if (tmp.SAVE == 'SUCCESS') {
                  if (_link == link._claimTransactionAddNew) {
                     if (window.location.href.indexOf('claim-form.transaction') > 0) {
                        responseSuccessForward('You have successfully added the transaction', true, '#claim_form #message_form', window.location.href+'?id='+tmp.ID);
                     } else {
                        messageForm('You have successfully added the transaction', true);

                     }
                  } else {
                     messageForm('You have successfully edited the transaction', true)
                  }
               }
            }
         })
      }
   },
   /**
    * 
    * @param {*} ID : claim id
    */
   selectClaim: function (ID) {
      if (ID && ID != '') {
         $.ajax({
            url: link._claimlimitGetByClaimId,
            type: 'post',
            data: { ID: ID, token: _token, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
            success: function (res) {
               var _data = JSON.parse(res);
               if (_data.ERROR == '' && _data.Claim != '') {
                  $('#warranty_id').val(_data.Claim.warranty_ID);
                  $.ajax({
                     url: link._claimCreateLimitByClaimId,
                     type: 'post',
                     data: { ID: ID, warranty_ID: _data.Claim.warranty_ID, token: _token, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
                     dataType: 'json',
                     success: function (res) {
                        _claimTransaction.createClaimLimitByClaim(res.limit);
                        _claimTransaction.claimInfo(_data.Claim);
                        if (res.ID_trans) {
                           $('input[name=ID]').val(res.ID_trans);
                           return;
                        } else {
                           $('input[name=ID]').val('');
                        }
                     }
                  })
               }
            }
         })
      }
   },

   claimInfo: function (data) {
      if (data && data != '') {
         $('input[name=claim_ID]').val(data.ID);
         var s =
         '<div class="well padding-10">'+
            '<div class="row">'+
               '<div class="col col-12">'+
                  '<h5>Claim Information</h5><hr>'+
                  '<b class="col col-md-4 col-sm-6 col-xs-6">ID: </b>'+
                  '<label class="col col-md-8 col-sm-6 col-xs-6">'+ data.ID + '</label>'+
                  '<b class="col col-md-4 col-sm-6 col-xs-6">Contact: </b>'+
                  '<label class="col col-md-8 col-sm-6 col-xs-6">'+ data.contact_name + '</label>'+
                  '<b class="col col-md-4 col-sm-6 col-xs-6">Create By: </b>'+
                  '<label class="col col-md-8 col-sm-6 col-xs-6">'+ data.create_by_name + '</label>'+
                  '<b class="col col-md-4 col-sm-6 col-xs-6">Start Date: </b>'+
                  '<label class="col col-md-8 col-sm-6 col-xs-6">'+ (data.start_date ? data.start_date : 'Unknown') + '</label>'
         if (data.end_date) s +=
                  '<b class="col col-md-4 col-sm-6 col-xs-6">End Date: </b>'+
                  '<label class="col col-md-8 col-sm-6 col-xs-6">'+ (data.end_date ? data.end_date : 'Unknown') + '</label>';
         s += '<b class="col col-md-4 col-sm-6 col-xs-6">Status: </b>'+
                  '<label class="col col-md-8 col-sm-6 col-xs-6">'+ data.status + '</label>'+
                  '<label class="col-md-4 col-sm-6 col-xs-6">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa '+ (data.paid == 1 ? 'fa-check-square-o text-success' : 'fa-square-o') + '"></i> Paid</label>'+
               '</div>'+
            '</div>'+
         '</div><br>';
         $('#claim_info').html(s.toString());
      } else {
         $('#claim_info').empty();
      }
   },

   /**
   * 
   * @param {*} list : claim limit template
   * 
   */
   createClaimLimitByClaim: function (list) {
      var result = '';
      old_transaction_list = list;
      list.forEach(function (data) {
         if (!data.original) data.original = data.origin ? data.origin : 0;
         if (!data.transaction) data.transaction = 0;
         if (!data.current) data.current = data.original;
         if (!data.available) data.available = data.current - data.transaction;
         if (!data.claim) data.claim = 0;
         if (!data.person) data.person = localStorage.getItemValue('userID');
         var isOverride = null;
         if (data.claim > data.available) isOverride = true;

         result +=
         '<tr>'+
            '<td class="hidden">'+ getDateTime() + '</td>'+
            '<td class="">'+ data.name + '</td>'+
            '<td class="text-right">'+ numeral(data.original).format('0,0[.]00') + '</td>'+
            '<td class="text-right ">'+ numeral(data.current).format('0,0[.]00') + '</td>'+
            '<td class="text-right ">'+ numeral(data.available).format('0,0[.]00') + '</td>'+
            '<td class="text-right hidden">'+ numeral(data.transaction).format('0,0[.]00') + '</td>'+
            '<td class="hasinput"><input class="form-control input-currency" value="'+ data.claim + '" placeholder="0.00"></td>'+
            '<td class="hidden">'+ data.person + '</td>'+
            '<td class="hidden">'+ (isOverride ? isOverride : '') + '</td>';
         if (!isOverride) {
            if (isAdmin()) {
               result += '<td class="hasinput col-1"><button type="button" class="btn btn-sm btn-default" onclick="showModal(this)">Overide</button></td>';
            } else if (data.claim > data.available) {
               result += '<td class="hasinput col-1"><button type="button" class="btn btn-sm btn-default" onclick="contactToSupervisor()">Contact</button></td>';
            }
         }

         result += '</tr>';
      });
      $('#transaction_table_form tbody').html(result);
      $('#transaction_table_form').show();
      $('#transaction_table_form tbody input[type=number]').change(function () {
         ClaimTransaction.prototype.changeClaimRow($(this).closest('tr').index());
      })
      return result.toString();
   },

   changeClaimRow: function (index) {
      var row = $('#transaction_table_form tbody').find('tr').eq(index),
         rows = row.find('td'),
         claim = numeral(rows.eq(6).find('input').val()).value(),
         available = numeral(rows.eq(4).text()).value() - claim;
      rows.eq(8).text('');
      if (old_transaction_list) {
         if (old_transaction_list[index].claim == claim && claim > available) {
            rows.eq(8).text('true');
            return;
         } else {
            rows.eq(8).text('');
         }
      }
      // transaction = numeral(rows.eq(5).text()).value() + claim;
      if (available >= 0) {
         // rows.eq(4).text(numeral(available).format('0,0[.]00'));
         // rows.eq(5).text(numeral(transaction).format('0,0[.]00'));
      } else {
         if (isAdmin()) {
            if (rows.length == 9) {
               row.append('<td class="hasinput col-1"><button type="button" class="btn btn-sm btn-default" onclick="showModal(this)">Overide</button></td>');
            }
         } else {
            if (rows.length == 9) {
               row.append('<td class="hasinput col-1"><button type="button" class="btn btn-sm btn-default" onclick="contactToSupervisor()">Contact</button></td>');;
            }
         }
      }
   },

   getClaimTransactionList: function (table) {
      if (!table) table = '#transaction_table_form';
      var result = [];
      $(table + ' tbody').find('tr').each(function (row, elem) {
         var $tds = $(this).find('td'),
            data = {};
         data.datetime = $tds.eq(0).text();
         data.name = $tds.eq(1).text();
         data.original = numeral($tds.eq(2).text()).value();
         data.current = numeral($tds.eq(3).text()).value();
         data.available = numeral($tds.eq(4).text()).value();
         // data.transaction = numeral($tds.eq(5).text()).value();
         data.claim = $tds.eq(6).find('input').val();
         data.person = $tds.eq(7).text();
         var isOverride = $tds.eq(8).text();
         if (isOverride == 'true' && data.available - data.claim < 0)
            result.push(data);
         else if (data.available - data.claim >= 0) {
            result.push(data);
         } else {
            result = false;
            return false;
         }
      });
      return result;
   },
   clearTransaction: function () {
      $('select[name=claim]').val('');
      $('input[name=claim_ID]').val('');
      $('input[name=warranty_id]').val('0');

      $('#transaction_table_form tbody').empty();
      $('#transaction_table_form tfoot').empty();
      $('#claim_info').empty();
   }
}

var _claimTransaction = new ClaimTransaction();
_claimTransaction.init();

showModal = function (elem) {
   setOverideForm(elem);
   $('#modal_overide_claim').modal('show');
};

contactToSupervisor = function () {
   $.SmartMessageBox({
      title: '<span class="text-danger">Contact to supervisor</span>',
      content: 'Choose your method to contact',
      buttons: '[Cancel][Phone][Email]'
   }, function (ButtonPressed) {
      if (ButtonPressed == 'Phone') {
         $.root_.addClass('animated');
         var phone = window.hwcontact_phone;
         callToPhoneNumber(localStorage.getItemValue('userID'), phone);
      } else if (ButtonPressed == 'Email') {
         $.root_.addClass('animated');
      } else if (ButtonPressed == 'Cancel') {
         $.root_.addClass('animated');
      }
   });
}
loadScript('js/script/contact/contact-notes.js');