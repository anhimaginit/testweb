function CompanyAppend() { }
var company_append, company_state, companyDocument;
CompanyAppend.prototype = {
  constructor: CompanyAppend,
  init: function () {
    company_append = new CompanyForm();
    company_state = new State({ element: '#company_form' });
    url_company_open = company_append.url_company_open;
    company_append.setView();
    company_append.bindEvent();

    _companyPhone = new ContactPhone('#company_form #table_phone');
    _companyPhone.init();

    $('#company_form #btnBackCompany').on('click', function () {
      $('#add_new_company').modal('hide');
      $('#company_form').trigger('reset');
      $('#add_new_contact').modal('show');
    });

    $('#company_form #btnSubmitCompany').on('click', function () {
      $('#company_form').submit();
    });
  }
}

new CompanyAppend().init();