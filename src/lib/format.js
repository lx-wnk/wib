/**
 *
 * @param jsonData
 * @returns {string}
 */
module.exports.formatJson = (jsonData, subCast = 0) => {
  const me = this;
  let result = '',
    formattedJson= jsonData;

  if (jsonData instanceof Buffer) {
    formattedJson = JSON.parse(jsonData);
  }

  for (const [key, value] of Object.entries(formattedJson)) {
    if (value instanceof Object) {
      subCast++;
      result += key + ':\n';
      result += me.formatJson(value, subCast);
    } else {
      if (0 < subCast) {
        result += '\t'.repeat(subCast);
      }

      result += key + ': \t' + value + '\n';
    }
  }

  return result;
};
