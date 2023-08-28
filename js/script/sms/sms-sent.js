function SMSsent() {
    window.currentPage = 1;
    window.currentPageLength = 25;
    window.linkForTable = '';
    window.SMSTable = '';
    delete window.myDataTable;
}

SMSsent.prototype = {
    constructor: SMSsent,

    bindEvent: function () {
      $(document).on('click', '.btnBackContent', function () {
            $('.mail-box').show();
            $('.mail-detail').remove();
        });
    },

    setLink: function (linkSet) {
        window.linkForTable = linkSet;
    },

    loadListSMS: function (linkURL, table) {
        SMSsent.prototype.setLink(linkURL);
        if (!linkURL || !table) return;
        var phone_number = $("#phone_inbox_get").val();
        var contact = $("#contact_inbox_get").val();
        var _data = {
            token: localStorage.getItemValue('token'),
            phone: phone_number,
            contactID: contact

        };

        //alert(_data.phone);
        $.ajax({
            url: linkURL,
            type: 'post',
            dataType: 'json',
            data: _data,
            success: function (res) {
                SMSsent.prototype.displayListSMS(res.list, table);
            },
            error: function (e) {

            }
        })
    },

    displayListSMS: function (list, table) {
        let that = this;
        window.SMSTable = table;
        window.myDataTable = $(table).DataTable({
            destroy: true,
            data: list,
            filter: false,
            search: false,
            paging: true,
            bInfo: false,
            order: [[0, 'desc']],
            columns: [
                { data: function (data) { return data.ID }, className: 'hidden' },
                { data: function (data) { if (data.msg_to) { return data.msg_to } else { return '' } }, className: 'view-message dont-show text-left' },
                { data: function (data) {
                    return '<span>' + '<a href="#ajax/contact-form.php?id='+ data.receiverID + '">'+ data.receiverName + '</a>'+ '</span>';
                }, className: 'view-message' },
                { data: function (data) { return data.body }, className: 'view-messag' },
            //    { data: function (data) { return data.senderID }, className: 'hidden' },
            //    { data: function (data) { return data.receiverID }, className: 'hidden' },
                { data: function (data) {
                    if(data.timestamp !=null) {
                        var d = new Date(data.timestamp * 1000);	// Convert the passed timestamp to milliseconds
                        var yyyy = d.getFullYear();
                        var mm = ('0' + (d.getMonth() + 1)).slice(-2);	// Months are zero based. Add leading 0.
                        var dd = ('0' + d.getDate()).slice(-2);			// Add leading 0.
                        var hh = d.getHours();
                        var h = hh;
                        var min = ('0' + d.getMinutes()).slice(-2);	// Add leading 0.
                        var ampm = 'AM';
                        var time;

                        if (hh > 12) {
                            h = hh - 12;
                            ampm = 'PM';
                        } else if (hh === 12) {
                            h = 12;
                            ampm = 'PM';
                        } else if (hh == 0) {
                            h = 12;
                        }

                        // ie: 2013-02-18, 8:35 AM
                        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
                        return time
                    }
                    return ''
                }, className: '' }
            ],
            createdRow: function (row, data, dataIndex) {
                //$(row).attr('title', 'Click to go to inbox with id is ' + data.ID);
            },
            initComplete: function () {

            }
        });
    },
}




