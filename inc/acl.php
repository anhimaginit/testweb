<?php
/** *
 *   Administrator          full access permissions |view|edit|delete|dowload|
 *   └───Admin              full access permissions |view|edit|delete|
 *       └───User           access permissions      |view|
 *          └───Leader      using in groud
 *          └───Manager     using in groud
 *  None                    Not have permissions
 */
if (!session_id()) {
    session_start();
}

class ACLClass
{
    /**
     * $formName string
     */
    public function getAccessPermissions($formName)
    {
        if (isset($formName) && isset($_SESSION['jwt']) && isset($_SESSION['int_acl']) && isset($_SESSION['actor'])) {
            $intAcl = array();
            if ($_SESSION['actor'] == $_SESSION['int_acl']['unit']) {
                $intAcl =  $_SESSION['int_acl']['acl_rules'];
                $intAcl = (array) $intAcl[$formName];
                return $intAcl;
            }
        } else {
            return [];
        }
        // $intAcl = array();
        // $intAcl = (array) $_SESSION['int_acl'];
        // $intAcl = $intAcl['acl_rules'];
        // $intAcl = (array) $intAcl[0];
        // $intAcl = (array) $intAcl[$formName];
        // $res = array();
        // foreach ($intAcl as $key => $value) {
        //     $value = (array) $value;
        //     $res[$key] = $value;
        // }
        // return $res;
    }

}
// $ACL = new ACLClass();
// $res = $ACL->getAccessPermissions("WarrantyForm");
// var_dump($res);
