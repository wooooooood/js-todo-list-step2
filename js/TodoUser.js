import {Api} from './Api.js';
import {DEFAULT_USER} from './constants.js';

export default function TodoUser($userTitle, $userCreateButton, $userList, userId, setActiveUser) {
  this.$userTitle = $userTitle;
  this.$userList = $userList;
  this.$userCreateButton = $userCreateButton;
  this.userName = DEFAULT_USER.name;
  this.userId = userId;
  this.userList = [];

  const onUserCreateHandler = async () => {
    const userName = prompt('추가하고 싶은 이름을 입력해주세요. (2글자 이상)');
    if (userName.length < 2){
      alert('2글자 이상의 이름을 입력해 주세요!');
      return;
    }

    await Api.AddUser(userName);
    this.setState(this.userId);
  };

  this.setState = async (activeUserId) => {
    this.userId = activeUserId;
    this.userList = await Api.GetUsers();
    this.render();
    this.bindEvents();
  };

  this.bindEvents = () => {
    document.querySelectorAll('.ripple').forEach(($item) => {
      $item.addEventListener('click', ({target}) => {
        if (target.classList.contains('user-create-button')) {
          onUserCreateHandler();
        } else {
          this.userName = target.innerText;
          this.userId = target.id;
          setActiveUser(this.userId);
        }
        this.setState(this.userId);
      });
    });
  };

  this.render = () => {
    this.$userTitle.innerHTML = `<span><strong>${this.userName}</strong>'s Todo List</span>`;
    this.$userList.innerHTML = this.userList.map(({name, _id}) =>
      `<button class="ripple ${this.userId === _id && 'active'}" id=${_id}>${name}</button>`,
    ).join('') + `<button class="ripple user-create-button">+ 유저 생성</button>`;
  };

  this.setState(this.userId);
}
