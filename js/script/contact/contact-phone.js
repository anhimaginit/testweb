function ContactPhone(table) {
   if (!table) table = '#contact_form #table_phone ';
   this.table_id = table + ' ';
   this.form = this.table_id.split(' ').shift();
   this.country = 'us';
}

ContactPhone.prototype.constructor = ContactPhone;
ContactPhone.prototype = {
   init: function () {
      callPhone = this.callPhone;
      window.phoneList = [];
      this.bindEvent();
   },

   setView: function (status) {
      if (status || ($(this.table_id + '.primary_phone').val() && $(this.table_id + '.primary_phone').val().length > 0)) {
         $(this.table_id + '.primary_phone').attr('readonly', true);
         $(this.table_id + '.primary_phone').addClass('input-readonly');
         $(this.table_id + ' .btnEditPrimaryPhone').show();
      } else {
         $(this.table_id + '.primary_phone').attr('readonly', false);
         $(this.table_id + '.primary_phone').removeClass('input-readonly');
         $(this.table_id + ' .btnEditPrimaryPhone').hide();
      }
   },
   /**
    * 
    * @param {Number} contactID : the contact is editting
    * @param {Phone} phone : Current Phone Number if change, old phone if delete
    * @param {String} method : Change/ Remove
    * data for new note
    */
   changePhoneTemplate: function (contactID, phone, method) {
      var description = method == 'Change' ?
         'Phone number change to ' + phone + ' by ' + localStorage.getItemValue('user_name') :
         'Remove phone number ' + phone + ' by ' + localStorage.getItemValue('user_name')
      var _data = {
         create_date: getDateTime(),
         note: method + ' Phone Number',
         description: description,
         type: 'Contact',
         contactID: contactID,
         enter_by: localStorage.getItemValue('userID'),
         internal_flag: 1,
      }
      return _data;
   },
   setCountry: function (country) {
      this.country = 'us';
   },
   bindEvent: function () {
      var _self = this;
      $(document).unbind('change', 'input[type=tel]');
      $(document).on('change', 'input[type=tel]', function () {
         if (this.value.length > 0) {
            $(this).closest('tr').find('.btnCallPhone').show();
         } else {
            $(this).closest('tr').find('.btnCallPhone').hide();
         }
      });

      $(_self.table_id + '.btnDelPrimaryEmail').unbind('click').click(function () {
         _self.deleteEmailPhone('email');
      })


      $(_self.table_id + '.btnDelPrimaryPhone').unbind('click').click(function () {
         _self.deleteEmailPhone('phone')
      });

      $(_self.table_id + '.btnAddSecondPhone').unbind('click').click(function () {
         _self.createPhoneRow();

      });

      $(_self.table_id + '.btnEditPhone').unbind('click').click(function () {
         $('.phone_status').empty();
         $(_self.table_id + '.primary_phone').attr('readonly', false);
         $(_self.table_id + '.primary_phone').removeClass('input-readonly');
         let value = $(_self.table_id + '.primary_phone').val();
         $(_self.table_id + '.primary_phone').val(value).focus();
      });

      $(document).unbind('click', '.removePhoneNumber').on('click', '.removePhoneNumber', function () {
         _self.removePhoneNumber(this);
      });

      $(document).
         unbind('focusout', _self.table_id + '.input-phone-tel input[type="tel"]').
         unbind('click', _self.table_id + '.btnEditPhone')
         .on('focusout', _self.table_id + '.input-phone-tel input[type="tel"]', function () {
            let $tr = $(this).parent(),
               $text = this.value,
               $index = $tr.closest('tr').index();
            $tr.html('<a href="tel:+1' + numeral($text).value() + '">' + $text + '</a>');
            if ($index == 0) {
               $('.primary_phone').val($text);
            }

         }).on('click', _self.table_id + '.btnEditPhone', function () {
            let $tr = $(this).closest('tr').children('.input-phone-tel');
            if ($tr.find('input').length > 0) return;
            else {
               atext = $tr.find('a').text();
               $tr.html('<input type="tel" class="form-control">');
               let _input = $tr.find('input:first');
               _input.inputmask("(999) 999-9999");
               _input.val(atext).focus();
            }
         });
   },

   setPrimaryPhone: function (primary_phone) {
      if (primary_phone) {
         let phone = primary_phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
         $('.primary_phone').val(phone);
         $(this.table_id + 'tbody tr:first .input-phone-tel').html('<a href="tel:+1' + numeral(phone).value() + '">' + phone + '</a>');
      }
   },

   loadListPhone: function (listPhone) {
      var _self = this;
      listPhone.forEach(function (item) {
         _self.createPhoneRow(item);
      });
      _self.setView();
      // this.createPhoneRow();
   },
   execCallPhone: function (contactID, phoneNumber, table = '#contact_form #table_note_info') {
      if (phoneNumber != '') {
         $('#phoneCallToNumber').prop('href', 'tel:+1' + numeral(phoneNumber).value());
         $('#phoneCallToNumber').click();
         // window.location.href = "tel:+1" + numeral(phoneNumber).value();
         let _data = {
            create_date: getDateTime(),
            note: 'Call to ' + phoneNumber,
            description: localStorage.getItemValue('user_name') + ' call phone',
            type: 'Contact',
            contactID: contactID && contactID != '' ? contactID : null,
            enter_by: localStorage.getItemValue('userID'),
            internal_flag: 1,
         };
         contactID == ''
         delete _data.contactID;

         NoteTable.prototype.insertNewNoteToDB(_data, function (res) {
            _data.noteID = res.id;
            _data.enter_by_name = localStorage.getItemValue('user_name');
            $(table).DataTable().rows.add([_data]).draw();
            $(table).DataTable().page('last').draw('page')

         })
      }
   },
   callPhone: function (elem) {
      let form = this.table_id.split(' ').shift();
      var contactID = $(form + ' input[name=ID]').val();
      var phoneNumber = $(elem).closest('tr').find('input[type=tel]').val();
      this.execCallPhone(contactID, phoneNumber, form + ' #table_note_info');
   },

   createPhoneRow: function (phoneObj = { phone: '', phone_type: 'Second' }) {
      let phone = (phoneObj.phone ? phoneObj.phone : phoneObj.second_phone ? phoneObj.second_phone : '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      let _html =
         '<tr>' +
         '<td class="hasinput input-phone-tel"><a href="tel:+1' + numeral(phone).value() + '">' + (phone) + '</a></td>' +
         '<td class="hasinput">' +
         '<select class="form-control phone-type">' +
         '<option value="Second">Secondary Phone</option>' +
         '<option value="Home">Home</option>' +
         '<option value="Mobile">Mobile</option>' +
         '<option value="Work">Work</option>';
      // '<option value="Main">Main</option>';
      if (window.location.href.indexOf('setting') > 0) {
         _html += '<option value="Delivery">Delivery</option>';
         _html += '<option value="Hotline">Hotline</option>';
      }
      _html += '<option value="Other">Other</option>' +
         '</select>' +
         '</td>';

      _html += '<td class="hasinput">';
      _html += '<button type="button" class="btn btn-sm btn-default btnEditPhone fa fa-edit"></button>';
      _html += '<button type="button" class="btn btn-sm btn-danger removePhoneNumber fa fa-times"></button>';
      _html += '</td>';
      _html += '</tr>';
      $(this.table_id + ' tbody').append(_html);
      $(this.table_id + ' tbody tr:last-child td:eq(1) select').val(phoneObj.phone_type ? phoneObj.phone_type : 'Second');
      var _input = $(this.table_id + 'tbody tr:last-child td:first-child input');
      _input.trigger('change');
   },

   removePhoneNumber: function (elem) {

      $(elem).closest('tr').remove();
   },
   getPhones: function (table) {
      if (!table) table = '#table_phone';
      let result = [];
      $(table + ' tbody').find('tr').each(function () {
         let $tds = $(this).find('td'),
            phone = $tds.eq(0).find('a').text(),
            phone_type = $tds.find('select.phone-type').val() || 'Primary';
         if (phone != '' && phone != null && phone != undefined) {
            let item = { 'phone': phone, 'phone_type': phone_type };
            result.push(item);
         }
      });
      return result;
   },
   getSecondaryPhone: function (table) {
      let result = [];
      $(this.table_id + ' tbody').find('tr:nth-child(n+2)').each(function () {
         let phone = $(this).find('a').text();
         if (phone != '' && phone != null && phone != undefined) {
            result.push(phone);
         }
      });
      return result.join(',');
   },
   deleteEmailPhone: function (ob) {
      let _self = this;
      let _pushData = $.extend({
         contactID: $(this.form + ' [name=ID]').val()
      }, template_data);
      _pushData['primary_' + ob] = 1;
      _pushData['' + ob] = 1;

      $.ajax({
         url: link._contactDeleteMailPhone_ID,
         type: 'post',
         dataType: 'json',
         data: _pushData,
         success: function (resDel) {
            if (resDel.ERROR == '') {
               var _description = 'Delete';
               var _noteDel = 'Delete';
               let last_name = $('#contact_form [name=last_name]').val();
               let cus_name = $('#contact_form [name=first_name]').val();
               let company_name = $('#company_name [name=name]').val()
               let callback = null;
               let contactID = $('#contact_form [name=ID]').val();
               if (contactID == '') return;

               switch (ob) {
                  case 'email':
                     let email = $('#contact_form [name=primary_email]').val();
                     if (!email || email == '') { return; }
                     _description = 'Delete email ' + email;
                     if (_self.form == '#contact_form') {
                        _noteDel = localStorage.getItemValue('user_name') + ' delete email of ' + cus_name + ' ' + last_name;
                        callback = function () {
                           $('#contact_form [name=primary_email]').val('');
                        }
                     } else if (_self.form == '#company_form') {
                        _noteDel = localStorage.getItemValue('user_name') + ' delete email of ' + company_name;
                        callback = function () {
                           $('#company_form [name=email]').val('');
                        }
                     }
                     break;
                  case 'phone':
                     let phoneNumber = $(this.table_id + 'tr:first td:first a').text();
                     if (!phoneNumber || phoneNumber == '') return;
                     _description = 'Delete phone number ' + phoneNumber;
                     _noteDel = localStorage.getItemValue('user_name') + ' delete phone number of ' + cus_name + ' ' + last_name;
                     callback = function () {
                        $('.primary_phone').val('');
                        $(this.table_id + 'tr:first td:first a').text('');
                        $(this.table_id + 'tr:first td:first a').removeAttr('href');
                     }
                     break;
               }
               let _data = {
                  create_date: getDateTime(),
                  description: _description,
                  note: _noteDel,
                  type: 'Contact',
                  contactID: contactID,
                  enter_by: localStorage.getItemValue('userID'),
                  internal_flag: 1,
               };
               NoteTable.prototype.insertNewNoteToDB(_data, function (resNote) {
                  _data.enter_by_name = localStorage.getItemValue('user_name');
                  _data.noteID = resNote.id;
                  $(_self.table_id).DataTable().rows.add([_data]).draw();
                  $(_self.table_id).DataTable().page('last').draw('page');
                  callback();
               });
            } else {
               messageForm(resDel.ERROR, false);
            }
         }
      })



   }
}
