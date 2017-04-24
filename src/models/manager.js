import { query, save } from '../services/manager';

export default {
  namespace: 'manager',

  state: {
    componentVisible: false,
    modalVisible: false,
    modalTitle: '新增',
    modalAction: '',
    modalInsert: true,
    selectedRowKeys: [],
    dataSource: [],
    previewVisible: false,
    previewImages: [],
    componentModalVisible: false,
    modalFormData: {},
    popupEditor: true,
    expand: false,
  },

  subscriptions: {
  },

  effects: {
    *query({ tableName, payload }, { call, put }) {
      const data = yield call(query, tableName, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.rows
          }
        });
      }
    },
    *save({ tableName, payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      const success = yield call(save, tableName, payload);
    }
  },

  reducers: {
    querySuccess(state, action) {
      return {
        ...state,
        dataSource: action.payload.data
      };
    },
    handleToggle(state, action) {
      return {
        ...state,
        expand: !state.expand
      };
    },
    selectChange(state, action) {
      return {
        ...state,
        selectedRowKeys: action.payload
      }
    },
    showEditor(state, action) {
      return {
        ...state,
        popupEditor: true,
        modalVisible: true,
        modalTitle: action.title,
        modalAction: action.action,
        modalFormData: action.payload
      }
    },
    showComponent(state, action) {
      return {
        ...state,
        popupEditor: false,
        componentVisible: true,
        modalTitle: action.title,
        modalFormData: action.payload
      }
    },
    hideModal(state, action) {
      return {
        ...state,
        componentVisible: false,
        modalVisible: false,
        modalFormData: {}
      };
    },
  }
}