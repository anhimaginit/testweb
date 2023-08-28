function FreedomCalendar() {
    this.setViewCalendar();
}

var allowTime = [];
for (let i = 0; i < 24; i++) {
    for (let j = 15; j < 60;) {
        allowTime.push(`${i}:${j}`);
        j += 15;
    }
}

var color_events = [
    { value: 1, color: 'white', text: 'White' },
    { value: 2, color: 'var(--info)', text: 'Blue' },
    { value: 3, color: 'var(--danger)', text: 'Red' },
    { value: 4, color: 'var(--warning)', text: 'Orange' },
    { value: 5, color: 'var(--success)', text: 'Green' },
    { value: 6, color: 'var(--dark)', text: 'Dark' },
    { value: 7, color: 'yellow', text: 'Yellow' },
    { value: 8, color: 'var(--primary)', text: 'Dark Blue' },
    { value: 9, color: 'var(--claim)', text: 'Purple' },
];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'December', 'November']

var weekday = { 'SU': 'Sunday', 'MO': 'Monday', 'TU': 'Tuesday', 'WE': 'Wednesday', 'TH': 'Thursday', 'FR': 'Friday', 'SA': 'Saturday' }
var weekdayArray = [];

FreedomCalendar.prototype = {
    constructor: FreedomCalendar,
    init: function () {

        let tmp = new Date().toString().split('GMT').pop().split(' ').shift();
        tmp = tmp.substring(0, 3) + ':' + tmp.substring(3);
        window.currentTimezone = Object.freeze(tmp);
        this.setView();
        this.bindEvent();
        this.bindEventForEditAndDelete();
        $('#add-event-form input, #add-event-form select').change();
        return this;
    },
    setView: function () {
        $('#add-event-form .datepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            // minDate: new Date,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
        });
        $('#add-event-form [name="starttime"].datetimepicker').datetimepicker({
            formatDate: 'YYYY-MM-DDTHH:MM:SSZ',
            lang: 'en',
            // allowTimes: allowTime,
            // minDate: new Date,
            defaultDate: new Date()
        });
        $('#add-event-form [name="stoptime"].datetimepicker').datetimepicker({
            formatDate: 'YYYY-MM-DDTHH:MM:SSZ',
            lang: 'en',
            // allowTimes: allowTime,
            // minDate: new Date($('#add-event-form [name="starttime"].datetimepicker').val()),
            defaultDate: new Date()
        });

        $('#add-event-form input, #add-event-form select').change(function () {
            let $this = $(this);
            let type = $this.prop('type');
            let val = $this.val();
            let name = $this.prop('name');
            if (['checkbox', 'radio'].includes(type)) {
                if ($this.prop('checked') == true) {
                    $('[data-name="' + name + '"]').hide()
                    $('[data-name="' + name + '"][data-src="' + val + '"]').show()
                    $('[data-name="' + name + '"]').each(function (index, elem) {
                        if ($(elem).data('srcdif')) {
                            if ($(elem).data('srcdif').split(',').includes(val)) {
                                $(elem).hide();
                            } else {
                                $(elem).show();
                            }
                        }
                    });
                } else {
                    $('[data-name="' + name + '"][data-src="' + val + '"]').hide()
                    $('[data-name="' + name + '"]').each(function (index, elem) {
                        if ($(elem).data('srcdif')) {
                            if ($(elem).data('srcdif').split(',').includes(val)) {
                                $(elem).hide();
                            } else {
                                $(elem).show();
                            }
                        }
                    });
                }
            } else {
                $('[data-name="' + name + '"]').hide()
                $('[data-name="' + name + '"][data-src="' + val + '"]').show();
                $('[data-name="' + name + '"]').each(function (index, elem) {
                    if ($(elem).data('srcdif')) {
                        if ($(elem).data('srcdif').split(',').includes(val)) {
                            $(elem).hide();
                        } else {
                            $(elem).show();
                        }
                    }
                });
            }
        });

        color_events.forEach(function (item) {
            $('#add-event-form [name="color"]').append('<option value="' + item.value + '" data-color="' + item.color + '">' + item.text + '</option>');
        });

        months.forEach(function (item, index) {
            $('#add-event-form [name="by_month"]').append('<option value="' + (index + 1) + '">' + item + '</option>');
        });

        weekdayArray = [];
        for (let key in weekday) {
            weekdayArray.push(key);
            $('#add-event-form [name="by_day"]').append('<option value="' + key + '">' + weekday[key] + '</option>');
        }


        $('#add-event-form [name="color"]').change(function () {
            let color = color_events[parseInt($(this).val()) - 1].color, text = '';
            if (color == 'var(--dark)') {
                text = 'var(--light)';
            } else {
                text = 'black';
            }
            $(this).css({ 'background': color, 'color': text });
        });

        $('#add-event-form [name="by_month"], #add-event-form [name="by_day"]').select2({
            containerCssClass: 'input-underline w100',
        })
    },
    bindEvent: function () {
        let that = this;
        $('#addEvent').click(function () {
            var id_list=[];
            $('.e-calendar-l').each(function(){
                if($(this).find('.display-event-calendar').is(":checked")){
                    var id=  $(this).find('.display-event-calendar').attr("name");
                    id_list.push(id)
                }
            });
            if (id_list.length == 1){
                that.addEvent(id_list[0], that.getFormAddEventData())
            }else{
                that.addEvent('primary', that.getFormAddEventData())
            }

        });

        $('#cancelEditEvent').click(function () {
            that.clearFormEvent();
            that.controlEventButton(false);
        })
    },
    setViewCalendar: function () {
        let that = this;
        $('#calendar').fullCalendar({
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay,listWeek',
                right: 'prev,today,next'
            },
            // timeZone: $.cookie('timezone') || 'America/New_York',
            timeZone: 'Asia/Ho_Chi_Minh',
            // editable: true,
            // droppable: true,
            events: [],
            eventClick: function (info, elem) {
                window.viewInfo = info;
                that.eventInfo(info, $(elem.target).parent());
            }

        });
    },
    makeCalendar: function (listEvents) {
        let recurringEvent = [];
        listEvents.filter(function (elem) {
            elem.title = elem.summary;
            elem.className = ["event", "bg-calendar-" + elem.colorId];
            if (elem.start.dateTime == elem.end.dateTime) {
                elem.allDay = true;
            } else {
                elem.allDay = false;
            }
            elem.timezoneDate = elem.start.timeZone;
            // elem.start = elem.start.dateTime;
            // elem.end = elem.end.dateTime;
            elem.start = elem.start.dateTime;
            elem.end = elem.end.dateTime;
            if (elem.recurringEventId && !recurringEvent.includes(elem.recurringEventId)) {
                recurringEvent.push(elem.recurringEventId)
            }
            return true;
        });
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', listEvents);
        window.currentEvents = listEvents;
        window.recurringEventObject = {};
        recurringEvent.forEach(function (item, index) {
            gapi.client.calendar.events.get({
                calendarId: 'primary',
                eventId: item
            }).then(function (res) {
                window.recurringEventObject[item] = res.result;
            }).catch(function (e) {
                window.recurringEventObject[item] = {};
            });
        })

    },
    eventInfo: function (info, elem) {
        if (!info || !elem) {
            return;
        }
        let originalData = this.getEventOriginal(info.id);
        let _html = `
        <table class="table" style="width:100%" id="calendar_info_table" data-event="${originalData.id}">
            <tbody>
                <tr>
                    <td colspan="2">
                        Create by ${info.creator.self ? 'Your self' : info.creator.email} at ${getDateTime(new Date(info.created))}
                    </td>
                </tr>
                <tr>
                    <td class="bold" >Title</td>
                    <td>${info.summary || ''}</td>
                </tr>
                <tr>
                    <td class="bold">Start</td>
                    <td>${getDateTime(new Date(originalData.start)) || ''}</td>
                </tr>
                <tr>
                    <td class="bold">End</td>
                    <td>${getDateTime(new Date(originalData.end)) || ''}</td>
                </tr>
                <tr>
                    <td class="bold">Status</td>
                    <td class="uppercase-character">${info.status || ''}</td>
                </tr>
                <tr>
                    <td>Location</td>
                    <td>${info.location}</td>
                </tr>
                <tr>
                    <td class="bold">Link</td>
                    <td class="wordbreak-all"><a href="${info.htmlLink || 'javascript:void(0)'}" target="_blank">Google Calendar Link</a></td>
                </tr>
                <tr>
                    <td class="bold">Descriptions</td>
                    <td>${info.description || ''}</td>
                </tr>
            </tbody>`

        if (!originalData.recurringEventId) {
            _html += `
            <tfoot>
                <tr>
                    <td colspan="2">
                        <button type="button" class="btn btn-sm pull-right no-border-radius btn-warning btnEditEvent">Edit Event</button>
                        <button type="button" class="btn btn-sm pull-right no-border-radius btn-danger btnDeleteEvent">Delete Event</button>
                    </td>
                </tr>
            </tfoot>`;
        } else {
            _html += `
            <tfoot>
                <tr>
                    <td colspan="2">
                        <div>
                            <button type="button" class="btn btn-sm pull-right no-border-radius btn-warning dropdown-toggle" data-toggle="dropdown">Edit Event <span class="caret"></span></button>
                            <ul class="dropdown-menu" role="menu" data-action="edit_event" style="top:unset; left:unset; right:80px">
                                <li data-event="${originalData.id}" data-type="that"><a>Only this event</a></li>
                                <li data-event="${originalData.recurringEventId}" data-type="after"><a>This and future events</a></li>
                                <li data-event="${originalData.recurringEventId}" data-type="all"><a>All events in series</a></li>
                            </ul>
                        </div>
                        <div>
                            <button type="button" class="btn btn-sm pull-right no-border-radius btn-danger dropdown-toggle" data-toggle="dropdown">Delete Event <span class="caret"></span></button>
                            <ul class="dropdown-menu" role="menu" data-action="delete_event" style="top:unset; left:unset; right:150px">
                                <li data-event="${originalData.id}" data-type="that"><a>Only this event</li>
                                <li data-event="${originalData.recurringEventId}" data-type="after"><a>This and future events</a></li>
                                <li data-event="${originalData.recurringEventId}" data-type="all"><a>All events in series</a></li>
                            </ul>
                        </div>    
                    </td>
                </tr>
            </tfoot>
            `
        }

        _html += `</table>`;
        $('#add-event-form [name="eventId"]').val(originalData.id);
        let offset = elem.offset();
        let form_offset = $('#add-event-form').offset()

        let item = $('#content #event_info');
        let popover = item.next('.popover');
        if (popover[0]) {
            item.data('bs.popover').options.content = _html;
        } else {
            item.prop('rel', 'popover');
            item.data('placement', 'left');
            item.data('content', _html);
            item.data('html', true);
        }
        item.popover('show');
        let pop = item.next('.popover');
        pop.css({
            top: offset.top - 150 - elem.height(),
            left: offset.left - form_offset.left - $('#left-panel').width() - elem.width() * 1.5,
            width: 400,
            'max-width': 700
        });
        pop.find('.arrow').css({ top: '40%' })
    },
    getEventOriginal: function (id) {
        return (window.currentEvents.filter(function (elem) { return elem.id == id }))[0];
    },
    getEventById: function (eventId) {
        return (window.currentEvents.filter(function (elem) { return elem.id == eventId }))[0];
    },
    addEvent: function (calendarID, data) {
        var request = gapi.client.calendar.events.insert({
            calendarId: calendarID,
            resource: data
        });
        request.execute(event => {
            if (event.error) {
                messageForm(event.message, false, '#message_calendar');
                return;
            }
            updateSigninStatus(true);
        });
    },

    fillEditEvent: function (eventId, type) {
        let that = this;
        let event = {}
        if (type) {
            event = that.getRecurringEvent(eventId)
        } else {
            event = that.getEventOriginal(eventId);
        }
        if (!event) return;

        console.log(event);
        that.controlEventButton(type || true);
        // $('#add-event-form [name="title"]').val(event.summary);
        $('#add-event-form [name="location"]').val(event.location);
        $('#add-event-form [name="description"]').val(event.description);
        $('#add-event-form [name="starttime"]').val(getDateTime(new Date(event.start)).substring(0, 16));
        $('#add-event-form [name="stoptime"]').val(getDateTime(new Date(event.end)).substring(0, 16));
        $('#add-event-form [name="datetime"]').val(getDateTime(new Date(event.start)).split(' ').shift());
        $('#add-event-form [name="color"]').val(event.colorId ? event.colorId : 1).trigger('change');
        $('#add-event-form [name="eventId"]').val(eventId);
        let recurrenceObject = {};
        if (event.recurrence) {
            let recurArray = event.recurrence.join(';').split(';');

            recurArray.forEach(element => {
                let item = element.split('=');
                recurrenceObject[item[0]] = item[1];
            });

            if (recurrenceObject['BYMONTH'] || recurrenceObject['BYDAY']) {
                $('#add-event-form [name="repeat"]').val('Custom').trigger('change');
                if (recurrenceObject['BYMONTH']) {
                    $('#add-event-form [name="repeatinterval"]').val('ByMonth').trigger('change');
                    $('#add-event-form [name=by_month]').val(recurrenceObject['BYMONTH'].split(',')).trigger('change');
                } else {
                    $('#add-event-form [name="repeatinterval"]').val('ByDay').trigger('change');
                    $('#add-event-form [name=by_day]').val(recurrenceObject['BYDAY'].split(',')).trigger('change');
                }
            } else {
                $('#add-event-form [name="repeat"]').val(recurrenceObject['RRULE:FREQ'].upperCaseFirst()).trigger('change');
            }

            if (recurrenceObject['COUNT']) {
                $('#add-event-form [name="repeat_count"]').val(recurrenceObject['COUNT']).trigger('change');
            }

            if (recurrenceObject['UNTIL']) {
                let until_year = recurrenceObject['UNTIL'].substring(0, 4);
                let until_month = recurrenceObject['UNTIL'].substring(4, 6);
                let until_day = recurrenceObject['UNTIL'].substring(6, 8);
                $('#add-event-form [name=untildate]').val(until_year + '-' + until_month + '-' + until_day).trigger('change');
            }

            if (recurrenceObject['INTERVAL']) {
                $('#add-event-form [name=interval_time]').val(recurrenceObject['INTERVAL']).trigger('change');
            }

            $('#add-event-form [name="starttime"]').val(getDateTime(new Date(event.start.dateTime)).substring(0, 16));
            $('#add-event-form [name="stoptime"]').val(getDateTime(new Date(event.end.dateTime)).substring(0, 16));
            $('#add-event-form [name="datetime"]').val(getDateTime(new Date(event.start.dateTime)).split(' ').shift());
        } else {
            $('#add-event-form [name="repeat"]').val('Never').trigger('change');
        }

        $('#content #event_info').popover('hide');
        $('#add-event-form [name="title"]').val(event.summary).focus();
    },

    bindEventForEditAndDelete: function () {
        let that = this;
        $(document).unbind('click', '[data-action="delete_event"] li, [data-action="edit_event"] li').on('click', '[data-action="edit_event"] li', function () {
            let $this = $(this);
            let eventId = $this.data('event'),
                type = $this.data('type');
            switch (type) {
                case 'that':
                    that.fillEditEvent(eventId);
                    break;
                case 'after':
                case 'all':
                    that.fillEditEvent(eventId, type);
                    break;
                default:
                    messageForm('Cannot find data event', 'warning', '#message_calendar');
                    break;
            }
        }).on('click', '[data-action="delete_event"] li', function () {
            let $this = $(this);
            let eventId = $this.data('event'),
                type = $this.data('type');
            switch (type) {
                case 'that':
                    window.deleteConfirm = true;
                    that.deleteEvent(eventId)
                    break;
                case 'after':
                    window.deleteConfirm = true;
                    that.editEvent(that.getFormEditEventData(eventId, 'after'));
                    break;
                case 'all':
                    window.deleteConfirm = true;
                    that.deleteEvent(eventId);
                    // that.editEvent(that.getFormEditEventData(eventId, 'all'));
                    break;
                default:
                    messageForm('Cannot delete event', 'warning', '#message_calendar');
                    break;
            }
        });

        $(document).unbind('click', '.btnDeleteEvent').unbind('click', '.btnEditEvent').on('click', '.btnDeleteEvent', function () {
            let eventId = $('#add-event-form [name="eventId"]').val();
            that.deleteEvent(eventId);
        }).on('click', '.btnEditEvent', function () {
            let eventId = $('#add-event-form [name="eventId"]').val();
            that.fillEditEvent(eventId);
        });
        $('#editEvent').click(function () {
            let eventId = $('#add-event-form [name="eventId"]').val();
            let data = that.getFormEditEventData(eventId);
            that.editEvent(data, eventId);
        });

        $('#editSerieEvent').click(function () {
            let eventId = $('#add-event-form [name="eventId"]').val();
            let data = that.getFormEditEventData(eventId);
            that.editEvent(data, eventId, 'serie');
        });

        $('#editAfterSerieEvent').click(function () {
            let eventId = $('#add-event-form [name="eventId"]').val();
            let data = that.getFormEditEventData(eventId);
            that.editEvent(data, eventId, 'after');
        })
    },
    controlEventButton: function (status) {//true: edit, false: add

        if (status) {
            $('#widdget_form_title').text('Edit Event');
            if (status == true || status == 'that') {
                $('#editEvent').show();
                $('#editAfterSerieEvent').hide();
                $('#editSerieEvent').hide();
            } else if (status == 'all') {
                $('#editSerieEvent').show();
                $('#editEvent').hide();
                $('#editAfterSerieEvent').hide();
            } else if (status == 'after') {
                $('#editEvent').hide();
                $('#editSerieEvent').hide();
                $('#editAfterSerieEvent').show();
            }
            $('#cancelEditEvent').show();
            $('#addEvent').hide();
            $('#add-event-form [name="starttime"].datetimepicker').datepicker('option', 'minDate', null);
            $('#add-event-form [name="stoptime"].datetimepicker').datepicker('option', 'minDate', null);
        } else {
            $('#widdget_form_title').text('Add Event');
            $('#cancelEditEvent').hide();
            $('#editEvent').hide();
            $('#editSerieEvent').hide();
            $('#editAfterSerieEvent').hide();
            $('#addEvent').show();
            $('#add-event-form [name="eventId"]').val('');
            $('#add-event-form [name="starttime"].datetimepicker').datepicker('option', 'minDate', new Date());
            $('#add-event-form [name="stoptime"].datetimepicker').datepicker('option', 'minDate', new Date());
        }
    },

    getTypeRecurringEvent: function (recurringEventId) {
        if (!recurringEventId) {
            return { type: 'Never', time: '' };
        }
        let eventsList = window.currentEvents.filter(function (elem) { return elem.recurringEventId == recurringEventId }),
            first = eventsList[0],
            second = eventsList[1];
        if (first) {
            if (!second) {
                if (first.sequence == 1) {
                    return { type: 'Yearly', time: eventsList.length };
                } else if (first.sequence == 4) {
                    return { type: 'Daily', time: eventsList.length };
                } else {
                    return 'Custom';
                }
            } else {
                let dateDiff = (new Date(second.start).getTime() - new Date(first.start).getTime()) / 1000 / 86400;
                if (dateDiff == 7) {
                    return { type: 'Weekly', time: eventsList.length };
                } else if (dateDiff > 27 && dateDiff < 32) {
                    return { type: 'Monthly', time: eventsList.length };
                } else if (dateDiff > 364 && dateDiff < 367) {
                    return { type: 'Yearly', time: eventsList.length };
                } else {
                    //     return { type: 'Daily', time: eventsList.length };
                    // } else {
                    let dateInterval = '';
                    let dateIntervalValue = [];
                    if (dateDiff) {
                        if (dateDiff > 7 && dateDiff < 365) {
                            dateInterval = 'ByMonth';
                            let byMonth = true;
                            let preValue = 0;
                            eventsList.forEach(function (item, index) {
                                let value = weekdayArray[new Date(item.start).getMonth()];
                                if (!dateIntervalValue.includes(value)) {
                                    dateIntervalValue.push(value);
                                }
                                preValue = value - 1;
                                if (preValue != -1 && preValue != dateIntervalValue[index - 1]) {
                                    byMonth = false;
                                }
                            });
                            if (!byMonth) {
                                return { type: 'Monthly', time: eventsList.length };
                            }
                        } else if (dateDiff < 7) {
                            dateInterval = 'ByDay';
                            eventsList.forEach(function (item) {
                                let value = weekdayArray[new Date(item.start).getDay()];
                                if (!dateIntervalValue.includes(value)) {
                                    dateIntervalValue.push(value);
                                }
                            });
                        }
                        if (dateIntervalValue.length == 7 || dateIntervalValue.length == eventsList.length) {
                            return { type: 'Daily', time: eventsList.length };
                        }
                    }
                    return { type: 'Custom', time: eventsList.length, intervalType: dateInterval, intervalValue: dateIntervalValue };
                }
            }
        } else {
            return 'Never';
        }
    },

    getRecurringEventOrigin: function (recurringEventId) {
        if (!recurringEventId || recurringEventId == '') return { event: {}, total: 0 }
        let eventsList = window.currentEvents.filter(function (elem) { return elem.recurringEventId == recurringEventId });
        if (eventsList && eventsList.length > 0) {
            return { event: eventsList[0], total: eventsList.length }
        } else {
            return { event: {}, total: 0 }
        }
    },

    getRecurringEvent: function (recurringEventId) {
        if (!recurringEventId) return {};
        return window.recurringEventObject[recurringEventId] || {};
    },

    clearFormEvent: function () {
        $('#add-event-form [name="by_month"], #add-event-form [name="by_day"]').val(null).trigger('change');
        $('#add-event-form [name="color"]').val('1').trigger('reset');
        $('#add-event-form').trigger('reset');
    },

    editEvent: function (data, eventId, isUpdateAll) {
        let that = this;
        if (data.recurringEventId && isUpdateAll) {
            eventId = data.recurringEventId;
        }
        gapi.client.calendar.events.update({
            calendarId: 'primary',
            resource: data,
            eventId: eventId
        }).execute(res => {
            if (res.error) {
                messageForm(res.message, false, '#message_calendar');
                return;
            } else {
                that.clearFormEvent();
                that.controlEventButton(false);
                messageForm('The events are update successfully', true, '#message_calendar');
            }
            updateSigninStatus(true)
        })
    },
    deleteEvent: function (eventId) {
        if (!eventId) {
            $('#content #event_info').popover('hide');
            return;
        }
        // let that = this;
        // let event = this.getEventOriginal(eventId);
        // if (!event) {
        //     updateSigninStatus(true);
        //     return;
        // }
        gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId
        }).execute(function (res) {
            if (res.error) {
                messageForm(res.message, false, '#message_calendar');
                return;
            }
            window.deleteConfirm = false;
            $('#content #event_info').popover('hide');
            updateSigninStatus(true);
        });
    },
    /** @referrent
     * https://developers.google.com/calendar/v3/reference/events
     @result param{
         id,
         location,
         summary, 
         description,
         status,//confirmed tentative cancelled
         start:{
             date,
             dateTime,
             timeZone
         },
         end : {
             date,
             dateTime,
             timeZone
         },
         colorId
     }
     */
    getFormAddEventData: function () {
        function getDate(date) {
            if (!date || date == '') return new Date().toISOString();
            return new Date(date).toISOString().split('.').shift() + '-00:00';
        }
        let repeat = $('#add-event-form [name="repeat"]').val();
        let _data = {};
        this.getGeneralFormData(function(data){
            _data = data;
        })
        // if (untildate && untildate != '') {
        //     untildate = 'UNTIL=' + untildate.replace(/-/g, '') + 'T000000Z;';
        // } else {
        //     untildate = '';
        // }

        // let repeat_date = 'DTSTART;TZID=' + $.cookie('timezone') + ':' + new Date(_data.start.dateTime).toISOString().replace(/ |:|-/g, '').substring(0, 15) + '\n';

        // let interval_time = $('#add-event-form [name=interval_time]').val();
        // if (interval_time && interval_time != '') {
        //     untildate += 'INTERVAL=' + numeral(interval_time).value() + ';';
        // }
        // switch (repeat) {
        //     case 'Never':
        //         break;
        //     case 'Daily':
        //         _data.recurrence = 'RRULE:FREQ=DAILY;' + untildate;
        //         break;
        //     case 'Weekly':
        //         _data.recurrence = 'RRULE:FREQ=WEEKLY;' + untildate;
        //         break;
        //     case 'Monthly':
        //         _data.recurrence = 'RRULE:FREQ=MONTHLY;' + untildate;
        //         break;
        //     case 'Yearly':
        //         _data.recurrence = 'RRULE:FREQ=YEARLY;' + untildate;
        //         break;
        //     case 'Custom':
        //         switch (repeatInterval) {
        //             case 'Daily':
        //                 break;
        //             case 'Weekly':
        //                 _data.recurrence = 'RRULE:FREQ=WEEKLY;' + untildate;
        //                 break;
        //             case 'Monthly':
        //                 _data.recurrence = 'RRULE:FREQ=MONTHLY;' + untildate;
        //                 break;
        //             case 'Yearly':
        //                 _data.recurrence = 'RRULE:FREQ=YEARLY;' + untildate;
        //                 break;
        //             case 'ByMonth':
        //                 _data.recurrence = 'RRULE:FREQ=MONTHLY;' + untildate + ';BYMONTH=' + by_month;
        //                 break;
        //             case 'ByDay':
        //                 _data.recurrence = 'RRULE:FREQ=DAILY;' + untildate + ';BYDAY=' + by_day;
        //                 break;
        //         }
        //         break;
        // }

        // if (_data.recurrence) {
        //     _data.recurrence = repeat_date + _data.recurrence;
        // }
        // if (repeat_count > 0 && _data.recurrence) {
        //     _data.recurrence += ';COUNT=' + repeat_count;
        // }
        // _data.recurrence = [_data.recurrence];
        if (repeat != 'Never') {
            _data.recurrence = this.getFormRecurrenceData()
        }
        return _data;
    },
    deleteAfterData: function (data) {
        if (!data) {
            return {};
        }
        if (!data.recurrence) {
            data.recurrence = ["EXDATE;VALUE=DATE:" + data.start.dateTime];
        } else {
            data.recurrence.push("EXDATE;VALUE=DATE:" + data.start.dateTime)
        }
        return data
    },
    deleteThisData: function (data) {
        if (!data) {
            return {};
        }
        if (!data.recurrence) {
            data.recurrence = ["EXDATE;VALUE=DATE:" + data.start.dateTime];
        } else {
            data.recurrence.push("EXDATE;VALUE=DATE:" + data.start.dateTime);
        }
        return data
    },
    getFormEditEventData: function (eventId, isDelete) {
        let that = this;
        that.getGeneralFormData(function (result) {
            let repeat = $('#add-event-form [name="repeat"]').val();
            dataEvent = that.getEventById(eventId)
            let _data = result;
            if (repeat != 'Never') {
                _data.recurrence = that.getFormRecurrenceData()
            }

            return $.extend(_data, {
                summary: dataEvent.summary,
                location: dataEvent.location,
                description: dataEvent.description,
                colorId: dataEvent.colorId,
            });
        })

    },
    /**
     * @param {} callback 
     * @return summary, location, description, colorId, start, end
     */
    getGeneralFormData: function (callback) {
        function getDate(date) {
            if (!date || date == '') return new Date().toISOString();
            return new Date(date).toISOString().split('.').shift() + '-00:00';
        }
        let
            summary = $('#add-event-form [name="title"]').val(),
            location = $('#add-event-form [name="location"]').val(),
            description = $('#add-event-form [name="description"]').val(),
            start = {
                dateTime: getDate($('#add-event-form [name="starttime"]').val()),
                timeZone: $.cookie('timezone')
            },
            end = {
                dateTime: getDate($('#add-event-form [name="stoptime"]').val()),
                timeZone: $.cookie('timezone'),
            },
            date = {
                dateTime: new Date($('#add-event-form [name="datetime"]').val() != '' ? $('#add-event-form [name="datetime"]').val() : null).toISOString(),
                timeZone: $.cookie('timezone')
            },
            eventType = $('#add-event-form [name="eventType"]:checked').val(),
            colorId = $('#add-event-form [name="color"]').val();

        let _data = {
            summary: summary,
            location: location,
            description: description,
            colorId: colorId,
        }
        if (!_data.summary || _data.summary == '') {
            messageForm('Please enter event title', false, '#message_calendar');
            return;
        }
        if (eventType == 'Time') {
            _data.start = start;
            _data.end = end;
        } else if (eventType == 'All') {
            _data.start = date;
            _data.end = date;
        }
        if (callback) callback(_data);
    },
    getFormRecurrenceData: function (type, data, callback) {
        let repeat = $('#add-event-form [name="repeat"]').val(),
            repeatInterval = $('#add-event-form [name="repeatinterval"]').val(),
            // attendees = $('#add-event-form [name="attendees"]').val(),
            untildate = $('#add-event-form [name=untildate]').val(),
            repeat_count = numeral($('#add-event-form [name=repeat_count]').val()).value(),
            by_month = $('#add-event-form [name=by_month]').val().join(','),
            by_day = $('#add-event-form [name=by_day]').val().join(',');

        let recurrence = '';

        if (type == 'delete-after') {
            untildate = 'UNTIL=' + data.start.startTime.toISOString().split('T').shift() + 'T000000Z;';
        } else if (untildate && untildate != '') {
            untildate = 'UNTIL=' + untildate.replace(/-/g, '') + 'T000000Z;';
        } else {
            untildate = '';
        }

        let interval_time = $('#add-event-form [name=interval_time]').val();
        if (interval_time && interval_time != '') {
            untildate += 'INTERVAL=' + numeral(interval_time).value() + ';';
        }

        switch (repeat) {
            case 'Never':
                break;
            case 'Daily':
                recurrence = 'RRULE:FREQ=DAILY;' + untildate;
                break;
            case 'Weekly':
                recurrence = 'RRULE:FREQ=WEEKLY;' + untildate;
                break;
            case 'Monthly':
                recurrence = 'RRULE:FREQ=MONTHLY;' + untildate;
                break;
            case 'Yearly':
                recurrence = 'RRULE:FREQ=YEARLY;' + untildate;
                break;
            case 'Custom':
                switch (repeatInterval) {
                    case 'ByMonth':
                        recurrence = 'RRULE:FREQ=YEARLY;' + untildate + 'BYMONTH=' + by_month + ';';
                        break;
                    case 'ByDay':
                        recurrence = 'RRULE:FREQ=WEEKLY;' + untildate + 'BYDAY=' + by_day + ';';
                        break;
                }
                break;
        }

        if (repeat_count > 0 && recurrence) {
            recurrence += 'COUNT=' + repeat_count;
        }

        return [recurrence];
    }
}