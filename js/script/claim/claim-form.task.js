var taskTemplateCheckList = [];
var allowTime = [];
for (let i = 0; i < 24; i++) {
    for (let j = 15; j < 60;) {
        allowTime.push(`${i}:${j}`);
        j += 15;
    }
}
$("input:checked[name='taskTemplateCheckList[]']").each(function () {
    taskTemplateCheckList.push($(this).val());
});

$("#btnAddTaskItem").click(function () {

    // Parse our locale string to [date, time]
    var date = new Date();
    date.setUTCDate(date.getDate() + 2);
    date = date.toLocaleString('en-US', { hour12: false }).split(" ");

    // Now we can access our time at date[1], and monthdayyear @ date[0]
    var time = date[1];//.split(":");
    //time = time[0]+":"+time[1];
    var mdy = date[0];

    // We then parse  the mdy into parts
    mdy = mdy.split('/');
    var month = parseInt(mdy[0]);
    var day = parseInt(mdy[1]);
    var year = parseInt(mdy[2]);

    // Putting it all together
    var formattedDate = year + '-' + month + '-' + day + ' ' + time;

    var res = {};
    //var jsonTaskTemplate = JSON.parse($("#sltTaskTemplate").val());
    var assignID = assigned_persons[0].ID;

    //for (var [key, value] of Object.entries(jsonTaskTemplate[0])) {    
    res.taskName = "";
    res.time = "";
    res.customer_id = $('#claim_form [name="customer"]').val();
    res.assign_id = assignID;
    res.actionset = "claim";
    res.doneDate = new Date(new Date().getTime() + 86400 * 1e4).toISOString().slice(0, 10);
    res.dueDate = formattedDate;
    //res.createDate  = new Date().toISOString().slice(0,10);
    res.status = "Open";
    // push json
    jsonAssignTaskTable.push(res);
    res = {};
    //}

    //call tblTaskTemplateList append new table
    tblTaskTemplateList();
});

var msToTime = function (duration) {
    var seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24)
        , day = parseInt((duration / (1000 * 60 * 60 * 24)));

    if (duration < 0) {
        hours = hours * -1;
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = minutes * -1;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        //seconds = seconds * -1;
        //seconds = (seconds < 10) ? "0" + seconds : seconds;
    }
    else {
        hours = (hours < 10 & hours > -10) ? "0" + hours : hours;
        minutes = (minutes < 10 & hours > -10) ? "0" + minutes : minutes;
        //seconds = (seconds < 10 & hours > -10) ? "0" + seconds : seconds;
    }

    return day + ( day==1? " day ":' days ') + hours + ":" + minutes;
}

var tblTaskTemplateList = function () {
    /**
     * set value Status
     * open
     * in process
     * done
     * close
     */
    var s, Status = ["Open", "In Progress", "Done", "Close"];

    $('#tblTaskTemplateList tbody').html('');
    var html = '';
    var i = 0;

    $.each(jsonAssignTaskTable, function (index, value) {

        var dueDate = 0;
        var dateEnd = new Date();

        if (!value.dueDate) {
            dueDate = new Date(new Date().getTime() + 86400000 * 2);
            dueDate.setUTCHours(7, 0, 0);
            dueDate = getDateTime(dueDate);
            dateEnd = new Date(dueDate);
        }
        else {
            dueDate = value.dueDate;
            // setup date End
            dateEnd = new Date(value.dueDate);
        }

        jsonAssignTaskTable[index].dueDate = dueDate

        var dateNow = new Date();
        var resTime = Math.floor(dateEnd.getTime() - dateNow.getTime());

        var selectID = value.assign_id;

        var _class = '';
        if (value.status != 'done') {
            if (resTime / 1000 < 30) {
                _class = 'class="danger"';
            }
            else if (resTime / 1000 < 10) {
                _class = 'class="warning"';
            }
            else {
                _class = 'class="success"';
            }
        }

        let time = value.time.startsWith('1 ')? value.time.replace(' ', ' day ') : value.time.replace(' ', ' days ' ) 

        html += '<tr ' + _class + '>'
            + '<td class="hasinput"><input type="text" onchange="iptChangeTaskValue(this)" class="form-control" key="taskName" row="' + i + '" value="' + (value.taskName ? value.taskName.upperCaseFirst() : '') + '"></td>'
            + '<td class="">' + time + '</td>'
            + '<td class="hasinput"><select class="form-control" onchange="iptChangeTaskValue(this)" key="assign_id" row="' + i + '"">';

        if (!value.assign_id) {
            html += '<option value="" selected disabled></option>';
        }

        $.each(assigned_persons, function (index, value) {
            if (value.ID == selectID) {
                html += '<option value="' + value.ID + '" data-email="' + value.primary_email + '" selected>' + value.first_name + ' ' + value.last_name + '</option>';
            } else {
                html += '<option value="' + value.ID + '" data-email="' + value.primary_email + '">' + value.first_name + ' ' + value.last_name + '</option>';
            }
        });
        html += '</select></td>'
            + '<td class="hasinput"><input type="text" onchange="iptChangeTaskValue(this)" class="datetimepicker form-control" key="dueDate" row="' + i + '" value="' + dueDate + '"></td>'
            + '<td class="hasinput"><select class="form-control" onchange="iptChangeTaskValue(this);" id="' + value.id + '" key="status" row="' + i + '"">';
        for (s of Status) {
            if (value.status == s) {
                html += '<option value="' + s + '" selected>' + s + '</option>';
            } else {
                html += '<option value="' + s + '" >' + s + '</option>';
            }
        }
        html += '</select></td>'
            + '<td class="hasinput" style="margin:0px 5px;"><div class="input-group-btn">' +
            '<a href="./#ajax/task.php?id=' + value.id + '" target="_blank" class="btn btn-sm btn-info" title="Go to task"><i class="fa fa-info" aria-hidden="true"></i></a>' +
            '<button type="button" onclick="btnDeleteRowTask(' + i + ')" title="Delete task" class="btn btn-sm btn-danger btnDeleteRowTemplateCheckList"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';

        html += '<button type="button" class="btn btn-sm btn-success btnContentMail' + (value.assign_id ? '' : ' hidden') + '" title="Send the customer an email with the contractors info"><i class="fa fa-envelope-o" aria-hidden="true"></i></button>';
        html += '</div></td>'
            + '</tr>';

        /**
         * add res.customer_id = localStorage.getItemValue('userID'); // id login   
         */

        if (!value.actionset) {
            jsonAssignTaskTable[i].actionset = "claim";
        }

        if (!value.status) {
            jsonAssignTaskTable[i].status = 'open';
        }

        i++;
    });

    $('#tblTaskTemplateList tbody').append(html);
    $('#tblTaskTemplateList tbody .datetimepicker').datetimepicker({
        formatDate: 'Y-m-d H:m',
        lang: 'en',
        allowTimes: allowTime
    });

}

