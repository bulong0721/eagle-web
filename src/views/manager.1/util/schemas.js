import React from 'react';
import { notification } from 'antd';
import Logger from '../../../utils/logger';
import Ajax from '../../../utils/ajax';
import globalConfig from '../../../config';

const tableMap = new Map();
const configMap = new Map();
const logger = Logger.getLogger('TableUtil');

const Schemas = {
  getCacheSchema(tableName) {
    return tableMap.get(tableName);
  },

  getLocalSchema(tableName) {
    const ignoreCache = this.shouldIgnoreSchemaCache(tableName);
    let schema;
    try {
      schema = require(`../../../schema/${tableName}.schema.js`);
      if (ignoreCache) {
        schema = querySchema.map(item => Object.assign({}, item));
      }
    } catch (e) {
      logger.error('load query schema error: %o', e);
    }
    if (!ignoreCache) {
      tableMap.set(tableName, schema);
    }
    return toCache;
  },

  shouldIgnoreSchemaCache(tableName) {
    const tableConfig = this.getTableConfig(tableName);
    return tableConfig.asyncSchema === true && tableConfig.ignoreSchemaCache === true;
  },
};

export default Schemas;