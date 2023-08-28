<?php require_once 'inc/init.php'; ?>
<style>
    .jarviswidget #calendar {
        margin-top: 0px;
    }

    .jarviswidget .fc-toolbar h2 {
        margin-top: 0;
    }

    #add-event-form table tr td {
        vertical-align: baseline;
    }

    .fc-event-container .bg-calendar-1 {
        background: white;
        border-left-color: var(--primary);
        color: var(--dark);
    }

    .fc-event-container .bg-calendar-2 {
        background: var(--info);
    }

    .fc-event-container .bg-calendar-3 {
        background: var(--danger);
    }

    .fc-event-container .bg-calendar-4 {
        background: var(--warning);
    }

    .fc-event-container .bg-calendar-5 {
        background: var(--success);
    }

    .fc-event-container .bg-calendar-6 {
        background: var(--dark);
        color: white
    }

    .fc-event-container .bg-calendar-6:hover {
        color: white
    }

    .fc-event-container .bg-calendar-7 {
        background: yellow;
    }

    .fc-event-container .bg-calendar-8,
    .fc-event-container .bg-calendar-undefined {
        background: var(--primary);
    }

    .fc-event-container .bg-calendar-9 {
        background: var(--claim);
    }

    .fc-time {
        display: none !important;
        visibility: hidden;
    }

    .fc-toolbar .fc-state-active{
        z-index: 1
    }

    /*.event {
        color: var(--dark);
    }

    .event:hover {
        color: var(--dark);
    }

    .jarviswidget .fc-toolbar h2{
        margin-top: 0;
    }

    .fc-time {
        display: none !important;
        visibility: hidden;
    }

    .fc-bg{
        bottom: unset;
    }

    .fc-bg table{
        background-color: white;
        z-index: 4
    }

    .fc-button-group button {
        text-transform: capitalize;
    }

    .fc-month-view .fc-event .fc-time{
        display: inline-block;
    }

    .fc-widget-header{
        font-weight: bold;
    }

    .fc-list-table td{
        line-height: 1.4;
        padding: 5px;
    }

    .fc-today{
        background: #e7e1d0
    }

    .fc-past{
        background: #cfcfcf;
    } */

    .popover {
        width: auto;
        max-width: unset;
    }

    .popover table {
        background-color: white;
        height: auto;
        overflow: visible;
    }

    .select2-container {
        width: 100% !important;
    }
</style>
<div class="row">
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <!-- <h1 class="page-title txt-color-blueDark">Home > Calendar</h1> -->
    </div>
</div>

<?php //echo json_encode($_SESSION['firebase_user']) 

?>

