function Warranty() { }

Warranty.prototype.constructor = Warranty;
Warranty.prototype = {
  init: function () {
    // init select 2 for fields in selectFieldSelect2
    $('#warranty_form').validate(_warranty.formWarrantyValidatorOption);

    state = new State({ element: '#warranty_form' });
    $('[name=product_warranty_order_id]').select2({ placeholder: 'Select product' });
    _selectLoader = new SelectLoader();
    _selectLoader.loadCharityChoiceList('warranty_charity_of_choice');
    _selectLoader.loadDataSelectContact(link._salesmanList, 'salesperson', 'SID');
    // _selectLoader.loadWarrantyProductList('product_warranty_order_id');
    loadProductFolowEagleRenewal('', '');
    // loadSalesmanFolowState('ALL');
    // _selectLoader.loadALaCartrProductList('warranty_order_id');
    _purchaseProduct.createInputFields();

    this.setView();
    this.bindEvent();

  },
  setView: function () {
    var selectFieldSelect2 = [
      'warranty_salesman_id',
      'salesperson',
      'warranty_charity_of_choice',
      'subscription',
      'payment_type'
    ];
    selectFieldSelect2.forEach(function (item) {
      var type = $('[name="' + item + '"]').prop('type');
      if (type && type.includes('select')) {
        $('#warranty_form [name="' + item + '"]').select2();
      }
    });
    var select2Control = [
      '[name=bill_to]',
      // '[name=salesperson]',
      '[name=warranty_seller_agent_id]',
      '[name=warranty_buyer_agent_id]',
      '[name=warranty_mortgage_id]',
      '[name=warranty_escrow_id]'
    ];
    new ControlSelect2(select2Control, {
      bill_to: _linkSelect.bill_to,
      // salesperson: _linkSelect.salesperson,
      warranty_seller_agent_id: _linkSelect.bill_to,
      warranty_buyer_agent_id: _linkSelect.bill_to,
      warranty_mortgage_id: _linkSelect.bill_to,
      warranty_escrow_id: _linkSelect.bill_to
    });

    $('input[name="warranty_closing_date"]').datepicker({
      dateFormat: 'yy-mm-dd',
      changeMonth: true,
      changeYear: true,
      showOtherMonths: true,
      prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
    });
  },
  bindEvent: function () {
    $('#btnSubmitWarranty').unbind('click').bind('click', function () {
      $('#warranty_form').submit()
    });

    $("#warranty_discount_code").bind('change', function () {
      loadTotalDiscount();
    });

    // load discount list        
    // Warranty.prototype.loadDiscountListAct();

    //
    // $('#salespersonId').val(this.value).trigger('change');

    $("#billToId, input[name=iptWarrantyContactHiden]").bind('change', function () {

      var _mydata = {};
      _mydata.token = localStorage.getItemValue('token');
      _mydata.contactID = $('#billToId').val();
      if ($('input[name=iptWarrantyContactHiden]').is(":checked") && _mydata.contactID != '') {
        $.ajax({
          url: link._contactAddress_id,
          type: 'post',
          data: _mydata,
          dataType: 'json',
          success: function (res) {
            // load Policyholder Contact
            loadPolicyholderContact(res);
          }
        });
      } else {
        data = {};
        data.primary_street_address1 = '';
        data.primary_street_address2 = '';
        data.primary_city = '';
        data.primary_state = '';
        data.primary_postal_code = '';
        loadPolicyholderContact(data);
      }
    });

    $(".iptWarrantyCheckHashtag").click(function () {

      var warranty_eagle = "";
      var warranty_renewal = "";

      if ($('input[name=warranty_eagle]').is(":checked")) {
        warranty_eagle = $("input[name=warranty_eagle]").val();
      }

      if ($('input[name=warranty_renewal]').is(":checked")) {
        warranty_renewal = $("input[name=warranty_renewal]").val();
      }
      loadProductFolowEagleRenewal(warranty_eagle, warranty_renewal);

    });

    // load agian saleman
    $('select[name=warranty_state]').change(function () {
      // load agian saleman
      loadSalesmanFolowState($(this).val());
    });

    $('.btn-add-contact').click(function () {
      if ($(this).data('form') != 'Policy Holder') {
        window.a_type = $(this).data('form')
        window.c_type = 'Affiliate';

      } else {
        delete window.a_type;
        window.c_type = 'Policy Holder';
      }
      window.c_type_select = $(this).data('select');
      $('#contact_form [name="contact_type"]').prop('checked', false);
      $('#contact_form [name="contact_type"][value="' + window.c_type + '"]').prop('checked', true);
      $('#add_new_contact').modal('show');
    });

    this.productEvent();
  },
  productEvent: function () {
    $(document).on('select2:select', '#product_warranty_order_id', function (e) {
      var data = e.params.data;
      $('#iptProductQuantity').text(1);
      $('#iptProductSKU').text(data.SKU);
      $('#iptProductName').text(data.prod_name);
      $('#iptProductClass').text(data.prod_class);
      data.prod_price = numeral(data.prod_price).format('$ 0,0.00');
      $('#iptProductPrice').text(data.prod_price);
      $('#iptProductDiscountLineTotal').text(data.prod_price);
      _pricePurchase.getTotalPrice();
    })
  },

  getProductOrder: function () {
    var result = [];
    var offset = $('#tb_product_show thead tr').find('th').length - $('#tb_product_show thead th:contains(SKU)').index() + 1;

    $('#tb_product_show tbody').find('tr').each(function (row, elem) {
      var $tds = $(this).find('td'), id;
      var isfirst = $(elem).children().length;
      var id = $tds.eq(isfirst - offset).text();
      var prodClass = $tds.eq(isfirst - offset + 3).text();
      if (id != '' && prodClass == 'Warranty') {
        result.push(id);
      }
    });
    return result;
  },

  formWarrantyValidatorOption: {
    ignore: [],
    rules: {
      warranty_order_id: { required: true },
      warranty_postal_code: { maxlength: 20, number: true },
      warranty_address1: { required: true, maxlength: 100 },
      bill_to: { required: true },
      salesperson: {},
      warranty_charity_of_choice: { required: true, maxlength: 20 },
      warranty_serial_number: { number: true, required: true },
      warranty_address2: { maxlength: 100 },
      warranty_buyer_agent_id: { required: function () { return $('[name=warranty_payer_type][value=2]').prop('checked') || $('[name=warranty_submitter_type][value=2]').prop('checked') } /** notEqual: '.warranty_seller_agent_id' */ },
      warranty_seller_agent_id: { required: function () { return $('[name=warranty_payer_type][value=3]').prop('checked') || $('[name=warranty_submitter_type][value=3]').prop('checked') } /** notEqual: '.warranty_buyer_agent_id' */ },
      warranty_escrow_id: { required: function () { return $('[name=warranty_payer_type][value=4]').prop('checked') || $('[name=warranty_submitter_type][value=4]').prop('checked') } },
      warranty_mortgage_id: { required: function () { return $('[name=warranty_payer_type][value=5]').prop('checked') || $('[name=warranty_submitter_type][value=5]').prop('checked') } },
    },
    messages: {
      // warranty_seller_agent_id: { notEqual: 'Seller Agent and Buyer Agent must be different' },
      // warranty_buyer_agent_id: { notEqual: 'Buyer Agent and Seller Agent must be different' }
    },
    submitHandler: function (e) {
      _warranty.submitOrder(_warranty.submitWarranty);
    }
  },

  submitOrder: function (callback) {
    var _formData = { token: localStorage.getItemValue('token') };
    _formData.products_ordered = _purchaseProduct.getProductsData();
    if (_formData.products_ordered.length == 0) {
      messageForm('Please select least a product', false);
      return;
    }
    _formData.notes = [{
      create_date: getDateTime(),
      note: 'Create Order Purchase',
      type: 'Order',
      internal_flag: 1,
      enter_by: _formData.bill_to,
    }];
    textOrderTotal = numeral($('#_total_table').text()).value();
    textTotal = numeral($('#_total').text()).value();
    var warranty_contract_amount = numeral($('[name=warranty_contract_amount]').val()).value();
    if (textTotal < warranty_contract_amount) textTotal = warranty_contract_amount;
    if (textOrderTotal < warranty_contract_amount) textOrderTotal = warranty_contract_amount;
    _formData.order_total = textOrderTotal;
    _formData.bill_to = $('#billToId').val();
    _formData.salesperson = $('#salespersonId').val();
    _formData.total = textTotal;
    _formData.discount_code = $('#warranty_discount_code').val();
    _formData.balance = _formData.total;
    _formData.payment = 0;
    _formData.createTime = getDateTime();
    _formData.updateTime = getDateTime();
    _formData.subscription = _billing.getSubscription();
    _formData.order_id = $('#order_id').val();
    var _link = link._orderAddNewNotLogin;

    $.ajax({
      url: _link,
      type: 'post',
      data: _formData,
      success: function (res) {
        if (!res.startsWith('{')) {
          messageForm('Error! An error occurred. Please try later', false);
          // reject(res);
        } else {
          var data = JSON.parse(res);
          if (data["SAVE"] == 'FAIL') {
            messageForm('Error! An error occurred. ' + data['ERROR'], false);
            // reject(tmp['ERROR']);
          } else if (data["SAVE"] == 'SUCCESS') {
            if (data.ID) {
              $('#order_id').val(data.ID)
              if (callback) callback(data);
            } else {
              if (callback) callback({ ID: _formData.order_id });
            }
          }
        }
      },
    });
  },

  submitWarranty: function (data) {
    if (!data) return;
    var _formData = { token: localStorage.getItemValue('token') };
    _formData.warranty_order_id = data.ID;

    if (_formData.warranty_serial_number == '' || _formData.warranty_serial_number == undefined) {
      _formData.warranty_serial_number = Warranty.prototype.createSerialNumber();
    }

    _formData.notes = [{
      create_date: getDateTime(),
      note: 'Create Purchase Home Warranty',
      type: 'Warranty',
      internal_flag: 1,
      enter_by: 1,
    }];

    var _prod_ids = []
    _purchaseProduct.getProductsData().forEach(function (prod) {
      if (['Warranty', 'A La Carte'].includes(prod.prod_class))
        _prod_ids.push(prod.id);
        if (numeral(prod.quantity).value() > 1) {
          for (let i = 1; i < numeral(prod.quantity).value(); i++) {
              product_id.push(item.id);
          }
      }
    });

    _formData.pro_ids = _prod_ids.join(',')

    var sameNameFields = ['warranty_address1', 'warranty_address2', 'warranty_city', 'warranty_state',
      'warranty_postal_code', 'warranty_contract_amount', 'warranty_charity_of_choice', 'warranty_discount_number',
      'warranty_discount_type', 'payment_type', 'warranty_buyer_agent_id', 'warranty_seller_agent_id',
      'warranty_escrow_id', 'warranty_mortgage_id', 'warranty_closing_date'];

    sameNameFields.forEach(function (item) {
      _formData[item] = $('[name="' + item + '"]').val();;
    });

    if (_formData.warranty_closing_date == undefined) { _formData.warranty_closing_date = getDateTime(new Date()) }

    _formData.warranty_buyer_id = $('#billToId').val();
    _formData.warranty_salesman_id = $('#salespersonId').val();

    _formData.warranty_eagle = $('input[name=warranty_eagle]').prop('checked') == true ? 1 : 0;
    _formData.warranty_renewal = $('input[name=warranty_renewal]').prop('checked') == true ? 1 : 0;
    _formData.warranty_contract_amount = numeral(_formData.warranty_contract_amount).value();
    if (_formData.warranty_submitter_type && _formData.warranty_submitter_type != '' && _formData.warranty_submitter_type != 0) {
      _formData.warranty_submitter = $('[name=warranty_submitter_type]:checked').closest('.input-group').find('select').val();
    }

    _formData.warranty_payer_type = $('[name=warranty_payer_type]:checked').val();
    _formData.warranty_submitter_type = $('[name=warranty_submitter_type]:checked').val() || 0;

    _formData.diff_address = $('[name="iptWarrantyContactHiden"]').prop('checked') == true ? 1 : 0;
    _formData.total = numeral($('#_total').text()).value();
    _formData.skip_email = $('[name=skip_email]').prop('checked') == true ? 1 : 0;

    _link = link._warrantyAddNewNotLogin;

    $.ajax({
      url: _link,
      type: 'post',
      data: _formData,
      success: function (res) {
        var tmp = JSON.parse(res);
        if (tmp["SAVE"] == 'FAIL') {
          messageForm('Error! An error occurred. ' + tmp['ERROR'], false, '#warranty_form #message_form')
          return
        } else if (tmp["SAVE"] == 'SUCCESS') {
          if (tmp.ID) {
            $('#warranty_ID').val(tmp.ID);
          }
          if (localStorage.getItemValue('userID') && localStorage.getItemValue('userID') != '') {
            responseSuccessForward('You have successfully save the purchase home warranty', true, '#warranty_form #message_form', './#ajax/warranty-form.php?id=' + tmp.ID, 'Go to edit warranty');
          } else {
            messageForm('You have successfully save the purchase home warranty', true, '#warranty_form #message_form');
            setTimeout(function(){
              window.location.href = './signin.php';
            }, 2000);
          }

          return;
        }

      },
    });
  },

  createSerialNumber: function () {
    var _date = new Date();
    return _date.toISOString().split('.')[0].replace(/[T:-]/g, '');
  },
}

