const request = {
  async allLists() {
    const allListData = await (await fetch(`/api/tasklists`)).json();
    return allListData;
  },

  async getList() {
    const listData = await (await fetch('/api/tasklist/:id')).json();
    return listData;
  },

  async deleteCard(cardId, listId) {
    const requestMessage = makeRequestMessage('DELETE', { listId });
    const changedList = await (
      await fetch(`/api/taskcard/${cardId}`, requestMessage)
    ).json();
    return changedList;
  },

  async updateCard(cardId, title, details, listId) {
    console.log(cardId, title, details, listId);
    const requestMessage = makeRequestMessage('PATCH', {
      title,
      details,
      listId,
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
