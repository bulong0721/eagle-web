import Ajax from '../utils/ajax';

export async function select(params) {
  const ajax = new Ajax().CRUD('user');
  return await ajax.select(params);
}