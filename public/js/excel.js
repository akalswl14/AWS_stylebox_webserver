function fboardlist_submit() {
  var fileCheck = document.getElementById("myfile").value;
  if (!fileCheck) {
    alert("Please attach a file");
    return false;
  }
  return true;
}
