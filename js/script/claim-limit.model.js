function ClaimLimit(option) {
   if (option != undefined) {
      if (option.ID) {
         this.ID = option.ID;
      }
      if (option.detail) {
         this.detail = detail;
      }
      this.claim_name = option.claim_name ? option.claim_name : '';
      this.claim_amount = option.claim_amount ? option.claim_amount : '';
   }
}

ClaimLimit.prototype.constructor = ClaimLimit;
ClaimLimit.prototype = {
   createClaimLimitRow: function (hasinput) {
      var s = '<tr id="_' + (this.ID ? this.ID : '') + '">';
      // s += '<td>' + (this.ID ? this.ID : '') + '</td>';
      s += '<td>' + this.claim_name + '</td>';
      s += '<td class="text-right">' + (this.claim_amount >= 0 ? numeral(this.claim_amount).format('$ 0,0.00') : '(' + numeral(-this.claim_amount).format('$ 0,0.00') + ')') + '</td>';
      if (hasinput) {
         if (isAdmin()) {
            /** Admin can delete, edit file */
            s += '<td class="hidden"><input type="text" class="form-control" value="' + this.claim_name + '"></td>';
            s += '<td class="hidden"><input class="form-control input-currency" value="' + this.claim_amount + '"></td>';
            s += '<td class="hasinput">';
            s += '<a class="btn btn-dedault edit-claim" onclick="editClaimLimit(this)">&nbsp;<i class="fa fa-edit text-primary"></i>&nbsp;</a>';
            s += '<a class="btn btn-dedault delete-claim" onclick="deleteClaimLimit(this)">&nbsp;<i class="fa fa-trash text-danger"></i>&nbsp;</a>';
            s += '<button class="btn btn-sm btn-primary" type="button" onclick="saveEditClaimLimit(this)" style="display:none">Save</button>';
         }
         s += '</td>';
      }
      s += '</tr>';
      return s;
   },
   createClaimLimitRowInput: function (hasinput) {
      if (hasinput) {
         var _s = '<tr>' +
            '<td class="hidden"></td>' +
            '<td class="text-right hidden"></td>' +
            '<td class="hasinput">' +
            '<input type="text" class="form-control" value="">' +
            '</td>' +
            '<td class="hasinput">' +
            '<input class="form-control input-currency" value="">' +
            '</td>' +
            '<td class="hasinput">' +
            '<a class="btn btn-dedault edit-claim" onclick="editClaimLimit(this)" style="display: none;">&nbsp;<i class="fa fa-edit text-primary"></i>&nbsp;</a>' +
            '<a class="btn btn-dedault delete-claim" onclick="deleteClaimLimit(this)" style="display: none;">&nbsp;<i class="fa fa-trash text-danger"></i>&nbsp;</a>' +
            '<button class="btn btn-sm btn-primary" type="button" onclick="saveEditClaimLimit(this)" style="">Save</button></td></tr>';
         return _s.toString();
      } else {
         return '<tr>' +
            '<td class="hidden"></td>' +
            '<td class="text-right hidden"></td>' +
            ' </tr>';
      }
   },
   createClaimLimitDetailRow: function () {
      var s = '<tr id="' + this.claim_name + '_' + this.claim_amount + '">';
      // s += '<td>' + (this.ID ? this.ID : '') + '</td>';
      s += '<td>' + this.claim_name + '</td>';
      s += '<td>' + (this.claim_amount >= 0 ? numeral(this.claim_amount).format('$ 0,0.00') : '(' + numeral(-this.claim_amount).format('$ 0,0.00') + ')') + '</td>';
      s += '<td>' + this.detail + '</td>';
      s += '</tr>';
      return s;
   },
   editClaimLimit: function (element) {
      $(element).closest('tr').each(function (row, elem) {
         var $tds = $(this).find('td'),
            name = $tds.eq(2).find('input').val(),
            amount = $tds.eq(3).find('input').val();

         if (name && name != '' && amount && amount != '') {
            $tds.eq(0).addClass('hidden');
            $tds.eq(1).addClass('hidden');
            $tds.eq(2).removeClass('hidden');
            $tds.eq(3).removeClass('hidden');
            $(element).closest('td').find('button').show();
            $(element).closest('td').find('a').hide();

         }
      });
   },
   deleteClaimLimit: function (elem) {
      var index = $(this).closest('tr').index();
      var length = $(this).closest('tbody').find('tr').length;
      if (index == length - 1) {

      }
      $(elem).closest('tr').remove();
   },
   saveEditClaimLimit: function (element) {
      $(element).closest('tr').each(function (row, elem) {
         var $tds = $(this).find('td');
         $tds.eq(0).text($tds.eq(2).find('input').val());
         $tds.eq(1).text(numeral($tds.eq(3).find('input').val()).format('$ 0,0.00'));

         $tds.eq(3).addClass('hidden');
         $tds.eq(2).addClass('hidden');
         $tds.eq(1).removeClass('hidden');
         $tds.eq(0).removeClass('hidden');

         $(element).hide();
         $(element).closest('td').find('a').show();
      });
   },
}

editClaimLimit = ClaimLimit.prototype.editClaimLimit;
saveEditClaimLimit = ClaimLimit.prototype.saveEditClaimLimit;
deleteClaimLimit = ClaimLimit.prototype.deleteClaimLimit;