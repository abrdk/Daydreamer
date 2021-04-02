import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function TasksDraggableWrapper({ children }) {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="list">
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
