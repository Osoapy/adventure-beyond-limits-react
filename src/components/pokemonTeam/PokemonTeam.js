import './pokemonTeam.scss';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, Children } from 'react';

export default function PokemonTeam({ children, onReorder }) {
  const [activeId, setActiveId] = useState(null);
  const items = Children.map(children, (child) => child.props.pokemon.id);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // Encontra os índices dos itens arrastado e de destino
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      
      // Chama a função de reordenação passada pelo componente pai
      if (onReorder) {
        onReorder(oldIndex, newIndex);
      }
    }
    
    setActiveId(null);
  }

  function arrayMove(array, oldIndex, newIndex) {
    const newArray = [...array];
    const [movedItem] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, movedItem);
    return newArray;
  }

  return (
    <div className="pokemonTeam-Container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          {children}
        </SortableContext>
        
        <DragOverlay>
          {activeId ? (
            <div style={{
              transform: 'scale(1.05)',
              opacity: 0.8,
              zIndex: 1000,
            }}>
              {Children.toArray(children).find(
                (child) => child.props.pokemon.id === activeId
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}