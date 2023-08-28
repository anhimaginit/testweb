/**
 * 
 * @param {*} option 
 * @ref url https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
function callAjax(option, callback) {
    var ajaxOptions = $.extend({
        statusCode: {
            500: function (res) {//Internal Server Error
                assignErrorPage(500, '<i class="fa fa-fw fa-times fa-lg text-danger"></i> Oooops, Something went wrong!', `
                <div>
                    <b>You have experienced a technical error. We apologize.</b>
                    <p>We are working hard to correct this issue. Please wait a few moments.</p>
                </div>`);
            },
            400: function (res) {//Bad Request
                assignErrorPage(400, '<i class="fa fa-fw fa-warning fa-lg text-warning"></i> Bad Request',
                    `<div>The page you requested could not be found, either contact your webmaster or try again.</div>`);
            },
            401: function (res) {//Unauthorized
                assignErrorPage(401, '<i class="fa fa-fw fa-warning fa-lg text-warning"></i> Unauthorized',
                    `<div>The page you requested could be unauthorized, either contact your webmaster or try again.</div>`);
            },
            403: function (res) {//403 Forbidden
                res = res.responseJSON;
                let url = option.url;
                if (res.ERROR !== '' && res.contact_duplicated && res.contact_duplicated.length > 0) {
                    switch (url) {
                        case link._contactEdit:
                        case link._contactAddNew:
                        case link._contactAddNewNotLogin:
                            if (window.location.href.indexOf('contact-form') > 0) {
                                /**
                                 * pane link to duplicate contact
                                 */
                                let duplicatess = [];
                                res.contact_duplicated.forEach(element => {
                                    duplicatess.push(`
                                    <a href="./#ajax/contact-form?id=${element.ID}">
                                        <div class="col-sm-4 col-xs-6 text-center">
                                            <div class="box-border hover-bg-warning padding-20">
                                            ${element.first_name ? element.first_name : ''} ${element.last_name ? element.last_name : ''}
                                            #${element.ID}
                                            </div>
                                        </div>
                                    </a>
                                    `);
                                });
                                /**
                                 * action button
                                 */
                                let button = [
                                    { id: 'btnConfirmOpen', text: 'Open Duplicated Contact', action: res.contact_duplicated.length == 1 ? "window.location.href='./#ajax/contact-form?id=" + res.contact_duplicated[0].ID + "';" : `openDuplicate('#duplicated_pane')`, className: 'btn-primary' },
                                    { id: 'btnCancel', text: 'Cancel', className: 'btn-default', action: "removeWhiteBox('#MsgBoxNotify')" }
                                ];

                                if (url == link._contactEdit) {
                                    button.splice(1, 0, {
                                        id: 'btnConfirmSelect', text: 'Save Anyway', action: function () {
                                            let duplicate_data = $.extend({}, option);
                                            duplicate_data.data.save_anyway = 1;
                                            duplicate_data.data.saveanyway = 2;
                                            saveAnyWay(duplicate_data);
                                            removeWhiteBox('#MsgBoxNotify');
                                        }, className: 'btn-primary'
                                    });
                                }

                                notifyWhiteBox('The contact is duplicate',
                                    `<b class="text-dark">Your information is duplicated in system</b><br/>
                                    <b>Email: ${option.data.primary_email}</b><br/>
                                    <b>Phone: ${option.data.primary_phone}</b><br/><hr>
                                    <div class="row" style="display:none" id="duplicated_pane">
                                        <div class="col-xs-12 text-dark">Open Contact Duplicate: </div>
                                        <div class="clearfix"></div>
                                        
                                        ${duplicatess.join('')}
                                    </div>
                                    <div class="clearfix"></div>
                                    `, button);
                            } else {
                                let itemSelecting = '';
                                if (window.location.href.indexOf('order-form') > 0) {
                                    itemSelecting = '#order_form [name=bill_to]';
                                } else if (window.location.href.indexOf('warranty') > 0) {
                                    itemSelecting = '[name=bill_to]';
                                    if (window.c_type_select) {
                                        itemSelecting = '#warranty_form [name=' + window.c_type_select + ']';
                                    }
                                }

                                let duplicatess = [];
                                res.contact_duplicated.forEach((element, index) => {
                                    duplicatess.push(`
                                    <div class="col-sm-4 col-xs-6 text-center forwardContact" data-index="${index}">
                                        <div class="box-border padding-20 hover-bg-warning">
                                        ${element.first_name ? element.first_name : ''} ${element.last_name ? element.last_name : ''}
                                        #${element.ID}
                                        </div>
                                    </div>
                                    `);
                                });

                                let button = [
                                    {
                                        id: 'btnConfirmOpen', text: 'Open Duplicated Contact', action: res.contact_duplicated.length == 1 ? "window.open('./#ajax/contact-form?id=" + res.contact_duplicated[0].ID + "', '_blank');" : function () {
                                            openDuplicate('#duplicated_pane');
                                            $('.forwardContact').unbind('click').on('click', function () {
                                                let data = res.contact_duplicated[$(this).data('index')];
                                                window.open('./#ajax/contact-form?id=' + data.ID, '_blank');
                                            })
                                        }, className: 'btn-primary'
                                    },
                                    {
                                        id: 'btnGetContactSelect', text: 'Get Contact', action: res.contact_duplicated.length == 1 ? function () {
                                            contactSelectBox(itemSelecting, res.contact_duplicated[0]);
                                        } : function () {
                                            openDuplicate('#duplicated_pane');
                                            $('.forwardContact').unbind('click').on('click', function () {
                                                let data = res.contact_duplicated[$(this).data('index')];
                                                contactSelectBox(itemSelecting, data);
                                            })

                                        }, className: 'btn-primary'
                                    },
                                    { id: 'btnCancel', text: 'Cancel', className: 'btn-default', action: "removeWhiteBox('#MsgBoxNotify')" }
                                ];

                                if (!localStorage.getItemValue('userID')) {
                                    button.shift();
                                }

                                notifyWhiteBox('The contact is duplicate',
                                    `<b class="text-dark">The informations is duplicate in system</b><br/>
                                    <b>Email: ${option.data.primary_email}</b><br/>
                                    <b>Phone: ${option.data.primary_phone}</b><br/><hr>
                                    <div class="row" style="display:none" id="duplicated_pane">
                                        <div class="col-xs-12 text-dark">Select Contact Exists: </div>
                                        <div class="clearfix"></div>
                                        
                                        ${duplicatess.join('')}
                                    </div>
                                    <div class="clearfix"></div>
                                    `, button);

                            }
                            break;
                        default:
                            break;
                    }
                }
            },
            404: function (res) {//Not Found
                assignErrorPage(404, '<i class="fa fa-fw fa-warning fa-lg text-warning"></i> Page Not Found',
                    `<div>The page you requested could not be found, either contact your webmaster or try again.</div>`);
            },
            200: function (res) {//OK

            },
            201: function (res) {//Created

            },
            203: function (res) {//Non-Authoritative Information

            },
            204: function (res) {//No Content return
                assignErrorPage(204, '<i class="fa fa-fw fa-warning fa-lg text-warning"></i> The server return no content response',
                    `<div>The requested URL haven't content. We are working hard to correct this issue.</div>`);
            }
        }
    }, option);
    $.ajax(ajaxOptions).done(function (res) {
        if (callback) callback(res);
    })
}

