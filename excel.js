const Excel = require('exceljs');

const workbook = new Excel.Workbook();
workbook.xlsx.readFile('./assets/dashboard.xlsx')
  .then(()=> {
    const worksheet = workbook.getWorksheet('Fund Data');
    worksheet.eachRow( (row, rowNumber) => {
      if (rowNumber > 5){
        const date = new Date(row.getCell(1).text);
        const income = row.getCell(2).text;
        const growth = row.getCell(3).text;
        const total = row.getCell(4).text; 
        if(!hasEmptyString([date, income, growth, total])){
          const fundData = { date, income, growth, total}
          console.log(fundData);
        }
      }
    })
  });


function getFundData() {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile('./assets/dashboard.xlsx')
      .then(()=> {
        const fundData = [];
        const worksheet = workbook.getWorksheet('Fund Data');
        worksheet.eachRow( (row, rowNumber) => {
          if (rowNumber > 5){
            const date = row.getCell(1).text;
            const income = row.getCell(2).text;
            const growth = row.getCell(3).text;
            const total = row.getCell(4).text; 
            if(!hasEmptyString([date, income, growth, total])){
              fundData.push({ date, income, growth, total});
            }
          }
        })
      });
  })
}


function hasEmptyString(strs){
  const nonEmptyStrs = strs.filter((str) => {
    return str != '';
  });
  return nonEmptyStrs.length != strs.length;
}

module.exports = {
  getFundData,
};