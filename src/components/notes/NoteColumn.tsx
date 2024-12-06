import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NoteCard } from "./NoteCard";
import type { Note } from "@/lib/types";

interface NoteColumnProps {
  title: string;
  notes: Note[];
  id: string;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteColumn({ title, notes, id, onEdit, onDelete }: NoteColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-w-[300px] glass rounded-lg">
      <div className="p-3 border-b border-white/10">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{notes.length} notes</p>
      </div>

      <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto">
        <SortableContext items={notes} strategy={verticalListSortingStrategy}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}