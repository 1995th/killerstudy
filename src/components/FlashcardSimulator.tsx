import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rotate3D, Plus, ThumbsUp, ThumbsDown, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { logFlashcardReview } from '@/lib/analytics';
import { fetchFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } from '@/lib/flashcards';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import type { Flashcard } from '@/lib/types';

export function FlashcardSimulator() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards(user.id)
        .then(setFlashcards)
        .catch(() => toast.error('Failed to load flashcards'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleNewCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const flashcard = {
      front: newCard.front,
      back: newCard.back,
      difficulty: 'medium' as const,
      lastReviewed: new Date(),
    };

    try {
      const createdCard = await createFlashcard(user.id, flashcard);
      setFlashcards((prev) => [createdCard, ...prev]);
      setNewCard({ front: '', back: '' });
      toast.success('Flashcard created successfully');
    } catch (error) {
      toast.error('Failed to create flashcard');
    }
  };

  const handleDifficulty = async (difficulty: Flashcard['difficulty']) => {
    if (flashcards.length === 0 || !user) return;
    
    const currentFlashcard = flashcards[currentCard];
    
    try {
      await updateFlashcard(user.id, currentFlashcard.id, {
        difficulty,
        lastReviewed: new Date(),
      });
      await logFlashcardReview(user.id, currentFlashcard.id, difficulty);
      
      setFlashcards((prev) => prev.map((card, idx) => 
        idx === currentCard ? { ...card, difficulty, lastReviewed: new Date() } : card
      ));
      
      setIsFlipped(false);
      toast.success('Progress saved');
    } catch (error) {
      toast.error('Failed to update flashcard');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!user) return;

    try {
      await deleteFlashcard(user.id, cardId);
      setFlashcards((prev) => prev.filter((card) => card.id !== cardId));
      toast.success('Flashcard deleted successfully');
    } catch (error) {
      toast.error('Failed to delete flashcard');
    }
  };

  const navigateCards = (direction: 'next' | 'prev') => {
    setIsFlipped(false);
    if (direction === 'next') {
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    } else {
      setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
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
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <span className="text-sm text-muted-foreground">
          {flashcards.length > 0 ? `Card ${currentCard + 1} of ${flashcards.length}` : '0 cards'}
        </span>
      </div>

      {flashcards.length > 0 && (
        <div className="flex flex-col items-center space-y-4">
          <Card
            className={`w-full max-w-md h-64 p-6 cursor-pointer transition-transform duration-700 transform perspective-1000 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="relative w-full h-full">
              <div
                className={`absolute w-full h-full backface-hidden ${
                  isFlipped ? 'hidden' : 'flex items-center justify-center'
                }`}
              >
                <p className="text-lg text-center">
                  {flashcards[currentCard]?.front}
                </p>
              </div>
              <div
                className={`absolute w-full h-full backface-hidden rotate-y-180 ${
                  isFlipped ? 'flex items-center justify-center' : 'hidden'
                }`}
              >
                <p className="text-lg text-center">
                  {flashcards[currentCard]?.back}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCards('prev')}
              disabled={flashcards.length <= 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <Rotate3D className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCards('next')}
              disabled={flashcards.length <= 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="default"
              onClick={() => handleDifficulty('easy')}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Easy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDifficulty('hard')}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Hard
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleNewCard} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="front">Front</Label>
          <Input
            id="front"
            value={newCard.front}
            onChange={(e) =>
              setNewCard((prev) => ({ ...prev, front: e.target.value }))
            }
            placeholder="Question or term"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="back">Back</Label>
          <Input
            id="back"
            value={newCard.back}
            onChange={(e) =>
              setNewCard((prev) => ({ ...prev, back: e.target.value }))
            }
            placeholder="Answer or definition"
            required
          />
        </div>

        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Add Flashcard
        </Button>
      </form>

      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4 space-y-2">
          {flashcards.map((card, index) => (
            <Card key={card.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Card {index + 1}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {card.front}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      card.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : card.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {card.difficulty}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(card.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}