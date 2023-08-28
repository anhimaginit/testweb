function MergeForm() { }
MergeForm.pageno = 1;
MergeForm.pagelength = 10;
window.preOffset = 0;
var displayOneTime = 15;
/*var navbar = $("#total_and_merge");
var sticky = navbar.offsetTop;*/
MergeForm.prototype.constructor = MergeForm;

MergeForm.prototype = {
    init: function () {
    //    loadTable = this.loadTable;
        this.bindEvent();
        /*$(function () {
            if (window.location.href.indexOf('merge-form') > 0) {
                MergeForm.prototype.loadTable();
            }
        });*/
    },

    onWheelEvent: function () {
     //   alert("this is wheel event");
        if (!window.duplicateList) return;
        let top = $('.page-footer:last').offset().top;
        let offset = top - window.pageYOffset;
        let total_record = window.duplicateList.length;
        let subtract = top - document.documentElement.scrollTop;
        if (subtract < 900 && window.currentTotalDisplay < total_record) {
            document.removeEventListener('wheel', MergeForm.prototype.onWheelEvent);
        //    document.removeEventListener('scroll', MergeForm.prototype.onWheelEvent);
            window.preOffset = offset;
            MergeForm.prototype.loadMore();
        }


       /* var navbar = document.getElementById("total_and_merge");
        var sticky = navbar.offsetTop;

        if (window.pageYOffset >= sticky) {
        //   alert(sticky);
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }*/
    },

    bindEvent: function () {
        let that = this;

        document.onwheel = that.onWheelEvent;
    //    document.onscroll = that.onWheelEvent;

        // on merge form selection
        $('select#select-dp-type').on('change', function () {
            $('#tb_duplicate_list').empty();
            $('#count_info_dp').empty();
            $("#total_and_merge").css("display", "none");
            that.loadTable(this.value);
        });

        $("div#search_all_duplicate").find("#btn-get-all-dup-email").click(function () {
        //    alert("search");
            that.loadTable();
        });

        $("div#search_all_duplicate").find("#btn-get-all-dup-phone").click(function () {
        //   alert("search");
            that.loadTable('pr_phone');
        });



        $('#search_duplicate_item').click(function () {
        //    alert("this is it");
            $("#tb_duplicate_list").empty();
            $("#total_and_merge").css("display", "none");
        //    alert($(this).val());
            var _mydata = $.extend({}, template_data);
            var input_validate = $("#search_query").val();
        //    alert(input_validate);

            if (input_validate !== "") {  // If something was entered
                var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
            //    return pattern.test(email);
                if (pattern.test(input_validate)) {
                //    alert("this is email");
                    _mydata.primary_email = input_validate;
                    _mydata.primary_phone = "";
                    _mydata.searchbyemail = 1;
                } else {
                    _mydata.primary_email = "";
                    _mydata.primary_phone = input_validate;
                    _mydata.searchbyemail = 0;
                }
            }

        //    $('#tb_duplicate_list').empty();
        //    window.currentTotalDisplay = 0;
            that.loadoneItem(_mydata);
        });

        $('#tb_duplicate_list').delegate('td.details-control','click',function() {
        //   alert("is working?");
        //    alert("fapping");
            var tr  = $(this).closest('tr');
            var tb_id = $(this).closest('table').attr('id');

            var dt = $('#'+tb_id).DataTable();
            var row = dt.row(tr);

            if (row.child.isShown()) {
                tr.next('tr').removeClass('details-row');
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                var contact_id = row.data()['ID'];
            //    alert(contact_id);
            //    console.log(row.data());
                row.child(that.getmoreinfo(row.data())).show();
                tr.next('tr').addClass('details-row');
                tr.addClass('shown');

                var _noteTable = "#table_note_info" + contact_id;
                var _orderTable = "#table_order_list" + contact_id;
                var _warrantyTable = "#table_warranty_list" + contact_id;
                that.sub_DataTable(contact_id,'https://api.warrantyproject.com/_notes_contact.php',{
                    columns: [
                    //    { data: function (data) { if (data.order_title) { return data.order_title } else { return 'Warranty Order - ' + data.order_id } }, title: 'Title' },
                        { data: 'create_date', title: 'Date' },
                        { data: 'description', title: 'Title' },
                        { data: 'note', title: 'Note' },
                        { data: 'type', title: 'Type' },
                        { data: 'enter_by_name', title: 'Type' },

                    //    { data: function (data) { return numeral(data.total).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Total' },
                    //    { data: function (data) { return numeral(data.payment).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Payment' },
                    //    { data: function (data) { return numeral(data.balance).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Balance' },
                    ], table_id: _noteTable
                });

                that.sub_DataTable(contact_id,link._order_contact,{
                    columns: [
                        { data: function (data) { if (data.order_title) { return data.order_title } else { return 'Warranty Order - ' + data.order_id } }, title: 'Title' },
                        { data: 'b_name', title: 'Bill to' },
                        { data: function (data) { return numeral(data.total).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Total' },
                        { data: function (data) { return numeral(data.payment).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Payment' },
                        { data: function (data) { return numeral(data.balance).format('$ 0,0.00'); }, "searchable": true, className: 'text-right', title: 'Balance' },
                    ], table_id: _orderTable
                });

                that.sub_DataTable(contact_id,link._warranty_contact,{
                    columns: [
                        // { data: 'ID', title: '#&nbsp;ID', searchable: true },
                        { data: 'warranty_order_id', title: 'Order' },
                        { data: 'buyer', "searchable": true, title: 'Buyer' },
                        { data: 'warranty_address1', "searchable": true, title: 'Address' },
                        {
                            data: function (data) {
                                var _text = [];
                                data.warranty_type.forEach(function (item) {
                                    _text.push(item.prod_name);;
                                })
                                return _text.join(', ');
                            }, title: 'Type'
                        },
                        { data: 'salesman', "searchable": true, title: 'Salesman' },
                        { data: 'warranty_start_date', "searchable": true, title: 'Start Date' },
                        // { data: 'warranty_end_date', "searchable": true, title: 'End Date' },
                    ], table_id:_warrantyTable
                });
            }
        });

        $('#tb_duplicate_list').delegate('.editor_remove','click',function() {
        //    alert("the first click ever");

        //    $(this).closest('tr.details-row').remove();
            var tr  = $(this).closest('tr');
            var tb_id = $(this).closest('table').attr('id');
        //    alert(tb_id);

          /*  var dt = $('#'+tb_id).DataTable();
            var row = dt.row(tr);*/

            var dt = $('#'+tb_id).DataTable();
            var row = dt.row(tr);

            if (row.child.isShown()) {
            //    tr.next('tr').removeClass('details-row');
            //    row.child.hide();
                row.child.remove();
            //    tr.removeClass('shown');
            }
            $(this).parent().parent().remove();
        });


        $('[data-toggle="tooltip-see-more"]').tooltip();
        //handle unmerging on unmerge button click event
        $("div#more-info-merge-tbl").find("#btn-unmerge-dp").click(function () {
            alert("this is the unmerge button and is on the way to be implemented. no worries");
        });
    },


    sub_DataTable: function (contactID,APIurl,options) {
        var myData = $.extend({}, template_data);
        myData.contactID = contactID;

        $.ajax({
            url: APIurl,
            type: 'post',
            data: myData,
            dataType: 'json',
            success: function (res) {
                var list = res.list;
                $(options.table_id).DataTable({
                    sDom: "t" +
                        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                    data: list,
                    columns: options.columns,
                });

            },
            error: function (e) {
                reject(e);
            }
        });
    },

    loadoneItem: function (_data) {


        // var _mydata = $.extend({}, template_data_email);
        $.ajax({
            url: host + '_mergeGetContact_emailorphone.php',
            type: 'POST',
            data: _data,
            dataType: 'json',
            beforeSend: function () {
                $('#loading').show();
                // alert("it is still loading.Please be freaking patient");
            },
            complete: function () {
                $('#loading').hide();
                //  alert("It is loaded successfully. You can do everything you want now!");
            },
            success: function (result) {
              window.duplicateList = "";
              $("#total_and_merge").css("display", "block");
              $("#count_info_dp").empty();
              sessionStorage.setItem("total_array_count", result.length);
              $("#tb_duplicate_list").empty();
              //  $("#tb_duplicate_list").append("<p class='bold'>There are" + " " + result.length + " " + "duplicate " + (type == 'pr_phone' ? 'phones' : 'emails') + "</p>");
                var groupColumn = 4;
                $("#tb_duplicate_list").append("<table id='tbl-duplicate-item-" + 0 + "'" + "class='" + "table table-responsive table-bordered table-hover 'width='100%'>" + "<thead></thead><tbody></tbody><tfoot></tfoot></table>");

                var dt = $('#tbl-duplicate-item-0').DataTable({
                    sDom: "t" +
                        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'><'col-xs-12 col-sm-6'p>>",
                    "displayLength": 25,
                    "paging": false,
                    data: result[0],
                    destroy: true,
                    searching: false,
                    "columns": [
                        {
                            data: 'ID',
                            //    title: 'Reassign No',
                            //    width: 40,
                            render: function (data, type, full, meta) {
                                return "<input type='radio' name=" + "'dp_list_item_0" + "'" + "value='" + data + "'>";
                            }
                        },

                        {
                            className      : 'details-control',
                            defaultContent : '',
                            data           : null,
                            orderable      : false
                        },



                        {
                            data: 'first_name', "searchable": false, title: 'First Name'
                        },
                        { data: 'middle_name', searchable: false, title: 'Middle Name' },
                        { data: 'last_name', "searchable": false, title: 'Last Name' },
                        { data: 'primary_email', "searchable": false, title: 'Primary Email' },
                        { data: 'primary_phone', "searchable": false, title: 'Primary Phone' },
                        {
                            data: null,
                            title: 'Remove from Merge',
                            //    className: "center",
                            defaultContent: '<p href="#" style="text-align:center;" onclick="" class="btn btn-info btn-lg editor_remove"><span class="glyphicon glyphicon-minus"></span></p>'
                        }
                    ],
                });

                /*sessionStorage.setItem("total_array_count", result.length);
                $("#merge-btn").empty();
                $("#tb_duplicate_list").empty();
                for (var i = 0; i < result.length; i++) {
                    this.displayoneItemDuplicate(result[i], i);
                }*/

                //    $("#more-info-merge-tbl").empty();
            //    $("#count_info_dp").html("<p class='bold padding-5'>There are" + " " + result.length + " " + "duplicate " + (type == 'pr_phone' ? 'phones' : 'emails') + "</p>");
            }
        })
    },


    loadTable: function (type = 'pr_email') {
        template_data_email = {
            token: localStorage.getItemValue('token'),
            groupby: type == 'pr_phone' ? 'primary_phone' : 'primary_email'
        };

        let that = this;

        // var _mydata = $.extend({}, template_data_email);
        $.ajax({
            url: host + '_mergeGetContactGroup.php',
            type: 'POST',
            data: template_data_email,
            dataType: 'json',
            beforeSend: function () {
                $('#loading').show();
                // alert("it is still loading.Please be freaking patient");
            },
            complete: function () {
                $('#loading').hide();
                //  alert("It is loaded successfully. You can do everything you want now!");
            },
            success: function (result) {
                $("#total_and_merge").css("display", "block");

                window.duplicateList = result;
                window.preOffset = 0;
                window.currentTotalDisplay = 0
                //        MergeForm.prototype.displayList(result);
                //    Session["count"] = result.length;
                sessionStorage.setItem("total_array_count", result.length);
                $("#merge-btn").empty();
                $("#tb_duplicate_list").empty();
            //    $("#tb_duplicate_list").append("<p class='bold'>There are" + " " + result.length + " " + "duplicate " + (type == 'pr_phone' ? 'phones' : 'emails') + "</p>");

                let _listData = window.duplicateList;

                for (var i = 0; i < (_listData.length < displayOneTime ? _listData.length : displayOneTime); i++) {
                    that.displayItemDuplicate(_listData[i], i, type);
                    window.currentTotalDisplay = i + 1;
                }

                //    $("#more-info-merge-tbl").empty();
                $("#count_info_dp").html("<p class='bold'>There are" + " " + result.length + " " + "duplicate " + (type == 'pr_phone' ? 'phones' : 'emails') + "</p>");
            }
        })
    },


    displayoneItemDuplicate: function (data, index) {
        var groupColumn = 4;
        $("#tb_duplicate_list").append("<table id='tbl-duplicate-item-" + index + "'" + "class='" + "table table-responsive table-bordered table-hover 'width='100%'>" + "<thead></thead><tbody></tbody><tfoot></tfoot></table>");

        var dt = $('#tbl-duplicate-item-' + index).DataTable({
            "columnDefs": [
                { "visible": true, "targets": groupColumn }
            ],
        //    "order": [[0, 'asc']],
            "displayLength": 25,
            "paging": false,
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {

                        if (last !== undefined) {
                            //    groupColumn[last] = counter;
                        }

                        $(rows).eq(i).before(
                            '<tr class="purple"><td colspan="7">' + group + '</td></tr>'
                        );
                        last = group;
                    }
                });
            },
            data: data,
            destroy: true,
            searching: false,
            "columns": [
                {
                    data: 'ID',
                    //    title: 'Reassign No',
                    //    width: 40,
                    render: function (data, type, full, meta) {
                        return "<input type='radio' name=" + "'dp_list_item_" + index + "'" + "value='" + data + "'>";
                    }
                },

                {
                    className      : 'details-control',
                    defaultContent : '',
                    data           : null,
                    orderable      : false
                },

                {
                    data: 'first_name', "searchable": false, title: 'First Name'
                },
                { data: 'middle_name', searchable: false, title: 'Middle Name' },
                { data: 'last_name', "searchable": false, title: 'Last Name' },
                { data: 'primary_email', "searchable": false, title: 'Primary Email' },
                { data: 'primary_phone', "searchable": false, title: 'Primary Phone' },
                {
                    data: null,
                    title: 'Remove from Merge',
                    //    className: "center",
                    defaultContent: '<p href="#" style="text-align:center;" onclick="" class="btn btn-info btn-lg editor_remove"><span class="glyphicon glyphicon-minus"></span></p>'
                }
            ],
        });

        console.log(dt);
    },

    displayItemDuplicate: function (data, index, type) {
        $("#tb_duplicate_list").append("<div class='bold'>Index: " + (index + 1) + '/' + window.duplicateList.length + "</div><table id='tbl-duplicate-item-" + index + "'" + "class='" + "table table-responsive table-bordered table-hover 'width='100%'>" + "<thead></thead><tbody></tbody><tfoot></tfoot></table>");
        var groupColumn = type == 'pr_phone' ? 6 : 5;
        var dt = $('#tbl-duplicate-item-' + index).DataTable({
            sDom: "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'><'col-xs-12 col-sm-6'p>>",
            "columnDefs": [
                { "visible": true, "targets": groupColumn }
            ],
            "order": [[1, 'asc']],
            "displayLength": 25,
            "paging": false,
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {

                        if (last !== undefined) {
                            //    groupColumn[last] = counter;
                        }

                        $(rows).eq(i).before(
                            '<tr class="purple"><td colspan="7">' + group + '</td></tr>'
                        );
                        last = group;
                    }
                });
            },
            data: data,
            destroy: true,
            searching: false,
            "columns": [
                {
                    data: 'ID',
                    //    title: 'Reassign No',
                    //    width: 40,
                    render: function (data, type, full, meta) {
                        return "<input type='radio' name=" + "'dp_list_item_" + index + "'" + "value='" + data + "'>";
                    }
                },

                {
                    className      : 'details-control',
                    defaultContent : '',
                    data           : null,
                    orderable      : false
                },

                {
                    data: 'first_name', "searchable": false, title: 'First Name'
                },

                { data: 'middle_name', searchable: false, title: 'Middle Name' },
                { data: 'last_name', "searchable": false, title: 'Last Name' },
                { data: 'primary_email', "searchable": false, title: 'Primary Email' },
                { data: 'primary_phone', "searchable": false, title: 'Primary Phone' },
                {
                    data: null,
                    title: 'Remove from Merge',
                    //    className: "center",
                    defaultContent: '<p href="#" style="text-align:center;" onclick="" class="btn btn-info btn-lg editor_remove"><span class="glyphicon glyphicon-minus"></span></p>'
                }
            ],
        });
    },

    getmoreinfo: function (data) {
        return '<div class="tabbable contact-tab">' +
                '<ul class="nav nav-tabs bordered">' +
                    '<li class="active"><a href="#notesTab' + data.ID + '"' + 'data-toggle="tab" rel="tooltip" data-placement="top">Notes</a></li>' +
                    '<li data-tab="order-form" data-content="Order"><a href="#orderTab' + data.ID + '"' + 'data-toggle="tab" rel="tooltip" data-placement="top">Orders</a></li>' +
                    '<li data-tab="warranty-form-addnew" data-content="Warranty"><a href="#warrantyTab' + data.ID + '"' + 'data-toggle="tab" rel="tooltip" data-placement="top">Warranties</a></li>' +
                '</ul>' +
                '<div class="tab-content padding-10">' +
                    '<div class="tab-pane active div_contain_note_table" id="notesTab' + data.ID + '">' +
                        '<table id="table_note_info' + data.ID +  '"' + 'class="table table-bordered padding-10" style="table-layout: auto; width: 100%;"></table>' +

                    '</div>' +

                    '<div class="tab-pane" id="orderTab' + data.ID + '">' +
                        '<div>' +
                            '<table id="table_order_list' + data.ID +  '"' + 'class="table table-bordered table-striped" style="table-layout: auto; width: 100%;">' +
                                '<thead></thead>' +
                                '<tbody></tbody>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +

                    '<div class="tab-pane" id="warrantyTab' + data.ID + '">' +
                        '<div>' +
                            '<table id="table_warranty_list' + data.ID +  '"' + 'class="table table-bordered table-striped" style="table-layout: auto; width: 100%;">' +
                                '<thead></thead>' +
                                '<tbody></tbody>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    },
    loadMore: function () {
        $('#load-more').show();
        let that = this;
        let data = window.duplicateList;
        let iterator = window.currentTotalDisplay + displayOneTime < data.length ? window.currentTotalDisplay + displayOneTime : data.length;
        let type = $('#select-dp-type').val();

        for (var i = window.currentTotalDisplay; i < iterator; i++) {
            that.displayItemDuplicate(data[i], i, type);
        }
        window.currentTotalDisplay = iterator;
        document.onwheel = MergeForm.prototype.onWheelEvent
   //     document.onscroll = MergeForm.prototype.onWheelEvent;
        $('#load-more').hide();
    }
}


