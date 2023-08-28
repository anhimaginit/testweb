<?php
$claim_form = 'ClaimForm';

use \SmartUI\Components\SmartForm;
use \SmartUI\Util as SmartUtil;

require_once 'inc/init.php';
require_once '../php/link.php';

$_ui->start_track();
$listProduct = array();
$listProductAla = array();

$listProductRequest = HTTPMethod::httpPost($link['_claimLimitProductList'], array('token' => $_SESSION['token'], 'jwt' => $_SESSION['jwt'], 'private_key' => $_SESSION['userID']));

if (null !== $listProductRequest) {
    foreach ($listProductRequest->list as $item) {
        if ($item->prod_class == 'Warranty')
            $listProduct[] = $item;
        else if ($item->prod_class == 'A La Carte')
            $listProductAla[] = $item;
    }
}

function compare($a, $b)
{
    return strcmp($a->prod_name, $b->prod_name);
}
usort($listProduct, "compare");
usort($listProductAla, "compare");
?>
<style>
    .hasinput input,
    .hasinput select {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 1px solid #ccc;
    }

    tbody td {
        cursor: text;
    }
</style>
<section id="widget-grid" class="">
    <div class="tabbable">
        <ul class="nav nav-tabs bordered">
            <li class="active"><a href="#claim_warranty" data-toggle="tab" rel="tooltip" data-placement="top">Template for Warranty</a></li>
            <?php 
            //    $help_form = 'claim-limit';
            //    include 'btn-help.php';
            //    unset($help_form);
            ?>
        </ul>
        <div class="tab-content padding-10">
            <div class="tab-pane in active" id="claim_warranty">
                <div id="message_form" role="alert" style="display:none"></div>
                <form class="smart-form" id="claim_limit_form" method="post">
                    <fieldset id="fieldset_claim_warranty">
                        <input type="hidden" name="ID" value="">
                        <input type="hidden" id="forForm" value="claim_warranty">
                        <div class="row">
                            <section class="col col-6">
                                <select name="product_ID" class="form-control select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                                    <option value="">Select Product</option>
                                    <optgroup label="Warranty">
                                        <?php
                                        foreach ($listProduct as $item) {
                                            if (isset($item->ID)) {
                                                echo '<option value="' . $item->ID . '" data-sku="' . $item->SKU . '">' . $item->prod_name . '</option>';
                                            }
                                        }

                                        ?>
                                    </optgroup>
                                    <optgroup label="A La Carte">
                                        <?php
                                        foreach ($listProductAla as $item) {
                                            if (isset($item->ID)) {
                                                echo '<option value="' . $item->ID . '" data-sku="' . $item->SKU . '">' . $item->prod_name . '</option>';
                                            }
                                        }
                                        ?>

                                    </optgroup>
                                </select>
                            </section>
                        </div>
                    </fieldset>
                    <div id="table_claim_warranty">
                        <?php include 'claim-limit-list.php'; ?>
                    </div>
                    <footer>
                        <button type="button" onclick="submitForm(`claim_warranty`)" class="btn btn-primary">Submit</button>
                        <button type="button" id="btnBackClaimLimit" class="btn btn-default">Back</button>
                    </footer>
                </form>
            </div>
        </div>
    </div>
</section>

<script src=" <?= ASSETS_URL ?>/js/script/claim/claim-limit2.js"> </script> <script>
    $('#table_claim_limit thead tr th:nth-child(3)').text('Edit');
    $('#table_claim_limit thead tr th:nth-child(3)').removeClass('hidden');
    <?php
        if (hasParam('productid')) {
        echo '$("select[name=product_ID]").val(' . $_GET['productid'] . ').change();';
        }
    ?>
</script>