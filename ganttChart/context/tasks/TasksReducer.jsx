export default function TasksReducer(state, action) {
  const { _id } = action.payload;
  console.log(action.type);
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
    default:
      return state;
  }
}
