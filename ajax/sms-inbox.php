<!------ Include the above in your HEAD tag ---------->
<?php
session_start();

if(isset($_SESSION['user_info'])) {
   //     print_r($_SESSION['user_info']);
        $data=$_SESSION['user_info']['primary_phone'];
        $contact_ID = $_SESSION['user_info']['ID'];
   // $username_credential = "'".$sms_api_username."'";

}
?>


<div>
    <input type="hidden" id="phone_inbox_get" name="phone_inbox_get" value="<?php if(isset($data)) { echo $data;} ?>">
    <input type="hidden" id="contact_inbox_get" name="contact_inbox_get" value="<?php if(isset($contact_ID)) { echo $contact_ID;} ?>">
    <div class="mail-box">
        <aside class="lg-side">
            <div class="inbox-head">
                <h3><strong>SMS INBOX</strong></h3>
                <form action="#" class="pull-right position">
                    <div class="input-append">
                        <input type="text" class="sr-input" placeholder="Search SMS">
                        <button class="btn sr-btn" type="button"><i class="fa fa-search"></i></button>
                    </div>
                </form>
            </div>

            <div class="clearfix"></div>
            <div class="inbox-body smart-form">
                <table class="table table-inbox table-hover" style="width:100%" id="smsInbox">
                    <thead style="">
                    <tr>
                        <th class="hidden"></th>
                        <th class="">Sent From</th>
                        <th class="">Client Name</th>
                        <th class="">Message</th>
                        <th class="">Date</th>
                        <th class="hidden"></th>
                        <th class="hidden"></th>
                        <th class="hidden"></th>
                        <th class="hidden"></th>
                        <th class="hidden"></th>
                        <th class="hidden"></th>
                        <th class="hidden"></th>
                        <th>Internal Forward</th> 
                        <th>Mark As Read</th>
                        <th>Reply</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            </div>
        </aside>
    </div>
</div>


<?php
$sms_popup_id = 'reply_sms';
include 'reply-SMS-template.php';
unset($sms_popup_id);
?>

<?php
$sms_forward_id = 'forward_sms';
include 'forward-SMS-template.php';
unset($sms_forward_id);
?> 

<script src="./js/script/sms/sms-op.js"></script>
<script>
var smsInbox = new SMSInbox();
smsInbox.bindEvent();
smsInbox.loadListSMS(link._sms_Inbox, '#smsInbox');
</script>