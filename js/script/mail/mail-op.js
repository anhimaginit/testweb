function MailOp() {
   window.currentPage = 1;
   window.currentPageLength = 25;
   window.linkForTable = '';
   window.mailTable = '';
   delete window.myDataTable;
}

MailOp.prototype = {
   constructor: MailOp,

   bindEvent: function () {
      $(document).unbind('click', '.mail-star, .markAsRead, .markAsUnread, #np-btn-angle-left, #np-btn-angle-right, .btnBackContent, #content table.table-inbox tbody tr td:nth-child(n+3)');
      $('.check-all-mail').click(function () {
         MailOp.prototype.checkAll('#' + $(this).closest('.mail-box').find('table').attr('id'), $(this).prop('checked'));
      });
      $('.btnRemoveMail').click(function () {
         MailOp.prototype.deleteMail('#' + $(this).closest('.mail-box').find('table').attr('id'), $(this).prop('checked'));
      });

      $('.btnRefreshMail').click(function () {
         if (document.location.href.includes('draft')) {
            MailDraft.prototype.loadEmailDraft();
         } else {
            MailOp.prototype.loadListMail(window.linkForTable, window.mailTable);
         }
      })

      $(document).on('click', '.btnBackContent', function () {
         $('.mail-box').show();
         $('.mail-detail').remove();
      });
      $(document).on('click', '#content table.table-inbox tbody tr td:nth-child(n+3)', function () {
         if (!document.location.href.includes('draft')) {
            let indexData = window.myDataTable.cell(this, 0).index().row;
            MailOp.prototype.mailContent(indexData);
         } else {
            window.location.href = "./#ajax/mail-compose.php?id=" + $(this).closest('tr').data('idmail');
         }
      });
      $(document).on('click', '.mail-star', function () {
         MailOp.prototype.checkMailStar(this);
      }).on('click', '.markAsRead', function () {
         MailOp.prototype.checkAllRead(1);
      }).on('click', '.markAsUnread', function () {
         MailOp.prototype.checkAllRead(0);
      }).on('click', '#np-btn-angle-left', function () {
         if (document.location.href.includes('draft')) {
            MailDraft.prototype.loadEmailDraft(window.currentPage - 1, window.currentPageLength);
         } else {
            MailOp.prototype.loadListMail(window.linkForTable, window.mailTable, null, window.currentPage - 1, window.currentPageLength);
         }
      }).on('click', '#np-btn-angle-right', function () {
         if (document.location.href.includes('draft')) {
            MailDraft.prototype.loadEmailDraft(window.currentPage + 1, window.currentPageLength);
         } else {
            MailOp.prototype.loadListMail(window.linkForTable, window.mailTable, null, window.currentPage + 1, window.currentPageLength);
         }
      });
   },

   checkAll: function (table, checked) {
      $(table).find('tbody input.mail-checkbox').prop('checked', checked);
   },

   setLink: function (linkSet) {
      window.linkForTable = linkSet;
   },

   getRead: function (isRead) {
      var data = window.myDataTable.rows().data();
      var result = [];
      for (var i = 0; i < data.length; i++) {
         if (data[i].checked == isRead) {
            result.push(data[i]);
         }
      }
      return result;
   },

   checkAllRead: function (read) {
      var data = window.myDataTable.rows().data();
      for (var i = 0; i < data.length; i++) {
         if (data[i].checked == Math.abs(read - 1) && $(window.mailTable + ' tbody tr:eq(' + i + ') .mail-checkbox').prop('checked') == true) {
            data[i].checked = Math.abs(read);
            var myTMP = data[i];
            var receiver = JSON.parse(data[i].receiverID);
            var check = [];
            receiver.forEach(function (u) {
               check.push({ receiverID: u, checked: (u == localStorage.getItemValue('userID') ? read : data[i].checked) });
            });
            myTMP.checked = JSON.stringify(check);
            if (i == data.length - 1) {
               MailOp.prototype.updateMail(myTMP, function () {
                  MailOp.prototype.loadListMail(window.linkForTable, window.mailTable);
               });
            } else {
               MailOp.prototype.updateMail(myTMP);
            }
         }
      }
   },

   deleteMail: function (table) {
      var ids = [];
      var indexs = [];
      $(table + ' tbody input.mail-checkbox:checked').each(function () {
         ids.push(this.value);
         indexs.push($(this).closest('tr').index());
      });
      $.ajax({
         url: link._emails_deleted,
         type: 'post',
         dataType: 'json',
         data: {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            mailIDs: ids.join(',')
         },
         success: function (res) {
            if (res.ERROR == '' && res.deleted > 0) {
               MailOp.prototype.loadListMail(window.linkForTable, table);
            }
         },
         error: function (e) {
            messageForm('Something wrong', false);
         }
      })
   },

   loadListMail: function (linkURL, table, itemShow, pageNo, pageLength) {
      if (window.currentPage <= 0) window.currentPage = 1;
      if (window.currentPageLength <= 0) window.currentPageLength = 25;
      MailOp.prototype.setLink(linkURL);
      if (!linkURL || !table) return;
      if (!pageNo) pageNo = window.currentPage;
      if (!pageLength) pageLength = window.currentPageLength;
      var _data = {
         token: localStorage.getItemValue('token'),
         jwt: localStorage.getItemValue('jwt'),
         private_key: localStorage.getItemValue('userID'),
         pageno: pageNo,
         pageLength: pageLength,
         contactID: localStorage.getItemValue('userID')
      };
      window.currentPage = pageNo;
      window.currentPageLength = pageLength;
      $.ajax({
         url: linkURL,
         type: 'post',
         dataType: 'json',
         data: _data,
         success: function (res) {
            var option = {
               pageNo: pageNo,
               pageLength: pageLength,
               itemShow: itemShow
            }
            MailOp.prototype.displayListMail(res.list, table, option);
         },
         error: function (e) {

         }
      })
   },

   displayListMail: function (list, table, option) {
      let that = this;
      window.mailTable = table;
      window.myDataTable = $(table).DataTable({
         destroy: true,
         data: list,
         filter: false,
         search: false,
         paging: false,
         pageLength: option && option.pageLength ? option.pageLength : window.currentPageLength,
         bInfo: false,
         fnDrawCallback: function (oSettings) {
            $(oSettings.nTHead).hide();
         },
         order: [[5, 'desc']],
         columns: [
            { data: function (data) { return '<label class="checkbox"><input type="checkbox" class="mail-checkbox" value="' + data.id + '"><i></i></label>' }, className: 'inbox-small-cells' },
            { data: function (data) { return '<i class="fa fa-2x fa-star mail-star' + (data.star == 1 ? ' inbox-star' : '') + '"></i>' }, className: 'inbox-small-cells' },
            { data: function (data) { if (data.sender_name) { return data.sender_name } else { return '' } }, className: 'view-message dont-show text-left' },
            { data: function (data) { return (data.subject && data.subject != '' ? data.subject.substring(0, 30) : '(No subject)'); }, className: 'view-message  dont-show' },
            { data: function (data) { return data.description.substring(0, 50) }, className: 'view-message' },
            { data: function (data) { return getDateTime(new Date(data.datetime + ' UTC+0')) }, className: 'view-message text-right' }
         ],
         createdRow: function (row, data, dataIndex) {
            if ((data.checked == 0 || data.checked == '0') && data.draft != 0) {
               $(row).addClass('unread');
            }
            $(row).attr('data-idmail', data.id);
         },
         initComplete: function () {
            if (option.itemShow) {
               that.mailContent($(table).find('tbody tr[data-idmail="' + option.itemShow + '"]').index());
            }
         }
      });
      $('#lbl-current-page').text(window.currentPage);
   },

   mailContent: function (row) {
      _myData = $(window.mailTable).DataTable().row(row).data();
      $.ajax({
         url: link._emails_open,
         type: 'post',
         dataType: 'json',
         data: {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            mailID: _myData.id,
            receiverID: _myData.receiverID,
            inbox: 1
         },
         success: function (res) {
            var data = res.mail;
            var receiver = [];
            if (data.receiver_detail && data.receiver_detail.length > 0) {
               data.receiver_detail.forEach(function (u) {
                  receiver.push('<a href="./#ajax/contact-form.php?id=' + u.ID + '" class="pointer text-dark" title="' + u.primary_email + '">' + u.receiver_name + '</a>');
               });
            }

            var makeTimeAgo = function (time) {
               time = time / 1000;
               if (time < 60) {
                  return '(a minute ago)';
               } else if (time < 3600) {
                  return '(' + parseInt(time / 60) + ' minutes ago)';
               } else if (time < 7200) {
                  return '(a hour ago)';
               } else if (time < 86400) {
                  return '(' + parseInt(time / 3600) + ' hours ago)';
               } else if (time / 86400 * 2) {
                  return '(a day ago)';
               } else if (time / 86400 * 20) {
                  return '(' + parseInt(time / 86400) + ' days ago)';
               } else return '';
            }
            var result =
               '<div class="mail-detail bg-white padding-10">' +
               '<div class="padding-10"><button type="button" class="btn btn-default btn-sm btnBackContent"><i class="fa fa-arrow-left"></i></button></div>' +
               '<div class="clearfix"></div>' +
               '<div class="mail-content">' +
               '<fieldset>' +
               '<legend class="mail-subject">' + data.subject + '<span class="pull-right"><i class="fa fa-2x fa-star padding-10' + (data.star == 1 ? ' inbox-star' : '') + '"></i>';
            result += '' + new Date(data.datetime + ' UTC+0').toDateString() + ' ' + makeTimeAgo(new Date(new Date().getTime() - new Date(data.datetime +' UTC+0').getTime())) + '</span>' + '</legend>';
            result += '</fieldset>' +
               '<section>' +
               '<h4 class="bold mail-sender">' + data.sender_name + '</h4>' +
               '<p class="text-dark mail-receiver"> to ' + receiver.join(', ') + '</p>' +
               '</section>' +
               '<section>' +
               '<div class="mail-description">' + data.description + '</div>' +
               '</section>' +
               '</div>' +
               '</div>';

            $('.mail-box').hide();
            $('#content .mail-detail').remove();
            $('#content>div').append(result);
         },
         error: function (e) {

         }
      })

   },

   updateMail: function (data, callback) {
      data.token = localStorage.getItemValue('token');
      data.jwt = localStorage.getItemValue('jwt');
      data.private_key = localStorage.getItemValue('userID');
      $.ajax({
         url: link._emailComposer,
         type: 'post',
         data: data,
         dataType: 'json',
         success: function (res) {
            if (callback) callback(res);
         },
         error: function (e) {

         }
      })
   },

   checkMailStar: function (elem) {
      var table = '#' + $(elem).closest('.mail-box').find('table').attr('id');
      var index = $(elem).closest('tr').index();
      var tTable = $(table).DataTable();
      var data = tTable.rows(index).data()[0];
      if (data.star == '1') {
         $(elem).removeClass('inbox-star');
         data.star = '0';
      } else {
         $(elem).addClass('inbox-star');
         data.star = '1';
      }

      MailOp.prototype.updateMail(data, function () {
         tTable.row(index).data(data).draw();
      });

   },
}