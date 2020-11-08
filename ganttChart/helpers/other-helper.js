
export function isKeyboardEvent(event) {
  return event.key !== undefined;
}

export function isMouseEvent(event) {
  return event.clientX !== undefined;
}

export function isBarTask(task) {
  return task.x1 !== undefined;
}
