'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mapper_1 = require('../value-mapper/mapper');
exports.rds = void 0;
const serializeRdsObject = (rdsObject) => {
  var _a;
  return (
    (_a = rdsObject === null || rdsObject === void 0 ? void 0 : rdsObject.sqlStatementResults) !== null && _a !== void 0
      ? _a
      : []
  ).map((statement) => {
    var _a;
    return (
      (_a = statement === null || statement === void 0 ? void 0 : statement.records) !== null && _a !== void 0 ? _a : []
    ).map((record) => {
      const result = {};
      record.forEach((row, index) => {
        var _a, _b, _c;
        result[
          (_b =
            (_a = statement === null || statement === void 0 ? void 0 : statement.columnMetadata) === null ||
            _a === void 0
              ? void 0
              : _a[index]) === null || _b === void 0
            ? void 0
            : _b.name
        ] = row.isNull || row.null ? null : (_c = Object.values(row)) === null || _c === void 0 ? void 0 : _c[0];
      });
      return result;
    });
  });
};
exports.rds = {
  toJsonString: (rdsObject) => {
    try {
      rdsObject = JSON.parse(rdsObject);
      const rdsJson = serializeRdsObject(rdsObject);
      rdsJson.forEach(function (query) {
        if (query[0]) {
          Object.keys(query[0]).forEach(function (key) {
            if (typeof query[0][key] === 'object') {
              query[0][key] = JSON.stringify(query[0][key]);
            }
          });
        }
      });
      return JSON.stringify(rdsJson);
    } catch (_a) {
      return '';
    }
  },
  toJsonObject: (rdsString) => {
    try {
      const rdsObject = JSON.parse(rdsString);
      const rdsSerialized = serializeRdsObject(rdsObject);
      rdsSerialized.forEach(function (query) {
        if (query[0]) {
          Object.keys(query[0]).forEach(function (key) {
            if (typeof query[0][key] === 'object') {
              query[0][key] = JSON.stringify(query[0][key]);
            }
          });
        }
      });
      return mapper_1.map(rdsSerialized);
    } catch (_a) {
      return '';
    }
  }
};
// # sourceMappingURL=rds.js.map