function assignErrorPage(code, text, content) {
    window.error_code_forward = code;
    window.error_text_forward = text
    window.error_content = content;
    window.preCode = $('#content').html();
    window.location.assign('./#ajax/error');
}

/**
 * 
 * @param {String} title 
 * @param {String} content 
 * @param {Array} action 
    [{id, text, action, className}]

 */
function notifyWhiteBox(title, content, action) {
    let _html = `
    <div class="divMessageBox animated fadeIn fast" style="background: #ffffff54" id="MsgBoxNotify">
        <div class="MessageBoxContainer animated fadeIn fast bg-color-white" style="border:1px solid #ccc; top:25%;" id="MsgBoxNotifyContent">
            <div class="MessageBoxMiddle">
                <span class="MsgTitle">
                    <label class="txt-color-orangeDark bold">${title}</label>
                </span>
                <section class="text-dark">${content}</section>
                <section class="MessageBoxButtonSection padding-10">`;
    for (var btn of action) {
        _html += `<button id="${btn.id || 'btnCancelMsgBoxNotify'}" class="btn ${btn.className || 'btn-default'}" ${btn.action && typeof btn.action == 'string' ? 'onclick="' + btn.action + '"' : ''}">${btn.text}</button >`
        if (typeof btn.action == 'function') {
            $(document).unbind('click', '#' + btn.id).on('click', '#' + btn.id, btn.action);
        }
    }

    _html += `</section>
            </div>
        </div>
    </div>`;

    $(document.body).append(_html);
}

function contactSelectBox(elem, data) {
    if (elem && elem !== '' && data && data.ID) {
        $(elem).append(`<option value="${data.ID}">${data.first_name ? data.first_name : ''} ${data.last_name ? data.last_name : ''}</option>`);
        removeWhiteBox('#MsgBoxNotify');
        $(elem).val(data.ID).trigger('change');
        $('.modal').modal('hide');
    }
}


function openDuplicate(elem) {
    $(elem).show()
}

function hideWhiteBox(elem) {
    $(elem).hide()
}

function removeWhiteBox(elem) {
    $(elem).remove()
}

function saveAnyWay(ajaxData) {
    callAjax(ajaxData);
}
