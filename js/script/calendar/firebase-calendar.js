const API_KEY = 'AIzaSyAiP2gUa2p2JLfKAsPgOFwqGXqRHPbMTTw';
const CLIENT_ID = '947372206934-05mel9ku9vsil3fkr70etes69irr25ud.apps.googleusercontent.com';
// var API_KEY = 'AIzaSyA_8dzdQbvGq7bLBmg8qIBBGpnW284EwjU';
// var CLIENT_ID = '871561714410-s9tiscakqsvu65v5etfinkoiqeo73u4r.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

var SCOPES = "https://www.googleapis.com/auth/calendar";
// var authorizeButton = document.getElementById('btnGoogle');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
function initClient() {

    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        authDomain: "freedom-hw-crm.firebaseapp.com",
        storageBucket: "freedom-hw-crm.appspot.com",
        messagingSenderId: "871561714410",
        appId: "1:871561714410:web:3ea663be152a8181",
    }).then(async function (res) {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        // // authorizeButton.onclick = handleAuthClick;
        //
        calendarList1();
        //
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        $('#calendar_parent').show();
        listUpcomingEvents();
    } else {
        $('#calendar_parent').hide();
        responseSuccessForward('Please choose email to control calendar', 'warning', '#message_calendar_login', 'javascript:void(0)" onclick="handleAuthClick()', 'Get Event');
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        auth2.disconnect();
        updateSigninStatus(false);
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': new Date($('#date_from').val()).toISOString(),
        'timeMax': new Date($('#date_to').val()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        // 'maxResults': 200,
        'orderBy': 'startTime',
        singleEvents: true
    }).then(function (response) {
        $('#calendar_parent').show();
        $('#message_calendar_login').hide();
        var events = response.result.items;
        $.cookie('timezone', response.result.timeZone);
        $('#calendar-form-control').prev('h2').html(response.result.summary + ' Events');
        _freedomCalendar.makeCalendar(events);
    }).catch(function (res) {
        $('#calendar_parent').show();
        _freedomCalendar.makeCalendar([]);
    });
}

$('#date_from, #date_to').datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    prevText: '<i class="fa fa-chevron-left"></i>',
    nextText: '<i class="fa fa-chevron-right"></i>',
    onSelect: function () {
        updateSigninStatus(true);
    }
})

function calendarList1(){
    gapi.client.calendar.calendarList.list({
        maxResults : 250,
        showDeleted : false,
        showHidden : false
    }).then(function(res){
            var accessRoleOwner='';
            var accessRole_Reader='';
            //console.log(res);
            res.result.items.forEach(function(item, index){
                if(item.accessRole=="reader"){
                    accessRole_Reader += '<section class="col col-10 e-calendar-l">' +
                        '<label class="checkbox">' +
                           '<input type="checkbox" class="display-event-calendar" name="'+item.id+'" ><i></i> ' +item.summary +
                        '</label>' +
                    '</section>'
                }else{
                    accessRoleOwner += '<section class="col col-10 e-calendar-l">' +
                        '<label class="checkbox">' +
                        '<input type="checkbox" class="display-event-calendar " name="'+item.id+'" ><i></i> ' +item.summary +
                        '</label>' +
                        '</section>'
                }

            });
            //console.log(accessRole_Reader);
            $("#my-calendar-list").html(accessRoleOwner);
            $("#other-calendar-list").html(accessRole_Reader);

            $(".display-event-calendar").unbind("click").bind("click",function(){
                /*if($(this).is(":checked")){
                    var id = $(this).attr("name");
                    listEvents_calendarID(id);
                }*/
                //get list checked
                var id_list=[];
                $('.e-calendar-l').each(function(){
                    if($(this).find('.display-event-calendar').is(":checked")){
                        var id=  $(this).find('.display-event-calendar').attr("name");
                        id_list.push(id)
                    }
                });

                if(id_list.length==0) id_list.push("primary");
                //console.log(id_list);
                var promiseArr=[];
                  id_list.forEach(function(id,index){
                      promiseArr.push( gapi.client.calendar.events.list({
                          'calendarId': id,
                          'timeMin': new Date($('#date_from').val()).toISOString(),
                          'timeMax': new Date($('#date_to').val()).toISOString(),
                          'showDeleted': false,
                          'singleEvents': true,
                          // 'maxResults': 200,
                          'orderBy': 'startTime',
                          singleEvents: true
                      }).then(function (response) {
                              return response;

                          }).catch(function (res) {
                              return [];
                          }));
                });
                var eventsList=[];
                Promise.all(promiseArr).then(function(resultsArray){
                    var eventsList=[];
                    //console.log(promiseArr);
                    resultsArray.forEach(function(item,index){

                        item.result.items.forEach(function (entry, index) {
                            eventsList.push({
                                id: entry.id,
                                title: entry.summary,
                                start: entry.start.dateTime || entry.start.date, // try timed. will fall back to all-day
                                end: entry.end.dateTime || entry.end.date, // same
                                //url: url,
                                // location: entry.location,
                                //description: entry.description
                            });
                        });
                    });
                    $('#calendar').fullCalendar('removeEvents');
                    $("#calendar").fullCalendar('addEventSource', eventsList, true);

                }).catch(function(err){
                        // do something when any of the promises in array are rejected
                    })

            })
        }).catch(function (err) {
            console.log(err);
        });
}

function listEvents_calendarID(id) {
    gapi.client.calendar.events.list({
        'calendarId': id,
        'timeMin': new Date($('#date_from').val()).toISOString(),
        'timeMax': new Date($('#date_to').val()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        // 'maxResults': 200,
        'orderBy': 'startTime',
        singleEvents: true
    }).then(function (response) {
            //console.log(response);
            //$('#calendar_parent').show();
            //$('#message_calendar_login').hide();
            //var events = response.result.items;
            //$.cookie('timezone', response.result.timeZone);
           // $('#calendar-form-control').prev('h2').html(response.result.summary + ' Events');
            //_freedomCalendar.makeCalendar(events);
            var eventsList=[];
            response.result.items.forEach(function (entry, index) {
                eventsList.push({
                    id: entry.id,
                    title: entry.summary,
                    start: entry.start.dateTime || entry.start.date, // try timed. will fall back to all-day
                    end: entry.end.dateTime || entry.end.date, // same
                    //url: url,
                   // location: entry.location,
                    //description: entry.description
                });
            });

            if (eventsList.length > 0) {
                $('#calendar').fullCalendar('removeEvents');
                $("#calendar").fullCalendar('addEventSource', eventsList, true);

            }
            //

        }).catch(function (res) {
            $('#calendar_parent').show();
            _freedomCalendar.makeCalendar([]);
        });
}

var _freedomCalendar = new FreedomCalendar().init();

loadScript('https://apis.google.com/js/api.js', handleClientLoad);
