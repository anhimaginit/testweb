<?php
$claim_form = 'ClaimForm';
use \SmartUI\Components\SmartForm;
use \SmartUI\Util as SmartUtil;

require_once 'inc/init.php';
require_once '../php/link.php';

$_authenticate->checkFormPermission($claim_form);

/**-----Edit transaction-------------------------------- */
$current_form = '';
$transactionEdit = array();
$transactiontmp = array();
if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'claim-form.transaction') > 0) {
    $transactiontmp = HTTPMethod::httpPost($link['_claimTransactionByID'], array(
        'token' => $_SESSION['token'],
        'jwt' => $_SESSION['jwt'],
        'ID' => getID(),
        'private_key' => $_SESSION['userID'],
    ));
    if ($transactiontmp->ERROR == '' && isset($transactiontmp->ClaimTransaction[0])) {
        $current_form = 'edit';
        $transactionEdit = $transactiontmp->ClaimTransaction[0];
    }
} else {
    $current_form = 'add';
}

/** List claim for select Claim ID */
$claim_list_tmp = HTTPMethod::httpPost($link['_claimGetClaimsCreateBy'], array(
    'token' => $_SESSION['token'],
    'jwt' => $_SESSION['jwt'],
    'create_by' => $_SESSION['userID'],
    'private_key' => $_SESSION['userID'],
));

$claim_list = array('Select claim');
foreach ($claim_list_tmp->list as $item) {
    // if ($item->status != 'Close') {
        $claim_list[] = $item;
    // }
}

$_ui->start_track();

$body_claim_transaction = '';

$body_claim_transaction .= '
<div id="message_form" role="alert" style="display:none"></div>
<form class="smart-form" id="claim_transaction_form" method="post">';

$body_claim_transaction .= SmartForm::print_field('ID', SmartForm::FORM_FIELD_HIDDEN,
    array('value' => (hasIdParam() && isset($transactionEdit->ID) ? $transactionEdit->ID : '')));

$body_claim_transaction .= SmartForm::print_field('date_time', SmartForm::FORM_FIELD_HIDDEN,
    array('value' => (hasIdParam() && isset($transactionEdit->date_time) ? $transactionEdit->date_time : '')));

$body_claim_transaction .= SmartForm::print_field('claim_ID', SmartForm::FORM_FIELD_HIDDEN,
    array('value' => (hasIdParam() && isset($transactionEdit->claim_ID) ? $transactionEdit->claim_ID : '')));

$body_claim_transaction .= SmartForm::print_field('claim', SmartForm::FORM_FIELD_SELECT,
    array(
        'id' => 'claim_list',
        'label' => 'Claim ID',
        'data' => $claim_list,
        'display' => function ($data) {
            return ((gettype($data) == 'string') ? $data : 'ID: ' . $data->ID . ' - Customer: ' . $data->contact_name);
        },
        'value' => function ($data) {
            if (gettype($data) == 'string') {
                return '';
            } else {
                return $data->ID;
            }
        },
        'selected' => (hasIdParam() && isset($transactionEdit->claim_ID) ? $transactionEdit->claim_ID : ''),
    ), 6, true);

$body_claim_transaction .= SmartForm::print_field('warranty_id', SmartForm::FORM_FIELD_INPUT,
    array(
        'id' => 'warranty_id',
        'label' => 'Warranty ID',
        'value' => (hasIdParam() && isset($transactionEdit->warranty_id) ? $transactionEdit->warranty_id : '0'),
        'type' => 'number',
        'disabled' => true,
    ), 6, true);

$body_claim_transaction .= '<div class="row"><section class="col col-6">';
$body_claim_transaction .= '<div id="claim_info">';
$body_claim_transaction .= '</div></section>';

$body_claim_transaction .= '</div>';
$body_claim_transaction .= '
<table id="transaction_table_form" class="table table-tripped" style="display:none">
   <thead>
        <th class="hidden">Date Time</th>
        <th>Limit Name</th>
        <th class="text-right">Original Limit</th>
        <th class="text-right">Current Limit</th>
        <th class="text-right">Available</th>
        <th class="text-right col-2">Claim</th>
        <th class="hidden">Person</th>
        <!-- <th style="min-width:30px;"></th> -->
   </thead>
   <tbody></tbody>
   <tfoot>
   </tfoot>
</table>';

$body_claim_transaction .= '<footer>';
$body_claim_transaction .= '<button type="submit" id="btnSubmitClaimTransaction" class="btn btn-primary">Submit</button>';
$body_claim_transaction .= '<button type="button" id="btnBackClaimTransaction" class="btn btn-default"">Back</button>';
$body_claim_transaction .= '</footer>';
$body_claim_transaction .= '</form>';
?>




<section id="widget-grid" class="">
    <div class="row">
        <div id="message_form" role="alert" style="display:none"></div>

    <?php
    $_ui->create_widget()->body('content', $body_claim_transaction)
        ->options('editbutton', false)
        ->body('class', '')
        ->header('title', '<h2>Claim Transaction ' . ($current_form == 'edit' ? "edit ID: " . getID() . '</h2>' . '<a href="./#ajax/claim-form.transaction.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Claim transaction</a>' : ""))
        ->print_html();
    ?>

    </div>
<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="modal_overide_claim">
    <div class="modal-dialog">
        <div class="modal-content">
            <?php include 'claim-transaction.overide.php'; ?>
        </div>
    </div>
</div>
    
</section>

<script src="<?php echo ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/transaction.overide.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/transaction.js"></script>