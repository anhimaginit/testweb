function ClaimQuote() { }
window.quote_claim = {};
ClaimQuote.prototype = {
   constructor: ClaimQuote,
   init: function (data) {
      this.bindEvent(data);
   },
   bindEvent: function (initData) {
      var _self = this;
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
               '<div>' + repo.type.upperCaseFirst() + '</div>'
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
            };
            $('#table_quote_claim tbody').append(_self.createQuoteRow(createData, window.quote_claim[data.id]));
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
         _self.removeQuoteRow(_params);
      });
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

      $(document).unbind('change', '#table_quote_claim tbody .toggle input:checkbox').on('change', '#table_quote_claim tbody .toggle input:checkbox', function () {
         if ($(this).prop('checked') == true) {
            $(this).parent().next('button').hide(100);
         } else {
            $(this).parent().next('button').show(100);
         }
      })
   },
   removeQuoteRow: function (data) {
      let query = `#table_quote_claim tbody [data-type="${btoa(data.type)}"][data-typeid="${btoa(data.typeID)}"]`;
      $(query).remove();
   },
   createQuoteRow: function (data, value) {
      let _html = `
      <tr data-id="${btoa(value && value.id ? value.id : '')}" data-type="${btoa(data.type)}" data-typeid="${btoa(data.typeID)}">
         <td rowspan="2"><a href="./#ajax/${data.type == 'vendor' ? 'contact' : 'company'}-form.php?id=${numeral(data.typeID).value()}">${data.text.upperCaseFirst()}</a></td>
         <td rowspan="2">${data.type.upperCaseFirst()}</td>
         <td>Quote</td>
         <td class="hasinput"><input class="form-control" value="${value && value.quote.quote_num ? value.quote.quote_num : ''}"></td>
         <td class="hasinput"><input type="number" class="form-control" value="${value && value.quote.quote_amount ? value.quote.quote_amount : ''}"></td>
         <td class="hasinput" style="vertical-align: unset;">
            <label class="toggle">
               <input type="checkbox"${value && value.quote.quote_approved ? value.quote.quote_approved == 1 || value.quote.quote_approved == '1' ? ' checked="checked"' : '' : 'checked="checked"'}>
               <i data-swchon-text="Approve" data-swchoff-text="Decline"></i>
            </label>
            <button type="button" style="display:none; margin-top:2em; margin-left:0px;" class="btn btn-sm btn-default btnSendNotifyVendor" data-for="quote">Notify Vendor</button>
         </td>
         <td class="hasinput"><input type="date" class="form-control datepicker" value="${value && value.quote_date ? value.quote_date : getDateTime().split(' ')[0]}"></td>
      </tr>
      <tr data-id="${btoa(value && value.id ? value.id : '')}" data-type="${btoa(data.type)}" data-typeid="${btoa(data.typeID)}">
         <td>Invoice</td>
         <td class="hasinput"><input class="form-control" value="${value && value.quote.inv_num ? value.quote.inv_num : ''}"></td>
         <td class="hasinput"><input type="number" class="form-control" value="${value && value.quote.inv_amount ? value.quote.inv_amount : ''}"></td>
         <td class="hasinput" style="vertical-align: unset;">
            <label class="toggle">
               <input type="checkbox"${value && value.quote.inv_approved ? value.quote.inv_approved == 1 || value.quote.quote_approved == '1' ? ' checked="checked"' : '' : 'checked="checked"'}>
               <i data-swchon-text="Approve" data-swchoff-text="Decline"></i>
            </label>
            <button type="button" style="display:none; margin-top:2em; margin-left:0px;" class="btn btn-sm btn-default btnSendNotifyVendor" data-for="invoice">Notify Vendor</button>
         </td>
         <td class="hasinput"><input type="date" class="form-control datepicker" value="${value && value.inv_date ? value.inv_date : getDateTime().split(' ')[0]}"></td>
      </tr>
      `;
      return _html;
   },
   createQuoteList: function (data) {
      let _html = '';
      data.forEach((quote) => {
         window.quote_claim[quote.typeID] = quote;
         let _data = {
            id: quote.id,
            type: quote.type,
            typeID: quote.typeID,
            text: $('[name=UID][value="' + quote.typeID + '"]').val()
         }
         _html = _self.createQuoteRow(_data, quote);
      });
      $('#table_quote_claim tbody').html(_html);
      _self.setView();
   },
   getQuoteData: function () {
      let result = [];
      $('#table_quote_claim tbody').find('tr:nth-child(odd)').each(function () {
         let $tr = $(this),
            $tr2 = $tr.next('tr'),
            tds = $tr.children('td'),
            tds2 = $tr2.children('td'),
            row = {
               id: atob($tr.data('id')) || '',
               type: atob($tr.data('type')) || 'vendor',
               typeID: numeral(atob($tr.data('typeid'))).value(),
               claimID: $('#claim_form [name=ID]').val(),
            }
         if (window.claim_complete) {
            row.quote = {
               quote_num: tds.eq(3).text(),
               quote_amount: tds.eq(4).text(),
               quote_approved: tds.eq(5).find('input').prop('checked') == true ? 1 : 0,
               quote_date: tds.eq(6).text(),
               inv_num: tds2.eq(1).text(),
               inv_amount: tds2.eq(2).text(),
               inv_approved: tds2.eq(3).find('input').prop('checked') == true ? 1 : 0,
               inv_date: tds2.eq(4).text()
            }
         } else {
            row.quote = {
               quote_num: tds.eq(3).find('input').val(),
               quote_amount: tds.eq(4).find('input').val(),
               quote_approved: tds.eq(5).find('input').prop('checked') == true ? 1 : 0,
               quote_date: tds.eq(6).find('input').val(),
               inv_num: tds2.eq(1).find('input').val(),
               inv_amount: tds2.eq(2).find('input').val(),
               inv_approved: tds2.eq(3).find('input').prop('checked') == true ? 1 : 0,
               inv_date: tds2.eq(4).find('input').val()
            }
         }
         result.push(row);
      });
      return result;
   }
}