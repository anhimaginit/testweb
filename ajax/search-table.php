<form id="form_search"></form>
<div class="pull-left" id="panel_search_table" style="display:none; margin-top:6px; margin-right:20px;">
   <label class="input col col-3"><input type="hidden" placeholder="Search" class="form-control" name="search_all" form="form_search" style="margin:5px;"></label>
   <label style="margin: 5px; right:15px;">Show</label>
   <label class="select">
   <select name="page_size" id="page_size" class="form-control" style="width:50px; padding:2px; margin:1px;">
      <option value="10" selected>10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="200">200</option>
      <option value="500">500</option>
      <option value="1000">1000</option>
   </select></label>
</div>
<script>
function clear_search(){
   $('input[name="search_all"]').val('');
   $('#lblSearch').click();
}
$('select[name="page_size"]').change(function () {
   var page_size = $('select[name="page_size"]').val();
   selectPage(1, page_size);
});
</script>