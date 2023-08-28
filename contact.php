<h2 class="padding-10">Add Contact</h2>
<style>
  .input-phone-tel input:read-only:hover {
    cursor: pointer !important;
  }

  .input-phone-tel input {
    margin-bottom: 2px;
  }

  .input-phone-tel a {
    margin: 5px;
  }

  .input-phone-tel {
    min-width: 170px;
  }
</style>
<div id="message_form_contact" role="alert" style="display:none"></div>
<form class="smart-form" id="contact_form" method="post">
  <fieldset>
    <div class="row">
      <section class="col col-6">
        <label class="input">First Name</label>
        <input name="first_name" type="text" class="form-control">
      </section>
    </div>
    <div class="row">
      <section class="col col-6">
        <label class="input">Middle Name</label>
        <input name="middle_name" type="text" class="form-control">
      </section>
    </div>
    <div class="row">
      <section class="col col-6">
        <label class="input">Last Name</label>
        <input name="last_name" type="text" class="form-control">
      </section>
    </div>
    <div class="row">
      <section class="col col-6">
        <label class="input">Company Name</label>
        <select name="company_name" class="form-control" style="width:100%"></select>
      </section>
      <section class="col col-2">
        <label class="label">&nbsp;</label>
        <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" title="Add company" data-target="#add_new_company" data-dismiss="modal" type="button"><i class="fa fa-plus"></i> Add Company</button>
      </section>
    </div>
    <div class="row">
      <section class="col col-6">
        <label class="input">Email</label>
        <input name="primary_email" type="email" class="form-control">
      </section>
    </div>
  </fieldset>
  <fieldset style="z-index: 1">
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
    <div class="row">
      <section class="col col-6">
        <label class="input">Website</label>
        <div class="input-group" style="display:flex">
          <select id="url_protocol" class="form-control" style="width:68px;max-width:68px;">
            <option value="http://">http://</option>
            <option value="https://">https://</option>
          </select>
          <input type="text" id="url_host" class="form-control">
          <button type="button" id="btn_open_url" class="btn btn-sm btn-default"><i class="fa fa-external-link text-success"></i></button>
        </div>
      </section>
    </div>
  </fieldset>
  <fieldset>
    <div class="row">
      <section class="col col-6">
        <label class="input">Address 1</label>
        <input name="primary_street_address1" class="form-control">
      </section>
    </div>
    <div class="row">
      <section class="col col-6">
        <label class="input">Address 2</label>
        <input name="primary_street_address2" class="form-control">
      </section>
    </div>
    <div class="row">
      <section class="col col-4">
        <label class="input">City</label>
        <select name="primary_city" class="form-control city" style="width:100%"></select>
      </section>
      <section class="col col-4">
        <label class="input">State</label>
        <select name="primary_state" class="form-control state" style="width:100%"></select>
      </section>
      <section class="col col-4">
        <label class="input">Postal Code</label>
        <select name="primary_postal_code" class="form-control postal_code" style="width:100%"></select>
      </section>
    </div>
  </fieldset>
  <fieldset>
    <div class="row">
      <section class="col col-6">
        <section class="">
          <label class="input">Tags</label>
          <input type="text" class="form-control" id="contact_tags" name="contact_tags" value="">
        </section>
        <label class="input">Notes</label>
        <label class="textarea">
          <textarea name="contact_notes" rows="5"></textarea>
        </label>
      </section>
    </div>
  </fieldset>
  <footer>
    <button type="submit" id="btnSubmitContact" form="contact_form" class="btn btn-primary">Submit</button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Back</button>
  </footer>
</form>