<?php
$current_file  = basename($_SERVER['PHP_SELF']);
$title = '';
$script = '';
switch ($current_file) {
    case 'dashboard.php':
        $title = 'Dashboard';
        break;
    case 'help-desk.php':
        $title = 'Help Desk';
        $script =
            '<script src="<?= ASSETS_URL ?>/js/plugin/docx2html/dist/docx2html.js"></script>
            <script src="<?= ASSETS_URL ?>/js/script/help-desk.js"></script>';
        break;
    case 'help-list.php':
        $title = 'Help List';
        break;
    case 'role-form.php':
        $title = 'ACL Management';
        $script = '<script src="<?php echo ASSETS_URL; ?>/js/script/acl-role.js"></script>';
        break;
    case 'group.php':
        $title = 'Group Management';
        $script = '<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
            <script src="<?= ASSETS_URL ?>/js/script/group/group.js"></script>';
        break;
    case 'group-list.php':
        $title = 'Group List';
        $script = '<script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js"></script>
            <script src="<?php echo ASSETS_URL; ?>/js/script/group/diagram-group.js"></script>
            <script src="<?php echo ASSETS_URL; ?>/js/script/group/group-list.js"></script>';
        break;
    case 'billing-template.php':
        $title = 'Billing Template';
        $script = '<script src="./js/script/billing/billing-template.js"></script>';
        break;
    case 'discount-form.php':
        $title = 'Discount';
        $script = '<script src="<?= ASSETS_URL; ?>/js/script/discount.js"></script>';
        break;
    case 'discount-list.php':
        $title = 'Discount List';
        $script = '<script src="<?= ASSETS_URL; ?>/js/script/discount-list.js"></script>';
        break;
    case 'setting.php':
        $title = 'Setting';
        $script  = '<script src="<?php echo ASSETS_URL; ?>/js/script/state.js"></script>
            <script src="<?php echo ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
            <script src="<?php echo ASSETS_URL; ?>/js/script/setting/setting.js"></script>';
        break;

    case 'contact-form.php':
        $title = 'Contact';
        $script = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.googlemap/1.5/jquery.googlemap.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/state.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/note.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/contact/track-email.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/contact/contact-notes.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/validator.plus.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/contact/contact-append.js"></script>
            <script src="<?= ASSETS_URL; ?>/js/script/contact/contact-form.js"></script>';
        break;
    case 'company-form.php':
        $title = 'Company';
        break;
    case 'product-form.php':
        $title = 'Product';
        break;
    case 'order-form.php':
        $title = 'Order';
        break;
    case 'warranty-form.php':
        $title = 'Warranty';
        break;
    case 'warranty-form-addnew-form.php':
        $title = 'Warranty';
        break;
    case 'invoice-form.php':
        $title = 'Invoice';
        break;
    case 'claim-form.php':
        $title = 'Claim';
        break;
    case 'import-form.php':
        $title = 'Import';
        break;

    case 'contact-list.php':
        $title = 'Contact List';
        break;
    case 'company-list.php':
        $title = 'Company List';
        break;
    case 'product-list.php':
        $title = 'Product List';
        break;
    case 'order-list.php':
        $title = 'Order List';
        break;
    case 'warranty-list.php':
        $title = 'Warranty List';
        break;
    case 'invoice-list.php':
        $title = 'Invoice List';
        break;
    case 'claim-list.php':
        $title = 'Claim List';
        break;

    case 'report-contact.php':
        $title = 'Report Contact';
        break;
    case 'report-company.php':
        $title = 'Report Company';
        break;
    case 'product-company.php':
        $title = 'Report Product';
        break;
    case 'order-company.php':
        $title = 'Report Order';
        break;
    case 'warranty-company.php':
        $title = 'Report Warranty';
        break;
    case 'invoice-company.php':
        $title = 'Report Invoice';
        break;
    case 'claim-company.php':
        $title = 'Report Claim';
        break;

    case 'map.php':
        $title = 'Location';
        break;
    case 'payment.php':
        $title = 'Payment';
        break;

    default:
        $title = '';
}
$page_title = $title;
