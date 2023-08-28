<!-- PAGE FOOTER -->
<div class="page-footer">
	<div class="row">
		<div class="col-xs-12 col-sm-12">
			<span class="txt-color-white">
				<?= isset($_SESSION['settingPage']->footer_info) && $_SESSION['settingPage']->footer_info != '' ?
					$_SESSION['settingPage']->footer_info : 'Home Warranty<span class="hidden-xs"> - Developed by Imagine IT Solutions</span> © 2018-2019' ?>
			</span>
		</div>
	</div>
</div>

<?php
if(isset($_SESSION['user_info'])) {
    $user_phone = isset($_SESSION['user_info']['primary_phone']) ? $_SESSION['user_info']['primary_phone'] : '';
    $contact_ID = $_SESSION['userID'];
}
?>
<!-- 
<script type="text/javascript">
        var _data = {};
        var contact_ID = '<?php echo $contact_ID;?>';
        var user_phone = '<?php echo $user_phone;?>';
        _data.phone = user_phone;
        _data.contactID = contact_ID;
        _data.jwt = '<?php echo $_SESSION['jwt'];?>';
        _data.token ='<?php echo $_SESSION['token'];?>' ;
        _data.private_key ='<?php echo $_SESSION['userID'];?>';

        var auto_refresh_sms = setInterval(
            function ()
            {
                $.ajax({
                    url:link._sms_total_new_msg,
                    type: 'post',
                    data: _data,
                    dataType: 'json',
                    success: function (res) {
                    //    var count = $("#count_unread_sms_noti span.badge").text();
                        $("#count_unread_sms_noti span.badge").text(res.list);
                    //    $("#count_unread_sms_noti span.badge").text(count-1);
                    },
                    error: function (e) {

                    }
                });
            }, 30000); // refresh every 5000 milliseconds

        var auto_refresh_email = setInterval(
            function ()
            {
                $.ajax({
                    url: link._emails_inbox_total_new,
                    type: 'post',
                    data: _data,
                    dataType: 'json',
                    success: function (res) {
                        //alert("no no no");
                        //var count = $("#count_unread_email_noti span.badge").text();
                        $("#count_unread_email_noti span.badge").text(res.total);
                        //    var count = $("#count_unread_sms_noti span.badge").text();
                        //$("#count_unread_sms_noti span.badge").text(res.total);
                    },
                    error: function (e) {

                    }
                });
            }, 30000); // refresh every 5000 milliseconds


        var auto_refresh_task = setInterval(
            function ()
            {
                $.ajax({
                    url: link._taskNewTotal,
                    type: 'post',
                    data: _data,
                    dataType: 'json',
                    success: function (res) {
                        //alert("no no no");
                        //var count = $("#count_undone_task_noti span.badge").text();
                        $("#count_undone_task_noti span.badge").text(res.total);
                        //    var count = $("#count_unread_sms_noti span.badge").text();
                        //$("#count_unread_sms_noti span.badge").text(res.total);
                    },
                    error: function (e) {

                    }
                });
            }, 30000); // refresh every 5000 milliseconds
</script> -->