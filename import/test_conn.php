
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
$table = 'ContactAction';
		  $limit = 1000;
		  $page = 117;
		  $fieldName = 'ObjectType';
		  $fieldValue = 'Note';
		  $returnFields = array('Accepted','ActionDate','ActionDescription','ActionType','CompletionDate','ContactId','CreatedBy','CreationDate','CreationNotes','EndDate','Id','IsAppointment','LastUpdated','LastUpdatedBy','Location','ObjectType','OpportunityId','PopupDate','Priority','UserID');


	
//$notes_return = $INFApp->dsFind($table, $limit, $page, $fieldName, $fieldValue, $returnFields);

echo "<pre>";
 
//print_r($notes_return);

echo "</pre>";

//return 0;
$i=0;


        $sql  = "SELECT * FROM `notes_temp_cnt_not_found` LIMIT 5;";
       // echo "<br/>". $note[ContactId] . " - " . $note[Id];
        $result = mysqli_query($conn, $sql);

echo mysqli_num_rows($result);
return 0;
/*for ($x = 0; $x <= mysqli_num_rows($result); $x++) {

$note = mysqli_fetch_assoc($result);
//foreach ($result  as $note) {
        echo "<pre>";
                print_r ($note);
        echo "</pre>";

}

return 0;

     if ($note[archiveID] > 0){
        $sql  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '%" . $note[archiveID] . "%';";
        echo "<br/>". $note[archiveID] . " - " . $note[noteID];
        $result = mysqli_query($conn, $sql);

/*
 echo "<pre>";
                print_r ($result);
        echo "</pre>"; 
return 0;*/
        $time_create=$note[create_date];
        //echo $time_create;
        if (mysqli_num_rows($result) > 0) {
        // output data of each row
          while($row = mysqli_fetch_assoc($result)) {
          //   echo "id: " . $row["ID"]. " - Found in the DB <br>";
                // echo "id: " . $row["ID"]. " - Found in the DB <br>";
 
                        $sql2  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `ID` LIKE '%" . $note[enter_by] . "%';";
			$result2 = mysqli_query($conn, $sql2);
			//print_r($result2);
			//echo $sql2 ."<br>";        		
//			if (mysqli_num_rows($result2) > 0) {
        		//	print_r($result2);
		// output data of each row        		
			//while($row2 = mysqli_fetch_assoc($result2)) {
                			$note_creator=202;
					//print_r($note_creator);
//return 0;
			//	}
//	     
		if($note[description] == ""){
			$note_desc = 'nothing';
		}else{
			$note_desc = $note[description];
		}		

		if($note[note] == ""){
                        $note_note = 'nothing';
                }else{
                        $note_note = $note[note];
                }  

		$sql = "INSERT INTO `notes_temp`(`contactID`, `typeID`, `create_date`, `type`, `description`, `note`, `enter_by`, `internal_flag`) ";
                $sql .= "VALUES (" . $row["ID"] . ",NULL,'". $time_create . "','Contact',\"" .$note_desc . "\", \"" .$note_note . "\",'" . $note_creator . "',0);";
                echo $sql. "<br>";

                if (mysqli_query($conn, $sql)) {
                        //echo "New record created successfully";
                } else {
                         echo "Error:  Note ID - " . $note[noteID] . " " . $sql . "<br>" . mysqli_error($conn);
                }
           }


       }
	/*else{


	 
                        $sql2  = "SELECT `ID`,`archive_id` FROM `contact` WHERE `archive_id` LIKE '" . $note[enter_by] . "';";
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



		$sql = "INSERT INTO `notes_temp_cnt_not_found`(`contactID`, `typeID`, `create_date`, `type`, `description`, `note`, `enter_by`, `internal_flag`) ";
                $sql .= "VALUES (" . $note[archiveID] . ",NULL,'" . $time_create . "','Contact',\"" .$note[description] . "\", \"" . $note[note] . "\",'" .$note_creator . "',0);";
            //    echo $sql. "<br>";

                if (mysqli_query($conn, $sql)) {
                        //echo "New record created successfully";
                } else {
                         echo "Error:  Note ID -  " . $note[noteID] ." " . $sql . "<br>" . mysqli_error($conn);
                }

     }*/


	}
}*/

echo "Script Complete! Page:" . $page;



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

