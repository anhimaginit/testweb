<?php
use \SmartUI\Components\SmartForm;
/**
 * need variable : ex:
 * $addressField = array(
 *       'form' => $warranty_form,
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
                'label' => 'Street Address 1',
                'value' => '',
            ),
            6,
            true
        ); ?>
    </div>

    <div class="row">
        <?php echo SmartForm::print_field(
            $addressField['address2'],
            SmartForm::FORM_FIELD_INPUT,
            array(
                'label' => 'Street Address 2',
                'value' => '',
            ),
            6,
            true
        ); ?>
    </div>
    <div class="row">
        <section class="col col-3">
            <label class="input">City</label>
            <select name="<?= $addressField['city'] ?>" class="city form-control col-12 select2" style="width:100%"></select>
        </section>
        <section class="col col-3">
            <label class="input">State</label>
            <select name="<?= $addressField['state'] ?>" class="state form-control col-12 select2" style="width:100%"> </select>
        </section>
        <section class="col col-3">
            <label class="input">Zipcode</label>
            <select name="<?= $addressField['postal_code'] ?>" class="postal_code col-12 form-control select2" style="width:100%"></select>
        </section>
    </div>

</fieldset>