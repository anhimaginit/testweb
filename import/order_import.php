<?php
require('inf/isdk.php');
$INFApp = new iSDK;
$INFApp->cfgCon("ri357");


$db = "freedomhw_crm_production";
$dbhost = "35.238.134.226";
$dbuser = "freedom-crm-web";
$dbpass = "FreedomIsKey!";


  //CRM
  $url_origin = 'https://api.salescontrolcenter.com/';
  
  //
  $data = array(
'token'=>'MjE0YTIwMzYxOTllNDdlZGU0OGI3ZTQ2OGM3OTZkYjUtdXMxOQ==',
 'primary_email'=>'crm@at1ts.com',
 'primary_postal_code'=>'84401',
 'login_type'=>2,
 'type'=>'Policy Holder'
);
	 
  $curl = curl_init();
$url_crm = $url_origin.'_login.php';
curl_setopt($curl, CURLOPT_URL, $url_crm);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);

curl_close($curl);
  
 $rsl = json_decode($response);


	$token='MjE0YTIwMzYxOTllNDdlZGU0OGI3ZTQ2OGM3OTZkYjUtdXMxOQ==';
	$jwt=$rsl->contact->jwt;
	$private_key = $rsl->contact->ID;
	$create_by=$private_key;
	$submit_by=$private_key;
	$gps='{}'; 



// Create connection
$conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);
/*
	print_r($conn);
	echo "<pre>";
		//print_r($notes_return);
	echo "</pre>";
*/
$i=0;

                 $table = 'Job';
                  $limit = 10;
                  $page = 401;
                  $fieldName = 'LastUpdated';
                  $query = array('LastUpdated' => '~<~ 2019-10-01 00:00:00');
                  $returnFields = array('Id','ContactId','JobTitle','ProductId','OrderStatus','DateCreated','JobNotes');


	$order_return = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);

	echo "<pre>Prder Information:";
		print_r($order_return);
	echo "</pre>";

//return 0;


foreach ($order_return  as $order) {

        $sql  = "SELECT * FROM `mytable4` WHERE `Id` LIKE '" . $order[Id] . "';";
        //echo "<br/>". $sql;
	$result = mysqli_query($conn, $sql);
//		echo mysql_num_rows($result);

// $rowcount=mysqi_num_rows($result);
	//echo rowcount;	
	foreach($result as $stored_or){
		echo "<pre> Database Order:  ";
			print_r($stored_or);
		echo "</pre>";
	}

	if ($stored_or[Affiliate_Id] > 0){
	$table = 'Affiliate';
		  $limit = 10;
		  $page = 0;
		  $fieldName = 'Id';
		  $query = array('Id' => $stored_or[Affiliate_Id]);
		  $fieldValue = $stored_or[Affiliate_Id];
		  $returnFields = array('Id', 'AffCode', 'AffName', 'ContactId');

	  $inf_sales_affiliate_info = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);

	  $salesAffilId = $inf_sales_affiliate_info[0]['ContactId'];

	 echo "<br /> Infusionsoft Return";
	  print_r($inf_sales_affiliate_info);	

	$sql2  = "SELECT `ID` FROM `contact` WHERE `archive_id` = '" . $salesAffilId . "';";
        echo "<br/>Get CRM Contact Info: ". $sql2;
        $crm_sales_affiliate = mysqli_query($conn, $sql2);
//	print_r($crm_sales_affiliate);

	 if(mysqli_num_rows ($crm_sales_affiliate) <= 0){
                echo '<br /> Run Update:';//Search by email
		$returnFields = array('Email');
                $conDat = $INFApp->loadCon($salesAffilId, $returnFields);
                
                $contact_email = array( 'token'=>'MjE0YTIwMzYxOTllNDdlZGU0OGI3ZTQ2OGM3OTZkYjUtdXMxOQ==',
                        'primary_email'=>$conDat[Email]);
                
                $url_crm = $url_origin.'_isEmailExistingFreedom.php';
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, $url_crm);
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($contact_email));

                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $contact_e_rsl = curl_exec($curl);
                curl_close($curl);
                $rsl_id = json_decode($contact_e_rsl,true);
                
		echo "<br />Print CRM Results:";
		print_r($rsl_id);

                $update_sql ="UPDATE `contact` SET `archive_id` = " . $salesAffilId . " WHERE `ID` = " . $rsl_id . ";";
		//echo $update_sql;                
		mysqli_query($conn, $update_sql);

        }else{
		echo 'SalesID: ';
                foreach($crm_sales_affiliate as $a_id){
                    echo $a_id[ID];
		   $salesAffilId = $a_id[ID];
                }
        }
	}	