<section id="widget-grid" class="">
    <div id="message_calendar_login" style="display:none"></div>
    <div id="message_calendar" style="display:none"></div>
    <div class="row" id="calendar_parent" style="display:none">
        <div class="col-md-4">
            <div class="jarviswidget jarviswidget-color-blueDark">
                <header>
                    <h2 id="widdget_form_title"> Add Event </h2>
                </header>

                <!-- widget div-->
                <div>

                    <div class="widget-body">
                        <!-- content goes here -->
                        <form id="add-event-form">
                            <input type="hidden" name="eventId">
                            <table style="width:100%;">
                                <tbody>
                                    <tr class="smart-form hidden">
                                        <td colspan="2" class="inline-group">
                                            <label class="radio">
                                                <input type="radio" name="eventType" value="Time" checked><i></i> Time
                                            </label>
                                            <label class="radio">
                                                <input type="radio" name="eventType" value="All"><i></i> All day
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Title:</td>
                                        <td class="hasinput"><input name="title" type="text" class="form-control no-border" required></td>
                                    </tr>
                                    <?php
                                    // $date = new DateTime('now', new DateTimeZone('Asia/Ho_Chi_Minh'));
                                    // $date = new DateTime('now', new DateTimeZone($_COOKIE['timezone']));
                                    ?>
                                    <tr data-name="eventType" data-src="All">
                                        <td>Date:</td>
                                        <td class="hasinput"><input type="text" name="datetime" class="form-control no-border datepicker"></td>
                                    </tr>
                                    <tr data-name="eventType" data-src="Time">
                                        <td>Start:</td>
                                        <td class="hasinput"><input type="text" name="starttime" class="form-control no-border datetimepicker"></td>
                                    </tr>
                                    <tr data-name="eventType" data-src="Time">
                                        <td>Stop:</td>
                                        <td class="hasinput"><input type="text" name="stoptime" class="form-control no-border datetimepicker"></td>
                                    </tr>
                                    <tr>
                                        <td>Repeat:</td>
                                        <td class="hasinput">
                                            <select name="repeat" class="form-control">
                                                <option value="Never">Never</option>
                                                <option value="Daily">Daily</option>
                                                <option value="Weekly">Weekly</option>
                                                <option value="Monthly">Monthly</option>
                                                <option value="Yearly">Yearly</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                            <div data-name="repeat" data-src="Custom">
                                                <select name="repeatinterval" class="form-control">
                                                    <option value="ByMonth">By Month</option>
                                                    <option value="ByDay">By Day</option>
                                                </select>
                                                <div class="padding-top-5" data-name="repeatinterval" data-src="ByMonth">
                                                    <select name="by_month" class="form-control no-border w100" multiple></select>
                                                </div>
                                                <div class="padding-top-5" data-name="repeatinterval" data-src="ByDay">
                                                    <select name="by_day" class="form-control no-border w100" multiple></select>
                                                </div>
                                            </div>
                                            <div data-name="repeat" data-srcdif="Never">
                                                <label class="padding-top-5" data-name="repeat" data-srcdif="Never,Custom">
                                                    Interval <input type="number" name="interval_time" class="no-border" style="width:70px; text-align:center">
                                                    <span data-name="repeat"  data-src="Daily">day(s)</span>
                                                    <span data-name="repeat" data-src="Weekly">week(s)</span>
                                                    <span data-name="repeat" data-src="Monthly">month(s)</span>
                                                    <span data-name="repeat" data-src="Yearly">year(s)</span>
                                                </label>
                                                <br>
                                                <label class="padding-top-5">
                                                    Until <input type="text" name="untildate" class="no-border datepicker" style="width:70px; text-align:center">
                                                </label>
                                                <label class="padding-top-5">
                                                    or Count <input type="number" name="repeat_count" class="no-border" style="width:50px; text-align:center"> time(s)
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- <tr>
                                        <td>Attendees:</td>
                                        <td class="hasinput"><select type="text" name="attendees" class="form-control no-border"></select></td>
                                    </tr> -->

                                    <tr>
                                        <td>Location:</td>
                                        <td class="hasinput"><input type="text" name="location" class="form-control no-border"></td>
                                    </tr>
                                    <tr>
                                        <td>Color:</td>
                                        <td class="hasinput">
                                            <select name="color" class="form-control no-border"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Description:</td>
                                        <td class="hasinput"><textarea class="form-control border-bottom" name="description" cols="30" rows="5"></textarea></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="form-actions">
                                <div class="row">
                                    <div class="col-md-12">
                                        <button class="btn btn-sm btn-default" type="button" id="addEvent">
                                            Add Event
                                        </button>
                                        <button class="btn btn-sm btn-default" type="button" id="editEvent" style="display: none;">
                                            Edit This Event
                                        </button>
                                        <button class="btn btn-sm btn-default" type="button" id="editSerieEvent" style="display: none;">
                                            Edit All Events in Series
                                        </button>
                                        <button class="btn btn-sm btn-default" type="button" id="editAfterSerieEvent" style="display: none;">
                                            Edit This and Future Events
                                        </button>
                                        <button class="btn btn-sm btn-default" type="button" id="cancelEditEvent" style="display: none;">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <!-- end content -->
                    </div>

                </div>
                <!-- end widget div -->
            </div>
            <!------->
            <div class="jarviswidget jarviswidget-color-blueDark">
                <div>
                    <div class="widget-body smart-form">

                            <header style="border-bottom: none!important;">
                                <h4> My Calendar </h4>
                            </header>
                            <div id="my-calendar-list">

                            </div>
                            <header style="border-bottom: none!important;">
                                <h4> Other Calendar </h4>
                            </header>
                            <div id="other-calendar-list">

                        </div>
                    </div>
                </div>
            </div>
            <!------->
        </div>

        <div class="col-md-8">
            <div class="jarviswidget jarviswidget-color-blueDark">
                <header>
                    <h2> Your Events </h2>
                    <div class="jarviswidget-ctrls" id="calendar-form-control" role="menu">
                        <a class="button-icon refreshCalendar have-text" onclick="updateSigninStatus(true);"><i class="fa fa-refresh"></i></a>
                    </div>
                </header>
                <div>
                    <div class="widget-body">
                        <section class=" pb-10">
                            <?php 
                                $date_start = strtotime(date('Y-m-d') . ' -1 year');
                                $date_stop = strtotime(date('Y-m-d') . ' +1 year');
                            ?>
                            <section class="col col-sm-6 col-xs-12">
                                <label class="input">From</label>
                                <input type="date" name="date_from" value="<?= date('Y-m-d', $date_start); ?>" id="date_from">
                            </section>
                            <section class="col col-sm-6 col-xs-12 pb-10">
                                <label class="input">To</label>
                                <input type="date" name="date_to" value="<?= date('Y-m-d', $date_stop); ?>" id="date_to">
                            </section>
                        </section>
                        <legend></legend>
                        <div id="calendar"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="padding-10" id="event_info"></div>
</section>
<link rel="stylesheet" type="text/css" href="./js/plugin/datetimepicker/jquery.datetimepicker.css">
<script src="./js/plugin/moment/moment.min.js"></script>
<script src="./js/plugin/datetimepicker/build/jquery.datetimepicker.full.js"></script>
<script src="./js/plugin/fullcalendar/fullcalendar.min.js"></script>
<script>
    var userAccountInfo = $.extend({}, <?= isset($_SESSION['user_info']) ? json_encode($_SESSION['user_info']) : '{}' ?>);
    var userInfo = $.extend({}, <?= isset($_SESSION['firebase_user']) ? json_encode($_SESSION['firebase_user']) : '{}' ?>);
</script>
<script src="./js/script/calendar/calendar.js"></script>
<script src="./js/script/calendar/firebase-calendar.js"></script>
<!-- <script async defer src="https://apis.google.com/js/api.js"
    onload="this.onload=function(){};handleClientLoad()"
    onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script> -->