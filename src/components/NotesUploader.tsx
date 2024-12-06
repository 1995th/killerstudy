import { useState, useEffect } from 'react';
import { Upload, Plus, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NotesBoard } from './notes/NotesBoard';
import { logNoteCreation } from '@/lib/analytics';
import { fetchNotes, createNote, deleteNote } from '@/lib/notes';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import type { Note } from '@/lib/types';

export function NotesUploader() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotes(user.id)
        .then(setNotes)
        .catch(() => toast.error('Failed to load notes'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const note = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          content,
          createdAt: new Date(),
          tags: [],
        };
        
        try {
          const createdNote = await createNote(user.id, note);
          await logNoteCreation(user.id, createdNote.id);
          setNotes((prev) => [createdNote, ...prev]);
          toast.success('Note created successfully');
        } catch (error) {
          toast.error('Failed to create note');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const note = {
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      const createdNote = await createNote(user.id, note);
      await logNoteCreation(user.id, createdNote.id);
      setNotes((prev) => [createdNote, ...prev]);
      setNewNote({ title: '', content: '', tags: '' });
      toast.success('Note created successfully');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      await deleteNote(user.id, noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Notes</h2>
        <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
          <input
            id="file-upload"
            type="file"
            accept=".txt,.md,.doc,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />
        </Button>
      </div>

      <form onSubmit={handleManualNoteSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter note title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="tags"
                value={newNote.tags}
                onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="math, physics, chapter 1"
                className="pl-9"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={newNote.content}
            onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter your notes here..."
            className="min-h-[200px]"
            required
          />
        </div>

        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </form>

      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="glass p-4 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm line-clamp-3">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}