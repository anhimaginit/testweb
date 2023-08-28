var formType = 'invoice';
var reportListInput = {
    availableFields: ["updateTime"],
    customColumns: ["customer_name", "sale_name", "balance", "payment", "total", "createTime"],
    listField: {
        customer_name: {
            name: "Salesman",
            type: "select",
            value: {
                "Dan Pham": "Dan Pham",
                "anh ho": "anh ho",
            }
        },
        sale_name: {
            name: "Salesman",
            type: "select",
            value: {
                "Dan Pham": "Dan Pham",
                "anh ho": "anh ho",
            }
        },
        invoiceid: {
            name: "Invoice ID",
            type: "text"
        },
        balance: {
            name: "Order Name",
            type: "text"
        },
        payment: {
            name: "Payment",
            type: "text"
        },
        total: {
            name: "Total",
            type: "text"
        }
    }
}
var getReportListType = function () {
    $.get('php/getSession.php?data=int_acl&child=acl_rules-ControlListForm-invoicereport', function (res) {
        if (res && res != '') {
            window.report_type = res;
        } else {
            window.report_type = 'login_only';
        }
    });
}
getReportListType();
var writeForm = function (result) {
    var html = '';
    for (var k in result) {
        switch (result[k].type) {
            case "text":
                html += '<section class="col col-6">';
                html += '<label class="label labelName" data="' + k + '" >' + result[k].name + '</label>';
                html += '<label class="input">';
                html += '<input class="text-input" type="' + result[k].type + '" name="' + k + '" value="">';
                html += '</label>';
                html += '</section>';
                break;
            case "checkbox":
                html += '<section class="col col-6"><label class="label">Contact Types</label>';
                html += '<div class="inline-group">';
                result[k].value.forEach(function (element) {
                    html += '<label class="checkbox">';
                    html += '<input type="checkbox" name="' + k + '" value="' + element + '">';
                    html += '<i></i>' + element;
                    html += '</label>';
                });
                html += '</div>';
                html += '</section>';
                break;
            case "select":
                html += '<section class="col col-6">';
                html += '<label class="input">' + result[k].name + '</label>';
                html += '<select class="selectpicker" multiple data-live-search="true"name="' + k + '" >';
                var selectResult = result[k].value;
                for (var kk in selectResult) {
                    html += '<option value="' + kk + '">' + selectResult[kk] + '</option>';
                }
                html += '</select>';
                html += '</section>';
                break;
            default:
                html += "";
        }
    }
    return html;
}

// customColumns
var writeCustomColumns = function (result) {
    var html = '';
    for (var i = 0; i < result.length; i++) {
        html += '<input type="text" disabled="true" value="' + result[i] + '" id="' + result[i] + '" name="customColumns" draggable="true" ondragstart="drag(event)">';
    }
    return html;
}

// availableFields
var writeAvailableFields = function (result) {
    var html = '';
    for (var i = 0; i < result.length; i++) {
        html += '<input type="text" disabled="true" value="' + result[i] + '" id="' + result[i] + '" name="availableFields" draggable="true" ondragstart="drag(event)">';
    }
    return html;
}


// 
var writeSearchReportTable = function (data, maxPages) {

    $("#searchReportTable thead tr").html();
    $("#searchReportTable tbody tr").html();
    $("#searchReportTable tfoot tr").html();
    var html = '';
    var colspan = 0;
    for (var k in data[0]) {
        html += '<th>' + k + '</th>';
        colspan++
    }

    $("#searchReportTable thead tr").html(html);
    $("#searchReportTable tfoot tr td").attr('colspan', colspan);
    var html = '';
    for (var i = 0; i <= maxPages; i++) {
        html += '<label class="btn btn-sm btn-primary" onclick="clkLoadPagesReportTable(' + i + ')">' + (i + 1) + '</label>';
    }
    $("#searchReportTable tfoot tr td").html(html);

    var html = '';
    for (var k in data) {
        html += '<tr>';
        for (var v in data[k]) {
            html += '<td>' + data[k][v] + '</td>';
        }
        html += '</tr>';
    }

    $("#searchReportTable tbody").html(html);

    $("#searchReportTable thead tr").html();

}

