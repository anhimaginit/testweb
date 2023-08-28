function Tab() { }
var tb_note, tb_order, tb_claim, tb_warranty, tb_document;
Tab.prototype = {
   constructor: Tab,
   table_id: {
      text: '#table_text_list',
      order: '#table_order_list',
      claim: '#table_claim_list',
      warranty: '#table_warranty_list',
   },
   init: function () {
      this.loadTexts();
      this.loadClaims();
      this.loadOrders();
      this.loadWarranties();
      this.bindEvent();
   },
   loadData: function (url, data, id, _link, options) {
      $.ajax({
         url: url,
         type: 'post',
         data: data,
         dataType: 'json',
         success: function (res) {
            var list = res.list;
            $(id).DataTable({
               sDom: "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               data: list,
               columns: options.columns,
               createdRow: function (row, data, dataIndex) {
                  $(row).attr('title', 'Click to go to ' + _link.split('/').pop() + ' with id is ' + data[options.id]);
                  $(row).click(function () {
                     window.open(_link + '?id=' + data[options.id], '_blank');
                  });
               }
            });
            $('.dataTables_empty').attr('colspan', options.columns.length);
         },
         error: function (e) {
            console.log(e);
         }
      });
   },

   loadTexts: function () {
      var id = this.table_id.text;
      var myData = $.extend({}, template_data);
      //myData.phone = $('#phone_number').val();
      var url = window.location.href; // or window.location.href for current url
      var capturedID = /id=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
   //   alert(captured);
      myData.contactID = capturedID;

      //alert("this is from loading text"+ myData.contactID);

      $.ajax({
         url: link._sms_get_text,
         type: 'post',
         data: myData,
         dataType: 'json',
         success: function (res) {
            var list = res.list;
            $('#table_text_list').DataTable({
               sDom: "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               data: list || [],
               columns: [
                  { data: 'timestamp', title: 'Date' },
                  //    { data: function (data) { if (data.msg_to) { return data.body + " - " + data.msg_to } }, title: 'Title' },
                  { data: 'msg_from', title: 'From' },
                  { data: 'msg_to', title: 'To' },
                  { data: 'body', title: 'Outbound Message' },
                  { data: 'original_body', title: 'Inbound Message' },
                  { data: 'status', title: 'Delivered' }
               ],
               // createdRow: function (row, data, dataIndex) {
                  /* $(row).attr('title', 'Click to go to ' + _link.split('/').pop() + ' with id is ' + data[ID]);
                   $(row).click(function () {
                   window.open(_link + '?id=' + data[options.id], '_blank');
                   });*/
               // },
               initComplete: function () {
                  $('#table_text_list .dataTables_empty').attr('colspan', 6);
               }
            });
         },
         error: function (e) {
         }
      });

   },
   loadOrders: function () {
      var id = this.table_id.order;
      var myData = $.extend({}, template_data);
      myData.contactID = getUrlParameter('id');
      this.loadData(link._order_contact, myData, id, './#ajax/order-form.php', {
         columns: [
            { data: function (data) { if (data.order_title) { return data.order_title } else { return 'Warranty Order - ' + data.order_id } }, title: 'Title' },
            { data: 'b_name', title: 'Bill to' },
            { data: function (data) { return numeral(data.total).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Total' },
            { data: function (data) { return numeral(data.payment).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Payment' },
            { data: function (data) { return numeral(data.balance).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Balance' },
         ], id: 'order_id'
      })

   },
   loadClaims: function () {
      var id = this.table_id.claim;
      var myData = $.extend({}, template_data);
      myData.contactID = getUrlParameter('id');
      myData.claimIDs = JSON.parse(localStorage.getItemValue('claimIDs'));
      this.loadData(link._claims_contact, myData, id, './#ajax/claim-form.php', {
         /*columns: [
            { data: function (data) { return data.ID || '' }, title: 'ID' },
            { data: function (data) { return data.contact_name || '' }, "searchable": true, title: 'Customer' },
            { data: function (data) { return data.create_by_name || '' }, title: 'Create By' },
            { data: function (data) { return data.status || '' }, "searchable": true, title: 'Status' },
            { data: function (data) { return data.warranty_ID || '' }, title: 'Warranty' },
            // { data: function(data){return data.contact_name ||''}, "searchable": true, title: 'Transaction' },
            { data: function (data) { return data.start_date || '' }, "searchable": true, title: 'Start Date' },
         ]*/
              columns: [
                  { data: 'ID', "searchable": true, title: 'ID' },
                  { data: 'create_by_name', searchable: true, title: 'Created By', class: 'hidden' },
                  { data: 'contact_name', "searchable": true, title: 'Customer' },
                  { data: 'note', "searchable": true, title: 'Description' },
                  { data: function (data) { return data.claim_asg_name || '' }, searchable: true, title: 'Assigned To' },
                  { data: function(data){return data.status ? data.status : '&nbsp;'}, "searchable": true, title: 'Status' },
                  {
                      data: function (data) {
                          if (data.service_fee && data.service_fee.products_ordered && data.service_fee.products_ordered.length > 0) {
                              let total_service_fee = 0;
                              data.service_fee.products_ordered.forEach(function (item) {
                                  total_service_fee += parseFloat(item.price);
                              });
                              return numeral(total_service_fee).format('$ 0,0.00');
                          } else {
                              return '$ 0';
                          }
                      }, className: 'text-right', title: 'Service Fee'
                  },
                  { data: function (data) { return (data.paid == '' || data.paid == 'false' || data.paid == false || !data.paid) ? '' : 'Paid' }, "searchable": true, title: 'Paid Out' },
                  { data: 'start_date', "searchable": true, title: 'Start Date' },
              ]
         , id: 'ID'
      });
   },
   loadWarranties: function () {
      var id = this.table_id.warranty;
      var myData = $.extend({}, template_data);
      myData.contactID = getUrlParameter('id');

      this.loadData(link._warranty_contact, myData, id, './#ajax/warranty-form.php', {
         columns: [
            // { data: 'ID', title: '#&nbsp;ID', searchable: true },
            { data: 'warranty_order_id', title: 'Order' },
            { data: 'buyer', "searchable": true, title: 'Buyer' },
            { data: 'warranty_address1', "searchable": true, title: 'Address' },
            {
               data: function (data) {
                  var _text = [];
                  data.warranty_type.forEach(function (item) {
                     _text.push(item.prod_name);;
                  })
                  return _text.join(', ');
               }, title: 'Type'
            },
            { data: 'salesman', "searchable": true, title: 'Salesman' },
            { data: 'warranty_start_date', "searchable": true, title: 'Start Date' },
            // { data: 'warranty_end_date', "searchable": true, title: 'End Date' },
         ], id: 'ID'
      });
   },
   bindEvent: function () {
      $(document).on('click', '.contact-tab .nav-tabs li', function () {
         var tab = $('.contact-tab ul.nav-tabs li.active').data('tab');
         if (tab) {
            $('#txtControlTabAdd').text('Add ' + $('.contact-tab ul.nav-tabs li.active').data('content'));
            $('#btnControlTabAdd').parent().show();
         } else {
            $('#btnControlTabAdd').parent().hide();
         }
      }).on('click', '.contact-tab #btnControlTabAdd', function () {
         Tab.prototype.forwardPage();
      });
   },
   forwardPage: function () {
      var tab = $('.contact-tab ul.nav-tabs li.active').data('tab');
      if (tab) {
         var id = $('#contact_form [name=ID]').val();
         var name = $('#contact_form [name=first_name]').val() + ' ' + $('#contact_form [name=last_name]').val();
         var repre = $('#contact_form [name=contact_salesman_id]').val();
         // var repre_name = $('#contact_form [name=contact_salesman_id] option:selected').text();
         window.location.href = host2 + '#ajax/' + tab + '.php?contactid=' + id + '&contactname=' + name + '&repre=' + repre;
      } else {

      }
   }
}

var tabs = new Tab();
tabs.init();