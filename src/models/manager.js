import { select } from '../services/manager';

export default {
  namespace: 'manager',

  state: {
    modalVisible: false,
    modalTitle: '新增',
    modalInsert: true,
    selectedRowKeys: [],
    dataSource: [],
    previewVisible: false,
    previewImages: [],
    componentModalVisible: false,
    expand: false,
  },

  subscriptions: {
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(select, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.rows
          }
        });
      }
    }
  },

  reducers: {
    querySuccess(state, action) {
      return {
        ...state,
        dataSource: action.payload.data
      };
    },
    hideModal(state, action) {
      return {
        ...state,
        modalVisible: false
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
    handleInsert(state, action) {
      return {
        ...state,
        modalVisible: true,
        modalTitle: '新增',
        modalInsert: true
      }
    },
    handleUpdate(state, action) {
      return {
        ...state,
        modalVisible: true,
        modalTitle: '更新',
        modalInsert: false
      }
    },
  }
}