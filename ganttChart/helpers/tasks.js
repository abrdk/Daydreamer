const currentDate = new Date();
export const tasksList = [
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          2,
          12,
          28
        ),
        name: "Какая то идея",
        id: "Task 0",
        progress: 45,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          5,
          0,
          0
        ),
        name: "Идея",
        id: "Task 1",
        progress: 45,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
        name: "Пробросить props",
        id: "Task 2",
        progress: 25,
        // dependencies: ["Task 0"],
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
        name: "Доделать стили",
        id: "Task 3",
        progress: 10,
        // dependencies: ["Task 1"],
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
        name: "Погулять",
        id: "Task 4",
        progress: 2,
        // dependencies: ["Task 2"],
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        name: "Что то сделать",
        id: "Task 5",
        progress: 70,
        // dependencies: ["Task 2"],
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
        name: "Ничего не делать",
        id: "Task 6",
        progress: currentDate.getMonth(),
        // dependencies: ["Task 4"],
        styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
        name: "Супер идея",
        id: "Task 7",
        progress: 0,
        isDisabled: true,
      }
]