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

$page_title = "Reset Password";
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

<div id="main" role="main">

	<!-- MAIN CONTENT -->
	<div id="content" class="container">
		<div class="row">
			<div class="col-hidden-xs col-hidden-sm col-md-3 col-lg-4 "></div>
			<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4">
				<div class="well">
					<div id="" class="smart-form client-form" method="post">
						<header>Reset Password</header>
						<div id="message_form" role="alert" style="display:none"></div>
						<fieldset>
							<section>
								<label class="label">E-mail</label>
								<label class="input"> <i class="icon-append fa fa-user"></i>
									<input id="iptEmail" type=email name=un required>
									<b class="tooltip tooltip-top-right"><i class="fa fa-user txt-color-teal"></i> Please enter email address</b></label>
								<p id="msg_field_1"></p>
							</section>
						</fieldset>
						<footer>
							<button id="submit" class="btn btn-primary">
								Get Code Reset Password
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
<script src="<?= ASSETS_URL ?>/js/script/resetpassword.js"></script>

<!-- PAGE RELATED PLUGIN(S)
<script src="..."></script> -->


<?php
//include footer
include "inc/google-analytics.php";
?>