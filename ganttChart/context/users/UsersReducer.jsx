export default function UsersReducer(state, action) {
  console.log(action.type);
  switch (action.type) {
    case "SET_USER":
      const { id, name, password } = action.payload;
      return {
        ...state,
        id,
        name,
        password,
        isUserLoaded: true,
      };
    default:
      return state;
  }
}
