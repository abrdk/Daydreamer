export default function UsersReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      const { _id, name, password } = action.payload;
      return {
        ...state,
        _id,
        name,
        password,
        isUserLoaded: true,
      };
    default:
      return state;
  }
}
