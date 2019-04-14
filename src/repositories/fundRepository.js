import Excel from 'exceljs';
import hasEmptyString from '../utils/stringUtils';

async function all(fundFilePath) {
  const funds = [];
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(fundFilePath);
  const worksheet = workbook.getWorksheet('Fund Data');
  worksheet.getCell('A1').value = 'test test';
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 5) {
      const date = new Date(row.getCell(1).text);
      const income = Number(row.getCell(2).text);
      const growth = Number(row.getCell(3).text);
      const total = Number(row.getCell(4).text);

      if (!hasEmptyString([date, income, growth, total])) {
        funds.push({
          date, income, growth, total,
        });
      }
    }
  });
  return funds;
}

export default {
  all,
};
