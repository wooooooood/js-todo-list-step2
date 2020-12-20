import {KEY, DEFAULT_USER} from './constants.js';
import {Api} from './Api.js';

export default function TodoList($todoList, {updateData, removeItem, editItem, refreshItems}) {
  this.$todoList = $todoList;
  this.userId = DEFAULT_USER._id;
  this.data = [];

  this.editItem = (index, text) => {
    this.data[index].text = text;
    this.render();
    this.bindEvents();
  };

  this.setState = async (activeUserId) => {
    this.userId = activeUserId;
    this.data = await Api.GetTodoItems(this.userId);
    this.render();
    this.bindEvents();

    // updateData(this.data);
  };

  this.updateItem = (nextData) => {
    this.data = [...nextData];
    this.setState();
  };

  this.bindEvents = () => {
    document.querySelectorAll('.todo-item').forEach(($item) => {
      $item.addEventListener('click', ({target}) => {
        if (target.tagName === 'INPUT' && target.classList.contains('toggle')) {
          const $todoItem = target.closest('.todo-item');
          const {index} = $todoItem.dataset;
          const item = this.data[index];
          const isCompleted = !$todoItem.classList.contains('completed');
          item.isCompleted = isCompleted;
          $todoItem.classList[isCompleted ? 'add' : 'remove']('completed');
        }

        if (target.classList.contains('destroy')) {
          const {index} = target.closest('.todo-item').dataset;
          removeItem(Number(index));
        }

        refreshItems();
      });

      $item.addEventListener('dblclick', ({target}) => {
        const $todoItem = target.closest('.todo-item');
        const {index} = target.closest('.todo-item').dataset;
        const oldValue = target.innerText;

        $todoItem.classList.add('editing');
        $todoItem.querySelector('.edit').focus();
        $todoItem.querySelector('.edit').setSelectionRange(oldValue.length, oldValue.length);
        $todoItem.addEventListener('keyup', ({key, target}) => {
          if (key === KEY.ESC) {
            target.value = oldValue;
            $todoItem.classList.remove('editing');
          } else if (key === KEY.ENTER) {
            editItem(index, target.value);
          }
        });
      });

      $item.addEventListener('focusout', ({target}) => {
        target.closest('.todo-item').classList.remove('editing');
      });
    });
  };
  this.post = async (text) => {
    await Api.AddItem(this.userId, text);
    this.data = await Api.GetTodoItems(this.userId);
    this.setState(this.userId);
  };

  this.delete = async (_id) => {
    await Api.DeleteItem(this.userId, _id);
    this.data = await Api.GetTodoItems(this.userId);
    this.setState(this.userId);
  };

  this.toggle = async (_id) => {
    await Api.ToggleItem(this.userId, _id);
  };

  this.edit = async (_id, text) => {
    await Api.EditItem(this.userId, _id, text);
    this.data = await Api.GetTodoItems(this.userId);
    this.setState(this.userId);
  };

  this.render = () => {
    this.$todoList.innerHTML = this.data.map(({text, isCompleted}, index) => `
      <li class="todo-item ${isCompleted? 'completed' : ''}" data-index="${index}">
        <div class="view">
          <input class="toggle" type="checkbox" ${isCompleted? 'checked' : ''} />
          <label class="label">${text}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${text}" />
      </li>
    `).join('');
  };

  this.setState(this.userId);
};
