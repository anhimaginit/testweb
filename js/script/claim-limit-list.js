function ClaimLimitList() { }

ClaimLimitList.prototype.constructor = ClaimLimitList;
var current_sku_selected = null;
ClaimLimitList.prototype = {
   loadData: function (idProduct, table, hasinput) {
      if (idProduct && idProduct != '') {
         $.ajax({
            url: link._claimLimitProductID,
            type: 'post',
            data: { ID: idProduct, token: _token, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
            dataType: 'json',
            success: function (_data) {
               if (_data.ERROR == '') {
                  var content = '';
                  var _claim_limit = new ClaimLimit();
                  if (_data.claimLimit && _data.claimLimit.length > 0) {
                     current_sku_selected = _data.claimLimit[0].SKU;
                     for (var key in _data.claimLimit[0].limits) {
                        content += new ClaimLimit({
                           ID: _data.claimLimit[0]['ID'],
                           claim_name: (key.startsWith(current_sku_selected + '-') ? key : current_sku_selected + '-' + key),
                           claim_amount: _data.claimLimit[0].limits[key]
                        }).createClaimLimitRow(hasinput);
                     }
                     content += _claim_limit.createClaimLimitRowInput(hasinput);

                     if (document.location.href.indexOf('claim-limit-form') > 0) {
                        $(table + ' tbody').html(content);
                        $('input[name=ID]').val(_data.claimLimit[0]['ID']);
                     } else if (document.location.href.indexOf('claim-form.php') > 0) {
                        $(table + ' tbody').html(content);
                     } else {
                        $(table + ' tbody').append(content);
                     }
                     $('#table_claim_limit_error').empty();
                     if (_claimWarrantyLimit) _claimWarrantyLimit.setEventRow();

                  } else {
                     $(table + ' tbody').html(_claim_limit.createClaimLimitRowInput(hasinput));
                     $('#table_claim_limit_error').html('The claim limit is empty');
                     if (document.location.href.indexOf('claim-limit-form') > 0) $('input[name=ID]').val('');
                     if (_claimWarrantyLimit) _claimWarrantyLimit.setEventRow();

                  }
               }
            }
         });
      }
   },
   loadTableClaimByList: function (list, table, ID) {
      var content = '';
      if (list instanceof Array) {
         list.forEach(function (_item) {
            for (var key in _item) {
               content += new ClaimLimit({
                  ID: list.ID ? list.ID : ID,
                  claim_name: key,
                  claim_amount: _item[key]
               }).createClaimLimitRow(false);
            };
         })
      } else if (list) {
         for (var key in list) {
            if (key != 'ID') {
               content += new ClaimLimit({
                  ID: list.ID ? list.ID : ID,
                  claim_name: key,
                  claim_amount: list[key]
               }).createClaimLimitRow(false);
            }
         }
      }
      if (document.location.href.indexOf('claim-form.php') > 0) {
         $(table + ' tbody').html(content);
      } else if (document.location.href.indexOf('claim-limit-form.php') > 0) {
         $(table + ' tbody').append(content);
      } else if (list['ID'] && ($(table + " tbody tr").is("#_" + list['ID']))) {
         $('tr[id="_' + list['ID'] + '"]').remove();
         $(table + ' tbody').append(content);
      } else if (ID) {
         $('tr[id="_' + list['ID'] + '"]').remove();
         $(table + ' tbody').append(content);
      }
      $('#table_claim_limit_error').empty();
   },
   getClaimList: function (table) {
      if (!table) table = '#table_claim_limit';
      var result = {};
      $(table + ' tbody').find('tr').each(function (row, elem) {
         var $tds = $(this).find('td'),
            name = $tds.eq(0).text(),
            amount = $tds.eq(1).text();
         if (name != '' && amount != '')
            result[name] = numeral(amount.replace('(', '-').replace(')', '')).value();
      });
      return result;
   }
}

loadScript("js/script/claim-limit.model.js", null);