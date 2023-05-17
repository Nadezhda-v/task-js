const tasks = [
    {
        id: '1138465078061',
        completed: false,
        text: 'Посмотреть новый урок по JavaScript',
    },
    {
        id: '1138465078062',
        completed: false,
        text: 'Выполнить тест после урока',
    },
    {
        id: '1138465078063',
        completed: false,
        text: 'Выполнить ДЗ после урока',
    },
]

let isDark = false;

const createTaskItem = (taskId, taskText) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.dataset.taskId = taskId;

    const taskItemMainContainer = document.createElement('div');
    taskItemMainContainer.className = 'task-item__main-container';

    const taskItemMainContent = document.createElement('div');
    taskItemMainContent.className = 'task-item__main-content';

    taskItem.append(taskItemMainContainer);
    taskItemMainContainer.append(taskItemMainContent);

    const checkboxForm = document.createElement('form');
    checkboxForm.className = 'checkbox-form';

    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.className = 'checkbox-form__checkbox';
    const inputId = `task-${taskId}`;
    inputCheckbox.id = inputId;

    const labelCheckbox = document.createElement('label');
    labelCheckbox.htmlFor = inputId;

    const taskItemText = document.createElement('span');
    taskItemText.className = 'task-item__text';
    taskItemText.id = 'editableDiv';
    taskItemText.innerText = taskText;

    const taskItemButtons = document.createElement('div');
    taskItemButtons.className = 'task-item__buttons';


    const deleteButton = document.createElement('button');
    deleteButton.className = 'task-item__delete-button default-button delete-button';
    deleteButton.innerText = 'Удалить';

    const redactButton = document.createElement('button');
    redactButton.className = 'task-item__redact-button default-button redact-button';
    redactButton.textContent = 'Редактировать';

    if(isDark) {
        taskItemText.style.color = '#ffffff';
        deleteButton.style.border = '1px solid #ffffff';
        redactButton.style.border = '1px solid #ffffff';
        labelCheckbox.style.setProperty('--checkbox-border-color', '#ffffff');
    }

    taskItemMainContent.append(checkboxForm, taskItemText);
    checkboxForm.append(inputCheckbox, labelCheckbox);
    taskItemMainContainer.append(taskItemButtons);
    taskItemButtons.append(redactButton, deleteButton);

    return taskItem;
}


const tasksList = document.querySelector('.tasks-list');
tasks.forEach(task => {
    const taskItem = createTaskItem(task.id, task.text);
    tasksList.append(taskItem);
});

const createBlockWithError = (text) =>{
        const blockWithError = document.createElement('span');
        blockWithError.className = 'error-message-block';
        blockWithError.textContent = text;

        return blockWithError;
    }

const createTaskForm = document.querySelector('.create-task-block');

createTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const { target } = event;
    const taskNameInput = target.taskName;
    const newTaskInput = taskNameInput.value;
    const taskRepeat = tasks.some(task => task.text === newTaskInput);
    const errorMessageBlockFromDom = createTaskForm.querySelector('.error-message-block');

    if(newTaskInput === ''){
        const blockWithError = createBlockWithError('Название задачи не должно быть пустым');
        createTaskForm.append(blockWithError);
    }

    if(taskRepeat){
        const blockWithError = createBlockWithError('Задача с таким названием уже существует');
        createTaskForm.append(blockWithError);
    }

    if(newTaskInput && !taskRepeat) {
        const newTask = {
            id: Date.now().toString(),
            text: newTaskInput,
        }
        tasks.push(newTask);
        const taskItem = createTaskItem(newTask.id, newTask.text);
        tasksList.append(taskItem);
    }

    if(errorMessageBlockFromDom){
        errorMessageBlockFromDom.remove();
    }
});

