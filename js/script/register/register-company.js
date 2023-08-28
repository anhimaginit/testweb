function CompanyForm() { }
var iti;
CompanyForm.prototype.constructor = CompanyForm;
CompanyForm.prototype = {
   init: function () {
      _companyState = new State({ element: "#company_form" });
      old_vendor = '';
      url_company_open = this.url_company_open;
      this.setView();
      this.bindEvent();
      this.selectVendorCheckbox($('#company_form input:checkbox[value="Vendor"]').prop('checked'));
   },

   setView: function () {
      _companyPhone = new ContactPhone('#company_form #table_phone');
      _companyPhone.init();
      var width = jQuery('#company_form input[name=fax]').width() - $('#company_form #company_url_protocol').width() - $('#company_form #btn_company_open_url').width() - 15;
      $('#company_form #btn_company_open_url').css({ height: '34px' });
      $('#company_form #company_url_host').css({ 'width': width });
   },

   url_company_open: function () {
      //get url:
      var _url_protocol = $('#company_form #company_url_protocol').val();
      var _url_host = $('#company_form #company_url_host').val();

      if (_url_host) {
         window.open(_url_protocol + _url_host, '_blank');
      }
   },
   bindEvent: function () {
      var _self = this;
      jQuery(window).bind('resize', function () {
         var width = jQuery('#company_form input[name=fax]').width() - $('#company_form #company_url_protocol').width() - $('#company_form #btn_company_open_url').width() - 15;
         $('#company_form #company_url_host').css({ 'width': width });
      }).trigger('resize');

      $('#btnSubmitCompany').click(function () {
         $('#company_form').submit();
      })

      $('#company_form').validate(_self.companyOptionValidator);
      $('#company_form input:checkbox[value="Vendor"]').bind('change', function () {
         _self.selectVendorCheckbox($(this).prop('checked'));
      });

      $(function () {
         var tagsList;
         $.ajax({
            url: link._getTag,
            data: { token: localStorage.getItemValue('token'), tag_type: 'company' },
            type: 'post',
            dataType: 'json',
            success: function (data) {
               tagsList = data;
            }
         });

         var filterTags = function (tags) {
            var result = [];
            tagsList.forEach(function (item) {
               if (item.toLowerCase().indexOf(tags.toLowerCase()) >= 0) {
                  result.push(item);
               };
            })
            return result;
         }

         $('#company_form #tag').tagsInput({
            interactive: true,
            placeholder: 'Add a tag',
            width: 'auto',
            height: 'auto',
            delimiter: [',', ';', ' '],
            hide: true,
            removeWithBackspace: true,
            autocomplete_url: link._getTag,
            autocomplete: {
               source: function (req, res) {
                  res(filterTags(req.term));
               }
            },
         });

         $('#company_form #tag_tag').change(function () {
            var val = $(this).val();
            if ($('#company_form #tag').val().split(',').includes(val)) {
               $(this).val('');
            } else {
               $('#company_form #tag').addTag(val);
            }
         });

         $('#company_form #tag_tag').keyup(function (e) {
            var key = e.keyCode;
            /** 9 = tab, 13= enter, 37= ←, 38= ↑, 39= →, 40= ↓, 190= ., 106= *, 111= /, */
            var listList = [9, 13, 37, 38, 39, 40, 190, 106, 111]
            if (listList.includes(key)) {
               var val = $(this).val();
               if ($('#company_form #tag').val().split(',').includes(val)) {
                  $(this).val('');
               } else {
                  $('#company_form #tag').addTag(val);
                  $(this).val('');
                  $(this).focus();
               }
            }
         });
      })

      $('#company_form #btnBackCompany').click(function () {
         if (window.location.href.indexOf('company-form') >= 0) {
            window.history.back();
         } else {
            $('.modal').modal('hide');
            $('#company_form').trigger('reset');
         }
      });

   },
   companyOptionValidator: {
      rules: {
         name: { required: true },
         address1: { required: true },
         phone: { required: true },
         fax: { digits: true },
         email: { email: true, required: true },
      },
      messages: {
         phone: 'Please enter phone number'
      },
      submitHandler: function () {
         CompanyForm.prototype.submitForm();
      }
   },
   submitForm: function () {
      var _formData = {
         token: localStorage.getItemValue('token'),
         jwt: localStorage.getItemValue('jwt'),
         private_key: localStorage.getItemValue('userID')
      };

      var _data = $("#company_form").serializeArray()
      _data.forEach(function (elem) {
         if (elem.name != '' && elem.value != '') {
            _formData[elem.name] = elem.value;
         }
      });

      //get phone
      _formData.phone = $("#company_form #table_phone .primary_phone").val();
      _formData.second_phone = _companyPhone.getSecondaryPhone();

      //get company Notes
      if (window.location.href.indexOf('company-form') >= 0) _formData.comp_note = JSON.stringify(_notecontact.getNotes());
      else _formData.comp_note = '[]';

      _formData.type = '[' + ($('#company_form input:checkbox[name="type"]:checked').map(function (_, el) { return '"' + $(el).val() + '"'; }).get()).toString() + ']';
      //get vendor doc
      if (_formData.type.indexOf('Vendor') >= 0) {
         _formData.vendor = 1;
         if (_formData.vendor_type) _formData.vendor_type = JSON.stringify(_formData.vendor_type.split(','));
         _formData.vendor_doc = companyDocument.getDocuments();
      } else {
         delete _formData.vendor_type;
         delete _formData.vendor_note;
      }

      //get url company
      {
         var _url_protocol = $('#company_form #company_url_protocol').val();
         var _url_host = $('#company_form #company_url_host').val();

         if (_url_host) {
            if (_url_host.startsWith('http://') || _url_host.startsWith('https://'))
               _formData.www = _url_host;
            else
               _formData.www = _url_protocol + _url_host;
         }

      }

      var _link = link._compAddNew;
      if (_formData.ID != '' && _formData.ID != undefined && window.location.href.indexOf('company-form') >= 0) {
         _link = link._companyUpdate;
      } else {
         delete _formData.ID;
      }
      $.ajax({
         url: _link,
         type: 'post',
         data: _formData,
         success: function (res) {
            var _data = JSON.parse(res);
            if (_data.ERROR == '') {
               if (_link == link._compAddNew) {
                  $('#register_form input[name=company_name]').append('<option value="' + _data.ID + '" selected>' + _formData.name + '</option>').trigger('change');
                  $('.modal').modal('hide');
                  $('#company_form').trigger('reset');
                  messageForm('You have successfully added new company', true);
               }
               return;
            }
         }
      })
   },

   selectVendorCheckbox: function (status) {
      if (status) {

         if (!$('#company_form #tag').val() || !$('#company_form #tag').val().split(',').includes('Vendor')) {
            $('#company_form #tag').addTag('Vendor');
         }
         $('#company_form #vendor_expand').show();
      } else {
         if ($('#company_form #tag').val() && $('#company_form #tag').val().split(',').includes('Vendor')) {
            $('#company_form #tag').removeTag('Vendor');
         }
         $('#company_form #vendor_expand').hide();
      }

   }
}

var _companyForm = new CompanyForm();
_companyForm.init();