//echo mysqli_num_rows($result);
	$table = 'OrderItem';
                  $limit = 100;
                  $page = 0;
                  $fieldName = 'OrderId';
                  $query = array('OrderId'=> $stored_or[Order_Id]);
                  $returnFields = array('Id','ItemName','ProductId','Qty','PPU','ItemType');


        $order_items = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);

	echo "<pre>";
               // print_r($order_items);
        echo "</pre>";

	$i_cnt = 0;
	unset($item_product);
	foreach($order_items as $item){
        $table = 'Product';
                  $limit = 100;
                  $page = 0;
                  $fieldName = 'Id';
                  $query = array('Id'=> $item[ProductId]);
                  $returnFields = array('Id','Sku');


        $product_info = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);

	$order_items[$i_cnt][SKU] = $product_info[0][Sku];
	

/*
	}
        echo "<pre>";
                print_r($order_items);
        echo "</pre>";
*/
//	foreach($item as $it_temp){
	$sku = $order_items[$i_cnt]['SKU'];
        if ($order_items[$i_cnt]['ProductId'] == 87){
                $sku = 'over';
        }


	if ($item[ProductId] < 31){
		$it_class = 'Warranty';
	}else{
		$it_class = 'A La Carte';
	}
		    $item_product[]=array(
                        'quantity'=> $item['Qty'],
                        'price'=>$order_items[$i_cnt]['PPU'],
                        'discount'=>0,
                        'discount_type'=>'',
                        'line_total'=>($order_items[$i_cnt]['Qty']*$order_items[$i_cnt]['PPU']),
                        'id'=>$order_items[$i_cnt]['ProductId'],
                        'sku'=>$sku,
                        'prod_name'=>$order_items[$i_cnt]['ItemName'],
                        'prod_class'=>$it_class
                    );
		
		if($it_class=='Warranty' || $it_class=='A La Carte'){
                        //$pro_ids.=empty($pro_ids)?'':',';
                        //$pro_ids .= $it['ID'];
			if(is_numeric($order_items[$i_cnt]['Qty']) && $order_items[$i_cnt]['Qty'] > 0){
				for($ij=0;$ij<$order_items[$i_cnt]['Qty'];$ij++){
					$pro_ids.=empty($pro_ids)?'':',';
					$pro_ids .= $order_items[$i_cnt]['ProductId'];
				}
			}
                    }
	//}

	$i_cnt++;	
	}

	echo "<pre>Item_Product Array: ";
                print_r($item_product);
        echo "</pre>";

	        $table = 'Invoice';
                  $limit = 100;
                  $page = 0;
                  $fieldName = 'Id';
                  $query = array('Id'=> $stored_or[Invoice_Id]);
                  $returnFields = array('Id','InvoiceTotal','PayStatus','TotalDue','TotalPaid','JobId');


        $invoice = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);

        echo "<pre>Invoice: ";
                print_r($invoice);
        echo "</pre>";


	  $table = 'InvoicePayment';
                  $limit = 100;
                  $page = 0;
                  $fieldName = 'InvoiceId';
                  $query = array('InvoiceId'=> $stored_or[Invoice_Id]);
                  $returnFields = array('Id','InvoiceId','PayDate','Amt');
        $invoice_pay = $INFApp->dsQuery($table, $limit, $page, $query, $returnFields);
        echo "<pre>Invoice Payment: ";
                print_r($invoice_pay);
        echo "</pre>";


	$sql3  = "SELECT `ID` FROM `contact` WHERE `archive_id` = '" . $stored_or[ContactId] . "';";
        echo "<br/>". $sql3;
        $buyer_id  = mysqli_query($conn, $sql3);
	 

  	if(!$buyer_id){
		$error_note = 'Cannot find Contact';
                $error_sql ="INSERT INTO `order_problems` (`oID`, `cID`, `note`) VALUES ('" . $stored_or[Order_Id] . "', '" . $stored_or[ContactId] . "', '" . $error_note . "');";
                echo $error_sql;
                mysqli_query($conn, $error_sql);
        }else{
                foreach($buyer_id as $b_id){
                                echo "BUYER: " . $b_id[ID];
                }
        }


	$contact_email = array( 'token'=>'MjE0YTIwMzYxOTllNDdlZGU0OGI3ZTQ2OGM3OTZkYjUtdXMxOQ==',
                        'primary_email'=>$stored_or[Order_Submitter_Email]);
                
                $url_crm = $url_origin.'_isEmailExistingFreedom.php';
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, $url_crm);
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($contact_email));

                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $contact_e_rsl = curl_exec($curl);
                curl_close($curl);
                $rsl_id = json_decode($contact_e_rsl,true);

		$submit_id = $rsl_id;

		
	$balance = $invoice[0][InvoiceTotal];
	$total  = $invoice[0][InvoiceTotal];
	if($balance < 1){
		$balance =  1;
	}

	 if($total < 1){
                $total = 1;
        }


        $date = date("Y-m-d");
     
 	 $data_order = array('token'=>$token,
	 'balance'=>$balance,
	 'bill_to'=>$b_id[ID],
	 'note'=>$stored_or[Order_Comments],
	 'payment'=>0,
	 'salesperson'=>$salesAffilId,
	 'products_ordered'=>$item_product,
	 'total'=>$total,
	 'order_total'=>$total,
	 'jwt'=>$jwt,
	 'private_key'=>$private_key,
	 'subscription'=>'',
	 'order_create_by'=>$submit_id,
	 'notes'=>$stored_or[Order_Comments]
	 );

	$warrantyContractAmount= floatval($stored_or[Order_Total_Amount_From_Real_Estate_Purchase_Contract]);
   
  // print_r(json_encode($data_order));
     if(empty($warrantyContractAmount)){
            $warrantyContractAmount=0;
       }

        if($warrantyContractAmount>$orderTotal) $orderTotal=$warrantyContractAmount;
     
        //add Order
    $rsl_order='';
  
  	if(count($item_product)>0){
  	  $curl = curl_init();
	  curl_setopt($curl, CURLOPT_URL, $url_origin.'_orderAddNew.php');
	  curl_setopt($curl, CURLOPT_POST, true);
	  curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data_order));

	  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

	  $prod_rsl = curl_exec($curl);
	  curl_close($curl);
	  $rsl_order = json_decode($prod_rsl,true);
		print_r($rsl_order);
	  if($rsl_order['SAVE']=='SUCCESS'){
		$rsl_order =$rsl_order['ID'];		 
	  }else{
                $error_note = 'Order Error - ' . $rsl_order['ERROR'];
		$error_sql ="INSERT INTO `order_problems` (`oID`, `cID`, `note`) VALUES (" . $stored_or[Order_Id] . ", " . $stored_or[ContactId] . ", \"" . $error_note . "\");";
                mysqli_query($conn, $error_sql);
	  }
	 // echo json_encode($rsl_order);
	}


        $contact_email = array( 'token'=>'MjE0YTIwMzYxOTllNDdlZGU0OGI3ZTQ2OGM3OTZkYjUtdXMxOQ==',
        'primary_email'=>$stored_or[Order_Real_Estate_Agent_Email]);

        $url_crm = $url_origin.'_isEmailExistingFreedom.php';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url_crm);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($contact_email));

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $contact_e_rsl = curl_exec($curl);
        curl_close($curl);
        $rsl_id = json_decode($contact_e_rsl,true);
        print_r($rsl_id);


        $buyeragent_id = $rsl_id;


        $contact_email = array( 'token'=>'MjE0YTIwMzYxOTllNDdlZGU0OGI3ZTQ2OGM3OTZkYjUtdXMxOQ==',
        'primary_email'=>$stored_or[Order_Escrow_Officer_Email]);

        $url_crm = $url_origin.'_isEmailExistingFreedom.php';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url_crm);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($contact_email));

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $contact_e_rsl = curl_exec($curl);
        curl_close($curl);
        $rsl_id = json_decode($contact_e_rsl,true);
        print_r($rsl_id);
        $escrow_id - $rsl_id;

        
	
	 //Warranty create on CRM
    $d = date("Y-m-d H:i:s");
    $Y = date("Y");
    $strYMD =strtotime($d);
    $serial = $stored_or[Order_Warranty_Policy_Id];


    $create_date = strtotime($stored_or[Order_Date]);
    $create_date = date('Y-m-d H:i:s',$create_date);
	echo "<br/> Create: ".$create_date;

    $start_date = NULL;
    $end_date = NULL;
    if (!empty($invoice_pay[0][PayDate])){
    $start_date = str_replace("T", " ", $invoice_pay[0][PayDate]);
    $start_date = strtotime($start_date);
    $start_date = date('Y-m-d H:i:s', $start_date);
	"<br/> Start: ".$start_date;
    $end_date = str_replace("T", " ", $invoice_pay[0][PayDate]);
    $end_date = strtotime('+1 year', strtotime($end_date));
    $end_date = date('Y-m-d H:i:s',$end_date);
	"<br/> End: ".$end_date;
   }
	//data for warranty
   if(is_numeric($b_id[ID]) && !empty($b_id[ID]) && is_numeric($rsl_order) && !empty($rsl_order)){	  
	  if(empty($warrantyContractAmount)) $warrantyContractAmount=0;
	 
     $charity=2;
     
     //declare variable $warranty_id
	 $warranty_id='';
	 $clientWarrantyState_code = stateNameToKey($stored_or[State]);


	 $date = start_date;
            $note_w = array("create_date"=>$date,
                "type"=>"Warranty",
                "description"=>'Imported',
                "note"=>"Imported from infusionsoft - Please check the accuracy in Infusionsoft. Order ID - " . $stored_or[Id],
                "enter_by"=>'202');

            $notes[]= $note_w;
	 
       $warranty_data =  array('token'=>$token,
			'warranty_address1'=>$stored_or[Order_Property_Street_Address],
			'warranty_address2'=>'',
			'warranty_buyer_id'=>$b_id[ID],
			'warranty_salesman_id'=>$salesAffilId,
			'warranty_city'=>$stored_or[Order_Property_City],
			'warranty_creation_date'=>$create_date,
			'warranty_email'=>$stored_or[Order_Email],
			'warranty_end_date'=>$end_date,
			'warranty_buyer_agent_id'=>$buyeragent_id,
			'warranty_escrow_id'=>$escrow_id,
			'warranty_notes'=>$stored_or[Order_Comments],
			'warranty_order_id'=>$rsl_order,
			'warranty_phone'=>$stored_or[Order_Telephone],
			'warranty_postal_code'=>$stored_or[Order_Property_Postal_Code],
			'warranty_serial_number'=>$serial,
			'warranty_start_date'=>$start_date,
			'warranty_state'=>$clientWarrantyState_code,
			'warranty_closing_date'=>date("Y-m-d",strtotime($stored_or[Order_Estimated_Closing_Date])),
			'warranty_contract_amount'=>$warrantyContractAmount,
			'warranty_charity_of_choice'=>$charity,
			'jwt'=>$jwt,
			'private_key'=>$private_key,
			'pro_ids'=>$stored_or[Product_Ids],
			'diff_address'=>0,
			'totalOver'=>$stored_or[Order_Total],
			'total'=>$stored_or[Order_Total],
			'warranty_eagle'=>$warranty_eagle,
							  'warranty_create_by'=>$submit_id,
							  'notes'=>$note_w);
	 
	         $url_crm = $url_origin.'_warrantyAddNewNotLogin.php';

			  $curl = curl_init();
			  curl_setopt($curl, CURLOPT_URL, $url_crm);
			  curl_setopt($curl, CURLOPT_POST, true);
			  curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($warranty_data));

			  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

			  $warranty_add_rsl = curl_exec($curl);

			  curl_close($curl);
			  $warranty_rsl = json_decode($warranty_add_rsl,true);

			print_r($warranty_rsl);
			  if($warranty_rsl['SAVE']=='SUCCESS'){
				  $warranty_id = $warranty_rsl['ID'];
				
                $update_sql ="UPDATE `warranty` SET `warranty_creation_date` =\"" . $create_date . "\", `warranty_end_date` = \"" . $end_date . "\", `warranty_start_date` = \"" . $start_date . "\" WHERE `ID` = " . $warranty_id . ";";
                echo $update_sql;                
                mysqli_query($conn, $update_sql); 
			  }else{
				$error_note = 'Warranty Error - ' . $warranty_rsl['ERROR'];
                		$error_sql ="INSERT INTO `order_problems` (`oID`, `cID`, `note`) VALUES (" . $stored_or[Order_Id] . ", " . $stored_or[ContactId] . ", \"" . $error_note . "\");";
                		echo $error_sql;
                		mysqli_query($conn, $error_sql);
			  }
	}
	







}







