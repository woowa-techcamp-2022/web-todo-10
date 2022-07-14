const URL =
  process.env.NODE_ENV === 'development'
    ? 'localhost:5001'
    : 'http://3.38.160.215:5001';

const request = {
  async allLists() {
    const allListData = await (await fetch(`${URL}/api/taskcolumns`)).json();
    return allListData;
  },

  async getList(columnId) {
    const listData = await (
      await fetch(`${URL}/api/taskcolumn/${columnId}`)
    ).json();
    return listData;
  },

  async getLog() {
    const logData = await (await fetch(`${URL}/api/log`)).json();
    return logData;
  },

  async deleteCard(cardId) {
    const requestMessage = makeRequestMessage('DELETE');
    const res = await (
      await fetch(`${URL}/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return res;
  },

  async updateCard(cardId, title, details) {
    const requestMessage = makeRequestMessage('PATCH', {
      title,
      details,
    });
    const res = await (
      await fetch(`${URL}/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return res;
  },

  async addCard(columnId, title, details) {
    const requestMessage = makeRequestMessage('POST', {
      columnId,
      title,
      details,
    });
    const res = await (
      await fetch(`${URL}/api/taskcard`, requestMessage)
    ).json();
    return res;
  },

  async moveCard(cardId, originalColumnId, newColumnId, originalIdx, newIdx) {
    const requestMessage = makeRequestMessage('PATCH', {
      originalColumnId,
      newColumnId,
      originalIdx,
      newIdx,
    });
    const res = await (
      await fetch(`${URL}/api/taskcard/${cardId}/move`, requestMessage)
    ).json();
    return res;
  },
};

const makeRequestMessage = (methodType, requestBody) => {
  return {
    method: methodType,
    body: JSON.stringify(requestBody),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  };
};

export default request;
