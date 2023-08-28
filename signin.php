<?php
if (!session_id()) {
    session_start();
}
//initilize the page
require_once 'init.php';

if(!isset($_COOKIE['ip_address'])){ 
    try{

        $ip = getenv('HTTP_CLIENT_IP')?:
        getenv('HTTP_X_FORWARDED_FOR')?:
        getenv('HTTP_X_FORWARDED')?:
        getenv('HTTP_FORWARDED_FOR')?:
        getenv('HTTP_FORWARDED')?:
        getenv('REMOTE_ADDR');

        $geo = json_decode(file_get_contents('http://www.geoplugin.net/json.gp?ip='.$ip));
        setcookie('ip_address', $ip, time() + 86400, '/');
        if (isset($geo) && isset($geo->geoplugin_countryCode)) {
            setcookie('country', $geo->geoplugin_countryCode, time() + 86400, '/');
            setcookie('countryName', $geo->geoplugin_countryName, time() + 86400, '/');
            setcookie('timezone', $geo->geoplugin_timezone, time() + 86400, '/');
        } else {
            setcookie('country', 'US', time() + 86400, '/');
            setcookie('countryName', 'America', time() + 86400, '/');
            setcookie('timezone', 'America/New_York', time() + 86400, '/');
        }
    }catch(Exception $e){

    }
}

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
<style>

/*sign in*/

#btnLogin {
    background-color: #db4437;
    font-weight: 500;
    color: white;
    max-width: 220px;
    margin: auto;
}

#btnSignUp {
    cursor: pointer;
}

#btnGoogle {
    max-width: 220px;
    margin: auto;
}

.center-form {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto 0!important;
}
</style>
<title>Login</title>
<div>
<?php 
    $help_form = 'login';
    include 'ajax/btn-help.php';
    unset($help_form);
?>
</div>
<div class="clearfix"></div>
<div id="main" role="main">

	<!-- MAIN CONTENT -->
	<div id="content" class="container">
		<div class="row">
			<div class="col-hidden-xs col-hidden-sm col-md-3 col-lg-4 "></div>
			<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4">
				<div class="well">
					<form id="login_form" class="smart-form client-form" method="post">
						<header>Sign In</header>

						<div id="error_login"></div>
                        <fieldset>
                            <section>
                                <label class="label">Login as</label>
                                <label class="select">
                                    <select name="types" style="width:100%">
                                        <?php
                                        $string = file_get_contents("data/contact-type.json");
                                        $json_a = json_decode($string, true);
                                        $optionbox = '';

                                        foreach ($json_a as $item) {
                                            $selected ='';
                                            if($item['value']=='PolicyHolder'){
                                                $selected ='selected ="selected"';
                                            }
                                            $optionbox .= '<option value="' . $item['value'] . '" '.$selected.'>' . $item['display'] . '</option>';
                                        }
                                        echo ($optionbox);
                                        ?>
                                    </select><i></i>
                                </label>
                            </section>

                        </fieldset>

                      

                        <fieldset>
                            <div class="row">
                                <section>
                                    <div class="form-group text-center">
                                        <button type="button" id="btnLogin" class="btn btn-lg btn-block" style="max-width: 250px;padding:18px 20px 18px 20px;font-family: Roboto,Helvetica,Arial,sans-serif;">
                                            <span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg"></span>
                                            <span class="firebaseui-idp-text firebaseui-idp-text-long"><strong>Sign in with Email</strong></span>
                                        </button>
                                    </div>
                                </section>
                            </div> 

                            <!-- <div class="row">
                                <section>
                                    <div class="form-group text-center">
                                        <button type="button" id="btnLogin" style="background-color: #02bd7e;" class="btn btn-lg btn-block">
                                            <span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/phone.svg"></span>
                                            <span class="firebaseui-idp-text firebaseui-idp-text-long">Sign in with Phone</span>
                                        </button>
                                    </div>
                                </section>
                            </div>      -->           
                                 
                            <div class="row">
                                <section>
                                    <div class="form-group text-center">
                                        <button class="btn btn-block btn-social btn-google btn-lg" style="display: block !important;max-width: 250px;padding:18px 20px 18px 20px;font-family: Roboto,Helvetica,Arial,sans-serif;" id="btnGoogle" type="button">
                                            <span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"></span>
                                            <span class="firebaseui-idp-text firebaseui-idp-text-long"><strong>Sign in with Google</strong></span>
                                        </button>
                                    </div>
                                </section>
                            </div> 

                             <!-- The surrounding HTML is left untouched by FirebaseUI.
                            Your app may use that space for branding, controls and other customizations.-->
                        
                            <div id="firebaseui-auth-container"></div>

                        </fieldset>

                        <fieldset>
                            <div class="row">
                                <section>
                                    <div class="form-group text-center">
                                        <a id="btnSignUp" >
                                            Register As Affiliate - Vendor
                                        </a>
                                    </div>
                                </section>
                            </div>
                        </fieldset>

                        <!--
						<fieldset>
							<section>
								<label class="label">E-mail/Phone</label>
								<label class="input"> <i class="icon-append fa fa-user"></i>
									<input type="text" name="field1" required>
									<b class="tooltip tooltip-top-right"><i class="fa fa-user txt-color-teal"></i> Please enter email address/phone number</b></label>
									<p id="msg_field_1"></p>
							</section>

							<section>
								<label class="label" id="lblZipcode">Phone/Zip code</label>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
									<input type="password" name="field2" minlength="5" required>
									<b class="tooltip tooltip-top-right"><i class="fa fa-lock txt-color-teal"></i> <span id="note_filed_2">Enter your phone/zipcode</span></b> </label>
									<p id="msg_field_2"></p>
							</section>

						</fieldset>
						<footer>
							<button type="submit" class="btn btn-primary">
								Sign in
							</button>
						</footer>
                        -->
						</div>
					</form>
				</div>
			</div>
			
		</div>
	</div>
