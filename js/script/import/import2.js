function ImportData(option) {
   this.option = option;
}
ImportData.prototype = {
   constructor: ImportData,
   /**
    * 
    * @param {String} formName : Form name consist of: Product, Contact, 
    */
   getFormField: function (formName) {
      if (!formName) return [];
      var _form = formName.toLowerCase();
      switch (_form) {
         case 'product':
            return [
               { id: 'SKU', text: 'SKU', type: 'text', nearly: ['sku'] },
               { id: 'prod_name', text: 'Product Name', type: 'text', nearly: ['name', 'label'] },
               { id: 'prod_desc', text: 'Description', type: 'text', nearly: ['desc', 'description'] },
               { id: 'prod_desc_short', text: 'Short Description', type: 'text', nearly: ['desc', 'description'] },
               { id: 'prod_type', text: 'Type', type: 'text', in_array: ['Digital', 'Physical'] },
               { id: 'prod_class', text: 'Class', type: 'text', in_array: ['A La Carte', 'Discount', 'Marketing', 'Warranty'] },
               { id: 'prod_cost', text: 'Cost', type: 'double', nearly: ['cost'] },
               { id: 'prod_price', text: 'Price', type: 'double', nearly: ['price'] },
               { id: 'product_taxable', text: 'Taxable', type: 'boolean', nearly: ['taxable'] },
               { id: 'prod_weight', text: 'Weight', type: 'double', nearly: ['weight'] },
               { id: 'prod_length', text: 'Length', type: 'double', nearly: ['length'] },
               { id: 'prod_width', text: 'Width', type: 'double', nearly: ['width'] },
               { id: 'prod_height', text: 'Height', type: 'double', nearly: ['height', 'high'] },
               { id: 'product_tags', text: 'Tags', type: 'text', nearly: ['tag', '#', '@'] },
               { id: 'product_notes', text: 'Notes', type: 'text', nearly: ['note', 'notice'] },
               { id: 'prod_visible', text: 'Visible', type: 'boolean', nearly: ['visible'] },
               { id: 'prod_inactive', text: 'Inactive', type: 'boolean', nearly: ['inactive'] },
               { id: 'product_added', text: 'Propduct Added', type: 'number' },
               { id: 'product_updated', text: 'Product Updated', type: 'number' },
               { id: 'product_updated_by', text: 'Update By', type: 'number' },
               { id: 'prod_photo', text: 'Photo', type: 'url', nearly: ['photo', 'image', 'picture', 'figure'] },
               { id: 'prod_internal_visible', text: 'Internal Visible', type: 'boolean', nearly: ['visible'] }
            ];
         case 'contact':
            return [
               { id: 'first_name', text: 'First Name', type: 'text', nearly: ['name', 'first'] },
               { id: 'middle_name', text: 'Middle Name', type: 'text', nearly: ['name', 'middle'] },
               { id: 'last_name', text: 'Last Name', type: 'text', nearly: ['name', 'last'] },
               { id: 'primary_street_address1', text: 'Address 1', type: 'text', nearly: ['address', 'add'] },
               { id: 'primary_street_address2', text: 'Address 2', type: 'text', nearly: ['address', 'street'] },
               { id: 'primary_city', text: 'City', type: 'text', nearly: ['city'] },
               { id: 'primary_state', text: 'State', type: 'text', nearly: ['state'] },
               { id: 'primary_postal_code', text: 'Postal Code', type: 'number', nearly: ['zipcode', 'postal', 'code'] },
               { id: 'primary_phone', text: 'Phone', type: 'tel', nearly: ['phone'] },
               { id: 'primary_phone_ext', text: 'Phone Extension', type: 'text', nearly: ['phone', 'ex'] },
               { id: 'primary_phone_type', text: 'Phone Type', type: 'text', nearly: ['phone', 'type'] },
               { id: 'primary_email', text: 'Email', type: 'email', nearly: ['mail', 'email'] },
               { id: 'primary_website', text: 'Website', type: 'url', nearly: ['website', 'link', 'www'] },
               { id: 'contact_type', text: 'Contact Type', type: 'text', nearly: ['type'], in_array: ['SystemAdmin', 'Admin', 'Employee', 'Affiliate', 'Vendor', 'PolicyHolder', 'Policy Holder', 'Sales', 'Customer'] },
               { id: 'contact_inactive', text: 'Inactive', type: 'boolean', nearly: ['inactive'] },
               { id: 'contact_notes', text: 'Notes', type: 'text', nearly: ['note', 'notice'] },
               { id: 'contact_tags', text: 'Tags', type: 'text', nearly: ['tag'] },
               { id: 'create_by', text: 'Create By', type: 'number', nearly: ['create'] },
               { id: 'submit_by', text: 'Submit By', type: 'text', nearly: ['submit'] },
               { id: 'gps', text: 'GPS Coordinates', type: 'gps', nearly: ['location', 'gps'] },
               { id: 'create_date', text: 'Create Date', type: 'date', nearly: ['create', 'date'] },
               { id: 'company_name', text: 'Company', type: 'number', nearly: ['company'] },
               { id: 'archive_id', text: 'Archive', type: 'number', nearly: ['archive'] },
               { id: 'dateofbirth', text: 'Day of Birth', type: 'date', nearly: ['birth', 'dob'] }
            ];
         case 'company':
            return [
               { id: 'name', text: 'Name', type: 'text', nearly: ['name'] },
               { id: 'address1', text: 'Address 1', type: 'text', nearly: ['address'] },
               { id: 'address2', text: 'Adddress 2', type: 'text', nearly: ['address'] },
               { id: 'city', text: 'City', type: 'text', nearly: ['city'] },
               { id: 'state', text: 'State', type: 'text', nearly: 'state' },
               { id: 'postal_code', text: 'Postal Code/Zipcode', type: 'number' },
               { id: 'phone', text: 'Phone', type: 'tel', nearly: ['phone', 'tel'] },
               { id: 'fax', text: 'Fax', type: 'text', nearly: ['fax'] },
               { id: 'email', text: 'Email', type: 'email', nearly: ['email', 'mail'] },
               { id: 'www', text: 'Website', type: 'url', nearly: ['www', 'website', 'http', '://'] },
               { id: 'type', text: 'Company Type', type: 'text', nearly: ['type'] },
               { id: 'tag', text: 'Tags', type: 'text', nearly: ['tag'] },
            ];
         default: return [];
      }
   },

   loadFile: function (file) {
      var file_type = file.name.split('.').pop();
      var reader = new FileReader();
      reader.onloadend = function () {
         imp.inProcess(false);
      }
      if (['xlsx', 'xls'].includes(file_type)) {
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
         reader.readAsBinaryString(file);
      } else {
         reader.onload = function (event) {
            var csv = event.target.result;
            var data = $.csv.toArrays(csv);
            imp.loadTab(data, 0, file.name);
         }
         reader.readAsText(file);
      }
   },

   evaluation: function (text, nearly, in_array) {
      if (in_array) {
         if (in_array.includes(text)) return 10000;
         else return 0;
      } else {
         var result = 0;
         nearly.forEach(function (item) {
            if (text.toLowerCase().includes(item)) result += 1;
         });
         return result;
      }
   },

   loadTabData: function (data, index, fileName, callback) {
      var form = $('#formName').val();
      var formField = ImportData.prototype.getFormField(form);
      var _import = { style: {}, flag = {} };
      var tbody = '';
      var thead = '';
      var listSelected = [];
      formField.forEach(function (field, indexItem) {
         _import.style[field.id] = '';
         _import.flag[field.id] = false;
      });

      for (var item = 0; item < data[0].length; item++) {
         thead += '<th>' + data[0][item] + '</th>';
      }

      for (var item = 0; item < data[1].length; item++) {
         listSelected[item] = '';
         var typeData1 = {
            text: ImportData.prototype.isString(data[1][item]),
            number: ImportData.prototype.isInteger(data[1][item]),
            double: ImportData.prototype.isDouble(data[1][item]),
            date: ImportData.prototype.isDate(data[1][item]),
            email: ImportData.prototype.isEmail(data[1][item]),
            tel: ImportData.prototype.isPhoneNumber(data[1][item]),
            gps: ImportData.prototype.isGPS(data[1][item]),
            url: ImportData.prototype.isLink(data[1][item]),
            boolean: ImportData.prototype.isBoolean(data[1][item])
         }
         var maxIndex = -1;
         var nearlyData = {};
         var mayBeTrue = [];
         formField.forEach(function (field, indexItem) {
            if(!_import.flag[field.id]){
               var max = Number.MIN_VALUE;
               if (typeData1[field.type]) {
                  var evalData = ImportData.prototype.evaluation(data[1][item], field.nearly, field.in_array);
                  if (evalData > max && evalData > 0) {
                     max = evalData;
                     maxIndex = indexItem;
                     nearlyData[field.id] = evalData;
                     mayBeTrue.push({item : field, eval : evalData});
                  }
               }
            }
         });
         if(mayBeTrue.length>0){
            mayBeTrue.sort(function(a, b){ return a.eval > b.eval});
            listSelected[item] = mayBeTrue[0].item.id;
            _import.style[mayBeTrue[0].item.id] = 'style="display:none"';
            _import.flag[mayBeTrue[0].item.id] = true
         }
      }

      for (var row = 1; row < data.length; row++) {
         tbody += '<tr>'
         for (var item = 0; item < data[row].length; item++) {
            tbody += '<td>' + data[row][item] + '</td>';
         }
         tbody += '</tr>';
         window.import_array[index].push(data[row]);
      }
   },


   /**
    * 
    * @param {String} st 
    */
   isInteger: function (st) {
      return Number.isInteger(st);
   },
   isDouble: function (st) {
      return !Number.isNaN(st) && parseFloat(st) % 1 > 0;
   },

   isBoolean: function (st) {
      return st === true || st === 'true' || st === false || st === 'false' || st === 1 || st === '1' || st === 0 || st === '0';
   },

   isLink: function (st) {
      return (st.startWiths('http://') || st.startWiths('https://') || st.startWiths('www')) && st.includes('.');
   },

   isString: function (st) {
      return Number.isNaN(st) && typeof st == 'string';
   },

   /**
    * 
    * @param {String} st
    * @return : st is an email
    */
   isEmail: function (st) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(st).toLowerCase());
   },
   /**
    * 
    * @param {String} st 
    * @return : st is a phone number
    */
   isPhoneNumber: function (st) {
      var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return regex.test(st);
   },
   /**
    * 
    * @param {String} st 
    * @return : st is a valid date
    */
   isDate: function (st) {
      return (new Date(st) !== "Invalid Date") && !isNaN(new Date(st));
   },
   /**
    * 
    * @param {String} st
    * @return: st is a valid GPS coordinates
    */
   isGPS: function (st) {
      var ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
      var ck_lon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
      if (this.isJSON(st)) {
         var ob = JSON.parse(st);
         if (ob.lat && (ob.lng || ob.lon)) {
            return ck_lat.test(ob.lat) && (ck_lon.test(ob.lon) || ck_lon.test(ob.lng));
         } else {
            return false
         }
      } else {
         return false;
      }
   },
   isJSON: function (st) {
      try {
         JSON.parse(st);
      } catch (e) {
         return false;
      }
      return true;
   }
}

$(function () {
   loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js', function () {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js', ImportData);
   })
});