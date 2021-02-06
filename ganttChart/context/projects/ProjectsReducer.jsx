export default function ProjectsReducer(state, action) {
  const { _id } = action.payload;
  console.log(action.type);
  switch (action.type) {
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        isProjectsLoaded: true,
      };
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project._id == _id) {
            return action.payload;
          }
          return project;
        }),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((project) => project._id != _id),
      };
    default:
      return state;
  }
}
