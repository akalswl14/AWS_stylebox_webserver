function check_all_feed(CheckSection, AllCheck) {
    var chk = CheckSection.getElementsByTagName('input');
    for (i = 0; i < chk.length; i++)
        chk[i].checked = AllCheck.checked;
}
function is_checked(elements_name) {
    var checked = false;
    var chk = document.getElementsByClassName(elements_name);
    for (var i = 0; i < chk.length; i++) {
        if (chk[i].checked) {
            checked = true;
        }
    }
    return checked;
}
function fboardlist_submit(f) {
    console.log("FUNCTION!");
    if (!is_checked("chkbox")) {
        alert("check brand to" + document.pressed + "at least one.");
        return false;
    }
    return true;
}
function uncheck() {
    var chkboxList = document.getElementsByClassName('chkbox');
    for (i = 0; i < chkboxList.length; i++) {
        chkboxList[i].checked = false;
    }
}