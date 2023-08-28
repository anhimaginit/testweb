function ACLRole() { }
var ACL = {};
window.navi_sort = {}

$.get('js/script/acl/acl-template.json', function (res) {
  window.key_template = res;
});

$.get('js/script/acl/acl-key.json', function (res) {
  ACL = res;
});

$.get('js/script/acl/acl-navigation.json', function (res) {
  window.navi_sort = res;
});

var originACL;
var id = '', unit = '', level = '';

ACLRole.prototype = {
  constructor: ACLRole,
  init: function () {
    var _self = this;
    this.bindEvent();
    this.loadGroup();
    this.loadACL(function () {
      _self.your_role();
    });
    saveRule = this.saveRule;
  },
  bindEvent: function () {
    var _self = this;
    $('#group').change(function () {
      $('#acl_content').empty();
      _self.loadTemplate();
      $('.btnSubmitTab').show();
    });
    $('select').bind('click', function () {
      $('#message_form').hide(200);
    });

    $(document).on('change', '#unit, #levels', function () {
      var unit = $('#unit').val();
      var level = $('#levels').val();

      $('#group option').css({ display: 'none' });

      var query = '';
      if (unit && unit != '') query += unit;
      if (level && level != '') query += ' (' + level + ')';
      else query += ' (';
      $('#group option').filter(function () {
        return this.text.trim().includes(query);
      }).css("display", "block");

      $('#group option[value=""]').css("display", "block");
      $('#group option[value=""]').prop('selected', true);

    });

    $('.load_self').click(function () {
      $('#acl_content').empty();
      _self.your_role();
    });
    _self.setEventCheckbox();
    _self.setEventRadio();
    _self.eventNav();
  },
  sortAttribute: function (role) {
    var arr = [];
    for (var key in role) {
      arr.push(key);
    }
    arr.sort();
    var result = {};
    arr.forEach(function (key) {
      return result[key] = role[key];;
    });
    role = result;
    return result;
  },
  your_role: function () {
    var _self = this;
    _self.loadTemplateACL(JSON.parse(localStorage.getItemValue('int_acl_short')), function () {
      $.get('php/getSession.php?data=int_acl', function (res) {
        if (res && res.length > 0) {
          res = JSON.parse(res);
          var role = res.acl_rules;
          originACL = res.acl_rules;
          _self.createContent(role);
          $('.btnSubmitTab').hide();
          $('#acl_content').prepend('<h3 class="bg-primary padding-10">Your ACL • Unit: ' + localStorage.getItemValue('actor') + ' • Role: ' + localStorage.getItemValue('level') + '</h3><div class="padding-5">');
        }
      });
    });
  },
  setEventRadio: function () {
    var _self = this;
    $(document).on('change', 'form input:radio:not([disabled])', function () {
      var name = $(this).attr('name');
      if (name&& name.endsWith('_checkAllItem')) {
        _self.selectAll(this);
      } else {
        _self.editAttribute(this);
      }
    });
  },
  setEventCheckbox: function () {
    var _self = this;
    $(document).on('change', 'form input:checkbox:not([disabled])', function () {
      var form = $(this).parents('form:first');
      var name = $(this).attr('name');
      let role = $(this).data('role');
      let attr = $(this).data('attr');
      if (role == 'read') {
        _self.editAttribute(this);
        if ($(this).prop('checked') == false) {
          form.find('input[data-attr="' + attr + '"]').prop('checked', false).change();
          // form.find('input[name=' + _attr + '_edit]').prop('checked', false).change();
          // form.find('input[name=' + _attr + '_show]').prop('checked', false).change();
        }
      } else if (name && name.endsWith('_checkAllItem')) {
        _self.selectAll(this);
      } else {
        _self.editAttribute(this);
      }
    });

    $(document).on('change', 'input:checkbox[data-attr=PermissionForm][data-role=edit]', function (e) {
      e.preventDefault();

      var status = $(this).prop('checked');
      if (status == false) {
        var cf = window.confirm('If this change is approved, the users in the group will not be able to edit the permissions in this tab');
        if (cf) {
          $(this).prop('checked', false);
          return;
        } else {
          $(this).prop('checked', true);
        }
      }
    });

    /*** Remove checkbox top event */
    // $(document).on('change', '.checkbox-select-form', function () {
    //   var value = this.value;
    //   var status = $(this).prop('checked');
    //   if (status) {
    //     //show tab content
    //     $('.tab-pane').removeClass('in active');
    //     $('.tab_form').parent().removeClass('in active');

    //     // show tab
    //     $('a[href="#' + value + '"]').closest('li').show();
    //     $('a[href="#' + value + '"]').closest('li').addClass('in active');
    //     $('#' + value).addClass('in active');

    //   } else {
    //     //hide tab content
    //     $('#' + value).removeClass('in active');
    //     //hide tab
    //     $('a[href="#' + value + '"]').closest('li').hide();
    //     $('a[href="#' + value + '"]').closest('li').removeClass('in active');
    //   }
    // });
  },
  selectAll: function (element) {
    var status = $(element).prop('checked');
    var value = $(element).val();
    if (value == 'read' && status == false) {
      $(element).closest('form').find('input[name="head_A_checkAllItem"]').prop('checked', status)
      $(element).closest('form').find('input[name="head_E_checkAllItem"]').prop('checked', status)
    }
    $(element).closest('form').find('input[data-role="' + value + '"]').prop('checked', status).change();
  },
  editAttribute: function (elem) {
    let field = $(elem).data('attr');
    let role = $(elem).data('role');
    let form = $(elem).closest('.tab-pane').prop('id');
    let type = $(elem).attr('type');
    if (!ACL || ACL instanceof Array) ACL = {};
    if (ACL[form] == undefined || ACL[form] == null || ACL[form] instanceof Array) ACL[form] = {};
    if (ACL[form][field] == undefined || ACL[form][field] == null || ACL[form][field] instanceof Array) ACL[form][field] = {};

    if (role == 'checkAllItem') {
      var ends = $(elem).val();
      $(elem).closest('form').find('input[data-role="' + ends + '"]').each(function (index, item) {
        let status = $(item).prop('checked');
        let field = $(item).data('attr');
        if (type == 'radio') {
          ACL[form][field] = ends;
        } else {
          ACL[form][field][ends] = status;
        }
      });
    } else {
      if (type == 'radio') {
        ACL[form][field] = role;
      } else {
        let status = $(elem).prop('checked');
        ACL[form][field][role] = status;
      }
    }
  },
  loadACL: function (callback) {
    $.ajax({
      url: link._roles,
      type: 'post',
      data: $.extend({}, template_data),
      dataType: 'json',
      success: function (res) {
        if (res.ERROR == '') {
          /** option for unit select (acl type in db) */
          var optionsUnit = $('#unit').prop('options');
          $('option', $('#unit')).remove();
          if (!optionsUnit) return;
          optionsUnit[0] = new Option('Select Unit', '', true, true);
          res.units.forEach(function (unit) {
            return optionsUnit[optionsUnit.length] = new Option(unit, unit, false, false);;
          });

          $('#unit').val(localStorage.getItemValue('actor'));

          /** option for level select (role)*/
          var optionsLevel = $('#levels').prop('options');
          $('option', $('#levels')).remove();
          if (!optionsLevel) return;
          optionsLevel[0] = new Option('Select Role', '', true, true);
          res.roles.forEach(function (unit) {
            return optionsLevel[optionsLevel.length] = new Option(unit, unit, false, false);;
          });
          $('#levels').val(localStorage.getItemValue('level'));
          if (callback) callback();

          $('#group option').css({ display: 'none' });
          $('#group option').filter(function () {
            return this.text.trim().includes(localStorage.getItemValue('actor') + ' (' + localStorage.getItemValue('level') + ')');
          }).css("display", "block");
        }
      },
      error: function (e) {
      }
    })
  },
  loadGroup: function () {
    template_data = {
      token: localStorage.getItemValue('token'),
      jwt: localStorage.getItemValue('jwt'),
      private_key: localStorage.getItemValue('userID'),
      role: [{
        department: localStorage.getItemValue('actor'),
        level: localStorage.getItemValue('level')
      }],
      login_id: localStorage.getItemValue('userID')
    }
    $.ajax({
      url: link._groupList,
      type: 'post',
      data: template_data,
      dataType: 'json',
      success: function (res) {
        if (res.ERROR == '') {
          var options = $('select[name=group]').prop('options');
          $('option', $('select[name=group]')).remove();
          options[options.length] = new Option('Select group', '', true, true);
          res.list.forEach(function (group) {
            options[options.length] = new Option(group.group_name + ' - ' + (group.department ? group.department + ' ' : '') + (group.role ? '(' + group.role + ')' : ''), group.ID, false, false);;
          });

          $('#unit').val('');
        }
      },
    }).done(function () {
      ACLRole.prototype.loadTemplate();
    });
  },

  loadTemplateACL: function (option, callback) {
    var _data = {
      token: localStorage.getItemValue('token'),
      jwt: localStorage.getItemValue('jwt'),
      private_key: localStorage.getItemValue('userID'),
      login_id: localStorage.getItemValue('userID'),
    }
    if (!option) {
      _data.unit = $('#unit').val() != '' ? $('#unit').val() : 'PolicyHolder';
      _data.level = $('#levels').val() != '' ? $('#levels').val() : 'User'
    } else {
      _data.unit = option[0].department;
      _data.level = option[0].level;
    }
    if ((option && !originACL) || !option) {
      $.ajax({
        url: link._aclRules_Unit_Level,
        type: 'post',
        data: _data,
        dataType: 'json',
        success: function (res) {
          if (option) {
            originACL = res.acl_rules[0];
          }
          for (var key in ACL) {
            ACL[key] = res.acl_rules[0][key];
          }
          if (callback) callback();
        }
      });
    } else if (option && originACL) {
      for (var key in ACL) {
        ACL[key] = originACL[key];
      }
      if (callback) callback();
    }

  },
  loadTemplate: function (option) {
    var _self = this;
    var _data = $.extend({}, template_data);
    if (!option) {
      option = {};
      option.group = $('#group').val();
      var text = $('#group').find('option:selected').text();
      var unit = text.split('-').pop().trim().split(' ')[0];
      var level = text.split(/[-()]/g).join('').split(' ').pop();

      option.unit = unit;
      option.level = level;
    }
    if (!option.group || option.group == '') { _self.createContent(); return; }
    $('#unit').val(option.unit);
    $('#levels').val(option.level);
    _data.unit = option.unit
    _data.level = option.level

    $.ajax({
      url: link._aclRules_Unit_Level,
      type: 'post',
      data: _data,
      dataType: 'json',
      success: function (res) {
        for (var key in ACL) {
          ACL[key] = res.acl_rules[0][key];
        }
      }
    }).done(function () {
      var _mydata = $.extend({}, template_data);
      _mydata.ID = option.group;
      _mydata.role = option.level;
      _mydata.department = option.unit;
      $.ajax({
        url: link._aclRulesGroupID,
        type: 'post',
        data: _mydata,
        dataType: 'json',
        success: function (res) {
          if (res.group && res.group.acl && res.group.acl.length > 0) {
            _self.createContent(res.group.acl[0]);
          } else {
            _self.createContent();
          }
        },
        error: function (e) {
        }
      });
    })
  },
  /**
   * 
   * @param {JSON} template_acl 
   * {ContactForm:{}, ClaimForm:{}, ProductForm:{},...}
   */
  createContent: function (template_acl) {
    if (!template_acl) {
      $('#acl_content').empty();
    } else {
      var indexActive = 0;
      if ($('.tabbable ul li.active').index() >= 0) {
        indexActive = $('.tabbable ul li.active').index();
      }
      var tab = [];
      var tabContent = [];
      checkbox = [];
      for (var form in ACL) {
        var canEditValue = false;
        var li_class = '';
        // cannot-edit-your-self
        if (originACL.PermissionForm) {
          canEditValue = this.canEditForm(originACL.PermissionForm, form);
          if (!canEditValue) li_class = 'cannot-edit-your-self ';
        } else if (!originACL.PermissionForm) {
          li_class = 'cannot-edit-your-self ';
          canEditValue = false;
        }
        // else if (template_acl.PermissionForm) {
        //   canEditValue = this.canEditForm(template_acl.PermissionForm, form);
        // }else if(ACL.PermissionForm){
        //   canEditValue = this.canEditForm(ACL.PermissionForm, form);
        // }
        li_class += (canEditValue ? '' : 'cannot-edit');
        if (template_acl[form]) {
          if (form == 'ControlListForm') {
            let _aclAppend = new ACLAppend();
            let _a_h = _aclAppend.createTabHead(form);
            let _a_b = _aclAppend.createContentTab({
              tab: template_append[form].tab,
              content: template_acl[form],
              header: template_append[form].header
            }, true);

            tab.push(_a_h);
            tabContent.push(_a_b);

          } else {
            ACL[form] = template_acl[form];
            tab.push('<li class="' + li_class + '"><a href="#' + form + '" class="tab_form" data-toggle="tab" rel="tooltip" data-placement="top">' + form.replace('Form', ' Form') + '</a></li>');
            tabContent.push(this.createTab(template_acl[form], form, canEditValue));
            checkbox.push('<label class="checkbox col-lg-2 col-md-3 col-sm-5 col-xs-5">' +
              '<input type="checkbox" class="checkbox-select-form" value="' + form + '" checked><i></i>' + form.replace('Form', ' Form') +
              '</label>');
          }
        } else if (JSON.stringify(ACL[form]) == '{}' || !ACL[form]) {
          let _aclAppend = new ACLAppend();
          let _a_h = _aclAppend.createTabHead(form);
          let _a_b = _aclAppend.createContentTab(form, true);

          tab.push(_a_h);
          tabContent.push(_a_b);
        } else {
          tab.push('<li class="' + li_class + '" style="display:none"><a href="#' + form + '" class="tab_form" data-toggle="tab" rel="tooltip" data-placement="top">' + form.replace('Form', ' Form') + '</a></li>');
          tabContent.push(this.createTab(ACL[form], form, canEditValue));
          checkbox.push('<label class="checkbox col-lg-2 col-md-3 col-sm-5 col-xs-5">' +
            '<input type="checkbox" class="checkbox-select-form" value="' + form + '"><i></i>' + form.replace('Form', ' Form') +
            '</label>');
        }
      }

      var html = [];

      /** checkbox in top **/
      // html.push('<div class="row">' +
      //   '<div class="col col-lg-12 col-sm-12">' +
      //   '<section>' +
      //   '<label class="label">Form:</label>' +
      //   '<div class="inline-group">');
      // html.push(checkbox.join(''));
      // html.push('</div></section></div></div>');

      //tab
      html.push('<div class="tabbable">');
      //tab title
      html.push('<ul class="nav nav-tabs bordered">');
      html.push(tab.join(''));
      html.push('</ul>');
      //content
      html.push('<div class="tab-content padding-10">');
      html.push(tabContent.join(''));
      html.push('</div>');

      html.push('</div>');//tab tabbable


      $('#acl_content').append(html.join(''));
      $('#acl_content .tabbable ul li:eq(' + indexActive + ')').addClass('active');
      $('#acl_content .tabbable .tab-pane:eq(' + indexActive + ')').addClass('in active');
    }

  },
  createTab: function (tab, tabName, canEdit) {
    ACL[tabName] = tab;
    var notify = canEdit ? '' : '<h3 class="text-danger"><i class="fa fa-cog"></i> &nbsp;&nbsp;&nbsp;This form can\'t change</h3>';
    var tabContent = '<div class="tab-pane" id="' + tabName + '">';
    tabContent += notify;
    tabContent += '<div>';
    tabContent += '<form method="post" class="smart-form">';
    tabContent += this.createTable(tab, tabName, canEdit);
    tabContent += '</form>';
    tabContent += '</div>';
    tabContent += '<footer><button class="btnSubmitTab btn btn-primary pull-right" onclick="saveRule()">Save</button></footer>'
    tabContent += '</div>';
    return tabContent;
  },
  createTable: function (tab, tabName, canEdit) {
    var disabled = '';
    if (!canEdit) disabled = ' disabled';
    //table
    var table = '<table class="table table-bordered table-hover" style="width:100% ">';
    //table header
    if (['Dashboard', 'dashboard'].includes(tabName)) {
      table += '<thead>' +
        '<tr>' +
        '<th rowspan="3">Attribute</th>' +
        '<th colspan="1" class="text-center">Action</th>' +
        '</tr>' +
        '<tr>' +
        '<th>View</th>' +
        '</tr>' +
        '<tr>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_S_checkAllItem" value="show"' + disabled + '><i></i>&nbsp;</label></th>' +
        '</tr>' +
        '</thead>';
    } else if (['Navigation', 'navigation'].includes(tabName)) {
      table += '<thead>' +
        '<tr>' +
        '<th rowspan="3">Title</th>' +
        '<th rowspan="3">Attribute</th>' +
        '<th colspan="1" class="text-center">Action</th>' +
        '</tr>' +
        '<tr>' +
        '<th>View</th>' +
        '</tr>' +
        '<tr>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_S_checkAllItem" value="show"' + disabled + '><i></i>&nbsp;</label></th>' +
        '</tr>' +
        '</thead>';
    } else if (tabName == 'PermissionForm') {
      table += '<thead>' +
        '<tr>' +
        '<th rowspan="3">Attribute</th>' +
        '<th colspan="1" class="text-center">Action</th>' +
        '</tr>' +
        '<tr>' +
        '<th>Edit</th>' +
        '</tr>' +
        '<tr>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_E_checkAllItem" value="edit"' + disabled + '><i></i>&nbsp;</label></th>' +
        '</tr>' +
        '</thead>';
    } else {
      tab = this.sortAttribute(tab);
      table += '<thead>' +
        '<tr>' +
        '<th rowspan="3">Attribute</th>' +
        '<th colspan="4" class="text-center">Action</th>' +
        '</tr>' +
        '<tr>' +
        '<th>Read</th>' +
        '<th>View</th>' +
        '<th>Add</th>' +
        '<th>Edit</th>' +
        '</tr>' +
        '<tr>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_R_checkAllItem" value="read"' + disabled + '><i></i>&nbsp;</label></th>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_V_checkAllItem" value="show"' + disabled + '><i></i>&nbsp;</label></th>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_A_checkAllItem" value="add"' + disabled + '><i></i>&nbsp;</label></th>' +
        '<th><label class="checkbox"><input type="checkbox" name="head_E_checkAllItem" value="edit"' + disabled + '><i></i>&nbsp;</label></th>' +
        '</tr>' +
        '</thead>';
    }
    //table body
    table += '<tbody>';
    var button = []
    if (['Dashboard', 'dashboard'].includes(tabName)) {
      for (var attr of window.key_template[tabName]) {
        table += '<tr>';
        table += '<td> + ' + attr + '</td>';
        table += '<td class="text-center"><label class="checkbox"><input type="checkbox" name="' + attr + '_show" data-attr="' + attr + '" data-role="show" ' + (tab[attr] && (tab[attr].show == 'true' || tab[attr].show == true) ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
        table += '</tr>';
      }
    } else if (['Navigation', 'navigation'].includes(tabName)) {
      table += this.createNavigation(tab, disabled);
    } else if (tabName == 'PermissionForm') {
      let _htmlttt = '';
      for (var attr in ACL) {
        if (!tab[attr]) { tab[attr] = { edit: false }; ACL[tabName][attr] = { edit: false }; }
        table += '<tr>';
        table += '<td> + ' + attr + '</td>';
        table += '<td class="text-center"><label class="checkbox"><input type="checkbox" name="' + attr + '_edit" data-attr="' + attr + '" data-role="edit" ' + (tab[attr] && (tab[attr].edit == 'true' || tab[attr].edit == true) ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
        table += '</tr>';
      }
    } else {
      for (var attr of window.key_template[tabName]) {
        if (attr.startsWith('btn') || attr.startsWith('View ')) {
          button.push(attr);
        } else {
          if (!tab[attr]) {
            tab[attr] = { read: false, show: false, add: false, edit: false };
          }
          table += '<tr>';
          table += '<td> + ' + attr + '</td>';
          table += '<td class="text-center"><label class="checkbox"><input type="checkbox" name="' + attr + '_read" data-attr="' + attr + '" data-role="read" ' + (tab[attr].read == 'true' || tab[attr].read == true ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
          table += '<td class="text-center"><label class="checkbox"><input type="checkbox" name="' + attr + '_show" data-attr="' + attr + '" data-role="show" ' + (tab[attr].show == 'true' || tab[attr].show == true ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
          table += '<td class="text-center"><label class="checkbox"><input type="checkbox" name="' + attr + '_add" data-attr="' + attr + '" data-role="add" ' + (tab[attr].add == 'true' || tab[attr].add == true ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
          table += '<td class="text-center"><label class="checkbox"><input type="checkbox" name="' + attr + '_edit" data-attr="' + attr + '" data-role="edit" ' + (tab[attr].edit == 'true' || tab[attr].edit == true ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
          table += '</tr>';
        }
      }
    }
    button.forEach(function (btn) {
      table += '<tr>';
      table += '<td> + ' + btn + '</td>'
      table += '<td class="text-center" colspan="4"><label class="checkbox"><input type="checkbox" name="' + btn + '_show" data-attr="' + btn + '" data-role="show" ' + (tab[btn] && (tab[btn].show === true || tab[btn].show === 'true') ? 'checked' : '') + disabled + '><i></i></label>' + '</td>';
      table += '</tr>';
    });
    table += '</tbody>';
    table += '</table>';
    return table;
  },
  canEditForm: function (permission, form) {
    if (!permission[form]) return false;
    return (permission[form].edit == true || permission[form].edit == 'true');
  },
  saveRule: function () {
    var acl = ACL;
    // $('.checkbox-select-form').each(function (index, elem) {
    //   if ($(elem).prop('checked') == false) {
    //     delete acl[elem.value];
    //   };
    // });
    var _mydata = {
      token: localStorage.getItemValue('token'),
      acl_rules: JSON.stringify([acl]),
      unit: $('#unit').val(),
      level: $('#levels').val(),
      jwt: localStorage.getItemValue('jwt'),
      ID: $('select[name=group]').val(),
      private_key: localStorage.getItemValue('userID'),
    };
    if (_mydata.ID == '') {
      messageForm('Please select group', false);
      return;
    }

    $.ajax({
      url: link._aclRuleUpdate,
      type: 'post',
      data: _mydata,
      success: function (res) {
        if (res.startsWith('{')) {
          var _data = JSON.parse(res);
          if (_data.ERROR == '') {
            if (_mydata.ID && _mydata.ID != '') {
              messageForm('You have successfully update rule for ' + $('select[name=group] option:selected').text(), true);
            } else {
              messageForm('You have successfully update rule for ' + _mydata.unit + ' ' + _mydata.level, true);
            }
            if (_mydata.ID == id) {
              var saveToSession = function (acl) {
                $.ajax({
                  url: link.saveSession,
                  type: 'post',
                  data: { data: { int_acl: acl } },
                  success: function () {
                  }
                })
              }
              var data = JSON.parse(localStorage.getItemValue('int_acl'));
              data[0].acl_rules = _mydata.acl_rules;
              saveToSession(data);
            }
          } else {
            messageForm('Error! An error occurred. ' + data.ERROR, false)
          }
        }

      }
    });
  },
  createNavigation: function (navigationJSON, disabled) {
    var myResult = '';

    for (var key in window.navi_sort) {
      myResult += this.createNavItem(key, window.navi_sort[key], 0, null, navigationJSON, disabled, '');
    }
    return myResult;
  },
  createNavItem: function (navName, navtab, level, parent, navigation, disabled, result) {
    if (!navigation[navName]) {
      navigation[navName] = { show: false };
      ACL.Navigation[navName] = { show: false };
    }
    var children = [];
    var navSubTxt = '';
    if (navtab.sub) {
      navtab.sub.forEach(function (element) {
        for (var key in element) {
          children.push(key);
          navSubTxt += ACLRole.prototype.createNavItem(key, element[key], level + 1, navName, navigation, disabled, '');
        }
      })
    }
    var st = '<tr data-level="' + level + '">' +
      '<td class="nav-level' + level + '">' + navtab.title + '</td>' +
      '<td>' + navName + '</td>' +
      '<td class="text-center"><label class="checkbox"><input type="checkbox" class="nav-attribute" name="' + navName + '_show" data-attr="' + navName + '" data-role="show"' + (parent ? ' data-parent="' + parent + '"' : '') + (children.length > 0 ? ' data-children="' + children.join(',') + '"' : '') + ' ' + (navigation[navName].show == 'true' || navigation[navName].show == true ? 'checked' : '') + disabled + '><i></i></label>' + '</td>' +
      '</tr>';
    result += st;
    result += navSubTxt;
    return result;
  },
  eventNav: function () {
    $(document).unbind('change', 'input:checkbox.nav-attribute:not([disabled])')
    $(document).on('change', 'input:checkbox.nav-attribute:not([disabled])', function () {
      var child = $(this).data('children');
      var status = $(this).prop('checked');
      var parent = $(this).data('parent');
      if (child != undefined && child != null && status == false) {
        child.split(',').forEach(function (children) {
          $('[data-attr="' + children + '"][data-role=show]').prop('checked', false).change();
        });
      }
      if (parent && status == true) {
        $('[data-attr="' + parent + '"][data-role=show]').prop('checked', true).change();
      }
    });
  }
}

new ACLRole().init();