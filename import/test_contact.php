<?php

require('inf/isdk.php');
$INFApp = new iSDK;
$INFApp->cfgCon("ri357");

$db = "freedomhw_crm_production";
$dbhost = "35.238.134.226";
$dbuser = "freedom-crm-web";
$dbpass = "FreedomIsKey!";
// Create connection
$conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);

//$utctime =  '20190920T18:27:07';
//echo $time_stuff=date('Y-m-d H:i:s',strtotime(str_replace ("T", " ", $utctime)));


//echo datetime('Y-m-d H:i:s',str_replace ("T", " ", $utctime));
//'Hello' .DateTime::createFromFormat("Y-m-d H:i:s.uP", $utctime);
//print_r($conn);

error_reporting(E_ALL);

//Test Get Notes
		 $table = 'Contact';
		  $limit = 1000;
		  $page = 4;
		  $fieldName = 'LastUpdated';
		  $query = array('LastUpdated' => '~<~ 2020-01-01 00:00:00');
		  $returnFields = array('Id','LastName','FirstName','MiddleName','Email','StreetAddress1','StreetAddress2', 'City','State','PostalCode','Phone1','Phone1Ext','Phone1Type','Website','DateCreated');

	
$contact_return = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);

echo "<pre>";
 
//print_r($contact_return);

echo "</pre>";

//return 0;
$i=0;

foreach ($contact_return  as $note) {
        /*echo "<pre>";
                print_r ($note);
        echo "</pre>";*/

     if ($note[Id] > 0){
        $sql  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '%" . $note[Id] . "%';";
        //echo "<br/>  - " . $note[Id];
        $result = mysqli_query($conn, $sql);

        $time_create=date('Y-m-d H:i:s',strtotime(str_replace("T", " ", $note[DateCreated])));
        //echo $time_create;
        if (mysqli_num_rows($result) > 0) {
        // output data of each row

	 echo "<br> Contact Exists";
          /*while($row = mysqli_fetch_assoc($result)) {
          //   echo "id: " . $row["ID"]. " - Found in the DB <br>";
                // echo "id: " . $row["ID"]. " - Found in the DB <br>";
 
                        $sql2  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '" . $note[CreatedBy] . "';";
			$result2 = mysqli_query($conn, $sql2);
			//print_r($result2);
			//echo $sql2 ."<br>";
        		if (mysqli_num_rows($result2) > 0) {
        		//	print_r($row2);		// output data of each row
        			while($row2 = mysqli_fetch_assoc($result2)) {
                			$note_creator=$row2["ID"];
				}
        		}else{
                		$note_creator='202';

        		}



		$sql = "INSERT INTO `notes_temp2`(`contactID`, `typeID`, `create_date`, `type`, `description`, `note`, `enter_by`, `internal_flag`) ";
                $sql .= "VALUES (" . $row["ID"] . ",NULL,'". $time_create . "','Contact',\"" .$note[ActionDescription] . "\", \"" .$note[CreationNotes] . "\",'" .$note_creator . "',0);";
            //    echo $sql. "<br>";

                if (mysqli_query($conn, $sql)) {
                        //echo "New record created successfully";
                } else {
                         echo "Error:  Note ID - " . $note[Id] . " " . $sql . "<br>" . mysqli_error($conn);
                }
           }
*/

       }else{


	 /*
                        $sql2  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '" . $note[CreatedBy] . "';";
			$result2 = mysqli_query($conn, $sql2);
			//print_r($result2);
			//echo $sql2 ."<br>";
        		if (mysqli_num_rows($result2) > 0) {
        		//	print_r($row2);		// output data of each row
        			while($row2 = mysqli_fetch_assoc($result2)) {
                			$note_creator=$row2["ID"];
				}
        		}else{
                		$note_creator='202';

        		}
*/


		$sql = "INSERT INTO `contact_temp3` (`first_name`, `middle_name`, `last_name`, `primary_street_address1`, `primary_street_address2`, `primary_city`, `primary_state`, `primary_postal_code`, `primary_phone`, `primary_phone_ext`, `primary_phone_type`, `primary_email`, `primary_website`, `contact_type`, `contact_inactive`, `contact_notes`, `contact_tags`, `create_by`, `submit_by`, `create_date`, `archive_id`)  ";
                $sql .= "VALUES ( \"". $note[FirstName]."\" , \"" . $note[MiddleName] ."\" , \"" . $note[LastName] ."\" , \"" . $note[StreetAddress1]."\" , \"" . $note[StreetAddress2] ."\" , \"" . $note[City] ."\" , \"" . $note[State]."\" , \"" . $note[PostalCode]."\" , \"" . $note[Phone1]."\" , \"" . $note[Phone1Ext] ."\" , \"" . $note[Phone1Type] ."\" , \"" . $note[Email] ."\" , \"" . $note[Website] . "\", \"Policy Holder\", '0', '', \"Infusionsoft Import 10-2019\", '202', '202',\"" . $time_create ."\" , '" . $note[Id] ."')";
            //    echo $sql. "<br>";

                if (mysqli_query($conn, $sql)) {
                        echo "<br>New record created successfully  - " . $note[Id];
                } else {
                         echo "<br>Error:  Note ID -  " . $note[Id] ." " . $sql . "<br>" . mysqli_error($conn);
                }

     }


	}
}

