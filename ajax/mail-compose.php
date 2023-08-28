<!------ Include the above in your HEAD tag ---------->
<?php
require 'inc/init.php';


$mailEdit = array();
$update = false;
if (hasIdParam()) {
    $mailEdit = HTTPMethod::httpPost(
        HOST . '/_emails_open.php',
        array(
            'token' => $_SESSION['token'],
            'jwt' => $_SESSION['jwt'],
            'private_key' => $_SESSION['userID'],
            'mailID' => getID(),
            'inbox' => 0
        )
    )->mail;
    if (isset($mailEdit->id)) {
        $update = true;
    }
}
?>
<div>
    <div class="mail-box">

        <aside class="lg-side">
            <div class="inbox-head">
                <h3><strong>COMPOSE</strong></h3>
                <form class="pull-right position">
                    <!-- <div class="input-append">
                        <input type="text" class="sr-input" placeholder="Search Mail">
                        <button class="btn sr-btn" type="button"><i class="fa fa-search"></i></button>
                    </div> -->
                </form>
            </div>
            <div id="message_form" style="display:none"></div>
            <div class="inbox-body">
                <div class="mail-compose">
                    <input type="hidden" id="draft">
                    <input type="hidden" id="id" value="<?= $update ? $mailEdit->id : '' ?>">
                    <div class="form-group">
                        <label for="To">To:</label>
                        <select class="form-control mailTo" multiple="multiple" style="width: 100%;">
                            <?php
                            if ($update && isset($mailEdit->receiver_detail) && sizeof($mailEdit->receiver_detail) > 0) {
                                foreach($mailEdit->receiver_detail as $key => $value){
                                    echo '<option value="'.$value->ID.'" selected>'.$value->receiver_name.'</option>';
                                }
                            }
                            ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="To">Subject:</label>
                        <input type="text" class="form-control" value="<?= $update ? $mailEdit->subject : '' ?>" id="mailSubject">
                    </div>

                    <div class="form-group">
                        <label for="comment">Content:</label>
                        <textarea class="form-control" rows="10" id="mailComment"><?= $update ? $mailEdit->description : '' ?></textarea>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-primary" id="btnSendMail">Send</button>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</div>

<script src="<?=ASSETS_URL?>/js/script/mail/mail-compose.js"></script>