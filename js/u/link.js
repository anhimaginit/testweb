var host = 'https://api.salescontrolcenter.com/';
var host2 ='https://salescontrolcenter.com/';
if(window.location.href.indexOf('localhost')){
  var host = 'https://api.warrantyproject.com/'
  var host2 = window.location.href.indexOf('local') >= 0 ? 'http://localhost/crm/' : 'https://warrantyproject.com/';
}

var link = {
  getState : host + '_getStateList.php',
  _cusWarrantyGetByEmail: host + '_cusWarrantyGetByEmail.php',
  /**
   * 'token','cell_phone_number','comments_regarding_personal_property','company_name','email','first_name',
     'last_name','office_phone_number','order_placed_by','type_of_property', 'prop_or_investment',
     'warranty_overage_for','jwt','private_key'
   */
  newCustomerWarranty: [
    host + '_cusWarrantyAddNew.php',
    // host + '_cusWarrantyAddNewStep2.php',

  ],
  _cusWarrantyUpdateStep2_5: host + '_cusWarrantyUpdateStep2_5.php',
  /**
   *  'token','ID','cell_phone_number','comments_regarding_personal_property','company_name','email','first_name',
       'last_name','office_phone_number','order_placed_by','type_of_property','prop_or_investment',
       'warranty_overage_for','jwt','private_key'
   */
  updateCustomerWarranty: [
    /**
     * 'token','ID','cell_phone_number','comments_regarding_personal_property','company_name','email','first_name',
        'last_name','office_phone_number','order_placed_by','type_of_property','prop_or_investment',
        'warranty_overage_for','jwt','private_key'
     */
    host + '_cusWarrantyUpdateStep2.php',
    /**
     * 'token','ID','escrow_officer_firstnane','escrow_officer_lastnane',
        'title_company_name','escrow_officer_email','title_office_phone','jwt','private_key'
     */
    host + '_cusWarrantyUpdateStep2_5.php',
    /**
     * 'token','ID','is_prop_new_existing','property_type','location_prop_warr_street',
        'location_prop_warr_address2','location_prop_warr_city',
        'location_prop_warr_state','location_prop_warr_zipcode','sales_rep',
        'estimated_closing_date','home_warranty_amount_purchase_contract',
        'warr_buyer_firstname','warr_buyer_lastname','different_warr_prop_address',
        'billing_address','billing_street1','billing_address2',
        'billing_city','billing_state','billing_zipcode',
        'billing_phone','home_owner_email_checked','home_owner_email',
        'additional_comments_or_concerns','jwt','private_key'
     */
    host + '_cusWarrantyUpdateStep3.php',
    /**
     * 'token','ID','additional_person_infor_firstname','additional_person_infor_lastname',
        'additional_person_infor_email'
     */
    host + '_cusWarrantyUpdateStep4.php',
    /**
     * 'token','ID','protection','eagle_protection'
     */
    host + '_cusWarrantyUpdateStep5.php',
    /**
     * 'token','ID','charity','discount_code'
     */
    host + '_cusWarrantyUpdateStep6.php',
  ],

  /**
   *  'token','ID','jwt','private_key'
   */
  getCustomerWarranty: [
    // host + '_cusWarranty_ID.php',
    host + '_cusWarranty_IDStep2.php'
  ]

};

$.cookie('token', btoa('214a2036199e47ede48b7e468c796db5-us19'), { path: '/' });
$('form input').keyup(function(){
  if($(this).val()!=''){
    $(this).parent().find('p.error').remove();
    $(this).parent().find('input.error').removeClass('error');
  }
});