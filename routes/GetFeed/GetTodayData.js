var AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-southeast-1",
});
var docClient = new AWS.DynamoDB.DocumentClient();
var GetData = {
  renderdata: async function (req, res) {
    var data = { todaydata: "", lastupdatedate: "", icondata: "" };
    // <LastUpdateDate> 테이블에서 getItem으로 데이터 가져오기.
    let dbData = await checkLastUpdateDateTable();
    dbData = dbData.Item;
    data.lastupdatedate = dbData.lastupdatedate;
    if (
      dbData.crawlingstatus == true ||
      dbData.lastupdatedate == GetTodayDate()
    ) {
      data.icondata =
        '<button id="crawling_button" type="button" style="display:none"><i class="fa fa-refresh"></i></button>';
    } else {
      data.icondata =
        '<button id="crawling_button" type="button"><i class="fa fa-refresh"></i></button>';
    }
    // <BrandInfo> 테이블에서 scan으로 전체 데이터 가져오기
    dbData = await scanallBrandInfoTable();
    dbData = dbData.Items;
    var brandLength = Object.keys(dbData).length;
    var jsondata = "";
    // Add Brand Information as array to dataArray
    for (var i = 0; i < brandLength; i++) {
      var reviewst_jsondata = "";
      if (dbData[i].ReviewStatus == "Y") {
        reviewst_jsondata =
          '<td class="YesStatus">' + dbData[i].ReviewStatus + "</td>";
      } else {
        reviewst_jsondata =
          '<td class="NoStatus">' + dbData[i].ReviewStatus + "</td>";
      }
      var insta_url = "http://www.instagram.com/" + dbData[i].instaID;
      jsondata +=
        "<tr>" +
        '<td class="td_chk"><input type="checkbox" name="chkbox" value=' +
        dbData[i].brandID +
        "></td>" +
        "<td>" +
        dbData[i].brandName +
        "</td>" +
        "<td>" +
        dbData[i].UpdateFeedNum +
        "</td>" +
        "<td>" +
        dbData[i].TodayDownloadNum +
        "</td>" +
        "<td>" +
        dbData[i].FeedNum +
        "</td>" +
        "<td>" +
        dbData[i].NewFeedNum +
        "</td>" +
        "<td>" +
        dbData[i].DownloadNum +
        "</td>" +
        "<td>" +
        dbData[i].FollowerNum +
        "</td>" +
        "<td>" +
        '<a href="' +
        insta_url +
        '" class="fa fa-instagram"></a>' +
        "</td>" +
        reviewst_jsondata +
        "<td>" +
        dbData[i].Comment +
        "</td>" +
        "</tr>";
    }
    data.todaydata = jsondata;
    //  Rendering ejs with dataArrary
    res.render("GetFeed/TodayFeed.html", data);
  },
};
async function checkLastUpdateDateTable() {
  try {
    var params = {
      TableName: "LastUpdateDate",
      Key: {
        No: 1,
      },
    };
    let data = await docClient.get(params).promise();
    return data;
  } catch (err) {
    console.log(err);
  }
}
async function scanallBrandInfoTable() {
  try {
    var params = {
      TableName: "BrandInfo",
    };
    let data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    console.log(err);
  }
}
function GetTodayDate() {
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
  var TodayDate = year + "-" + month + "-" + day;
  return TodayDate;
}
module.exports = GetData;
