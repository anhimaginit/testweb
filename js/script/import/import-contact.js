
function ImportContact() {
   this.import_arr = {};
   this.removeSelected = '';
   window.data_content = [];
}
window.import_records = 100;
ImportContact.NAME = "ImportContact";
ImportContact.VERSION = "1.2";
ImportContact.DESCRIPTION = "Class ImportContact";

ImportContact.prototype.constructor = ImportContact;
ImportContact.prototype = {
   init: function () {
      $('#import_contact_form #import-next').unbind('click').bind('click', function (e) {
         $('#message_form').hide();
         window.data_content = [];
         imp.import_arr = {};
         imp.inProcess(true);
         var data = $("#contact_import")[0].files[0];
         if (typeof data !== "undefined") {
            imp.createTabPane();
            var tempCSV = data.name.split(".");
            var types = tempCSV.pop();
            if (types == 'csv' || types == 'CSV') {
               $('#import_contact_form .contact-import').css({ "display": 'none' });
               imp.processfile(data, types);
               $('#import_contact_form #process-contact').css({ "display": '' });
            } else if (types == 'xls' || types == 'xlsx') {
               $('#import_contact_form .contact-import').css({ "display": 'none' });
               imp.loadExcelFile(data);
               $('#import_contact_form #process-contact').css({ "display": '' });
            }
         } else {
            imp.inProcess(false);
         }
      });


      $(document).unbind('click', '#import_contact_form .contact-submit').on('click', '#import_contact_form .contact-submit', function (e) {
         $('#message_form').hide();
         imp.createDataImp($(this).data('index'));
      });

      $(document).unbind('click', '#import_contact_form .contact-back').on('click', '#import_contact_form .contact-back', function (e) {
         location.reload();
      });

      $(document).unbind('click', '#import_contact_form .contact-submit-all').on('click', '#import_contact_form .contact-submit-all', function (e) {
         $('#message_form').hide();
         imp.submitAll();
      })

      $('#import_contact_form .contact-previous').unbind('click').bind('click', function (e) {
         $('#message_form').hide();
         $('#import_contact_form .contact-errs').css({ "display": "none" });
         $('#import_contact_form #process-contact').css({ "display": "" });
      });
   },

   inProcess: function (status) {
      if (status) {
         $('#import_contact_form .loading-process').show();
      } else {
         $('#import_contact_form .loading-process').hide();
      }
   },

   processfile: function (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
         var csv = event.target.result;
         var data = $.csv.toArrays(csv);
         imp.loadTab(data, 0, file.name);
      }
      reader.onloadend = function () {
         imp.inProcess(false);
      }
      reader.readAsText(file);
   },

   loadExcelFile: function (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
         var data = e.target.result;
         var workbook = XLSX.read(data, { type: 'binary' });
         var _data = [];
         workbook.SheetNames.forEach(function (sheetName, index) {
            //sheet_to_row_object_array
            var XL_row_object = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            _data = $.csv.toArrays(XL_row_object);
            imp.loadTab(_data, index, sheetName);
         });

      };
      reader.onloadend = function () {
         imp.inProcess(false);
      }
      reader.readAsBinaryString(file);
   },

   createTabPane: function () {
      var _html =
         '<div class="tabbable import-contact-tab" style="width:auto">' +
         '<ul class="nav nav-tabs import-contact-tab-header">' +
         '</ul>' +
         '<div class="tab-content import-contact-tab-content padding-10">' +
         '</div>' +
         '</div>';
      $('#contact-import-contents').html(_html);
   },

   loadTab: function (sheet, tabIndex, tabName) {
      window.data_content.splice(tabIndex, 0, sheet);
      imp.loadTable(sheet, tabIndex, function (data, index) {
         imp.displayTab(data, index, tabName, function (option) {
            imp.bindEventTabs(option.index);
         });
      });

   },

   bindEventTabs: function (tabIndex) {
      //bind events
      $('.tbl-import-contact[data-index="' + tabIndex + '"] .edit-importmap').unbind('click').bind('click', function () {
         //close all .header-form and open .header-set
         $('.tbl-import-contact[data-index="' + tabIndex + '"] .header-set').css({ "display": "" });
         $('.tbl-import-contact[data-index="' + tabIndex + '"] .header-form').css({ "display": "none" });
         //open and close only this
         $(this).closest('.header-set').css({ "display": "none" });
         $(this).closest('th').find('.header-form').css({ "display": "" });
         //get value
         imp.removeSelected = $(this).closest('th').find('.filed_change option:selected').val();

      });

      $('.tbl-import-contact[data-index="' + tabIndex + '"] .delete-importmap').unbind('click').bind('click', function () {
         //get value
         var valSelected = $(this).closest('th').find('.filed_change option:selected').val();
         //close all .header-form and open .header-set
         $('.tbl-import-contact[data-index="' + tabIndex + '"] .header-set').css({ "display": "" });
         $('.tbl-import-contact[data-index="' + tabIndex + '"] .header-form').css({ "display": "none" });

         //display selected option in all select box
         $('.tbl-import-contact[data-index="' + tabIndex + '"] th.header-cell .filed_change option[value="' + valSelected + '"]').css({ "display": '' });

         $(this).closest('th').find(".filed_change option[value='']").prop("selected", "selected");
         //add class map-deleted in th  next-importmap
         $(this).closest('th').addClass('map-deleted');
      });

      $('.tbl-import-contact[data-index="' + tabIndex + '"] .next-importmap').unbind('click').bind('click', function () {
         //get value
         var valSelected = $(this).closest('th').find('.filed_change option:selected').val();
         var textSelect = $(this).closest('th').find('.filed_change option:selected').text();

         //open and close only this
         $(this).closest('th').find('.header-set').css({ "display": "" });
         $(this).closest('th').find('.header-form').css({ "display": "none" });

         //not display selected option  header-name not-deleted
         if (valSelected != '') {
            $(this).closest('th').removeClass('map-deleted');
            $('.tbl-import-contact[data-index="' + tabIndex + '"] th.header-cell .filed_change option[value="' + valSelected + '"]').css({ "display": 'none' });
         } else {
            $(this).closest('th').addClass('map-deleted');
            if (imp.removeSelected != '') {
               $('.tbl-import-contact[data-index="' + tabIndex + '"] th.header-cell .filed_change option[value="' + imp.removeSelected + '"]').css({ "display": '' });
            }
         }

         $(this).closest('th').find(".filed_change option[value='" + valSelected + "']").css({ "display": '' });
         $(this).closest('th').find('.header-name.not-deleted').text(textSelect);
         //
         // var thNext = $(this).closest('th').next();
         //thNext.find('.header-set').css({"display":"none"});
         //thNext.find('.header-form').css({"display":""});

      });
   },

   displayTab: function (content, tabIndex, tabName, callback) {

      var _header = '<li class="' + (tabIndex == 0 ? 'active' : '') + '">';
      _header += '<a href="#import-contact-index-' + tabIndex + '" data-toggle="tab" rel="tooltip" data-placement="top">' + tabName + '</a>';
      _header += '</li>';
      var _content = '<div class="tab-pane' + (tabIndex == 0 ? ' active' : '') + '" id="import-contact-index-' + tabIndex + '">';
      _content += '<div class="data-import-content">';
      _content += content;
      _content += '</div>';
      _content += '<div class="row padding-10">' +
         '<button type="button" class="btn btn-sm btn-default contact-back">Back</button> ' +
         '<button type="button" class="btn btn-sm btn-primary contact-submit" data-index="' + tabIndex + '">Import ' + tabName + '</button> ' +
         '<button type="button" class="btn btn-sm btn-primary contact-submit-all">Import All</button>' +
         '</div>'
      _content += '</div>';


      $('#contact-import-contents .import-contact-tab-header').append(_header);
      $('#contact-import-contents .import-contact-tab-content').append(_content);
      if (callback) callback({ index: tabIndex });
   },

   loadTable: function (data, tabIndex, callback) {
      imp.import_arr[tabIndex] = [];
      var tr = '';
      var ths = '';
      var th = '';
      var listSelected = [];
      {

         var first_name_style = '';
         var middle_name_style = '';
         var last_name_style = '';
         var primary_street_address1_style = '';
         var primary_street_address2_style = '';
         var primary_city_style = '';
         var primary_state_style = '';
         var primary_postal_code_style = '';
         var primary_phone_style = '';
         var primary_phone_ext_style = '';
         var primary_phone_type_style = '';
         var primary_email_style = '';
         var primary_website_style = '';
         var contact_type_style = '';
         var contact_inactive_style = '';
         var contact_notes_style = '';
         var contact_tags_style = '';
         var create_by_style = '';
         var submit_by_style = '';
         var gps_style = '';
         var create_date_style = '';
         var company_name_style = '';
         var archive_id_style = '';
         var dateofbirth_style = '';
      }

      for (var row = 0; row < data.length; row++) {
         if (row == 0) {
            //create header column name
            for (var item = 0; item < data[row].length; item++) {
               th += '<th>' + data[row][item] + '</th>';
            }
         } else {
            if (row == 1) {
               var k = 0;
               var td_arr = [];
               //tr in tbody
               tr += '<tr>\r\n';
               for (var item = 0; item < data[row].length; item++) {
                  td_arr[k] = data[row][item];
                  tr += '<td>' + data[row][item] + '</td>\r\n';

                  k++;
               }
               tr += '</tr>\r\n';

               //
               imp.import_arr[tabIndex].push(td_arr);
               {
                  var first_name_flag = false;
                  var middle_name_flag = false;
                  var last_name_flag = false;
                  var primary_street_address1_flag = false;
                  var primary_street_address2_flag = false;
                  var primary_city_flag = false;
                  var primary_state_flag = false;
                  var primary_postal_code_flag = false;
                  var primary_phone_flag = false;
                  var primary_phone_ext_flag = false;
                  var primary_phone_type_flag = false;
                  var primary_email_flag = false;
                  var primary_website_flag = false;
                  var contact_type_flag = false;
                  var contact_inactive_flag = false;
                  var contact_notes_flag = false;
                  var contact_tags_flag = false;
                  var create_by_flag = false;
                  var submit_by_flag = false;
                  var gps_flag = false;
                  var create_date_flag = false;
                  var company_name_flag = false;
                  var archive_id_flag = false;
                  var dateofbirth_flag = false;
               }

               //create listSelected and listSelectedString keep fields to map to every column

               var ii = 0;
               for (var item = 0; item < data[row].length; item++) {
                  listSelected[ii] = "";
                  var isNum = Number.isInteger(parseFloat(data[row][item]));
                  var isString = data[row][item] != undefined && Number.isNaN(data[row][item]) && typeof data[row][item] == 'string';
                  var isDate = Date.parse(data[row][item]) && !isNum;

                  var breakFlag = false;

                  if (!first_name_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('name')) {
                        first_name_flag = true;
                        first_name_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "first_name";

                     }
                  }

                  if (!middle_name_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('name')) {
                        middle_name_flag = true;
                        middle_name_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "middle_name";

                     }
                  }

                  if (!last_name_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('name')) {
                        last_name_flag = true;
                        last_name_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "last_name";

                     }
                  }

                  if (!primary_street_address1_flag && !breakFlag) {
                     if (isString || data[row][item].toLowerCase().includes('street') || data[0][item].toLowerCase().includes('address')) {
                        primary_street_address1_flag = true;
                        primary_street_address1_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_street_address1";

                     }
                  }

                  if (!primary_street_address2_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('address')) {
                        primary_street_address2_flag = true;
                        primary_street_address2_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_street_address2";

                     }
                  }

                  if (!primary_city_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('city')) {
                        primary_city_flag = true;
                        primary_city_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_city";

                     }
                  }

                  if (!primary_state_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('state')) {
                        primary_state_flag = true;
                        primary_state_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_state";

                     }
                  }

                  if (!primary_postal_code_flag && !breakFlag) {
                     if ((isNum && data[row][item].length == 5) || data[0][item].toLowerCase().includes('postal') || data[0][item].toLowerCase().includes('zip')) {
                        primary_postal_code_flag = true;
                        primary_postal_code_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_postal_code";

                     }
                  }

                  if (!primary_phone_flag && !breakFlag) {
                     if ((data[row][item].includes('(') && data[row][item].includes(')')) || data[row][item].includes('-') || data[0][item].toLowerCase().includes('phone')) {
                        primary_phone_flag = true;
                        primary_phone_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_phone";

                     }
                  }

                  if (!primary_phone_ext_flag && !breakFlag) {
                     if (isString || (data[0][item].toLowerCase().includes('phone') && data[0][item].toLowerCase().includes('extend'))) {
                        primary_phone_ext_flag = true;
                        primary_phone_ext_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_phone_ext";

                     }
                  }

                  if (!primary_phone_type_flag && !breakFlag) {
                     if (['Home', 'Mobile', 'Work', 'Main', 'Delivery', 'Hotline'].includes(data[row][item])) {
                        primary_phone_type_flag = true;
                        primary_phone_type_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_phone_type";

                     }
                  }

                  if (!primary_email_flag && !breakFlag) {
                     if (data[0][item].toLowerCase().includes('mail') || (isNaN(data[row][item]) && data[row][item].includes('@') && data[row][item].includes('.'))) {
                        primary_email_flag = true;
                        primary_email_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_email";

                     }
                  }

                  if (!primary_website_flag && !breakFlag) {
                     if (isString && ['http', 'www', '://'].includes(data[row][item])) {
                        primary_website_flag = true;
                        primary_website_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "primary_website";

                     }
                  }

                  if (!contact_type_flag && !breakFlag) {
                     var isType = function () {
                        data[row][item].replace(/ /g, '').split(',').forEach(function (element) {
                           var typesContact = ['SystemAdmin', 'Admin', 'Employee', 'Affiliate', 'Vendor', 'PolicyHolder', 'Policy Holder', 'Sales', 'Customer'];
                           if (!typesContact.includes(element)) return false;
                        });
                        return true;
                     }
                     if (isType()) {
                        contact_type_flag = true;
                        contact_type_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "contact_type";

                     }
                  }

                  if (!contact_inactive_flag && !breakFlag) {
                     if ([0, 1].includes(data[row][item]) || data[0][item].toLowerCase().includes('inactive')) {
                        contact_inactive_flag = true;
                        contact_inactive_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "contact_inactive";

                     }
                  }

                  if (!contact_notes_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('note')) {
                        contact_notes_flag = true;
                        contact_notes_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "contact_notes";

                     }
                  }

                  if (!contact_tags_flag && !breakFlag) {
                     if (isString && data[row][item].includes(',') || data[0][item].toLowerCase().includes('tag')) {
                        contact_tags_flag = true;
                        contact_tags_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "contact_tags";

                     }
                  }

                  if (!create_by_flag && !breakFlag) {
                     if (isNum || data[0][item].toLowerCase().includes('create')) {
                        create_by_flag = true;
                        create_by_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "create_by";

                     }
                  }

                  if (!submit_by_flag && !breakFlag) {
                     if (isNum || data[0][item].toLowerCase().includes('submit')) {
                        submit_by_flag = true;
                        submit_by_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "submit_by";

                     }
                  }

                  if (!gps_flag && !breakFlag) {
                     if (isString || data[0][item].toLowerCase().includes('gps') || data[0][item].toLowerCase().includes('location')) {
                        gps_flag = true;
                        gps_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "gps";

                     }
                  }

                  if (!create_date_flag && !breakFlag) {
                     if (isDate) {
                        create_date_flag = true;
                        create_date_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "create_date";

                     }
                  }

                  if (!company_name_flag && !breakFlag) {
                     if (isNum || data[0][item].toLowerCase().includes('company')) {
                        company_name_flag = true;
                        company_name_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "company_name";

                     }
                  }

                  if (!archive_id_flag && !breakFlag) {
                     if (isNum) {
                        archive_id_flag = true;
                        archive_id_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "archive_id";

                     }
                  }

                  if (!dateofbirth_flag && !breakFlag) {
                     if (data[0][item].toLowerCase().includes('dob') || data[0][item].toLowerCase().includes('birth')) {
                        dateofbirth_flag = true;
                        dateofbirth_style = 'style="display:none"';
                        breakFlag = true;
                        listSelected[ii] = "dateofbirth";

                     }
                  }

                  ii = ii + 1;
               }

            } else {
               var td_arr = [];
               var k = 0
               tr += '<tr>\r\n';
               for (var item = 0; item < data[row].length; item++) {
                  td_arr[k] = data[row][item];
                  tr += '<td>' + data[row][item] + '</td>\r\n';
                  k++;
               }

               tr += '</tr>\r\n';
               //
               imp.import_arr[tabIndex].push(td_arr);
            }
         }
      }

      ////------------map fields to columns
      if (listSelected.length > 0) {
         var jj = 0;
         listSelected.forEach(function (item) {
            var first_name_style_c = first_name_style;
            var middle_name_style_c = middle_name_style;
            var last_name_style_c = last_name_style;
            var primary_street_address1_style_c = primary_street_address1_style;
            var primary_street_address2_style_c = primary_street_address2_style;
            var primary_city_style_c = primary_city_style;
            var primary_state_style_c = primary_state_style;
            var primary_postal_code_style_c = primary_postal_code_style;
            var primary_phone_style_c = primary_phone_style;
            var primary_phone_ext_style_c = primary_phone_ext_style;
            var primary_phone_type_style_c = primary_phone_type_style;
            var primary_email_style_c = primary_email_style;
            var primary_website_style_c = primary_website_style;
            var contact_type_style_c = contact_type_style;
            var contact_inactive_style_c = contact_inactive_style;
            var contact_notes_style_c = contact_notes_style;
            var contact_tags_style_c = contact_tags_style;
            var create_by_style_c = create_by_style;
            var submit_by_style_c = submit_by_style;
            var gps_style_c = gps_style;
            var create_date_style_c = create_date_style;
            var company_name_style_c = company_name_style;
            var archive_id_style_c = archive_id_style;
            var dateofbirth_style_c = dateofbirth_style;

            var fieldNameMap = '';
            var fieldNameDisplay = {
               first_name: 'First Name',
               middle_name: 'Middle Name',
               last_name: 'Last Name',
               primary_street_address1: 'Address 1',
               primary_street_address2: 'Address 2',
               primary_city: 'City',
               primary_state: 'State',
               primary_postal_code: 'Postal Code/Zipcode',
               primary_phone: 'Phone',
               primary_phone_type: 'Phone Type',
               primary_phone_ext: 'Phone Extension',
               primary_email: 'Email',
               primary_website: 'Website',
               contact_type: 'Contact Type',
               contact_inactive: 'Inactive',
               contact_notes: 'Notes',
               contact_tags: 'Tags',
               create_by: 'Create by',
               submit_by: 'Submit by',
               gps: 'GPS Coordinates',
               create_date: 'Create Date',
               company_name: 'Company',
               archive_id: 'Archive',
               dateofbirth: 'Day of Birth'

            }
            var class_map_deleted = 'map-deleted';
            switch (item) {
               case 'first_name':
                  first_name_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['first_name'];
                  class_map_deleted = '';
                  break;
               case 'middle_name':
                  middle_name_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['middle_name'];
                  class_map_deleted = '';
                  break;
               case 'last_name':
                  last_name_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['last_name'];
                  class_map_deleted = '';
                  break;
               case 'primary_street_address1':
                  primary_street_address1_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_street_address1'];
                  class_map_deleted = '';
                  break;
               case 'primary_street_address2':
                  primary_street_address2_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_street_address2'];
                  class_map_deleted = '';
                  break;
               case 'primary_city':
                  primary_city_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_city'];
                  class_map_deleted = '';
                  break;
               case 'primary_state':
                  primary_state_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_state'];
                  class_map_deleted = '';
                  break;
               case 'primary_postal_code':
                  primary_postal_code_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_postal_code'];
                  class_map_deleted = '';
                  break;
               case 'primary_phone':
                  primary_phone_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_phone'];
                  class_map_deleted = '';
                  break;
               case 'primary_phone_ext':
                  primary_phone_ext_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_phone_ext'];
                  class_map_deleted = '';
                  break;
               case 'primary_phone_type':
                  primary_phone_type_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_phone_type'];
                  class_map_deleted = '';
                  break;
               case 'primary_email':
                  primary_email_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_email'];
                  class_map_deleted = '';
                  break;
               case 'primary_website':
                  primary_website_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['primary_website'];
                  class_map_deleted = '';
                  break;
               case 'contact_type':
                  contact_type_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['contact_type'];
                  class_map_deleted = '';
                  break;
               case 'contact_inactive':
                  contact_inactive_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['contact_inactive'];
                  class_map_deleted = '';
                  break;
               case 'contact_notes':
                  contact_notes_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['contact_notes'];
                  class_map_deleted = '';
                  break;
               case 'contact_tags':
                  contact_tags_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['contact_tags'];
                  class_map_deleted = '';
                  break;
               case 'create_by':
                  create_by_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['create_by'];
                  class_map_deleted = '';
                  break;
               case 'submit_by':
                  submit_by_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['submit_by'];
                  class_map_deleted = '';
                  break;
               case 'gps':
                  gps_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['gps'];
                  class_map_deleted = '';
                  break;
               case 'create_date':
                  create_date_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['create_date'];
                  class_map_deleted = '';
                  break;
               case 'company_name':
                  company_name_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['company_name'];
                  class_map_deleted = '';
                  break;
               case 'archive_id':
                  archive_id_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['archive_id'];
                  class_map_deleted = '';
                  break;
               case 'dateofbirth':
                  dateofbirth_style_c = 'selected="selected"';
                  fieldNameMap = fieldNameDisplay['dateofbirth'];
                  class_map_deleted = '';
                  break;
               default:
               // code block
            }

            var fields = '<div class="header-set">' +
               '<strong class="header-name deleted">Will not be imported</strong> ' +
               '<strong class="header-name not-deleted">' + fieldNameMap + '</strong> ' +
               '<span class="field-type-label not-deleted">merge field</span>' +
               '<div class="actions-importmap not-deleted"> ' +
               '<a href="javascript:;" class="edit-importmap">Edit</a> • ' +
               '<a href="javascript:;" class="delete-importmap">Skip</a> </div>' +
               '<div class="actions-importmap-deleted deleted"> ' +
               '<a href="javascript:;" class="edit-importmap">Edit</a> ' +
               '</div>' +
               '</div>' +
               '<div class="header-form" style="display: none;">' +
               '<label class="column-name">Column name</label>' +
               '<label class="select">' +
               '<select class="filed_change">' +
               '<option value="">Make a Selection</option>' +
               '<option value="first_name" ' + first_name_style_c + '>' + fieldNameDisplay['first_name'] + '</option>' +
               '<option value="middle_name" ' + middle_name_style_c + '>' + fieldNameDisplay['middle_name'] + '</option>' +
               '<option value="last_name" ' + last_name_style_c + '>' + fieldNameDisplay['last_name'] + '</option>' +
               '<option value="primary_street_address1" ' + primary_street_address1_style_c + '>' + fieldNameDisplay['primary_street_address1'] + '</option>' +
               '<option value="primary_street_address2" ' + primary_street_address2_style_c + '>' + fieldNameDisplay['primary_street_address2'] + '</option>' +
               '<option value="primary_city" ' + primary_city_style_c + '>' + fieldNameDisplay['primary_city'] + '</option>' +
               '<option value="primary_state" ' + primary_state_style_c + '>' + fieldNameDisplay['primary_state'] + '</option>' +
               '<option value="primary_postal_code" ' + primary_postal_code_style_c + '>' + fieldNameDisplay['primary_postal_code'] + '</option>' +
               '<option value="primary_phone" ' + primary_phone_style_c + '>' + fieldNameDisplay['primary_phone'] + '</option>' +
               '<option value="primary_phone_ext" ' + primary_phone_ext_style_c + '>' + fieldNameDisplay['primary_phone_ext'] + '</option>' +
               '<option value="primary_phone_type" ' + primary_phone_type_style_c + '>' + fieldNameDisplay['primary_phone_type'] + '</option>' +
               '<option value="primary_email" ' + primary_email_style_c + '>' + fieldNameDisplay['primary_email'] + '</option>' +
               '<option value="primary_website" ' + primary_website_style_c + '>' + fieldNameDisplay['primary_website'] + '</option>' +
               '<option value="contact_type" ' + contact_type_style_c + '>' + fieldNameDisplay['contact_type'] + '</option>' +
               '<option value="contact_inactive" ' + contact_inactive_style_c + '>' + fieldNameDisplay['contact_inactive'] + '</option>' +
               '<option value="contact_notes" ' + contact_notes_style_c + '>' + fieldNameDisplay['contact_notes'] + '</option>' +
               '<option value="contact_tags" ' + contact_tags_style_c + '>' + fieldNameDisplay['contact_tags'] + '</option>' +
               '<option value="create_by" ' + create_by_style_c + '>' + fieldNameDisplay['create_by'] + '</option>' +
               '<option value="submit_by" ' + submit_by_style_c + '>' + fieldNameDisplay['submit_by'] + '</option>' +
               '<option value="gps" ' + gps_style_c + '>' + fieldNameDisplay['gps'] + '</option>' +
               '<option value="create_date" ' + create_date_style_c + '>' + fieldNameDisplay['create_date'] + '</option>' +
               '<option value="company_name" ' + company_name_style_c + '>' + fieldNameDisplay['company_name'] + '</option>' +
               '<option value="archive_id" ' + archive_id_style_c + '>' + fieldNameDisplay['archive_id'] + '</option>' +
               '<option value="dateofbirth" ' + dateofbirth_style_c + '>' + fieldNameDisplay['dateofbirth'] + '</option>' +
               '</select><i></i> </label>' +
               '<div class="form-actions-importmap">' +
               '<a href="javascript:;" class="next-importmap btn bg-color-blueDark txt-color-white btn-sm">&nbsp;&nbsp;Save &nbsp;>&nbsp;&nbsp; </a> ' +
               '<a href="javascript:;" class="delete-importmap">&nbsp;&nbsp;Skip&nbsp;&nbsp;</a> ' +
               '</div>' +
               '</div>'
            '</div>';

            ths += '<th class="header-cell ' + class_map_deleted + '">' + fields + '</th>';

            jj = jj + 1;

         });

         //------------end map fields
      }
      var table = '<table class="tbl-import-contact table-import-data" data-index="' + tabIndex + '"><thead>' +
         '<tr class="th-map">' + ths + '</tr>' +
         '<tr class="th-name">' + th + '</tr>' +
         '</thead>' +
         '<tbody>' + tr + '</tbody>' +
         '</table>';

      if (callback) callback(table, tabIndex);
      return table;
   },
   createDataImp: function (index) {
      var i = 0;
      // var contact_types = $('#import-contact-type').val();
      var head_arr = [];
      var data_pop = [];
      //get fields using import
      $('#import-contact-index-' + index + ' .tbl-import-contact[data-index="' + index + '"] th.header-cell').each(function () {
         var val = $(this).find('.filed_change option:selected').val();
         head_arr[i] = val;
         i++;
      });
      // map key=>val

      imp.import_arr[index].forEach(function (item) {
         var tem = {
            // contact_type : contact_types
         };
         var j = 0;
         item.forEach(function (el) {
            if (head_arr[j] != '') {
               tem[head_arr[j]] = el;
            }
            j++;
         });
         data_pop.push(tem);
      });
      var idx = data_pop.length - 1;
      imp.inProcess(true);
      while (idx >= 0) {
         idx -= window.import_records;
         imp.contactImport(data_pop.splice(idx < 0 ? 0 : idx, window.import_records), idx < 0);
      }
   },

   submitAll: function () {
      var data_pop = [];
      window.data_content.forEach(function (item, index) {
         var i = 0;
         // var contact_types = $('#import-contact-type').val();
         var head_arr = [];
         //get fields using import
         $('#import-contact-index-' + index + ' .tbl-import-contact[data-index="' + index + '"] th.header-cell').each(function () {
            var val = $(this).find('.filed_change option:selected').val();
            head_arr[i] = val;
            i++;
         });
         // map key=>val

         imp.import_arr[index].forEach(function (item) {
            var tem = {
               // contact_type : contact_types
            };
            var j = 0;
            item.forEach(function (el) {
               if (head_arr[j] != '') {
                  tem[head_arr[j]] = el;
               }
               j++;
            });
            data_pop.push(tem);
         });
         imp.inProcess(true);
      });
      var idx = data_pop.length - 1;
      while (idx >= 0) {
         idx -= window.import_records;
         imp.contactImport(data_pop.splice(idx < 0 ? 0 : idx, window.import_records), idx < 0);
      }
   },

   contactImport: function (data1, isComplete) {
      $.ajax({
         url: link._import_file_contactCSV,
         data: {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            contactFile: data1
         },
         type: 'POST',
         asyn: false,
         dataType: 'json',
         success: function (rsl) {

            var err_add = rsl.ERROR_ADD;
            var err_up = rsl.ERROR_UP;
            if (err_add.length > 0 || err_up.length > 0) {

               var table_add = '';
               var tr_add = '';
               var err_th = '<th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Error</th>';


               if (err_add.length > 0) {
                  err_add.forEach(function (item, index) {
                     tr_add += '<tr><td>' + index + '</td>' +
                        '<td>' + item.contact_name + '</td>' +
                        '<td>' + item.primary_email + '</td>' +
                        '<td>' + item.primary_phone + '</td>' +
                        '<td>' + item.err + '</td>' +
                        '</tr>'
                  });

                  table_add += '<table class="tbl-add-err table table-hover" style="width:100%"><thead>' + err_th + '</thead>' +
                     '<tbody>' + tr_add + '</tbody>' +
                     '</table>';
               }

               var table_up = '';
               var tr_up = '';

               if (err_up.length > 0) {
                  err_up.forEach(function (item) {
                     tr_up += '<tr><td>' + item.id + '</td>' +
                        '<td>' + item.contact_name + '</td>' +
                        '<td>' + item.primary_email + '</td>' +
                        '<td>' + item.primary_phone + '</td>' +
                        '<td>' + item.err + '</td>' +
                        '</tr>'
                  });

                  table_up += '<table class="tbl-add-err table table-hover" style="width:100%"><thead>' + err_th + '</thead>' +
                     '<tbody>' + tr_up + '</tbody>' +
                     '</table>'
               }

               $('#import_contact_form #process-contact').hide()

               $('#import_contact_form #contact-import-errs-add').html(table_add);
               $('#import_contact_form #contact-import-errs-up').html(table_up);

               $('#import_contact_form .contact-errs').show();
               messageForm('The errors occured!', false);
               if (isComplete) {
                  imp.inProcess(false);
               }
            } else {
               $('#message_form').hide();
               if (isComplete) {
                  imp.inProcess(false);
                  messageForm('The contacts are imported', true);
               }
            }


         },
         error: function (e) {
            messageForm('An error occured! ' + e.responseText, false);
            if (isComplete) imp.inProcess(false);
         }
      });
   }


   /////
}
var imp = new ImportContact();
$(function () {
   loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js', function () {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js', function () {
         imp.init();
      });
   })
});