var loadTotalDiscount = function (callback) {
  var _mydata = {};
  _mydata.token = localStorage.getItemValue('token');
  _mydata.discount_code = $("#warranty_discount_code").val();
  _mydata.discount_name = $("#warranty_discount_code").val();
  $("#discountDescription").empty();
  if (_mydata.discount_code.length > 0) {
    $.ajax({
      // url: link._discountGetByDiscountCode,
      url: link._discountGetByDiscountCodeByName,
      type: 'post',
      data: _mydata,
      dataType: 'json',
      success: function (res) {
        if (res && res.item) {
          _pricePurchase.displayDiscount(res.item);
        } else {
          $("#discountDescription").html("<p class='error'>Discount Code is not exist</p>");
        }
        _pricePurchase.getTotalPrice();
        if (callback) callback()
      }
    });
  } else {
    _pricePurchase.getTotalPrice();
    delete window.discount_code_value;
  }


};

var addValueToiptDiscountCode = function (code) {
  $("#warranty_discount_code").val(code);
  loadTotalDiscount();
};

var loadSalesmanFolowState = function (state) {
  /**
   * #salespersonId
   */
  var _mydata = {};
  _mydata.token = localStorage.getItemValue('token');
  _mydata.state = state;

  $.ajax({
    url: link._salesmanList_state,
    type: 'post',
    data: _mydata,
    success: function (res) {
      var data = JSON.parse(res);
      // first_name + middle_name + last_name //
      $("#salespersonId").empty();
      data.forEach(function (item) {
        $("#salespersonId").append(new Option(item.first_name + ' ' + item.middle_name + ' ' + item.last_name, item.SID));;
      });
      $("#salespersonId").val(null).trigger('change');
    }
  });

};

