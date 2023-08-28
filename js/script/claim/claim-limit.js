function ClaimWarrantyLimit() { }

ClaimWarrantyLimit.prototype.constructor = ClaimWarrantyLimit;

var listProductOb = {};
ClaimWarrantyLimit.prototype = {
   init: function () {
      submitForm = this.submitForm;
      addClaimLimitToList = this.addClaimLimitToList;
      removeClaimLimit = this.removeClaimLimit;
      this.bindEvent();
   },

   bindEvent: function () {
      var _self = this;
      $(document).ready(function () {
         if ($('select[name=product_ID]').val() != '') {
            $(this).change();
         }
      }).on('keyup', '#table_claim_limit tbody input, #table_claim_limit tbody .btn', function () {
         $('#table_claim_limit_error').empty();
         var forForm = $(this).closest('form').find('#forForm').val();
         var index = $(this).closest('tr').index();
         var length = $(this).closest('tbody').find('tr').length;
         if (index == length - 1) {
            $('#table_' + forForm + ' #table_claim_limit tbody').append(new ClaimLimit().createClaimLimitRowInput(true).toString());
         }
      });

      $('select[name=product_ID]').bind('change', function () {
         var forForm = $(this).closest('form').find('#forForm').val();
         if (this.value && this.value != '') {
            var id = this.value;
            var _claimLimitList = new ClaimLimitList();
            _claimLimitList.loadData(id, '#table_' + forForm + ' #table_claim_limit', true);
            _self.viewProduct(this.value);

         } else {
            $('#fieldset_' + forForm + ' input[name=ID]').val('');
            $('#table_' + forForm + ' #table_claim_limit tbody').html(new ClaimLimit().createClaimLimitRowInput(true).toString());
            // $('#table_' + forForm + ' #table_claim_limit tbody').empty();
         }
      });

      $('#btnBackClaimLimit').click(function () {
         window.history.back();
      });

      $('input, select').bind('mousedown', function () {
         $('#message_form').hide(200);
      });

   },
   viewProduct: function (id) {
      $.ajax({
         url: link._productGetById,
         type: 'POST',
         data: { token: localStorage.getItemValue('token'), ID: parseInt(id), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
         success: function (res) {

         }
      });
   },
   removeClaimLimit: function (elem) {
      $(elem).closest('tr').remove();
   },
   submitForm: function (fieldsetID) {
      var data = {};
      var limit = new ClaimLimitList().getClaimList('#table_' + fieldsetID + ' #table_claim_limit');
      if (limit && limit != {}) {
         data.limits = JSON.stringify(limit);
         data.product_ID = $('#fieldset_' + fieldsetID).find('select[name=product_ID]').val();
         data.ID = $('#fieldset_' + fieldsetID + ' input[name=ID]').val();
         data.token = _token;
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

   addClaimLimitToList: function (item, fieldsetID) {
      var data = {};

      if ($('#fieldset_' + fieldsetID).find('select[name=product_ID]').val() == '') {
         messageForm('You must select product', false);
         return;
      }
      var tmp = $(item).closest('tr').find('td');
      data.claim_name = tmp.eq(0).find('input').val();
      data.claim_amount = tmp.eq(1).find('input').val();
      var __id = $('#fieldset_' + fieldsetID).find('input[name=ID]').val();

      if (data.claim_amount == '' || data.claim_name == '') {
         messageForm('You must input Claim name and amount', false);
         return;
      }
      if (__id != '') {
         data.ID = __id;
      }
      data.claim_name = current_sku_selected + '-' + data.claim_name;

      var _content = new ClaimLimit(data);
      // $('#table_claim_limit tbody').empty();
      $('#fieldset_' + fieldsetID).closest('form').find('#table_claim_limit tbody').prepend(_content.createClaimLimitRow(true));
      $('#fieldset_' + fieldsetID).closest('form').find('#table_claim_limit_error').empty();

      tmp.eq(0).find('input').val('');
      tmp.eq(1).find('input').val('');
   },

   createFirstRow: function (fieldsetID) {
      var _html =
         '<tr>' +
         '<td class="hidden"></td>' +
         '<td class="text-right hidden"></td>' +
         '<td class="hasinput">' +
         '<input type="text" class="form-control" value="">' +
         '</td>' +
         '<td class="hasinput">' +
         '<input class="form-control input-currency" value="">' +
         '</td>' +
         '<td class="hasinput">' +
         '<a class="btn btn-dedault edit-claim" onclick="editClaimLimit(this)">&nbsp;<i class="fa fa-edit text-primary"></i>&nbsp;</a>' +
         '<a class="btn btn-dedault delete-claim" onclick="deleteClaimLimit(this)">&nbsp;<i class="fa fa-trash text-danger"></i>&nbsp;</a>' +
         '</td></tr>';
      $('#table_' + fieldsetID + ' #table_claim_limit tbody').html(_html);
   },
}

var _claimWarrantyLimit = new ClaimWarrantyLimit();
_claimWarrantyLimit.init();
