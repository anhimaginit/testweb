function Contact() { }

Contact._contact = null;
var contact_old = null;
var text_vendor_exp_good = '<label class="text-success"><i class="fa fa-check-circle-o"></i> Good</label>';
var text_vendor_exp_bad = '<label class="text-danger"><i class="fa fa-warning"></i> Expired</label>';
var text_vendor_exp_empty = '<label></label>'
Contact.prototype.constructor = Contact;
Contact.prototype = {
   init: function (callback) {
      setCompany = this.setCompanyID;
      this.loadState();
      this.setView();
      _Contact.bindEvent();
      _notecontact = new NoteTable({
         form: 'Contact',
         table: '#contact_form #table_note_info'
      });
      _notecontact.init();

      _contactPhone = new ContactPhone('#contact_form #table_phone');
      _contactPhone.init();

      $.get('data/contact-vendor-type.json', function (res) {
         window.contact_vendor_type = res;
      });

       $.get('data/contact-employee-type.json', function (res) {
           window.contact_employee_type = res;
       //    alert(res);
       });

      if (callback) callback();
   },
   setView: function () {
      $('#company_form #btnBackCompany').text('Cancel');

      $('#contact_form [name=company_name]').select2({
         placeholder: 'Search Company',
         minimumInputLength: 1,
         language: {
            inputTooShort: function () {
               return 'Enter info';
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

      var tagsList;
      $.ajax({
         url: link._getTag,
         data: { token: localStorage.getItemValue('token'), tag_type: 'contact' },
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

      $('#contact_form [name=contact_tags]').tagsInput({
         interactive: true,
         placeholder: 'Add a tag',
         width: 'auto',
         height: 'auto',
         hide: true,
         removeWithBackspace: true,
         delimiter: [';'],
         autocomplete_url: link._getTag,
         autocomplete: {
            source: function (req, res) {
               res(filterTags(req.term));
            }
         }
      });
      $('#contact_form #gps').hide();

      this.loadSaleperson();
   },
   bindEvent: function () {
      var _self = this;

      $(document).unbind('change', '#contact_form #contact_tags_tag');
      $(document).unbind('keyup', '#contact_form #contact_tags_tag');

      $(document).on('change', '#contact_form #contact_tags_tag', function () {
         var val = $(this).val();
         if ($('#contact_form [name=contact_tags]').val().split(';').includes(val)) {
            $(this).val('');
         } else {
            $('#contact_form [name=contact_tags]').addTag(val);
         }
      }).on('keyup', '#contact_form #contact_tags_tag', function (e) {
         var key = e.keyCode;
         /** 9 = tab, 13= enter, 37= ←, 38= ↑, 39= →, 40= ↓, 190= ., 106= *, 111= /, */
         var listList = [9, 13, 37, 38, 39, 40, 190, 106, 111]
         if (listList.includes(key)) {
            var val = $(this).val();
            if ($('#contact_form [name=contact_tags]').val().split(';').includes(val)) {
               $(this).val('');
            } else {
               $('#contact_form [name=contact_tags]').addTag(val);
               $(this).focus().val('');
            }
         }
      });

      // $('input').bind('mousedown', function () {
      //    $('#message_form').hide(200);
      // });

      $("#contact_form").validate(_self.formValidateOption);

      $('#contact_form input[name=contact_type]').bind('change', function () {
         if (this.value == 'Affiliate') {
            $('#contact_form #affiliate_type_pane').html(_self.selectAffiliate($(this).prop('checked'), (contact_old && contact_old.aff_type ? contact_old.aff_type : null)));
         }

         if (this.value == 'Employee') {
            $('#contact_form #employee_type_pane').html(_self.selectEmployee($(this).prop('checked'), (contact_old && contact_old.E_type ? contact_old.E_type : null)));
         }

         if (this.value == 'Vendor') {
              $('#contact_form #vendor_type_pane').html(_self.selectVendor($(this).prop('checked'), (contact_old && contact_old.V_type ? contact_old.V_type : null), contact_old));
              _self.setEventVendorExp();
          }
         if (this.value == 'Sales') {
            _self.selectSale($(this).prop('checked'));
         }
      });

      var fw = getUrlParameter('fw');
      if (window.location.href.indexOf('contact') >= 0 && !(window.opener && fw)) {
         $('#btnBackContact').on('click', function () {
            window.history.back();
         });
      }
      $('#contact_form input[name=primary_street_address1]').change(function () {
         _self.getGPS(this.value).then(function (location) {
            return _self.setGPS(location);;
         }).catch(function (e) {
         })
      });
   },
   initUpdate: function (id) {
      contact_state = new State({ element: '#contact_form' });
      var _self = this;
      $.ajax({
         url: link._contactGetById,
         type: 'POST',
         data: { token: localStorage.getItemValue('token'), ID: parseInt(id), 'jwt': localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
         dataType: 'json',
         success: function (res) {
            var _contact = res[0];
            if (_contact == undefined || !_contact.ID) {
               // contact_state.bindAction('#contact_form');
               _contactPhone.createPhoneRow();
               messageForm('No data found with contact id = ' + id + ', please choose another id', false, '#contact_form #message_form');
               return;
            } else {
               contact_old = _contact;

               if (_contact.contact_type) {//set Type
                   //   console.log(_contact.contact_type);
                   //   alert(_contact.contact_type);
                   if(_contact.contact_type.includes('Employee')) {
                       //loading SMS credential if have
                       if(_contact.sms_api_username && _contact.sms_api_key) {
                           //alert("yes");

                           $("#SMS_credential").append('<section class="col col-6">' +
                               '<p style="font-weight: bold;">SMS API Credentials</p>' +
                               '<input type="text" id="api_msg_cre_uname" placeholder="" style="display: block; margin-bottom: 10px;"/>' +
                               '<input type="text" id="api_msg_cre_key" size="37" placeholder=""/>' +
                               '</section>');

                           $("#api_msg_cre_uname").val(_contact.sms_api_username);
                           $("#api_msg_cre_key").val(_contact.sms_api_key);
                       } else {

                              $("#SMS_credential").append('<section class="col col-6">' +
                               '<p style="font-weight: bold;">SMS API Credentials</p>' +
                               '<input type="text" id="api_msg_cre_uname" placeholder="Enter the API Username" style="display: block; margin-bottom: 10px;"/>' +
                               '<input type="text" id="api_msg_cre_key" size="35" placeholder="Enter the API key"/>' +
                               '</section>');

                       }

                   }

                   _contact.contact_type.split(',').forEach(function (type) {
                     $("#contact_form input:checkbox[name=contact_type][value='" + type.trim() + "']").prop('checked', true);
                  });
                  $('#contact_form #contact_document_pane').show();
               }




                if (_contact.doc && _contact.doc.length > 0) {// Load Document
                  contactDocument.pushDocuments(_contact.doc)
               }
               //load Affiliate Type
               $('#contact_form #affiliate_type_pane').html(_self.selectAffiliate(_contact.contact_type.split(',').includes('Affiliate'), _contact.aff_type));

               //load Employee Type
               $('#contact_form #employee_type_pane').html(_self.selectEmployee(_contact.contact_type.split(',').includes('Employee'), _contact.e_type));

                //load Vendor type
               $('#contact_form #vendor_type_pane').html(_self.selectVendor(_contact.contact_type.split(',').includes('Vendor'), _contact.V_type, _contact));
               _self.setEventVendorExp();

               _self.selectSale(_contact.contact_type.split(',').includes('Sales'), _contact.area);
               if (_contact.contact_type.includes('SystemAdmin')) {
                  $('#contact_form').prepend('<input type="checkbox" name="contact_type" value="SystemAdmin" class="hidden" checked>');
               }
               delete _contact.contact_type;

               for (var key in _contact) {
                  $("#contact_form input:text[name='" + key + "']").val(_contact[key]);
                  $("#contact_form input:hidden[name='" + key + "']").val(_contact[key]);
               }

               contact_state.setValue2('#contact_form', _contact.primary_city, _contact.primary_state, _contact.primary_postal_code, function () {
                  // contact_state.bindAction('#contact_form');
               });
               if (_contact.contact_tags && _contact.contact_tags != '') {
                  $('#contact_form [name=contact_tags]').importTags(_contact.contact_tags);
               }
               $('#contact_form textarea[name="contact_notes"]').val(_contact.contact_notes);
               $('#contact_form #primary_email_old').val(_contact.primary_email);
               $('#contact_form #primary_username_old').val(_contact.user_name);
               var _create_pane = '';
               txtCreateBy = _contact.create_by_id != _contact.ID ? '<a href="' + host2 + '/#ajax/contact.php">' : '';

               _create_pane += '<p class="col col-12">Create By: <span class="text-primary">' +
                  (_contact.create_by ? _contact.create_by : 'Yourself') + '</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last Updated By: <span class="text-primary">' +
                  (_contact.submit_by ? _contact.submit_by : 'System') + '</span>';

               if (_contact.ID == localStorage.getItemValue('userID')) {
                  _create_pane += '<span class="pull-right bold" style="font-size:16px; color:white; background:orange; border-radius:5px; padding:5px 20px;">Total overage: ' + numeral(_contact.total_overage).format('$ 0,0.00') + '</span></p>'
               }

               $('#contact_form #div_contact_info').html(_create_pane);
               if (_contact.primary_phone && _contact.primary_phone != '') {
                  _contactPhone.setPrimaryPhone(_contact.primary_phone);
               } else {
                  _contactPhone.setView();
               }
               if (_contact.second_phone) {
                  _contactPhone.loadListPhone(_contact.second_phone);
               } else {
                  _contactPhone.loadListPhone([]);
               }

               $('#contact_form input[name="create_by"]').val(_contact.create_by_id);
               $('#contact_form input[name="submit_by"]').val(_contact.submit_by_id);
               $('#contact_form input[name="primary_email"]').val(_contact.primary_email);
               $('#contact_form input[name="user_name"]').val(_contact.user_name);
               $('#contact_form input[name="primary_website"]').val(_contact.primary_website);
               $('#contact_form input[name="contact_inactive"]').prop('checked', _contact.contact_inactive == 1 || _contact.contact_inactive == '1' ? true : false);

               if (_contact.name && _contact.com_ID) {
                  $('#contact_form [name="company_name"]').append('<option value="' + _contact.com_ID + '" selected>' + _contact.name + '</option>').trigger('change');
                  $.cookie('companyID', _contact.com_ID, { path: '/', maxAge: 15 });
               }
               if (_contact.notes != undefined && _contact.notes.length > 0) {
                  _notecontact.displayList(_contact.notes);
               }

               if (_contact.track_mail != undefined && _contact.track_mail.length > 0 && track) {
                  track.show_track_email(_contact.track_mail);
               }
               //set GPS for map
               if (_contact.gps && _contact.gps != '{}' && _contact.gps != {}) {
                  $('#contact_form input[name="gps"]').val(_contact.gps);
                  _self.setGPS(_contact.gps);
               } else if (_contact.primary_street_address1 && _contact.primary_street_address1 != '') {
                  $('#contact_form input[name=primary_street_address1]').val(_contact.primary_street_address1).change();
               }
               $('#contact_form #gps').show();

               // set url
               if (_contact.primary_website) {
                  var _protocol = _contact.primary_website.startsWith('https') ? 'https://' : 'http://';
                  var _contact_host = _contact.primary_website.replace(_protocol, '');
                  $('#contact_form #url_protocol').val(_protocol);
                  $('#contact_form #url_host').val(_contact_host);
               }

               if(_contact.contact_salesman_id){
                  $('#contact_form [name="contact_salesman_id"]').val(_contact.contact_salesman_id).trigger('change');
               }
            }
         }
      })
   },
   formValidateOption: {
      rules: {
         first_name: { maxlength: 30 },
         middle_name: { maxlength: 30 },
         last_name: { maxlength: 30 },
         primary_street_address1: { maxlength: 254 },
         primary_street_address2: { maxlength: 254 },
         primary_email: { email: true, maxlength: 254 },
         primary_phone: {},
         primary_website: { url: true, maxlength: 254 },
         contact_tags: { maxlength: 5000 },
      },
      messages: {
         primary_email: {
            required: 'Please enter email or phone number',
         }
      },
      success: function (e) {
         $(e).remove();
      },
      submitHandler: function (form) {
         var _f_data = {};
         var _data = $(form).serializeArray()
         _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
               _f_data[elem.name] = elem.value;
            }
         });

         //get Affiliate
         if ($('#contact_form input[name=contact_type][value="Affiliate"]').prop('checked') == true)
            _f_data.aff_type = ($('#contact_form input[name="affiliate_type"]:checked').map(function (_, el) { return $(el).val(); }).get()).toString();

          //get Employee
          if ($('#contact_form input[name=contact_type][value="Employee"]').prop('checked') == true)
              _f_data.E_type = ($('#contact_form input[name="employee_type"]:checked').map(function (_, el) { return $(el).val(); }).get()).toString();

         //get Vendor
         if ($('#contact_form input[name=contact_type][value="Vendor"]').prop('checked') == true)
            _f_data.V_type = _Contact.getVendor();

         //get Contact Document if the contact is Employee or Vendor

         _f_data.token = localStorage.getItemValue('token');
         _f_data.jwt = localStorage.getItemValue('jwt');
         _f_data.private_key = localStorage.getItemValue('userID');
         _f_data.contact_inactive = $('#contact_form input[name=contact_inactive]').prop('checked') == true ? 1 : 0;

         _f_data.contact_type = ($('#contact_form input[name="contact_type"]:checked').map(function (_, el) { return $(el).val(); }).get()).toString();
         if (window.c_type) {
            _f_data.contact_type = window.c_type;
            if (window.a_type && window.a_type != '') _f_data.aff_type = window.a_type;
         }
         if (!_f_data.contact_type || _f_data.contact_type == '') _f_data.contact_type = 'Policy Holder';
         if (_f_data.contact_type.includes('Sales')) {
            _f_data.area = JSON.stringify($('.salemanState').val());
         }
         //get url:
         {
            var _url_protocol = $('#contact_form #url_protocol').val();
            var _url_host = $('#contact_form #url_host').val();

            if (_url_host) {
               if (_url_host.startsWith('https://') || _url_host.startsWith('http://')) {
                  _f_data.primary_website = _url_host;
               } else {
                  _f_data.primary_website = _url_protocol + _url_host;
               }
            }
         }

         if (_f_data.ID && _f_data.ID != '') {
            _f_data.contactID = _f_data.ID;
         } else {
            delete _f_data.ID;
         }
         //get GPS 
         _f_data.gps = $('#contact_form input[name=gps]').val() != '' ? $('#contact_form input[name=gps]').val() : '{"lat":0,"lng":0}';

         // get contact phone
         if (_contactPhone) {
            _f_data.second_phone = _contactPhone.getSecondaryPhone()
         }

         //
         _f_data.company_name = $('#contact_form [name=company_name]').val();
         _f_data.submit_by = localStorage.getItemValue('userID');

         if (window.location.href.indexOf('contact-form') > 0 && undefined != contactDocument) {
            // get contact document
            if (_f_data.contact_type && _f_data.contact_type != '')
               _f_data.contact_doc = contactDocument.getDocuments();

         } else {
            _f_data.contact_doc = [];
            _f_data.notes = [];
         }

         if (_notecontact) {
            _f_data.notes = _notecontact.getNotes();
         }

          //get SMS api username and key
          _f_data.sms_api_username = $('#api_msg_cre_uname').val();
          _f_data.sms_api_key = $('#api_msg_cre_key').val();

         let _link = ''
         if (window.location.href.indexOf('contact') > 0 && _f_data.ID) {
            _link = link._contactEdit;
            if (contact_old) {
               var trunk_field = ['doc', 'aff_type','E_type', 'V_type', 'notes']
               for (var key in contact_old) {
                  if (_f_data[key] == undefined && trunk_field.includes(key)) {
                     _f_data[key] = contact_old[key];
                  }
               }
            }
            /**
             * add update contact note
             */
            _f_data.notes.push({
               create_date: getDateTime(new Date()),
               note: 'Update contact',
               description: 'Auto',
               type: 'Contact',
               contactID: $('#contact_form input[name=ID]').val(),
               enter_by: localStorage.getItemValue('userID'),
            });
         } else {
            _link = link._contactAddNew;
            /**
             * add create new contact note
             */
            _f_data.notes.push({
               create_date: getDateTime(new Date()),
               note: 'Add new contact',
               type: 'Contact',
               enter_by: localStorage.getItemValue('userID'),
            })
         }

         // delete unused data
         delete _f_data.affiliate_type;
         delete _f_data.user_name;
         delete _f_data.current_password;
         delete _f_data.new_password;
         delete _f_data.confirm_password;
         delete _f_data.password;
         delete _f_data.company_ID;

         callAjax({
            url: _link,
            type: "POST",
            data: _f_data,
            dataType: 'json',
            success: function (res) {
               if (res.SAVE == 'FAIL') {
                  messageForm('Error! An error occurred. ' + res.ERROR, false, '#contact_form #message_form')
                  return
               } else if (res.SAVE == 'SUCCESS') {
                  if (window.opener && getUrlParameter('fw')) {
                     window.opener.updateSuccess = true;
                     window.opener.messageForm('You have successfully edited the contact', true);
                     window.close();
                     return;
                  } else if (_link == link._contactAddNew) {
                     if (window.location.href.indexOf('contact') > 0) {
                        $('#contact_form [name=ID]:first').val(res.ID);
                        responseSuccessForward('You have successfully added the contact', true, '#contact_form #message_form', './#ajax/contact-form?id=' + res.ID);
                     } else {
                        if (window.location.href.indexOf('order-form') > 0) {
                           messageForm('You have successfully added the contact', true, '#order_form #message_form');
                           var options = $('[name=bill_to]').prop('options');
                           options[options.length] = new Option(_f_data.first_name + ' ' + _f_data.last_name + ' - ' + _f_data.primary_city + ' - ' + _f_data.primary_state, res.ID);
                           $('[name=bill_to]').val(res.ID).trigger('change');
                           $('.modal').modal('hide');
                        } else if (window.location.href.indexOf('warranty') > 0) {
                           messageForm('You have successfully added the contact', true, '#warranty_form #message_form');
                           var selectOb = '[name=bill_to]';
                           if (window.c_type_select) {
                              selectOb = '[name="' + window.c_type_select + '"]';
                           }
                           var usedID = res.ID;
                           // if (window.location.href.includes('/warranty-form.php') && getUrlParameter('id')) {
                           //    usedID = res.affilateID;
                           // }
                           // new option text (sometimes, the following fields is null or undefined)
                           var selectText = '';
                           if (_f_data.first_name) selectText += _f_data.first_name + ' ';
                           if (_f_data.last_name) selectText += _f_data.last_name + ' ';
                           if (_f_data.primary_city) selectText += '- ' + _f_data.primary_city + ' ';
                           if (_f_data.primary_state) selectText += '- ' + _f_data.primary_state;
                           if (selectText == '' && _f_data.primary_email) selectText = _f_data.primary_email;
                           if (selectText == '' && _f_data.primary_phone) selectText = _f_data.primary_phone;
                           if (selectText == '') selectText = 'The lastest your created contact';

                           $(selectOb).prepend("<option value='" + usedID + "' selected>" + selectText + "</option>");
                           $(selectOb).trigger('change');
                           $('#contact_form').trigger('reset');
                           $('#contact_form .error').empty();
                           $('#contact_form .postal_code, #contact_form .state, #contact_form .city').val(null).trigger('change');
                           $('.modal').modal('hide');
                        } else {
                           return;
                        }
                     }
                  } else {
                     messageForm('You have successfully edited the contact', true, '#contact_form #message_form');
                  }
               }
            }
         });
      },
      invalidHandler: function (event, validator) {
         // 'this' refers to the form
         var errors = validator.numberOfInvalids();
         if (errors) {
            return;
         } else {
            $("div.error").hide();
         }
      }
   },

   selectAffiliate: function (status, data) {
        if (status == false || status == undefined)
            return '';
        else {
            var dataSet = ['Real Estate Agent', 'Mortgage', 'Title', 'Other'];
            var _html = [];
            _html.push('<div class="col col-3">');
            _html.push('<div>Affiliate Type:</div>');
            dataSet.forEach(function (item) {
                _html.push('<div class="underline"><label class="checkbox checkbox-right" style="width:100%"><input type="checkbox" name="affiliate_type" value="' + item + '"' + (data && data.split(',').includes(item) ? ' checked' : '') + '> ' + item + ' <i></i></label></div>');;
            });
            _html.push('</div>');
            return _html.join('');
        }
    },

    selectEmployee: function (status, data) {
        if (status == false || status == undefined)
            return '';
        else {
            var dataSet = window.contact_employee_type;;
            var _html = [];
            _html.push('<div class="col col-3">');
            _html.push('<div>Employee Type:</div>');
            dataSet.forEach(function (item) {
                _html.push('<div class="underline"><label class="checkbox checkbox-right" style="width:100%"><input type="checkbox" name="employee_type" value="' + item + '"' + (data && data.split(',').includes(item) ? ' checked' : '') + '> ' + item + ' <i></i></label></div>');;
            });
            _html.push('</div>');
            return _html.join('');
        }
    },
   /**
    * 
    * @param {Function} callback 
    * @purpose : Load state for sale option in Contact type Sales checked
    */
   loadState: function (callback) {
      $.ajax({
         url: link._getStateList,
         type: 'post',
         dataType: 'json',
         data: { token: localStorage.getItemValue('token') },
         success: function (res) {
            var result = '<select class="form-control salemanState" style="width:100%" multiple><option value="ALL">For All</option><option value="Corporate">Corporate</option>';
            res.forEach(function (item) {
               result += '<option value="' + item.code + '">' + item.state + '</option>';;
            });
            result += '</select>';
            window.sale_option = result;
            if (callback) callback(result)
         },
         error: function (e) {
         }
      })
   },

   loadSaleperson: function(callback){
      $.ajax({
         url: link._salesmanList,
         type: 'post',
         dataType: 'json',
         data: { token: localStorage.getItemValue('token') },
         success: function (res) {
            let text = '';
            res.forEach(function (item) {
               let name = [item.first_name, item.middle_name, item.last_name]
               text += '<option value="' + item.UID + '">' + name.join(' ') + '</option>';;
            });
            $('#contact_form [name="contact_salesman_id"]').html(text);
            $('#contact_form [name="contact_salesman_id"]').select2().val(null).trigger('change');
            if (callback) callback(result)
         },
         error: function (e) {
         }
      })
   },

   selectSale: function (status, value, callback) {
      if (status == false || status == undefined) {
         $('.salemanState').select2('destroy');
         $('#contact_form #sales_type_pane').empty();
         if (callback) callback('');
         return '';
      } else {
         var result = '<div class="col col-3">';
         result += '<div>Sales State</div>';
         if (!window.sale_option) {
            this.loadState(function (st) {
               result += st;
               result += '</div>';
               $('#contact_form #sales_type_pane').html(result);
               $('#contact_form .salemanState').select2();
               $('#contact_form .salemanState').val(value).trigger('change');
               if (callback) callback(result);
               return result;
            });
         } else {
            result += window.sale_option;
            result += '</div>';
            $('#contact_form #sales_type_pane').html(result);
            $('#contact_form .salemanState').select2();
            $('#contact_form .salemanState').val(value).trigger('change');
            if (callback) callback(result);
            return result;
         }
      }

   },

   setEventVendorExp: function () {
      $('#contact_form .license-data .datepicker').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>',
         onSelect: function (date) {
            let currentDate = new Date();
            let selectedDate = new Date(date);
            if (currentDate.getTime() <= selectedDate.getTime()) {
               $(this).next('label').replaceWith(text_vendor_exp_good);
            } else {
               $(this).next('label').replaceWith(text_vendor_exp_bad);
            }
         }

      }).on('change', function () {
         if (this.value == '') $(this).next('label').replaceWith(text_vendor_exp_empty);
      });;
   },

   selectVendor: function (status, data = '', data_license) {
      if (!data_license) data_license = {};
      if (!status) {
         return '';
      } else {
         var dataSet = window.contact_vendor_type;
         var _html = [];
         var checkList = data ? data.split(',') : []
         _html.push('<div class="col col-3">');
         _html.push('<div>Vendor Type:</div>');
         dataSet.forEach(function (item) {
            _html.push(
               '<div class="underline">' +
               '<label class="checkbox checkbox-right" style="width:100%">' +
               '<input type="checkbox" name="vendor_type" value="' + item + '" class=""' + (checkList.includes(item) ? ' checked' : '') + '> ' + item +
               ' <i></i></label></div>');
         });
         /**
          * Vendor exp
          */
         let currentDate = new Date();
         currentDate.setUTCHours(0, 0, 0, 0);
         currentDate = currentDate.getTime();

         let date_license = data_license.license_exp ? new Date(data_license.license_exp) : new Date();
         date_license.setUTCHours(0, 0, 0, 0);
         date_license = date_license.getTime();

         let date_w9 = data_license.w9_exp ? new Date(data_license.w9_exp) : new Date();
         date_w9.setUTCHours(0, 0, 0, 0);
         date_w9 = date_w9.getTime();

         let date_insurance = data_license.insurrance_exp ? new Date(data_license.insurrance_exp) : new Date();
         date_insurance.setUTCHours(0, 0, 0, 0);
         date_insurance = date_insurance.getTime();

         let exp_license = date_license - currentDate,
            exp_wp = date_w9 - currentDate,
            exp_insurance = date_insurance - currentDate,
            license_text = text_vendor_exp_empty,
            w9_text = text_vendor_exp_empty,
            insurance_text = text_vendor_exp_empty;

         if (data_license && data_license.license_exp) {
            if (exp_license >= 0) {
               license_text = text_vendor_exp_good;
            } else {
               license_text = text_vendor_exp_bad;
            }
         }
         if (data_license && data_license.w9_exp) {
            if (exp_wp >= 0) {
               w9_text = text_vendor_exp_good;
            } else {
               w9_text = text_vendor_exp_bad;
            }
         }

         if (data_license && data_license.insurrance_exp) {
            if (exp_insurance >= 0) {
               insurance_text = text_vendor_exp_good;
            } else {
               insurance_text = text_vendor_exp_bad;
            }
         }

         _html.push('</div>');
         _html.push('<div class="col col-3 license-data">');
         _html.push('<label class="input">&nbsp;</label>');
         _html.push('<div data-for="licence_exp" style="margin-bottom:10px;"><label style="width:70px;">License: </label><input type="date" name="license_exp" class="datepicker input-underline" style="width:90px;" value="' + (data_license.license_exp || '') + '">' + license_text + '</div>');
         _html.push('<div data-for="w9_exp" style="margin-bottom:10px;"><label style="width:70px;">W9: </label><input type="date" name="w9_exp" class="datepicker input-underline" style="width:90px;" value="' + (data_license.w9_exp || '') + '">' + w9_text + '</div>');
         _html.push('<div data-for="insurrance_exp" style="margin-bottom:10px;"><label style="width:70px">Insurance: </label><input type="date" name="insurrance_exp" class="datepicker input-underline" style="width:90px;" value="' + (data_license.insurrance_exp || '') + '">' + insurance_text + '</div>');
         _html.push('</div>');
         return _html.join('');
      }
   },

   getVendor: function () {
      var result = [];
      $('#contact_form input[name="vendor_type"]:checked').each(function (index, elem) {
         result.push(elem.value);;
      })
      return result.join(',');
   },

   getGPS: function (byAddress) {
      return new Promise(function (resolve, reject) {
         try {
            if (byAddress) {
               var geocoder = new google.maps.Geocoder();
               var address = [$('#contact_form input[name=primary_street_address1]').val(),
               $('#contact_form select[name=primary_city]').val(),
               $('#contact_form select[name=primary_state] option:selected').text()
               ].join(', ').toLowerCase();

               geocoder.geocode({ 'address': address }, function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                     return resolve(JSON.stringify(results[0].geometry.location));
                  } else {
                     return resolve($('#contact_form input[name=gps]').val() != '' ? $('#contact_form input[name=gps]').val() : '{"lat" : 0, "lng" : 0}');
                  }
               });
            } else {
               return resolve($('#contact_form input[name=gps]').val() != '' ? $('#contact_form input[name=gps]').val() : '{"lat" : 0, "lng" : 0}');
            }
         } catch (e) {
            reject(false);
         };
      })
   },
   setGPS: function (location) {
      if (location && map && marker) {
         if (typeof location == 'string') { location = JSON.parse(location) }
         map.setCenter(location);
         marker.setMap(null);
         marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
         });
         this.setEventGSP();
      }
   },
   setEventGSP: function () {
      if (map && marker && infowindow) {
         map.addListener('center_changed', function () {
            window.setTimeout(function () {
               $('input[name=gps]').val(JSON.stringify(marker.getPosition()));
               map.panTo(marker.getPosition());
            }, 1000);
         });
         google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
         });
      }
   },
}
var _Contact = new Contact();
_Contact.init(function () {
   if (getUrlParameter('id') && window.location.href.indexOf('contact') >= 0) {
      Contact.prototype.initUpdate(getUrlParameter('id'));
   } else if (getUrlParameter('sid') && window.location.href.indexOf('contact') >= 0) {
      $.ajax({
         url: link._salesmanDetailByID,
         type: 'post',
         data: { token: localStorage.getItemValue('token'), ID: getUrlParameter('sid') },
         dataType: 'json',
         success: function (res) {
            if (res.length > 0 && res[0].UID)
               Contact.prototype.initUpdate(res[0].UID);;
         }
      })
   } else if (getUrlParameter('aid') && window.location.href.indexOf('contact') >= 0) {
      $.ajax({
         url: link._contactID_AID,
         type: 'post',
         data: { token: localStorage.getItemValue('token'), AID: getUrlParameter('aid') },
         dataType: 'json',
         success: function (res) {
            if (res.contactID)
               Contact.prototype.initUpdate(res.contactID);;
         }
      })
   } else if (getUrlParameter('uid') && window.location.href.indexOf('contact') >= 0) {
      Contact.prototype.initUpdate(getUrlParameter('uid'));
   } else {
      contact_state = new State({ element: "#contact_form" });
   }
});