const createDeleteModal = (text) => {
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay modal-overlay_hidden';

const deleteModal = document.createElement('div');
deleteModal.className = 'delete-modal';

modalOverlay.append(deleteModal)

const deleteModalQuestion = document.createElement('h3');
deleteModalQuestion.className = 'delete-modal__question';
deleteModalQuestion.textContent = text;

const deleteModalButtons = document.createElement('div');
deleteModalButtons.className = 'delete-modal__buttons';

const cancelButton = document.createElement('button');
cancelButton.className = 'delete-modal__button delete-modal__cancel-button';
cancelButton.textContent = 'Отмена'

const confirmButton = document.createElement('button');
confirmButton.className = 'delete-modal__button delete-modal__confirm-button';
confirmButton.textContent = 'Удалить';

deleteModal.append(deleteModalQuestion, deleteModalButtons);
deleteModalButtons.append(cancelButton, confirmButton);

return {modalOverlay, cancelButton, confirmButton, deleteModal};
}

let targetTaskIdToDelete = null;

const tasksListModal = document.querySelector('.tasks-list');
tasksListModal.addEventListener('click', (event) => {
    const { target } = event;
    const closestDeleteButton = target.closest('.task-item__delete-button');
    const closestRedactButton = target.closest('.task-item__redact-button');
    const closestItemText = target.closest('.task-item__text');
    if (closestDeleteButton) {
        const closestTask = closestDeleteButton.closest('.task-item');
        if (closestTask) {
            targetTaskIdToDelete = closestTask.dataset.taskId;
            modalOverlay.classList.remove('modal-overlay_hidden');
        }
    }
        
    if (closestRedactButton) {
        const taskItemText = closestRedactButton.parentNode;
        const taskItemMainContent = taskItemText.previousElementSibling;
        const span = taskItemMainContent.lastChild;
        span.contentEditable = true;
        span.focus();

        const sel = window.getSelection();
        sel.collapse(span.firstChild, span.innerText.length);
    }

});

const {
    modalOverlay, cancelButton, confirmButton, deleteModal,
} = createDeleteModal('Вы действительно хотите удалить задачу?');

document.body.prepend(modalOverlay);

cancelButton.addEventListener('click', () => {
    modalOverlay.classList.add('modal-overlay_hidden');
});

confirmButton.addEventListener('click', () => {
    const deleteIndex = tasks.findIndex((task) => task.id === targetTaskIdToDelete);

    if (deleteIndex >= 0) {
        tasks.splice(deleteIndex, 1);
        const taskItemHTML = document.querySelector(`[data-task-id="${targetTaskIdToDelete}"]`);
        taskItemHTML.remove();
        modalOverlay.classList.add('modal-overlay_hidden');
    }
});

const redactButton = document.querySelectorAll('.task-item__redact-button');

document.addEventListener( 'click', (event) => {
    const { target } = event;
    const closestItemText = target.closest('.task-item__text');
    const closestRedactButton = target.closest('.task-item__redact-button');

    if (!closestRedactButton) {
        closestItemText.contentEditable = false;
    }
})

const buttonChangeTheme = document.querySelector('#bg');

const changeTheme = ({
    bodyBackground,
    taskItemTextColor,
    buttonBorder,
    buttonLampColor,
    checkboxColor,
}) => {
    document.body.style.background = bodyBackground;
    document.querySelectorAll('.task-item__text').forEach((taskItem) => {
        taskItem.style.color = taskItemTextColor;
    });
    document.querySelectorAll('button').forEach((button) => {
        button.style.border = buttonBorder;
    });
    document.querySelector('#clrLamp').style.fill = buttonLampColor;
    document.querySelectorAll('label').forEach((label) => {
        label.style.setProperty('--checkbox-border-color', checkboxColor);
    });
}

buttonChangeTheme.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            changeTheme({
                bodyBackground: '#24292E',
                taskItemTextColor: '#ffffff',
                buttonBorder: '1px solid #ffffff',
                buttonLampColor: 'rgb(255, 255, 144)',
                checkboxColor: '#ffffff',
            });
        } else {
            changeTheme({
                bodyBackground: 'initial',
                taskItemTextColor: 'initial',
                buttonBorder: 'none',
                buttonLampColor: 'initial',
                checkboxColor: '#000000',
            });
        }
});