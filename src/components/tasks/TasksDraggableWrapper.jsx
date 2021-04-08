import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { memo } from "react";

function TasksDraggableWrapper({ children }) {
  return (
    <DragDropContext
      onDragEnd={() => {
        console.log("yeeeeeeeeee");
      }}
    >
      <Droppable droppableId="tasks">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
export default memo(TasksDraggableWrapper);
