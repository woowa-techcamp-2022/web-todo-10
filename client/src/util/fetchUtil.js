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
    const changedList = await (
      await fetch(`/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return changedList;
  },

  async updateCard(cardId, title, details) {
    const requestMessage = makeRequestMessage('PATCH', {
      title,
      details,
    });
    const changedList = await (
      await fetch(`/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return changedList;
  },

  async addCard(listId, title, details) {
    const requestMessage = makeRequestMessage('POST', {
      listId,
      title,
      details,
    });
    const updatedColumnState = await (
      await fetch(`/api/taskcard`, requestMessage)
    ).json();
    return updatedColumnState;
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
