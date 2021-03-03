export default function ProjectsReducer(state, action) {
  const { _id } = action.payload;
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
    case "SET_PROJECT_BY_QUERY_ID":
      return {
        ...state,
        projectByQueryId: action.payload,
      };
    default:
      return state;
  }
}
