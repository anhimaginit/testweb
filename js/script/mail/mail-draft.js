function MailDraft() {
   window.linkForTable = '';
   window.mailTable = '';
}

MailDraft.prototype.constructor = MailDraft;

MailDraft.prototype.loadEmailDraft = function (pageNo, pageLength) {
   if (window.currentPage <= 0) window.currentPage = 1;
   if (window.currentPageLength <= 0) window.currentPageLength = 25;
   window.linkForTable = link._emails_draft;
   window.mailTable = '#mailDraft';
   if (!pageNo) pageNo = window.currentPage;
   if (!pageLength) pageLength = window.currentPageLength;
   var _data = {
      token: localStorage.getItemValue('token'),
      jwt: localStorage.getItemValue('jwt'),
      private_key: localStorage.getItemValue('userID'),
      pageno: pageNo,
      pageLength: pageLength,
      contactID: localStorage.getItemValue('userID')
   }
   window.currentPage = pageNo;
   window.currentPageLength = pageLength;
   $.ajax({
      url: window.linkForTable,
      type: 'post',
      dataType: 'json',
      data: _data,
      success: function (res) {
         MailDraft.prototype.displayMail(res.list, {
            element: '#mailDraft', columns: [
               { data: function (data) { return '<label class="checkbox"><input type="checkbox" class="mail-checkbox" value="' + data.id + '"><i></i></label>' }, className: 'inbox-small-cells' },
               { data: function (data) { return '<i class="fa fa-2x fa-star mail-star ' + (data.star == 1 ? 'inbox-star' : '') + '"></i>' }, className: 'inbox-small-cells' },
               { data: function (data) { return 'Draft'; }, className: 'view-message dont-show text-danger inbox-small-cells' },
               { data: function (data) { return '<a href="#ajax/mail-compose.php?id=' + data.id + '">' + (data.subject && data.subject != '' ? data.subject.substring(0, 30) : '(no subject)') + '</a>'; }, className: 'view-message dont-show text-left' },
               { data: function (data) { return '<a href="#ajax/mail-compose.php?id=' + data.id + '">' + data.description.substring(0, 50) + '</a>' }, className: 'view-message text-left' },
               { data: function(data){ return getDateTime(new Date(data.datetime + ' UTC'))}, className: 'view-message text-right' }
            ]
         });
         if (res.total > window.currentPageLength) {

         }
      },
      error: function (e) {

      }
   });
}

MailDraft.prototype.displayMail = function (list, option) {
   window.myDataTable = $(option.element).DataTable({
      destroy: true,
      data: list,
      filter: false,
      search: false,
      paging: false,
      pageLength: window.currentPageLength,
      bInfo: false,
      fnDrawCallback: function (oSettings) {
         $(oSettings.nTHead).hide();
      },
      columns: option.columns,
      createdRow: function (row, data, dataIndex) {
         $(row).attr('data-idmail', data.id);
      }
   });
   $('#lbl-current-page').text(window.currentPage);

}