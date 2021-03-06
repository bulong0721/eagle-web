import React from 'react';
import CommonUtil from '../../../utils/commonutil';

const ACTION_KEY = 'singleRecordActions';

const Renders = {

  tableNameSet: new Set(),

  reset() {
    this.tableNameSet.clear();
  },

  bindRender(tableSchema, tableName, manager) {
    const { onClickImage, onSingleRecordUpdate, onSingleRecordDelete, onSingleRecordComponent, fieldMap, primaryKey } = manager;
    if (this.tableNameSet.has(tableName)) {
      return tableSchema;
    }

    tableSchema.forEach(col => {
      const field = fieldMap.get(col.key);
      if (!field) {
        return;
      }
      if (field.render) {
        col.render = field.render.bind(manager);
      }
      else if (field.showType === 'image') {
        col.render = this.getImageRender()(onClickImage);
      } else if (field.showType === 'file') {
        col.render = this.getFileRender;
      } else if (field.key === ACTION_KEY && field.actions && field.actions.length > 0) {
        col.render = this.getActionRender(field, primaryKey)(onSingleRecordUpdate, onSingleRecordDelete, onSingleRecordComponent);
      }
    });

    const ignoreCache = true;
    if (!ignoreCache) {
      this.tableNameSet.add(tableName);
    }
    return tableSchema;
  },

  getImageRender() {
    return onClickImagePreview => text => {
      if (CommonUtil.isString(text)) {
        return <img src={text} alt="图片加载失败" style={{ width: '100%' }} onClick={e => onClickImagePreview(text)} />
      } else if (text instanceof Array) {
        return <img src={text[0]} alt="图片加载失败" style={{ width: '100%' }} onClick={e => onClickImagePreview(text)} />
      }
      return null;
    }
  },

  getFileRender(text) {
    if (CommonUtil.isString(text) && text.length > 0) {
      return <a href={text} target="_blank">{text.substr(text.lastIndexOf('/') + 1)}</a>;
    } else if (text instanceof Array) {
      if (text.length === 0) {
        return null;
      }
      const urlArray = [];
      urlArray.push(<a key={0} href={text[0]} target="_blank">{text[0].substr(text[0].lastIndexOf('/') + 1)}</a>);
      for (let i = 1; i < text.length; i++) {
        urlArray.push(<br key={-1 - i} />);
        urlArray.push(<a key={i} href={text[i]} target="_blank">{text[i].substr(text[i].lastIndexOf('/') + 1)}</a>);
      }
      return <div>{urlArray}</div>;
    }
    return null;
  },

  getActionRender(field, primaryKey) {
    return (singleRecordUpdate, singleRecordDelete, singleRecordComponent) => (text, record) => {
      const actions = field.actions;
      const actionArray = [];
      let lastDivider = false;
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action.visible && !action.visible(record)) {
          continue;
        }
        if (!primaryKey && (action.type === 'update' || action.type === 'delete')) {
          continue;
        }
        if (action.type === 'newLine') {
          if (lastDivider) {
            actionArray.pop();
          }
          actionArray.push(<br key={i} />);
          lastDivider = false;
          continue;
        }
        let tmp;
        switch (action.type) {
          case 'update':
            tmp = <a href="#" key={i} onClick={e => { e.preventDefault(); singleRecordUpdate(record, action.keys); }}>
              {action.name}
            </a>;
            break;
          case 'delete':
            tmp = <a href="#" key={i} onClick={e => { e.preventDefault(); singleRecordDelete(record); }}>
              {action.name}
            </a>;
            break;
          case 'component':
            tmp = <a href="#" key={i} onClick={e => { e.preventDefault(); singleRecordComponent(record, action.component, action.name); }}>
              {action.name}
            </a>;
            break;
          default:
            if (action.render) {
              tmp = <span key={i}>{action.render(record)}</span>;
            }
        }
        if (!tmp) {
          continue;
        }
        actionArray.push(tmp);
        actionArray.push(<span key={-1 - i} className="ant-divider" />);
        lastDivider = true;
      }
      if (lastDivider) {
        actionArray.pop();
      }
      return <span>{actionArray}</span>
    }
  },
};

export default Renders;
export {ACTION_KEY};