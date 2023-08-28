<!------ Include the above in your HEAD tag ---------->
<?php
session_start();
if(isset($_SESSION['user_info'])) {
    $contact_ID = $_SESSION['user_info']['ID'];
}
?>
<?php require_once 'inc/init.php'; ?>
<div>
    <div class="sms-box">

        <aside class="lg-side">
            <div class="inbox-head">
                <h3><strong>COMPOSE</strong></h3>
            </div>

            <div id="message_form" style="display:none"></div>
            <div id="loading" style="display: none;"></div>

            <div class="inbox-body">
                <div class="sms-compose">
                    <input type="hidden" id="sms-contact-ID" value="<?php echo $contact_ID;?>">

                    <?php
                    $API_server = '';
                    if ($_SERVER['HTTP_HOST'] == 'localhost') {
                        $API_server = 'https://api.warrantyproject.com';
                        // $API_server = 'https://api.salescontrolcenter.com';
                    } else {
                        $API_server = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://api.' . $_SERVER['HTTP_HOST'];
                    }

                  /*  $dedicated_num_list = HTTPMethod::httpPost(
                        $API_server . '/_smDedicateNumberList.php',
                        array(
                        )
                    )->list;


                     $sms_template = HTTPMethod::httpPost(
                        $API_server . '/_smGetTemplate.php',
                        array(
                        )
                    )->ids;

                    */?><!--

                    --><?php
/*                    $sms_area = HTTPMethod::httpPost(
                        $API_server . '/_smsGetAreabyphone.php',
                        array(
                            'phone' => '+138'
                        )
                    )->area;

                    */?>

                    <div class="form-group">
                        <label for="From">From dedicated number list:</label>
                        <select class="form-control smsFrom" name="contact_salesman_id"  style="width: 100%;">
<!--                            <option selected>Choose number</option>-->
                            --><?php
/*                            foreach($dedicated_num_list as $key => $value) {

                                $sms_area = HTTPMethod::httpPost(
                                    $API_server . '/_smsGetAreabyphone.php',
                                    array(
                                        'phone' => $value->dedicated_number
                                    )
                                )->area;

                                if($sms_area->total >=1 && $sms_area->area!='') {
                                    $area = $sms_area->area;
                                    echo '<option value="'.$value->dedicated_number.'">'.$value->dedicated_number." "."(".$area.")".'</option>';
                                } else {

                                    if($sms_area->total === 0) {
                                        $sms_area_return = HTTPMethod::httpPost(
                                            $API_server . '/_smsInsertPhoneArea.php',
                                            array(
                                                'phone' => $value->dedicated_number
                                            )
                                        );
                                    }
                                    echo '<option value="'.$value->dedicated_number.'">'.$value->dedicated_number.'</option>';
                                }

                            }

                            */?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="To">To:</label>
                        <select class="form-control smsTo" multiple="multiple" style="width: 100%;">
                            <option>Search all by select...</option>
                            <option value="pr_email">Search all duplication by email</option>
                            <option value="pr_phone">Search all duplication by phone number</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="To">From SMS content template:</label>
                        <select class="form-control sms_template" name="sms_template_load"  style="width: 100%;">
                            <option selected disabled>Choose Template</option>
                             --><?php
/*
                            foreach($sms_template as $key => $value) {
                                    echo '<option value="'.$value->body.'">'.$value->template_name.'</option>';
                            }

                            */?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="comment">Content:</label>
                        <textarea class="form-control" rows="10" id="mailComment"></textarea>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-primary" id="btnSendSMS">Send</button>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</div>

<script src="<?=ASSETS_URL?>/js/script/sms/sms-compose.js"></script>

<script>
    $.ajax({
        url: link._sms_dedicated_number_list,
        type: 'post',
        dataType: 'json',
        data: { token: localStorage.getItemValue('token') },
        complete: function () {
        //    $('#loading').hide();
            //  alert("It is loaded successfully. You can do everything you want now!");
            console.log(text);
        },
        success: function (res) {
            let text = '';
            console.log(res.list);
            res.list.forEach(function (item) {
                let number_display = '';
                $.ajax({
                    url: link._sms_get_area_by_phone,
                    type: 'post',
                    dataType: 'json',
                    data: { phone: item.dedicated_number },
                    success: function (res) {
                        console.log(res.area);
                        let text = '';
                        let number_display = item.dedicated_number;
                        let area_info = res.area;
                        let total_found = area_info.total;
                        let area_found = area_info.area;


                        //let number_display;

                        if(total_found >=1 && area_found !== null) {
                            number_display = item.dedicated_number + " " + "(" + area_found + ")";
                        } else {

                            number_display = item.dedicated_number;
                        }
                        text = '<option value="' + item.dedicated_number + '">' + number_display + '</option>';
                        $(".smsFrom").append(text);
                    //    console.log(text);
                    },
                    error: function (e) {
                    }
                })


            //
            });
            /*$('.sms-compose [name="contact_salesman_id"]').html(text);
            $('.sms-compose [name="contact_salesman_id"]').select2().val(null).trigger('change');
            if (callback) callback(result)*/
            console.log("nothing");
            console.log(text);
        },
        error: function (e) {
        }
    })
</script>


<script>
    $.ajax({
        url: link._smsTemplate,
        type: 'post',
        dataType: 'json',
        data: { token: localStorage.getItemValue('token') },
        success: function (res) {
            let text = '';
            console.log(res.ids);
            res.ids.forEach(function (item) {
                console.log(item.template_name);
                text += '<option value="' + item.body + '">' + item.template_name + '</option>';

            });
            console.log(text);
            $('.sms_template').html(text);
            $('.sms_template').select2().val(null).trigger('change');
        },
        error: function (e) {
        }
    })
</script>


<script>
    $.ajax({
        url: link._sms_dedicated_number_list,
        type: 'post',
        dataType: 'json',
        data: { token: localStorage.getItemValue('token') },
        complete: function () {
            //    $('#loading').hide();
            //  alert("It is loaded successfully. You can do everything you want now!");
            console.log(text);
        },
        success: function (res) {
            let text = '';
            console.log(res.list);
            res.list.forEach(function (item) {
                let number_display = '';
                $.ajax({
                    url: link._sms_get_area_by_phone,
                    type: 'post',
                    dataType: 'json',
                    data: { phone: item.dedicated_number },
                    success: function (res) {
                        console.log(res.area);
                        let text = '';
                        let number_display = item.dedicated_number;
                        let area_info = res.area;
                        let total_found = area_info.total;
                        let area_found = area_info.area;


                        //let number_display;

                        if(total_found >=1 && area_found !== null) {
                            number_display = item.dedicated_number + " " + "(" + area_found + ")";
                        } else {
                            if(total_found === 0) {

                                $.ajax({
                                    url: link._sms_insert_phone_area,
                                    type: 'post',
                                    dataType: 'json',
                                    data: { phone: item.dedicated_number }
                                })

                            }

                           // number_display = item.dedicated_number;
                        }
                        //    console.log(text);
                    },
                    error: function (e) {
                    }
                })


                //
            });
            /*$('.sms-compose [name="contact_salesman_id"]').html(text);
             $('.sms-compose [name="contact_salesman_id"]').select2().val(null).trigger('change');
             if (callback) callback(result)*/
            console.log("nothing");
            console.log(text);
        },
        error: function (e) {
        }
    })
</script>