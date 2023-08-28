function AdminState() { }

AdminState.prototype = {
   constructor: AdminState,
   init: function () {
      this.setView();
      this.setViewTable();
      this.bindEvent();
      window.inserted_ = [];
      window.inserted_state = [];
      window.inserted_city = [];
      window.inserted_postal_code = [];
   },
   bindEvent: function () {
      $('[rel=tooltip]').tooltip();
      let _self = this;
      $('.btnSearch').on('click', function (e) {
         var _data = $.extend({
            city: document.querySelector('.filter_pane [name="city"]').value,
            state: document.querySelector('.filter_pane [name="state"]').value,
            zip: document.querySelector('.filter_pane [name="postal_code"]').value
         }, template_data);
         if ((_data.city == '' || !_data.city) && (_data.state == '' || !_data.state) && (_data.zip == '' || !_data.zip)) {
            _self.clearSearchTable();
         } else {
            $.ajax({
               url: link._stateCityStateZip,
               type: 'post',
               dataType: 'json',
               data: _data,
               success: function (data) {
                  _self.displaySearchTable(data);
               }
            })
         }
      });

      $('.btn-clear-select').click(function () {
         let _select = $(this).data('select');
         $('[name="' + _select + '"]').val(null).trigger('change');
      });

      $('.btnAddRecord').click(function () {
         _self.createInsertRow();
      });

      $('#checkAllState').on('change', function () {
         let status = $(this).prop('checked');
         $('#state_new_list tbody tr td:eq(0) input:checkbox').prop('checked', status);
      });
      $(document).unbind('click', '.btnRemoveRow').on('click', '.btnRemoveRow', function () {

         /**
          * remove state (before insert into db)
          */
         _self.removeInsertRow(this);
      }).unbind('click', '.btnPushRow').on('click', '.btnPushRow', function () {
         /**
          * insert new row to make state
         */
         _self.pushOne(this);
      }).unbind('click', '#state_new_list tbody td').on('click', '#state_new_list tbody td', function () {
         /**
          * make input to edit cell
          */
         let $this = $(this);
         if ($this.children().length == 0) {
            let text = $this.text();
            $this.html(`<input type="text" class="form-control" value="${text}" placeholder="${$this.attr('class').split(' ').shift().upperCaseFirst()}">`);
            $this.addClass('hasinput');
            $this.find('input').val(text).focus();
         }
      }).unbind('focusout', '#state_new_list tbody td input').on('focusout', '#state_new_list tbody td input', function () {
         /**
          * complete edit cell
          */
         let text = this.value;
         $(this).parent().removeClass('hasinput');
         $(this).replaceWith(text);
      }).unbind('keyup change', '#state_new_list tbody td.code input').on('keyup change', '#state_new_list tbody td.code input', function () {
         let text = this.value;
         let _select = $(`[name=state] option[value="${text.toUpperCase()}"]`);
         let parent = $(this).parent();
         if (_select[0] != undefined) {
            if (_select[0].innerHTML.toLowerCase() != parent.prev('td').text().toLowerCase()) {
               parent.attr('rel', "tooltip");
               parent.attr('data-placement', "top");
               parent.attr('data-original-title', "This state code is used for state [" + _select[0].innerHTML + "].");
               parent.tooltip('show');
               parent.css({ background: 'var(--danger-light)' });
               return;
            }
         }
         parent.removeAttr('rel');
         parent.removeAttr('data-placement');
         parent.removeAttr('data-original-title');
         parent.tooltip('hide');
         parent.css({ background: '' });
         let parent_text = parent.prev('td');
         parent_text.removeAttr('rel');
         parent_text.removeAttr('data-placement');
         parent_text.removeAttr('data-original-title');
         parent_text.tooltip('hide');
         parent_text.css({ background: '' });

      }).unbind('keyup change', '#state_new_list tbody td.state input').on('keyup change', '#state_new_list tbody td.state input', function () {
         let text = this.value;
         let parent = $(this).parent();
         let input_code = parent.next('td').text().toLowerCase();
         let had = false;
         let code = '';
         let textCode = ''
         stateList.forEach(elem => {
            if (elem.code.toLowerCase() == input_code.toLowerCase()) {
               had = true;
               code = elem.code;
               textCode = elem.state;
            }
         });
         if (had == true) {
            if (text.toLowerCase() != textCode.toLowerCase()) {
               parent.attr('rel', "tooltip");
               parent.attr('data-placement', "top");
               parent.attr('data-original-title', "This state code is used for state code [" + code + "][" + textCode + "].");
               parent.tooltip('show');
               parent.css({ background: 'var(--danger-light)' });
               return;
            }
         }
         parent.removeAttr('rel');
         parent.removeAttr('data-placement');
         parent.removeAttr('data-original-title');
         parent.tooltip('hide');
         parent.css({ background: '' });
         let parent_code = parent.next('td');
         parent_code.removeAttr('rel');
         parent_code.removeAttr('data-placement');
         parent_code.removeAttr('data-original-title');
         parent_code.tooltip('hide');
         parent_code.css({ background: '' });

      })
   },
   setView: function () {
      $(document).on('click', 'input:checkbox+label, input:radio+label', function () {
         $(this).prev('input').prop('checked', !$(this).prev('input').prop('checked')).trigger('change');
      })
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
            stateList = Object.freeze(res);
            var _html = '';
            res.forEach(function (item) {
               _html += '<option value="' + item.code + '">' + item.state + '</option>';
            });
            $('.filter_pane [name=state]').html(_html);
            $('.filter_pane [name=state]').select2({ placeholder: 'Select state' });

            $('.filter_pane [name=state]').val(null).trigger('change')
         }
      });
   },
   clearSearchTable: function () {
      window.system_state_table.clear().draw();
   },
   displaySearchTable: function (data) {
      if (data && data.length > 0) {
         let listIndex = {};
         var tmp = [];
         let result = [];
         data.forEach(function (item, index) {
            if (item[0] != undefined) {
               item.forEach(function (value, row) {
                  result.push(value);
               });
            }
         });
         this.setDataTable(result, true);
      } else {
         messageForm('No data result', 'warning');
         this.clearSearchTable();
      }
   },
   setViewTable: function () {
      window.system_state_table = $('#state_system_list').DataTable({
         sDom: "t" + "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
         destroy: true,
         filter: true,
         columns: [
            { data: 'city', title: 'City' },
            { data: 'state_name', title: 'State' },
            { data: 'state', title: 'State Code' },
            {
               data: function (data) {
                  return (typeof data.zip == 'string') ? data.zip : (data.zip instanceof Array) ? data.zip.join(', ') : '';
               }, title: 'Postal Code'
            }
         ],
         order: [[0, 'asc']],
         rowsGroup: [1, 2, 0],
         initComplete: function () {
            $('#state_system_list thead tr').clone().appendTo('#state_system_list thead');
            $('#state_system_list thead tr:eq(1) th').each(function (i) {
               var title = $(this).text();
               $(this).removeAttr('class tabindex area-controls rowspan colspan area-label');
               $(this).addClass('hasinput');
               $(this).html('<input type="text" class="form-control" placeholder="Search ' + title + ' on result" />');

               $('input', this).on('keyup change', function () {
                  if (window.system_state_table.column(i).search() !== this.value) {
                     window.system_state_table
                        .column(i)
                        .search(this.value)
                        .draw();
                  }
               });
            });
         }
      });
   },
   createInsertRow: function (data = {}) {
      let _html = `
      <tr data-type="${data.type || ''}" data-index="${data.index || ''}">
         <td class="col-xs-1 hidden"><input type="checkbox" class="checkState"><label>&nbsp;</label></td>
         <td class="city col-xs-2">${data.city ? data.city : ''}</td>
         <td class="state col-xs-2">${data.state ? data.state : ''}</td>
         <td class="code col-xs-2">${data.code ? data.code : ''}</td>
         <td class="postal_code col-xs-2">${data.postal_code ? data.postal_code : ''}</td>
         <td class="hasinput">
            <a class="btn btn-xs btn-default btnRemoveRow"><i class="fa fa-times text-danger"></i> Remove</a>
            <a class="btn btn-xs btn-default btnPushRow"><i class="fa fa-upload text-primary"></i> Save</a>
         </td>
      </tr>
      `;

      $('#state_new_list tbody').append(_html);
   },
   removeInsertRow: function (elem) {
      let $tr = $(elem).closest('tr');
      let type = $tr.data('type');
      let indexData = parseInt($tr.data('index'));
      if (type && indexData != undefined && indexData >= 0 && indexData < window['inserted_' + type].length) {
         window['inserted_' + type].splice(indexData, 1, '');
      }
      $tr.remove();
   },
   setDataTable: function (list, clear) {
      if (clear) {
         window.system_state_table.clear();
      }
      window.system_state_table.rows.add(list);
      window.system_state_table.draw();
   },
   pushOne: function (elem) {
      let _self = this;
      $this = $(elem);
      $tr = $this.closest('tr');
      let _rowData = {
         city: $tr.find('.city').text(),
         state: $tr.find('.code').text(),
         state_name: $tr.find('.state').text(),
         zip: $tr.find('.postal_code').text()
      }
      if (_rowData.city == '' || _rowData.state == '' || _rowData.state_name == '' || _rowData.zip == '') {
         $tr.addClass('danger');
         setTimeout(function () {
            messageForm('Please fill all cell in this row', false, $('#state_new_list').parent().find('.message_table:first'));
            setTimeout(function () {
               $tr.removeClass('danger');
            }, 1000);
         }, 100);
         return;
      } else if ($tr.find('.code[rel=tooltip]')[0] != undefined) {
         messageForm('This state code is used for another state. Please check again', false, $('#state_new_list').parent().find('.message_table:first'));
         return;
      }
      let _data = $.extend(_rowData, template_data);

      $.ajax({
         url: link._stateAddNew,
         type: 'post',
         dataType: 'json',
         data: _data,
         success: function (res) {
            if (res.ERROR == '') {
               _self.setDataTable([{
                  city: _rowData.city,
                  state: _rowData.state,
                  state_name: _rowData.state_name,
                  zip: [_rowData.zip]
               }]);
               $tr.remove();
               if ($('.filter_pane [name=state] option[value="' + _rowData.state + '"]')[0] == undefined) {
                  $('.filter_pane [name=state]').prepend('<option value="' + _rowData.state + '">' + _rowData.state_name + '</option>').trigger('change');
               }
               messageForm('You have successfully added a state-zipcode', true);
            } else {
               messageForm('An error occured. Please try later', false);
            }
         },
         error: function (e) {

         }
      })
   },

}

new AdminState().init()