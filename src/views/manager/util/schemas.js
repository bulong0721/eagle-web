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
    let querySchema, dataSchema;

    try {
      querySchema = require(`../../../schema/${tableName}.querySchema.js`);
      if (ignoreCache) {
        querySchema = querySchema.map(item => Object.assign({}, item));
      }
    } catch (e) {
      logger.error('load query schema error: %o', e);
    }

    try {
      dataSchema = require(`../../../schema/${tableName}.dataSchema.js`);
      if (ignoreCache) {
        dataSchema = dataSchema.map(item => Object.assign({}, item));
      }
    } catch (e) {
      logger.error('load data schema error: %o', e);
    }

    const toCache = { querySchema, dataSchema };
    if (!ignoreCache) {
      tableMap.set(tableName, toCache);
    }
    return toCache;
  },

  async getRemoteSchema(tableName) {
    const ignoreCache = this.shouldIgnoreSchemaCache(tableName);
    const localSchema = this.getLocalSchema(tableName);

    let querySchema, dataSchema;
    try {
      const res = await Ajax.CRUD(tableName).getRemoteSchema();
      logger.debug('get remote schema for table %s, res = %o', tableName, res);
      if (res.success) {
        querySchema = this.merge(localSchema.querySchema, res.data.querySchema);
        dataSchema = this.merge(localSchema.dataSchema, res.data.dataSchema);
      } else {
        logger.error('getRemoteSchema response error: %o', res);
        this.error(`请求asyncSchema失败: ${res.message}`);
      }
    } catch (e) {
      logger.error('getRemoteSchema network request error: %o', e);
      this.error(`请求asyncSchema时网络失败: ${e.message}`);
    }
    const toCache = { querySchema, dataSchema };
    if (!ignoreCache) {
      tableMap.set(tableName, toCache);
    }
    return toCache;
  },

  merge(local, remote) {
    if (local && remote) {
      const result = local;
      const map = new Map();
      result.forEach(item => map.set(item.key, item));
      remote.forEach(item => {
        if (map.has(item.key)) {
          Object.assign(map.get(item.key), item);
        } else {
          result.push(item);
        }
      });
      return result;
    } else {
      return local || remote;
    }
  },

  error(errorMsg) {
    notification.error({
      message: '出错啦!',
      description: `请联系管理员, 错误信息: ${errorMsg}`,
      duration: 0,
    });
  },

  getTableConfig(tableName) {
    if (configMap.has(tableName)) {
      return configMap.get(tableName);
    }

    let tableConfig;
    try {
      const tmp = require(`../../../schema/${tableName}.config.js`);
      tableConfig = Object.assign({}, globalConfig.DBTable.default, tmp);
    } catch (e) {
      logger.warn('can not find config for table %s, use default instead', tableName);
      tableConfig = Object.assign({}, globalConfig.DBTable.default);
    }

    configMap.set(tableName, tableConfig);
    return tableConfig;
  },

  shouldIgnoreSchemaCache(tableName) {
    const tableConfig = this.getTableConfig(tableName);
    return tableConfig.asyncSchema === true && tableConfig.ignoreSchemaCache === true;
  },
};

export default Schemas;