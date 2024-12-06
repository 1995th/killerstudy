import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Book, ArrowRight, Moon, Sun, Brain, Target, Zap, Users, Trophy } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: 'Smart Study Tracking',
      description: 'Kill inefficient study habits with intelligent tracking and analytics that show you exactly where to improve.'
    },
    {
      icon: Target,
      title: 'Goal Assassination',
      description: 'Set targets and watch them fall. Our goal tracking system helps you demolish your study objectives one by one.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Recall',
      description: 'Master any subject with our advanced flashcard system. Kill the forgetting curve and retain information longer.'
    },
    {
      icon: Trophy,
      title: 'Streak Domination',
      description: 'Build unstoppable momentum with study streaks. Watch your productivity multiply as you maintain your killing spree.'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Weiss",
      role: "Medical Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
      quote: "KillerStudy transformed how I prepare for med school exams. My retention rate has increased by 80%!"
    },
    {
      name: "James Wilson",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
      quote: "The flashcard system is brutal - in the best way possible. I'm learning complex algorithms faster than ever."
    },
    {
      name: "Emily Rodriguez",
      role: "Law Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
      quote: "This platform helped me absolutely destroy my bar exam prep. Best study tool I've ever used."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">KillerStudy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Start Killing It
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 space-y-32">
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
              Kill Your Old
              <br />
              Study Habits
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Unleash the assassin within. Transform your learning process with 
              deadly effective study tools and ruthless productivity tracking.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg w-full sm:w-auto"
            >
              Start Your Killing Spree
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10 rounded-3xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60"
              >
                <div className="absolute -top-3 -left-3 p-3 rounded-xl bg-primary text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            You're In Good Company
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-xl border bg-background"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-background"
                  />
                </div>
                <div className="pt-8">
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Become an Assassin?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the students who have already transformed their study game.
            It's time to kill mediocrity and embrace excellence.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg"
          >
            Begin Your Transformation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </main>

      <footer className="border-t mt-32">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-primary" />
              <span className="font-semibold">KillerStudy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KillerStudy. All rights reserved.<br />
              Made by <a href="https://henkenhaf.co/" target="_blank">Tomas Henkenhaf</a>
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}