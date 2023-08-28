<?php
$host = 'https://api.salescontrolcenter.com';
if($_SERVER['HTTP_HOST'] == 'localhost'){
    // $host = 'https://api.salescontrolcenter.com';
    $host = 'https://api.warrantyproject.com';
}else{
    $host = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://api.' . $_SERVER['HTTP_HOST'];
}
$link = array(
    '_contactGetById' => $host . '/_contactGetById.php',
    '_productGetById' => $host . '/_productGetById.php',
    '_warrantyGetById' => $host . '/_warrantyGetById.php',
    '_orderGetById' => $host . '/_orderGetById.php',
    '_invoiceGetByID' => $host . '/_invoiceGetByID.php',
    '_getProductType' => $host.'/_getProductType.php',
    '_claimGetById' => $host .'/_claimGetById.php',
    '_claimTransactionByID' => $host .'/_claimTransactionByID.php',
    '_company_ID' => $host .'/_company_ID.php',

    '_getProductType' => $host.'/_getProductType.php',
    '_productFilterList' => $host . '/_productFilterList',
    '_wanranties_BillToID' => $host . '/_wanranties_BillToID.php',
    '_wanrantyFilterList' => $host . '/_wanrantyFilterList.php',


    '_claimLimitProductList' => $host . '/_claimLimitProductList.php',
    '_contactFilterList' => $host . '/_contactFilterList.php',
    '_claimFilterList' => $host .'/_claimFilterList.php',
    '_claimGetClaimsCreateBy' => $host . '/_claimGetClaimsCreateBy',
    '_salesmanList' => $host .'/_salesmanList.php',
    '_employeeList' => $host . '/_employeeList.php',
    '_taskClaimTemplateList' => $host . '/_taskClaimTemplateList.php',
    '_contactGetList' => $host . '/_contactGetList.php',

    '_roles' => $host . '/_roles.php',
    '_claimEmployee' => $host . '/_claimEmployee.php',
    
);
 ?>