<!-------Sign up modal----------->
<div class="modal animated fadeInDown" style="display:none;background: #fff!important ;margin:auto; max-height:600px;" id="sign-up_modal">
    <div class="modal-dialog modal-sm">
        <div class="modal-header" style="background-color: #dddddd">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Sign Up</h4>
        </div>
        <div class="modal-content">
            <form class="smart-form" id="signup-form" method="post">
                <fieldset>
                    <div class="row center-form">
                        <div style="width: 80%">
                        <section class="col col-12">
                        <label class="label" id="err-msg" style="color: firebrick; display: none">Password is mismatch</label>
                    </section>

                        <section class="col col-12">
                            <label class="label">E-mail</label>
                            <label class="input"> <i class="icon-append fa fa-envelope "></i>
                                <input type="email" name="emailaddress" id="email_signup" placeholder="email" required>
                        </section>

                        <section class="col col-12">
                            <label class="label" >Password</label>
                            <label class="input"> <i class="icon-append fa fa-lock"></i>
                                <input type="password" name="password_signup" id="password_signup" minlength="5" required>

                        </section>

                        <section class="col col-12">
                            <label class="label" >Confirm Password</label>
                            <label class="input"> <i class="icon-append fa fa-lock"></i>
                                <input type="password" name="password_confirm" id="password_confirm" minlength="5" required>

                        </section>
                        </div>

                </div>
                </fieldset>
            </form>


            <div class="modal-footer">
            <fieldset>
                <section>
                    <button type="button" id="btn-cancel" class="btn btn-dark btn-sm">
                        Cancel
                    </button>
                    <button type="button" id="btn-sign-up" class="btn btn-primary btn-sm">
                        Sign up
                    </button>


                </section>
            </fieldset>
            </div>

        </div>
    </div>
</div>

<!-------Sign in modal----------->
<div class="modal animated fadeInDown" style="display:none;background: #fff!important ;margin:auto; max-height:600px;" id="sign-in_modal">
    <div class="modal-dialog modal-sm">
        <div class="modal-header" style="background-color: #dddddd">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Sign In</h4>
        </div>
        <div class="modal-content">
            <form class="smart-form" id="signin-form" method="post">
                <fieldset>
                    <div class="row center-form">
                        <div style="width: 80%">
                            <!-- <section class="col col-12"> -->
                                <label class="label" id="err-msg-signin" style="color: firebrick; display: none"></label>
                            <!-- </section> -->

                            <section class="col col-12">
                                <label class="label">E-mail</label>
                                <label class="input"> <i class="icon-append fa fa-envelope "></i>
                                <input type="email" name="txtEmail" id="txtEmail" placeholder="email" required>
                            </section>

                            <section class="col col-12">
                                <label class="label" >Password</label>
                                <label class="input"> <i class="icon-append fa fa-lock"></i>
                                <input type="password" name="txtPassword" id="txtPassword" minlength="5" required>

                            </section>

                        </div>
                    </div>
                </fieldset>
            </form>


            <div class="modal-footer">
                <fieldset>
                    <section>
                        <a href ="./resetpassword.php"> Reset password ? </a>                                         
                        <button type="button" id="btn-signin-cancel" class="btn btn-dark btn-sm">
                            Cancel
                        </button>
                        <button type="button" id="btn-signin" class="btn btn-primary btn-sm">
                            Sign in
                        </button>
                    </section>
                </fieldset>
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
<script src="<?= ASSETS_URL ?>/js/script/login-1.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase-auth.js"></script>
<script>
    var config = {       
        apiKey: "AIzaSyA_8dzdQbvGq7bLBmg8qIBBGpnW284EwjU",
        authDomain: "freedom-hw-crm.firebaseapp.com",
        databaseURL: "https://freedom-hw-crm.firebaseio.com",
        projectId: "freedom-hw-crm",
        storageBucket: "freedom-hw-crm.appspot.com",
        messagingSenderId: "871561714410",
        appId: "1:871561714410:web:3ea663be152a8181",
        clientId: '871561714410-s9tiscakqsvu65v5etfinkoiqeo73u4r.apps.googleusercontent.com',
		discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
		scopes: ['email', 'profile', 'https://www.googleapis.com/auth/calendar']
    };
    firebase.initializeApp(config);

</script>

<script>
$(document).ready(function(){
	$('div.demo').remove();
	new Login().init();
})

</script>


<?php
//include footer
include "inc/google-analytics.php";
?>



