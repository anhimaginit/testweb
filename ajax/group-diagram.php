<?php require_once 'inc/init.php';
?>
<style>
  .userName {
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 2px;
  }

  .hierachy-diagram {
    width: 100%;
    height: 300px;
  }
</style>
<section id="widget-grid" class="">
  <div class="row">
    <script src="<?= ASSETS_URL ?>/js/plugin/gojs/release/go.js"></script>
    <!-- NEW WIDGET START -->
    <article class="col-sm-12 col-md-12 col-lg-12">

      <!-- Widget ID (each widget will need unique ID)-->
      <div class="row">
        <div class="col col-sm-6 col-xs-12">
          <div id="hierachy_pane1" class="hierachy-diagram"></div>
        </div>
        <div class="col col-sm-6 col-xs-12">
          <div id="hierachy_pane2" class="hierachy-diagram"></div>
        </div>
        <div class="col col-sm-6 col-xs-12">
          <div id="hierachy_pane3" class="hierachy-diagram"></div>
        </div>
        <div class="col col-sm-6 col-xs-12">
          <div id="hierachy_pane4" class="hierachy-diagram"></div>
        </div>
        <div class="col col-sm-6 col-xs-12">
          <div id="hierachy_pane5" class="hierachy-diagram"></div>
        </div>
        <div class="col col-sm-6 col-xs-12">
          <div id="hierachy_pane0" class="hierachy-diagram"></div>
        </div>
      </div>
      <!-- end widget -->

    </article>
  </div>
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/group/group-diagram.js"></script>
<script>
  
  function settingHierachyDiagram(list) {
    var hierachy = [];
    listDepartment = ['Sales', 'Affiliate', 'Customer', 'Vendor', 'Employee', 'PolicyHolder']
    var listData = [
      [],
      [],
      [],
      [],
      [],
      []
    ];
    list.forEach((item, index) => {
      switch (item.department) {
        case 'Sales':
          listData[0].push(item);
          break;
        case 'Affiliate':
          listData[1].push(item);
          break;
        case 'Customer':
          listData[2].push(item);
          break;
        case 'Vendor':
          listData[3].push(item);
          break;
        case 'Employee':
          listData[4].push(item);
          break;
        case 'PolicyHolder':
          listData[5].push(item);
          break;
      }
    });
    for (var i = 0; i < listData.length; i++) {
      var div = 'hierachy_pane' + i;
      hierachy.push(new GroupDiagram(div, listDepartment[i]));
    }
    listData.forEach((item, index) => {
      hierachy[index].drawGroup(listData[index]);
    })
  };
  if(window.group_list){
    settingHierachyDiagram(window.group_list);
  }else{
    jQuery.ajax({
      url: host + '_groupList.php',
      type: 'post',
      data: $.extend({}, template_data),
      dataType: 'json',
      success: function(res) {
        if (res.list) {
          settingHierachyDiagram(res.list);
        }
      }
    })
  }
</script>