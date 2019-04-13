export default function hasEmptyString(strs) {
  const nonEmptyStrs = strs.filter(str => str !== '');
  return nonEmptyStrs.length !== strs.length;
}