echo "<br>Script Complete! <br>Page:" . $page;



	/*

	 $result = mysqli_query($conn, $sql);


	echo $time_create=date('Y-m-d H:i:s',strtotime(str_replace ("T", " ", $notes[$i][CreationDate]))$
        if (mysqli_num_rows($result) > 0) {
        // output data of each row
        while($row = mysqli_fetch_assoc($result)) {
        echo "id: " . $row["ID"]. " - Found in the DB <br>";
 
                $sql = "INSERT INTO `notes_temp`(`contactID`, `typeID`, `create_date`, `type`, `descript$
/*
                if (mysqli_query($conn, $sql)) {
                        echo "New record created successfully";
                } else {
                         echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                }*/



/*
	$sql  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '" . $note[$i][ContactId] . "';";
//	$result = mysqli_query($conn, $sql);

        $sql2  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '" . $note[$i][CreatedBy] . "';";
//	$result2 = mysqli_query($conn, $sql2);

/*	if (mysqli_num_rows($result2) > 0) {
        // output data of each row
        while($row2 = mysqli_fetch_assoc($result2)) {
		$note_creator=$note[$i][CreatedBy];
	}else{
		$note_creator='202';

	}


	echo '<pre>';
	print_r($notes_return);

	echo '</pre>';

	echo $time_create=date('Y-m-d H:i:s',strtotime(str_replace ("T", " ", $notes[$i][CreationDate])));
	if (mysqli_num_rows($result) > 0) {
 	// output data of each row
 	while($row = mysqli_fetch_assoc($result)) {
 	echo "id: " . $row["ID"]. " - Found in the DB <br>";
 
		$sql = "INSERT INTO `notes_temp`(`contactID`, `typeID`, `create_date`, `type`, `description`, `note`, `enter_by`, `internal_flag`) VALUES (". $row["ID"] . ",NULL,'". $time_create . "','Contact','".$notes[$i][ActionDescription] . "','" .$notes[$i][ActionDescription] . "','" .$note_creator . "',0)";

		if (mysqli_query($conn, $sql)) {
 			echo "New record created successfully";
		} else {
			 echo "Error: " . $sql . "<br>" . mysqli_error($conn);
		}
	}
} else {
	$sql = "INSERT INTO `notes_temp_cnt_not_found`(`contactID`, `typeID`, `create_date`, `type`, `description`, `note`, `enter_by`, `internal_flag`) VALUES (". $note[$i][ContactId] . ",NULL,'". $time_create . "','Contact','".$notes[$i][ActionDescription] . "','" .$notes[$i][ActionDescription] . "','" .$note_creator . "',0)";


                if (mysqli_query($conn, $sql)) {
                        echo "New record created successfully- UNK Contact";
                } else {
                         echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                }
$i++;
}

}*/

?>

