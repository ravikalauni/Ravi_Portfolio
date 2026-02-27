import React, { useState, useEffect } from 'react';
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Documents } from "./components/Documents";
import { SketchBackground } from "./components/SketchBackground";
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { RoughFilter } from './components/PencilBox';
import { MouseTail } from './components/MouseTail';

const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:5000/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<'portfolio' | 'documents'>('portfolio');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isMouseTailEnabled, setIsMouseTailEnabled] = useState(true);

  const [documentsData, setDocumentsData] = useState<Array<any>>([]);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [heroData, setHeroData] = useState<any>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [skillsData, setSkillsData] = useState<any>([]);
  const [projectsData, setProjectsData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.allSettled([
      fetchDocuments(),
      fetchMessages(),
      fetchHero(),
      fetchAbout(),
      fetchSkills(),
      fetchProjects(),
      fetchSettings(),
      fetchContact(),
      fetchFooter()
    ]);
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDocumentsData(data);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/messages`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const fetchHero = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hero`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data) setHeroData(data);
    } catch (err) {
      console.error('Failed to fetch hero', err);
    }
  };

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/about`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data) setAboutData(data);
    } catch (err) {
      console.error('Failed to fetch about', err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/skills`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSkillsData(data);
    } catch (err) {
      console.error('Failed to fetch skills', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data) setProjectsData(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data) setSettingsData(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const fetchContact = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data) setContactData(data);
    } catch (err) {
      console.error('Failed to fetch contact', err);
    }
  };

  const fetchFooter = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/footer`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data) setFooterData(data);
    } catch (err) {
      console.error('Failed to fetch footer', err);
    }
  };

  const handleUpdateSection = async (endpoint: string, data: any, refreshFn: () => void) => {
    try {
      const fullEndpoint = endpoint.startsWith('/api')
        ? `${API_BASE_URL}${endpoint.replace('/api', '')}`
        : `${API_BASE_URL}${endpoint}`;

      await fetch(fullEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      refreshFn();
    } catch (err) {
      console.error(`Failed to update ${endpoint}`, err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('doc');
    if (docId) {
      setCurrentView('documents');
      setSelectedDocId(docId);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setShowLogin(true);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMouseTailEnabled(prev => !prev);
        console.log('Mouse trail:', !isMouseTailEnabled ? 'enabled' : 'disabled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMouseTailEnabled]);

  const handleLogin = (username: string) => {
    setUser(username);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');
  };

  const handleContactSubmit = async (name: string, email: string, message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      date: new Date().toLocaleString(),
      read: false
    };
    try {
      await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleMarkMessagesRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/messages/mark-read`, { method: 'PATCH' });
      fetchMessages();
    } catch (err) {
      console.error('Failed to mark messages read', err);
    }
  };

  if (isLoggedIn) {
    return (
      <div>
        <AdminPanel
          user={user}
          onLogout={handleLogout}
          aboutData={aboutData || { title: '', image: '', text: '', cards: [] }}
          onUpdateAbout={(data) => {
            setAboutData(data);
            handleUpdateSection('/about', data, fetchAbout);
          }}
          skillsData={skillsData}
          onUpdateSkills={(data) => {
            setSkillsData(data);
            handleUpdateSection('/skills', data, fetchSkills);
          }}
          projectsData={projectsData || { heading: '', description: '', items: [] }}
          onUpdateProjects={(data) => {
            setProjectsData(data);
            handleUpdateSection('/projects', data, fetchProjects);
          }}
          heroData={heroData || { title: '', subtitle: '', buttons: [], socials: [] }}
          onUpdateHero={(data) => {
            setHeroData(data);
            handleUpdateSection('/hero', data, fetchHero);
          }}
          settingsData={settingsData || { websiteName: 'Ravi', showLoginButton: true, adminUsername: 'Ravi', adminPassword: 'Ravi123' }}
          onUpdateSettings={(data) => {
            setSettingsData(data);
            handleUpdateSection('/settings', data, fetchSettings);
          }}
          contactData={contactData || { title: '', subtitle: '', description: '', email: '', phone: '', location: '', namePlaceholder: '', emailPlaceholder: '' }}
          onUpdateContact={(data) => {
            setContactData(data);
            handleUpdateSection('/contact', data, fetchContact);
          }}
          footerData={footerData || { text: '' }}
          onUpdateFooter={(data) => {
            setFooterData(data);
            handleUpdateSection('/footer', data, fetchFooter);
          }}
          messages={messages}
          onDeleteMessage={async (id) => {
            try {
              await fetch(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' });
              fetchMessages();
            } catch (err) {
              console.error('Failed to delete message', err);
            }
          }}
          onMarkMessagesRead={handleMarkMessagesRead}
          documentsData={documentsData}
          onUpdateDocuments={async (docs: any) => {
            const prevDocs = [...documentsData];
            setDocumentsData(docs);

            if (docs.length > prevDocs.length) {
              const newDoc = docs[0];
              await fetch(`${API_BASE_URL}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: Date.now().toString(),
                  title: newDoc.title,
                  subtitle: newDoc.subtitle,
                  content: newDoc.content,
                  date: new Date().toISOString()
                })
              });
            } else if (docs.length < prevDocs.length) {
              const deletedId = prevDocs.find(d => !docs.find((nd: any) => nd.id === d.id))?.id;
              if (deletedId) {
                await fetch(`${API_BASE_URL}/documents/${deletedId}`, { method: 'DELETE' });
              }
            } else {
              const changedDoc = docs.find((d: any, i: number) => {
                const old = prevDocs.find((od: any) => od.id === d.id);
                return old && (old.title !== d.title || old.subtitle !== d.subtitle || old.content !== d.content);
              });

              if (changedDoc) {
                await fetch(`${API_BASE_URL}/documents/${changedDoc.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: changedDoc.title,
                    subtitle: changedDoc.subtitle,
                    content: changedDoc.content,
                  })
                });
              }
            }
            fetchDocuments();
          }}
        />
        <RoughFilter />
        {isMouseTailEnabled && <MouseTail />}
      </div>
    );
  }

  if (!settingsData || !heroData || !aboutData || !projectsData || !contactData || !footerData) {
    return (
      <div className="min-h-screen bg-paper dark:bg-slate-950 flex flex-col items-center justify-center font-bold text-2xl hand-font gap-4">
        <div>Loading...</div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm font-normal px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <RoughFilter />
      <SketchBackground />
      {isMouseTailEnabled && <MouseTail />}

      <div className="fixed bottom-4 left-4 z-50 text-xs text-gray-500 bg-white/80 dark:bg-black/80 px-2 py-1 rounded shadow-md">
        Mouse Trail: {isMouseTailEnabled ? '✓' : '✗'} (Ctrl+M)
      </div>

      <Navbar
        onLoginClick={() => setShowLogin(true)}
        websiteName={settingsData.websiteName}
        showLoginButton={settingsData.showLoginButton}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="relative z-10 pt-20">
        {currentView === 'portfolio' ? (
          <>
            <Hero data={heroData} />
            <About data={aboutData} />
            <Skills data={skillsData} />
            <Projects data={projectsData} />
            <Contact data={contactData} onSubmit={handleContactSubmit} />
          </>
        ) : (
          <Documents
            data={documentsData}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onLike={(id) => setDocumentsData(prev => prev.map(d => {
              if (d.id === id) {
                if (d.userLiked) return d;
                return { ...d, likes: d.likes + 1, userLiked: true };
              }
              return d;
            }))}
            onComment={async (id, comment) => {
              try {
                setDocumentsData(prev => prev.map(d => d.id === id ? {
                  ...d,
                  comments: [...(d.comments || []), {
                    id: 'temp',
                    username: 'Guest',
                    comment_text: comment,
                    date: new Date().toISOString()
                  }]
                } : d));

                await fetch(`${API_BASE_URL}/documents/${id}/comments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: 'Guest', comment_text: comment })
                });
                fetchDocuments();
              } catch (err) {
                console.error('Failed to post comment', err);
              }
            }}
            onShare={(id) => setDocumentsData(prev => prev.map(d => d.id === id ? { ...d, shares: d.shares + 1 } : d))}
          />
        )}
      </main>

      <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800 relative z-10">
        <p className="text-slate-500 text-sm">
          {footerData?.text}
        </p>
      </footer>

      {showLogin && (
        <LoginForm
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          adminUsername={settingsData.adminUsername}
          adminPassword={settingsData.adminPassword}
        />
      )}
    </div>
  );
}
