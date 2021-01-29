export const xhr = (url, query, method) => {
  return new Promise(async (resolve) => {
    const res = await fetch("/api" + url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: query ? JSON.stringify(query) : null,
    });
    resolve(await res.json());
  });
};
