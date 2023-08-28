function Contact() { }

Contact._contact = null;
var contact_old = null;
Contact.prototype.constructor = Contact;
Contact.prototype = {
  init: function (callback) {
    setCompany = this.setCompanyID;
    contact_state = new State({ element: "#contact_form" });
    this.setView();

    _contactPhone = new ContactPhone('#contact_form #table_phone');
    _contactPhone.init();

    if (callback) callback();
  },
  setView: function () {
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
          '<div class="">' + item.name + '<div class="pull-right">' + city_state.join(' - ') + '</div>' + '</div>' +
          (item.address1 && item.address1 != '' ? '<div style="font-size:7px;">' + item.address1 + '</div>' : '') +
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

    $('#contact_form #contact_tags').tagsInput({
      interactive: true,
      placeholder: 'Add a tag',
      width: 'auto',
      height: 'auto',
      delimiter: [';'],
      hide: true,
      removeWithBackspace: true,
      autocomplete_url: link._getTag,
      autocomplete: {
        source: function (req, res) {
          res(filterTags(req.term));
        }
      }
    });
  },
  bindEvent: function () {

    $(window).on('shown.bs.modal', function () {
      $(window).trigger('resize');
    });

    $('#contact_form #contact_tags_tag').change(function () {
      var val = $(this).val();
      if ($('#contact_form #contact_tags').val().split(';').includes(val)) {
        $(this).val('');
      } else {
        $('#contact_form #contact_tags').addTag(val);
      }
    });

    $('#contact_form #contact_tags_tag').keyup(function (e) {
      var key = e.keyCode;
      /** 9 = tab, 13= enter, 37= ←, 38= ↑, 39= →, 40= ↓, 190= ., 106= *, 111= /, */
      var listList = [9, 13, 37, 38, 39, 40, 190, 106, 111]
      if (listList.includes(key)) {
        var val = $(this).val();
        if ($('#contact_form #contact_tags').val().split(';').includes(val)) {
          $(this).val('');
        } else {
          $('#contact_form #contact_tags').addTag(val);
          $(this).val('');
          $(this).focus();
        }
      }
    });

    $('#contact_form input').bind('mousedown', function () {
      $('#message_form_contact').hide(200);
    });

    $("#contact_form").validate(Contact.prototype.formValidateOption);

  },
  formValidateOption: {
    rules: {
      first_name: { maxlength: 30 },
      middle_name: { maxlength: 30 },
      last_name: { maxlength: 30 },
      primary_street_address1: { maxlength: 254 },
      primary_street_address2: { maxlength: 254 },
      primary_phone: {
        // remote: {
        //   url: link._phoneExisting,
        //   type: 'post',
        //   delay: 300,
        //   data: {
        //     token: localStorage.getItemValue('token'),
        //     primary_phone: function () { return $('input[name="primary_phone"]').val() },
        //     contactID: function () { return $('input[name="ID"]').val() }
        //   },
        //   dataFilter: function (data) {
        //     let _res = JSON.parse(data);
        //     $checkPhoneDisplay('' + _res.existing, 'input[name="primary_phone"]');
        //     return _res.existing === false;
        //   }
        // }
      },
      primary_phone_ext: { maxlength: 10 },
      primary_phone_type: { maxlength: 10 },
      primary_email: {
        required: function () {
          let _phones = $('[name="primary_phone"]').val();
          return _phones.length <= 0;
        }, email: true, maxlength: 254,
        // remote: {
        //   url: link._isCheckEmailExisting,
        //   type: 'post',
        //   delay: 300,
        //   data: {
        //     token: localStorage.getItemValue('token'),
        //     primary_email: function () { return $('input[name="primary_email"]').val() },
        //     ID: function () { return $('input[name="ID"]').val() },
        //     jwt: localStorage.getItemValue('jwt'),
        //     private_key: localStorage.getItemValue('userID')
        //   },
        //   dataFilter: function (data) {
        //     let _res = JSON.parse(data);
        //     if (_res.existing == true) {
        //       $checkEmailDisplay('true', 'input[name="primary_email"]', _res.ID);
        //     } else {
        //       $checkEmailDisplay('false', 'input[name="primary_email"]');
        //     }
        //     return _res.existing === false;
        //   }
        // }
      },
      primary_website: { url: true, maxlength: 254 },
      company_name: { maxlength: 100 },
      contact_tags: { maxlength: 5000 },
    },
    messages: {
      primary_phone: {
        required: 'Please enter valid phone number',
        digits: 'Please enter valid phone number',
        number: 'Please enter valid phone number',
      }
    },
    submitHandler: function (e) {
      var _f_data = {}
      var _data = $("#contact_form").serializeArray()
      _data.forEach(function (elem) {
        if (elem.name != '' && elem.value != '') {
          _f_data[elem.name] = elem.value;
        }
      });

      if (window.c_type) {
        _f_data.contact_type = window.c_type;
        if (window.a_type && window.a_type != '') _f_data.aff_type = window.a_type;
      }

      if (!_f_data.contact_type) _f_data.contact_type = 'Policy Holder';

      _f_data.token = localStorage.getItemValue('token');

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
      //get GPS 
      _f_data.gps = '{"lat":0,"lng":0}';

      //get phone
      // get contact phone
      if (_contactPhone) {
        _f_data.second_phone = _contactPhone.getSecondaryPhone()
      }
      _f_data.company_name = $('#contact_form [name=company_name]').val();

      _f_data.contact_doc = [];
      _f_data.create_by = 275;
      _f_data.notes = [];
      // delete unused data
      delete _f_data.affiliate_type;
      callAjax({
        url: host + '_contactAddNewNotLogin.php',
        type: "POST",
        data: _f_data,
        dataType: 'json',
        success: function (res) {
          if (res.SAVE == 'FAIL') {
            messageForm('Error! An error occurred. ' + res.ERROR, false, '#message_form_contact');
            return
          } else if (res.SAVE == 'SUCCESS') {
            if (res.ID) {
              var selectOb = '[name=bill_to]';
              if (window.c_type_select) {
                selectOb = '[name="' + window.c_type_select + '"]';
              }
              var usedID = res.ID;
              // if (getUrlParameter('id')) {
              //   usedID = res.affilateID;
              // }
              $(selectOb).prepend("<option value='" + usedID + "' selected>" + _f_data.first_name + ' ' + _f_data.last_name + "</option>");
              $(selectOb).trigger('change');

              $('#contact_form').trigger('reset');
              $('#contact_form error').empty();
              $('#contact_form .postal_code, #contact_form .state, #contact_form .city').val(null).trigger('change');
              $('.modal').modal('hide');
            }
            messageForm('You have successfully added new contact', true, '#contact_form #message_form');
          }
          $('#add_new_contact').modal('hide');
        }
      });
    }
  },
}
var _Contact = new Contact();
_Contact.init(_Contact.bindEvent);