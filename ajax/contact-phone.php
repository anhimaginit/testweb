<style>
.input-phone-tel input:read-only:hover{cursor: pointer !important;}
.input-phone-tel input{margin-bottom:2px;}
.input-phone-tel a{margin: 5px;}
.input-phone-tel{
   min-width: 170px;
}
</style>
<fieldset>
   <table id="table_phone">
      <caption style="color:black;">Phone</caption>
      <input type="hidden" class="form-control primary_phone" name="primary_phone" value="">
      <tbody>
         <tr>
            <td class="hasinput input-phone-tel"></td>
            <td class="hasinput">
               <input class="form-control phone-type input-readonly" value="Primary Phone" readonly>
            </td>
            <td class="hasinput">
               <button type="button" class="btn btn-sm btn-default btnEditPhone fa fa-edit"></button>
               <?php if(hasIdParam()){echo '<button type="button" class="btn btn-sm btn-danger btnDelPrimaryPhone fa fa-times"></button>';} ?>
            </td>
            <td>
               <span class="padding-10 phone_status"></span>
            </td>
         </tr>
      </tbody>
      <tfoot>
         <tr>
            <td colspan="3" class="text-right padding-5">
               <button type="button" class="btn btn-sm btn-default no-border-radius fa fa-plus btnAddSecondPhone"> Add Phone</button>
            </td>
         </tr>
      </tfoot>
   </table>
</fieldset>