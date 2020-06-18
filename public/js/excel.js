function fboardlist_submit() {
    var fileCheck = document.getElementById("myfile").value;
    if (!fileCheck) {
        alert("Please attach a file");
        return false;
    }
    return true;
}
function readExcel() {
    let input = event.target;
    let reader = new FileReader();
    var json_data = {}
    reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });

        workBook.SheetNames.forEach(function (sheetName) {
            console.log('SheetName: ' + sheetName);

            let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            json_data[sheetName] = JSON.stringify(rows);
            console.log(json_data[sheetName]);
        })
    };
    document.getElementById("myfile").value = json_data
    reader.readAsBinaryString(input.files[0]);
}