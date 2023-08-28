function SettingPage() { }

SettingPage.prototype = {
  constructor: SettingPage,
  init: function () {
    state = new State({ element: '#setting_form' });

    _contactPhone = new ContactPhone('#setting_form #table_phone');
    _contactPhone.init();

    this.bindEvent();
  },
  bindEvent: function () {
    var _self = this;
    $('#gps').show();
    $("#setting_form").validate(_self.settingOptions);
    $('[name=logo_ico], [name=logo]').bind('change', function () {
      _self.preview(this);
    });

    $('[name=company_address]').change(function () {
      var value = this.value + ' ' + $('[name=company_city]').val() + ' ' + $('[name=company_state] option:selected').text() + ' ' + $('[name=company_postal_code]').val();
      _self.getGPSByAddress(value).then(function (location) {
        return _self.setGPS(location);;
      }).catch(function (e) { })
    });

    $('.tagsinput').tagsInput({
      interactive: true,
      placeholder: 'Add a tag',
      width: 'auto',
      height: 'auto',
      hide: true,
      removeWithBackspace: true,
      delimiter: [',', ';'],
    });

    $('input, select, textarea').focusin(function () {
      $('#message_form').hide();
    });


    //$("#contact_employee_type_tagsinput span.tag span.tag-text").append('<span data-toggle="tooltip-em" title="Add/Update Email" class="glyphicon glyphicon-plus-sign" style="margin-left:4px;"></span>');
    //$('[data-toggle="tooltip-em"]').tooltip();
    $("#contact_employee_type_tagsinput span.tag").mouseenter(function() {
        //alert("this is the point");
        $("#contact_employee_type_tagsinput span.tag span.tag-text").val();
        let val = $("#contact_employee_type_tagsinput span.tag span.tag-text").val();
        //alert(val);
    }).mouseleave(function() {
        // alert("this is not nooo");
       // $("#employee_dep_email").css("display", "none");
    });

  },
  settingOptions: {
    rules: {
      page_title: {},
      logo_ico: {},
      logo: {},
      company_name: {},
      company_email: {},
      company_address: {},
      gps: {}
    },
    submitHandler: function () {
      var formData = new FormData();
      var color_site = $('[name=color_site]').val();
      var hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {

          var offset = 15;
          r = parseInt(result[1], 16) + offset < 255 ? parseInt(result[1], 16) + offset : 255,
            g = parseInt(result[2], 16) + offset < 255 ? parseInt(result[2], 16) + offset : 255,
            b = parseInt(result[3], 16) + offset < 255 ? parseInt(result[3], 16) + offset : 255;
          return 'rgb(' + r + ',' + g + ',' + b + ')';
        } else {
          return '#ccc';
        }
      }
      // var hexToRgb = function (hex) {
      //   var bigint = parseInt(hex, 16);
      //   var r = (bigint >> 16) & 255;
      //   var g = (bigint >> 8) & 255;
      //   var b = bigint & 255;

      //   r = r + 5 > 0 ? r + 5 : 0;
      //   g = g + 5 > 0 ? g + 5 : 0;
      //   b = b + 5 > 0 ? b + 5 : 0;

      //   return 'rgb(' + r + "," + g + "," + b + ')';
      // }
      var _data = {
        jwt: localStorage.getItemValue('jwt'),
        level: localStorage.getItemValue('level'),

        page_title: $('[name=page_title]').val(),
        company_name: $('[name=company_name]').val(),
        footer_info: $('[name=footer_info]').val(),

        color_site: color_site,
        color_site_hover: hexToRgb(color_site),
        background: $('[name=background]').val(),
        top_menu_color: $('[name=top_menu_color]').val(),
        navigation: $('[name=navigation]').val(),

        company_email: $('[name=company_email]').val(),
        company_fax: $('[name=company_fax]').val(),
        company_address: $('[name=company_address]').val(),
        company_address2: $('[name=company_address2]').val(),
        company_city: $('[name=company_city]').val(),
        company_state: $('[name=company_state]').val(),
        company_postal_code: $('[name=company_postal_code]').val(),

        claim_start_fee: numeral($('[name=claim_start_fee]').val()).value(),
        claim_status : JSON.stringify($('[name=claim_status]').val().split(',')),
        contact_employee_type: JSON.stringify($('[name=contact_employee_type]').val().split(',')),
        contact_vendor_type : JSON.stringify($('[name=contact_vendor_type]').val().split(',')),
        gps: $('[name=gps]').val(),
        phone: JSON.stringify(_contactPhone.getPhones()),
      };
      if ($('[name=logo_ico]').prop('files') && $('[name=logo_ico]').prop('files').length > 0) {
        _data.logo_ico = $('[name=logo_ico]').prop('files')[0];
      }
      if ($('[name=logo]').prop('files') && $('[name=logo]').prop('files').length > 0) {
        _data.logo = $('[name=logo]').prop('files')[0];
      }

      for (var key in _data) {
        if (_data[key] && _data[key] != '') {
          formData.append(key, _data[key]);
        }
      }

      $.ajax({
        url: host2 + 'php/save-setting.php',
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        success: function (res) {
          if (res.success) {
            messageForm('The information is saved', true);
          } else {
            messageForm('An error occured. Please try again later', false);
          }
        },
      })
    }
  },
  preview: function (input) {
    if (input.files && input.files[0]) {
      var elem_name = $(input).attr('name');
      var target = elem_name + '_preview';
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#' + target).attr('src', e.target.result);
        readURLValue = e.target.result
      };
      reader.readAsDataURL(input.files[0]);
    }
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
  getGPSByAddress: function (address) {
    return new Promise(function (resolve, reject) {
      try {
        if (address) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              return resolve(JSON.stringify(results[0].geometry.location));
            } else {
              return resolve($('input[name=gps]').val() != '' ? $('input[name=gps]').val() : '{"lat" : 29.895883, "lng" : -80.650635}');
            }
          });
        } else {
          return resolve($('input[name=gps]').val() != '' ? $('input[name=gps]').val() : '{"lat" : 29.895883, "lng" : -80.650635}');
        }
      } catch (e) {
        reject(false);
      };
    })
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
  }

}

var setting_page = new SettingPage();
setting_page.init();