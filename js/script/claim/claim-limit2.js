function ClaimWarrantyLimit() {
  submitForm = this.submitForm;
}
var listProductOb = {};
ClaimWarrantyLimit.prototype = {
  init: function () {
    this.bindEvent();
    $('select[name="product_ID"]').select2({
      placeholder: 'Select product'
    })
  },
  bindEvent: function () {
    $(document).on('change', 'select[name=product_ID]', function () {
      var forForm = $(this).closest('form').find('#forForm').val();
      if (this.value && this.value != '') {
        window.productSKU = $(this).find('option:selected').data('sku');
        ClaimWarrantyLimit.prototype.productLimit(this.value, '#table_' + forForm + ' #table_claim_limit');
      } else {
        $('#fieldset_' + forForm + ' input[name=ID]').val('');
        $('#table_' + forForm + ' #table_claim_limit tbody').html(ClaimWarrantyLimit.prototype.createClaimLimitRow());
      }
    })

      .on('click', '#table_claim_limit .claim_name', function () {
        if ($(this).children().length > 0) {
          return;
        }
        var value = $(this).text();
        $(this).empty();
        $(this).append('<input class="form-control">');
        $(this).find('input').focus().val(value.startsWith(window.productSKU + '-') ? value.replace(window.productSKU + '-', '') : value);

      })

      .on('click', '#table_claim_limit .claim_amount', function () {
        if ($(this).children().length > 0) {
          return;
        }
        var value = $(this).text();
        $(this).html('<input class="form-control input-currency">');
        $(this).find('input').focus().val(numeral(value).value());
      })

      .on('focusout', '#table_claim_limit .claim_name input', function () {
        var value = $(this).val();
        value = value.startsWith(window.productSKU + '-') ? value : window.productSKU + '-' + value;
        $(this).parent().html(value);
      })

      .on('focusout', '#table_claim_limit .claim_amount input', function () {
        var value = numeral(this.value).format('$ 0,0.00');
        $(this).parent().html(value);
      })

      .on('change', '#table_claim_limit tbody tr:last td input', function () {
        $(this).closest('tbody').append(ClaimWarrantyLimit.prototype.createClaimLimitRow());
        $('#table_claim_limit_error').empty();
      })

      .on('click', '#table_claim_limit tr:not(:last) button.delete-claim', function () {
        $(this).closest('tr').remove();
      });
  },
  createClaimLimitRow: function (data = { claim_name: '', claim_amount: '' }) {
    if (!data.ID) data.ID = '';
    var _html =
      '<tr data-id="' + data.ID + '">' +
      '<td class="claim_name hasinput">' + data.claim_name + '</td>' +
      '<td class="claim_amount hasinput text-right">' + numeral(data.claim_amount).format('$ 0,0.00') + '</td>' +
      '<td class="hasinput">' +
      '<div class="input-group">' +
      '<button type="button" class="btn btn-sm btn-default delete-claim"><i class="fa fa-trash-o text-danger" aria-hidden="true"></i></button>' +
      '</div>' +
      '</td>' +
      '</tr>';
    return _html;
  },

  productLimit: function (productID, table = '#table_claim_limit') {
    $.ajax({
      url: link._claimLimitProductID,
      type: 'post',
      data: { ID: productID, token: localStorage.getItemValue('token'), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
      dataType: 'json',
      success: function (_data) {
        if (_data.ERROR == '' && _data.claimLimit.length > 0) {
          var content = '';
          // window.productSKU = _data.claimLimit[0].SKU;
          for (var key in _data.claimLimit[0].limits) {
            content += ClaimWarrantyLimit.prototype.createClaimLimitRow({
              ID: _data.claimLimit[0]['ID'],
              claim_name: key,
              claim_amount: _data.claimLimit[0].limits[key]
            })
          }
          content += ClaimWarrantyLimit.prototype.createClaimLimitRow();
          $('#table_claim_limit_error').empty();
          $(table + ' tbody').html(content);
          if (window.location.href.indexOf('claim-limit-form') > 0)
            $('input[name=ID]').val(_data.claimLimit[0]['ID']);
        } else {

          $(table + ' tbody').html(ClaimWarrantyLimit.prototype.createClaimLimitRow());
          $('#table_claim_limit_error').html('The claim limit is empty');
          if (window.location.href.indexOf('claim-limit-form') > 0)
            $('input[name=ID]').val('');
        }
      }
    });
  },

  loadClaimLimitList: function (list = [], table = '#table_claim_limit', ID = '') {
    if (!list || list.length == 0) {
      $(table + ' tbody').append(this.createClaimLimitRow());
      return;
    } else {
      var _html = '';
      list.forEach(function (item) {
        item.ID = (item.ID ? item.ID : ID);
        _html += this.createClaimLimitRow(item)
      });
      _html += this.createClaimLimitRow();
      $(table + ' tbody').append(_html);
    }
  },
  getClaimLimit: function (table = '#table_claim_limit') {
    var result = {};
    $(table + ' tbody').find('tr').each(function (row, elem) {
      var name = $(this).find('.claim_name').text();
      amount = $(this).find('.claim_amount').text();
      if (name != '' && amount != '')
        result[name] = numeral(amount).value();
    });
    return result;
  },
  submitForm: function (fieldsetID) {
    var data = {};
    var limit = ClaimWarrantyLimit.prototype.getClaimLimit('#table_' + fieldsetID + ' #table_claim_limit');
    if (limit && limit != {}) {
      data.limits = JSON.stringify(limit).replace(/'/, '\'');
      data.product_ID = $('#fieldset_' + fieldsetID).find('select[name=product_ID]').val();
      data.ID = $('#fieldset_' + fieldsetID + ' input[name=ID]').val();
      data.token = localStorage.getItemValue('token');
      data.jwt = localStorage.getItemValue('jwt');
      data.private_key = localStorage.getItemValue('userID');
      _link = link._claimLimitSave;
      if (data.ID == '') {
        delete data.ID;
      }
      $.ajax({
        url: _link,
        type: 'post',
        data: data,
        success: function (res) {
          var tmp = JSON.parse(res);
          if (tmp.ERROR == '') {
            messageForm('You have successfully save the claim limit', true);
          } else {
            messageForm('Error! An error occurred. ' + tmp.ERROR, false);
          }
        }
      })
    }
  },


}

var _claimWarrantyLimit = new ClaimWarrantyLimit();
_claimWarrantyLimit.init();