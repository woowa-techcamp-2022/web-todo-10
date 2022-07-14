const request = {
  async allLists() {
    const allListData = await (await fetch(`/api/taskcolumns`)).json();
    return allListData;
  },

  async getList(columnId) {
    const listData = await (await fetch(`/api/taskcolumn/${columnId}`)).json();
    return listData;
  },

  async deleteCard(cardId) {
    const requestMessage = makeRequestMessage('DELETE');
    const res = await (
      await fetch(`/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return res;
  },

  async updateCard(cardId, title, details) {
    const requestMessage = makeRequestMessage('PATCH', {
      title,
      details,
    });
    const res = await (
      await fetch(`/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return res;
  },

  async addCard(columnId, title, details) {
    const requestMessage = makeRequestMessage('POST', {
      columnId,
      title,
      details,
    });
    const res = await (await fetch(`/api/taskcard`, requestMessage)).json();
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
      await fetch(`/api/taskcard/${cardId}/move`, requestMessage)
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
