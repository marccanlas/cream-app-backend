'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

var _bluebird = _interopRequireDefault(require('bluebird'));

var _pg = require('pg');

var _promise = _interopRequireDefault(require('mysql2/promise'));

var _mysql = require('mysql2');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const FLAGS = {
  NOT_NULL: 1,
  PRI_KEY: 2,
  UNIQUE_KEY: 4,
  MULTIPLE_KEY: 8,
  BLOB: 16,
  UNSIGNED: 32,
  ZEROFILL: 64,
  BINARY: 128,
  ENUM: 256,
  AUTO_INCREMENT: 512,
  TIMESTAMP: 1024,
  SET: 2048,
  NO_DEFAULT_VALUE: 4096,
  ON_UPDATE_NOW: 8192,
  NUM: 32768
};

const decToBin = (dec) => parseInt((dec >>> 0).toString(2), 2);

const convertMySQLResponseToColumnMetaData = (rows) =>
  rows.map((row) =>
    // @TODO: Add for the following fields
    // arrayBaseColumnType,
    // isCaseSensitive,
    // isCurrency,
    // currency,
    // precision,
    // scale,
    // schemaName,
    ({
      isAutoIncrement: decToBin(row.flags & FLAGS.AUTO_INCREMENT) === FLAGS.AUTO_INCREMENT,
      label: row.name,
      name: row.name,
      nullable: decToBin(row.flags && FLAGS.NOT_NULL) !== FLAGS.NOT_NULL,
      type: row.columnType,
      typeName: Object.keys(_mysql.Types)
        .find((key) => _mysql.Types[key] === row.columnType)
        .toUpperCase(),
      isSigned: decToBin(row.flags & FLAGS.UNSIGNED) !== FLAGS.UNSIGNED,
      autoIncrement: decToBin(row.flags & FLAGS.AUTO_INCREMENT) === FLAGS.AUTO_INCREMENT,
      tableName: row._buf.slice(row._tableStart, row._tableStart + row._tableLength).toString()
    })
  );

const convertSQLResponseToRDSRecords = (rows) => {
  const records = [];
  rows.forEach((dbObject) => {
    const record = [];
    Object.keys(dbObject).forEach((key) => {
      record.push(
        dbObject[key] === null
          ? {
              isNull: true,
              null: true
            }
          : typeof dbObject[key] === 'string'
          ? {
              stringValue: dbObject[key]
            }
          : typeof dbObject[key] === 'number'
          ? {
              longValue: dbObject[key]
            }
          : {
              stringValue: dbObject[key]
            }
      );
    });
    records.push(record);
  });
  return records;
};

const convertPostgresSQLResponseToColumnMetaData = (rows) =>
  rows.map((row) => {
    var _Object$keys$find;

    const typeName =
      (_Object$keys$find = Object.keys(_pg.types.builtins).find((d) => _pg.types.builtins[d] === row.dataTypeID)) !==
        null && _Object$keys$find !== void 0
        ? _Object$keys$find
        : 'UNKNOWN'; // @TODO: Add support for the following fields
    // isAutoIncrement,
    // nullable,
    // isSigned,
    // autoIncrement,
    // tableName,
    // arrayBaseColumnType,
    // isCaseSensitive,
    // isCurrency,
    // currency,
    // precision,
    // scale,
    // schemaName,

    return {
      label: row.name,
      name: row.name,
      type: row.dataTypeID,
      typeName
    };
  });

const injectVariables = (statement, req) => {
  const { variableMap } = req;

  if (!variableMap) {
    return statement;
  }

  const result = Object.keys(variableMap).reduce((statmnt, key) => {
    // Adds 'g' for replaceAll effect
    var re = new RegExp(`${key}(?!_)`, 'g');

    if (
      variableMap[key] === null ||
      variableMap[key] === 'null' ||
      typeof variableMap[key] === 'boolean' ||
      /^\d+$/.test(variableMap[key])
    ) {
      return statmnt.replace(re, `${variableMap[key]}`);
    }

    return statmnt.replace(re, `'${variableMap[key]}'`);
  }, statement);
  return result;
};

const executeSqlStatements = async (client, req) =>
  _bluebird.default.mapSeries(req.statements, async (statement) => {
    statement = injectVariables(statement, req);

    try {
      const result = await client.query(statement);
      return result;
    } catch (error) {
      console.log(`RDS_DATALOADER: Failed to execute: `, statement, error);
      throw error;
    }
  });

class RelationalDataLoader {
  constructor(config) {
    this.config = config;
    this.client = null;
  }

  async getClient() {
    if (this.client) {
      return this.client;
    }

    const requiredKeys = ['dbDialect', 'dbUsername', 'dbPassword', 'dbHost', 'dbName', 'dbPort'];

    if (!this.config.rds) {
      throw new Error('RDS configuration not passed');
    }

    const missingKey = requiredKeys.find((key) => !this.config.rds[key]);

    if (missingKey) {
      throw new Error(`${missingKey} is required.`);
    }

    const dbConfig = {
      host: this.config.rds.dbHost,
      user: this.config.rds.dbUsername,
      password: this.config.rds.dbPassword,
      database: this.config.rds.dbName,
      port: this.config.rds.dbPort
    };
    const res = {};

    if (this.config.rds.dbDialect === 'mysql') {
      this.client = await _promise.default.createConnection(dbConfig);
    } else if (this.config.rds.dbDialect === 'postgres') {
      this.client = new _pg.Client(dbConfig);
      await this.client.connect();
    }

    return this.client;
  }

  async load(req) {
    try {
      const client = await this.getClient();
      const res = {};
      const results = await executeSqlStatements(client, req);

      if (this.config.rds.dbDialect === 'mysql') {
        res.sqlStatementResults = results.map((result) => {
          if (result.length < 2) {
            return {};
          }

          if (!result[1]) {
            // not a select query
            return {
              numberOfRecordsUpdated: result[0].affectedRows,
              generatedFields: []
            };
          }

          return {
            numberOfRecordsUpdated: result[0].length,
            records: convertSQLResponseToRDSRecords(result[0]),
            columnMetadata: convertMySQLResponseToColumnMetaData(result[1])
          };
        });
      } else if (this.config.rds.dbDialect === 'postgres') {
        res.sqlStatementResults = results.map((result) => ({
          numberOfRecordsUpdated: result.rowCount,
          records: convertSQLResponseToRDSRecords(result.rows),
          columnMetadata: convertPostgresSQLResponseToColumnMetaData(result.fields),
          generatedFields: []
        }));
      }

      return JSON.stringify(res);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

exports.default = RelationalDataLoader;
