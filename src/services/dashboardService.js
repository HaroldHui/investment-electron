import Excel from 'exceljs';
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import fundService from './fundService';
import { plus } from '../utils/26bs';

const DASHBOARD_TEMPLATE = path.join(__dirname, '../assets/dashboard.xlsx');
const TEMP_DASHBOARD = path.join(__dirname, '../assets/temp_dashboard.xlsx');

const CALENDAR_YEAR_RETURN_START_CELL = { column: 'B', row: 11 };


function writeDate(worksheet, startDate, endDate) {
  const formattedStart = moment(startDate).format('DD/MM/YYYY');
  const formattedEnd = moment(endDate).format('DD/MM/YYYY');
  const diff = moment(endDate).diff(moment(startDate), 'month', true);
  worksheet.getCell('K5').value = formattedStart;
  // worksheet.getCell('K5').fill = {
  //   type: Excel.ValueType.Date
  // };
  worksheet.getCell('K6').value = formattedEnd;
  // worksheet.getCell('K6').fill = {
  //   type: Excel.ValueType.Date
  // };
  worksheet.getCell('K7').value = diff;
  // worksheet.getCell('K7').fill = {
  //   type: Excel.ValueType.String
  // };
}

function writeCalendarYearReturn(worksheet, calendarYearReturn) {
  calendarYearReturn.forEach((fund, index) => {
    const column = plus(CALENDAR_YEAR_RETURN_START_CELL.column, index);
    const row = CALENDAR_YEAR_RETURN_START_CELL.row;
    worksheet.getCell(column + row.toString()).value = fund.year;
    worksheet.getCell(column + (row + 1).toString()).value = fund.income;
    worksheet.getCell(column + (row + 2).toString()).value = fund.growth;
    worksheet.getCell(column + (row + 3).toString()).value = fund.total;
    worksheet.getCell(column + (row + 4).toString()).value = fund.index;
    worksheet.getCell(column + (row + 5).toString()).value = fund.valueAdded;
  });

}

export async function generateDashboard(fundFilePath, startDate, endDate) {
  const workbook = new Excel.Workbook();
  const [, calendarYearReturn] = await Promise.all([
    workbook.xlsx.readFile(DASHBOARD_TEMPLATE),
    fundService.calendarYearReturn(fundFilePath, startDate, endDate),
  ]);
  const worksheet = workbook.getWorksheet('Dashboard');

  writeDate(worksheet, startDate, endDate);
  writeCalendarYearReturn(worksheet, calendarYearReturn);

  if (fs.existsSync(TEMP_DASHBOARD)) {
    fs.unlinkSync(TEMP_DASHBOARD);
  }
  await workbook.xlsx.writeFile(TEMP_DASHBOARD);
  return fs.readFileSync(TEMP_DASHBOARD);
}

export default {
  generateDashboard,
};
