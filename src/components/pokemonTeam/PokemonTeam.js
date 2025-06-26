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
import AddPokemonButton from '../buttons/addPokemonButton/AddPokemonButton';

export default function PokemonTeam({ children, onReorder, teamNumber, showForm, setShowForm }) {
  const normalizedChildren = Children.toArray(children || []);

  // ✅ Pega todos os ids dos pokémons, ou array vazio
  const items = normalizedChildren.map(child => child.props?.pokemon?.id).filter(Boolean);

  const [activeId, setActiveId] = useState(null);

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

    if (active && over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      if (onReorder && oldIndex >= 0 && newIndex >= 0) {
        onReorder(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  }

  const activeChild = normalizedChildren.find(child => child.props?.pokemon?.id === activeId);

  return (
    <div className="pokemonTeam-Container">
      <p>Time {teamNumber} com {normalizedChildren.length} pokémons</p>
      <div className="pokemons-Container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            {normalizedChildren}
          </SortableContext>
          
          <DragOverlay>
            {activeChild ? (
              <div style={{ transform: 'scale(1.05)', opacity: 0.8, zIndex: 1000 }}>
                {activeChild}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <AddPokemonButton
          key={`${teamNumber}-add-button`}
          onClick={() => {
            setShowForm({ show: !showForm.show, teamNumber }); 
            setActiveId(null);
          }}
        />
      </div>
    </div>
  );
}
