function ACLManagement() { }

ACLManagement.prototype = {
    init() {
        this.createView();
        this.loadUnitRole();
        this.bindEvent();
        return this;
    },
    bindEvent() {
        let that = this;
        $('.btnSearchACL').click(function () {
            that[action_search]();
        });

        $(document).unbind('change', '#acl_content .tab-content input[type="checkbox"]:not([disabled]), #acl_content .tab-content select:not([disabled])');

        $(document).unbind('click', '.btnSubmitTabACL').on('click', '.btnSubmitTabACL', function () {
            that.saveACL();
        });
        this.eventNav();
        this.eventCheckbox();
        this.eventSelect();

    },
    createView() {
        let that = this;

        $.get('php/getSession.php?data=int_acl&child=acl_rules-PermissionForm', function (res) {
            if (res && res != '') {
                window.userPermissionForm = Object.freeze(JSON.parse(res));
            }
        });

        $.get('js/script/acl/acl-navigation.json?update=' + Math.random(), function (res) {
            window.navigationACL = res;
        });

        $.get('js/script/acl/acl-key.json?update=' + Math.random(), function (res) {
            window.aclKEY = Object.freeze(res);
        });

        $.get('js/script/acl/acl-field.json?update=' + Math.random(), function (res) {
            window.initialViewJSON = Object.freeze(res);
            var headTab = [];
            var contentTab = [];

            for (form in res) {
                headTab.push(`<li><a href="#${res[form].id}" class="tab_form" data-toggle="tab" rel="tooltip" data-placement="top">${res[form].text}</a></li>`);
                contentTab.push(that.createTabContent(res[form], form));
            }

            $('#acl_content .tabbable ul.nav-tabs').html(headTab.join(''));
            $('#acl_content .tabbable .tab-content').html(contentTab.join(''));

            $('#acl_content .tabbable ul.nav-tabs li:first').addClass('active');
            $('#acl_content .tabbable .tab-content .tab-pane:first').addClass('in active');

            that.setCanEditDisplay(window.userPermissionForm);

            setTimeout(function () {
                makeTooltip('If this change is approved, the users will not be able to edit the ACLs in that tab', '#acl_content #PermissionForm [data-form="PermissionForm"][data-attr="PermissionForm"]');
            }, 2000);

        });
    },
    loadUnitRole: function (callback) {
        $.ajax({
            url: link._roles,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json',
            success: function (res) {
                if (res.ERROR == '') {
                    var optionsUnit = $('#unit').prop('options');
                    $('option', $('#unit')).remove();
                    if (!optionsUnit) return;
                    optionsUnit[0] = new Option('Select Unit', '', true, true);
                    res.units.forEach(function (unit) {
                        return optionsUnit[optionsUnit.length] = new Option(unit, unit, false, false);;
                    });

                    /** option for level select (role)*/
                    var optionsLevel = $('#levels').prop('options');
                    $('option', $('#levels')).remove();
                    if (!optionsLevel) return;
                    optionsLevel[0] = new Option('Select Role', '', true, true);
                    res.roles.forEach(function (unit) {
                        return optionsLevel[optionsLevel.length] = new Option(unit, unit, false, false);;
                    });
                    if (callback) callback();
                }
            }
        });
    },

    your_role: function () {
        var _self = this;
        $.get('php/getSession.php?data=int_acl', function (res) {
            if (res && res.length > 0) {
                res = JSON.parse(res);
                var role = res.acl_rules;
                let unit = localStorage.getItemValue('actor');
                let level = localStorage.getItemValue('level');
                $('#unit').val(unit);
                $('#levels').val(level);

                window.currentACLEdit = res.acl_rules;
                window.current_unit = unit;
                window.current_level = level;

                _self.fillValue(role, 'disabled');
                $('#acl_content .notify_your_role').remove();
                $('#acl_content').prepend('<h3 class="bg-primary padding-10 mg-5 notify_your_role">Your ACL • Unit: ' + localStorage.getItemValue('actor') + ' • Role: ' + localStorage.getItemValue('level') + '</h3>');
            }
        });
    },

    loadDefaultACL: function () {
        let that = this;
        let unit = $('#unit').val();
        let level = $('#levels').val();
        $('#acl_content .notify_your_role').remove();
        if (unit == '' || level == '' || !unit || !level) {
            messageForm('Please select unit and level', 'warning');
            return;
        }
        $.ajax({
            url: link._aclRules_Unit_Level,
            type: 'post',
            data: $.extend({
                unit: unit, level: level
            }, template_data),
            dataType: 'json',
            success: function (res) {
                if (res && res.acl_rules && res.acl_rules.length > 0) {
                    window.currentACLEdit = res.acl_rules[0];
                    window.current_unit = unit;
                    window.current_level = level;
                    that.fillValue(res.acl_rules[0]);
                } else {
                    that.clearContent();
                    messageForm('The ACL for unit: ' + unit + ' and role: ' + level + ' is not exists', 'warning');
                    $('.btnSubmitTabACL').prop('disabled', true).hide();
                }
            }
        });
    },
    loadGroupACL: function () {
        $('#acl_content .notify_your_role').remove();
        let that = this;
        let groupOption = $('#group option:selected')
        let unit = groupOption.data('unit');
        let level = groupOption.data('level');
        let group = $('#group').val();
        if (group == '') {
            messageForm('Please select group', 'warning');
            return;
        }
        $.ajax({
            url: link._aclRulesGroupID,
            type: 'post',
            data: $.extend({
                unit: unit, level: level, ID: group
            }, template_data),
            dataType: 'json',
            success: function (res) {
                if (res.group && res.group.acl && res.group.acl.length > 0) {
                    window.currentACLEdit = res.group.acl[0];
                    window.current_unit = unit;
                    window.current_level = level;
                    $('#unit').val(unit);
                    $('#levels').val(level);
                    that.fillValue(res.group.acl[0]);
                } else {
                    that.clearContent();
                }
            }
        });
    },
    clearContent: function () {
        $('#acl_content input:checkbox').prop('checked', false);
        $('#acl_content select').val('');
    },
    createTabContent: function (aclFormTemplate, form) {
        let _html = [];
        _html.push(`
        <div class="tab-pane" id="${aclFormTemplate.id}">
            <div>
                <form method="post" class="smart-form">
                    <table class="table table-bordered table-hover" style="width:100% ">`);
        function createSelectBox(head = false, attribute) {
            let text = `${head ? 'All ' : ''}
            <select class="no-border ${head ? 'w-90' : 'w-100 select-item'} bg-transparent" data-form="${form}" ${head ? ' data-role="selectAllSelect"' : ''}${attribute ? 'data-attr="' + attribute + '"' : ''}>`;
            text += '<option value="">None</option>'
            if (attribute && (attribute.startsWith('btn') || attribute == 'viewPrivateNote')) {
                text += `<option value="show">Show</option>`;
            } else {
                for (let key in aclFormTemplate.key) {
                    text += `<option value="${key}">${aclFormTemplate.key[key]}</option>`;
                }
            }
            text += '</select>';
            return text;
        }

        function createCheckbox(head = false, attribute) {
            let text = ``;
            if (attribute && (attribute.startsWith('btn') || attribute == 'viewPrivateNote')) {
                return ` <label class="checkbox">
                <input type="checkbox"${head ? '' : ' class="select-item"'} data-form="${form}" ${attribute ? 'data-attr="' + attribute + '"' : (head ? 'selectAllSelect' : 'show')} data-role="show">
                <i></i>&nbsp;${head ? 'All' : ''}
            </label>`
            }
            for (let key in aclFormTemplate.key) {
                text += `
                <label class="checkbox">
                    <input type="checkbox"${head ? '' : ' class="select-item"'} data-form="${form}" data-role="${head ? 'selectAllSelect" data-attr="' + key : key}" ${attribute ? ' data-attr="' + attribute + '"' : ''}>
                    <i></i>&nbsp;${head ? 'All' : ''}
                </label>`;
            }
            return text;
        }

        let createBox = aclFormTemplate.type == 'select' ? createSelectBox : createCheckbox;
        var head = ''
        _html.push(
            `<thead>
                <tr>
                    ${form == 'Navigation' ? '<th>Title</th><th>Key</th>' : '<th>Attribute</th>'}
                    <th>${createBox(true)}</th>
                </tr>
            </thead>`
        );


        _html.push(`<tbody>`);
        if (form == 'Navigation') {
            _html.push(this.createNavigation(window.navigationACL))
        } else {
            for (var item in aclFormTemplate.field) {
                _html.push(`
                <tr>
                <td>${aclFormTemplate.field[item]}</td>
                <td>${createBox(false, item)}</td>
                </tr>
                `);
            }
        }
        _html.push(`</tbody>`);
        _html.push('</table>');
        _html.push('<footer><button class="btnSubmitTabACL btn btn-primary pull-right" type="button">Save</button></footer>');
        _html.push('</form>');
        _html.push('</div>');
        _html.push('</div>');

        return _html.join('');
    },
    createNavigation: function (navigationJSON) {
        var myResult = '';

        for (var navName in navigationJSON) {
            myResult += this.createNavItem(navName, navigationJSON[navName], 0, null, navigationJSON, '');
        }
        return myResult;
    },
    createNavItem: function (navName, navtab, level, parent, navigation, result) {
        let that = this;
        if (!navigation[navName]) {
            navigation[navName] = { show: false };
        }
        var children = [];
        var navSubTxt = '';
        if (navtab.sub) {
            navtab.sub.forEach(function (element) {
                for (var key in element) {
                    children.push(key);
                    navSubTxt += that.createNavItem(key, element[key], level + 1, navName, navigation, '');
                }
            })
        }
        var st = '<tr data-level="' + level + '">' +
            '<td class="nav-level' + level + '">' + navtab.title + '</td>' +
            '<td>' + navName + '</td>' +
            '<td class="text-center"><label class="checkbox"><input type="checkbox" class="nav-attribute select-item" data-form="Navigation" data-attr="' + navName + '" data-role="show"' + (parent ? ' data-parent="' + parent + '"' : '') + (children.length > 0 ? ' data-children="' + children.join(',') + '"' : '') + ' ' + (navigation[navName].show == 'true' || navigation[navName].show == true ? 'checked' : '') + '><i></i></label>' + '</td>' +
            '</tr>';
        result += st;
        result += navSubTxt;
        return result;
    },
    fillValue: function (acl, disabledButton) {
        this.clearContent();
        for (let form in acl) {
            for (let attr in acl[form]) {
                delete window.currentACLEdit[form][attr]['read'];
                delete window.currentACLEdit[form][attr]['display'];
                if (attr.startsWith('btn') || ['viewPrivateNote'].includes(attr)) {
                    if (acl[form][attr].show == true || acl[form][attr].show == 'true') {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('show')
                    } else {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('')
                    }
                } else if (['ControlListForm'].includes(form)) {
                    for (let role in acl[form][attr]) {
                        if (acl[form][attr][role] == true || acl[form][attr][role] == 'true') {
                            $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val(role);
                        }
                    }
                } else if (window.initialViewJSON[form].type.includes('checkbox')) {
                    for (let role in acl[form][attr]) {
                        let checked = acl[form][attr][role] == 'true' || acl[form][attr][role] == true;
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"][data-role="' + role + '"]').prop('checked', checked);
                    }
                } else if (window.initialViewJSON[form].type.includes('select')) {
                    if ((acl[form][attr].add == 'true' || acl[form][attr].add == true) && (acl[form][attr].edit == true || acl[form][attr].edit == 'true')) {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('addEdit')
                    } else if (acl[form][attr].add == 'true' || acl[form][attr].add == true) {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('add')
                    } else if (acl[form][attr].edit == true || acl[form][attr].edit == 'true') {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('edit')
                    } else if (acl[form][attr].show == true || acl[form][attr].show == 'true') {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('show');
                    } else {
                        $('#' + form + ' [data-form="' + form + '"][data-attr="' + attr + '"]').val('');
                    }
                }
            }
        }

        if (disabledButton) {
            $('.btnSubmitTabACL').hide();
            $('.btnSubmitTabACL').prop('disabled', true);
        } else {
            $('.btnSubmitTabACL').show();
            $('.btnSubmitTabACL').prop('disabled', false);
        }
    },
    setCanEditDisplay(aclPermission) {
        $('#acl_content .tabbable .tab-content .notify-nochange').remove();
        for (var key in window.aclKEY) {
            if ((aclPermission && aclPermission[key] && (aclPermission[key].edit == true || aclPermission[key].edit == 'true')) || isSystemAdmin()) {
                $('#acl_content .tabbable .nav-tabs li:has(a[href="#' + key + '"])').removeClass('cannot-edit');
                $('#acl_content .tabbable .tab-content #' + key + ' select, #acl_content .tabbable .tab-content #' + key + ' input').prop('disabled', false);
                $('#acl_content .tabbable .tab-content #' + key + ' select, #acl_content .tabbable .tab-content #' + key + ' input').removeClass('input-readonly');
                $('#acl_content .tabbable .tab-content #' + key + ' .notify-nochange').remove();
            } else {
                $('#acl_content .tabbable .nav-tabs li:has(a[href="#' + key + '"])').addClass('cannot-edit');
                $('#acl_content .tabbable .tab-content #' + key + ' select, #acl_content .tabbable .tab-content #' + key + ' input').prop('disabled', true);
                $('#acl_content .tabbable .tab-content #' + key + ' select, #acl_content .tabbable .tab-content #' + key + ' input').addClass('input-readonly');
                $('#acl_content .tabbable .tab-content #' + key).prepend('<h3 class="text-danger notify-nochange"><i class="fa fa-cog"></i> &nbsp;&nbsp;&nbsp;This form can\'t change</h3>')

            }
        }
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
    },
    eventCheckbox: function () {
        $(document).on('change', '#acl_content .tab-content input[type="checkbox"]:not([disabled])', function () {
            if (!window.currentACLEdit) {
                messageForm('Please select unit and level', 'warning');
                return;
            }
            let $this = $(this);
            let form = $this.data('form'),
                attr = $this.data('attr'),
                role = $this.data('role'),
                status = $this.prop('checked');
            if (!window.currentACLEdit[form]) window.currentACLEdit[form] = {};
            if (!window.currentACLEdit[form][attr] && !['selectAllSelect', 'addEdit'].includes(role)) window.currentACLEdit[form][attr] = {};
            switch (role) {
                case 'selectAllSelect':
                    $('#' + form + ' input.select-item[data-form="' + form + '"][data-role="' + attr + '"]').prop('checked', status).trigger('change');
                    break;
                default:
                    window.currentACLEdit[form][attr][role] = status;
                    break;

            }
        })
    },
    eventSelect: function () {
        $(document).on('change', '#acl_content .tab-content select:not([disabled])', function () {
            if (!window.currentACLEdit) {
                messageForm('Please select unit and level', 'warning');
                return;
            }
            let $this = $(this);
            let form = $this.data('form'),
                attr = $this.data('attr'),
                role = $this.data('role') || $this.val(),
                value = $this.val();
            if (!window.currentACLEdit[form]) window.currentACLEdit[form] = {};
            if (!window.currentACLEdit[form][attr] && !['selectAllSelect'].includes(role)) window.currentACLEdit[form][attr] = {};
            switch (role) {
                case 'selectAllSelect':
                    $('#' + form + ' select.select-item[data-form="' + form + '"]').val(value).trigger('change');
                    $('#' + form + ' select.select-item[data-form="' + form + '"][data-attr="viewPrivateNote"]').val(value == '' ? '' : 'show').trigger('change');
                    $('#' + form + ' select.select-item[data-form="' + form + '"][data-attr*="btn"]').val(value == '' ? '' : 'show').trigger('change');
                    break;
                case 'add':
                    window.currentACLEdit[form][attr]['add'] = true;
                    window.currentACLEdit[form][attr]['edit'] = false;
                    window.currentACLEdit[form][attr]['show'] = true;
                    break;
                case 'edit':
                    window.currentACLEdit[form][attr]['add'] = false;
                    window.currentACLEdit[form][attr]['edit'] = true;
                    window.currentACLEdit[form][attr]['show'] = true;
                    break;
                case 'show':
                    window.currentACLEdit[form][attr]['add'] = false;
                    window.currentACLEdit[form][attr]['edit'] = false;
                    window.currentACLEdit[form][attr]['show'] = true;
                    break;
                case 'addEdit':
                    window.currentACLEdit[form][attr]['add'] = true;
                    window.currentACLEdit[form][attr]['edit'] = true;
                    window.currentACLEdit[form][attr]['show'] = true;
                    break;
                case '':
                    window.currentACLEdit[form][attr]['add'] = false;
                    window.currentACLEdit[form][attr]['edit'] = false;
                    window.currentACLEdit[form][attr]['show'] = false;
                    break;
                default:
                    if (form == 'ControlListForm') {
                        window.currentACLEdit[form][attr] = {};
                        window.currentACLEdit[form][attr][value] = true;
                    } else {
                        window.currentACLEdit[form][attr][value] = true;
                    }

            }
        })
    },

    saveACL: function () {
        if (!window.currentACLEdit) {
            messageForm('Please select unit and level', 'warning');
            return;
        }

        var _myData = {
            token: localStorage.getItemValue('token'),
            unit: window.current_unit,
            level: window.current_level,
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            acl_rules: JSON.stringify([window.currentACLEdit]),
        };

        if ($('#group')[0]) {
            _myData.ID = $('#group').val();
            if (!_myData.ID || _myData.ID == '') {
                messageForm('Please select group', 'warning');
                return;
            }
        }

        // console.log(JSON.stringify(_myData));

        $.ajax({
            url: action_form,
            type: 'post',
            dataType: 'json',
            data: _myData,
            success: function (res) {
                if (res.ERROR == '') {
                    if (_myData.ID && _myData.ID != '') {
                        messageForm('You have successfully update rule for ' + $('#group option:selected').text(), true);
                    } else {
                        messageForm('You have successfully update rule for ' + _myData.unit + ' ' + _myData.level, true);
                    }
                } else {
                    messageForm('Error! An error occurred. ' + res.ERROR, false);
                }
            }
        })

    }

}

var acl_manage = new ACLManagement().init();

// "contactlist" : "Contact List",
// "contactreport": "Contact Report",
// "productlist" : "Product List",
// "productreport": "Product Report",
// "companylist" : "Company List",
// "companyreport" : "Company Report",
// "warrantylist" : "Warranty List",
// "warrantyreport": "Warranty Report",
// "invoicelist" : "Invoice List",
// "invoicereport" : "Invoice Report",
// "claimlist" : "Claim List",
// "claimreport" : "Claim Report",
// "tasklist" : "Task List",
// "helpdesklist": "Help Desk List",
// "grouplist": "Group List"