<?php

$company_form = 'CompanyForm';

use \SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php'

?>
<section id="widget-grid" class="">
    <?php
    $company_current_form = '';
    $companyEdit = array();
    $vendor = [];
    $vendordoc = [];
    $data_send = array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID']);
    if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'company-form') > 0) {
        $company_current_form = 'edit';
        $data = HTTPMethod::httpPost($link['_company_ID'], array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID'], 'ID' => getID()));

        if (isset($data) && isset($data->ERROR) && $data->ERROR == '') {
            $companyEdit = $data->comp;
            $vendor = $data->vendor;
            $vendordoc = $data->v_doc;
            $notes = $data->notes;
        }
    } else {
        $company_current_form = 'add';
    }
    $_ui->start_track();
    $body_company = '
<div id="message_form" role="alert" style="display:none"></div>
<form class="smart-form" id="company_form" method="post">
   <input type="hidden" name="ID" value="' . (isset($companyEdit->ID) ? $companyEdit->ID : '') . '">
   <fieldset>
   <div class="row">' . SmartForm::print_field(
        'name',
        SmartForm::FORM_FIELD_INPUT,
        array(
            'label' => 'Company Name',
            'class' => 'text-input',
            'value' => (isset($companyEdit->name) ? $companyEdit->name : ''),
            'disabled' => false,
        ), 6, true) . '</div></fieldset>'; {
        ob_start();
        $addressField = array(
            'form' => $company_form,
            'current_form' => $company_current_form,
            "address1" => "address1",
            "address1_val" => isset($companyEdit->address1) ? $companyEdit->address1 : '',
            "address2" => "address2",
            "address2_val" => isset($companyEdit->address2) ? $companyEdit->address2 : '',
            "postal_code" => "postal_code",
            "city" => "city",
            "state" => "state",
        );
        $form = 'CompanyForm';
        include './address_field.php';
        $body_company .= ob_get_contents();
        ob_end_clean();
        // unset($addressField);
    }

    $body_company .= '<fieldset><div class="row">' . SmartForm::print_field(
        'phone',
        SmartForm::FORM_FIELD_INPUT,
        array(
            'label' => 'Phone',
            'type' => 'tel',
            'value' => (isset($companyEdit->phone) ? $companyEdit->phone : ''),
            'disabled' => false,
        ),
        6,
        true
    );

    $body_company .= SmartForm::print_field(
        'fax',
        SmartForm::FORM_FIELD_INPUT,
        array(
            'label' => 'Fax',
            'type' => 'number',
            'class' => 'text-input',
            'value' => (isset($companyEdit->fax) ? $companyEdit->fax : ''),
            'disabled' => false,
        ),
        6,
        true
    );

    $body_company .= SmartForm::print_field(
        'email',
        SmartForm::FORM_FIELD_INPUT,
        array(
            'label' => 'Email',
            'type' => 'email',
            'value' => (isset($companyEdit->email) ? $companyEdit->email : ''),
            'disabled' => false,
        ),
        6,
        true
    );

    $body_company .= '
<section class="col col-6">
    <label class="input">Website</label>
    <div class="input-group" style="display:block">
        <select id="company_url_protocol" class="form-control" style="width:68px;">
            <option value="http://"' . (isset($companyEdit->www) && startsWith($companyEdit->www, 'http://') ? ' selected' : '') . '>http://</option>
            <option value="https://"' . (isset($companyEdit->www) && startsWith($companyEdit->www, 'https://') ? ' selected' : '') . '>https://</option>
        </select>
        <input type="text" id="company_url_host" class="form-control input-group-text" value="' . (isset($companyEdit->www) ? str_replace(['http://', 'https://'], '', $companyEdit->www) : '') . '">
        <button type="button" id="btn_company_open_url" class="btn btn-sm btn-default" onclick="url_company_open()"><i class="fa fa-external-link text-success"></i></button>
    </div>
</section>';

    $body_company .= SmartForm::print_field(
        'type',
        SmartForm::FORM_FIELD_CHECKBOX,
        array(
            'label' => 'Company Type',
            'inline' => "true",
            'items' => [
                ['label' => 'Real Estate Broker', 'value' => 'Real Estate Broker', 'checked' => (isset($companyEdit->type) && in_array('Real Estate Broker', $companyEdit->type) ? true : false)],
                ['label' => 'Mortgage', 'value' => 'Mortgage', 'checked' => (isset($companyEdit->type) && in_array('Mortgage', $companyEdit->type))],
                ['label' => 'Bacle', 'value' => 'Bacle', 'checked' => (isset($companyEdit->type) && in_array('Bacle', $companyEdit->type) ? true : false)],
                ['label' => 'Title', 'value' => 'Title', 'checked' => (isset($companyEdit->type) && in_array('Title', $companyEdit->type) ? true : false)],
                ['label' => 'Vendor<sup class="text-danger">*</sup>', 'value' => 'Vendor', 'checked' => (isset($companyEdit->type) && in_array('Vendor', $companyEdit->type) ? true : false)],
            ],
        ),
        6,
        true
    );


    $body_company .=
        '<section class="col col-6"> 
