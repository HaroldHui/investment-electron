export function plus(code, num) {
  return convertDSTo26BS(concert26BSToDS(code) + parseInt(num))
}

function convertDSTo26BS(num) {
  let code = '';
  while (num > 0) {
    let m = num % 26;
    if (m == 0) {
      m = 26
    }
    code = String.fromCharCode(64 + parseInt(m)) + code;
    num = (num - m) / 26;
  }
  return code;

}

function concert26BSToDS(code) {
  let num = 0;
  for (let i = code.length - 1, j = 1; i >= 0; i-- , j *= 26) {
    num += (code[i].charCodeAt() - 64) * j;
  }
  return num;

}

export default {
  plus,
  concert26BSToDS,
  convertDSTo26BS,
}
