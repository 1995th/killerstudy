export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  memberCount: number;
}

export interface GroupMember {
  id: string;
  username: string;
  joinedAt: Date;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  noteId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
}

export interface StudyStats {
  totalTimeStudied: number;
  flashcardsReviewed: number;
  notesCreated: number;
  streak: number;
}