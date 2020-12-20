import {DEFAULT_USER, FilterOptions} from './constants.js';
import TodoList from './TodoList.js';
import TodoInput from './TodoInput.js';
import TodoCount from './TodoCount.js';
import TodoFilter from './TodoFilter.js';
import TodoUser from './TodoUser.js';

function App() {
  const $todoInput = document.querySelector('.new-todo');
  const $todoList = document.querySelector('.todo-list');
  const $todoCount = document.querySelector('.todo-count');
  const $todoFilter = document.querySelector('.filters');
  const $userTitle = document.querySelector('#user-title');
  const $userList = document.querySelector('#user-list');
  const $userCreateButton = document.querySelector('.user-create-button');

  this.state = {
    userID: DEFAULT_USER.ID,
    activeFilterType: FilterOptions.ALL,
    data: []
  }

  this.setState = (activeUserId) => {
    this.state.userId = activeUserId;
    todoList.setState(this.state.userId);
  };

  this.updateData = (data) => {
    this.state.data = [...data];
  }

  this.addItem = (text) => {
    todoList.post(text);

    this.filterItems(this.state.activeFilterType);
  };

  this.removeItem = (filteredIndex) => {
    const item = this.getFilteredItem()[filteredIndex];
    const index = this.state.data.findIndex((v) => v === item);
    this.state.data.splice(index, 1);
    this.filterItems(this.state.activeFilterType);
  };

  this.editItem = (filteredIndex, text) => {
    const item = this.getFilteredItem()[filteredIndex];
    const index = this.state.data.findIndex((v) => v === item);
    this.state.data[index].text = text;
    this.filterItems(this.state.activeFilterType);
  };

  this.refreshItems = () => {
    this.filterItems(this.state.activeFilterType);
  };

  this.filterItems = (type) => {
    this.state.activeFilterType = type;
    todoList.updateItem(this.getFilteredItem());
    todoCount.render(this.getFilteredItem().length);
  };

  this.getFilteredItem = () =>
    this.state.data.filter(({isCompleted}) =>
      (this.state.activeFilterType === FilterOptions.ALL) ||
      (this.state.activeFilterType === FilterOptions.COMPLETED && isCompleted) ||
      (this.state.activeFilterType === FilterOptions.ACTIVE && !isCompleted));


  const todoList = new TodoList($todoList, this.state.data, {
    updateData: (data) => this.updateData(data),
    removeItem: (index) => this.removeItem(index),
    editItem: (index, text) => this.editItem(index, text),
    refreshItems: () => this.refreshItems(),
  });
  const todoInput = new TodoInput($todoInput, (text) => {
    this.addItem(text);
  });

  const todoCount = new TodoCount($todoCount, this.state.data.length);
  const todoUser = new TodoUser($userTitle, $userCreateButton, $userList, this.state.userId, (activeUserId) => {
    this.setState(activeUserId);
  });

  this.todoFilter = new TodoFilter($todoFilter, this.state, (type) => {
    this.filterItems(type);
  });

  this.refreshItems();
}

new App();
