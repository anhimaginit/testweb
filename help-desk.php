<?php
if (!session_id()) {
    session_start();
}
require_once 'init.php';

$page_title = "Help Desk";
$array_keys = [];
$page_html_prop = array();

$page_css = ["your_style.css"];
$no_main_header = !isset($_SESSION['userID']);
$page_body_prop = array("id" => "extr-page", "class" => "animated fadeInDown");

include "inc/header.php";


?>
<style>
    .inbox-info-bar .control-label {
        top: 8px;
    }

    .inbox-info-bar {
        width: 100%;
    }

    .inbox-info-bar .row {
        margin: 5px 10px;

    }
</style>
<div class="clearfix"></div>
<div role="main" style="padding-bottom:40px;">
    <div id="content" class="container jumbotron">
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
                <h3>New Ticket</h3>
            </div>
        </div>
        <section class="bg-color-white padding-10">
            <div class="row">
                <div id="message_form" role="alert" style="display:none"></div>
                <form id="ticket_form" class="padding-10" method="POST">
                    <input type="hidden" name="avt" value="<?php echo isset($_SESSION['firebase_user']) ? $_SESSION['firebase_user']['photoURL'] : './img/avatars/sunny.png' ?>">
                    <div class="inbox-info-bar">
                        <div class="row">
                            <div class="form-group">
                                <label class="control-label col-md-1 text-right bold">Subject</label>
                                <div class="col-md-11">
                                    <input type="text" class="form-control no-border" tabindex="2" name="subject">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="inbox-info-bar">
                        <div class="row">
                            <div class="form-group">
                                <label class="control-label col-md-1 text-right bold mg-b-10">Problem</label>
                                <div class="col-md-12">
                                    <textarea id="contentMail" class="inbox-message no-padding" tabindex="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="inbox-info-bar">
                        <div class="row">
                            <div class="form-group">
                                <label class="control-label col-md-1 text-right bold">Form</label>
                                <div class="col-md-4">
                                    <select name="form" class="form-control no-border" tabindex="1">
                                        <?php
                                        $form_list_help = ['None', 'Login', 'Register', 'Reset Password', 'Location', 'Search', 'Purchase Home Warranty', 'Dashboard', 'opGroupHelp Desk', 'Help Content', 'Help Files', 'Create Help Content', 'Issue Ticket', 'Edit Issue Ticket', 'Ticket List', 'opGroupAdministrator', 'Role', 'State', 'Add Group', 'Group List', 'Billing Template', 'Add Discount', 'Discount List', 'Discount Repport', 'Setting', 'endGroup', 'opGroupContact', 'Add Contact', 'Contact List', 'Contact Report', 'endGroup',  'opGroupCompany', 'Add Company', 'Company List', 'Company Report', 'endGroup', 'opGroupProduct', 'Add Product', 'Product List', 'Products Report', 'endGroup', 'opGroupOrder', 'Add Order', 'Order List', 'Order Report', 'endGroup', 'opGroupWarranty', 'Add Warranty', 'Add/Edit Warranty', 'Warranty List', 'Warranty Report', 'endGroup', 'opGroupInvoice', 'Add Invoice', 'Invoice List', 'Invoice Report', 'endGroup', 'opGroupClaim', 'Add Claim', 'Add/Update Claim Limit', 'Claim List', 'Claim Report', 'endGroup', 'opGroupImport', 'Import Product', 'Import Contact', 'endGroup', 'opGroupTask', 'Add Task', 'Task List', 'Task Template', 'endGroup',  'opGroupMail', 'Compose', 'Inbox', 'Sent', 'Drafts', 'endGroup'];
                                        $htm = '';
                                        foreach ($form_list_help as $item) {
                                            if (startsWith($item, 'opGroup')) {
                                                $htm .= '<optgroup label="' . (substr($item, 7)) . '">';
                                            } else if ($item == 'endGroup') {
                                                $htm .= '</optgroup>';
                                            } else {
                                                $htm .= '<option value="' . strtolower(str_replace([' ', '/'], '',  $item)) . '">' . $item . '</option>';
                                            }
                                        }
                                        echo $htm;
                                        ?>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="inbox-info-bar">
                        <div class="row">
                            <div class="form-group">
                                <label class="control-label col-md-1 text-right bold mg-b-10">Screenshot</label>
                                <div class="col-md-12">
                                    <input type="file" accept="image/*" class="form-control no-border" tabindex="4" name="screenshot" multiple>
                                </div>
                                <div class="col-xs-12" id="viewImagePane"></div>
                            </div>
                        </div>
                    </div>
                    <div class="inbox-info-bar">
                        <div class="row">
                            <div class="form-group">
                                <label class="control-label col-md-1 text-right bold mg-b-10">Note</label>
                                <table id="table_note_info" class="table table-bordered" style="table-layout: auto; width: 100%;"></table>
                            </div>
                        </div>
                    </div>
                    <div class="inbox-info-bar">
                        <div class="row">
                            <div class="form-group">
                                <label class="control-label col-md-1 text-right bold mg-b-10">Status</label>
                                <div class="col-md-4">
                                    <select name="status" class="form-control no-border" tabindex="5">
                                        <option value="open">Open</option>
                                        <option value="inprocess">In Process</option>
                                        <option value="done">Done</option>
                                        <option value="close">Close</option>
                                        <option value="cancel">Cancel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="inbox-compose-footer" style="width:100%">
                        <button class="btn btn-default" type="button" onclick="window.history.back()"> Back </button>
                        <button data-loading-text="<i class='fa fa-refresh fa-spin'></i> &nbsp; Sending..." class="btn btn-primary pull-right" type="button" id="send">
                            Submit <i class="fa fa-arrow-circle-right fa-lg"></i>
                        </button>
                    </div>
                </form>
            </div>
        </section>
        <?php include 'inc/scripts.php' ?>
        <script src="js/plugin/summernote/summernote.min.js"></script>
        <script src="js/script/note.js"></script>
        <script src="js/util/new-ticket.js"></script>
        <?php
        $mail_popup_id = 'note_mail_popup';
        $mail_popup_event = 'sendMailNote()';
        include 'ajax/email-template.php';
        unset($mail_popup_id);
        unset($mail_popup_event);
        ?>
    </div>
</div>
<?php include 'inc/footer.php';

include "inc/google-analytics.php";
?>