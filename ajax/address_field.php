<?php
use \SmartUI\Components\SmartForm;
/**
 * need variable : ex:
 * $addressField = array(
 *       'form' => $warranty_form,
 *       'current_form' -> 'add' or 'edit'
 *       "address1" => "warranty_address1",
 *       "address2" => "warranty_address2",
 *       "postal_code" => "warranty_postal_code",
 *       "city" => "warranty_city",
 *       "state" => "warranty_state",
 *   );
 */
?>
<fieldset class="pane_address">
    <legend>Address</legend>
    <div class="row">

        <?php echo SmartForm::print_field(
            $addressField['address1'],
            SmartForm::FORM_FIELD_INPUT,
            array(
                'label' => isset($addressField['address1_label']) ? $addressField['address1_label'] : 'Street Address 1',
                'value' => isset($addressField['address1_val']) ? $addressField['address1_val'] : '',
                'attr' => array(
                    hasPermission($addressField['form'], $addressField['address1'], $addressField['current_form']) ? '' : 'readonly'
                )
            ),
            6,
            true, hasPermission($addressField['form'], $addressField['address1'], 'show')
        );?>
    </div>

    <div class="row">
        <?php echo SmartForm::print_field(
            $addressField['address2'],
            SmartForm::FORM_FIELD_INPUT,
            array(
                'label' => isset($addressField['address2_label']) ? $addressField['address2_label'] : 'Street Address 2',
                'value' => isset($addressField['address2_val']) ? $addressField['address2_val'] : '',
                'attr' => array(
                    hasPermission($addressField['form'], $addressField['address2'], $addressField['current_form']) ? '' : 'readonly'
                )
            ),
            6, 
            true, hasPermission($addressField['form'], $addressField['address2'], 'show')
        ); ?>
    </div>
    <div class="row">
         <?php if(hasPermission($addressField['form'], $addressField['city'], 'show')){ ?>
        <section class="col col-md-3 col-sm-4 col-xs-6">
            <label class="input">City</label>
            <select name="<?= $addressField['city'] ?>" class="city form-control col-12" style="width:100%" <?php hasPermission($addressField['form'], $addressField['city'], $addressField['current_form']) ? '' : 'disabled' ?>></select>
        </section>
         <?php }
         if(hasPermission($addressField['form'], $addressField['state'], 'show')){
        ?>
        <section class="col col-md-3 col-sm-4 col-xs-6">
            <label class="input">State</label>
            <select name="<?= $addressField['state'] ?>" class="state form-control col-12" style="width:100%" <?php hasPermission($addressField['form'], $addressField['state'], $addressField['current_form']) ? '' : 'disabled' ?>> </select>
        </section>
        <?php 
         } if(hasPermission($addressField['form'], $addressField['postal_code'], 'show')){
        ?>
        <section class="col col-md-3 col-sm-4 col-xs-6">
            <label class="input">Zipcode</label>
            <select name="<?= $addressField['postal_code'] ?>" class="postal_code col-12 form-control" style="width:100%" <?php hasPermission($addressField['form'], $addressField['postal_code'], $addressField['current_form']) ? '' : 'disabled' ?>></select>
        </section>
         <?php } ?>
    </div>

    
    <?php if (! in_array($addressField['form'], ['WarrantyForm'])) { ?>
        <div>
            <?php echo SmartForm::print_field('gps', SmartForm::FORM_FIELD_HIDDEN, array('value' => '')); ?>
            <div id="gps" class="google_maps" style="width: 100%; height: 400px; display:none"></div>
        </div>
    <?php }  ?>
</fieldset>