var loadPolicyholderContact = function (data) {
  if (!data.primary_city || data.primary_city == '') {
    if ($('select[name=warranty_city]').val() == '' || $('select[name=warranty_city]').val() == '') return;
    $('select[name=warranty_postal_code]').empty();
    $('select[name=warranty_postal_code]').val(null).trigger('change');

    $('select[name=warranty_state]').empty();
    $('select[name=warranty_state]').val(null).trigger('change');

    $('select[name=warranty_city]').empty();
    $('select[name=warranty_city]').val(null).trigger('change');
    loadSalesmanFolowState('ALL');

  } else {
    state.setValue2(null, data.primary_city, data.primary_state, data.primary_postal_code, function () {
      loadSalesmanFolowState(data.primary_state);
    });
    // load Salesman folow State of Policyholder
  }

  /**
   *
   * name=[warranty_address1]
   * name=[warranty_address2]
   * name=[warranty_city]
   * name=[warranty_state]
   * name=[warranty_postal_code]
   */


  $('input[name=warranty_address1]').val(data.primary_street_address1);
  $('input[name=warranty_address2]').val(data.primary_street_address2);

};

var loadProductFolowEagleRenewal = function (eagle, renewal) {
  var _mydata = {};
  _mydata.token = localStorage.getItemValue('token');
  _mydata.Eagle = eagle;
  _mydata.Renewal = renewal;
  $.ajax({
    url: link._productClssWarranty,
    type: 'post',
    data: _mydata,
    dataType: 'json',
    success: function (res) {
      if (res) {
        if (res.list) {
          res.list.forEach(function (item, index) {
            res.list[index].id = item.ID;
            res.list[index].text = (item.prod_name ? item.prod_name : 'Warranty - ' + item.ID);
          });
        }
        $('#product_warranty_order_id').empty();
        res.list.splice(0, 0, { id: '', text: 'Select product' });
        $('#product_warranty_order_id').select2({ placeholder: 'Select product', data: res.list });
      } else {
        $('#product_warranty_order_id').empty();
      }
    }
  });
};

var _warranty = new Warranty();
_warranty.init();