<label class="input">Company Tags</label>
<input type="text" class="form-control" id="tag" name="tag" value="' . (isset($companyEdit->tag) ? $companyEdit->tag : '') . '">
</section></div>';

    $list_vendor_type = ['HVAC', 'Electrial', 'Contractor', 'Morgage', 'Other'];
    $body_company .= '<br>
<div id="vendor_expand" class="row" style="display : none">';
    $body_company .= '
    <section class="col col-6">
        <label class="input">Vendor Type</label>
        <select name="vendor_type" id="vendor_type" class="form-control select2" style="width:100%" multiple>';
    foreach($list_vendor_type as $item){
        $body_company .= ' <option value="'.$item.'">'.$item.'</option>';
    }
    $body_company .='</select>
    </section>';

    $body_company .= SmartForm::print_field(
        'vendor_note',
        SmartForm::FORM_FIELD_TEXTAREA,
        array(
            'label' => 'Vendor Note',
            'value' => (isset($vendor) && isset($vendor->notes) ? $vendor->notes : ''),
            'attr' => array(
                "rows" => 5
            )
        ),
        6,
        true
    ) . '<div class="clearfix"></div>'; {
        ob_start();
        $documentPane = 'vendor_document_pane';
        $documentTitle = 'Vendor Document';
        $documentField = '<input type="hidden" name="vendorID" value="' . (isset($vendor) && isset($vendor->ID) ? $vendor->ID : '') . '">
    <input type="hidden" name="vendordocID" value="">';
        include 'document-table.php';
        $body_company .= ob_get_contents();
        ob_end_clean();
    }

    // $body_company .= '</div>';
    $body_company .= '</div></fieldset>';

    $pos = strrpos($_SERVER['REQUEST_URI'], "company-form");
    if ($pos > 0) {
        ob_start();
        $type_note = 'company';
        $can_add_note = true;

        include './notes.php';
        $body_company .= ob_get_contents();
        ob_end_clean();
    }

    $body_company .= '<footer>';
    // button Submit
    $body_company .= '<button type="submit" id="btnSubmitCompany" class="btn btn-primary">Submit</button>';
    // button Back
    $body_company .= '<button type="button" id="btnBackCompany" class="btn btn-default"">Back</button>';
    $body_company .= '</footer>
</form>';

    $_ui->create_widget()->body('content', $body_company)
        ->options('editbutton', false)
        ->body('class', 'no-padding')
        ->header('title', '<h2>Company Form ' . (isset($companyEdit->ID) ? "edit ID: " . getID() . '</h2> <a href="./#ajax/company-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Company</a>' : "") . '</h2>')->print_html();

    ?>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/notes.js"></script>

<script src="<?php echo ASSETS_URL; ?>/js/script/document.js"></script>
<script>
    var companyDocument = new DocumentTable({
        table: 'table_document',
        form: 'company_form',
        varName: 'companyDocument',
        documentID: 'vendorID',
        field: 'vendordocID',
        inputFormID: 'ID'
    });
    companyDocument.init();
</script>
<script src="<?php echo ASSETS_URL; ?>/js/script/company-form.js"></script>

<?php
if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'company-form') > 0) {
    echo ('<script>');
    echo ('var state = new State({element : "#company_form"});');
    if (isset($companyEdit->ID)) {
        echo 'state.setValue("#company_form", ' . (isset($companyEdit->city) ? '"' . $companyEdit->city . '"' : 'null') . ', ' . (isset($companyEdit->state) ? '"' . $companyEdit->state . '"' : 'null') . ', ' . (isset($companyEdit->postal_code) ? '"' . $companyEdit->postal_code . '"' : 'null') . ');';
    }

    if (isset($companyEdit->state)) {
        echo ('setTimeout(function () {
            state.bindAction("#company_form");
        }, 3000);');
    }
    if (isset($companyEdit->phone)) {
        echo ('iti.setNumber("' . $companyEdit->phone . '");');
    }
    if (isset($vendordoc) && $vendordoc != []) {
        echo ('companyDocument.pushDocuments(' . json_encode($vendordoc) . ');');
    }
    if (isset($notes) && sizeof($notes) > 0) {
        echo ('_notecontact.displayList(' . json_encode($notes) . ');');
    }
    if(isset($vendor->vendor_type)){
        echo '$("#vendor_type").val('. json_encode($vendor->vendor_type) .').change();';
    }
    echo ('</script>');
}
?>