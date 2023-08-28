$('[data-view="link_to"]').each(function(index){
   let _this = $(this);
   let control = _this.data('control');
   let form_name = _this.data('name');
   let param = _this.data('param');
   let form = _this.data('form');
   $(form+ ' select[name="'+control+'"]').on('change', function(e){
       if(this.value==''){
           _this.empty();
       }else{
           _this.html(`<a href="./#ajax/${form_name}.php?${param}=${this.value}" target="_blank" style="padding:0px 5px;"> <i class="fa fa-link"></i> Infomation Detail </a>`)
       }
   });
});