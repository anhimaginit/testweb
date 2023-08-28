function ContactConvert() { this.bindEvent() }
delete window.convert_data;
ContactConvert.prototype = {
   bindEvent: function () {
      $('.btnConvertToCompany').unbind('click', '.btnConvertToCompany').click(function () {
         ContactConvert.prototype.forwardToConvert();
      })
   },
   getInformation: function () {
      let company = {
         convert_contact_id: $('#contact_form [name=ID]').val(),
         name: $('#contact_form [name=first_name]').val() + ' ' + $('#contact_form [name=last_name]').val(),
         address1: $('#contact_form [name=primary_street_address1]').val(),
         address2: $('#contact_form [name=primary_street_address2]').val(),
         city: $('#contact_form [name=primary_city]').val(),
         city_text: $('#contact_form [name=primary_city] option:selected').text(),
         postal_code: $('#contact_form [name=primary_postal_code]').val(),
         postal_code_text: $('#contact_form [name=primary_postal_code] option:selected').text(),
         state: $('#contact_form [name=primary_state]').val(),
         state_text: $('#contact_form [name=primary_state] option:selected').text(),
         phone: $('#contact_form .input-phone-tel:first a').text(),
         second_phone : _contactPhone.getSecondaryPhone(),
         email: $('#contact_form [name=primary_email]').val(),
         www: $('#contact_form #url_protocol').val() + $('#contact_form #url_host').val(),
         url_protocol: $('#contact_form #url_protocol').val(),
         url_host: $('#contact_form #url_host').val(),
         tag: $('#contact_form [name=contact_tags]').val(),
         gps: $('#contact_form [name=gps]').val()
      }
      if (!(company.gps && company.gps != '' && company.gps != '{}')) {
         delete company.gps;
      }
      return company;
   },
   forwardToConvert: function () {
      window.location.assign('./#ajax/company-form.php');
      window.convert_data = ContactConvert.prototype.getInformation();
   }
}