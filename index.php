<?php
//initilize the page
require_once 'init.web.php';

$page_css[] = "your_style.css";

/*---------------- PHP Custom Scripts ---------

YOU CAN SET CONFIGURATION VARIABLES HERE BEFORE IT GOES TO NAV, RIBBON, ETC. */

/* ---------------- END PHP Custom Scripts ------------- */

//include header
//you can add your custom css in $page_css array.
//Note: all css files are inside css/ folder
include "inc/header.php";

//include left panel (navigation)
//follow the tree in inc/config.ui.php
include "inc/nav.php";

?>
<!-- ==========================CONTENT STARTS HERE ========================== -->
<!-- MAIN PANEL -->
<div id="main" role="main">
	<?php
include "inc/ribbon.php";
?>

	<!-- MAIN CONTENT -->
	<div id="content">
		<?php
// include("ajax/dashboard.php");
?>

	</div>
	<!-- END MAIN CONTENT -->

</div>
<!-- END MAIN PANEL -->

<!-- FOOTER -->
	<?php
include "inc/footer.php";
?>
<!-- END FOOTER -->

<!-- ==========================CONTENT ENDS HERE ========================== -->


<?php

//include required scripts
include "inc/scripts.php";
//include footer
include("inc/google-analytics.php");
?>