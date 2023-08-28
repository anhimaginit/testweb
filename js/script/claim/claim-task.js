function ClaimTask() { }
var allowTime = [];
for (let i = 0; i < 24; i++) {
   for (let j = 15; j < 60;) {
      allowTime.push(`${i}:${j}`);
      j += 15;
   }
}
ClaimTask.prototype = {
   constructor: ClaimTask,
   init: function () {
      this.bindEvent();
      this.createList();
   },
   bindEvent: function () {
      let _self = this;
      $("#btnAddTaskItem").click(function () {
         let new_data = {
            createDate : getDateTime(),
            actionset: 'claim',
            customer_id: $('[name=customer]').val(),
            status: 'open'
         }
         _self.displayTask(_self.createTaskRow(new_data));
         jsonAssignTaskTable.push(new_data)
      });

      $(document).unbind('click', '.btnDeleteTask').on('click', '.btnDeleteTask', function () {
         _self.removeTask($(this).closest('tr').index());
      })
   },
   createList: function () {
      if (jsonAssignTaskTable) {
         let _html = '';
         jsonAssignTaskTable.forEach((item, index) => {
            jsonAssignTaskTable[index].customer_id = $('[name=customer]').val()
            _html += this.createTaskRow(item);
         });
         this.displayTask(_html);
      }
   },
   bindEventTask: function () {
      $('#tblTaskTemplateList tbody .datetimepicker').datetimepicker({
         formatDate: 'Y-m-d H:m',
         lang: 'en',
         allowTimes: allowTime
      });

      $('#tblTaskTemplateList input, #tblTaskTemplateList select').unbind('change').on('change', function () {
         let $this = $(this),
            $tr = $this.closest('tr'),
            index = $tr.index(),
            attr = $this.data('key');
         jsonAssignTaskTable[index][attr] = this.value;
         if (attr == 'assign_id') {
            if (this.value != '') {
               $tr.find('.btnContentMail').removeClass('hidden');
            } else {
               $tr.find('.btnContentMail').addClass('hidden');
            }
         } else if (attr == 'status') {
            if (this.value == 'done') {
               jsonAssignTaskTable[index]['doneDate'] = getDateTime();
            } else {
               delete jsonAssignTaskTable[index]['doneDate'];
            }
         }else if(attr=='dueDate'){
            let date = new Date(this.value);
            jsonAssignTaskTable[index][attr] = getDateTime(date);
         }
      });
   },
   displayTask: function (text) {
      $('#tblTaskTemplateList tbody').append(text);
      this.bindEventTask();
   },
   /**
    * 
    * @param {JSON} data : 
    {
    "time": "",
    "alert": ,
    "id": "",
    "taskName": "",
    "customer_id": null,
    "assign_id": null,
    "actionset": "claim",
    "createDate": "",
    "doneDate": null,
    "dueDate": null,
    "status": null,
    "urgent": null,
    "content": null
  }
    */
   createTaskRow: function (data) {
      if (!data) data = {};
      let currentDate = new Date(),
         createDate = data.createDate ? new Date(data.createDate) : new Date(),
         doneDate = data.doneDate ? new Date(data.doneDate) : null,
         dueDate = data.dueDate ? new Date(data.dueDate) : new Date(),
         dueTime = dueDate.getTime(),
         createTime = createDate.getTime(),
         time = getTimeFromString(data.time),
         alertTime = getTimeFromString(data.alert),
         urgentTime = getTimeFromString(data.urgent),
         alertDate = data.alert ? new Date(dueDate + time - alertTime) : null,
         urgentDate = data.urgent ? new Date(dueDate + time - urgentTime) : null,
         timeDate = data.time ? new Date(dueTime + time) : null;

      let timeText = timeDate && timeDate.getTime() < currentDate.getTime() ? 'danger' : '';
      let alertText = alertDate && alertDate.getTime() < currentDate.getTime() ? 'warning' : '';
      let urgentText = urgentDate && urgentDate.getTime() < currentDate.getTime() ? 'success' : '';
      let status = ["Open", "In Progress", "Done", "Close"];

      let className = doneDate != null ? 'info' : timeText != '' ? timeText : alertText != '' ? alertText : urgentText != '' ? urgentText : '';
      let _html = `
         <tr class="${className}">
            <td class="hasinput"><input type="text" class="form-control" data-key="taskName" value="${data && data.taskName ? data.taskName.upperCaseFirst() : ''}"></td>
            <td style="padding:6px 3px;">${data.time || ''}</td>
            <td class="hasinput">
               <select class="form-control assign_id" data-key="assign_id">
               <option value="">Select Assign</option>
               `
      $.each(assigned_persons, function (index, item) {
         if (item.ID == data.assign_id) {
            _html += '<option value="' + item.ID + '" data-email="' + item.primary_email + '" selected>' + item.first_name + ' ' + item.last_name + '</option>';
         } else {
            _html += '<option value="' + item.ID + '" data-email="' + item.primary_email + '">' + item.first_name + ' ' + item.last_name + '</option>';
         }
      });
      _html += `
               </select>
            </td>
            <td style="padding:6px 3px;">${data && data.createDate ? data.createDate : ''}</td>
            <td class="hasinput"><input type="text" class="datetimepicker form-control" data-key="dueDate" value="${data && data.dueDate ? data.dueDate : ''}"></td>
            <td class="hasinput"><select class="form-control" data-key="status">
            `;
      for (s of status) {
         if (data && data.status == s.toLowerCase()) {
            _html += '<option value="' + s.toLowerCase() + '" selected>' + s + '</option>';
         } else {
            _html += '<option value="' + s.toLowerCase() + '" >' + s + '</option>';
         }
      }

      _html += `
            </select></td>
            <td class="input-group hasinput" style="display:flex">
               <div class="input-group-btn">
               ${data.id ? `<a href="./#ajax/task.php?id=${data.id}" target="_blank" class="btn btn-sm btn-info" title="Go to task">&nbsp;<i class="fa fa-info"></i>&nbsp;</a>` : ''}
                  <button type="button" title="Delete task" class="btn btn-sm btn-danger btnDeleteTask"><i class="fa fa-trash-o"></i></button>
                  <button type="button" class="btn btn-sm btn-success btnContentMail${data && data.assign_id && data.assign_id != '0' && data.assign_id != '' ? '' : ' hidden'}" title="Send the customer an email with the contractors info"><i class="fa fa-envelope-o" aria-hidden="true"></i></button>
               </div>
            </td>
         </tr>
      `;
      return _html;
   },
   removeTask: function (index) {
      jsonAssignTaskTable.splice(index, 1);
      $('#tblTaskTemplateList tbody tr:eq(' + index + ')').remove();
   },
   getAssignTask: function () {
      return jsonAssignTaskTable;
   }
}

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