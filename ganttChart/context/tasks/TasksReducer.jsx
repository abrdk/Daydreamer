export default function (state, action) {
  const { _id, realId } = action.payload;
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        istasksLoaded: true,
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case "UPDATE_TASK_ID":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id == _id) {
            return { ...task, _id: realId };
          }
          return task;
        }),
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
