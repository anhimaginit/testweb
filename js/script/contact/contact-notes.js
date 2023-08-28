var callToPhoneNumber = function (contactID, phoneNumber) {
    if ($('#contact-form input[name=ID]').val() == '' && window.location.href.indexOf('contact-form') > 0) {
        return;
    }
    else {
        if (!contactID) contactID = $('input[name=ID]').val();
        if (!phoneNumber) phoneNumber = document.querySelector('input[name=primary_phone]').value;
        var todayDate = new Date().toISOString().slice(0, 16).replace('T', ' ') + ':00';

        //call using app in client pc
        window.location.href = "tel:+" + phoneNumber;

        //install database   
        var _link = link._noteAddNew;
        var data = {};
        data.token = localStorage.getItemValue('token');

        var installData = {};
        installData.create_date = todayDate;
        installData.note = "Call to phonenumber";
        installData.type = "Contact";
        installData.contactID = contactID;

        data.installData = installData;
        $.post(_link, data, function (res) {
            var resData = JSON.parse(res);

            if (resData.msg == "SUCCESS") {
                //app new row in to table note
                var table = document.getElementById("table_note_info").getElementsByTagName('tbody')[0];
                var row = table.insertRow(0);
                var date = row.insertCell(0);
                var note = row.insertCell(1);
                var type = row.insertCell(2);
                var enter_by = row.insertCell(3);

                date.innerHTML = todayDate;
                note.innerHTML = "Call to phonenumber " + phoneNumber;
                type.innerHTML = "contact";
                enter_by.innerHTML = localStorage.getItemValue('user_name');
            }

        });
    }
}