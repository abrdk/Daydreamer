export const xhr = (url, query, method) => {
  return new Promise(async (resolve) => {
    const res = await fetch("/api" + url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: Object.keys(query).length !== 0 ? JSON.stringify(query) : undefined,
    });
    resolve(await res.json());
  });
};
