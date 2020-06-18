$(document).ready(function () {
    $('#crawling_button').click(function () {
        $('#crawling_button').hide();
        $.ajax({
            type: "get",
            url: "http://localhost:3001/firstcrawling"
        });
    });
    $('#checkstatus_button').click(function () {
        $.ajax({
            type: "get",
            timeout: 0,
            url: "/getfeed/crawlingstatus",
            success: function (result) {
                if (result.status == true) {
                    alert('Still crawling');
                } else{
                    alert('Crawling is not running');
                }
            }
        });
    });
});

function check_all(f) {
    var chk = document.getElementsByName("chkbox");
    for (i = 0; i < chk.length; i++)
        chk[i].checked = f.chkall.checked;
}
function is_checked(elements_name) {
    var checked = false;
    var chk = document.getElementsByName(elements_name);
    for (var i = 0; i < chk.length; i++) {
        if (chk[i].checked) {
            checked = true;
        }
    }
    return checked;
}
function fboardlist_submit(f) {
    if(document.pressed == "check crawling"){
        return true;
    }
    if (!is_checked("chkbox")) {
        alert("check brand to" + document.pressed + "at least one.");
        return false;
    }
    return true;
}
function sortTable(n, type) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("brand_table");
    switching = true;
    dir = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == true) {
                if (type == false) {
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;

                    }
                }
            } else if (dir == false) {
                if (type == false) {
                    if (Number(x.innerHTML) < Number(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;

                    }
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == true) {
                dir = false;
                switching = true;
            }
        }
    }
}