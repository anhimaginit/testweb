<?php
$product_form = 'ProductForm';

use \SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php';
$_authenticate->checkFormPermission($product_form);
$productEdit = [];
$product_operation = 'add';
$img_photo = './img/images.png';
if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'product-form') > 0) {
    $productEdit = HTTPMethod::httpPost($link['_productGetById'], ['ID' => getID(), 'token' => $_SESSION['token']])[0];
    $product_operation = 'edit';
    if(isset($productEdit->prod_photo) && $productEdit->prod_photo!=null && startsWith($productEdit->prod_photo, '/photo') || startsWith($productEdit->prod_photo, 'http')){
        $img_photo =  $productEdit->prod_photo;
    }
}
?>
<section id="widget-grid" class="">
    <?php
    $_ui->start_track();
    $body_product = '
<div id="message_form" role="alert" style="display:none"></div>
<form class="smart-form" id="product_form" method="post">
<input type="hidden" name="ID" value="' . (isset($productEdit->ID) ? $productEdit->ID : '') . '">
<input type="hidden" name="product_update" value="">
<input type="hidden" name="product_update_by" value="' . $_SESSION['userID'] . '">
 <fieldset>
    <div class="row">
        <section class="col col-6">'.
        SmartForm::print_field('prod_name', SmartForm::FORM_FIELD_INPUT,
            array(
                'label' => 'Product Name',
                'class' => '',
                'value' => (isset($productEdit->prod_name) ? $productEdit->prod_name : ''),
                'attr'=> array(hasPermission($product_form, 'prod_name', $product_operation) ? '' : 'readonly="true"'),
            ), 12, true, hasPermission($product_form, 'prod_name', 'show')) .
        SmartForm::print_field('SKU', SmartForm::FORM_FIELD_INPUT,
            array(
                'label' => 'SKU',
                'class' => '',
                'value' => (isset($productEdit->SKU) ? $productEdit->SKU : ''),
                'attr' => array(hasPermission($product_form, 'SKU', $product_operation) ? '' : 'readonly="true"'),
                'properties' => array(
                    'maxlength="20"'
                )
            ), 12, true, hasPermission($product_form, 'SKU', 'show')) .
        SmartForm::print_field('prod_desc', SmartForm::FORM_FIELD_TEXTAREA,
            array(
                'label' => 'Description',
                'class' => '',
                'value' => (isset($productEdit->prod_desc) ? $productEdit->prod_desc : ''),
                'attr'=>array(hasPermission($product_form, 'prod_desc', $product_operation) ? '' : 'readonly="true"'),
            ), 12, true, hasPermission($product_form, 'prod_desc', 'show')) .
        SmartForm::print_field('prod_desc_short', SmartForm::FORM_FIELD_TEXTAREA,
            array(
                'label' => 'Short Description',
                'value' => (isset($productEdit->prod_desc_short) ? $productEdit->prod_desc_short : ''),
                'attr'=>array(hasPermission($product_form, 'prod_desc_short', $product_operation) ? '' : 'readonly="true"'),
            ), 12, true, hasPermission($product_form, 'prod_desc_short', 'show')).
        '
        </section>
        <section class="col col-lg-6 col-xs-12">' .
        SmartForm::print_field(
            'prod_photo',
            SmartForm::FORM_FIELD_INPUT,
            array(
                'label' => 'Product Photo',
                'type' => 'file',
                'attr' => array(
                    'onchange="readURL(this, `#product_img`)"',
                    'accept="image/jpg|png|jpeg"',
                    hasPermission($product_form, 'prod_photo', $product_operation) ? '' : 'readonly="true"'
                )
            ), 12, true, hasPermission($product_form, 'prod_photo', 'show'))
        .( hasPermission($product_form, 'prod_photo', 'show') ? '<input type="hidden" id="product_img">
            <div class="col col-lg-12 col-12"><img src="' . $img_photo . '" class="img img-responsive" id="image-preview" style="width: auto; max-height:230px;"></div>
        ' : '').'</section>
    </div>
        <div class="row">' .
        SmartForm::print_field(
            'prod_type',
            SmartForm::FORM_FIELD_SELECT,
            array(
                'label' => 'Type',
                'data' => HTTPMethod::httpPost($link['_getProductType'], ['token' => $_SESSION['token']]),
                'value' => 'prodType_name',
                'display' => 'prodType_name',
                'attr'=>array(hasPermission($product_form, 'prod_type', $product_operation) ? '' : 'disabled'),
            ), 6, true, hasPermission($product_form, 'prod_type', 'show')) .
        SmartForm::print_field('prod_class', SmartForm::FORM_FIELD_SELECT,
            array(
                'label' => 'Class',
                'data' => [''],
                'attr' => array(hasPermission($product_form, 'prod_class', $product_operation) ? '' : 'disabled'),
            ),
            6,
            true,
            hasPermission($product_form, 'prod_type', 'show')
        ) . '
    </div>
    <div class="row">';
    if (isAdmin()) {
        $body_product .= SmartForm::print_field(
            'prod_cost',
            SmartForm::FORM_FIELD_INPUT,
            array(
                'icon' => 'fa-dollar',
                'icon_append' => false,
                'label' => 'Cost',
                'type' => 'number',
                'min' => 0,
                'placeholder' => "0.00",
                'class' => 'input-currency',
                'value' => (isset($productEdit->prod_cost) ? $productEdit->prod_cost : '0.00'),
                'attr' => array(
                    'step=0.01',
                    'number-to-fixed="2"',
                    'data-number-stepfactor="100"',
                    hasPermission($product_form, 'prod_cost', $product_operation) ? '' : 'readonly="true"'
                ),
            ), 6, true, hasPermission($product_form, 'prod_cost', 'show')) ;
    }
    $body_product .= SmartForm::print_field('prod_price', SmartForm::FORM_FIELD_INPUT,
            array(
                'icon' => 'fa-dollar',
                'icon_append' => false,
                'label' => 'Price',
                'type' => 'number',
                'min' => 0,
                'placeholder' => "0.00",
                'class' => 'input-currency currency',
                'value' => (isset($productEdit->prod_price) ? $productEdit->prod_price : '0.00'),
                'attr' => array(
                    'step=0.01',
                    'number-to-fixed="2"',
                    'data-number-stepfactor="100"',
                    hasPermission($product_form, 'prod_price', $product_operation) ? '' : 'readonly="true"',
                )
            ), 6, true, hasPermission($product_form, 'prod_price', 'show')) . '
    </div>
    <div class="row">' .
        SmartForm::print_field(
            'prod_weight',
            SmartForm::FORM_FIELD_INPUT,
            array(
                'icon' => 'fa-lbs bold',
                'label' => 'Weight',
                'type' => 'number',
                'min' => 0,
                'value' => (isset($productEdit->prod_weight) ? $productEdit->prod_weight : '0.0'),
                'attr'=>array(hasPermission($product_form, 'prod_weight', $product_operation) ? '' : 'readonly="true"'),
            ), 3, true, hasPermission($product_form, 'prod_weight', 'show')).
        SmartForm::print_field('prod_length', SmartForm::FORM_FIELD_INPUT,
            array(
                'icon' => 'fa-in bold',
                'label' => 'Length',
                'type' => 'number',
                'min' => 0,
                'value' => (isset($productEdit->prod_length) ? $productEdit->prod_length : '0.0'),
                'attr'=>array(hasPermission($product_form, 'prod_length', $product_operation) ? '' : 'readonly="true"'),
            ), 3, true, hasPermission($product_form, 'prod_length', 'show')) .
        SmartForm::print_field('prod_width', SmartForm::FORM_FIELD_INPUT,
            array(
                'icon' => 'fa-in bold',
                'label' => 'Width',
                'type' => 'number',
                'min' => 0,
                'value' => (isset($productEdit->prod_width) ? $productEdit->prod_width : '0.0'),
                'attr'=>array(hasPermission($product_form, 'prod_width', $product_operation) ? '' : 'readonly="true"'),
            ), 3, true, hasPermission($product_form, 'prod_width', 'show')) .
        SmartForm::print_field('prod_height', SmartForm::FORM_FIELD_INPUT,
            array(
                'icon' => 'fa-in bold',
                'label' => 'Height',
                'type' => 'number',
                'min' => 0,
                'value' => (isset($productEdit->prod_height) ? $productEdit->prod_height : '0.0'),
                'attr'=>array(hasPermission($product_form, 'prod_height', $product_operation) ? '' : 'readonly="true"'),
            ), 3, true, hasPermission($product_form, 'prod_height', 'show')) .
        '</div>
        <div class="row">';
    if (hasPermission($product_form, 'product_tags', 'show') || isSuperAdmin()) {
        $body_product .= '
        <div class="col col-6">
            <section>
                <label class="input">Product Tags</label>
                <input class="form-control" value="' . (isset($productEdit->product_tags) ? $productEdit->product_tags : '') . '" name="product_tags" id="product_tags" ' . (hasPermission($product_form, 'product_tags', $product_operation) ? '' : 'readonly') . '>
            </section>' .
            '</div>';
    }
    if (hasPermission($product_form, 'product_notes', 'show')) {
        $body_product .= '
        <div class="col col-6">
            <section>
                <label class="input">Product Notes</label>
                <label class="input"><textarea name="product_notes" value="' . (isset($productEdit->product_notes) ? $productEdit->product_notes : '') . '" rows="4" class="form-control" ' . (hasPermission($product_form, 'product_notes', $product_operation) ? '' : 'readonly') . '></textarea></label>
            </section>
        </div>';
    }
    $body_product .= '</div>';

    if (hasPermission($product_form, 'product_taxable', 'show')) {
        $body_product .= '<label class="checkbox">
            <input type="checkbox" name="product_taxable" value="1" ' . (isset($productEdit->product_taxable) && $productEdit->product_taxable == 1 ? ' checked ' : '') . (hasPermission($product_form, 'product_taxable', $product_operation) ? '' : 'disabled') . '>
        <i></i> Taxable</label>';
    }

    if (hasPermission($product_form, 'prod_visible', 'show')) {
        $body_product .= '<label class="checkbox">
        <input type="checkbox" name="prod_visible" value="1" ' . (isset($productEdit->prod_visible) && $productEdit->prod_visible == 1 ? ' checked ' : '') . (hasPermission($product_form, 'prod_visible', $product_operation) ? '' : 'disabled') . '>
        <i></i> Public Visible</label>';
    }

    if (hasPermission($product_form, 'prod_internal_visible', 'show')) {
        $body_product .= '<label class="checkbox">
            <input type="checkbox" name="prod_internal_visible" value="1" ' . (isset($productEdit->prod_internal_visible) && $productEdit->prod_internal_visible == 1 ? ' checked ' : '') . (hasPermission($product_form, 'prod_internal_visible', $product_operation) ? '' : 'disabled') . '>
        <i></i> Internal Visible</label>';
    }

    if (hasPermission($product_form, 'prod_inactive', 'show')) {
        $body_product .= '<label class="checkbox">
        <input type="checkbox" name="prod_inactive" value="1" ' . (isset($productEdit->prod_inactive) && $productEdit->prod_inactive == 1 ? ' checked ' : '') . (hasPermission($product_form, 'prod_inactive', $product_operation)) . '>
        <i></i> Inactive</label>';
    }

    $body_product .= '  </fieldset>';
    $body_product .= '<footer>';
    $body_product .= (hasPermission($product_form, 'btnSubmitProduct', 'show')) ? '<button type="submit" id="btnSubmitProduct" class="btn btn-primary">Submit</button>' : '';
    $body_product .= (hasPermission($product_form, 'btnBackProduct', 'show')) ? '<button type="button" id="btnBackProduct" id="btnBackContact" class="btn btn-default"">Back</button>' : '';
    $body_product .= '</footer>';
    $body_product .= '</form>';

    ob_start();
    $help_form = 'product';
    include 'btn-help.php';
    unset($help_form);
    $help = ob_get_contents();
    ob_clean();
    $_ui->create_widget()->body('content', $body_product)
        ->options('editbutton', false)
        ->body('class', 'no-padding')
        ->header(
            'title',
            '<h2>Product Form ' . (hasIdParam() ? "edit ID: " . getID() . '</h2>
            <div class="jarviswidget-ctrls" id="product-form-control" role="menu">
                <span class="p-5">'. $help.'</span>
                <a href="./#ajax/product-form.php" class="btn-primary have-text"><i class="fa fa-plus"></i> Create new Product</a>
            </div>'
                : "</h2>")
        )->print_html();
    ?>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/product-form.js"></script>
<script>
    $(function() {
        $('.fa-lbs').text('lbs');
        $('.fa-in').text('in');
    })

    <?php if(isset($productEdit->ID)) {echo 'new ControlPage("#product-form-control");';} ?>
</script>