var _merge = new MergeForm()
_merge.init();



var nav = $('.btn-email-merge'), w = $(window), sTop = nav.offset().top

w.resize(function() {
    sTop = nav.offset().top
})

w.scroll(function() {

    
    if(w.scrollTop() > sTop) {

        nav.addClass('sticky') 
    } else {
    //    alert("khoang cach roll" + w.scrollTop());
    //    alert("khoang cach tu nav la" + sTop);
        nav.removeClass('sticky')
    }
})

//handle merging on merge button click event
$("div#more-info-merge-tbl").find("#btn-merge-dp").click(function () {
    //alert("The email merge button was clicked.");
    var option = $('select#select-dp-type').val();
    //  if(option ==)
    // pr_email
    var total = sessionStorage.getItem("total_array_count");

    for (var i = 0; i <= total; i++) {
        if ($('input[name=dp_list_item_' + i + ']:checked').length > 0) {
            var data_merge_col = [];

            //  var data_merge = {};
            var contact_keep = $('input[name=dp_list_item_' + i + ']:checked').val();

            //data_merge=>array('contact_keep'=>53085,'contact_was_merged'=>$contact_was_merged);

            var was_merged_arr = [];
            // do something here
            //
            var radio_values = document.querySelector('input[name=dp_list_item_' + i + ']:not(:checked)');

            $('input[name=dp_list_item_' + i + ']:not(:checked)').each(function () {
                was_merged_arr.push($(this).val());

            });
            data_merge_col.push({ contact_keep: contact_keep, contact_was_merged: was_merged_arr });
            template_merge_para = {
                token: localStorage.getItemValue('token'),
                jwt: localStorage.getItemValue('jwt'),
                private_key: localStorage.getItemValue('userID'),
                data_merge: data_merge_col
                //   login_id: localStorage.getItemValue('userID')
                //    groupby: 'primary_phone'
            };

            var _mydata = $.extend({}, template_merge_para);

            //calling ajax api
            $.ajax({
                url: 'https://api.warrantyproject.com/_mergeContacts.php',
                type: 'POST',
                data: _mydata,
                dataType: 'json',
                beforeSend: function () {
                    $('#loading').show();
                    // alert("it is still loading.Please be freaking patient");
                },
                complete: function () {
                    $('#loading').hide();
                    //  alert("It is loaded successfully. You can do everything you want now!");
                },
                success: function (result) {

                    // alert("merge contact succesfull, now go to order merge");
                    template_merge_para = {
                        token: localStorage.getItemValue('token'),
                        jwt: localStorage.getItemValue('jwt'),
                        private_key: localStorage.getItemValue('userID'),
                        data_merge: data_merge_col
                        //   login_id: localStorage.getItemValue('userID')
                        //    groupby: 'primary_phone'
                    };

                    var _mydata = $.extend({}, template_merge_para);

                    //calling ajax api
                    $.ajax({
                        url: 'https://api.warrantyproject.com/_mergeOrders.php',
                        type: 'POST',
                        data: _mydata,
                        dataType: 'json',
                        beforeSend: function () {
                            $('#loading').show();
                        },
                        complete: function () {
                            $('#loading').hide();
                            //  alert("It is loaded successfully. You can do everything you want now!");
                        },
                        success: function (result) {
                            template_merge_para = {
                                token: localStorage.getItemValue('token'),
                                jwt: localStorage.getItemValue('jwt'),
                                private_key: localStorage.getItemValue('userID'),
                                data_merge: data_merge_col
                                //   login_id: localStorage.getItemValue('userID')
                                //    groupby: 'primary_phone'
                            };

                            var _mydata = $.extend({}, template_merge_para);

                            //calling ajax api
                            $.ajax({
                                url: 'https://api.warrantyproject.com/_mergeWarranty.php',
                                type: 'POST',
                                data: _mydata,
                                dataType: 'json',
                                beforeSend: function () {
                                    $('#loading').show();
                                },
                                complete: function () {
                                    $('#loading').hide();
                                },
                                success: function (result) {

                                    //calling ajax api
                                    $.ajax({
                                        url: 'https://api.warrantyproject.com/_mergeInvoice.php',
                                        type: 'POST',
                                        data: _mydata,
                                        dataType: 'json',
                                        beforeSend: function () {
                                            $('#loading').show();
                                            // alert("it is still loading.Please be freaking patient");
                                        },
                                        complete: function () {
                                            $('#loading').hide();
                                            //  alert("It is loaded successfully. You can do everything you want now!");
                                        },
                                        success: function (result) {
                                            $.ajax({
                                                url: 'https://api.warrantyproject.com/_mergeClaim.php',
                                                type: 'POST',
                                                data: _mydata,
                                                dataType: 'json',
                                                beforeSend: function () {
                                                    $('#loading').show();
                                                    // alert("it is still loading.Please be freaking patient");
                                                },
                                                complete: function () {
                                                    $('#loading').hide();
                                                    //  alert("It is loaded successfully. You can do everything you want now!");
                                                },
                                                success: function (result) {
                                                    $.ajax({
                                                        url: 'https://api.warrantyproject.com/_mergeNote.php',
                                                        type: 'POST',
                                                        data: _mydata,
                                                        dataType: 'json',
                                                        beforeSend: function () {
                                                            $('#loading').show();
                                                        },
                                                        complete: function () {
                                                            $('#loading').hide();
                                                        },
                                                        success: function (result) {
                                                            messageForm('Merged to selected contacts successfully', true);
                                                        },

                                                        error: function (xhr, textStatus, error) {
                                                        }
                                                    })
                                                },

                                                error: function (xhr, textStatus, error) {
                                                }
                                            })


                                        },

                                        error: function (xhr, textStatus, error) {
                                            //    console.log(JSON.stringify(data_merge));
                                        }
                                    })


                                },

                                error: function (xhr, textStatus, error) {
                                }
                            })

                        },

                        error: function (xhr, textStatus, error) {
                        }
                    })

                },

                error: function (xhr, textStatus, error) {
                }
            })

        }
    }




});