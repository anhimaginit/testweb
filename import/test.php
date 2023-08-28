<?php

require('inf/isdk.php');
$INFApp = new iSDK;
$INFApp->cfgCon("ri357");

/*
//Infustionsoft Test find Contact
$email = 'brandon@at1ts.com';
$returnFields = array('Id', 'FirstName', 'LastName');
$contData = $INFApp->findByEmail($email, $returnFields);
*/





//Test Get Notes
$table = 'ContactAction';
		  $limit = 1000;
		  $page = 112;
		  $fieldName = 'ObjectType';
		  $fieldValue = 'Note';
		  $returnFields = array('Accepted','ActionDate','ActionDescription','ActionType','CompletionDate','ContactId','CreatedBy','CreationDate','CreationNotes','EndDate','Id','IsAppointment','LastUpdated','LastUpdatedBy','Location','ObjectType','OpportunityId','PopupDate','Priority','UserID');

	  $notes_return = $INFApp->dsFind($table, $limit, $page, $fieldName, $fieldValue, $returnFields);



$contact_info = $INFApp->savedSearchAllFields(597, 54207, 2);



echo '<pre>';
print_r($contact_info);

echo '</pre>';



?>

