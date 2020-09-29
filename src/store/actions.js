import { ADD_TASK, CHANGE_TASK, DEL_TASK, SET_TASK_MENU } from "./types"

export const setTaskMenu = (currentTask, menu) => {
    return {
        type: SET_TASK_MENU,
        currentTask,
        menu
    }
}

export const addTask = name => {
    const date = new Date();
    return {
        type: ADD_TASK,
        task: {
            start: date,
            end: new Date(Date.now() + ( 3600 * 1000 * 24 * 7)),
            name,
            id: Date.now(),
            progress: 10,
            // dependencies: ["Task 4"],
            styles: { progressColor: "#AF78FF", progressSelectedColor: "#ff9e0d" }
        }
    }
}

export const delTask = id => {
    return {
        type: DEL_TASK,
        id
    }
}

export const changeTask = task => {
    return {
        type: CHANGE_TASK,
        task
    }
}