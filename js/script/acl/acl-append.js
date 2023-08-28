function ACLAppend() { }
delete template_append;
var template_append = Object.freeze({
    ControlListForm: {
        tab: {
            id: 'ControlListForm',
            name: 'Control List Form',
            type: 'radio'
        },
        content: {
            // contactlist: { login_only: true, group: false, child_group: false, all: false },
            // contactreport: { login_only: true, group: false, child_group: false, all: false },

            // companylist: { login_only: true, group: false, child_group: false, all: false },
            // companyreport: { login_only: true, group: false, child_group: false, all: false },

            orderlist: { login_only: true, group: false, child_group: false, all: false },
            orderreport: { login_only: true, group: false, child_group: false, all: false },

            // invoicelist: { login_only: true, group: false, child_group: false, all: false },
            // invoicereport: { login_only: true, group: false, child_group: false, all: false },

            // warrantylist: { login_only: true, group: false, child_group: false, all: false },
            // warrantyreport: { login_only: true, group: false, child_group: false, all: false },

            // claimlist: { login_only: true, group: false, child_group: false, all: false },
            // claimreport: { login_only: true, group: false, child_group: false, all: false },
        },
        header: { login_only: 'Login Only', group: 'Group', child_group: 'Child Group', all: 'All' }
    }
});

ACLAppend.prototype = {
    constructor: ACLAppend,
    addTab: function (tab, content, canEdit) {
        this.createTabHead(tab);
        this.createContentTab(tab, content, canEdit);
    },
    createTabHead: function (idTab) {
        let tab = typeof idTab == 'string' ? template_append[idTab].tab : idTab;
        if (!tab) return '';
        $('#acl_content .tabbable .nav-tabs').
            append('<li><a href="#' + tab.id + '" class="tab_form" data-toggle="tab" rel="tooltip" data-placement="top">' + tab.name + '</a></li>');
        return '<li><a href="#' + tab.id + '" class="tab_form" data-toggle="tab" rel="tooltip" data-placement="top">' + tab.name + '</a></li>';
    },
    createContentTab: function (idTab, canEdit) {
        let tmp = {};
        if (typeof idTab == 'string') {
            tmp = template_append[idTab];
        } else {
            tmp = idTab
        }
        if (!tmp) return '';
        let tab = tmp.tab;
        let content = $.extend({}, tmp.content);
        let head = tmp.header;
        let type = tab.type;

        let notify = canEdit ? '' : '<h3 class="text-danger"><i class="fa fa-cog"></i> &nbsp;&nbsp;&nbsp;This form can\'t change</h3>';
        disabled = '';
        if (!canEdit) disabled = ' disabled';
        let tabContent = '<div class="tab-pane" id="' + tab.id + '">';
        tabContent += notify;
        tabContent += '<div>';
        tabContent += '<form method="post" class="smart-form">';
        tabContent += '<table class="table table-bordered table-hover" style="width:100% ">';
        let thead = '<thead><tr>';
        thead += '<th rowspan="3">Attribute</th><th colspan="4" class="text-center">Action</th></tr><tr>'
        let tbody = '<tbody>';
        for (let elem in head) {
            thead += '<th>' + head[elem] + '</th>';
        }
        thead += '</tr><tr>';
        for (let elem in head) {
            thead += '<th><label class="' + type + '"><input type="' + type + '" name="head_checkAllItem" value="' + elem + '"' + disabled + 'data-role="checkAllItem"><i></i>&nbsp;</label></th>';
        }

        let tmp_content = {};

        for (let item in template_append[tab.id].content) {
            tbody += '<tr>';
            tbody += '<td>' + item + '</td>';
            if (type == 'radio') {
                if (content[item]) {
                    for (let attr in template_append[tab.id].content[item]) {
                        let isChecked = (content[item] == attr || content[item][attr] == 'true' || content[item][attr] == true);
                        tbody += '<td class="text-center"><label class="' + type + '"><input type="' + type + '" name="' + item + '" data-attr="' + item + '" data-role="' + attr + '"' + (isChecked ? ' checked' : '') + disabled + '><i></i></label>' + '</td>';
                        if (typeof content[item] == 'object') {
                            if (isChecked) content[item] = attr;
                        }
                    }
                } else {
                    content[item] = 'login_only';
                    for (let attr in template_append[tab.id].content[item]) {
                        tbody += '<td class="text-center"><label class="' + type + '"><input type="' + type + '" name="' + item + '" data-attr="' + item + '" data-role="' + attr + '"' + (template_append[tab.id].content[item][attr] == 'true' || template_append[tab.id].content[item][attr] === true ? ' checked' : '') + disabled + '><i></i></label>' + '</td>';
                    }
                }
            } else {
                if (content[item]) {
                    for (let attr in template_append[tab.id].content[item]) {
                        tbody += '<td class="text-center"><label class="' + type + '"><input type="' + type + '" name="' + item + '" data-attr="' + item + '" data-role="' + attr + '"' + (content[item][attr] == 'true' || content[item][attr] == true ? ' checked' : '') + disabled + '><i></i></label>' + '</td>';
                    }
                } else {
                    content[item] = template_append[tab.id].content[item];
                    for (let attr in template_append[tab.id].content[item]) {
                        tbody += '<td class="text-center"><label class="' + type + '"><input type="' + type + '" name="' + item + '" data-attr="' + item + '" data-role="' + attr + '"' + (template_append[tab.id].content[item][attr] == 'true' || template_append[tab.id].content[item][attr] === true ? ' checked' : '') + disabled + '><i></i></label>' + '</td>';
                    }
                }
            }
            tmp_content[item] = content[item];
            tbody += '</tr>';
        }

        thead += '</tr></thead>';
        tbody += '</tbody>';

        tabContent += thead;
        tabContent += tbody;
        tabContent += '</table>';
        tabContent += '</form>';
        tabContent += '</div>';
        tabContent += '<footer><button class="btnSubmitTab btn btn-primary pull-right" onclick="saveRule()">Save</button></footer>'
        tabContent += '</div>';
        ACL[tab.id] = tmp_content;
        $('#acl_content .tabbable .tab-content').append(tabContent);
        return tabContent;

    },
}