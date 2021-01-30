export default function (state, action) {
  switch (action.type) {
    case "SET_USER":
      const { id, token, name, password } = action.payload;
      return {
        ...state,
        id,
        token,
        name,
        password,
      };
    default:
      return state;
  }
}
