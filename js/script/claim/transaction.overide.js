var overrideItem = null;

function getOverideForm() {
   var
      // row = $('#overide_form #overide_row').val(),
      available = parseFloat($('#overide_form input[name=overide_available]').val()),
      amount = parseFloat($('#overide_form input[name=overide_amount]').val()),
      password = $('#overide_form input[name=overide_password]').val();
   // fields is required 
   var check = (amount > available && amount >= Math.abs(available)) || (amount < available && amount > 0);
   if (available == '' || amount == '' || !check) {
      mesageForm('Values is invalid, Please enter again', false, '#overide_form #message_form');
      return;
   }
   // check current password, 
   // if true, can overide
   checkPassword(password).then(function (result) {
      truePassword = true;

      var tr = $(overrideItem).closest('tr').find('td');
      tr.eq(8).text('true');
      tr.eq(9).remove();
      $('#overide_form input[name=overide_name]').val('');
      $('#overide_form input[name=overide_available]').val('');
      $('#overide_form input[name=overide_amount]').val('');
      $('.modal').modal('hide');
   }).catch(function (e) {
      mesageForm('Your password is incorrect', false, '#overide_form #message_form');
   });
}

$("#overide_form input").mousedown(function (e) {
   $("#overide_form #message_form").hide();
   $(".message_table").hide();
   $(".message_chat").hide();
});

function setOverideForm(elem) {
   var row = $(elem).closest('tr').index();
   var tr = $('#transaction_table_form tbody').find('tr').eq(row).find('td');
   var claim = numeral(tr.eq(6).find('input').val()).value();
   var available = numeral(tr.eq(4).text()).value();
   overrideItem = elem;

   $('#overide_form input[name=overide_name]').val(tr.eq(1).text());
   $('#overide_form input[name=overide_available]').val((available));
   $('#overide_form input[name=overide_amount]').val(claim);
}

function checkPassword(password) {
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
}