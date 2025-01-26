import axios from 'axios';

const API_URL = 'http://localhost:3001';


export const fetchLists = () => async (dispatch) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await axios.get(`${API_URL}/shoppingLists`);
    dispatch({ type: 'FETCH_LISTS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error fetching lists' });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const createList = (listName) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/shoppingLists`, { name: listName, items: [] });
    dispatch({ type: 'CREATE_LIST', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error creating list' });
  }
};

export const updateList = (listId, updatedData) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/shoppingLists/${listId}`, updatedData);
    dispatch({ type: 'UPDATE_LIST', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error updating list' });
  }
};

export const deleteList = (listId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/shoppingLists/${listId}`);
    dispatch({ type: 'DELETE_LIST', payload: listId });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error deleting list' });
  }
};

export const setCurrentList = (listId) => async (dispatch) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await axios.get(`${API_URL}/shoppingLists/${listId}`);
    dispatch({ type: 'SET_CURRENT_LIST', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error fetching list' });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const addItem = (listId, item) => async (dispatch) => {
  try {
    const listResponse = await axios.get(`${API_URL}/shoppingLists/${listId}`);
    const currentList = listResponse.data;
    const updatedItems = [...(currentList.items || []), { ...item, id: Date.now().toString() }];

    const response = await axios.put(`${API_URL}/shoppingLists/${listId}`, {
      ...currentList,
      items: updatedItems,
    });

    dispatch({ type: 'ADD_ITEM', payload: response.data.items[response.data.items.length - 1] });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error adding item' });
  }
};

export const updateItem = (listId, updatedItem) => async (dispatch) => {
  try {
    const listResponse = await axios.get(`${API_URL}/shoppingLists/${listId}`);
    const currentList = listResponse.data;

    const updatedItems = currentList.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );

    await axios.put(`${API_URL}/shoppingLists/${listId}`, {
      ...currentList,
      items: updatedItems,
    });

    dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error updating item' });
  }
};

export const updateListName = (listId, newName) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/shoppingLists/${listId}`, { name: newName });
    dispatch({ type: 'UPDATE_LIST_NAME', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error updating list name' });
  }
};

export const deleteItem = (listId, itemId) => async (dispatch) => {
  try {
    const listResponse = await axios.get(`${API_URL}/shoppingLists/${listId}`);
    const currentList = listResponse.data;

    const updatedItems = currentList.items.filter(item => item.id !== itemId);

    await axios.put(`${API_URL}/shoppingLists/${listId}`, {
      ...currentList,
      items: updatedItems,
    });

    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error deleting item' });
  }
};

export const shareList = (listId, userId) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/shoppingLists/${listId}/share`, { userId });
    dispatch({ type: 'SHARE_LIST', payload: { listId, userId } });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Error sharing list' });
  }
};
