function GroupDashBoard() {
   this.loadTask(localStorage.getItemValue('userID'));
}
GroupDashBoard.prototype.constructor = GroupDashBoard;
var table_task = {};
GroupDashBoard.prototype = {
   init: function () {
      this.loadGroup();
      setTimeout(this.bindEvent(), 3000);
   },
   bindEvent: function () {
      var _self = this;
      _self.eventSelectTask();
      $('select[name=group]').change(function () {
         table_task.group_table.columns().search('').column(1).search(this.value).draw();
         _self.loadTask();
      });
      $('select[name=group_type]').change(function () {
         if (this.value == 'Group') {
            $('select[name=group]').show();
            $('select[name=individual]').hide();
            _self.loadGroup();
         } else if (this.value == 'Individual') {
            // table_task.group_table.columns().search('').column(5).search(localStorage.getItemValue('userID')).draw();
            _self.loadIndividualName(window.groupList);
            _self.loadTask();
            $('select[name=group]').hide();
            $('select[name=individual]').show();
         }
      });
      $('select[name=individual]').bind('change', function () {
         _self.loadGroup(this.value, link._dashboardListGrps_Individual);
         _self.loadTask(this.value);
      });
   },

   eventSelectTask: function () {
      $('#wid-task table caption').append(`
      <span class="pull-right">
      <select style="min-width: 400px;" multiple="true">
         <option value="&nbsp;">&nbsp;</option>
         <option value="Open" selected>Open</option>
         <option value="In Progress" selected>In Progress</option>
         <option value="Close">Close</option>
         <option value="Done">Done</option>
      </select></span>`);
      $('#wid-task table caption select').select2({
         containerCssClass: 'pull-right'
      }).on('change', function (e) {
         let data = $(this).val();
         $(this).closest('table').DataTable().column(5)
            .search(data.join('|'), true, false)
            .draw();
      });


   },
   /**
    * 
    * @param {Number} id : user ID need to load group
    * load group
    */
   loadGroup: function (id, _link = link._dashboardListGrps) {

      var _self = this;
      var _data = $.extend({}, template_data);
      _data.ID = (id ? id : localStorage.getItemValue('userID'));
      $.ajax({
         url: _link,
         type: 'post',
         data: _data,
         dataType: 'json',
         success: function (res) {
            var list = res.groups;
            /** Make select group name */
            if (!id) {
               window.groupList = list;
               var groupSelect = '<option value="">All</option>';
               var groupSelectList = [];
               list.forEach(function (group) {
                  if (!groupSelectList.includes(group.group_name)) {
                     groupSelectList.push(group.group_name);
                     groupSelect += '<option value="' + group.group_name + '">' + group.group_name + '</option>';
                  };
               });
               $('select[name=group]').html(groupSelect);
            }
            /** Load table */
            if (list.length > 0) {
               _self.loadTable(list, id != undefined);
            } else {
               _self.loadTable([], id != undefined);
            }
         },
      });
   },

   loadIndividualName: function (listGroup) {
      var select = $('select[name=individual]');
      var options = select.prop('options');
      var user = [];
      $('option', select).remove();
      options[0] = new Option('Select Member', '');
      listGroup.forEach(function (item) {
         if (item.userName) {
            item.userName.forEach(function (u) {
               if (!user.includes(u.ID)) {
                  user.push(u.ID);
                  options[options.length] = new Option(u.name, u.ID);
               };
            });
         };
      });
   },

   loadNames: function (users) {
      return new Promise(function (resolve, reject) {
         var _data = $.extend({}, template_data);
         _data.IDs = users.join(',');
         $.ajax({
            url: link._contactName,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
               if (res.ERROR == '')
                  resolve(res.list)
               else reject(res.ERROR)
            },
            error: function (e) {
               reject(e);
            }
         })
      });
   },

   loadTable: function (list, isIndividual) {
      var _self = this;
      if (!list) {
         _self.loadGroup();
      } else {
         if (table_task.group_table) {
            table_task.group_table.clear();
            table_task.group_table.rows.add(list);
            table_task.group_table.columns().search('').draw();
            if (!isIndividual) {
               _self.loadTask();
            }
         } else {
            var _users = [];
            delete table_task.group_table;
            table_task.group_table = $('#table_group').DataTable({
               sDom: "<'dt-toolbar'" + "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               data: list,
               destroy: true,
               retrieve: true,
               columns: [
                  { data: 'ID', title: '#&nbsp;ID' },
                  { data: 'group_name', title: 'Group Name', "searchable": true },
                  { data: 'department', title: 'Unit', "searchable": true },
                  { data: 'role', title: 'Role', "searchable": true },
                  {
                     mRender: function (data, type, row) {
                        var _html = [];
                        row.userName.forEach(function (item) {
                           _users.push(item.ID);
                           _html.push('<a href="./#ajax/contact-form.php?id=' + item.ID + '" target="_blank" title="Go to contact">' + item.name + '</a>');
                        });
                        return _html.join(', ');
                     }, title: 'Member', searchable: true
                  },
                  { data: 'parent_id', searchable: true, className: 'hidden' },
                  { data: 'parent_group', searchable: true, className: 'hidden' },
               ],
               rowsGroup: [1, 2, 3],
               createdRow: function (row, data, dataIndex) {
                  // if (window.dashboard_access.includes('GroupForm')) {
                  $(row).attr('title', 'Click to go to group: ' + data.group_name + ' (' + data.department + ' - ' + data.role + ')');
                  $(row).click(function (e) {
                     window.open(host2 + '#ajax/group.php?id=' + data.ID, '_self');
                  });
                  // }
               }
            });
            table_task.group_table.columns().search('').draw();
            if (!isIndividual) {
               _self.loadTask(_users.join(','));
            }
         }
      }
   },

   loadTask: function (users) {
      if (!users) {
         var data = table_task.group_table.rows({ filter: 'applied' }).data();
         users = [];
         for (var i = 0; i < data.length; i++) {
            data[i].userName.forEach(function (item) {
               if (!users.includes(item.ID)) {
                  users.push(item.ID);
               };
            })
         }
      }
      if (typeof users != 'string' && typeof users != 'undefined')
         users = users.join(',');
      if (users) {
         var _self = this;
         return new Promise(function (resolve, reject) {
            var _data = $.extend({}, template_data);
            _data.ID = users;
            $.ajax({
               url: link._dashboard_grptasks,
               type: 'post',
               data: _data,
               dataType: 'json',
               success: function (res) {
                  _self.loadTableTask(res.wasAssign, 'table_task_group');
                  _self.loadTableTask(res.assignTo, 'table_task_assignTo');
                  var priorityList = [];
                  res.wasAssign.forEach(function (data) {
                     if (data.status == 'done' || data.status == 'close') {
                     } else if (data.status && data.time) {
                        var duration = new Date(data.dueDate).getTime() + getTimeFromString(data.time) - new Date().getTime();
                        if (duration <= 0) {
                           priorityList.push(data);
                        }
                     }
                  });
                  res.assignTo.forEach(function (data) {
                     if (data.status && data.status == 'done' || data.status == 'close') {
                     } else if (data.status && data.time) {
                        var duration = new Date(data.dueDate).getTime() + getTimeFromString(data.time) - new Date().getTime();
                        if (duration <= 0) {
                           priorityList.push(data);
                        }
                     };
                  });
                  _self.loadTableTask(priorityList, 'table_task_priority');
                  resolve(true);

               },
               error: function (e) {
                  reject(e);
               }
            })
         })
      }
   },
   loadTableTask: function (list, table) {
      if (list) {
         if (table_task[table]) {
            //console.log(table_task);
            table_task[table].clear();
            table_task[table].rows.add(list);
            table_task[table].draw();
            $('#' + table).find('select').trigger('change');

         } else {
            delete table_task[table];
            var priorityList = [];
            table_task[table] = $('#' + table).DataTable({
               sDom: "<'dt-toolbar'" + "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               data: list,
               destroy: true,
               retrieve: true,
               columns: [
                  { data: 'taskName', searchable: true, title: 'Task Name', className: 'uppercase-first' },
                  { data: 'cus_name', searchable: true, title: 'Customer' },
                  { data: 'assign_name', searchable: true, title: 'Assign' },
                  { data: 'doneDate', searchable: true, title: 'Done Date' },
                  { data: 'dueDate', searchable: true, title: 'Due Date' },
                  { data: function (data) { return data['status'] || '&nbsp;' }, searchable: true, title: 'Status', className: 'uppercase-first' },
                  {
                     data: function (data) {
                        var duration = (new Date(data.dueDate).getTime() + getTimeFromString(data.time) - new Date().getTime()) / 1000;
                        return getTimes(duration);
                     //    return duration;
                     }, searchable: true, title: 'Time'
                  },
                  { data: 'createDate', searchable: true, className: 'hidden' }

               ],
               order: [[7, 'desc']],
               createdRow: function (row, data, dataIndex) {
                  if (data.status == 'done') {
                     $(row).addClass('warning');
                  } else if (data.status == 'open') {
                     $(row).addClass('light');
                  }else if(data.status=='in progress'){
                     $(row).addClass('success');
                  }

                  // else if (data.status == 'close') {
                  //    $(row).addClass('hidden');
                  // }
                  if (data.status != 'close' && data.status != 'done') {
                     var duration = new Date(data.dueDate).getTime() + getTimeFromString(data.time) - new Date().getTime();
                     let alert = new Date(data.dueDate).getTime() + getTimeFromString(data.alert) - new Date().getTime();
                     let urgent = new Date(data.dueDate).getTime() + getTimeFromString(data.urgent) - new Date().getTime();

                     if (duration <= 0) {
                        $(row).addClass('danger');
                     } else if (alert <= 0) {
                        $(row).addClass('orange');
                     } else if (urgent <= 0) {
                        $(row).addClass('success');
                     }
                  }

                  $(row).attr('title', 'Click to go to task')
                  $(row).click(function () {
                     document.location.href = './#ajax/task.php?id=' + data.id;
                  });
               },
               initComplete: function () {
                  $('#' + table).find('select').trigger('change');
               }
            });
         }
      }
   },
}
var _dashBoardGroup = new GroupDashBoard();
_dashBoardGroup.init();

function getTimeFromString(st) {
   if (!st || st == '' || !st.includes(' ') || !st.includes(':')) return 0;
   let result = 0;
   let day = numeral(st.split(' ')[0]).value();
   let hh = numeral(st.split(' ')[1].split(':')[0]).value();
   let mm = numeral(st.split(':').pop()).value();
   result += day * 8.64 * 1e7;
   result += hh * 3.6 * 1e6;
   result += mm * 60 * 1e3;
   return result;
}

var getTimes = function (duration) {
   var tmp = false;
   if (duration < 0) {
      tmp = true;
      duration = Math.abs(duration)
   }
   var result = '';
   var day = parseInt(duration / 86400);
   var hh = parseInt(duration % 86400 / 3600);
   var mm = parseInt(duration % 86400 % 3600 / 60);
   var ss = parseInt(duration % 86400 % 3600 % 60);
   result += day + ' day' + (day > 1 ? 's ' : ' ');
   result += hh + ':' + mm + ':' + ss;
   if (tmp == true) {
      return '(' + result + ')';
   } else {
      return result;
   }
}