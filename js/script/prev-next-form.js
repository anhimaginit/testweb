function ControlPage(container = '#content') {
    let that = this;
    this.option = this.getFormOption()
    this.makeButton('nextTask', 'next', container);
    this.makeButton('prevTask', 'prev', container);
    setTimeout(function () {
        $('#nextTask').insertAfter('#prevTask');
        $('#nextTask').tooltip();
        $('#prevTask').tooltip();
    }, 1500);
}
ControlPage.constructor = ControlPage;
ControlPage.prototype = {
    makeButton: function (id, text, container, callback) {
        if ($(container).find('#' + id)[0]) return;
        else {
            let that = this;
            let _innerText = '';
            switch (text) {
                case 'pre':
                case 'prev':
                case 'previous':
                    _innerText = '<i class="fa fa-1dot5x fa-angle-left"></i>';
                    break;
                case 'next':
                    _innerText = '<i class="fa fa-1dot5x fa-angle-right"></i>'
                    break;
            }
            that.getButtonID(text == 'next' ? 1 : 0, function (str, value) {
                let disabled = false;
                let disable_text = '';
                tooltipText = ''
                if (!value || value == '') {
                    disabled = true;
                    disable_text = ' disabled';
                } else {
                    tooltipText = ` rel="tooltip" data-title="${text} page" data-placement="top"`
                }
                let _html = `
                <a id="${id}"${!disabled ? ' href="./' + that.urlLinkChange() + '?id=' + value + '"' : ''} class="button-icon btn-default jarviswidget-toggle-btn pointer"${tooltipText}${disable_text}>${_innerText}</a>`;
                $(container).prepend(_html);
                if (callback) callback();
            })
        }
    },
    getFormOption: function () {
        let link = this.urlLinkChange();
        if (link.includes('contact')) {
            return { table: 'contact', params: 'contactlist' }
        } else if (link.includes('order')) {
            return { table: 'orders', params: 'orderlist' }
        } else if (link.includes('warranty')) {
            return { table: 'warranty', params: 'warrantylist' }
        } else if (link.includes('product')) {
            return { table: 'products', params: 'productlist' }
        } else if (link.includes('invoice')) {
            return { table: 'invoice', params: 'invoicelist' }
        } else if (link.includes('claim')) {
            return { table: 'claims', params: 'claimlist' }
        } else if (link.includes('company')) {
            return { table: 'company', params: 'companylist' }
        } else if (link.includes('help-desk') || link.includes('ticket')) {
            return { table: 'helpdesk', params: 'helpdesklist' }
        } else if (link.includes('task')) {
            return { table: 'assign_task', params: 'tasklist' }
        } else if (link.includes('discount')) {
            return { table: 'discount', params: 'discountlist' }
        } else if (link.includes('group')) {
            return { table: 'groups', params: 'grouplist' }
        }
    },
    getCurrentPage: function () {
        return window.location.hash + '';
    },

    urlLinkChange: function () {
        return this.getCurrentPage().replace('?' + this.getParams(), '');
    },

    getButtonID: function (index, callback) {
        let that = this;
        let option = this.getFormOption();
        $.ajax({
            url: link._btnPrvOrNxt,
            type: 'post',
            data: $.extend({
                ID: getUrlParameter('id'),
                greater: index,
                table: option.table,
            }, template_data),
            dataType: 'json',
            success: function (res) {
                if (callback) callback(index, parseInt(res.ID));
            },
            error: function (e) {
                console.error(e);
            }
        })
    },

    getParams: function () {
        if (window.location.search != '') {
            return window.location.search + '';
        } else {
            return window.location.href.substring(window.location.href.indexOf('?') + 1)
        }
    }
}