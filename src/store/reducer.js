import { ADD_TASK, CHANGE_TASK, DEL_TASK, SET_TASK_MENU } from "./types"

export const initialState = {
    tasks: [],
    menu: false,
    currentTask: false
}

export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'INIT' :
            return {
                ...state, tasks: action.tasks
            }
        case SET_TASK_MENU :
            return {
                ...state, 
                currentTask: action.currentTask,
                menu: action.menu
            }
        case ADD_TASK :
            const tasks = [...state.tasks, action.task];
            return { ...state, tasks }
        case CHANGE_TASK :
            const arr = [...state.tasks];
            const i = arr.findIndex(k => k.id === action.task.id);
            arr[i] = action.task;
            return {
                ...state, tasks: arr, currentTask: action.task,
            }
        case DEL_TASK :
            return {
                ...state, tasks: state.tasks.filter(k => k.id !== action.id),
            }
        default : return {...state}
    }
}