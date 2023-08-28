<!DOCTYPE html>
<html lang="en-us" <?php echo implode(' ', array_map(function ($prop, $value) {
						return $prop . '="' . $value . '"';
					}, array_keys($page_html_prop), $page_html_prop));
					?>>

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="description" content="">
	<meta name="author" content="">

	<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />

	<!-- Basic Styles -->
	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
   	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/bootstrap-select.css">
	<!-- SmartAdmin Styles : Caution! DO NOT change the order -->
	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-production-plugins.min.css">
	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-production.min.css">
	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-skins.min.css">

	<!-- SmartAdmin RTL Support is under construction-->
	<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-rtl.min.css">

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/css/intlTelInput.css">
	<!-- auto complete tagsinput -->
	<link rel="stylesheet" href="<?= ASSETS_URL ?>/js/plugin/tags-input-autocomplete/src/jquery.tagsinput-revisited.css">

	<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.css" />
	<?php

	if ($page_css) {
		foreach ($page_css as $css) {
			echo '<link rel="stylesheet" type="text/css" media="screen" href="' . ASSETS_URL . '/css/' . $css . '?value=' . rand() . '">';
		}
	}
	?>


	<!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
	<!-- <link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/demo.min.css"> -->
	<link type="text/css" rel="stylesheet" href="<?php echo ASSETS_URL; ?>/css/take-screenshots.css?value=<?= rand() ?>" />

	<!-- FAVICONS -->
	<link rel="shortcut icon" href="<?= $_SESSION['settingPage']->logo_ico ?>" type="image/x-icon">
	<link rel="icon" href="<?= $_SESSION['settingPage']->logo_ico ?>" type="image/x-icon">

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css" />
	<!-- GOOGLE FONT -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">

	<!-- Specifying a Webpage Icon for Web Clip
			 Ref: https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html -->
	<link rel="apple-touch-icon" href="<?php echo ASSETS_URL; ?>/img/splash/sptouch-icon-iphone.png">
	<link rel="apple-touch-icon" sizes="76x76" href="<?php echo ASSETS_URL; ?>/img/splash/touch-icon-ipad.png">
	<link rel="apple-touch-icon" sizes="120x120" href="<?php echo ASSETS_URL; ?>/img/splash/touch-icon-iphone-retina.png">
	<link rel="apple-touch-icon" sizes="152x152" href="<?php echo ASSETS_URL; ?>/img/splash/touch-icon-ipad-retina.png">

	<!-- iOS web-app metas : hides Safari UI Components and Changes Status Bar Appearance -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">

	<!-- Startup image for web apps -->
	<link rel="apple-touch-startup-image" href="<?php echo ASSETS_URL; ?>/img/splash/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)">
	<link rel="apple-touch-startup-image" href="<?php echo ASSETS_URL; ?>/img/splash/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)">
	<link rel="apple-touch-startup-image" href="<?php echo ASSETS_URL; ?>/img/splash/iphone.png" media="screen and (max-device-width: 320px)">

	<style>
		:root {
			--background: <?= $_SESSION['settingPage']->background != '' ? $_SESSION['settingPage']->background : '#f3f3f3' ?>;
			--top-menu-color: <?= $_SESSION['settingPage']->top_menu_color != '' ? $_SESSION['settingPage']->top_menu_color : '#474544' ?>;
			--color-site: <?= $_SESSION['settingPage']->color_site  != '' ? $_SESSION['settingPage']->color_site  : '#3a3633' ?>;
			--color-site-hover: <?= $_SESSION['settingPage']->color_site_hover != '' ? $_SESSION['settingPage']->color_site_hover : 'unset' ?>;
			--navigation: <?= $_SESSION['settingPage']->navigation != '' ? $_SESSION['settingPage']->navigation : '#c0bbb7' ?>;

		}

		body {
			background: var(--background);
			background-image: unset;
		}

		#header {
			background: var(--top-menu-color);
			background-image: unset;
		}

		#project-selector {
			color: var(--navigation);
		}

		#project-selector:hover {
			color: var(--navigation);
		}

		#ribbon,
		#left-panel,
		.page-footer,
		nav ul ul,
		.minified nav>ul>li>ul,
		.minified nav>ul>li>ul>li {
			background: var(--color-site);
			background-color: var(--color-site);
			color: var(--navigation);
		}

		nav ul ul li>a:hover,
		nav ul ul li>a:focus,
		nav ul li>a:hover,
		nav ul li>a:focus,
		nav ul li.active,
		.minifyme {
			background: var(--color-site-hover);
		}

		nav ul li a,
		.login-info a {
			color: var(--navigation);
		}

		/* 
	.jarviswidget>header{
		background: <?= $_SESSION['settingPage']->color_site_hover ?>;
		color: var(--navigation);
	} */
	</style>

    <!--<script type="text/javascript">

        var _data = {};
        _data.phone = "";
        _data.contact_ID="";
        var auto_refresh = setInterval(
            function ()
            {
                $.ajax({
                    url: 'https://api.warrantyproject.com/_smsGetTotalnewMsg.php',
                    type: 'post',
                    data: _data,
                    dataType: 'json',
                    success: function (res) {
                        alert(res.list);
                    },
                    error: function (e) {

                    }
                });
                //var count = $("#count_unread_sms_noti span.badge").text();
                //$("#count_unread_sms_noti span.badge").text(count-1);
                //$('#load_tweets').load('record_count.php').fadeIn("slow");
            }, 5000); // refresh every 10000 milliseconds
    </script>-->

