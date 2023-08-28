<?php
if (!session_id()) {
    session_start();
}
//initilize the page
require_once 'init.php';

if (isset($_SESSION['jwt'])) {
    if (isset($_COOKIE['prePage']) && $_COOKIE['prePage'] != ASSETS_URL . '/signin.php') {
        echo ('
	<script>
			window.location.href = "' . urldecode($_COOKIE['prePage']) . '";
	</script>');
        exit();

    } else {
        echo ('
	<script>
			window.location.href = "./#ajax/dashboard.php";
	</script>');
        exit();
    }
}

/*---------------- PHP Custom Scripts ---------

YOU CAN SET CONFIGURATION VARIABLES HERE BEFORE IT GOES TO NAV, RIBBON, ETC.
E.G. $page_title = "Custom Title" */

$page_title = "Login";
$array_keys = [];
$page_html_prop = array(); //optional properties for <html>

/* ---------------- END PHP Custom Scripts ------------- */

//include header
//you can add your custom css in $page_css array.
//Note: all css files are inside css/ folder
$page_css[] = "your_style.css";
$no_main_header = true;
$page_body_prop = array("id" => "extr-page", "class" => "animated fadeInDown");
include "inc/header.php";
?>

<!-- gg auth -->


<!-- ==========================CONTENT STARTS HERE ========================== -->
<!-- possible classes: minified, no-right-panel, fixed-ribbon, fixed-header, fixed-width-->
<header id="header">
	<!--<span id="logo"></span>-->

	<div id="logo-group">
		<span id="logo"> <img src="<?= ASSETS_URL ?>/img/logo.png" alt="SmartAdmin"> </span>

		<!-- END AJAX-DROPDOWN -->
	</div>

</header>

<div id="main" role="main">

	<!-- MAIN CONTENT -->
	<div id="content" class="container">
		<div class="row">
			<div class="col-hidden-xs col-hidden-sm col-md-3 col-lg-4 "></div>
			<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4">
				<div class="well">
					<div id="" class="smart-form client-form" method="post" oninput='up2.setCustomValidity(up2.value != up.value ? "Passwords do not match." : "")'>	
					<header>Reset Password</header>				
						<fieldset>
							<section>
							<label for="code" title="get code in you email">Code</label>							
								<label class="input"> <i class="icon-append fa fa-key"></i>
									<input id="oobCode" type=text required name=un>
									<b class="tooltip tooltip-top-right"><i class="fa fa-user txt-color-teal"></i> Please enter code</b></label>
									<p id="msg_field_1"></p>
							</section>
							
							<section>
							<label for="password1">New Password</label>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
								<input id="password1" type=password required name=up>
									<b class="tooltip tooltip-top-right"><i class="fa fa-user txt-color-teal"></i> Please enter Password</b></label>
									<p id="msg_field_2"></p>
							</section>	

							<section>
							<label for="password2">Confirm password</label>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
								<input id="password2" type=password name=up2>
									<b class="tooltip tooltip-top-right"><i class="fa fa-user txt-color-teal"></i> Please enter confirm password</b></label>
									<p id="msg_field_3"></p>
							</section>	
						
						</fieldset>
						<footer>
							<button id="createNewPassword" class="btn btn-primary">
								Create New Password
							</button>
						</footer>
						</div>
					</div>

				</div>
			</div>
			
		</div>
	</div>

</div>
<!-- END MAIN PANEL -->
<!-- ==========================CONTENT ENDS HERE ========================== -->

<?php
//include required scripts
// include "inc/scripts.php";
?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/bootstrap/bootstrap.min.js"></script> 
<script src="<?= ASSETS_URL ?>/js/plugin/jquery-cookie/jquery.cookie.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/app.config.js"></script>
<script src="<?= ASSETS_URL ?>/js/app.js"></script>
<script src="<?= ASSETS_URL ?>/js/your_script.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/resetpassword-newpass.js"></script>

<!-- PAGE RELATED PLUGIN(S)
<script src="..."></script> -->

<?php
//include footer
include "inc/google-analytics.php";
?>


