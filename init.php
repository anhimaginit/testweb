<?php

require_once __DIR__ . '/vendor/autoload.php';

//configure constants
define('DS', DIRECTORY_SEPARATOR);
define('EOL', PHP_EOL);
define('__DEV__', getenv('DEV') === 'on');

if (!isset($argv)) {
	$argv = array(isset($_SERVER['SCRIPT_FILENAME']) ? $_SERVER['SCRIPT_FILENAME'] : __FILE__);
	$args_list = isset($_GET['argv']) && is_array($_GET['argv']) ? $_GET['argv'] : $_GET;

	foreach ($args_list as $key => $value) {
		if ($value) $argv[] = $value;
	}
}

if (Common\Util::is_cli()) {
	$document_root = realpath(isset($argv[1]) && is_dir($argv[1]) ? $argv[1] : dirname(__DIR__));
	$server_name = gethostname();
	$request_uri = str_replace(DS, '/', substr($_SERVER['PHP_SELF'], strlen($document_root)));
} else {
	$document_root = realpath($_SERVER['DOCUMENT_ROOT']);
	$server_name = $_SERVER['HTTP_HOST'];
	$request_uri = $_SERVER['REQUEST_URI'];
}

$document_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://' . $server_name;

$app_path = $document_root;
$app_url = $document_url;
if (is_numeric(strrpos($app_url, 'localhost'))) {
	$app_url = $app_url . '/crm';
}

if (strpos(__DIR__, $document_root) === 0) {
	$app_uri = substr(__DIR__, strlen($document_root));
	$app_path .= $app_uri;
	$app_url .= str_replace(DS, '/', $app_uri);
}

define('DOCUMENT_ROOT', $document_root);
define('SERVER_NAME', $server_name);
define('SERVER_URL', $document_url);
define('SERVER_REQUEST', $document_url . $request_uri);

define('APP_PATH', $app_path);
define('APP_URL', $app_url);

//Assets URL, location of your css, img, js, etc. files
define('ASSETS_URL', APP_URL);
define('ASSETS_PATH', APP_PATH);

define('FORM_ACCESS', array(
	'ContactForm' => 'contact-form',
	'WarrantyForm' => 'warranty-form',
	'ClaimForm' => 'claim-form',
	'GroupForm' => 'group',
	'OrderForm' => 'order-form',
	'CompanyForm' => 'company-form',
	'InvoiceForm' => 'invoice-form',
	'ProductForm' => 'product-form',
	'SettingForm' => 'setting',
	'DiscountForm' => 'discount',
	'PermissionForm' => 'role-form',
	'TaskForm' => 'task',
	'BillingTemplateForm' => 'billing',
	'Help' => 'help-desk',
));


// configure global constants
// define('APP_TMP_PATH', APP_PATH.DS.'tmp');
// define('APP_TMP_URL', APP_URL.'/tmp');

// global functions
require_once __DIR__ . '/lib/func.php';
require_once __DIR__ . '/lib/config.php';

// configure SmartUI
\SmartUI\UI::$icon_source = 'fa';

// register our UI plugins
\SmartUI\UI::register('widget', 'SmartUI\Components\Widget');
\SmartUI\UI::register('datatable', 'SmartUI\Components\DataTable');
\SmartUI\UI::register('button', 'SmartUI\Components\Button');
\SmartUI\UI::register('tab', 'SmartUI\Components\Tab');
\SmartUI\UI::register('accordion', 'SmartUI\Components\Accordion');
\SmartUI\UI::register('carousel', 'SmartUI\Components\Carousel');
\SmartUI\UI::register('smartform', 'SmartUI\Components\SmartForm');
\SmartUI\UI::register('nav', 'SmartUI\Components\Nav');

$_ui = new \SmartUI\UI();

$setting_url = 'data/setting.json';
$_SESSION['settingPage'] = (object) array();
if (is_file($setting_url)) {
	$_SESSION['settingPage'] = (object) json_decode(file_get_contents($setting_url));
}
$init_array_setting = array('page_title', 'footer_info', 'color_site', 'color_site_hover', 'top_menu_color', 'background', 'navigation', 'company_name', 'company_fax', 'company_email', 'company_address', 'gps', 'phone', 'logo', 'logo_ico');
foreach ($init_array_setting as $key) {
	if (!isset($_SESSION['settingPage']->$key)) $_SESSION['settingPage']->$key = '';
}
if (!isset($_SESSION['settingPage']->claim_start_fee)) {
	$_SESSION['settingPage']->claim_start_fee = 65;
}

if ($_SESSION['settingPage']->company_name == '') {
	$_SESSION['settingPage']->company_name = 'Home Warranty';
}
if ($_SESSION['settingPage']->logo_ico == '') {
	$_SESSION['settingPage']->logo_ico = ASSETS_URL . '/img/favicon/favicon.ico';
}
if ($_SESSION['settingPage']->logo == '') {
	$_SESSION['settingPage']->logo = ASSETS_URL . '/img/logo.png';
}

function isAdmin()
{
	return in_array($_SESSION['level'], ['Admin', 'SystemAdmin', 'SuperAdmin']);
}
global $isSystemAdmin;
$isAdmin;
$isUser;
// echo json_encode($_SESSION);

function isSuperAdmin()
{
	$tmp = in_array($_SESSION['level'], ['Admin', 'SystemAdmin', 'SuperAdmin']) && in_array($_SESSION['actor'], ['SystemAdmin', 'SuperAdmin']);
	return $tmp;
}

function isUser()
{
	if (!isset($_SESSION['level'])) return true;
	return in_array($_SESSION['level'], ['User']);
}


function ignore($form)
{
	return in_array($form, ['RegisterForm']);
}


function canAddForm($form)
{
	if (isSuperAdmin()) return true;
	$hasACL = isset($_SESSION['int_acl']['acl_rules']) && isset($_SESSION['int_acl']['acl_rules'][$form]);
	$hasNavigation = isset($_SESSION['page_navigation']) && isset(FORM_ACCESS[$form]) &&  strpos(json_encode($_SESSION['page_navigation']), FORM_ACCESS[$form] . '.php');
	return $hasACL && $hasNavigation;
	// return true;
}

function hasPermission($form, $permission = '', $role)
{
	if (isSuperAdmin()) return true;
	if (ignore($form)) return true;
	if ($form == '' || $permission == '' || $role == '') return false;

	if (!isset($_SESSION['int_acl']['acl_rules'][$form])) return false;
	if (!isset($_SESSION['int_acl']['acl_rules'][$form][$permission])) return false;
	if (!isset($_SESSION['int_acl']['acl_rules'][$form][$permission][$role])) return false;

	return ($_SESSION['int_acl']['acl_rules'][$form][$permission][$role] === true) || ($_SESSION['int_acl']['acl_rules'][$form][$permission][$role] === 'true');
}

function getPermission($form, $attribute)
{
	if (isSuperAdmin()) return (object) array('add' => true, 'edit' => true, 'read' => true, 'show' => true);;
	if (ignore($form)) return (array) array('add' => true, 'edit' => true, 'read' => true, 'show' => true);

	if (!isset($_SESSION['int_acl']['acl_rules'][$form])) return array();
	if ($form == '') return array();
	if ($attribute == '') return $_SESSION['int_acl']['acl_rules'][$form];
	if (!isset($_SESSION['int_acl']['acl_rules'][$form][$attribute])) return array();

	return $_SESSION['int_acl']['acl_rules'][$form][$attribute];
}

function startsWith($string, $startString)
{
	$len = strlen($startString);
	return (substr($string, 0, $len) === $startString);
}
