function ClaimQuote() { }
window.quote_claim = {};
var text_vendor_exp_good = '<label class="text-success pull-right"><i class="fa fa-check-circle-o"></i> Good</label>';
var text_vendor_exp_bad = '<label class="text-danger pull-right"><i class="fa fa-warning"></i> Expired</label>';
var text_vendor_exp_bad_renew = '<label class="text-danger pull-right"><i class="fa fa-warning"></i> Expired <button type="button" class="btn btn-xs btn-default btnRenewVendor">Renew</button></label>';
var text_vendor_exp_empty = '<label></label>';
ClaimQuote.prototype = {
   constructor: ClaimQuote,
   init: function (data) {
      this.bindEvent(data);
   },
   bindEvent: function (initData) {
      var _self = this;

      $('#modal_vendor_renew .datepicker').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>',
         beforeShow: function () {
            $('#ui-datepicker-div').css({ display: 'absolute' });
         }
      });

      $('.btnConfirmRenew').click(function () {
         _self.renewVendor();
      });
      let _select2Option = {
         placeholder: 'Search Vendor',
         minimumInputLength: 2,
         language: {
            inputTooShort: function () {
               return 'Enter name';
            },
         },
         allowClear: true,
         multiple: true,
         ajax: {
            url: link._claimVendors,
            type: 'post',
            dataType: 'json',
            delay: 300,
            data: function (params) {
               var _data = { token: localStorage.getItemValue('token'), contact_name: params.term }
               return _data;
            },
            processResults: function (data, params) {
               if (data && data.list) {
                  data = data.list;
               }
               return { results: data }
            },
            cache: true
         },
         escapeMarkup: function (markup) { return markup; }, // var our custom formatter work
         templateResult: function (repo) {
            if (repo.loading) {
               return repo.full_name;
            }

            let _address = [];
            if (repo.city) _address.push(repo.city);
            if (repo.state) _address.push(repo.state);


            var markup =
               "<div class='select2-result-repository clearfix'>" +
               "<div class='select2-result-repository__meta'>" +
               "<div class='select2-result-repository__title'><b>" + repo.full_name + "</b> <span class='pull-right'>" + _address.join(' - ') + "</span></div>" +
               '<div>' + (repo.type ? repo.type.upperCaseFirst() : '') + '</div>'
            "</div>" +
               "</div>";
            return markup;
         },
         templateSelection: function (repo) {
            if (!repo.full_name) return repo.text ? repo.text : repo.id;

            return repo.full_name;
         }
      }
      if (initData && initData.length > 0) {
         _select2Option.initSelection = function (elem, callback) {
            initData.forEach(item => {
               callback(item);
            });
         }
      }
      $('[name=UID]').select2(_select2Option).on('select2:select', function (e) {
         let _data = e.params.data;
         let selectOption = function (data) {
            let createData = {
               type: data.type,
               typeID: data.id,
               text: data.full_name,
               w9_exp: data.w9_exp,
               insurrance_exp: data.insurrance_exp,
               license_exp: data.license_exp
            };
            $('#pane_quote_claim').append(_self.createQuoteCard(createData, window.quote_claim[data.id]));
         }
         if (_data instanceof Array) {
            _data.forEach((data) => {
               selectOption(data);
            });
         } else {
            selectOption(_data);
         }
         _self.setView();
      }).on('select2:unselect', function (e) {
         let data = e.params.data;
         let _params = {
            type: data.type || atob($(e.params.data.element).data('type')),
            typeID: data.id,
         }
         _self.removeQuoteCard(_params);
      });
   },
   removeQuoteCard: function (data) {
      let query = `#pane_quote_claim [data-type="${btoa(data.type)}"][data-typeid="${btoa(data.typeID)}"]`;
      $(query).remove();
   },
   createQuoteCard: function (data, value) {
      let _html = `
      <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6 claim_quote_card" data-id="${btoa(value && value.id ? value.id : '')}" data-type="${btoa(data.type)}" data-typeid="${btoa(data.typeID)}">
         <div style="margin:2px; border:1px solid #ccc;">   
            <h3 class="bold padding-5">
               <a href="./#ajax/${data.type == 'vendor' ? 'contact' : 'company'}-form.php?id=${numeral(data.typeID).value()}">${data.text.upperCaseFirst()}</a> 
            </h3>
            <small class="badge bg-color-${data.type == 'vendor' ? 'orange' : 'purple'} padding-5" style="margin: 5px;">${data.type.upperCaseFirst()}</small>
            
            <div class="padding-5">
               <table class="table_quote" style="width:100%">
                  <tbody>
                     <tr>
                        <td colspan="2"><strong>Quote</strong></td>
                     </tr>
                     <tr>
                        <td>Number:</td>
                        <td class="hasinput"><input class="form-control" value="${value && value.quote.quote_num ? value.quote.quote_num : ''}" name="quote_num" placeholder="Number"></td>
                     </tr>
                     <tr>
                        <td>Amount:</td>
                        <td class="hasinput"><input type="number" class="form-control input-currency text-left" value="${value && value.quote.quote_amount ? value.quote.quote_amount : ''}" name="quote_amount" placeholder="$ 0.00""></td>
                     </tr>
                     <tr>
                        <td>Date:</td>
                        <td class="hasinput"><input type="date" name="quote_date" value="${value && value.quote.quote_date ? value.quote.quote_date.split(' ')[0] : ''}" class="form-control datepicker"></td>
                     </tr>
                     <tr>
                        <td>Confirm:</td>
                        <td class="hasinput" style="vertical-align: unset;">
                           <label class="toggle">
                              <input type="checkbox" name="quote_approved" ${value && value.quote.quote_approved ? value.quote.quote_approved == 1 || value.quote.quote_approved == '1' ? ' checked="checked"' : '' : 'checked="checked"'}>
                              <i data-swchon-text="Approved" data-swchoff-text="Declined"></i>
                           </label>
                           <button type="button" style="display:none; margin-top:2em; margin-left:0px;" class="btn btn-sm btn-default btnSendNotifyVendor" data-for="quote">Notify Vendor</button>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="2" style="padding-top:10px;"><strong>Invoice</strong></td>
                     </tr>
                     <tr>
                        <td>Number:</td>
                        <td class="hasinput"><input class="form-control" name="inv_num" value="${value && value.quote.inv_num ? value.quote.inv_num : ''}" placeholder="Number"></td>
                     </tr>
                     <tr>
                        <td>Amount:</td>
                        <td class="hasinput"><input type="number" name="inv_amount" value="${value && value.quote.inv_amount ? value.quote.inv_amount : ''}" class="form-control input-currency text-left" placeholder="$ 0.00""></td>
                     </tr>
                     <tr>
                        <td>Date:</td>
                        <td class="hasinput"><input type="date" name="inv_date" value="${value && value.quote.inv_date ? value.quote.inv_date.split(' ')[0] : ''}" class="form-control datepicker"></td>
                     </tr>
                     <tr>
                        <td>Confirm:</td>
                        <td class="hasinput" style="vertical-align: unset;">
                           <label class="toggle">
                              <input type="checkbox" name="inv_approved" ${value && value.quote.inv_approved ? value.quote.inv_approved == 1 || value.quote.quote_approved == '1' ? ' checked="checked"' : '' : 'checked="checked"'}>
                              <i data-swchon-text="Approved" data-swchoff-text="Declined"></i>
                           </label>
                           <button type="button" style="display:none; margin-top:2em; margin-left:0px;" class="btn btn-sm btn-default btnSendNotifyVendor" data-for="invoice">Notify Vendor</button>
                        </td>
                     </tr>`;
      /**
       * Vendor exp
       */
      if (['vendor', 'company'].includes(data.type)) {
         let currentDate = new Date();
         currentDate.setUTCHours(0, 0, 0, 0);
         currentDate = currentDate.getTime();

         let date_license = data.license_exp ? new Date(data.license_exp) : new Date();
         date_license.setUTCHours(0, 0, 0, 0);
         date_license = date_license.getTime();

         let date_w9 = data.w9_exp ? new Date(data.w9_exp) : new Date();
         date_w9.setUTCHours(0, 0, 0, 0);
         date_w9 = date_w9.getTime();

         let date_insurance = data.insurrance_exp ? new Date(data.insurrance_exp) : new Date();
         date_insurance.setUTCHours(0, 0, 0, 0);
         date_insurance = date_insurance.getTime();

         let exp_license = date_license - currentDate,
            exp_wp = date_w9 - currentDate,
            exp_insurance = date_insurance - currentDate,
            license_text = text_vendor_exp_empty,
            w9_text = text_vendor_exp_empty,
            insurance_text = text_vendor_exp_empty;

         if (data && data.license_exp) {
            if (exp_license >= 0) {
               license_text = text_vendor_exp_good;
            } else {
               license_text = text_vendor_exp_bad;
            }
         }
         if (data && data.w9_exp) {
            if (exp_wp >= 0) {
               w9_text = text_vendor_exp_good;
            } else {
               w9_text = text_vendor_exp_bad_renew;
            }
         }

         if (data && data.insurrance_exp) {
            if (exp_insurance >= 0) {
               insurance_text = text_vendor_exp_good;
            } else {
               insurance_text = text_vendor_exp_bad;
            }
         }

         _html += `<tr>
                        <td style="padding-top:20px;"><b>License:</b></td>
                        <td style="padding-top:20px;" class="license vendor_date">${(data && data.license_exp ? data.license_exp : '') + license_text}</td>
                     </tr>
                     <tr>
                        <td style="padding-top:10px;"><b>W9:</b></td>
                        <td style="padding-top:10px;" class="w9 vendor_date">${(data && data.w9_exp ? data.w9_exp : '') + w9_text}</td>
                     </tr>
                     <tr>
                        <td style="padding-top:10px;"><b>Insurance:</b></td>
                        <td style="padding-top:10px;" class="insurrance vendor_date">${(data && data.insurrance_exp ? data.insurrance_exp : '') + insurance_text}</td>
                     </tr>`;
      }
      _html += `
                  </tbody>
               </table>
            </div>
         </div>
      </div>
      `;
      return _html;
   },
   setView: function () {
      $('.datepicker').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>'
      });

      $(document).unbind('change', '#pane_quote_claim .toggle input:checkbox').on('change', '#pane_quote_claim .toggle input:checkbox', function () {
         if ($(this).prop('checked') == true) {
            $(this).parent().next('button').hide(100);
         } else {
            $(this).parent().next('button').show(100);
         }
      });

      let _self = this;

      $('.btnRenewVendor').unbind('click', '.btnRenewVendor').on('click', function () {
         _self.popupRenew(this);
      });

      $('.input-currency').focusout();
   },

   popupRenew: function (elem) {
      window.vendor_renew = numeral(atob($(elem).closest('.claim_quote_card').data('typeid'))).value();
      window.vendor_renew_type = numeral(atob($(elem).closest('.claim_quote_card').data('type'))).value();
      window.renew_index = $(elem).closest('.claim_quote_card').index();
      window.renew_input = $(elem).closest('tr').find('td.vendor_date');
      $('#modal_vendor_renew').modal('show');
   },

   renewVendor: function () {
      let _myData = $.extend({}, template_data);
      _myData.w9_exp = $('#vendor_renew_date').val();
      if (!_myData.w9_exp || _myData.w9_exp == '') {
         tooltipInputError('Please enter expired date', '#vendor_renew_date');
         return;
      } else if (new Date().getTime() - new Date(_myData.w9_exp).getTime() > 0) {
         tooltipInputError('Expired date is a day in future', '#vendor_renew_date');
         return;
      }
      let _link = link._companyUpdateW9;
      if (window.vendor_renew_type == 'contact') {
         _link = link._contactUpdateW9;
         _myData.contactID = window.vendor_renew;
      } else {
         _link = link._companyUpdateW9;
         _myData.companyID = window.vendor_renew;
      }
      $.ajax({
         url: _link,
         type: 'post',
         dataType: 'json',
         data: _myData,
         success: function (res) {
            $('.modal').modal('hide');
            messageForm('The W9 date is updated successfully',true, '#message_quote');
            window.renew_input.html(_myData.w9_exp + text_vendor_exp_good);
            $('#vendor_renew_date').val(null);
         },
         error: function (e) {

         }
      });
   },

   getQuoteDataRow: function (rowIndex, notQuote, notInvoice) {
      let row = {};
      $vd = $('#pane_quote_claim .claim_quote_card:eq(' + rowIndex + ') table');
      $vd.find('input').each(function (input) {
         $input = $(input);
         $name = $input.prop('name');
         if ((!notQuote && $name.startsWith('quote')) && (!notInvoice && $name.startsWith('inv'))) {
            if ($input.prop('type') == 'checkbox') {
               row[$name] = $input.prop('checked') == true ? 1 : 0;
            } else if ($name.endsWith('_amount')) {
               row[$name] = numeral($input.val()).value();
            } else {
               row[$name] = $input.val();
            }
         }
      });
      return row;
   },

   getQuoteData: function () {
      let result = [];
      $('#pane_quote_claim .claim_quote_card').each(function () {
         let $vd = $(this);
         let row = {
            id: atob($vd.data('id')) || '',
            type: atob($vd.data('type')) || 'vendor',
            typeID: numeral(atob($vd.data('typeid'))).value(),
            claimID: $('#claim_form [name=ID]').val(),
            quote: {}
         }
         $vd.find('input').each(function () {
            let $input = $(this);
            let $name = $input.prop('name');
            if ($input.prop('type') == 'checkbox') {
               row.quote[$name] = $input.prop('checked') == true ? 1 : 0;
            } else if ($name.endsWith('_amount')) {
               row.quote[$name] = numeral($input.val()).value();
            } else {
               row.quote[$name] = $input.val();
            }
         })
         result.push(row);
      });
      return result;
   }
}