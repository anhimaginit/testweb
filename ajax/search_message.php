
<div class="row" id="panel_search_all" style="display:none">
   <div class="alert alert-info">
      The search results of the 

      <span id="type_keyword"><?= $_typesearch ?></span> keyword: 
      <strong id="_keyword"> <?php if(isset($_COOKIE['search_all_'.$_typesearch])){ 
         echo $_COOKIE['search_all_'.$_typesearch]; unset($_COOKIE['search_all_'.$_typesearch]);} ?>
      </strong>
    
   </div>
</div>