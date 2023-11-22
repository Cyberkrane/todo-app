import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementIds = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCount: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 * @returns 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIds.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIds.PendingCount);
    }

    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).appendChild(app);
        displayTodos();
    })();

    const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
    const todoList = document.querySelector(ElementIds.TodoList);
    const clearCompletedButton = document.querySelector(ElementIds.ClearCompleted);
    const filtersLI = document.querySelectorAll(ElementIds.TodoFilters);

    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoList.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoList.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if (!element || !isDestroyElement) return;
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLI.forEach((element) => {

        element.addEventListener('click', (element) => {
            filtersLI.forEach((el) => { el.classList.remove('selected');});
           element.target.classList.add('selected');

           switch (element.target.text) {
            case 'Todos':
                todoStore.setFilter( Filters.All);
                break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending);
                    break;
                    case 'Completados':
                todoStore.setFilter( Filters.Completed);
                break;
           }

           displayTodos();

        });

    })


}