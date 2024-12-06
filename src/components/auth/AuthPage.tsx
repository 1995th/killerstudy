import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Target, Zap, Trophy, Users } from 'lucide-react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useViewport } from '@/hooks/use-viewport';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  const { user, checkUser } = useAuth();
  const { isMobile } = useViewport();

  useEffect(() => {
    const init = async () => {
      await checkUser();
    };
    init();
  }, [checkUser]);

  useEffect(() => {
    if (user) {
      if (isMobile) {
        // For mobile: Force a full page reload to reset zoom and scroll position
        window.location.href = '/dashboard';
      } else {
        // For desktop: Use normal navigation
        navigate('/dashboard');
      }
    }
  }, [user, navigate, isMobile]);

  const handleSuccess = () => {
    if (mode === 'signup') {
      setMode('signin');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold">Welcome to KillerStudy</h1>
              <p className="text-xl text-muted-foreground">
                Kill your old study habits and embrace a more powerful way to learn. 
                Transform your learning experience with deadly effective tools and analytics.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Goal Assassination</h3>
                    <p className="text-sm text-muted-foreground">Track and demolish your study objectives</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Lightning Fast Recall</h3>
                    <p className="text-sm text-muted-foreground">Master any subject with advanced flashcards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Streak Domination</h3>
                    <p className="text-sm text-muted-foreground">Build unstoppable study momentum</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Study Squad</h3>
                    <p className="text-sm text-muted-foreground">Team up and conquer together</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-foreground hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Brain className="h-12 w-12 text-primary" />
          </div>

          <div className="glass p-8 rounded-lg space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
                <Button
                  variant="link"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="ml-1"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Button>
              </p>
            </div>

            {mode === 'signin' ? (
              <SignInForm onSuccess={handleSuccess} />
            ) : (
              <SignUpForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}