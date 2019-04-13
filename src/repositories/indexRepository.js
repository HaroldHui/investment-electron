import Excel from 'exceljs';
import hasEmptyString from '../utils/stringUtils';

async function all() {
  const indexes = [];
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile('./assets/dashboard.xlsx');
  const worksheet = workbook.getWorksheet('Index Data');
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 5) {
      const date = new Date(row.getCell(1).text);
      const value = Number(row.getCell(2).text);

      if (!hasEmptyString([date, value])) {
        indexes.push({ date, value });
      }
    }
  });
  return indexes;
}

export default {
  all,
};