function stateNameToKey($value){
	  $key ='';
	  switch($value){
		case 'Alaska':
			$key = 'AK';
			break;
		case 'Alabama':
			$key = 'AL';
			break;
		case 'Arkansas':
			$key = 'AR';
			break;
		case 'Arizona':
			$key = 'AZ';
			break;
		case 'California':
			$key = 'CA';
			break;
		case 'Colorado':
			$key = 'CO';
			break;
		case 'Connecticut':
			$key = 'CT';
			break;
		case '':
			$key = '';
			break;
		case 'District of Columbia':
			$key = 'DC';
			break;
		case 'Delaware':
			$key = 'DE';
			break;
		case 'Florida':
			$key = 'FL';
			break;
		case 'Georgia':
			$key = 'GA';
			break;
		case 'Hawaii':
			$key = 'HI';
			break;
		case 'Iowa':
			$key = 'IA';
			break;
		case 'Idaho':
			$key = 'ID';
			break;
		case 'Illinois':
			$key = 'IL';
			break;
		case 'Indiana':
			$key = 'IN';
			break;
		case 'Kansas':
			$key = 'KS';
			break;
		case 'Kentucky':
			$key = 'KY';
			break;
		case 'Louisiana':
			$key = 'LA';
			break;
		case 'Massachusetts':
			$key = 'MA';
			break;
		case 'Maryland':
			$key = 'MD';
			break;
		case 'Maine':
			$key = 'ME';
			break;
		case 'Michigan':
			$key = 'MI';
			break;
		case 'Minnesota':
			$key = 'MN';
			break;
		case 'Missouri':
			$key = 'MO';
			break;
		case 'Mississippi':
			$key = 'MS';
			break;
		case 'Montana':
			$key = 'MT';
			break;
		case 'North Carolina':
			$key = 'NC';
			break;
		case 'North Dakota':
			$key = 'ND';
			break;
		case 'Nebraska':
			$key = 'NE';
			break;
		case 'New Hampshire':
			$key = 'NH';
			break;
		case 'New Jersey':
			$key = 'NJ';
			break;
		case 'New Mexico':
			$key = 'NM';
			break;
		case 'Nevada':
			$key = 'NV';
			break;
		case 'New York':
			$key = 'NY';
			break;
		case 'Ohio':
			$key = 'OH';
			break;
		case 'Oklahoma':
			$key = 'OK';
			break;
		case 'Oregon':
			$key = 'OR';
			break;
		case 'Pennsylvania':
			$key = 'PA';
			break;
		case 'Rhode Island':
			$key = 'RI';
			break;
		case 'South Carolina':
			$key = 'SC';
			break;
		case 'South Dakota':
			$key = 'SD';
			break;
		case 'Tennessee':
			$key = 'TN';
			break;
		case 'Texas':
			$key = 'TX';
			break;
		case 'Utah':
			$key = 'UT';
			break;
		case 'Virginia':
			$key = 'VA';
			break;
		case 'Vermont':
			$key = 'VT';
			break;
		case 'Washington':
			$key = 'WA';
			break;
		case 'Wisconsin':
			$key = 'WI';
			break;
		case 'West Virginia':
			$key = 'WV';
			break;
		case 'Wyoming':
			$key = 'WY';
			break;    
	}
  
  return $key;
  
}












?>
