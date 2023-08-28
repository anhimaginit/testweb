function Group() {
   /** Load parent */
   // this.loadParentGroup();
   /**
    * create table group
    */
   this.setView();
   jQuery("#group_form").validate(Group.prototype.validatorGroupOption);
}

Group.prototype.constructor = Group;
var currentUsers = [];
var ID = '';
Group.prototype = {
   init: function () {
      this.bindEvent();
   },
   setView: function () {
      this.loadYourGroup();

      new ControlSelect2(['#group_form select[name=users]', '#group_form [name="parent_id"]'], { users: _linkSelect.group_users, parent_id: _linkSelect.bill_to });

      $('#group_form select[name=parent_group]').select2({});
      $('#group_form select').css({ 'width': '100%' });

      $('#group_form select[name=role]').select2({
         placeholder: "Select role",

      });
      $('#group_form select[name=department]').select2({
         placeholder: "Select unit",
      });

      $('#group_form select[name=group_name]').select2({
         placeholder: "Select or enter a group name",
         allowClear: true,
         tags: true,
         language: {
            noResults: function () { return ''; }
         },
         createTag: function (newTag) {
            return {
               id: newTag.term,
               text: newTag.term,
               isNew: true
            };
         }
      });
   },
   bindEvent: function () {
      var _self = this;
      $('#btnSubmitGroup').click(function () {
         $("#group_form").submit();
      });

      $(document).on('change', '#group_form', function () {
         $('#message_form').hide();
      }).on('change', '#group_form select[name=department]', function () {
         var data = [];
         if (this.value == 'SystemAdmin') {
            $('#group_form select[name=role]').empty();
            data = [{ id: 'Admin', text: 'Admin' }];
            $('#group_form select[name=role]').select2({ placeholder: "Select role", data: data });
            $('#group_form select[name=role]').val('Admin').trigger('change');
         } else {
            window.roleList.forEach(function (item) {
               data.push({ id: item, text: item });;
            });
            $('#group_form select[name=role]').select2({ placeholder: "Select role", data: data });
            $('#group_form select[name=role]').trigger('change');
         }
         $('select[name=users]').val(null).trigger('change');
         _self.setGroupName(this.value);
         _self.loadParentGroup(false, true);
      }).on('change', '#group_form select[name=group_name], #group_form select[name=role]', function () {
         _self.loadParentGroup(false, true);
         // _self.resetByGroupChange();
      })
      // .on('change', '#group_form select[name=parent_group]', function () {
      //    _self.loadSupervisor();
      // })
   },

   setGroupName: function (department, selected) {
      var currentGroupName = $('#group_form select[name=group_name]').val();
      var currentDepartment = $('#group_form select[name=department]').val();

      var separate = btoa('fhsjdhfj');

      var result = ['<option value="">Select or enter group name</option>'];
      var _tmp = [];
      window.group_list.forEach(function (item) {
         if (item.department == department && !_tmp.includes(item.group_name + separate + item.department)) {
            result.push('<option value="' + item.group_name + '">' + item.group_name + '</option>');
            _tmp.push(item.group_name + separate + item.department);
         };
      });
      if (currentDepartment && currentDepartment != '' && currentGroupName && currentGroupName != '' && !_tmp.includes(currentGroupName + separate + currentDepartment)) {
         result.splice(0, 0, '<option value="' + currentGroupName + '">' + currentGroupName + '</option>');
      }
      $('#group_form select[name=group_name]').html(result.join(''));
      if (selected) {
         $('#group_form select[name=group_name]').val(selected).trigger('change');
      } else {
         $('#group_form select[name=group_name]').val(currentGroupName).trigger('change');
      }
   },

   // resetByGroupChange: function (reset) {
   //    if (reset || $('select[name=group_name]').val() == '') {
   //       $('#group_form select[name=role] option').prop('disabled', false);
   //       $('#group_form select[name=users] option').prop('disabled', false);
   //       return;
   //    } else {
   //       $('#group_form select[name=role] option').prop('disabled', false);

   //       $('#group_form select[name=role]').select2();
   //    }
   // },

   loadParentGroup: function (selected) {
      if (!window.group_list) return;
      var _html = ['<option value="">Select Parent</option>'];
      var department = $('select[name=department]').val();
      var role = $('select[name=role]').val();
      window.group_list.forEach(function (item) {
         if (item.ID != $('input[name=ID]').val() && item.role != 'User' && (role == '' || (role != '' && roleScore[role] >= roleScore[item.role])) && (item.department == department || department == ''))
            _html.push('<option value="' + item.ID + '">' + item.group_name + ' - ' + item.department + ' - ' + item.role + '</option>');
      });
      $('select[name=parent_group]').html(_html.join(''));
      if (selected) {
         $('select[name=parent_group]').val(selected).trigger('change');
      } else {
         $('select[name=parent_group]').trigger('change');
      }
      // if (isLoadSupervisor == true || isLoadSupervisor == undefined) {
      //    this.loadSupervisor();
      // }
   },

   loadSupervisor: function (selected) {
      var _myData = $.extend({}, template_data);
      _myData.ID = jQuery('select[name=parent_group]').val();
      if (!_myData.ID) return;
      else
         $.ajax({
            url: link._gounpUsersInGrp,
            type: 'post',
            data: _myData,
            dataType: 'json',
            success: function (res) {
               if (res.ERROR == '') {
                  var _html = ['<option value="">Select supervisor</option>'];
                  res.list.forEach(function (item) {
                     if (item.ID && item.c_name) {
                        _html.push('<option value="' + item.ID + '">' + item.c_name + '</option>');
                     };
                  });
                  jQuery('select[name=parent_id]').html(_html.join(''));
                  if (selected) {
                     jQuery('select[name=parent_id]').val(selected.split(',')).trigger('change');
                  } else {
                     jQuery('select[name=parent_id]').trigger('change');
                  }
               }
            },
         })
   },

   validatorGroupOption: {
      rules: {
         department: { required: true },
         role: { required: true },
         group_name: { required: true },
         users: { required: true }
      },
      submitHandler: function (e) {
         var _formData = $.extend({}, template_data);
         var _data = $(e).serializeArray()
         _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
               _formData[elem.name] = elem.value;
            }
         });
         _formData.department = ($('select[name=department]').val() + '');
         _formData.users = JSON.stringify(($('select[name=users]').val() + '').split(','));
         var gr_parent = $('#group_form select[name=parent_id]').val();
         if (!gr_parent || gr_parent.length == 0) gr_parent = [];
         _formData.parent_id = gr_parent.join(',');
         var parent_name = [], user_name = [];
         if (gr_parent == []) {
            var _tmp = [];
            $('select[name=parent_id]').find('option').each(function (row, elem) {
               if (elem.value != '') {
                  if (elem.value != '')
                     _tmp.push(elem.value); _tmp.push(elem.value);
                  if ($(this).prop('selected') == true) {
                     parent_name.push({ ID: this.value, name: $(this).text() });
                  }
               }
            });
            _formData.parent_id = _tmp.join(',');
         }
         $('select[name=users]').find('option:selected').each(function (row, elem) {
            if (elem.value != '') {
               user_name.push({ ID: this.value, name: $(this).text() });
            }
         });
         var _link = link._groupNew;
         _formData.ID = $('input[name=ID]').val();
         if (_formData.ID && _formData.ID != '') {
            _link = link._groupUpdate;
         } else {
            delete _formData.ID;
         }

         if(window.currentEditGroup){
            if(!_formData.department){
               _formData.department = window.currentEditGroup.department;
            }
            if(!_formData.role){
               _formData.role = window.currentEditGroup.role
            }

            if(!_formData.group_name || _formData.group_name==''){
               _formData.group_name = window.currentEditGroup.group_name
            }
         }else{
            if(!_formData.role){
               _formData.role = 'User';
            }

            if(!_formData.department){
               _formData.department = localStorage.getItemValue('actor');
            }
         }
         $.ajax({
            url: _link,
            type: 'post',
            data: _formData,
            dataType: 'json',
            success: function (res) {
               if (res.SAVE == 'SUCCESS') {
                  messageForm('You have successfully save the group', true, '#group_form #message_form');
                  if (_link == link._groupNew) {
                     $('input[name=ID]').val(res.ID);
                     _formData.ID = res.ID;
                  }
                  var parent = [];
                  $('select[name=parent_id]').find('option:selected').each(function (row, elem) {
                     parent.push({ ID: elem.value, name: $(elem).text() });
                  });
                  if (_formData.parent_id) {
                     _formData.parent_id = _formData.parent_id.split(',');
                  }

                  if (_formData.users) {
                     _formData.users = JSON.parse(_formData.users);
                  }
                  _formData.userName = user_name;
                  _formData.parent_name = parent_name;

                  window.group_list.push(_formData);
                  // console.log(window.group_list);
                  // setTimeout(function () {
                  //    location.reload(true);
                  // }, 1000);
               } else {
                  messageForm('Error! An error occurred. ' + res.ERROR, false,'#group_form #message_form');
               }
            },
         })
      }
   },

   initUpdate: function (data) {
      window.currentEditGroup = Object.freeze(data);
      currentUsers = data.users ? data.users : [];
      ID = data.ID;
      var _self = this;
      for (var key in data) {
         if (key == 'ID') {
            $("input:hidden[name='" + key + "']").val(data[key]);
         } else {
            $("select[name='" + key + "']").val(data[key]).trigger('change');
         }
      }
      $('#btnSubmitGroup').text('Save');
      _self.setGroupName(data.department, data.group_name);
      _self.loadParentGroup(data.parent_group, false);
      _self.setSupervisor(data.parent_name);
      _self.setUsersID(data.userName, function () {
         _self.bindEvent();
      })
   },

   setUsersID: function (users, callback) {
      if (!users || users == '' || users == 0) {
         if (callback) callback();
         return;
      };
      users.forEach(function (item) {
         $('#group_form select[name=users]').append('<option value="' + item.ID + '" selected>' + item.name + '</option>');;
      });
      $('#group_form select[name=users]').trigger('change');
      if (callback) callback();
   },

   setSupervisor: function (supervisor) {
      if (supervisor) {
         supervisor.forEach(function (item) {
            $('#group_form select[name=parent_id]').append('<option value="' + item.ID + '" selected>' + item.name + '</option>');
         });
         $('#group_form select[name=parent_id]').trigger('change');
      }
   },

   loadYourGroup: function () {
      var groups = JSON.parse(localStorage.getItemValue('int_acl_short'));
      var _html = [];
      var createGroup = function (group) {
         if (group.department) {
            var _s = [];
            _s.push('<div class="well col col-md-3 col-sm-4 col-xs-6 padding-5" style="margin:5px;">');
            _s.push('<div><b>Group Name: </b>' + group.group + '</div>');
            _s.push('<div><b>Unit: </b>' + group.department + '</div>');
            _s.push('<div><b>Role: </b>' + group.level + '</div>');
            _s.push('</div>');
            return _s.join('');
         } else return '';
      }
      groups.forEach(function (group) {
         _html.push(createGroup(group));;
      });
      $('#your_group').html(_html.join(''));
   },


}