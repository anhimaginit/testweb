function CompanyForm() { }

var text_vendor_exp_good = '<label class="text-success"><i class="fa fa-check-circle-o"></i> Good</label>';
var text_vendor_exp_bad = '<label class="text-danger"><i class="fa fa-warning"></i> Expired</label>';
var text_vendor_exp_empty = '<label></label>';

CompanyForm.prototype.constructor = CompanyForm;
CompanyForm.prototype = {
   init: function () {
      _State = new State({ element: "#company_form" });
      old_vendor = '';
      url_company_open = this.url_company_open;

      companyNote = new NoteTable({
         form: 'Company',
         table: '#company_form #table_note_info'
      });
      companyNote.init();

      _companyPhone = new ContactPhone('#company_form #table_phone');
      _companyPhone.init();

      this.bindEvent();
      this.setView();
      this.selectVendorCheckbox($('#company_form input:checkbox[value="Vendor"]').prop('checked'));
      this.loadSaleperson();
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
            $('#company_form [name="company_salesman_id"]').html(text);
            $('#company_form [name="company_salesman_id"]').select2({
            }).val(window.company_edit_company_salesman_id).trigger('change');
            if (callback) callback(result)
         },
         error: function (e) {
         }
      })
   },

   setView: function () {
      $('#company_form #vendor_type').select2({ placeholder: 'Select Vendor Type' });
      let _gps = $('#company_form [name=gps]').val();
      if (_gps && _gps != '' && _gps != {}) {
         setTimeout(function () {
            CompanyForm.prototype.setGPS(_gps);
         }, 1000);
      }
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

         $('#company_form [name=tag]').tagsInput({
            delimiter: [',', ';'],
            unique: true,
            autocomplete: {
               source: function (req, res) {
                  res(filterTags(req.term));
               }
            },
         });

         let tag_id = $('#company_form [name=tag]').attr('id');
         $('#company_form #' + tag_id + '_tag').change(function () {
            var val = $(this).val();
            if ($('#company_form [name=tag]').val().split(',').includes(val)) {
               $(this).val('');
            } else {
               $('#company_form [name=tag]').addTag(val);
            }
         });
         $('#company_form #' + tag_id + '_tag').keyup(function (e) {
            var key = e.keyCode;
            let listChar = ['Enter', 'Tab', ';', 'ArrowRight', 'ArrowLeft', '*', '/']
            /** 9 = tab, 13= enter, 37= ←, 38= ↑, 39= →, 40= ↓, 190= ., 106= *, 111= /, */
            // var listList = [9, 13, 37, 39, 190, 106, 111]
            if (listChar.includes(e.key)) {
               var val = $(this).val();
               if ($('#company_form [name=tag]').val().split(',').includes(val)) {
                  $(this).val('');
               } else {
                  $('#company_form [name=tag]').addTag(val);
                  $(this).val('');
                  $(this).focus();
               }
            }
         });
      })

      $('#company_form #btnBackCompany').click(function () {
         if (document.location.href.indexOf('company-form') >= 0) {
            window.history.back();
         } else {
            $('.modal').modal('hide');
            $('#company_form').trigger('reset');
         }
      });

      this.setEventVendorExp();

      $('#company_form input[name=address1], #company_form input[name=address2], #company_form input[name=state]').change(function () {
         _self.getGPSAddress(this.value).then(function (location) {
            _self.setGPS(location.location);
            _self.setMakerText(location.text);
         }).catch(function (e) {
         })
      });

   },
   companyOptionValidator: {
      rules: {
         name: { required: true },
         address1: { required: true },
         phone: {
            required: function () {
               return $('#company_form [name=email]').val().trim().length <= 0;
            }
         },
         fax: { digits: true },
         email: {
            email: true, required: function () {
               var _phones = $('#company_form [name="phone"]').val();
               return _phones.length <= 0;
            }
         },
      },
      messages: {
         phone: { required: 'Please enter email or phone number' },
         email: { required: '' }
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
      _formData.phone = $('#company_form [name=phone]').val();
      // _formData.second_phone = _companyPhone.getSecondaryPhone();

      //get company Notes
      if (document.location.href.includes('company-form') && companyNote != undefined) _formData.comp_note = JSON.stringify(companyNote.getNotes());
      else _formData.comp_note = '[]';

      _formData.type = '[' + ($('#company_form input:checkbox[name="type"]:checked').map(function (_, el) { return '"' + $(el).val() + '"'; }).get()).toString() + ']';
      //get vendor doc
      if (_formData.type.includes('Vendor')) {
         _formData.vendor = 1;
         _formData.vendor_type = JSON.stringify($('#vendor_type').val());
         // if (_formData.vendor_type) _formData.vendor_type = _formData.vendor_type.join(',');
         if (companyDocument != null && companyDocument != undefined)
            _formData.vendor_doc = companyDocument.getDocuments();
         else { _formData.vendor_doc = []; }
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

      //get gps
      // _formData.gps = $('#company_form input[name=gps]').val() != '' ? $('#company_form input[name=gps]').val() : '{"lat":0,"lng":0}';

      var _link = link._compAddNew;
      if (_formData.ID != '' && _formData.ID != undefined && document.location.href.indexOf('company-form') >= 0) {
         _link = link._companyUpdate;
      } else if (window.convert_data) {
         if (!window.confirm_convert) {
            $.SmartMessageBox({
               title: "<label class='txt-color-orangeDark bold'>Do you want to convert the contact to company?</label>",
               content: "After convert, the account will be inactive. " + (window.convert_data.convert_contact_id == localStorage.getItemValue('userID') ? 'You will be logout after convert.' : ''),
               buttons: '[No][Yes]'

            }, function (ButtonPressed) {
               if (ButtonPressed == 'Yes') {
                  window.confirm_convert = 'Yes';
                  $("#company_form").submit();
               } else {
                  delete window.confirm_convert
               }
            });
            return;
         } else {
            delete window.confirm_convert
            _link = link._compAddNew;
            _formData.contactID = window.convert_data.convert_contact_id;
         }
      } else {
         delete _formData.ID;
      }
      $.ajax({
         url: _link,
         type: 'post',
         data: _formData,
         dataType: 'json',
         success: function (_data) {
            if (_data.ERROR == '') {
               if (_link == link._compAddNew) {
                  if (window.convert_data && _formData.contactID) {
                     if (window.convert_data.convert_contact_id == localStorage.getItemValue('userID')) {
                        messageForm('You converted your contact to company. You will be logout', true, '#company_form #message_form');
                        setTimeout(function () {
                           delete window.confirm_convert;
                           logout();
                        }, 3000);
                        delete window.convert_data;

                     } else {
                        let _href = document.location.href.indexOf('?') >= 0 ? document.location.href + "&id=" + tmp.ID : document.location.href + "?id=" + _data.ID;
                        responseSuccessForward('You converted the contact to company', true, '#company_form #message_form', _href)
                     }
                  } else if (document.location.href.indexOf('company-form') > 0) {
                     let _href = document.location.href.indexOf('?') >= 0 ? document.location.href + "&id=" + tmp.ID : document.location.href + "?id=" + _data.ID;
                     responseSuccessForward('You have successfully added new company', true, '#company_form #message_form', _href)
                  } else {
                     $('#contact_form [name="company_name"]').append('<option value="' + _data.ID + '" selected>' + _formData.name + '</option>').trigger('change');
                     messageForm('You have successfully added new company', true, '#company_form #message_form');
                     setTimeout(function () {
                        $('#company_form').closest('.modal').modal('hide');
                        $('#company_form').trigger('reset');
                     }, 3000);
                     if ($(document).has('.modal#add_new_contact'))
                        $('#add_new_contact').modal('show');
                  }
                  return;
               } else if (_link == link._companyUpdate) {
                  messageForm('You have successfully edited the company', true);
                  return
               } else if (_link == '') {
               }
            } else {
               messageForm(_data.ERROR, false, '#company_form #message_form');
            }
         }
      })
   },

   selectVendorCheckbox: function (status) {
      var tags = $('#company_form #tag').val();
      if (status) {
         if (!tags || !tags.split(',').includes('Vendor')) {
            if (tags && tags != '') {
               $('#company_form #tag').val(tags + ',Vendor');
            } else {
               $('#company_form #tag').val('Vendor');
            }
         }
         $('#company_form #vendor_expand').show();
      } else {
         if (tags && tags.split(',').includes('Vendor')) {
            $('#company_form #tag').removeTag('Vendor');
         }
         $('#company_form #vendor_expand').hide();
      }
   },
   setEventVendorExp: function () {
      $('#company_form .license-data .datepicker').datepicker({
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
      });
   },
   getGPSAddress: function () {

      return new Promise(function (resolve, reject) {
         try {
            let add1 = $('#company_form [name=address1]').val(),
               add2 = $('#company_form [name=address2]').val(),
               state = $('#company_form [name=state]').val(),
               city = $('#company_form [name=city]').val(),
               zip = $('#company_form [name=postal_code]').val();

            let text = '';
            text += add1 && add1 != '' ? add1 : add2 && add2 ? add2 : '';
            if (text == '') {
               text += ' ';
               text += state && state != '' ? state + ' ' : '';
               text += city && city != '' ? city + ' ' : '';
               text += zip && zip != '' ? zip : '';
            }
            if (text && text != '') {
               var geocoder = new google.maps.Geocoder();
               geocoder.geocode({ 'address': text }, function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK && results[0]) {
                     return resolve({ location: results[0].geometry.location, text: results[0].formatted_address });
                  } else {
                     return resolve({ location: $('#company_form input[name=gps]').val() != '' ? $('#company_form input[name=gps]').val() : { "lat": 0, "lng": 0 }, text: text });
                  }
               });
            } else {
               return resolve({ location: $('#company_form input[name=gps]').val() != '' ? $('#company_form input[name=gps]').val() : { "lat": 0, "lng": 0 }, text: text });
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
   setMakerText: function (text) {
      infowindow = new google.maps.InfoWindow({
         content: "<p> MarkerLocation:" + text + "</p>"
      });
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

if (!document.location.href.includes('purchase')) {
   var _companyForm = new CompanyForm();
   _companyForm.init();
}

if (window.convert_data && window.location.href.includes('company-form')) {
   for (let a in window.convert_data) {
      let type = $('[name=' + a + ']').prop('type');
      if (type) {
         if (type.includes('select')) {
            $('[name=' + a + ']').append('<option value="' + window.convert_data[a] + '" selected>' + window.convert_data[a + '_text'] + '</option>').trigger('change');
         } else {
            $('[name=' + a + ']').val(window.convert_data[a]);
         }
      }
   }
   if (window.convert_data.www) {
      $('#company_form #company_url_protocol').val(window.convert_data.url_protocol);
      $('#company_form #company_url_host').val(window.convert_data.url_host);
   }
   if (window.convert_data.gps) {
      _companyForm.setGPS(window.convert_data.gps);
   }
   if (window.convert_data.phone) {
      _companyPhone.setPrimaryPhone(window.convert_data.phone)
   }
   if (window.convert_data.second_phone) {
      let list = [];
      window.convert_data.second_phone.split(',').forEach(item => {
         let tmp = {
            phone: item,
            phone_type: 'Second'
         }
         list.push(tmp);
         return true;
      })
      _companyPhone.loadListPhone(list)
   }else{
      _companyPhone.loadListPhone([])
   }
   $('#company_form').prepend('<div class="alert alert-warning"> You are converting the contact ' + window.convert_data.convert_contact_id + ' to company</div>');
}