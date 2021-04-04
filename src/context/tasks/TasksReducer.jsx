export default function TasksReducer(state, action) {
  const { _id, project, isOpened } = action.payload;
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload.map((t) => {
          return { ...t, isOpened: false };
        }),
        isTasksLoaded: true,
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, isOpened: false }],
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id == _id) {
            return action.payload;
          }
          return task;
        }),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id != _id),
      };
    case "DELETE_TASKS_BY_PROJECT":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.project != project),
      };
    case "SET_TASKS_BY_PROJECT_ID":
      return {
        ...state,
        tasksByProjectId: action.payload,
      };
    case "UPDATE_IS_OPENED":
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t._id == _id) {
            return { ...t, isOpened };
          }
          return t;
        }),
      };
    case "SET_WHERE_EDIT_NEW_TASK":
      return {
        ...state,
        whereEditNewTask: action.payload,
      };
    case "SET_EDITED_TASK_ID":
      return {
        ...state,
        editedTaskId: action.payload,
      };
    default:
      return state;
  }
}
