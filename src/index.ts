// Types
type TodoType = {
    id: number;
    title: string;
    description?: string;
    isDone: boolean;
}
enum Modals {
    Edit = 'edit-modal',
    Delete = 'delete-modal',
}
// DOM
const listUl = document.querySelector<HTMLUListElement>('#list')!;
const doneListUl = document.querySelector<HTMLUListElement>('#done-list')!;
const form = document.querySelector<HTMLFormElement>('#form')!;
const newTitle = document.querySelector<HTMLInputElement>('#new-title')!;
const newDescription = document.querySelector<HTMLInputElement>('#new-description')!;
// Vars
let list: TodoType[] = [];
let currentItemId: number;
// Templates
const getCurrentItem = (id: number): TodoType | undefined => list.find(item => item.id === id);
const getCurrentIndex = (id: number): number => list.findIndex(item => item.id === id);
const onEditItem = (id: number): void => {
    currentItemId = id;
    const currentItem = getCurrentItem(id);
    if (currentItem) {
        newTitle.value = currentItem.title;
        newDescription.value = currentItem.description || '';
    }
}
const onDeleteItem = (id: number): void => {
    currentItemId = id;
}
const onToggleCheckbox = (id: number): void => {
    const currentIndex = getCurrentIndex(id);
    list[currentIndex].isDone = !list[currentIndex].isDone;
    render();
    saveTodo(list);
}
const todoItemTemplate = ({id, title, description, isDone}: TodoType): string => {
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
}
// Dom Functions
const confirmEditItem = (): void => {
    closeModal(Modals.Edit);
    const currentIndex = getCurrentIndex(currentItemId);
    list[currentIndex] = {...list[currentIndex], title: newTitle.value, description: newDescription.value};
    render();
    saveTodo(list);
}
const confirmDeleteItem = (): void => {
    closeModal(Modals.Delete);
    const currentIndex = getCurrentIndex(currentItemId);
    list.splice(currentIndex, 1);
    render();
    saveTodo(list);
}
const closeModal = (id: string): void => {
    const backdrop = document.querySelector('.modal-backdrop')!;
    backdrop.parentNode?.removeChild(backdrop);

    const body = document.querySelector('body')!;
    body.removeAttribute('style');
    body.classList.remove('modal-open');

    const modal = document.querySelector<HTMLDivElement>(`#${id}`)!;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    modal.classList.remove('show')
}
const onCreate = (): void => {
    const titleInput = document.querySelector<HTMLInputElement>('#title')!;
    const descriptionInput = document.querySelector<HTMLInputElement>('#description')!;
    addTodo({title: titleInput.value, description: descriptionInput.value});
}
// Functions
const saveTodo = (items: TodoType[]): void => {
    localStorage.setItem('list', JSON.stringify(items));
}
const addTodo = ({title, description}: Pick<TodoType, 'title' | 'description'>): void => {
    const lastId = list[list.length - 1].id;
    list.push({id: lastId + 1, title, description, isDone: false});
    saveTodo(list);
    render();
}
const init = (): void => {
    const savedList = localStorage.getItem('list');
    list = savedList ? JSON.parse(savedList) : [];
    render();
}
const render = (): void => {
    const doneList = list.filter(item => item.isDone);
    const notDoneList = list.filter(item => !item.isDone);
    listUl.innerHTML = notDoneList.map((item) => todoItemTemplate(item)).join('');
    doneListUl.innerHTML = doneList.map((item) => todoItemTemplate(item)).join('');
}
init();