//call tblTaskTemplateList append new table
tblTaskTemplateList();

if (isUser()) {
    $('#tblTaskTemplateList input, #tblTaskTemplateList select').each(function (index, item) {
        $(item).closest('td').removeClass('hasinput');
        let _type = $(item).prop('type');
        if (_type && _type.includes('select')) {
            $(item).replaceWith($(item).find('option:selected').text());
        } else {
            $(item).replaceWith(item.value);
        }
    });
    $('.btnDeleteRowTemplateCheckList').remove();
    $('#btnAddTaskItem').remove();
}

var btnDeleteRowTask = function (row) {
    jsonAssignTaskTable.splice(row, 1);
    //call tblTaskTemplateList append new table
    tblTaskTemplateList();
}

//onchange="iptChangeTaskValue(this)"
var iptChangeTaskValue = function (e) {
    var value = e.value;
    var key = e.getAttribute("key");
    var row = e.getAttribute("row");
    jsonAssignTaskTable[row][key] = value;
    var dueDate = jsonAssignTaskTable[row]['dueDate'];
    var duration = new Date(dueDate).getTime() - new Date().getTime();
    var _class = '';
    if (jsonAssignTaskTable[row].status != 'done') {
        if (duration / 1000 < 30) {
            _class = 'danger';
        }
        else if (duration / 1000 < 10) {
            _class = 'warning';
        }
        else {
            _class = 'success';
        }
    }
    var tmp = msToTime(duration);
    $(e).closest('tr').children('td:eq(1)').text(tmp);
    $(e).closest('tr').removeClass('success danger warning');
    $(e).closest('tr').addClass(_class);
    if (key == 'assign_id') {
        if (value != '') {
            jsonAssignTaskTable[row]['customer_id'] = $('#claim_form [name="customer"]').val();
            $('#tblTaskTemplateList tbody tr:eq(' + (row + 1) + ') .btnContentMail').removeClass('hidden');
        } else {
            $('#tblTaskTemplateList tbody tr:eq(' + (row + 1) + ') .btnContentMail').addClass('hidden');
        }
    }
    //check value change
}

var callUpdateTaskApi = function (e) {
    // var value = e.value;
    // var key = e.getAttribute("key");
    var row = e.getAttribute("row");
    var id = e.getAttribute("id");

    if (id !== 'undefined') {
        var data = { token: localStorage.getItemValue('token'), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') };
        data = $.extend({}, data, jsonAssignTaskTable[row]);
        data.dueDate = getDateTime(new Date(data.dueDate));
        var _link = link._taskUpdate;

        $.ajax({
            url: _link,
            type: 'post',
            data: data,
            success: function (res) {
                messageForm('You have successfully change new status', true, '#message_task_table');
                return;
            }
        })

    }

}

var msToHMS = function (ms) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    alert(hours + ":" + minutes + ":" + seconds);
}


function close_resend_mail() {
    $('#resend_mail_popup').hide();
}
