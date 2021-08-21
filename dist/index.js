"use strict";
var Modals;
(function (Modals) {
    Modals["Edit"] = "edit-modal";
    Modals["Delete"] = "delete-modal";
})(Modals || (Modals = {}));
const listUl = document.querySelector('#list');
const doneListUl = document.querySelector('#done-list');
const form = document.querySelector('#form');
const newTitle = document.querySelector('#new-title');
const newDescription = document.querySelector('#new-description');
let list = [];
let currentItemId;
const getCurrentItem = (id) => list.find(item => item.id === id);
const getCurrentIndex = (id) => list.findIndex(item => item.id === id);
const onEditItem = (id) => {
    currentItemId = id;
    const currentItem = getCurrentItem(id);
    if (currentItem) {
        newTitle.value = currentItem.title;
        newDescription.value = currentItem.description || '';
    }
};
const onDeleteItem = (id) => {
    currentItemId = id;
};
const onToggleCheckbox = (id) => {
    const currentIndex = getCurrentIndex(id);
    list[currentIndex].isDone = !list[currentIndex].isDone;
    render();
    saveTodo(list);
};
const todoItemTemplate = ({ id, title, description, isDone }) => {
    const editBtn = `<div class="cursor-pointer ms-2"><i class="fas fa-pen" onclick="onEditItem(${id})" data-bs-toggle="modal" data-bs-target="#${Modals.Edit}"></i></div>`;
    const deleteBtn = `<div class="cursor-pointer text-danger ms-2"><i class="fas fa-trash" onclick="onDeleteItem(${id})" data-bs-toggle="modal" data-bs-target="#${Modals.Delete}"></i></div>`;
    return `<li class="list-group-item d-flex justify-content-between">
                <div class="d-flex align-items-center">
                    <input
                        name="checkbox_${id}"
                        type="checkbox"
                        class="me-2"
                        onchange="onToggleCheckbox(${id})"
                        ${isDone && 'checked="checked"'}
                    >
                    <div class="d-flex align-items-center ${isDone ? 'text-decoration-line-through' : ''}">
                        ${title}${description ? ' - ' + description : ''}
                    </div>
                <div>
                
                <div class="d-flex align-items-center">
                    ${!isDone ? editBtn : ''}
                    ${deleteBtn}
                </div>
            </li>`;
};
const confirmEditItem = () => {
    closeModal(Modals.Edit);
    const currentIndex = getCurrentIndex(currentItemId);
    list[currentIndex] = Object.assign(Object.assign({}, list[currentIndex]), { title: newTitle.value, description: newDescription.value });
    render();
    saveTodo(list);
};
const confirmDeleteItem = () => {
    closeModal(Modals.Delete);
    const currentIndex = getCurrentIndex(currentItemId);
    list.splice(currentIndex, 1);
    render();
    saveTodo(list);
};
const closeModal = (id) => {
    var _a;
    const backdrop = document.querySelector('.modal-backdrop');
    (_a = backdrop.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(backdrop);
    const body = document.querySelector('body');
    body.removeAttribute('style');
    body.classList.remove('modal-open');
    const modal = document.querySelector(`#${id}`);
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    modal.classList.remove('show');
};
const onCreate = () => {
    const titleInput = document.querySelector('#title');
    const descriptionInput = document.querySelector('#description');
    addTodo({ title: titleInput.value, description: descriptionInput.value });
};
const saveTodo = (items) => {
    localStorage.setItem('list', JSON.stringify(items));
};
const addTodo = ({ title, description }) => {
    const lastId = list[list.length - 1].id;
    list.push({ id: lastId + 1, title, description, isDone: false });
    saveTodo(list);
    render();
};
const init = () => {
    const savedList = localStorage.getItem('list');
    list = savedList ? JSON.parse(savedList) : [];
    render();
};
const render = () => {
    const doneList = list.filter(item => item.isDone);
    const notDoneList = list.filter(item => !item.isDone);
    listUl.innerHTML = notDoneList.map((item) => todoItemTemplate(item)).join('');
    doneListUl.innerHTML = doneList.map((item) => todoItemTemplate(item)).join('');
};
init();
//# sourceMappingURL=index.js.map