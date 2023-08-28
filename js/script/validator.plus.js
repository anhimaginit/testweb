jQuery.validator.addMethod("notEqual", function (value, element, param) {
   return this.optional(element) || value != $(param).val();
}, "This has to be different");

jQuery.validator.addMethod('phone', function (value, element, param) {
   var re = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
   return this.optional(element) || re.test(String(value));
}, "This field must be the phone number");

jQuery.validator.addMethod('emailContact', function (value, element, param) {
   return this.optional(element) || $checkEmailContact(value, element, param).then(function () {
      return true;;
   }).catch(function (e) { });
}, 'This email is already exists');

jQuery.validator.addMethod('SKUUnique', function (value, element, param) {
   return this.optional(element) || $checkSKUUnique(value).then(function () {
      return true;
   }).catch(function (e) { return false });
}, 'This SKU is already exists');

jQuery.validator.addMethod('isCheckNormalText', function (value, element, param) {
   var regex = new RegExp('[!@#$%^&*(),.?":{}|<>]');
   return this.optional(element) || (value == '') ? true : ((regex.test(value) || value.indexOf("\\") >= 0 || value.indexOf("'") >= 0 || value.indexOf('+') >= 0 || value.indexOf(' ') >= 0 || value.indexOf('/') >= 0 || value.indexOf('*') >= 0 || value.indexOf('-') >= 0)) ? false : true;
}, 'This field is include [a-z], [A-Z], [0-9] and [_]');

jQuery.validator.addMethod('phoneContact', function (value, element, param) {
   return this.optional(element) || $checkPhoneNumber(value, element, param).then(function(){return true}).catch(e=>{});
}, 'This phone is already exists');

$('.select2').on('select2:select', function () {
   $(this).valid();
});

function $checkSKUUnique(value) {
   return new Promise(function (resolve, reject) {
      if (value.length > 0) {
         $.ajax({
            url: link._isSKUExisting,
            type: 'POST',
            data: { token: localStorage.getItemValue('token'), SKU: value, jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') }
         }).done(function (_data) {
            if (_data == 'false') {
               return resolve(true);
            } else {
               return reject(false);
            }
         });
      } else {
         return reject(false);
      };
   })
}
function $checkPhoneNumber(value, element, param) {
   if (value == '') {
      $checkPhoneDisplay('none', element);
      return Promise.resolve('Nothing');
   }
   return new Promise(function(resolve, reject){
      $.ajax({
         url: link._phoneExisting,
         type : 'post',
         data : {token: localStorage.getItemValue('token'), primary_phone: value, contactID: $(param[0]).val()},
         dataType : 'json',
         success : function(res){
            if(res.existing==false){
               $checkPhoneDisplay('false', element);
            }else{
               $checkPhoneDisplay('true', element);
            }
         },
         error : function(e){

         }
      });
   });
}
/**
 * 
 * @param {String} status : 
 * 'true': is exist from sys, invalid
 * 'false' : not exist, valid
 * 'other' : remove status
 * @param {DOM} element 
 * @param {Number} id 
 */
function $checkPhoneDisplay(status, element, id) {
   $(element).parent().children('p.error').remove();
   $(element).closest('tr').removeClass('success danger');
   if (status == 'true') {
      $(element).closest('tr').addClass('danger');
      $('.phone_status').html('<i class="fa fa-2x fa-times-circle text-danger"></i> <span class="error">The phone number is already used</span>');
   } else if (status == 'false') {
      $(element).closest('tr').addClass('success');
      $(element).addClass('bg-success');
      $('.phone_status').html('<i class="fa fa-2x fa-check-circle text-success"></i> <span class="text-success">The phone is valid</span>');
   } else {
      $('.phone_status').empty();
   }
}
function $checkEmailContact(value, element, param) {
   if (value == '') {
      $checkEmailDisplay('none', element);
      return Promise.resolve('Nothing');
   }
   return new Promise(function (resolve, reject) {
      return $.ajax({
         url: link._isCheckEmailExisting,
         type: 'POST',
         data: { token: localStorage.getItemValue('token'), primary_email: value, ID: $(param[1]).val(), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
         dataType: 'json',
         success: function (res) {
            if (res.existing == true) {
               if ($(param[0]).val() != value) {
                  $checkEmailDisplay('true', element, res.ID);
                  //'Update email exists'+contact['primary_email']
                  return reject(false);
               } else {
                  // 'Check email ok'
                  $checkEmailDisplay('false', element);
                  return resolve(true);
               }
            } else {
               // 'Check email ok'
               $checkEmailDisplay('false', element);
               return resolve(true);
            }
         }
      });
   })
}
/**
 * 
 * @param {boolean} status : display status {true : exist, false: no exist, none : nothing}
 * @param {HTML Element} element : element to check
 * @param {Number} id :contact ID
 */
function $checkEmailDisplay(status, element, id) {
   $(element).parent().children('p.error').remove();
   if (status == 'true') {
      $(element).parent().removeClass('state-success state-error');
      $(element).parent().addClass('state-error');
      $(element).parent().append('<p class="error">This email is already exist. <a href="./#ajax/contact-form.php?id=' + id + '">Click here to view profile</a></p>');
   } else if (status == 'false') {
      $(element).parent().removeClass('state-success state-error');
      $(element).parent().addClass('state-success');
   } else {
      $(element).parent().removeClass('state-success state-error');
   }
}
