<?php
session_start();
if(isset($_SESSION['user_info'])) {
    //print_r($_SESSION['user_info']['ID']);
    $data=$_SESSION['user_info']['primary_phone'];
    $contact_ID = $_SESSION['user_info']['ID'];
} else {
    echo "this session doesn't exist";
}
?>

<?php require_once 'inc/init.php'; ?>

<div>
    <div class="sms-box">
        <input type="hidden" id="phone_inbox_get" name="phone_inbox_get" value="<?php if(isset($data)) { echo $data;} ?>">
        <input type="hidden" id="contact_inbox_get" name="contact_inbox_get" value="<?php if(isset($contact_ID)) { echo $contact_ID;} ?>">
        <aside class="lg-side">
            <div class="inbox-head">
                <h3><strong>SENT</strong></h3>
                <form action="#" class="pull-right position">
                    <!-- <div class="input-append">
                        <input type="text" class="sr-input" placeholder="Search Mail">
                        <button class="btn sr-btn" type="button"><i class="fa fa-search"></i></button>
                    </div> -->
                </form>
            </div>
            <div id="message_form" style="display:none"></div>
            <div class="inbox-body smart-form">
                <table class="table table-inbox table-hover" style="width:100%" id="smsSent">
                    <thead style="">
                    <tr>
                        <th class="hidden">Date</th>
                        <th class="">Sent To</th>
                        <th class="">Client Name</th>
                        <th class="">Message</th>
                        <th class="">Date</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            </div>
        </aside>
    </div>
</div>
<script src="./js/script/sms/sms-sent.js"></script>
<script>
    var smssent = new SMSsent();
    smssent.loadListSMS(link._sms_Sent, '.sms-box .inbox-body #smsSent');
</script>