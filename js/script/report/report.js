function Report(form) {
   this.form = form;
   window.form_report = form;
   window.oldReport = [];
}

Report.prototype = {
   constructor: Report,
   init: function () {
      this.setView();
      var _self = this;
      this.getReportListType();
      this.getFields(window.form_report, function (data) {
         _self.createFields(data);
      });

      this.loadOldReport();
      this.bindEvent();
   },
   getReportListType: function () {
      var _self = this;
      if (isSystemAdmin()) {
         window.report_type = 'all';
      } else {
         $.get('php/getSession.php?data=int_acl&child=acl_rules-ControlListForm-' + _self.form.toLowerCase() + 'report', function (res) {
            if (res && res != '') {
               res = JSON.parse(res);
               for (let i in res) {
                  window.report_type = i;
               }
            } else {
               window.report_type = 'login_only';
            }
         });
      }
   },
   setView: function () {
      loadScript("js/plugin/bootstrap-duallistbox/jquery.bootstrap-duallistbox.min.js", function () {
         $('select[name=boxCustomColumns]').bootstrapDualListbox({
            nonSelectedListLabel: 'Available Fields',
            selectedListLabel: 'Custom Fields',
            selectorMinimalHeight: 200,
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true,
            nonSelectedFilter: ''
         });
      });
   },
   bindEvent: function () {
      var _self = this;
      $(document).unbind('click', '#btnSaveReport, #btnSearchReport, #btnDownloadCsvReport, #btnDownloadPdfReport');
      $(document).unbind('change', '#sltLoadOldReport, #iptFilterTable');
      $('#btnSaveReport').click(function () {
         _self.saveReport();
      });

      $('.btn-clear-select').click(function () {
         let _select = $(this).data('select');
         $('[name="' + _select + '"]').val(null).trigger('change');
      });

      $('#btnResetReport').click(function () {
         _self.resetForm();
      })
      $('#btnSearchReport').click(function () {
         _self.searchReport(1);
      });
      $('#btnDownloadCsvReport').click(function () {

         _self.exportCSVReport();
      });
      $('#btnDownloadPdfReport').click(function () {
         _self.exportPDFReport();
      });

      $('#sltLoadOldReport').change(function () {
         _self.fillReport(this.value);
      });

      $('#iptFilterTable').change(function () {
      });
   },
   createFields: function (data) {
      var _self = this;
      delete window.field_report;
      window.field_report = Object.freeze(data);
      var fields = data.field;
      var html = '';
      // var tmp = '';
      for (let k in fields) {
         // tmp += ',\n'+k;
         html += _self.createInputField(fields[k], k);
      }
      $('#boxReport').html(html);
      $('#boxReport select').select2();
      // $('#boxReport select').val(null).trigger('change');
      $('#boxReport input[type=date]').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>'
      });
      $('#boxReport input[type=time]').timepicker({
         timeFormat: 'HH:mm',
         interval: 15,
         minTime: '00:00',
         maxTime: '23:59',
         startTime: '00:00',
         dynamic: false,
         dropdown: true,
         scrollbar: false
      });

      $('[rel="tooltip"]').tooltip();

      _self.createFilterDataSelect(fields, data.selected, function () {
         let links = window.field_report.links;
         for (let key in links) {
            _self.createSelect2('[name=' + key + ']', links[key]);
         }
         _self.selectForClass();
      });
      _self.createMiscField(data.misc);
      _self.createOtherSelect(data.selectData);

      return html;
   },

   createFilterDataSelect: function (fields, selected, callback) {
      if (!selected) selected = [];
      let content = '';
      for (let key in fields) {
         if (fields[key].type != 'label' && !fields[key].condition) {
            let selected_key = '';
            if (selected.includes(key)) selected_key = ' selected';
            content += '<option value="' + key + '" ' + selected_key + '>' + fields[key].name + '</option>';
         }
      }
      $('select[name=boxCustomColumns]').html(content);
      if (callback) callback();
   },

   createOtherSelect: function (fields, callback) {
      for (let _selectField in fields) {
         if (fields[_selectField].template) {
            let exec = this[fields[_selectField].template];
            exec('[name="' + _selectField + '"]', fields[_selectField]);
         } else if (fields[_selectField].text && fields[_selectField].id) {
            $.ajax({
               url: fields[_selectField].url,
               type: 'post',
               dataType: 'json',
               data: {
                  token: localStorage.getItemValue('token'),
                  jwt: localStorage.getItemValue('jwt'),
                  private_key: localStorage.getItemValue('userID')
               },
               success: function (data) {
                  if (data.list) data = data.list;
                  if (data.sub) data = data.sub;
                  var _html = '';
                  data.forEach(function (option) {
                     let option_id = '';
                     if (typeof option[fields[_selectField].id] == 'function') {
                        option_id = fields[_selectField].id(option);
                     } else {
                        option_id = option[fields[_selectField].id];
                     }
                     if (typeof fields[_selectField].text == 'string') {
                        _html += '<option value="' + option_id + '">' + option[fields[_selectField].text] + '</option>';
                     } else if (fields[_selectField].text instanceof Array) {
                        let __ = [];
                        fields[_selectField].text.forEach(f => {
                           __.push(option[f]);
                        })
                        _html += '<option value="' + option_id + '">' + __.join(' ') + '</option>';
                     } else if (typeof fields[_selectField].text == 'function') {
                        let text = fields[_selectField].text(option);
                        _html += '<option value="' + option_id + '">' + text + '</option>';
                     }
                  });
                  $('[name="' + _selectField + '"]').html(_html);
               }
            });
         }
      }
   },

   createMiscField: function (fields) {
      if (JSON.stringify(fields) == '{}') {
         $('#miscCriteria').html('No field to show');
         //    $('#miscCriteria-tab').hide();
         //    $('ul.nav-tabs li').has('a[href="#miscCriteria-tab"]').hide();
         return;
      }
      var _html = '';
      for (var k in fields) {
         _html += this.createInputField(fields[k], k);
      }
      $('#miscCriteria').html(_html);
      $('#miscCriteria input[type=date]').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>'
      });
   },

   getFields: function (form, callback) {
      /**
       * fields need to search. if field has type, it will be display in report page. else, just search in custom tab.
       * name : label before input/select;
       * type: input type; (null if no filter in search tab)
       * oneline: insert <hr> and new line after field
       * className: input class
       * multiple (for select): properties multiple
       * value: data for checkbox or radio or select
       * delimiter: separate character for inputtags
       */
      var data_field = {};
      /**
       * custom field selected in custom tab
       */
      var selected_field = [];
      /**
       * select2 search (remote search)
       */
      var links = {};
      /**
       * fields in misc tab (date type)
       */
      var misc = {};
      /**
       * some action for report form
       */
      var actions = {};
      /**
       * select2 with data (no remote search)
       */
      var selectData = {}

      switch (form.trim().toLowerCase()) {
         case 'contact':
            data_field = {
               ID: { name: 'ID' },
               first_name: { name: "First Name", type: "text" },
               middle_name: { name: "Middle Name", type: "text" },
               last_name: { name: "Last Name", type: "text", oneline: true },
               primary_street_address1: { name: "Street Address 1", type: "text" },
               primary_street_address2: { name: "Street Address 2", type: "text" },
               primary_city: { name: "City", type: "select", className: 'city' },
               primary_state: { name: "State", type: "select", className: 'state', multiple: true },
               primary_postal_code: { name: "Postal Code", type: "select", className: 'zipcode', multiple: true, oneline: true },
               primary_phone: { name: "Phone", type: "text" },
               primary_email: { name: "Email", type: "text" },
               primary_website: { name: "Website", type: "text" },
               company_name: { name: "Company Name", type: "select" },
               contact_salesman_id: { name: 'Representative', type: 'select', oneline: true, template: 'sale_name_representative' },
               contact_type: { name: "Contact Types", type: "checkbox", value: ['System Admin', "Sales", "Policy Holder", "Employee", "Vendor", "Affiliate", 'Lead'] },
               contact_tags: { name: 'Contact Tags', type: 'text', className: 'tagsinput" id="contact_tags', delimiter: ';' }
            };

            selected_field = ['ID', 'first_name', 'last_name', 'primary_street_address1', 'primary_phone', 'primary_email', 'contact_type', 'contact_tags']
            links = {
               primary_city: { url: link._getListcity, param: { data: 'city' } },
            }

            selectData = {
               company_name: { url: link._companiesByName, text: 'name', id: 'ID' },
               contact_salesman_id: { url: link._salesmanList, text: ['first_name', , 'middle_name', 'last_name'], id: 'UID' }
            }
            actions = {
               tagsinput: { contact_tags: link._getTag },
               search: link._reportContact,
               save: link._reportSave,
               type: 'contact'
            }
            break;
         case 'product':
            data_field = {
               SKU: { name: "SKU", type: "text" },
               prod_name: { name: "Product Name", type: "text" },
               prod_desc: { name: "Product Description", type: "text" },
               prod_desc_short: { name: "Product Description Short", type: "text" },
               prod_type: { name: "Product Type", type: "select", multiple: true },
               prod_class: { name: "Product Class", type: "select", multiple: true },
               prod_price: { name: "Product Price", type: "number", numberFormat: '$ 0,0.00' },
               prod_cost: { name: "Product Price", type: "number", numberFormat: '$ 0,0.00' },
               prod_weight: { name: "Product Weight", type: "number" },
               prod_length: { name: "Product Length", type: "number" },
               prod_width: { name: "Product Width", type: "number" },
               prod_height: { name: "Product Height", type: "number" },
               product_tags: { name: "Product Tags", type: "text", className: 'tagsinput" id="product_tags' },
               product_notes: { name: "Product Notes", type: "text" },
               product_updated_by: { name: "Product Updated By", type: "select" },
               prod_visible: { name: "Product Visible", type: "checkbox", value: [{ value: 1, label: 'Product Visible' }] },
               prod_inactive: { name: "Product Inactive", type: "checkbox", value: [{ value: 1, label: 'Product Inactive' }] }
            };
            selected_field = ['SKU', 'prod_name', 'prod_class', 'prod_type', 'prod_price'];
            links = {
               // prod_class: { url: link._getProductClass },
               // prod_type: { url: link._getProductType },
               product_updated_by: { url: link._contacListSearch, param: { data: 'contact_name' } }
            }

            selectData = {
               prod_class: { url: link._getProductClass, text: 'prodClass_name', id: 'prodClass_name' },
               prod_type: { url: link._getProductType, text: 'prodType_name', id: 'prodType_name' },
            }

            actions = {
               tagsinput: { product_tags: link._getTag },
               search: link._reportProducts,
               save: link._reportSave,
               type: 'product'
            }
            break;
         case 'company':
            data_field = {
               name: { name: "Company Name", type: "text" },
               company_salesman_id: { name: 'Representative', type: 'select', template: 'sale_name_representative' },
               address1: { name: "Address 1", type: "text" },
               address2: { name: "Address 2", type: "text" },
               phone: { name: "Phone", type: "text", },
               fax: { name: "Fax", type: "text" },
               email: { name: "Email", type: "text" },
               www: { name: "Website", type: "text" },
               type: { name: "Type", type: "text", className: 'company-type' },
               city: { name: "City", type: "select", className: 'city' },
               state: { name: "State", type: "select", className: 'state', multiple: true },
               postal_code: { name: "Postal Code", type: "select", className: 'zipcode', multiple: true },
               tag: { name: "Tags", type: "text", className: 'tagsinput" id="tag' },
            };
            selected_field = ['name', 'address1', 'phone', 'email', 'type'];
            links = {
               city: { url: link._getListcity, param: { term: 'city' } },
            }
            // misc = {
            //    createTimeStartDate: { name: 'Start Create Time', type: 'date' },
            //    createTimeEndDate: { name: 'End Create Time', type: 'date' },
            //    updateTimeStartDate: { name: 'Start Update Time', type: 'date' },
            //    updateTimeEndDate: { name: 'End Update Time', type: 'date' },
            // }

            selectData = {
               contact_salesman_id: { url: link._salesmanList, text: ['first_name', , 'middle_name', 'last_name'], id: 'UID' }
            }

            actions = {
               tagsinput: { tag: link._getTag },
               search: link._reportCompany,
               save: link._reportSave,
               type: 'company'
            }
            break;
         case 'order':
            data_field = {
               order_title: { name: "Order Title", type: "text", oneline: true },

               bill_to_label: { name: 'Buyer', type: 'label', ignore: true, col: 12 },
               bill_to: { name: "Buyer Full Name", type: "select", multiple: true, template: 'b_name' },
               b_first_name: { name: 'Buyer First Name', type: 'text' },
               b_last_name: { name: 'Buyer Last Name', type: 'text' },
               b_primary_street_address1: { name: 'Business Address', type: 'text' },
               b_primary_postal_code: { name: 'Buyer Zipcode', type: 'text' },
               b_primary_email: { name: "Buyer Email", type: "text" },
               b_primary_phone: { name: "Buyer Phone", type: "text" },
               b_primary_city: { name: 'Buyer City', type: 'select', className: 'city' },
               b_primary_state: { name: 'Buyer State', type: 'select', className: 'state', oneline: true },

               sales_label: { name: 'Salesman', type: 'label', ignore: true, col: 12 },
               salesperson: { name: "Salesman Name", type: "select", multiple: true, template: 's_name' },
               s_primary_email: { name: "Salesman Email", type: "text" },
               s_primary_phone: { name: "Salesman Phone", type: "text" },
               s_primary_city: { name: 'Salesman City', type: 'select', className: 'city' },
               s_primary_state: { name: 'Salesman State', type: 'select', className: 'state', oneline: true },

               submitter_ID: { name: 'Submitter', condition: true, type: 'select' },
               submitter_first_name: { name: 'Submitter First Name' },
               submitter_last_name: { name: 'Submitter Last Name' },
               submitter_primary_email: { name: 'Submitter Email' },
               submitter_primary_phone: { name: 'Submitter Phone' },
               submitter_primary_city: { name: 'Submitter City' },
               submitter_primary_state: { name: 'Submitter State' },
               submitter_primary_postal_code: { name: 'Submitter Zipcode' },
               submitter_primary_street_address1: { name: 'Submitter Address' },
               affiliate: {
                  name: 'Submitter Affiliate Type', display_label: true, condition: true, type: 'checkbox', separate: ',',
                  value: ['Real Estate Agent', 'Mortgage', 'Title'], oneline: true
               },

               products_ordered: {
                  name: 'Product', type: 'select', multiple: true, oneline: true, html_table_template: function (data) {
                     if (data.products_ordered) {
                        let _html = '<div>'
                        data.products_ordered.forEach(function (item, index) {
                           _html += `
                           <div class="padding-5">
                           <div>${item.prod_name}<span class="pull-right">${item.prod_class}</span></div>
                           <div>${item.sku}<span class="pull-right">${numeral(item.price).format('$ 0,0.00')}</span></div>
                           </div>
                           `;
                        });
                        _html += '</div>'
                        return _html;
                     } else {
                        return '';
                     }
                  }
               },

               balance: { name: "Balance", type: "range", numberFormat: '$ 0,0.00' },
               payment: { name: "Payment", type: "range", numberFormat: '$ 0,0.00' },
               total: { name: "Total", type: "range", numberFormat: '$ 0,0.00' },
               discount_code: { name: 'Discount Code', type: 'select', oneline: true },
               // subscription: { name: 'Subscription', type: 'select' },
               note: { name: 'Note', type: 'text' },
               warranty: { name: "Warranty", type: "text" },
               createTime: { name: 'Create Time' },
               updateTime: { name: 'Update Time' },
               paid_in_full: { name: 'Paid In Full' },
            };

            selected_field = ['order_title', 'bill_to', 'salesperson', 'total', 'balance', 'createTime'];
            links = {
               bill_to: { url: link._contacListSearch, param: { data: 'contact_name' } },
               primary_city: { url: link._getListcity, param: { data: 'city' } },
               s_primary_city: { url: link._getListcity, param: { data: 'city' } },
               b_primary_city: { url: link._getListcity, param: { data: 'city' } },
               submitter_ID: { url: link._contacListSearch, param: { data: 'contact_name' } },
               // affiliate: { url: link._affiliateSearchByName, param: { data: 'affilate_name' }, id: 'AID', text: ['contact_name', 'primary_state'] }
            }

            selectData = {
               products_ordered: { url: link._productFilterList, template: 'productSelect' },
               salesperson: { url: link._salesmanList, id: 'SID', text: ['first_name', 'middle_name', 'last_name'] },
               discount_code: { url: link._discountList, template: 'discountSelect' },
               // subscription: { url: link._subName, text: 'name', id: 'id' }
            }

            misc = {
               createTimeStartDate: { name: 'Start Create Time', type: 'date' },
               createTimeEndDate: { name: 'End Create Time', type: 'date' },
               updateTimeStartDate: { name: 'Start Update Time', type: 'date' },
               updateTimeEndDate: { name: 'End Update Time', type: 'date' },
               closing_date_start: { name: 'Pai In Full Start', type: 'date' },
               closing_date_end: { name: 'Pai In Full End', type: 'date' },
            }

            actions = {
               search: link._reportOrder,
               save: link._reportSave,
               type: 'order'
            }
            break;
         case 'warranty':
            data_field = {
               warranty_order_id: { name: 'Warranty Order Title', type: 'text', oneline: true },
               warranty_address1: { name: "Warranty Address 1", type: "text" },
               warranty_address2: { name: "Warranty Address 2", type: "text" },
               warranty_city: { name: "City", type: "select", className: 'city' },
               warranty_state: { name: "State", type: "select", className: 'state' },
               warranty_postal_code: { name: "Postal Code", type: "select", className: 'zipcode', oneline: true },
               warranty_type: { name: 'Type', type: 'select', value: { 'Warranty': 'Warranty' } },
               warranty_serial_number: { name: "Serial Number", type: "text", oneline: true },
               warranty_buyer_id: { name: 'Home Buyer', type: 'select', multiple: true, template: 'buyer' },
               warranty_salesman_id: { name: 'Salesman', type: 'select', multiple: true, template: 'salesman' },
               warranty_buyer_agent_id: { name: 'Buyer Agent', type: 'select', multiple: true },
               warranty_seller_agent_id: { name: 'Seller Agent', type: 'select', multiple: true },
               warranty_escrow_id: { name: 'Escrow', type: 'select', multiple: true },
               warranty_mortgage_id: { name: 'Mortgage', type: 'select', multiple: true, oneline: true },
               warranty_payer: { name: 'Payee', type: 'select', template: 'payee_name' },
               warranty_payer_type: { name: 'Payee Type', type: 'select', value: { 1: 'Home Buyer', 2: 'Buyer Agent', 3: 'Seller Agent', 4: 'Escrow', 5: 'Mortgage' } },
               warranty_contract_amount: { name: "Contract Amount", type: "range", numberFormat: '$ 0,0.00' },
               warranty_notes: { name: "Notes", type: "text" },
               warranty_create_by: { name: 'Create By', type: 'select', oneline: true },
               warranty_renewal: { name: "Warranty Renewal", type: "checkbox", value: [{ value: 1, label: 'Warranty Renewal' }] },
               warranty_eagle: { name: "Warranty Eagle", type: "checkbox", value: [{ value: 1, label: 'Warranty Eagle' }] },
               warranty_inactive: { name: "Warranty Inactive", type: "checkbox", value: [{ value: 1, label: 'Inactive' }] },
               warranty_start_date: { name: 'Start Date' },
               warranty_end_date: { name: 'End Date' },
               warranty_closing_date: { name: 'Closing Date' },
               warranty_update_date: { name: 'Updated Date' },
               warranty_creation_date: { name: 'Created Date' },
               warranty_create_by_name: { name: 'Create By Name' },
                submitter: { name: 'Submitter Name' },
            };
            selected_field = ['warranty_order_id', 'warranty_city', 'warranty_state', 'warranty_salesman_id', 'warranty_buyer_id', 'warranty_payer', 'warranty_serial_number', 'warranty_contract_amount'];
            links = {
               warranty_city: { url: link._getListcity, param: { term: 'city' } },
               warranty_salesman_id: { url: link._salesmanListSearch, param: { data: 'contact_name' } },
               warranty_buyer_id: { url: link._contacListSearch, param: { data: 'contact_name' } },
               warranty_buyer_agent_id: { url: link._affilAgentList, param: { data: 'contact_name' } },
               warranty_seller_agent_id: { url: link._affilAgentList, param: { data: 'contact_name' } },
               warranty_mortgage_id: { url: link._affilMortgageList, param: { data: 'contact_name' } },
               warranty_escrow_id: { url: link._affilTitleList, param: { data: 'contact_name' } },
               warranty_payer: { url: link._contacListSearch, param: { data: 'contact_name' } },
               warranty_create_by: { url: link._contacListSearch, param: { data: 'contact_name' } },
            }

            misc = {
               createTimeStartDate: { name: 'Start Created Time', type: 'date' },
               createTimeEndDate: { name: 'End Created Time', type: 'date' },
               updateTimeStartDate: { name: 'Start Update Time', type: 'date' },
               updateTimeEndDate: { name: 'End Update Time', type: 'date' },
               startTimeStartDate: { name: 'Start Started Date', type: 'date' },
               startTimeEndDate: { name: 'End Started Date', type: 'date' },
               endTimeStartDate: { name: 'Start Ended Date', type: 'date' },
               endTimeEndDate: { name: 'End Ended Date', type: 'date' },
               closingTimeStartDate: { name: 'Start Closing Date', type: 'date' },
               closingTimeEndDate: { name: 'End Closing Date', type: 'date' },
            }

            actions = {
               search: link._reportWarranty,
               save: link._reportSave,
               type: 'warranty'
            }
            break;
         case 'invoice':
            data_field = {
               customer: { name: "Customer", type: "select", multiple: true, template: 'customer_name' },
               salesperson: { name: "Salesman", type: "select", multiple: true, template: 'sale_name' },
               invoiceid: { name: "Invoice Number", type: "text" },
                order_title: { name: 'Order Title', type: 'text', oneline: true },
               balance: { name: "Balance", type: "range", numberFormat: '$ 0,0.00' },
               payment: { name: "Payment", type: "range", numberFormat: '$ 0,0.00' },
               total: { name: "Total", type: "range", numberFormat: '$ 0,0.00' },
               createTime: { name: 'Create Time' },
               updateTime: { name: 'Update Time' }
            };
            selected_field = ['customer', 'salesperson', 'invoiceid', 'total', 'balance'];
            links = {
               customer: { url: link._contacListSearch, param: { data: 'contact_name' } },
               salesperson: { url: link._salesmanListSearch, param: { data: 'contact_name' } },
            }
            misc = {
               createTimeStartDate: { name: 'Start Create Time', type: 'date' },
               createTimeEndDate: { name: 'End Create Time', type: 'date' },
               updateTimeStartDate: { name: 'Start Update Time', type: 'date' },
               updateTimeEndDate: { name: 'End Update Time', type: 'date' },
                paid_in_full: { name: 'Paid In Full', type: 'date' },
            }
            actions = {
               search: link._reportInvoice,
               save: link._reportSave,
               type: 'invoice'
            }
            break;
         case 'claim':
            data_field = {
               create_by: { name: 'Create By', type: 'select', multiple: true, template: 'create_by_name' },
               customer: { name: 'Customer', type: 'select', multiple: true, template: 'customer_name' },
               claim_assign: { name: 'Assigned To', type: 'select', multiple: true, template: 'claim_asign_name' },
               UID: {
                  name: 'Vendor', type: 'select', multiple: true, separate: ',', html_table_template: function (data) {
                     let UID = data.UID;
                     if (UID && UID.length > 0) {
                        let _html = [];
                        UID.forEach(function (item) {
                           _html.push(item.full_name);
                        })
                        return _html.join(', ');
                     } else {
                        return '';
                     }
                  }
               },
               status: { name: "Status", type: "select", multiple: true, value: claim_status }, // claim_status defined in report.php
               assign_task: { name: 'Assigned Task', type: 'text' },
               warranty_ID: { name: 'Warranty', type: 'text', oneline: true },
               // quote_number: { name: 'Quote Number', type: 'text' },
               // quote_amount: { name: 'Quote Amount', type: 'number', numberFormat: '$ 0,0.00' },
               // quote_date: { name: 'Quote Date', type: 'date' },
               // quote_flag: { name: 'Quote Flag', type: 'select', value: { 1: 'Approved', 0: 'Decline' } },
               // vendor_invoice_number: { name: 'Invoice Number', type: 'text' },
               // invoice_amount: { name: 'Invoice Amount', type: 'number', numberFormat: '$ 0,0.00' },
               // invoice_date: { name: 'Invoice Date', type: 'date' },
               // invoice_flag: { name: 'Invoice Flag', type: 'select', value: { 1: 'Approved', 0: 'Decline' } },
               start_date: { name: 'Start Date' },
               end_date: { name: 'End Date' },
               please_pay_flag: {
                  name: 'Accountant approved to pay', display_label: true, type: 'radio', value: [{ value: '1', label: 'Approved' }, { value: '0', label: 'Declined' }], col: 12, sectionClass: 'mg-b-5',
                  html_table_template: function (data) {
                     return (data.please_pay_flag == 1 || data.please_pay_flag == '1') ? 'Approved' : 'Declined'
                  }
               },
               paid: { name: 'Paid', type: 'checkbox', value: [{ value: 1, label: 'Paid' }], sectionClass: 'mg-b-5', col: 12 },
               inactive: {
                  name: 'Inactive', type: 'checkbox', value: [{ value: 1, label: 'Inactive' }], sectionClass: 'mg-b-5', col: 12, html_table_template: function (data) {
                     return data.inactive == 1 || data.inactive == '1' ? 'Inactive' : 'Active';
                  }
               }
            };
            selected_field = ['customer', 'claim_assign', 'UID', 'status', 'please_pay_flag'];
            links = {
               customer: { url: link._contacListSearch, param: { data: 'contact_name' } },
               // claim_assign: { url: link._claimEmployee, param: { data: 'contact_name' } },
               create_by: { url: link._contacListSearch, param: { data: 'contact_name' } },
            }

            selectData = {
               UID: {
                  url: link._claimVendors, id: 'id', text: function (data) {
                     return '[' + data.type.upperCaseFirst() + '] ' + data.full_name;
                  }
               },
               claim_assign: { url: link._employeeList, id: 'ID', text: ['first_name', 'last_name'] }
            }
            misc = {
               start_dateStartDate: { name: 'Begin Start Date', type: 'date' },
               start_dateEndDate: { name: 'Finish Start Date', type: 'date' },
               end_dateStartDate: { name: 'Begin End Date', type: 'date' },
               end_dateEndDate: { name: 'Finish End Date', type: 'date' },
               // createTimeStartDate: { name: 'Begin Create Time', type: 'date' },
               // createTimeEndDate: { name: 'End Create Time', type: 'date' }
            }
            actions = {
               search: link._reportClaim,
               save: link._reportSave,
               type: 'claim'
            }
            break;
         case 'task':
            data_field = {
               taskName: { name: 'Task Name', type: 'text' },
               assign_id: { name: 'Assign To', type: 'select', multiple: true, value: {} },
               customer_id: { name: 'Customer', type: 'select', multiple: true, value: {} },
               // dueDate: { name: 'Due Date', type: 'date' },
               // doneDate: { name: 'Done Date', type: 'date' },
               time: { name: 'Time', type: 'time' },
               status: { name: 'Status', type: 'select', value: { open: 'Open', 'in process': 'In Process', done: 'Done', close: 'Close' } },
               actionset: { name: 'Action Set', type: 'select', value: { warranty: 'Warranty', claim: 'Claim' } },
               content: { name: 'Content', type: 'text' }
            }
            selected_field = ['taskName', 'assign_id', 'customer_id', 'status', 'actionset'];
            links = {
               assign_id: { url: link._claimEmployee, param: { data: 'contact_name' } },
               customer_id: { url: link._contacListSearch, param: { data: 'contact_name' } },
            }
            misc = {
               doneDate_start: { name: 'Started Done Date', type: 'date' },
               doneDate_end: { name: 'End Done Date', type: 'date' },
               dueDate_start: { name: 'Started Due Date', type: 'date' },
               dueDate_end: { name: 'End Due Date', type: 'date' },
               createDate_start: { name: 'Start Create Date', type: 'date' },
               createDate_end: { name: 'End Create Date', type: 'date' },
            }
            actions = {
               search: '',
               save: link._reportSave,
               type: 'task'
            }
            break;
         case 'discount':
            data_field = {
               discount_name: { name: 'Discount Name', type: 'text', oneline: true },
               discount_code: { name: 'Discount Code' },
               // discount: { name: 'Discount Value', type: 'text', oneline:true},
               // apply_to: { name: 'Apply to', display_label: true, type: 'radio', value: [{ value: 1, label: 'Total Order' }, { value: 2, label: 'Product' }, { value: 3, label: 'Add on' }] },
               // discount_type: { name: 'Discount Type', display_label: true, type: 'radio', value: [{ value: '$', label: '$' }, { value: '%', label: '%' }] },
               order: {
                  name: 'Order', ignore: true, separate_columns: [{
                     data: function (data) {
                        if (data.order.length > 0) {
                           let _html = '';
                           data.order.forEach(item => {
                              _html += item.order_id ? item.order_title : '';
                              _html += '<br>';
                           });
                           return _html;
                        } else {
                           return '';
                        }
                     }, title: 'Order Title'
                  },
                  {
                     data: function (data) {
                        if (data.order.length > 0) {
                           let _html = '';
                           data.order.forEach(item => {
                              _html += item.paid == '0' ? '' : 'Paid';
                              _html += '<br>';
                           });
                           return _html;
                        } else {
                           return '';
                        }
                     }, title: 'Paid', className: 'col-md-1'
                  },
                  {
                     data: function (data) {
                        if (data.order.length > 0) {
                           let _html = '';
                           data.order.forEach(item => {
                              _html += item.balance == '0' ? 'Open' : '';
                              _html += '<br>';
                           });
                           return _html;
                        } else {
                           return '';
                        }
                     }, title: 'Open', className: 'col-md-1'
                  }]
               },
               start_date: { name: 'Start Date' },
               stop_date: { name: 'Stop Date' },
               excludesive_offer: { name: 'Excludesive Offer', type: 'select', value: { 1: 'Excludesive Offer', 0: 'None' } },
               nerver_expired: { name: 'Never Expired', type: 'select', value: { 1: 'Never Expired', 0: 'Limit Day' } },
               active: { name: 'Active', type: 'select', value: { 1: 'Active', 0: 'Inactive' } },
            }

            misc = {
               start_date_start: { name: 'Begin Started Date', type: 'date' },
               start_date_end: { name: 'End Started Date', type: 'date' },
               stop_date_start: { name: 'Begin Stop Date', type: 'date' },
               stop_date_end: { name: 'End Stop Date', type: 'date' },
            }

            selected_field = ['discount_name', 'order', 'paid', 'open']

            actions = {
               search: link._reportDiscount,
               save: link._reportSave,
               type: 'discount'
            }
            break;
            case 'payment':
            data_field = {
                customer: { name: "Customer", type: "select", multiple: true, template: 'customer_name1',oneline: true  },
                submit_by: { name: "Submitter", type: "select", multiple: true, template: 'submitter_name1',oneline: true  },
                pay_amount: { name: "Amount", type: "range", numberFormat: '$ 0,0.00',oneline: true  },
                overage: { name: "Overage", type: "range", numberFormat: '$ 0,0.00',oneline: true  },
                pay_type: { name: 'Pay type', type: "select", multiple: true ,oneline: true  },
                pay_note: { name: 'Pay note' , type: 'text',oneline: true },
                invoice_id: { name: 'Invoice Number ' , type: 'select',multiple: true, template: 'invoice_id', oneline: true},
                order_title: { name: 'Order Title'  , type: 'select',multiple: true, template:'order_id', oneline: true},
                customer_name: { name: 'customer_name' },
                submitter_name: { name: 'submitter_name' },
                pay_date: { name: 'pay_date' },
                overage: { name: 'overage',numberFormat: '$ 0,0.00' }
            };//_getInvoiceIDs
            selected_field = ['pay_date','customer_name','submitter_name', 'pay_amount', 'pay_type', 'pay_note','invoice_id','order_id'];
            links = {
                customer: { url: link._contacListSearch, param: { data: 'contact_name' } },
                submit_by: { url: link._contacListSearch, param: { data: 'contact_name' } },
                invoice_id: { url: link._getInvoiceNumbers, param: { data: 'invoice_number' } },
                order_title: { url: link._getOrderTitle_title, param: { data: 'order_title' } },
            }
            selectData = {
                pay_type: { url: link._getPaymentType, text: 'pay_name', id: 'pay_type' },
            }
            misc = {
                startPayDate: { name: 'Start Pay Date', type: 'date' },
                endPayDate: { name: 'End Pay Date', type: 'date' },
            }
            actions = {
                search: link._reportPayment,
                save: link._reportSave,
                type: 'payment'
            }
            break;
      }

      if (callback) callback({ field: data_field, selected: selected_field, links: links, misc: misc, action: actions, selectData: selectData });

   },

   createInputField: function (field, inputName) {
      var html = '';
      var sectionClass = 'col col-6';
      if (field.col && field.col <= 12 && field.col > 0) sectionClass = 'col col-' + field.col;
      if (field.sectionClass) {
         sectionClass += ' ' + field.sectionClass;
      }
      switch (field.type) {
         case null: break;
         case undefined: break;
         case 'label':
            html += '<section class="' + sectionClass + '"><label class="form-control-label">' + field.name + '</label></section>';
            break;
         case "text":
         case "email":
         case 'phone':
         case 'date':
         case 'time':
         case 'number':
            html += '<section class="' + sectionClass + '">';
            html += '<label class="input" data-attribute="' + inputName + '" >' + field.name + '</label>';
            html += '<input class="form-control pr-0 ' + (field.className ? field.className : '') + '" type="' + field.type + '" name="' + inputName + '" value="">';
            html += '</section>';
            break;
         case "checkbox":
         case 'radio':
            html += '<section class="' + sectionClass + '">';
            if (field.display_label) {
               html += '<label class="input" data-attribute="' + inputName + '" >' + field.name + '</label>'
            }
            html += '<div class="inline-group">';
            field.value.forEach(function (element) {
               html += '<label class="' + field.type + '">';
               html += '<input type="' + field.type + '" class="' + (field.className ? field.className : '') + '" name="' + inputName + '" value="' + (element.value ? element.value : element) + '">';
               html += '<i></i>' + (element.label ? element.label : element);
               html += '</label>';
            });
            html += '</div>';
            html += '</section>';
            break;
         case "select":
            html += '<section class="' + sectionClass + '">';
            html += '<label class="input">' + field.name + '</label>';
            html += '<div class="input-group" style="display:flex">'
            html += '<select class="form-control ' + (field.className ? field.className : '') + '" name="' + inputName + '" style="width:100%" ' + (field.multiple ? 'multiple' : '') + '>';
            var selectResult = field.value;
            if (selectResult instanceof Array) {
               for (var t of selectResult) {
                  html += '<option value="' + t + '">' + t + '</option>';
               }
            } else if (typeof selectResult == 'object') {
               for (var kk in selectResult) {
                  html += '<option value="' + kk + '">' + selectResult[kk] + '</option>';
               }
            }
            html += '</select>';
            html += '<span class="btn-sm btn-clear-select no-border-radius input-group-addon pointer hover-danger" style="width:unset; padding: 9px 11px;" data-select="' + inputName + '" rel="tooltip" data-placement="top" title="" data-original-title="Clear all"> <i class="fa fa-minus"></i> </span>';
            html += '</div>'
            html += '</section>';
            break;
         case 'range':
            html += '<section class="' + sectionClass + '">';
            html += '<label class="input">' + field.name + '</label>';
            html += '<div class="input-group" style="display:flex">';
            html += '<input type="number" class="form-control col-xs-6 pr-1" placeholder="Min" name="' + inputName + '_min">'
            html += '<span class="padding-2"></span>';
            html += '<input type="number" class="form-control col-xs-6 pr-1" placeholder="Max" name="' + inputName + '_max">'
            html += '</div>';
            html += '</section>';
            break;
         default:
            html += "";
      }
      if (field.oneline) {
         html += '<div class="clearfix"></div><hr class="padding-10">';
      }
      if (field.newline) {
         html += '<br>';
      }
      return html;
   },

   createSelect2: function (elems, option) {
      if (!option) option = {};
      if (!option.id) option.id = 'id';
      if (!option.text) option.text = ['text'];
      if (!option.url) option.url = link._contacListSearch;
      $(elems).select2({
         placeholder: 'Search Item',
         minimumInputLength: 2,
         language: {
            inputTooShort: function () {
               return 'Enter name';
            },
         },
         allowClear: true,
         multiple: $(elems).prop('multiple'),
         ajax: {
            url: option.url,
            type: 'post',
            dataType: 'json',
            delay: 300,
            data: function (params) {
               var _data = {
                  token: localStorage.getItemValue('token'),
                  jwt: localStorage.getItemValue('jwt'),
                  private_key: localStorage.getItemValue('userID'),
                  login_id: localStorage.getItemValue('userID')
                  // contact_name: params.term
               }
               if (option.param) {
                  if (option.param.term) {
                     _data[option.param.term] = $('[name="' + option.param.term + '"]').val();
                  }
                  if (option.param.data) {
                     _data[option.param.data] = params.term;
                  }
               }
               return _data;
            },
            processResults: function (data, params) {
               if (data && data.list) {
                  data = data.list;
               }
               if (data.length > 0 && typeof data[0] == 'string') {
                  // var iii = [];
                  data.forEach(function (item, index) {
                     data[index] = { id: item, text: item }
                  });
                  return { results: data };
               } else {
                  if (option.id) {
                     data.forEach(function (item, index) {
                        let text = [];
                        option.text.forEach(t => { text.push(item[t]) });
                        data[index] = { id: item[option.id], text: text.join(' ') }
                     });
                  }
                  return { results: data }
               }
            },
            cache: true
         },
         escapeMarkup: function (markup) { return markup; }, // var our custom formatter work
         templateResult: function (repo) {
            if (typeof repo == 'string') return repo;
            if (repo.loading) {
               return repo.text;
            }

            var markup =
               "<div class='select2-result-repository clearfix'>" +
               "<div class='select2-result-repository__meta'>" +
               "<div class='select2-result-repository__title'>" + repo.text + "</div>" +
               "<div class='pull-right'></div>" +
               "</div>" +
               "</div>";
            return markup;
         },
         templateSelection: function (repo) {
            if (typeof repo == 'string') return repo;
            return repo.text;
         }
      });
   },

   discountSelect: function (elems, options) {
      var _mydata = $.extend({}, template_data);
      _mydata.token = localStorage.getItemValue('token');
      $.ajax({
         url: options.url,
         type: 'post',
         data: _mydata,
         dataType: 'json',
         success: function (res) {
            if (res) {
               if (res.list) {
                  res.list.forEach(function (item, index) {
                     res.list[index].id = item.discount_code;
                     res.list[index].text = item.discount_name + item.discount_code;
                  });
                  let _discount_select_option = {
                     placeholder: 'Select product',
                     minimumInputLength: 0,
                     allowClear: true,
                     data: res.list,
                     escapeMarkup: function (markup) { return markup; },
                     templateResult: function (data) {
                        var _html = `
                        <div>
                           <div>
                              <span class="bold">${data.discount_name}</span>
                              <span class="pull-right pr-5">
                              <i class="fa ${data.active == 1 || data.active == '1' ? 'fa-check text-success' : 'fa-minus text-danger'}"> ${
                           !data.apply_to ? '' : data.apply_to.type == '1' ?
                              'Total Order' : data.apply_to.type == '2' ?
                                 'Product' : data.apply_to.type == '3' ?
                                    'Add on' : ''
                           }</i>
                              
                              </span>
                           </div>
                           <div>
                              <span>${data.discount_code}</span>
                              <span class="pull-right pr-5">${
                           data.nerver_expired == '1' ? 'Unlimit' :
                              data.start_date + '&rarr;' + data.stop_date
                           }</span>
                           </div>
                           <div>
                              <span>Value: ${
                           data.apply_to && data.apply_to.value.discount_type == '$' ? '$ ' : ''
                           }${data.apply_to && data.apply_to.value.discount}${
                           data.apply_to && data.apply_to.value.discount_type == '%' ? '%' : ''
                           }</span>
                           </div>
                        </div>
                        `;
                        return _html;
                     },
                     templateSelection: function (data) {
                        if (typeof data == 'string') return data;
                        if (!data.discount_name) return data.id;
                        return data.discount_name + ' (' + data.discount_code + ')';
                     }
                  }
                  $(elems).select2(_discount_select_option);
                  $(elems).val(null).trigger('change');
               }

            } else {
               $(elem).empty();
            }
         }
      });
   },

   productSelect: function (elems, options) {
      var _mydata = $.extend({}, template_data);
      _mydata.token = localStorage.getItemValue('token');
      $.ajax({
         url: options.url,
         type: 'post',
         data: _mydata,
         dataType: 'json',
         success: function (res) {
            if (res) {
               if (res.list) {
                  res.list.forEach(function (item, index) {
                     res.list[index].id = item.SKU;
                     res.list[index].text = (item.prod_name ? item.prod_name : 'Warranty - ' + item.ID);
                  });
                  let _score = {
                     'Warranty': 10,
                     'A La Carte': 9,
                     'Marketing': 8,
                     'Discount': 7
                  }
                  let list = res.list.sort(function (a, b) {
                     return _score[b.prod_class] - _score[a.prod_class];
                  })
                  let _product_select_option = {
                     placeholder: 'Select product',
                     minimumInputLength: 0,
                     allowClear: true,
                     data: list,
                     escapeMarkup: function (markup) { return markup; },
                     templateResult: function (data) {
                        var _html =
                           '<div class="media padding-2' + data.id + '">' +
                           '<div class="media-left">' +
                           '<img src="' + (data.prod_photo ? host + data.prod_photo : urlPhoto.itemProduct) + '" class="media-object" style="width:40px; margin-top:3px;">' +
                           '</div>' +
                           '<div class="media-body">' +
                           '<div class="username"><span class="bold">' + data.text + '</span> <small class="pull-right">' + data.prod_class + '</small></div>' +
                           '<div>SKU: ' + data.SKU + '<span class="pull-right">' + numeral(data.prod_price).format('$ 0,0.00') + '</span></div>' +
                           '</div>' +
                           '</div>';
                        return _html;
                     },
                     templateSelection: function (data) {
                        if (typeof data == 'string') return data;
                        if (!data.prod_name) return data.id;
                        return data.prod_name;
                     }
                  }
                  $(elems).select2(_product_select_option);
                  $(elems).val(null).trigger('change');
               }

            } else {
               $(elems).empty();
            }
         }
      });
   },

   selectForClass: function () {
      if ($('#boxReport select.state').prop('options')) {
         $.ajax({
            url: link._getStateList,
            type: 'post',
            data: {
               token: localStorage.getItemValue('token'),
               jwt: localStorage.getItemValue('jwt'),
               private_key: localStorage.getItemValue('userID'),
            },
            dataType: 'json',
            success: function (res) {
               //<option value="">Select State</option>
               var _html = '';
               res.forEach(function (item) {
                  _html += '<option value="' + item.code + '">' + item.state + '</option>';
               })
               $('#boxReport select.state').html(_html);
               $('#boxReport select.state').val(null).trigger('change')
            }
         })
      }

      if ($('#boxReport').has('.tagsinput')) {
         var tagsList = {};
         $('#boxReport .tagsinput').each(function () {
            var elemName = $(this).attr('name');
            var delimiter = window.field_report.field[elemName].delimiter;
            if (!delimiter) delimiter = ','
            $.ajax({
               url: window.field_report.action.tagsinput[elemName],
               type: 'post',
               data: {
                  token: localStorage.getItemValue('token'),
                  tag_type: window.form_report.toLowerCase()
               },
               dataType: 'json',
               success: function (res) {
                  tagsList[elemName] = res;
               }
            });

            var filterTags = function (tags, elemTags) {
               var result = [];
               tagsList[elemTags].forEach(function (item) {
                  if (item.toLowerCase().indexOf(tags.toLowerCase()) >= 0) {
                     result.push(item);
                  };
               })
               return result;
            }
            $(this).tagsInput({
               interactive: true,
               placeholder: 'Add a tag',
               width: 'auto',
               height: 'auto',
               delimiter: [delimiter],
               hide: true,
               removeWithBackspace: true,
               autocomplete: {
                  source: function (req, res) {
                     res(filterTags(req.term, elemName));
                  }
               }
            });

            $('#boxReport #' + elemName + '_tag').change(function () {
               var val = $(this).val();
               if ($('#boxReport #' + elemName).val().split(delimiter).includes(val)) {
                  $(this).val('');
               } else {
                  $('#boxReport #' + elemName).addTag(val);
               }
            });

            $('#boxReport #' + elemName + '_tag').keyup(function (e) {
               var key = e.keyCode;
               /** 9 = tab, 13= enter, 37= ←, 38= ↑, 39= →, 40= ↓, 190= ., 106= *, 111= /, */
               var listList = [9, 13, 37, 39, 190, 106, 111]
               if (listList.includes(key)) {
                  var val = $(this).val();
                  if ($('#boxReport #' + elemName).val().split(delimiter).includes(val)) {
                     $(this).val('');
                  } else {
                     $('#boxReport #' + elemName).addTag(val);
                     $(this).val('');
                     $(this).focus();
                  }
               }
            });

         });


      }

      if ($('#boxReport select.zipcode').prop('options')) {
         $.ajax({
            url: link._postalCodeList,
            type: 'post',
            data: {
               token: localStorage.getItemValue('token'),
               jwt: localStorage.getItemValue('jwt'),
               private_key: localStorage.getItemValue('userID'),
            },
            dataType: 'json',
            success: function (res) {
               //<option value="">Select Postal Code</option>
               var _html = '';
               res.list.forEach(function (item) {
                  if (item != '') {
                     _html += '<option value="' + item + '">' + item + '</option>';
                  }
               })
               $('#boxReport select.zipcode').html(_html);
               $('#boxReport select.zipcode').val(null).trigger('change');
            }
         })
      }
   },

   getFormData: function (page, isDowload) {
      let _formData = {
         key: {},
         customColumns: [],
         availableFields: [],
         showAllRows: $('#iptShowAllRows').prop("checked"),
         numberOfRows: $('#sltNumberOfRows').val(),
         pages: page ? parseInt(page) - 1 : 0
      };
      if (isDowload) _formData.numberOfRows = 0;
      _formData.customColumns = $('[name="boxCustomColumns"]').val();

      _formData.availableFields = $('[name="boxCustomColumns"] option:not(:selected)').map(function () {
         return this.value;
      }).get();

      let _dataField = window.field_report.field;

      for (let itemField in _dataField) {

         if (_dataField[itemField].template && _formData.customColumns.includes(itemField)) {
            if (_dataField[itemField].template instanceof Array) {
               _formData.customColumns.push(..._dataField[itemField].template);
            } else {
               _formData.customColumns.push(_dataField[itemField].template);
            }
         }

         if (_dataField[itemField].ignore != undefined && _formData.customColumns.includes(itemField) && _dataField[itemField].type != 'label') {
            let index = _formData.customColumns.indexOf(itemField);
            _formData.customColumns.splice(index, 1);
         }

         switch (_dataField[itemField].type) {
            case undefined:
            case null:
            case 'label':
               break;
            case 'checkbox':
               _formData.key[itemField] = [];
               let checkboxes = document.querySelectorAll('#boxReport input[name="' + itemField + '"]:checked');
               for (var i = 0; i < checkboxes.length; i++) {
                  _formData.key[itemField].push(checkboxes[i].value);
               }
               if (_dataField[itemField].separate) {
                  _formData.key[itemField] = _formData.key[itemField].join(_dataField[itemField].separate);
               }
               break;
            case 'select':
               _formData.key[itemField] = $('#boxReport [name="' + itemField + '"]').val();
               if (_dataField[itemField].separate) {
                  _formData.key[itemField] = _formData.key[itemField].join(_dataField[itemField].separate);
               }
               break;
            case 'text':
               _formData.key[itemField] = document.getElementsByName(itemField)[0].value;
               if (_dataField[itemField].className && _dataField[itemField].className.includes('tagsinput')) {
                  let delimiter = _dataField[itemField].delimiter;
                  if (!delimiter) delimiter = ',';
                  _formData.key[itemField] = _formData.key[itemField].split(delimiter)
               }
               break;
            case 'radio':
               _formData.key[itemField] = $('#boxReport [name="' + itemField + '"]:checked').val();
               break;
            case 'range':
               _formData.key[itemField + '_min'] = document.getElementsByName(itemField + '_min')[0].value;
               _formData.key[itemField + '_max'] = document.getElementsByName(itemField + '_max')[0].value;
               break;
            default:
               _formData.key[itemField] = document.getElementsByName(itemField)[0].value;
               break;
         }
      }

      var _data2 = $("#miscCriteria").serializeArray();

      _data2.forEach(function (elem) {
         _formData[elem.name] = elem.value;
      });

      return _formData;
   },
   saveReport: function () {
      var _formFields = this.getFormData(1, false);
      _formFields.name = $('#reportName').val() != '' ? $('#reportName').val() : 'Report ' + window.form_report + ' ' + getDateTime();
      var _report = {
         name: $('#reportName').val(),
         token: localStorage.getItemValue('token'),
         jwt: localStorage.getItemValue('jwt'),
         private_key: localStorage.getItemValue('userID'),
         login_id: localStorage.getItemValue('userID'),
         personal_filter: window.report_type,
         type: window.field_report.action.type,
         data: _formFields,
      }
      $.ajax({
         url: window.field_report.action.save,
         type: 'post',
         dataType: 'json',
         data: _report,
         success: function (res) {
            messageForm(window.field_report.action.type + ' report [' + res.name + '] is saved', true, '#notify_report');
            if (!window.oldReport) window.oldReport = [];
            $('#sltLoadOldReport').append('<option value="' + window.oldReport.length + '">' + res.name + '</option>');
            window.oldReport.push(_formFields);
         },
         error: function (e) {

         }
      })
   },
   searchReport: function (page, isDowload) {
      let _self = this;
      let _formData = {
         token: localStorage.getItemValue('token'),
         jwt: localStorage.getItemValue('jwt'),
         private_key: localStorage.getItemValue('userID'),
         login_id: localStorage.getItemValue('userID'),
         personal_filter: window.report_type
      };
      $('#modalInprogress').modal('show');
      setTimeout(function () {
         $('#modalInprogress').modal('hide');
      }, 4000);

      let formInput = _self.getFormData(page, isDowload);
      _formData.data = formInput;

      $.ajax({
         url: window.field_report.action.search,
         type: 'post',
         data: _formData,
         dataType: 'json',
         success: function (res) {
            var list = res.list ? res.list : res.data ? res.data : res;
            if (res.maxPages < 0) res.maxPages = 0;
            if (!isDowload) {
               _self.showSearchList(list, page, res.maxPages, res.total, true);
            } else {
               isDowload(list);
            }
         },
         error: function (e) {

         }
      });
   },

   exportCSVReport: function () {
      var _self = this;
      _self.searchReport(0, function (data) {
         if (!data || data.length <= 0) {
            messageForm('Data is empty for download file', 'warning', '#notify_report');
            return;
         }
         _self.showSearchList(data, 0, 1, data.length, true, '#my-table', true, function () {
            $('#tableDownloadData .buttons-csv').click();
         });
      });
   },
   exportPDFReport: function () {
      var _self = this;
      _self.searchReport(0, function (data) {
         if (!data || data.length <= 0) {
            messageForm('Data is empty for download file', 'warning', '#notify_report');
            return;
         }
         _self.showSearchList(data, 0, 1, data.length, true, '#my-table', true, function () {
            $('#tableDownloadData .buttons-pdf').click();
         });
      });
   },

   showSearchList: function (list, page, count, total, isAutoPaging, table, isDowload, callback) {
      if (!page) page = 1;
      if (!table) table = '#searchReportTable';
      if ($.fn.DataTable.isDataTable(table)) {
         $(table).DataTable().clear();
         $(table).DataTable().destroy();
      }
      $(table).empty();

      var _tableOptions = {
         sDom: "<'dt-toolbar text-right'<'hidden'B>>" + "t",
         data: list,
         fixedHeader: true,
         destroy: true,
         searching: true,
      }

      var showView = $('[name="boxCustomColumns"]').val();
      var _column = [];
      showView.forEach(function (field, index) {
         if (field != '') {
            var _title = window.field_report.field[field].name ? window.field_report.field[field].name : window.customField ? window.customField : field
            var col = { data: field, searchable: true, title: _title };
            if (['number', 'date', 'range'].includes(window.field_report.field[field].type)) col.className = 'text-right';
            if (window.field_report.field[field].numberFormat) {
               col.data = function (rowData) {
                  return numeral(rowData[field]).format(window.field_report.field[field].numberFormat);
               }
            } else if (window.field_report.field[field].html_table_template) {
               col.data = window.field_report.field[field].html_table_template;
            } else if (window.field_report.field[field].separate_columns) {
               _column.push(...window.field_report.field[field].separate_columns);
            } else if (window.field_report.field[field].className && window.field_report.field[field].className.includes('company-type')) {
               col.data = function (rowData) {
                  var elem = [];
                  JSON.parse(rowData[field]).forEach(function (item) {
                     var color = '';
                     switch (item) {
                        case 'Real Estate Broker': {
                           color = 'bg-color-green';
                           break;
                        }
                        case 'Mortgage': {
                           color = 'bg-color-blue';
                           break;
                        }
                        case 'Bacle': {
                           color = 'bg-color-orange';
                           break;
                        }
                        case 'Title': {
                           color = 'bg-color-purple';
                           break;
                        }
                        case 'Vendor': {
                           color = 'label-success';
                           break;
                        }
                        default: {
                           color = 'bg-color-red';
                           break;
                        }

                     }
                     elem.push('<span class="badge ' + color + ' txt-color-white">' + item + '</span>');
                  });
                  return elem.join('<i class="hidden">, </i> ');
               }
            } else if (window.field_report.field[field].className && window.field_report.field[field].className.includes('tagsinput')) {
               var delimiter = window.field_report.field[field].delimiter;
               if (!delimiter) delimiter = ',';
               col.data = function (rowData) {
                  if (!rowData[field]) return '';
                  var elem = [];

                  rowData[field].split(delimiter).forEach(function (item) {
                     elem.push('<span class="badge bg-color-pink">' + item + '</span>');
                  });
                  return elem.join('<i class="hidden">' + delimiter + '</i> ');
               }

            } else if (window.field_report.field[field].template) {
               if (window.field_report.field[field].template instanceof Array) {
                  col.data = function (rowData) {
                     var __ = [];
                     window.field_report.field[field].template.forEach(item => {
                        __.push(rowData[item]);
                     })
                     return __.join(' ');
                  }
               } else {
                  col.data = function (rowData) {
                     return rowData[window.field_report.field[field].template];
                  }
               }
            }
            if (!window.field_report.field[field].separate_columns) {
               _column.push(col);
            }
         }
      });

      _tableOptions.columns = _column;
      /**
       * Paging table
       */
      if (!isDowload) {
         var pageLength = parseInt($('#sltNumberOfRows').val());
         if (list && count || !total) total = pageLength * count;
         var currentShowing = page * pageLength < total ? page * pageLength : total;
         var smallShowing = !total || total == 0 || total == '0' ? 0 : (page - 1) * pageLength + 1;
         if ($('#iptShowAllRows').prop('checked') == true) {
            _tableOptions.paging = false;
            _tableOptions.pageLength = list.length;
            $('#showRecordInfo').html('Showing 1 to ' + numeral(_tableOptions.pageLength).format('0,0') + ' (' + numeral(_tableOptions.pageLength).format('0,0') + ' records)');
         } else {
            $('#showRecordInfo').html('Showing ' + numeral(smallShowing).format('0,0') + ' to ' + numeral(currentShowing).format('0,0') + ' (' + numeral(total).format('0,0') + ' records)');
            _tableOptions.paging = true;
            _tableOptions.pageLength = pageLength;
         }
         // if (isAutoPaging) {
         //    _tableOptions.sDom = "<'dt-toolbar text-right'<'hidden'B>>" + "t" + "<'dt-toolbar-footer'<'text-right'p>>"
         // }
         /**
          * Complete function
          */
         _tableOptions.initComplete = function () {
            $('#modalInprogress').modal('hide');
            $(table + ' thead tr').clone().appendTo(table + ' thead');
            $(table + ' thead tr:eq(1) th').each(function (i) {
               var title = $(this).text();
               $(this).removeAttr('class tabindex area-controls rowspan colspan area-label');
               $(this).addClass('hasinput');
               $(this).html('<input type="text" class="form-control" placeholder="Search ' + title + '" />');

               $('input', this).on('keyup change', function () {
                  if ($(table).DataTable().column(i).search() !== this.value) {
                     $(table).DataTable()
                        .column(i)
                        .search(this.value)
                        .draw();
                  }
               });
            });
            $('#modalSearch').modal('show');
            // if (callback) callback();
         }
         createPagination({ page: page ? parseInt(page) : 1, pagesize: _tableOptions.pageLength, total: total, action: 'report.searchReport' });
      } else {
         _tableOptions.buttons = [
            { extend: 'csv', title: window.form_report + ' Report List - ' + getDateTime() },
            { extend: 'excel', title: window.form_report + ' Report List - ' + getDateTime() },
            {
               extend: 'pdf', orientation: 'landscape', title: window.form_report + ' Report List - ' + getDateTime()
            }
         ];
         _tableOptions.initComplete = function () {
            $('#modalInprogress').modal('hide');
            if (callback) callback();
         }
      }


      $(table).DataTable(_tableOptions);
      $('.dataTables_empty').attr('colspan', $('#searchReportTable thead tr:first').find('th').length);
   },
   loadOldReport: function () {
      var data = {};
      data.formType = this.form.toLowerCase();
      data.userID = localStorage.getItemValue('userID')

      var _mydata = {
         private_key: localStorage.getItemValue('userID'),
         jwt: localStorage.getItemValue('jwt'),
         token: localStorage.getItemValue('token'),
         data: data
      };
      $.ajax({
         url: link._reportLoadOld,
         type: 'post',
         data: _mydata,
         dataType: 'json',
         success: function (res) {
            window.oldReport = res.data;
            $('#sltLoadOldReport').html('<option value="" selected>Reset Report</option>');
            res.data.forEach(function (item, index) {
               $('#sltLoadOldReport').append('<option value="' + index + '">' + item.name + '</option>');
            });
            $("#sltLoadOldReport").val(null).trigger('change');
         },
         error: function (e) {
         }
      })
   },

   resetForm: function () {
      $('#boxReport').trigger('reset');
      $('#miscCriteria').trigger('reset');
      $('#boxReport select').val(null).trigger('change');
      $('.tagsinput').removeTag($('.tagsinput').val());
      $('#reportName').val('');
   },
   /**
    * 
    * @param {Number} value : maybe string to parseInt. index of value in window.oldReport
    * @purpose get report and fill in form;
    */
   fillReport: function (value) {
      this.resetForm();
      if (value != '') {
         value = parseInt(value);
         var data = window.oldReport[value];
         $('#boxCustomColumns').val(data.customColumns).trigger('change');
         /**
          * fill in Search form 
          * Misc form will be filled if the report is loaded from DB
          */
         for (var field in data.key) {
            var type = $('[name="' + field + '"]').prop('type');
            if (type && type != '') {
               if (['checkbox', 'radio'].includes(type)) {
                  $('[name="' + field + '"]').prop('checked', false);
                  data.key[field].forEach(function (type) {
                     $('[name="' + field + '"][value="' + type + '"]').prop('checked', true);
                  });
               } else if (type.includes('select')) {
                  if (data.key[field] == '' || data.key[field] == undefined) {
                     $('[name="' + field + '"]').val(null).trigger('change');
                  } else {
                     if (data.key[field] instanceof Array) {
                        data.key[field].forEach(function (item) {
                           if ($('[name="' + field + '"] option[value="' + item + '"]').val() == undefined) {
                              $('[name="' + field + '"]').append('<option value="' + item + '" selected>' + item + '</option>').trigger('change');
                           }
                        });
                     } else {
                        $('[name="' + field + '"]').append('<option value="' + data.key[field] + '" selected>' + data.key[field] + '</option>').trigger('change');
                     }
                     $('[name="' + field + '"]').val(data.key[field]).trigger('change');

                  }
               } else if ($('[name="' + field + '"]').hasClass('tagsinput')) {
                  var delimiter = window.field_report.field[field].delimiter;
                  if (!delimiter) delimiter = ',';
                  if (typeof data.key[field] == 'undefined') { }
                  else if (data.key[field] instanceof String) {
                     $('[name="' + field + '"]').importTags(data.key[field]);
                  } else if (data.key[field] instanceof Array) {
                     $('[name="' + field + '"]').importTags(data.key[field].join(delimiter));
                  }
               } else {
                  $('[name="' + field + '"]').val(data.key[field]).trigger('change');
               }
            }
         }

         /**
          * fill in Misc form
          * when load report just created
          */
         for (var field in data) {
            if (!['availableFields', 'customColumns', 'key', 'id', 'name', 'type', 'userID'].includes(field)) {
               $('[name="' + field + '"]').val(data[field]).trigger('change');
            }
         }

      }
   }
}

/**
 *

@param form: Contact/Product/Warranty/Order/Claim/Invoice/Task/Company
add other form: defined in function getFields();
@include
-  field: form field,
-  selected: field display in list search (for custom columns tab),
-  links: select2 box remote link,
-  misc: field in misc tab,
-  action: action form (save, search, tagsinput{for input.tagsinput}, type) @see in switch -> actions on function getFields();
var report = new Report(form);
report.init();
 */