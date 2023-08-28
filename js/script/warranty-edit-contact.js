$('#warranty_form .warranty_buyer_agent_id, #warranty_form .warranty_seller_agent_id, #warranty_form .warranty_escrow_id, #warranty_form .warranty_mortgage_id').on('select2:select', function (e) {
   var name = this.getAttribute('name');
   if (this.value != '') {
      var _html = '<button type="button" class="btn btn-sm btn-warning btn-edit-contact no-border-radius" title="Edit contact" data-select="' + name + '" style="margin-left:4px"><i class="fa fa-edit"></i></button>';
      $(this.parentNode).find('button.btn-edit-contact').remove();
      $(this.parentNode).append(_html);
      var otherWidth = 0;
      $(this.parentNode).find('div, button').each(function () {
         otherWidth += $(this).width();
      });
      $(this.parentNode).find('.select2-selection--single').css({ width: $(this.parentNode).width() - otherWidth });
   }
});

$(document).unbind('click', '.btn-edit-contact').on('click', '.btn-edit-contact', function () {
   var selectName = $(this).data('select');
   var id = $('#warranty_form .' + selectName).val();
   var w = screen.width - 200 < 800 ? screen.width - 200 : 800,
      h = screen.height - 100 < 500 ? screen.height - 100 : 500,
      left = (screen.width / 2) - (w / 2),
      top = (screen.height / 2) - (h / 2);
   var _paramID = 'uid';
   // if ($('#warranty_form [name=ID]').val() != '') {
   //    _paramID = 'aid';
   // }
   var contactWarrantyWindow = window.open(
      host2 + '#ajax/contact-form.php?fw=true&' + _paramID + '=' + id,//url
      'Edit Contact From Warranty',//title
      'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ', titlebar=0, location=0'
   );
   contactWarrantyWindow.isForwardToEdit = true;
   contactWarrantyWindow.onload = function () {
      contactWarrantyWindow.document.getElementById('header').remove();
      contactWarrantyWindow.document.getElementById('shortcut').remove();
      contactWarrantyWindow.document.getElementById('ribbon').remove();
      contactWarrantyWindow.document.getElementById('left-panel').remove();

      contactWarrantyWindow.document.getElementById('content').setAttribute('style', 'width:100%;');
      contactWarrantyWindow.document.getElementById('main').setAttribute('style', 'margin-left:0px;');
      $(contactWarrantyWindow.document).find('.page-footer').css({ display: 'none' });
      $(contactWarrantyWindow.document).find('#gps').css({ display: 'none' });

      $(contactWarrantyWindow.document).find('#btnBackContact').text('Close');
      $(contactWarrantyWindow.document).find('#btnBackContact').on('click', function () {
         contactWarrantyWindow.close();
      });
   }

   contactWarrantyWindow.onbeforeunload = function () {
      if (window.updateSuccess) {
         var first_name = $(contactWarrantyWindow.document).find('#contact_form [name=first_name]').val();
         var last_name = $(contactWarrantyWindow.document).find('#contact_form [name=last_name]').val();
         var city = $(contactWarrantyWindow.document).find('#contact_form [name=primary_city]').val();
         var state = $(contactWarrantyWindow.document).find('#contact_form [name=primary_state]').val();
         var postal_code = $(contactWarrantyWindow.document).find('#contact_form [name=primary_postal_code]').val();
         var company = $(contactWarrantyWindow.document).find('#contact_form [name=company_name]').val();
         var display = (first_name ? first_name + ' ' : '') + (last_name ? last_name : '') + ' - ' + [city, state, postal_code, company].join(' - ');

         var elemDisplay = $('#warranty_form .' + selectName).parent().find('.select2-selection__rendered');
         elemDisplay.attr('title', display);
         elemDisplay.text(display);
      }
   }
})