var writeLoadOldReport = function () {

    var data = {};
    data.formType = formType;
    data.userID = localStorage.getItemValue('userID');

    var _mydata = { private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;

    //console.log(_mydata);

    $.ajax({
        url: host + '_reportLoadOld.php',
        type: 'POST',
        data: _mydata,
        success: function (res) {
            var resData = JSON.parse(res);
            $('#vrlLoadOldReport').val(JSON.stringify(resData));
            $('#sltLoadOldReport').html('<option value="" selected></option>');
            for (var k in resData.data) {
                $('#sltLoadOldReport').append('<option value="' + k + '">' + resData.data[k].name + '</option>');
            }

            $("#sltLoadOldReport").selectpicker("refresh");
            // console.log(res);
        }
    });

}

// onchange loadOldReport
$('select#sltLoadOldReport').on('change', function (e) {
    //load default value
    $("select[name=primary_state]").val([]);
    $("select[name=primary_state]").selectpicker("refresh");

    $("select[name=primary_city]").val([]);
    $("select[name=primary_city]").selectpicker("refresh");

    $("select[name=primary_postal_code]").val([]);
    $("select[name=primary_postal_code]").selectpicker("refresh");

    $('input[name=contact_type]').each(function () {
        this.checked = false;
    });
    //load default value

    var data = JSON.parse($('#vrlLoadOldReport').val()).data;
    var key = this.value;
    var loadingData = data[key];
    if (loadingData.availableFields == null) {
        loadingData.availableFields = [];
    }
    if (loadingData.customColumns == null) {
        loadingData.customColumns = [];
    }
    $("#boxAvailableFields").html(writeAvailableFields(loadingData.availableFields));
    $("#boxCustomColumns").html(writeCustomColumns(loadingData.customColumns));
    //console.log(loadingData);

    for (var k in loadingData.key) {
        if (k == "primary_state" || k == "primary_city" || k == "primary_postal_code") {
            if (k == "primary_state") { primary_state = loadingData.key[k] }
            if (k == "primary_city") { primary_city = loadingData.key[k] }
            if (k == "primary_postal_code") { primary_postal_code = loadingData.key[k] }
            $("select[name=" + k + "]").val(loadingData.key[k]);
            $("select[name=" + k + "]").selectpicker("refresh");
        } else {
            $("input[name=" + k + "]").val(loadingData.key[k]);
        }
    }

});

// var oncLoadOldReport = function(userID,formType,){
// loading value to input
// }

var getFormData = function (result) {
    var data = {};
    for (var k in result) {
        switch (result[k].type) {
            case "text":
                data[k] = $("input[name=" + k + "]").val();
                break;
            case "checkbox":
                var listCheckedData = $("input[name=" + k + "]:checkbox:checked").map(function () {
                    return $(this).val();
                }).get();
                data[k] = listCheckedData;
                break;
            case "select":
                data[k] = $("select[name=" + k + "]").val();
                break;
            default:
        }
    }
    return data;
}

$('input[name=contact_type]').click(function () {
    if ($(this).is(':checked')) {
        $(this).prop('checked', true).attr('checked', 'checked');
    } else {
        $(this).prop('checked', false).removeAttr('checked');
    }
})

//load form
$("#boxReport").html(writeForm(reportListInput.listField));
//end load form



//load customColumns
$("#boxAvailableFields").html(writeAvailableFields(reportListInput.availableFields));
$("#boxCustomColumns").html(writeCustomColumns(reportListInput.customColumns));
//end load customColumns



//click search contact
$("#btnSearchReport").click(function () {
    var data = {};
    data.key = getFormData(reportListInput.listField);

    var customColumns = $('#boxCustomColumns input').map(function () {
        return this.value;
    }).get();

    var availableFields = $('#boxAvailableFields input').map(function () {
        return this.value;
    }).get();

    data.customColumns = customColumns;
    data.availableFields = availableFields;
    data.numberOfRows = $('#sltNumberOfRows').val();
    data.showAllRows = $('#iptShowAllRows').prop("checked");
    data.pages = 0;

    data.createTimeStartDate = $('#createTimeStartDate').val();
    data.createTimeEndDate = $('#createTimeEndDate').val();
    data.updateTimeStartDate = $('#updateTimeStartDate').val();
    data.updateTimeEndDate = $('#updateTimeEndDate').val();

    var _mydata = { 'jwt': localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;

    // console.log(_mydata);
    $.ajax({
        url: link._reportInvoice,
        type: 'POST',
        data: _mydata,
        success: function (res) {
            var report = JSON.parse(res);
            //console.log(res);
            writeSearchReportTable(report.data, report.maxPages);
        }
    });
})

//click search contact
$("#btnDownloadCsvReport").click(function () {
    var data = {};
    data.key = getFormData(reportListInput.listField);

    var customColumns = $('#boxCustomColumns input').map(function () {
        return this.value;
    }).get();

    var availableFields = $('#boxAvailableFields input').map(function () {
        return this.value;
    }).get();

    data.createTimeStartDate = $('#createTimeStartDate').val();
    data.createTimeEndDate = $('#createTimeEndDate').val();
    data.updateTimeStartDate = $('#updateTimeStartDate').val();
    data.updateTimeEndDate = $('#updateTimeEndDate').val();

    data.customColumns = customColumns;
    data.availableFields = availableFields;

    data.customColumns = customColumns;
    data.availableFields = reportListInput.availableFields;
    // data.numberOfRows = $('#sltNumberOfRows').val();
    data.showAllRows = true;
    data.pages = 0;

    var _mydata = { 'jwt': localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;
    //console.log(data);
    $.ajax({
        url: link._reportDownloadCsvInvoice,
        type: 'POST',
        data: _mydata,
        success: function (res) {
            var report = JSON.parse(res);
            // console.log(res);
            var result = report.data;
            var arr = [];
            var arrName = [];

            for (var name in result[0]) {
                arrName.push(name);
            }
            arr.push(arrName);

            for (var k in result) {
                //console.log(result[k]);
                var arr1 = [];
                for (var j in result[k]) {
                    arr1.push(result[k][j]);
                }
                arr.push(arr1);
            }
            // console.log(arr);
            exportToCsv('export.csv', arr);

            //writeSearchReportTable(report.data,report.maxPages);            
        }
    });
});


$("#btnDownloadPdfReport").click(function () {
    var data = {};
    data.key = getFormData(reportListInput.listField);

    var customColumns = $('#boxCustomColumns input').map(function () {
        return this.value;
    }).get();

    var availableFields = $('#boxAvailableFields input').map(function () {
        return this.value;
    }).get();

    data.createTimeStartDate = $('#createTimeStartDate').val();
    data.createTimeEndDate = $('#createTimeEndDate').val();
    data.updateTimeStartDate = $('#updateTimeStartDate').val();
    data.updateTimeEndDate = $('#updateTimeEndDate').val();

    data.customColumns = customColumns;
    data.availableFields = availableFields;

    data.customColumns = customColumns;
    data.availableFields = reportListInput.availableFields;
    // data.numberOfRows = $('#sltNumberOfRows').val();
    data.showAllRows = true;
    data.pages = 0;

    var _mydata = { 'jwt': localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;
    //console.log(data);
    $.ajax({
        url: link._reportDownloadCsvInvoice,
        type: 'POST',
        data: _mydata,
        success: function (res) {
            var report = JSON.parse(res);
            // console.log(res);
            var result = report.data;
            var arr = [];
            var arrName = [];
            var docData = {};

            var doc = new jsPDF();
            // You can use html:
            doc.autoTable({ html: '#my-table' });

            for (var name in result[0]) {
                arrName.push(name);
            }
            docData.head = [arrName];

            for (var k in result) {
                var arr1 = [];
                for (var j in result[k]) {
                    arr1.push(result[k][j]);
                }
                arr.push(arr1);
                docData.body = arr;
            }

            doc.autoTable({
                head: docData.head,
                body: docData.body
            });

            doc.save('export' + formType + '.pdf');

        }
    });
});


//click change pages
var clkLoadPagesReportTable = function (pages) {
    var data = {};
    data.key = getFormData(reportListInput.listField);

    var customColumns = $('#boxCustomColumns input').map(function () {
        return this.value;
    }).get();

    var availableFields = $('#boxAvailableFields input').map(function () {
        return this.value;
    }).get();

    data.customColumns = customColumns;
    data.availableFields = availableFields;
    data.numberOfRows = $('#sltNumberOfRows').val();
    data.showAllRows = $('#iptShowAllRows').prop("checked");
    data.pages = pages;

    var _mydata = { 'jwt': localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;

    $.ajax({
        url: link._reportInvoice,
        type: 'POST',
        data: _mydata,
        success: function (res) {
            var report = JSON.parse(res);
            // console.log(report);
            writeSearchReportTable(report.data, report.maxPages);
        }
    });
}

// click save report
$("#btnSaveReport").click(function () {
    var data = {};
    data.key = getFormData(reportListInput.listField);
    data.key.createTimeStartDate = $('#createTimeStartDate').val();
    data.key.createTimeEndDate = $('#createTimeEndDate').val();
    data.key.updateTimeStartDate = $('#updateTimeStartDate').val();
    data.key.updateTimeEndDate = $('#updateTimeEndDate').val();

    data.name = $('#reportName').val();
    var customColumns = $('#boxCustomColumns input').map(function () {
        return this.value;
    }).get();

    var availableFields = $('#boxAvailableFields input').map(function () {
        return this.value;
    }).get();

    data.customColumns = customColumns;
    data.availableFields = availableFields;

    var _mydata = { 'jwt': localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;
    _mydata.type = formType;

    $.ajax({
        url: link._reportSave,
        type: 'POST',
        data: _mydata,
        success: function (res) {
            //var data = JSON.parse(res);
            //console.log(res);
            messageForm("The report is save successfully", true);
            writeLoadOldReport();
        }
    })
})

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

// Material Select Initialization
$('select').selectpicker();
// Material Select Initialization

function filterTable(myInputID, myTableID) {
    var res = document.getElementById(myInputID).value.toLowerCase();
    //console.log(res)
    $("#" + myTableID + " tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(res) > -1)
    });
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

//start Selectpicker function
// call Selectpicker input event
$(".bs-searchbox input.form-control").keyup(function () {
    var select = $(this).parent().parent().parent().children('select');
    if ($(this).val() != "") {
        loadSearchSelectpicker($(this).val(), select.attr("name"));
    }
});

var loadSearchSelectpicker = function (searchKey, name) {

    var data = {};
    data.formType = formType;
    data.formColumn = name;
    data.searchKey = searchKey;
    var _mydata = { private_key: localStorage.getItemValue('userID') };
    _mydata.token = localStorage.getItemValue('token');
    _mydata.jwt = localStorage.getItemValue('jwt');
    _mydata.data = data;

    $.ajax({
        // url: host + '_reportGetAllCity.php',
        url: host + '_reportLoadSearchSelectpicker.php',
        type: 'POST',
        data: _mydata,
        success: function (res) {
            var resData = JSON.parse(res);
            console.log(resData);
            $("select[name=" + name + "]").html('');
            resData.data.forEach(function (res) {
                $("select[name=" + name + "]").append('<option value="' + res[name] + '">' + res[name] + '</option>');
            });
            $("select[name=" + name + "]").selectpicker("refresh");
        }
    });
}
//end Selectpicker function

writeLoadOldReport();
