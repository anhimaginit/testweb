<!------ Include the above in your HEAD tag ---------->
<?php
require 'inc/init.php';
if(isset($_SESSION['user_info'])) {
        //print_r($_SESSION['user_info']['ID']);
        $data=$_SESSION['user_info']['primary_phone'];
        $contact_ID = $_SESSION['user_info']['ID'];
    } else {
        echo "this session doesn't exist";
    }
?>

<?php
if ( isset($_GET['id']) && strrpos($_SERVER['REQUEST_URI'], 'sms-inbox-detail') > 0){
   //print_r("abcdat de di ia");
    $data = HTTPMethod::httpPost('https://api.warrantyproject.com/_smsDetail_msgid.php', array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID'], 'ID' => $_GET['id']));
    //var_dump($data->detail);
    $msg_detail = $data->detail;
   // die();
}
?>

<div class="mail-detail bg-white padding-10">
    <input type="hidden" id="sms_or_msg_id" name="sms_or_msg_id" value="">
    <input type="hidden" id="sms_or_body" name="sms_or_body" value="">
    <input type="hidden" id="sms_from" name="sms_from" value="<?php echo $msg_detail->msg_from;?>">
    <input type="hidden" id="sms_to" name="sms_to" value="<?php echo $msg_detail->msg_to;?>">
    <div class="padding-10"><button type="button" class="btn btn-default btn-sm btnBackContent"><i class="fa fa-arrow-left"></i></button></div>
    <div class="clearfix"></div>
    <div class="mail-content">
        <section>
            <h4 class="bold mail-sender">Sent from:  <span class="from_sms_number"><?php echo $msg_detail->msg_from;?></span></h4>
            <p class="text-dark mail-receiver"></p>
            </section>
        <section>
            <div class="mail-description"><?php echo $msg_detail->body;?><i class="fa fa-reply" id="sms_reply" style="font-size:25px;"><span class="tooltiptext">Reply</span></i></div>
            </section>
        </div>
</div>


<script src="./js/script/sms/sms-inbox-detail.js"></script>
