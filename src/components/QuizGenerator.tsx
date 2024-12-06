import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateQuiz } from '@/lib/utils';
import type { Quiz } from '@/lib/types';

interface QuizGeneratorProps {
  noteContent: string;
}

export function QuizGenerator({ noteContent }: QuizGeneratorProps) {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    const questions = generateQuiz(noteContent);
    setQuiz(questions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === quiz[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {quiz.length === 0 ? (
        <Button onClick={startQuiz}>Generate Quiz</Button>
      ) : (
        <AnimatePresence mode="wait">
          {currentQuestion < quiz.length ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {quiz.length}
                  </span>
                  <span className="text-sm font-medium">Score: {score}</span>
                </div>
                <p className="text-lg font-medium">
                  {quiz[currentQuestion].question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quiz[currentQuestion].options.map((option) => (
                    <Button
                      key={option}
                      variant={
                        selectedAnswer
                          ? option === quiz[currentQuestion].answer
                            ? 'default'
                            : option === selectedAnswer
                            ? 'destructive'
                            : 'outline'
                          : 'outline'
                      }
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswer(option)}
                      className="h-auto py-4 px-6"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {selectedAnswer && (
                  <Button
                    onClick={nextQuestion}
                    className="w-full"
                  >
                    Next Question
                  </Button>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 text-center space-y-4">
                <h3 className="text-xl font-bold">Quiz Complete!</h3>
                <p className="text-lg">
                  Your score: {score} out of {quiz.length}
                </p>
                <Button onClick={startQuiz}>Try Again</Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}