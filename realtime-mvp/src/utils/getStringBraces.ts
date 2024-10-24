export function getStringBetweenBraces(str: string) {
  var start = 0;
  var end = 0;
  let results = [];
  for (var i = 0; i < str.length; i++) {
    if (str[i] == '{') {
      start = i;
    }
    if (str[i] == '}') {
      end = i;
      let bracesString = str.substring(start + 1, end);
      results.push(bracesString);
    }
  }
  return results;
}
