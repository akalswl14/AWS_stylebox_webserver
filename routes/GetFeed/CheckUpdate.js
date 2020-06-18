var fs = require('fs')

var date = new Date();
var year = date.getFullYear();
var month = new String(date.getMonth() + 1);
var day = new String(date.getDate());

if (month.length == 1) {
    month = "0" + month;
}
if (day.length == 1) {
    day = "0" + day;
}
TodayDate = year + '-' + month + '-' + day;

var checkupdate = {
    checkstatus: function (req, res) {
        var par = JSON.parse(fs.readFileSync('public/json/LastUpdateDate.json', 'utf8'));
        if (par['crawlingstatus'] == true) {
            res.send({ status: true });
        } else {
            res.send({ status: false });
        }
    }
};
module.exports = checkupdate;