import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavBar } from './MobileNavBar';
import { TopBar } from './TopBar';
import { SearchSection } from './SearchSection';
import { Analytics } from './Analytics';
import { NotesUploader } from './NotesUploader';
import { FlashcardSimulator } from './FlashcardSimulator';
import { StudySession } from './study/StudySession';
import { Collaboration } from './Collaboration';
import { AccountSettings } from './settings/AccountSettings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('goals');
  const [streak, setStreak] = useState(0);

  // Reset scroll position when component mounts or tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleSearch = (query: string, filter: string) => {
    console.log('Search:', query, filter);
    // Implement search functionality
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'goals':
        return <StudySession onStreakUpdate={setStreak} />;
      case 'notes':
        return <NotesUploader />;
      case 'flashcards':
        return <FlashcardSimulator />;
      case 'analytics':
        return <Analytics />;
      case 'collaborate':
        return <Collaboration />;
      case 'settings':
        return <AccountSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        className="w-64 hidden md:flex"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
        {/* Top Bar */}
        <TopBar className="md:hidden" />
        
        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <SearchSection onSearch={handleSearch} activeTab={activeTab} />
            {renderContent()}
          </div>
        </div>

        {/* Add bottom padding to ensure content doesn't get hidden behind mobile nav */}
        <div className="h-20 md:h-0" />
      </main>

      {/* Mobile Navigation Bar */}
      <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}