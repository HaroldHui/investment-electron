import _ from 'lodash';
import fundRepository from '../repositories/fundRepository';
import indexRepository from '../repositories/indexRepository';

function sumOfMap(original, key) {
  return original.reduce((sum, obj) => sum + (obj[key] || 0), 0);
}

function oneYearReturn(funds, indexes, year) {
  const fundsOfYear = funds.filter(fund => fund.date.getFullYear() === year);
  const indexesOfYear = indexes.filter(index => index.date.getFullYear() === year);
  const income = sumOfMap(fundsOfYear, 'income');
  const growth = sumOfMap(fundsOfYear, 'growth');
  const total = sumOfMap(fundsOfYear, 'total');
  const index = sumOfMap(indexesOfYear, 'value');
  const valueAdded = total - index;
  return {
    year, income, growth, total, index, valueAdded,
  };
}

export async function calendarYearReturn(fundFilePath, startDate, endDate) {
  const [funds, indexes] = await Promise.all([fundRepository.all(fundFilePath), indexRepository.all(fundFilePath)]);
  return _.range(startDate.getFullYear(), endDate.getFullYear())
    .map(year => oneYearReturn(funds, indexes, year));
}


export default {
  calendarYearReturn,
};
