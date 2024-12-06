import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { NoteColumn } from "./NoteColumn";
import { NoteCard } from "./NoteCard";
import type { Note } from "@/lib/types";

interface NotesBoardProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
}

export function NotesBoard({ notes, onNotesChange }: NotesBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: { active: { id: string } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);

      onNotesChange(arrayMove(notes, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const activeNote = notes.find((note) => note.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        <NoteColumn
          id="all-notes"
          title="All Notes"
          notes={notes}
          onEdit={(note) => console.log('Edit note:', note)}
          onDelete={(id) => {
            onNotesChange(notes.filter((note) => note.id !== id));
          }}
        />
      </div>

      <DragOverlay>
        {activeNote ? (
          <NoteCard
            note={activeNote}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}