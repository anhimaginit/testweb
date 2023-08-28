function Register() { }
Register.ID = ''
Register.first_name = ''
Register.middle_name = ''
Register.last_name = ''
Register.primary_street_address1 = ''
Register.primary_street_address2 = ''
Register.primary_city = ''
Register.primary_state = ''
Register.primary_postal_code = 0
Register.primary_phone = ''
Register.primary_phone_ext = ''
Register.primary_phone_type = ''
Register.primary_email = ''
Register.company_name = ''
Register.contact_type = ''
Register._Reg = null;
var contact_old = null;
Register.prototype.constructor = Register;
Register.prototype = {
   init: function () {
      setCompany = this.setCompanyID;
      _State = new State({ element: "#register_form" });

      this.setView();
      _Reg.bindEvent();

      $.get('data/contact-vendor-type.json', function(res){
         window.contact_vendor_type = res;
      });
      $('#register_form #affiliate_type_pane').html(Register.prototype.selectAffiliate());
   },
   setView: function () {
      $('#company_form #btnBackCompany').text('Cancel');

      $('#register_form [name=company_name]').select2({
         placeholder: 'Search Company',
         minimumInputLength: 1,
         language: {
            inputTooShort: function () {
               return 'Enter company name';
            },
         },
         ajax: {
            url: link._companiesByName,
            type: 'post',
            dataType: 'json',
            delay: 300,
            data: function (params) {
               var _data = {
                  token: localStorage.getItemValue('token'),
                  jwt: localStorage.getItemValue('jwt'),
                  private_key: localStorage.getItemValue('userID'),
                  name: params.term
               }
               return _data;
            },
            processResults: function (data, params) {
               if (data && data.list) {
                  data = data.list;
               }
               data = $.map(data, function (obj) {
                  obj.id = obj.ID;
                  return obj;
               });
               return { results: data }
            },
            cache: true
         },
         escapeMarkup: function (markup) { return markup; },
         templateResult: function (item) {
            var city_state = [];
            if (item.city && item.city.trim() != '') city_state.push(item.city);
            if (item.state && item.state.trim() != '') city_state.push(item.state);
            return '<div class="padding-5">' +
               '<div class="">' + item.name + '<div class="pull-right">' + city_state.join(' - ') + '</div>' +
               '</div>' +
               (item.address1 && item.address1 != '' ? '<div>' + item.address1 + '</div>' : '') +
               '</div>';
         },
         templateSelection: function (item) {
            if (!item.name)
               if (item.text) return item.text;
               else return item.id;
            return item.name;
         }
      });

   },
   bindEvent: function () {
      var _self = this;
      jQuery(window).bind('resize', function () {
         var width = jQuery('#register_form input[name=first_name]').width() - $('#register_form #url_protocol').width() - $('#contact_form #btn_open_url').width() - 15;
         $('#register_form #url_host').css({ 'width': width });
      }).trigger('resize');


      $('input').bind('mousedown', function () {
         $('#message_form').hide(200);
      });

      $("#register_form").validate(_self.formValidateOption);

      $('#register_form select[name="RegisterType"]').bind('change', function () {
         if (this.value == 'Affiliate') {
            $('#register_form #affiliate_type_pane').show();
            $('#register_form #affiliate_type_pane').html(_Reg.selectAffiliate());
            $('#register_form #vendor_type_pane').hide();
         }
         if (this.value == 'Vendor') {
            $('#register_form #vendor_type_pane').show();
            $('#register_form #vendor_type_pane').html(_Reg.selectVendor());
            $('#register_form #affiliate_type_pane').hide();
         }
      });

   },
   setCompanyID: function (companyID, name) {
      $('#register_form input[name=company_ID]').val(companyID);
      $('#register_form #old_company').val(name);
      $('#register_form input[name=company_name]').val(name);
      $("#register_form #company_search").css("display", "none");
   },

   formValidateOption: {
      rules: {
         first_name: { required: true, maxlength: 30 },
         middle_name: { maxlength: 30 },
         last_name: { required: true, maxlength: 30 },
         primary_street_address1: { required: true, maxlength: 254 },
         primary_street_address2: { maxlength: 254 },
         primary_phone: { maxlength: 20, digits: true, number: true },
         primary_phone_ext: { maxlength: 10 },
         primary_phone_type: { maxlength: 10 },
         primary_email: { required: true, email: true, maxlength: 254 },

         company_name: { maxlength: 100 }
      },
      messages: {
         primary_phone: {
            required: 'Please enter phone number',
            digits: 'Please enter phone number',
            number: 'Please enter phone number',
         }
      },
      submitHandler: function (e) {
         var _f_data = {}
         var _data = $("#register_form").serializeArray()
         _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
               _f_data[elem.name] = elem.value;
            }
         });
         //get Affiliate
         if ($('#register_form select[name="RegisterType"] option:selected').val() == "Affiliate")
            _f_data.aff_type = ($('#register_form input[name="affiliate_type"]:checked').map(function (_, el) { return $(el).val(); }).get()).toString();

         //get Vendor
         if ($('#register_form select[name="RegisterType"] option:selected').val() == "Vendor")
            _f_data.V_type = _Reg.getVendor();

         //get Contact Document if the contact is Employee or Vendor

         _f_data.token = localStorage.getItemValue('token');

         _f_data.contact_type = ($('#register_form select[name="RegisterType"] option:selected').val()).toString();


         _f_data.primary_phone = $("#register_form #table_phone .primary_phone").val();
         _f_data.second_phone = _contactPhone.getSecondaryPhone();
         _f_data.company_name = $('#register_form [name=company_name]').val();

         var _link = ''

         _link = link._register;

         // delete unused data
         delete _f_data.affiliate_type;

         $.ajax({
            url: _link,
            type: "POST",
            data: _f_data,
            success: function (res) {
               if (res.startsWith('{')) {
                  var tmp = JSON.parse(res);
                  if (tmp.SAVE == 'FAIL') {
                     messageForm('Error! An error occurred. ' + tmp.ERROR, false)
                     return
                  } else if (tmp.SAVE == 'SUCCESS') {
                     window.location.href = "signin.php"
                  }
               }
            }
         });
      }
   },

   displayDocument: function () {
      var type = ($('input[name="contact_type"]:checked').map(function (_, el) { return $(el).val(); }).get()).toString();
      if (type.length > 0) {
         $('#contact_document_pane').css('display', 'block');
      } else {
         $('#contact_document_pane').css('display', 'none');
      }
   },

   selectAffiliate: function () {
      var dataSet = ['Real Estate Agent', 'Mortgage', 'Title', 'Other'];
      var _html = [];
      _html.push('<div class="col col-6">');
      dataSet.forEach(function (item) {
         _html.push('<div class="underline"><label class="checkbox" style="width:100%"><input type="checkbox" name="affiliate_type" value="' + item + '" class="pull-right"> ' + item + ' <i style="position: inherit; float: right;"></i></label></div>');;
      });
      _html.push('</div>');
      return _html.join('');
   },

   selectVendor: function () {
      var dataSet = window.contact_vendor_type;
      var _html = [];
      _html.push('<div class="col col-6">');
      dataSet.forEach(function (item) {
         _html.push('<div class="underline"><label class="checkbox" style="width:100%"><input type="checkbox" name="vendor_type" value="' + item + '" class="pull-right"> ' + item + ' <i style="position: inherit; float: right;"></i></label></div>');;
      });
      _html.push('</div>');
      return _html.join('');
   },

   getVendor: function () {
      var result = [];
      $('#register_form input[name="vendor_type"]:checked').each(function (index, elem) {
         result.push(elem.value);;
      })
      return result.join(',');
   }
}
var _Reg = new Register();
_Reg.init();