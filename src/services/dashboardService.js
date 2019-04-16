import Excel from 'exceljs';
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import uuid from 'uuid/v1';
import fundService from './fundService';
import { plus } from '../utils/26bs';

const DASHBOARD_TEMPLATE = path.join(__dirname, '../assets/dashboard.xlsx');


const MONTH_FORMAT = 'mm/yyyy';

const CALENDAR_YEAR_RETURN_START_CELL = { column: 'B', row: 11 };

function setCell(worksheet, cell, value, format='General') {
  worksheet.getCell(cell).value = value;
  worksheet.getCell(cell).numFmt = format;
}


function writeDate(worksheet, startDate, endDate) {
  const formattedStart = moment(startDate).format('DD/MM/YYYY');
  const formattedEnd = moment(endDate).format('DD/MM/YYYY');
  const diff = moment(endDate).diff(moment(startDate), 'month', true);

  setCell(worksheet, 'K5', formattedStart, MONTH_FORMAT);
  setCell(worksheet, 'K6', formattedEnd, MONTH_FORMAT);
  setCell(worksheet, 'K7', parseInt(diff));
}

function writeCalendarYearReturn(worksheet, calendarYearReturn) {
  calendarYearReturn.forEach((fund, index) => {
    const column = plus(CALENDAR_YEAR_RETURN_START_CELL.column, index);
    const row = CALENDAR_YEAR_RETURN_START_CELL.row;

    setCell(worksheet, column + row.toString(), fund.year);
    setCell(worksheet, column + (row + 1).toString(), fund.income);
    setCell(worksheet, column + (row + 2).toString(), fund.growth);
    setCell(worksheet, column + (row + 3).toString(), fund.total);
    setCell(worksheet, column + (row + 4).toString(), fund.index);
    setCell(worksheet, column + (row + 5).toString(), fund.valueAdded);
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

  const tempDir = "/tmp/fund_management";
  if(!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const tempDashboard = `${tempDir}/temp_dashboard_${uuid()}.xlsx`;

  await workbook.xlsx.writeFile(tempDashboard);
  return fs.readFileSync(tempDashboard);
}

export default {
  generateDashboard,
};