</head>

<body <?php echo implode(' ', array_map(function ($prop, $value) {
			return $prop . '="' . $value . '"';
		}, array_keys($page_body_prop), $page_body_prop)); ?>>
	<?php
	if (!$no_main_header) {

		?>
		<!-- HEADER -->
		<header id="header">
			<div id="logo-group" onclick="window.open('./', '_self')" class="pointer">
				<span id="logo"> <img src="<?= $_SESSION['settingPage']->logo ?>" alt="<?= $_SESSION['settingPage']->page_title ?>"> </span>
			</div>
			<div class="pull-right">
				<div id="hide-menu" class="btn-header pull-right">
					<span> <a href="javascript:void(0);" title="Collapse Menu" data-action="toggleMenu"><i class="fa fa-reorder"></i></a> </span>
				</div>
				<div id="logout" class="btn-header transparent pull-right">
					<span> <a href="javascript:void(0)" title="Sign Out" data-action="userLogout" data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i class="fa fa-sign-out"></i></a> </span>
				</div>
				<a href="javascript:void(0)" class="hidden" data-action="deniedPermission"></a>
				<a href="javascript:void(0)" class="hidden" data-action="fileDontExists"></a>
				<div class="project-context hidden-xs pull-right">

					<span class="label" style="color:firebrick">Local Role:</span>
					<span id="project-selector" class="popover-trigger-element dropdown-toggle" data-toggle="modal" data-target="#resLogin">
						<?= isset($_SESSION['actor']) ? $_SESSION['actor'] : '' ?> (<?= isset($_SESSION['level']) ? $_SESSION['level'] : 'User' ?>)
						<i class="fa fa-angle-down"></i>
					</span>
					<div id="resLogin" class="modal fade" data-backdrop="false" role="dialog">
						<div class="modal-dialog">

							<!-- Modal content-->
							<div class="modal-content">
								<div class="modal-header">
									<button type="button" class="close" data-dismiss="modal">&times;</button>
									<h4 class="modal-title">Change Local Role</h4>
								</div>
								<div class="modal-body">
									<div id="error_login"></div>
									<form id="login_form" class="smart-form client-form" method="post">
										<fieldset>
											<section>
												<label class="label" id="lblZipcode">Login as</label>
												<label class="select">
													<select name="types" style="width:100%">
														<?php
															// $string = $_SESSION['user']['contact_type'];
															// $json_a = explode(',', $string);
															// $optionbox = '';
															// foreach ($json_a as $item) {
															// 	$optionbox .= '<option value="' . str_replace(' ', '', $item) . '">' . $item . '</option>';
															// }
															// echo ($optionbox);

															$string = file_get_contents("data/contact-type.json");
															$json_a = json_decode($string, true);
															$optionbox = '';

															foreach ($json_a as $item) {
																$selected = '';
																if ($item['value'] == 'PolicyHolder') {
																	$selected = 'selected ="selected"';
																}
																$optionbox .= '<option value="' . $item['value'] . '" ' . $selected . '>' . $item['display'] . '</option>';
															}
															echo ($optionbox);
															// <option value="SystemAdmin">System Admin</option>
															?>
													</select><i></i>
												</label>
											</section>
											<button type="submit" class="btn btn-lg btn-primary">
												<i class="fa fa-refresh"></i> Change
											</button>

										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- end projects dropdown -->

				<!-- End Change Role -->
                <?php
                require 'http-request.php';
                ?>

                <?php
                $API_server = '';
                if ($_SERVER['HTTP_HOST'] == 'localhost') {
                $API_server = 'https://api.warrantyproject.com';
                // $API_server = 'https://api.salescontrolcenter.com';
                } else {
                $API_server = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://api.' . $_SERVER['HTTP_HOST'];
                }
                ?>

                <?php
                if(isset($_SESSION['user_info'])) {
                    $user_phone = isset($_SESSION['user_info']['primary_phone']) ? $_SESSION['user_info']['primary_phone'] : '';
                    $contact_ID = isset($_SESSION['userID']) ? $_SESSION['userID'] : '';
                }

                $total_sms = HTTPMethod::httpPost($API_server . '/_smsGetTotalnewMsg.php', array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID'], 'phone' => $user_phone, 'contactID' =>$contact_ID ));
                $total_email = HTTPMethod::httpPost($API_server .'/_emails_Inbox_New_Total.php', array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID'], 'contactID' =>$contact_ID ));
                $total_task = HTTPMethod::httpPost($API_server .'/_taskNew_Total.php', array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID'], 'contactID' =>$contact_ID ));

                ?>


                <div class="project-context hidden-xs pull-right" id="count_unread_sms_noti">
                    <a href="#ajax/sms-inbox-new.php" class="notification" style="padding-left:4px; margin-top:9px;">
                        <span><i class="fa fa-phone" aria-hidden="true" style="font-size:16px;"></i></i></span>
                        <span class="badge<?= $total_sms->list == 0 ? ' hidden' : '' ?>"><?php echo $total_sms->list;?></span>
                    </a>
                </div>



                <div class="project-context hidden-xs pull-right" id="count_unread_email_noti">
                    <a href="#ajax/mail.php" class="notification" style="padding-left:4px; margin-top:9px;">
                        <span><i class="fa fa-envelope-o" aria-hidden="true" style="font-size:16px;"></i></span>
                        <span class="badge<?= $total_email->total == 0 ? ' hidden' : '' ?>"><?php echo $total_email->total;?></span>
                    </a>
                </div>

                <div class="project-context hidden-xs pull-right" id="count_undone_task_noti">
                    <a href="#ajax/task-new.php" class="notification" style="padding-left:6px; margin-top:9px;">
                        <span><i class="fa fa-check-square-o" aria-hidden="true" style="font-size:16px;"></i></i></span>
                        <span class="badge<?= $total_task->total == 0 ? ' hidden' : '' ?>" id=""><?php echo $total_task->total;?></span>
                    </a>
                </div>

				<div class="project-context hidden-xs pull-right">
					<span class="text-danger" style="color:firebrick">HELLO:</span>
					<span id="project-selector">
						<?= isset($_SESSION['user_name']) ? urldecode($_SESSION['user_name']) : (isset($_SESSION['actor']) ? $_SESSION['actor'] : 'User') ?>
					</span>
				</div>
			</div>
		</header>
		<div id="shortcut">
			<ul>
				<?php
					$company = '';
					$map = '';
					if (isset($_SESSION['company_id'])) {
						$company = '?id=' . $_SESSION['company_id'];
					}
					if (isset($_SESSION['gps'])) {
						$gps = json_decode($_SESSION['gps']);
						if (isset($gps->lat) && isset($gps->lng)) {
							$map = '?lat=' . $gps->lat . '&lng=' . $gps->lng;
						}
					}

					?>
				<li>
					<a href="#ajax/map.php<?= $map ?>" class="jarvismetro-tile big-cubes bg-color-blue"> <span class="iconbox"> <i class="fa fa-map-marker fa-4x"></i> <span>My Map
								<!--<span class="label pull-right bg-color-darken">14</span>--></span> </span> </a>
				</li>

				<li>
					<a href="#ajax/contact-form.php?id=<?= $_SESSION['userID'] ?>" class="jarvismetro-tile big-cubes bg-color-pinkDark"> <span class="iconbox"> <i class="fa fa-user fa-4x"></i> <span>My Profile </span> </span> </a>
				</li>
				<li>
					<a href="#ajax/company-form.php<?= $company ?>" class="jarvismetro-tile big-cubes bg-color-green"> <span class="iconbox"> <i class="fa fa-briefcase fa-4x"></i> <span>My Company</span> </span> </a>
				</li>
				<li>
					<a href="#ajax/calendar.php"  class="jarvismetro-tile big-cubes bg-color-orange"><span class="iconbox"><i class="fa fa-calendar fa-4x"></i> <span>Calendar</span></span></a>
				</li>
			</ul>
		</div>
		<!-- END SHORTCUT AREA -->

	<?php }

	if ($no_main_header) { ?>
		<header class="no-main-header navbar navbar-default" id="header">
			<div id="logo-group" class="navbar-header" onclick="window.open('./', '_self')">
				<span class="navbar-brand" style="cursor:pointer;"> <img src="<?= $_SESSION['settingPage']->logo ?>" height="80%" width="auto" alt="SmartAdmin" onclick="window.open('<?= ASSETS_URL ?>/signin.php', '_self');" title="Go to home page"> </span>
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#homeWarrantyMenu">
					<i class="fa fa-reorder"></i>
				</button>
			</div>
			<div class="collapse navbar-collapse pull-right" id="homeWarrantyMenu">
				<ul class="nav navbar-nav navbar-right">
					<?php
						$menu = array(
						//	array('link' => 'purchase-home-warranty.php', 'text' => 'Purchase Home Warranty'),
                            
							array('link' => 'help-desk.php', 'text' => 'Help Desk'),
							array('link' => 'signin.php', 'text' => 'Signin'),
						);
						if (isset($_SESSION['jwt'])) {
						 array_splice($menu, 1);
						//  unset($menu[1]);
						}
						foreach ($menu as $li) {
							if (basename($_SERVER['PHP_SELF']) != $li['link']) {
								$link = $li['link'];
								$id = isset($li['id']) ? ' id="' . $li['id'] . '"' : '';
								$text = isset($li['text']) ? $li['text'] : '';
								echo '<li' . $id . '><a href="'.$link.'">' . $text . '</a></li>';
							}
						}
						if(isset($_SESSION['jwt'])){
							echo '<li><a href="./logout.php">Logout</a></li>';
						}
						?>
				</ul>
			</div>
		</header>
	<?php } ?>