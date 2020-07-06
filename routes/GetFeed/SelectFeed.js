var AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-southeast-1",
});
var docClient = new AWS.DynamoDB.DocumentClient();
var DataList;
var DateList;
var EachEjs_forDate;
var ejsdata;

var selectfeed = {
  getembed: async function (req, res) {
    DataList = [];
    DateList = [];
    EachEjs_forDate = [];
    ejsdata = [];
    var BrandIDList = req.query.brand;
    await GetDateList(BrandIDList);
    MakeEachDateBase(function () {
      AddEjsData(function () {
        EndEjsData(function () {
          renderData(res);
        });
      });
    });
  },
};
function date_ascending(a, b) {
  var dateA = new Date(a).getTime();
  var dateB = new Date(b).getTime();
  return dateA < dateB ? 1 : -1;
}
function renderData(res) {
  var data = { feeddata: ejsdata };
  res.render("GetFeed/ShowEmbedFeed.html", data);
}
function EndEjsData(callback) {
  for (i = 0; i < DateList.length; i++) {
    EachEjs_forDate[i] += "</div></div>";
    ejsdata += EachEjs_forDate[i];
  }
  callback();
}
function AddEjsData(callback) {
  console.log("Datalist's length is " + DataList.length);
  for (i = 0; i < DataList.length; i++) {
    var feedid = DataList[i].FeedID;
    var DownloadNum = DataList[i].DownloadNum;
    var ContentsNum = DataList[i].ContentsNum;
    var Check = DataList[i].Check;
    if (Check == false) {
      var newstatus = "New Feed";
    } else {
      var newstatus = "<br>";
    }
    var date = DataList[i].Date;
    var idx = DateList.indexOf(date);
    var embedurl = "";
    if (feedid[feedid.length - 1] == "/") {
      embedurl = feedid + "embed";
    } else {
      embedurl = feedid + "/embed";
    }
    tmp =
      '<div class="EachEmbed">' +
      '<iframe src="https://www.instagram.com/p/' +
      embedurl +
      '" frameborder="0" scrolling="no"allowtransparency="true"></iframe>' +
      '<div class="NewStatusArea">' +
      newstatus +
      "</div>" +
      '<div class="SelectArea"><div class="DownloadNum">다운로드 : ' +
      DownloadNum +
      "</div>" +
      '<div class="SelectImage">' +
      '<div class="EachCheck">' +
      '<label>All<input type="checkbox" name="chkall" value="1" class="chkbox" onclick="check_all_feed(this.parentNode.parentNode.parentNode,this)"></label></div>';
    for (j = 1; j <= ContentsNum; j++) {
      tmp +=
        '<div class="EachCheck"><label>' +
        "#" +
        j +
        '<input type="checkbox" name="' +
        feedid +
        '" value="' +
        j +
        '" class="chkbox"></label></div>';
    }
    tmp += "</div></div></div>";
    EachEjs_forDate[idx] += tmp;
  }
  callback();
}
function MakeEachDateBase(callback) {
  for (i = 0; i < DateList.length; i++) {
    tmp_ejs =
      '<div class="under_container"><div class="rowdate">' +
      DateList[i] +
      '</div> <div class="row">';
    EachEjs_forDate.push(tmp_ejs);
  }
  callback();
}
async function GetDateList(BrandIDList) {
    let dbData = await scanCrawlingFeedTable(BrandIDList);
    dbData = dbData.Items;
    for (var EachData in dbData) {
        var date = dbData[EachData].Date;
        if (BrandIDList.length > 1 && dbData[EachData].DownloadNum > 0) {
            continue;
        }
        DataList.push(dbData[EachData]);
        if (DateList.includes(date) == false) {
            DateList.push(date)
        }
    }
    DateList.sort(date_ascending);
}
async function scanCrawlingFeedTable(BrandIDList) {
    try {
        var KeysData = {};
        var FilterData = '';
        for (i = 0; i < BrandIDList.length; i++) {
            var brandID = parseInt(BrandIDList[i]);
            var tmp = ':b' + i;
            if (i > 0) {
                FilterData += ' or '
            }
            FilterData += 'brandID = ' + tmp;
            KeysData[tmp] = brandID;
        }
        var params = {
            TableName: 'CrawlingFeed',
            FilterExpression: FilterData,
            ExpressionAttributeValues: KeysData
        };
        let data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
module.exports = selectfeed;