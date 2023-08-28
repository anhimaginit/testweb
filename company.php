<h2 class="padding-10">Add Company</h2>
<div id="message_form_company" role="alert" style="display:none"></div>
<form class="smart-form" id="company_form" method="post" novalidate="novalidate">
  <input type="hidden" name="ID" value="">
  <fieldset>
    <div class="row">
      <section class="col col-6">
        <label class="label">Company Name</label>
        <label class="input "><input class="text-input" type="text" name="name" value=""></label>
      </section>
    </div>
  </fieldset>
  <fieldset class="pane_address">
    <legend>Address</legend>
    <div class="row">
      <section class="col col-6">
        <label class="label">Street Address 1</label> <label class="input "><input type="text" name="address1" value=""> </label>
      </section>
    </div>
    <div class="row">
      <section class="col col-6">
        <label class="label">Street Address 2</label> <label class="input "><input type="text" name="address2" value=""> </label>
      </section>
    </div>
    <div class="row">
      <section class="col col-3">
        <label class="input">City</label>
        <select name="city" class="city form-control col-12 select2" style="width:100%" tabindex="-1" aria-hidden="true"></select>
      </section>
      <section class="col col-3">
        <label class="input">State</label>
        <select name="state" class="state form-control col-12 select2" style="width:100%" tabindex="-1" aria-hidden="true"> </select>
      </section>
      <section class="col col-3">
        <label class="input">Zipcode</label>
        <select name="postal_code" class="postal_code col-12 form-control select2" style="width:100%" tabindex="-1" aria-hidden="true"></select>
      </section>
    </div>
  </fieldset>
  <fieldset>
    <table id="table_phone">
      <caption style="color:black;">Phone</caption>
      <input type="hidden" class="form-control primary_phone" name="phone" value="">
      <tbody>
        <tr>
          <td class="hasinput input-phone-tel"></td>
          <td class="hasinput">
            <input class="form-control phone-type input-readonly" value="Primary Phone" readonly>
          </td>
          <td class="hasinput">
            <button type="button" class="btn btn-sm btn-default btnEditPhone fa fa-edit"></button>
          </td>
          <td>
            <span class="padding-10 phone_status"></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <section class="col col-6">
        <label class="label">Fax</label>
        <label class="input "><input class="text-input" type="number" name="fax" value=""> </label>
      </section>
      <section class="col col-6">
        <label class="label">Email</label>
        <label class="input "><input type="email" name="email" value=""> </label>
      </section>
      <section class="col col-6">
        <label class="input">Website</label>
        <div class="input-group" style="display:flex">
          <select id="company_url_protocol" class="form-control" style="width:68px;">
            <option value="http://">http://</option>
            <option value="https://">https://</option>
          </select>
          <input type="text" id="company_url_host" class="form-control input-group-text" value="">
          <button type="button" id="btn_company_open_url" class="btn btn-sm btn-default" onclick="url_company_open()" style="height: 34px;"><i class="fa fa-external-link text-success"></i></button>
        </div>
      </section>
      <section class="col col-6"><label class="label">Company Type</label>
        <div class="inline-group"> <label class="checkbox ">
            <input type="checkbox" name="type" value="Real Estate Broker"><i></i>Real Estate Broker </label>
          <label class="checkbox "><input type="checkbox" name="type" value="Mortgage"><i></i>Mortgage </label>
          <label class="checkbox "><input type="checkbox" name="type" value="Bacle"><i></i>Bacle </label>
          <label class="checkbox "><input type="checkbox" name="type" value="Title"><i></i>Title </label>
          <label class="checkbox "><input type="checkbox" name="type" value="Vendor"><i></i>Vendor<sup class="text-danger">*</sup> </label>
        </div>
      </section>
      <section class="col col-6">
        <label class="input">Company Tags</label>
        <input type="text" class="form-control" id="tag" name="tag">
      </section>
    </div><br>
    <div id="vendor_expand" class="row" style="display:none">
      <section class="col col-6">
        <label class="input">Vendor Type</label>
        <select name="vendor_type" id="vendor_type" class="form-control select2" style="width:100%" multiple>
          <?php
          $list_vendor_type = json_decode(file_get_contents('./data/contact-vendor-type.json'));
                    
          foreach ($list_vendor_type as $item) {
            echo ' <option value="' . $item . '">' . $item . '</option>';
          }
          ?>
        </select>
      </section>
      <section class="col col-6">
        <label class="label">Vendor Note</label>
        <label class="textarea "><textarea class="custom-scroll" rows="3" name="vendor_note" 5=""></textarea> </label>
      </section>
      <div class="clearfix"></div>
    </div>
  </fieldset>
  <footer>
    <button type="button" id="btnSubmitCompany" form="company_form" class="btn btn-primary">Submit</button>
    <button type="button" id="btnBackCompany" class="btn btn-default">Back</button>
  </footer>
</form>