<title>Enter password</title>
<form name="passForm">
  <div>Enter email password<sup><small style="color:red">*</small></sup>: <span style="color: rgb(235, 46, 46); display:none" id="mypass-error"></span></div>
  <input type="password" name="mypass" id="mypass" style="width:90%; padding:5px; line-height:1.3; display:block; margin-bottom:10px;" required="true" minlength="6">
  <button type="button" onclick="submitPass()" style="padding:6px 10px; border:1px solid white; border-radius:2px; background:#3276b1">OK</button>
</form>

<script>
  function submitPass() {
    var openerWindow = window.opener;
    var value = document.getElementById("mypass").value;
    if (value == '' || value.length < 6) {
      document.getElementById('mypass-error').innerHTML = 'Please enter password least 6 or more characters';
      document.getElementById('mypass-error').style.display = 'block';
      return;
    }
    // openerWindow.document.getElementById("resetPassword").value = document.getElementById("mypass").value;
    openerWindow.passotherpage = document.getElementById("mypass").value;
    window.close();
  }
</script>