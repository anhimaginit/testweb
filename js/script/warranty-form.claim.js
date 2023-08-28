function WarrantyClaim(id) {
   // delete window.warranty_claim_table;
   this.id = id;
}
WarrantyClaim.prototype.constructor = WarrantyClaim;
WarrantyClaim.prototype = {
   getList: function (id) {
      let _self = this;
      return new Promise(function (resolve, reject) {
         var _data = $.extend({
            warranty_ID : _self.id || id,
            warrantyID : _self.id || id
         }, template_data);
         $.ajax({
            url: link._claimsByWarrantyID,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
               if (res.list && res.ERROR == '') {
                  resolve(res.list);
               } else {
                  reject(res.ERROR);
               }
            }
         });
      });
   },

   appendList: function (_list) {
      // var list = window.warranty_claim_table.rows;
      // list.push(..._list);
      // window.warranty_claim_table.clear();
      window.warranty_claim_table.rows.add(_list);
      window.warranty_claim_table.draw();
   },

   loadList: function (list) {
      var self = this;
      if (!list) {
         self.getList().then(function (result) {
            self.loadTable(result);
         }).catch(function(e){});
      } else {
         self.loadTable(list);
      }
   },

   loadTable: function (list) {
      if (list) {
         if (window.warranty_claim_table) {
            window.warranty_claim_table.clear();
            window.warranty_claim_table.rows.add(list);
            window.warranty_claim_table.draw();

         } else {
            window.warranty_claim_table = $('#warranty_claim').DataTable({
               data: list,
               searching: false,
               destroy: true,
               columns: [
                  {
                     mRender: function (data, type, row) {
                        return '<a href="./#ajax/claim-form.php?id=' + row.ID + '" target="_blank">' + row.ID + '</a>';
                     }
                  },
                  {
                     mRender: function (data, type, row) {
                        return '<a href="./#ajax/contact-form.php?id=' + row.create_by + '" target="_blank">' + row.create_by_name + '</a>';
                     }
                  },
                  { data: 'contact_name' },
                  { data: 'status' },
                  {
                     mRender: function (data, type, row) {
                        return row.transactionID ? '<a href="./#ajax/claim-form.transaction.php?id=' + row.transactionID + '" target="_blank">' + row.transactionID + '</a>' : 'None';
                     }
                  },
                  { data: 'paid' },
                  { data: 'start_date' },
               ],
            });
         }
      }
   }

}