function UserWarranty() { }

UserWarranty.prototype.constructor = UserWarranty;
UserWarranty.prototype = {
   init: function () {

   },
   loadData: function () {

   },
   bindEvent: function () {
      $('#newWarrantyForm').validate(UserWarranty.prototype.validateOptions);
      $('select[name=is_prop_new_existing]').change(function () {
         if ($(this).val().startsWith('New')) {
            $('input[name=property_type]').hide();
            fieldsCustomerWarranty[2].fields[1].required = false;
         } else {
            $('input[name=property_type]').show();
            fieldsCustomerWarranty[2].fields[1].required = true;

         }
      });
   },

   validateOptions: {
      rules: {
         contact_email: { email: true, required: true }
      },
      messages: {
         contact_email: 'Please enter your email'
      },
      submitHandler: function () {
         UserWarranty.prototype.searchContactEmail($('input[name=contact_email]').val());
      }
   },
   /** step search */
   searchContactEmail: function (_email) {
      $.ajax({
         url: link._cusWarrantyGetByEmail,
         type: 'post',
         data: { token: localStorage.getItemValue('token'), email: _email },
         dataType: 'json',
         success: function (res) {
            if (res.length > 0) {
               $.cookie('editCustomerWarranty', res[0].ID, { path: '/' });
               $.cookie('cw', JSON.stringify(res), { path: '/' });
            }
            window.location.href = host2 + 'u/new-warranty/' + (res.length > 0 ? '?id=' + btoa(res[0].ID) : '');
         }
      });;
   },
   step: function (step) {
      step = Number(step) - 1;
      var formField = fieldsCustomerWarranty[step].fields;
      var _mObject = {};
      var _error = [];
      formField.forEach(function (field) {
         if (field.type == 'checkbox') {
            _mObject[field.name] = $('input[name=' + field.name + ']').prop('checked') == true ? 1 : 0;
         } else {
            _mObject[field.name] = $('*[name=' + field.name + ']').val();
         }
         if (field.required == true && (_mObject[field.name] == '' || _mObject[field.name] == undefined)) {
            _error.push({ item: field.name, e: 'Please enter ' + field.label + ' field' });
         } else {
            _error.push({ item: field.name });
         }
         if (field.expand) {
            if (_mObject[field.name] != '' && _mObject[field.name] != undefined && _mObject[field.name] != 0) {
               field.expand.forEach(function (item) {
                  if (item.type == 'checkbox') {
                     _mObject[item.name] = $('input[name=' + item.name + ']').prop('checked') == true ? 1 : 0;
                  } else {
                     _mObject[item.name] = $('*[name=' + item.name + ']').val();
                  }
                  if (item.required == true && (_mObject[item.name] == '' || _mObject[item.name] == undefined)) {
                     _error.push({ item: item.name, e: 'Please enter ' + item.label + ' field' });
                  } else {
                     _error.push({ item: item.name });
                  }
               });
            }
         }
      });
      var hasError = false;
      _error.forEach(function (e) {
         if (e.e) {
            $('input[name=' + e.item + ']').addClass('error');
            $('input[name=' + e.item + ']').after('<p class="error">' + e.e + '</p>');
            hasError = true;
         } else {
            $('input[name=' + e.item + ']').removeClass('error');
            $('input[name=' + e.item + ']').parent().find('p').remove();
         };
      });
      if (hasError) {
         return;
      } else {
         _mObject.token = localStorage.getItemValue('token');
         var _link = '';
         if (step == 0) {
            _link = link.newCustomerWarranty[0];
         } else {
            _link = link.updateCustomerWarranty[step];
         }
         if ($.cookie('editCustomerWarranty')) {
            _mObject.ID = $.cookie('editCustomerWarranty');
         }
         $.ajax({
            url: _link,
            type: 'post',
            data: _mObject,
            dataType: 'json',
            success: function(res) {
               if (!$.cookie('editCustomerWarranty')) {
                  $.cookie('editCustomerWarranty', res.ID, { path: '/' });
               }
            }
         })

      }
   }
}

var _uWarranty = new UserWarranty();
_uWarranty.init();
_uWarranty.bindEvent();
step = _uWarranty.step;

