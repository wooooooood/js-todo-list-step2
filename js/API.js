import {ADDRESS} from './constants.js';

export const Api = {
  GetUsers: async () => {
    try {
      const response = await fetch(`${ADDRESS}/api/users`, ApiOptions.GET());
      return await response.json();
    } catch (e) {
      console.error(e);
    }

    return [];
  },
  GetTodoItems: async (userId) => {
    try {
      const response = await fetch(`${ADDRESS}/api/users/${userId}/items`, ApiOptions.GET());
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error(e);
    }
    
    return [];
  },
  AddUser: (userName) => fetch(`${ADDRESS}/api/users`, ApiOptions.POST({name: userName})),
  AddItem: (userId, contentText) => fetch(`${ADDRESS}/api/users/${userId}/items`, ApiOptions.POST({contents: contentText})),
  DeleteItem: (userId, itemId) => fetch(`${ADDRESS}/api/users/${userId}/items/${itemId}`, ApiOptions.DELETE()),
  ToggleItem: (userId, itemId) => fetch(`${ADDRESS}/api/users/${userId}/items/${itemId}/toggle`, ApiOptions.TOGGLE()),
  EditItem: (userId, itemId, newContentText) => fetch(`${ADDRESS}/api/users/${userId}/items/${itemId}`, ApiOptions.EDIT({contents: newContentText})),
};

export const ApiOptions = {
  GET: () => ({ method: 'GET' }),
  DELETE: () => ({ method: 'DELETE' }),
  TOGGLE: () => ({ method: 'PUT' }),
  EDIT: data => ({ ...ApiOptions.BODY(data), method: 'PUT' }),
  POST: data => ({ ...ApiOptions.BODY(data), method: 'POST' }),
  BODY: data => ({
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  }),
};
