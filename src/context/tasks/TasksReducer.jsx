export default function TasksReducer(state, action) {
  // console.log(action.type, action.payload);
  const { _id, project } = action.payload;
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        isTasksLoaded: true,
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
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
    case "SET_SORTED_TASKS_IDS":
      return {
        ...state,
        sortedTasksIds: action.payload,
      };
    case "SET_IS_TASKS_SORTING":
      return {
        ...state,
        isSorting: action.payload,
      };
    default:
      return state;
  }
}
