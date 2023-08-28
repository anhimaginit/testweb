function take_screenshot(only_screen) {
   let template = `
   <div class="screen-item">
      <img>
      <span class="tool">
         <i class="fa fa-times text-danger" title="Delete Image"></i>
         <i class="fa fa-download" title="Download Image"></i>
         <i class="fa fa-reply" title="Create Issue Ticket"></i>
      </span>
   </div>`;
   let option = {};
   if (only_screen) {
      option.width = window.screen.width;
      option.height = window.innerHeight;
      option.x = window.scrollX;
      option.y = window.scrollY;
   }
   html2canvas(document.body, option).then(canvas => {
      var img = canvas.toDataURL();
      var screenshots = $('.screenshot:first');
      if (screenshots[0] == undefined) {
         $('body').append(`<div class="screenshot"></div>
         <div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="previewScreenshotModal">
            <div class="modal-dialog modal-lg" style="min-width:80%;">
               <div class="modal-content">
               </div>
            </div>
         </div>`);
         screenshots = $('.screenshot:first');
         screenshots.append(template);
         screenshots.find('img:last').attr('src', img);
         screenshots.find('.screen-item:last');
      } else {
         screenshots.append(template);
         screenshots.find('img:last').attr('src', img);
         screenshots.find('.screen-item:last');
      }
   });
}

$(function () {
   $(document).unbind('click', '.screenshot i.fa-times').on('click', '.screenshot i.fa-times', function () {
      $(this).closest('.screen-item').remove();
   });
   $(document).unbind('click', '.screenshot i.fa-download').on('click', '.screenshot i.fa-download', function () {
      let img = $(this).closest('.screen-item').find('img');
      let url = img.attr('src').replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      let aaa = window.open(url);
      aaa.document.title = `Screenshot ${document.title}-${getDateTime()}"`;
   });

   $(document).unbind('click', '.screenshot img').on('click', '.screenshot img', function () {
      let img = $(this).clone();
      $('#previewScreenshotModal .modal-content').html(img);
      $('#previewScreenshotModal').modal('show');
   });

   $(document).unbind('click', '.screenshot i.fa-reply').on('click', '.screenshot i.fa-reply', function () {
      let img = $(this).closest('.screen-item').find('img');
      let content = img.attr('src');
      if (window.location.href.includes('new-ticket.php')) {
         window.imageScreenShots.push(content);
         window.imageScreenShotName.push('Screenshot-' + Math.random().toString().split('.').pop() + '.png');



         $('#viewImagePane').append(
            `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pane_image">
               <i class="pull-right fa fa-times pointer removeImageViewPage" style="position:absolute; right:15px; top:5px; z-index:1; color:#ccc"></i>
               <img src="${content}" class="img img-responsive" style="width:100%">
            </div>`);
      } else {
         window.img_feedbacks = content;
         window.issue_form = document.title.split(' - ').shift();
         window.link_ticket = window.location.href + '';
         window.location.assign('./#ajax/help-desk.php');
      }
   });

});