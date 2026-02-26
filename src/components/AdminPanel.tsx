import React, { useState } from 'react';
import { PencilBox } from './PencilBox';
import { motion, AnimatePresence } from 'motion/react';
import { RichTextEditor } from './RichTextEditor';
import { LayoutDashboard, Users, Settings, FileText, LogOut, Search, Bell, Edit3, Image as ImageIcon, Type, Plus, Trash2, ListPlus, Minus, Award, Home, Share2, Mail, Phone, MapPin, Send, User, Lock, AlertCircle, Heart, MessageSquare, Menu, X } from 'lucide-react';

interface HeroButton {
  id: string;
  label: string;
  link: string;
  primary: boolean;
}

interface HeroSocial {
  id: string;
  platform: string;
  link: string;
}

interface HeroData {
  title: string;
  subtitle: string;
  buttons: HeroButton[];
  socials: HeroSocial[];
}

interface SettingsData {
  adminUsername: string;
  adminPassword: string;
  websiteName: string;
  showLoginButton: boolean;
}

interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  namePlaceholder: string;
  emailPlaceholder: string;
}

interface FooterData {
  text: string;
}

interface Skill {
  name: string;
  percentage: number;
}

interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

interface AboutCard {
  id: string;
  title: string;
  items: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  link: string;
}

interface AdminPanelProps {
  user: string;
  onLogout: () => void;
  aboutData: {
    title: string;
    image: string;
    text: string;
    cards: AboutCard[];
  };
  onUpdateAbout: (data: { title: string; image: string; text: string; cards: AboutCard[] }) => void;
  skillsData: SkillCategory[];
  onUpdateSkills: (data: SkillCategory[]) => void;
  projectsData: {
    heading: string;
    description: string;
    items: ProjectItem[];
  };
  onUpdateProjects: (data: { heading: string; description: string; items: ProjectItem[] }) => void;
  heroData: HeroData;
  onUpdateHero: (data: HeroData) => void;
  settingsData: SettingsData;
  onUpdateSettings: (data: SettingsData) => void;
  contactData: ContactData;
  onUpdateContact: (data: ContactData) => void;
  footerData: FooterData;
  onUpdateFooter: (data: FooterData) => void;
  messages: Array<{ id: string; name: string; email: string; message: string; date: string; read: boolean }>;
  onDeleteMessage: (id: string) => void;
  onMarkMessagesRead: () => void;
  documentsData: Array<{
    id: string;
    title: string;
    subtitle: string;
    content: string;
    likes: number;
    comments: Array<{ id: string; user: string; text: string; date: string }>;
    shares: number;
    date: string;
  }>;
  onUpdateDocuments: (docs: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  onLogout,
  aboutData,
  onUpdateAbout,
  skillsData,
  onUpdateSkills,
  projectsData,
  onUpdateProjects,
  heroData,
  onUpdateHero,
  settingsData,
  onUpdateSettings,
  contactData,
  onUpdateContact,
  footerData,
  onUpdateFooter,
  messages,
  onDeleteMessage,
  onMarkMessagesRead,
  documentsData,
  onUpdateDocuments
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [replyTo, setReplyTo] = useState<{ name: string; email: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const unreadCount = messages.filter(m => !m.read).length;

  const addCard = () => {
    const newCard: AboutCard = {
      id: Date.now().toString(),
      title: "New Card",
      items: ["New bullet point"]
    };
    onUpdateAbout({ ...aboutData, cards: [...aboutData.cards, newCard] });
  };

  const removeCard = (id: string) => {
    onUpdateAbout({ ...aboutData, cards: aboutData.cards.filter(c => c.id !== id) });
  };

  const updateCard = (id: string, updates: Partial<AboutCard>) => {
    onUpdateAbout({
      ...aboutData,
      cards: aboutData.cards.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const addBullet = (cardId: string) => {
    onUpdateAbout({
      ...aboutData,
      cards: aboutData.cards.map(c => c.id === cardId ? { ...c, items: [...c.items, "New point"] } : c)
    });
  };

  const removeBullet = (cardId: string, index: number) => {
    onUpdateAbout({
      ...aboutData,
      cards: aboutData.cards.map(c => c.id === cardId ? { ...c, items: c.items.filter((_, i) => i !== index) } : c)
    });
  };

  const updateBullet = (cardId: string, index: number, value: string) => {
    onUpdateAbout({
      ...aboutData,
      cards: aboutData.cards.map(c => c.id === cardId ? { ...c, items: c.items.map((item, i) => i === index ? value : item) } : c)
    });
  };

  // Skills handlers
  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: Date.now().toString(),
      title: "New Category",
      skills: [{ name: "New Skill", percentage: 80 }]
    };
    onUpdateSkills([...skillsData, newCategory]);
  };

  const removeSkillCategory = (id: string) => {
    onUpdateSkills(skillsData.filter(c => c.id !== id));
  };

  const updateSkillCategory = (id: string, title: string) => {
    onUpdateSkills(skillsData.map(c => c.id === id ? { ...c, title } : c));
  };

  const addSkill = (categoryId: string) => {
    onUpdateSkills(skillsData.map(c => c.id === categoryId ? { ...c, skills: [...c.skills, { name: "New Skill", percentage: 50 }] } : c));
  };

  const removeSkill = (categoryId: string, index: number) => {
    onUpdateSkills(skillsData.map(c => c.id === categoryId ? { ...c, skills: c.skills.filter((_, i) => i !== index) } : c));
  };

  const updateSkill = (categoryId: string, index: number, updates: Partial<Skill>) => {
    onUpdateSkills(skillsData.map(c => c.id === categoryId ? { ...c, skills: c.skills.map((s, i) => i === index ? { ...s, ...updates } : s) } : c));
  };

  // Projects handlers
  const addProject = () => {
    const newProject: ProjectItem = {
      id: Date.now().toString(),
      title: "New Project",
      type: "Web Development",
      thumbnail: "https://picsum.photos/seed/new/600/400",
      link: "#"
    };
    onUpdateProjects({ ...projectsData, items: [...projectsData.items, newProject] });
  };

  const removeProject = (id: string) => {
    onUpdateProjects({ ...projectsData, items: projectsData.items.filter(p => p.id !== id) });
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    onUpdateProjects({
      ...projectsData,
      items: projectsData.items.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  // Hero handlers
  const addHeroButton = () => {
    const newBtn: HeroButton = { id: Date.now().toString(), label: "New Button", link: "#", primary: false };
    onUpdateHero({ ...heroData, buttons: [...heroData.buttons, newBtn] });
  };

  const removeHeroButton = (id: string) => {
    onUpdateHero({ ...heroData, buttons: heroData.buttons.filter(b => b.id !== id) });
  };

  const updateHeroButton = (id: string, updates: Partial<HeroButton>) => {
    onUpdateHero({ ...heroData, buttons: heroData.buttons.map(b => b.id === id ? { ...b, ...updates } : b) });
  };

  const addHeroSocial = () => {
    const newSocial: HeroSocial = { id: Date.now().toString(), platform: "github", link: "#" };
    onUpdateHero({ ...heroData, socials: [...heroData.socials, newSocial] });
  };

  const removeHeroSocial = (id: string) => {
    onUpdateHero({ ...heroData, socials: heroData.socials.filter(s => s.id !== id) });
  };

  const updateHeroSocial = (id: string, updates: Partial<HeroSocial>) => {
    onUpdateHero({ ...heroData, socials: heroData.socials.map(s => s.id === id ? { ...s, ...updates } : s) });
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} className="text-slate-800 dark:text-slate-100" /> : <Menu size={24} className="text-slate-800 dark:text-slate-100" />}
            </button>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center pencil-border text-white">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">AdminPortal</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 pencil-border">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                >
                  <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 pencil-border shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Notifications</h4>
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {messages.filter(m => !m.read).length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm italic">No new notifications</div>
                      ) : (
                        messages.filter(m => !m.read).map(msg => (
                          <div
                            key={msg.id}
                            className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                            onClick={() => {
                              setActiveTab('messages');
                              setShowNotifications(false);
                              onMarkMessagesRead();
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{msg.name} sent you a message</p>
                                <p className="text-xs text-slate-500 mt-1">{msg.date}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReplyTo({ name: msg.name, email: msg.email });
                                  setShowNotifications(false);
                                  onMarkMessagesRead();
                                }}
                                className="p-1.5 bg-primary/10 text-primary rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Quick Reply"
                              >
                                <Mail size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          onMarkMessagesRead();
                          setShowNotifications(false);
                        }}
                        className="w-full py-3 text-xs font-bold text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full p-6 gap-6 relative">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 shadow-2xl lg:hidden pt-20 px-4 pb-4 overflow-y-auto border-r border-slate-200 dark:border-slate-800"
            >
              <nav className="space-y-1">
                <SidebarItem
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  active={activeTab === 'dashboard'}
                  onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<Home size={18} />}
                  label="Edit Hero"
                  active={activeTab === 'hero'}
                  onClick={() => { setActiveTab('hero'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<Edit3 size={18} />}
                  label="Edit About"
                  active={activeTab === 'about'}
                  onClick={() => { setActiveTab('about'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<Award size={18} />}
                  label="Edit Skills"
                  active={activeTab === 'skills'}
                  onClick={() => { setActiveTab('skills'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<FileText size={18} />}
                  label="Edit Projects"
                  active={activeTab === 'projects'}
                  onClick={() => { setActiveTab('projects'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<FileText size={18} />}
                  label="Manage Documents"
                  active={activeTab === 'documents'}
                  onClick={() => { setActiveTab('documents'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<Bell size={18} />}
                  label="Messages"
                  active={activeTab === 'messages'}
                  onClick={() => {
                    setActiveTab('messages');
                    onMarkMessagesRead();
                    setShowMobileMenu(false);
                  }}
                  badge={unreadCount > 0}
                />
                <SidebarItem
                  icon={<Mail size={18} />}
                  label="Contact & Footer"
                  active={activeTab === 'contact'}
                  onClick={() => { setActiveTab('contact'); setShowMobileMenu(false); }}
                />
                <SidebarItem
                  icon={<Settings size={18} />}
                  label="Settings"
                  active={activeTab === 'settings'}
                  onClick={() => { setActiveTab('settings'); setShowMobileMenu(false); }}
                />
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col gap-4 sticky top-24 h-[calc(100vh-8rem)]">
          <PencilBox padding="p-2" className="flex-1">
            <nav className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
              <SidebarItem
                icon={<Home size={18} />}
                label="Edit Hero"
                active={activeTab === 'hero'}
                onClick={() => setActiveTab('hero')}
              />
              <SidebarItem
                icon={<Edit3 size={18} />}
                label="Edit About"
                active={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
              />
              <SidebarItem
                icon={<Award size={18} />}
                label="Edit Skills"
                active={activeTab === 'skills'}
                onClick={() => setActiveTab('skills')}
              />
              <SidebarItem
                icon={<FileText size={18} />}
                label="Edit Projects"
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
              />
              <SidebarItem
                icon={<FileText size={18} />}
                label="Manage Documents"
                active={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
              />
              <SidebarItem
                icon={<Bell size={18} />}
                label="Messages"
                active={activeTab === 'messages'}
                onClick={() => {
                  setActiveTab('messages');
                  onMarkMessagesRead();
                }}
                badge={unreadCount > 0}
              />
              <SidebarItem
                icon={<Mail size={18} />}
                label="Contact & Footer"
                active={activeTab === 'contact'}
                onClick={() => setActiveTab('contact')}
              />
              <SidebarItem
                icon={<Settings size={18} />}
                label="Settings"
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              />
              <SidebarItem icon={<Users size={18} />} label="Users" />
            </nav>
          </PencilBox>

          <PencilBox padding="p-4" className="bg-primary text-white border-primary">
            <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">System Status</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>CPU Usage</span>
                <span>24%</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[24%]"></div>
              </div>
            </div>
          </PencilBox>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {activeTab === 'dashboard' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Projects" value={projectsData.items.length.toString()} change="+2" />
                <StatCard title="New Messages" value={messages.length.toString()} change={`+${messages.length}`} />
                <StatCard title="Active Sessions" value="1" change="0%" />
              </div>

              <PencilBox className="min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                  <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline">View all</button>
                </div>

                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 italic">No recent activity.</div>
                  ) : (
                    messages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center pencil-border">
                            <User size={20} className="text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Message from {msg.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{msg.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReplyTo({ name: msg.name, email: msg.email })}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Quick Reply"
                          >
                            <Mail size={16} />
                          </button>
                          <span className={`text-xs px-2 py-1 rounded-full pencil-border ${msg.read ? 'bg-slate-50 dark:bg-slate-800 text-slate-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'}`}>
                            {msg.read ? 'Read' : 'New'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PencilBox>
            </>
          ) : activeTab === 'hero' ? (
            <div className="space-y-6">
              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Edit Hero Section</h3>
                  <p className="text-slate-500 dark:text-slate-400">Update the main introduction and call-to-action buttons.</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Hero Title</label>
                    <textarea
                      value={heroData.title}
                      onChange={(e) => onUpdateHero({ ...heroData, title: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all resize-none"
                      placeholder="e.g. Hi, I'm Ravi Kalauni"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Hero Subtitle</label>
                    <input
                      type="text"
                      value={heroData.subtitle}
                      onChange={(e) => onUpdateHero({ ...heroData, subtitle: e.target.value })}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      placeholder="e.g. Studying Bachelors in Computer Application (BCA)"
                    />
                  </div>
                </div>
              </PencilBox>

              <PencilBox>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Action Buttons</h3>
                    <p className="text-slate-500 dark:text-slate-400">Manage the buttons displayed in the hero section.</p>
                  </div>
                  <button
                    onClick={addHeroButton}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all"
                  >
                    <Plus size={18} />
                    Add Button
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {heroData.buttons.map((btn) => (
                    <div key={btn.id} className="p-6 pencil-border bg-slate-50 dark:bg-slate-800/50 relative group">
                      <button
                        onClick={() => removeHeroButton(btn.id)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Button Label</label>
                          <input
                            type="text"
                            value={btn.label}
                            onChange={(e) => updateHeroButton(btn.id, { label: e.target.value })}
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Button Link</label>
                          <input
                            type="text"
                            value={btn.link}
                            onChange={(e) => updateHeroButton(btn.id, { link: e.target.value })}
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm text-slate-600 dark:text-slate-400 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={btn.primary}
                            onChange={(e) => updateHeroButton(btn.id, { primary: e.target.checked })}
                            id={`primary-${btn.id}`}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                          />
                          <label htmlFor={`primary-${btn.id}`} className="text-sm text-slate-600 dark:text-slate-400 font-medium">Primary Style</label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PencilBox>

              <PencilBox>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Social Links</h3>
                    <p className="text-slate-500 dark:text-slate-400">Manage your social media icons and links.</p>
                  </div>
                  <button
                    onClick={addHeroSocial}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all"
                  >
                    <Share2 size={18} />
                    Add Social
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {heroData.socials.map((social) => (
                    <div key={social.id} className="p-4 pencil-border bg-slate-50 dark:bg-slate-800/50 relative group">
                      <button
                        onClick={() => removeHeroSocial(social.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Minus size={12} />
                      </button>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Platform</label>
                          <select
                            value={social.platform}
                            onChange={(e) => updateHeroSocial(social.id, { platform: e.target.value })}
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none"
                          >
                            <option value="github">GitHub</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="mail">Email</option>
                            <option value="twitter">Twitter</option>
                            <option value="globe">Website</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Link</label>
                          <input
                            type="text"
                            value={social.link}
                            onChange={(e) => updateHeroSocial(social.id, { link: e.target.value })}
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PencilBox>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 pencil-border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Instant Sync:</strong> Changes you make here are reflected on the main website immediately.
                </p>
              </div>
            </div>
          ) : activeTab === 'about' ? (
            <div className="space-y-6">
              <PencilBox className="min-h-[400px]">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Edit About Section</h3>
                  <p className="text-slate-500 dark:text-slate-400">Update the information displayed in the About section of your portfolio.</p>
                </div>

                <div className="space-y-8 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 flex items-center gap-2">
                      <Type size={16} />
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={aboutData.title}
                      onChange={(e) => onUpdateAbout({ ...aboutData, title: e.target.value })}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      placeholder="e.g. About Me"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 flex items-center gap-2">
                      <ImageIcon size={16} />
                      Profile Photo URL
                    </label>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={aboutData.image}
                          onChange={(e) => onUpdateAbout({ ...aboutData, image: e.target.value })}
                          className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                          placeholder="https://example.com/photo.jpg"
                        />
                        <p className="text-xs text-slate-400 mt-2 ml-1 italic">Pro tip: Use a direct link to an image file.</p>
                      </div>
                      <div className="w-20 h-20 rounded-full overflow-hidden pencil-border flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                        <img src={aboutData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 flex items-center gap-2">
                      <FileText size={16} />
                      About Text
                    </label>
                    <textarea
                      value={aboutData.text}
                      onChange={(e) => onUpdateAbout({ ...aboutData, text: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all resize-none"
                      placeholder="Write your bio here..."
                    />
                  </div>
                </div>
              </PencilBox>

              <PencilBox>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">About Cards</h3>
                    <p className="text-slate-500 dark:text-slate-400">Manage the cards displayed below the about text.</p>
                  </div>
                  <button
                    onClick={addCard}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all"
                  >
                    <Plus size={18} />
                    Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aboutData.cards.map((card) => (
                    <div key={card.id} className="p-6 pencil-border bg-slate-50 dark:bg-slate-800/50 relative group">
                      <button
                        onClick={() => removeCard(card.id)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Card Title</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => updateCard(card.id, { title: e.target.value })}
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-lg font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 flex justify-between items-center">
                            Bullet Points
                            <button
                              onClick={() => addBullet(card.id)}
                              className="text-blue-500 hover:text-blue-600 flex items-center gap-1 normal-case"
                            >
                              <ListPlus size={14} />
                              Add Point
                            </button>
                          </label>
                          <div className="space-y-2">
                            {card.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full flex-shrink-0" />
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateBullet(card.id, idx, e.target.value)}
                                  className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-400 outline-none border-b border-transparent focus:border-slate-300 transition-all"
                                />
                                <button
                                  onClick={() => removeBullet(card.id, idx)}
                                  className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PencilBox>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 pencil-border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Instant Sync:</strong> Changes you make here are reflected on the main website immediately.
                </p>
              </div>
            </div>
          ) : activeTab === 'skills' ? (
            <div className="space-y-6">
              <PencilBox>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Edit Skills</h3>
                    <p className="text-slate-500 dark:text-slate-400">Manage your skill categories and individual skills.</p>
                  </div>
                  <button
                    onClick={addSkillCategory}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all"
                  >
                    <Plus size={18} />
                    Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillsData.map((category) => (
                    <div key={category.id} className="p-6 pencil-border bg-slate-50 dark:bg-slate-800/50 relative group">
                      <button
                        onClick={() => removeSkillCategory(category.id)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Category Title</label>
                          <input
                            type="text"
                            value={category.title}
                            onChange={(e) => updateSkillCategory(category.id, e.target.value)}
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-lg font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 flex justify-between items-center">
                            Skills
                            <button
                              onClick={() => addSkill(category.id)}
                              className="text-blue-500 hover:text-blue-600 flex items-center gap-1 normal-case"
                            >
                              <Plus size={14} />
                              Add Skill
                            </button>
                          </label>
                          <div className="space-y-4">
                            {category.skills.map((skill, idx) => (
                              <div key={idx} className="space-y-2 p-3 bg-white dark:bg-slate-900/50 pencil-border relative group/skill">
                                <button
                                  onClick={() => removeSkill(category.id, idx)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/skill:opacity-100 transition-opacity shadow-sm"
                                >
                                  <Minus size={12} />
                                </button>
                                <div className="flex justify-between gap-2">
                                  <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => updateSkill(category.id, idx, { name: e.target.value })}
                                    className="flex-1 bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
                                    placeholder="Skill Name"
                                  />
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={skill.percentage}
                                      onChange={(e) => updateSkill(category.id, idx, { percentage: parseInt(e.target.value) || 0 })}
                                      className="w-12 bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 text-right outline-none"
                                      min="0"
                                      max="100"
                                    />
                                    <span className="text-xs text-slate-400">%</span>
                                  </div>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={skill.percentage}
                                  onChange={(e) => updateSkill(category.id, idx, { percentage: parseInt(e.target.value) })}
                                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-800 dark:accent-slate-200"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PencilBox>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 pencil-border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Instant Sync:</strong> Changes you make here are reflected on the main website immediately.
                </p>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <div className="space-y-6">
              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">General Settings</h3>
                  <p className="text-slate-500 dark:text-slate-400">Configure global website settings and appearance.</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Website Name (Logo Text)</label>
                    <input
                      type="text"
                      value={settingsData.websiteName}
                      onChange={(e) => onUpdateSettings({ ...settingsData, websiteName: e.target.value })}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 pencil-border">
                    <input
                      type="checkbox"
                      checked={settingsData.showLoginButton}
                      onChange={(e) => onUpdateSettings({ ...settingsData, showLoginButton: e.target.checked })}
                      id="show-login-btn"
                      className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <label htmlFor="show-login-btn" className="text-sm font-bold text-slate-700 dark:text-slate-300">Show Login Button on Navbar</label>
                  </div>
                </div>
              </PencilBox>

              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Admin Credentials</h3>
                  <p className="text-slate-500 dark:text-slate-400">Update your login information. Changes take effect immediately.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Admin Username</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={settingsData.adminUsername}
                        onChange={(e) => onUpdateSettings({ ...settingsData, adminUsername: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Admin Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        value={settingsData.adminPassword}
                        onChange={(e) => onUpdateSettings({ ...settingsData, adminPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </PencilBox>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 pencil-border border-yellow-200 dark:border-yellow-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Security Warning:</strong> Make sure to remember your new credentials. If you lose them, you will be locked out of the admin panel.
                </p>
              </div>
            </div>
          ) : activeTab === 'documents' ? (
            <div className="space-y-6">
              <PencilBox>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Manage Documents</h3>
                    <p className="text-slate-500 dark:text-slate-400">Add, edit, or delete documents from your collection.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newDoc = {
                        id: Date.now().toString(),
                        title: "New Document",
                        subtitle: "Subtitle here",
                        content: "Content here...",
                        likes: 0,
                        userLiked: false,
                        comments: [],
                        shares: 0,
                        date: new Date().toISOString().split('T')[0]
                      };
                      onUpdateDocuments([newDoc, ...documentsData]);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all"
                  >
                    <Plus size={18} /> Add Document
                  </button>
                </div>

                <div className="space-y-6">
                  {documentsData.map((doc, index) => (
                    <div key={doc.id} className="p-6 pencil-border bg-slate-50 dark:bg-slate-800/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                          <input
                            type="text"
                            value={doc.title}
                            onChange={(e) => {
                              const newDocs = documentsData.map((d, i) =>
                                i === index ? { ...d, title: e.target.value } : d
                              );
                              onUpdateDocuments(newDocs);
                            }}
                            className="w-full px-4 py-2 pencil-border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                          <input
                            type="text"
                            value={doc.subtitle}
                            onChange={(e) => {
                              const newDocs = documentsData.map((d, i) =>
                                i === index ? { ...d, subtitle: e.target.value } : d
                              );
                              onUpdateDocuments(newDocs);
                            }}
                            className="w-full px-4 py-2 pencil-border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content</label>
                        <RichTextEditor
                          value={doc.content}
                          onChange={(newContent) => {
                            const newDocs = documentsData.map((d, i) =>
                              i === index ? { ...d, content: newContent } : d
                            );
                            onUpdateDocuments(newDocs);
                          }}
                          className="min-h-[300px]"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Heart size={14} /> {doc.likes} Likes</span>
                          <span className="flex items-center gap-1"><MessageSquare size={14} /> {doc.comments.length} Comments</span>
                          <span className="flex items-center gap-1"><Share2 size={14} /> {doc.shares} Shares</span>
                        </div>
                        <button
                          onClick={() => onUpdateDocuments(documentsData.filter(d => d.id !== doc.id))}
                          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-bold"
                        >
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </PencilBox>
            </div>
          ) : activeTab === 'messages' ? (
            <div className="space-y-6">
              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Contact Messages</h3>
                  <p className="text-slate-500 dark:text-slate-400">View and manage messages sent through your contact form.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Message</th>
                        <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {messages.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500 italic">No messages yet.</td>
                        </tr>
                      ) : (
                        messages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-4 text-sm text-slate-500 whitespace-nowrap">{msg.date}</td>
                            <td className="py-4 px-4 text-sm font-bold text-slate-800 dark:text-slate-100">{msg.name}</td>
                            <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{msg.email}</td>
                            <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{msg.message}</td>
                            <td className="py-4 px-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => setReplyTo({ name: msg.name, email: msg.email })}
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-bold text-xs"
                                title="Reply via email"
                              >
                                <Mail size={14} />
                                Reply
                              </button>
                              <button
                                onClick={() => onDeleteMessage(msg.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete message"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </PencilBox>
            </div>
          ) : activeTab === 'contact' ? (
            <div className="space-y-6">
              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Edit Contact Section</h3>
                  <p className="text-slate-500 dark:text-slate-400">Update your contact information and form placeholders.</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Section Title</label>
                      <input
                        type="text"
                        value={contactData.title}
                        onChange={(e) => onUpdateContact({ ...contactData, title: e.target.value })}
                        className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Subtitle</label>
                      <input
                        type="text"
                        value={contactData.subtitle}
                        onChange={(e) => onUpdateContact({ ...contactData, subtitle: e.target.value })}
                        className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Description</label>
                    <textarea
                      value={contactData.description}
                      onChange={(e) => onUpdateContact({ ...contactData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={contactData.email}
                          onChange={(e) => onUpdateContact({ ...contactData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={contactData.phone}
                          onChange={(e) => onUpdateContact({ ...contactData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={contactData.location}
                          onChange={(e) => onUpdateContact({ ...contactData, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Name Placeholder</label>
                      <input
                        type="text"
                        value={contactData.namePlaceholder}
                        onChange={(e) => onUpdateContact({ ...contactData, namePlaceholder: e.target.value })}
                        className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email Placeholder</label>
                      <input
                        type="text"
                        value={contactData.emailPlaceholder}
                        onChange={(e) => onUpdateContact({ ...contactData, emailPlaceholder: e.target.value })}
                        className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </PencilBox>

              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Edit Footer</h3>
                  <p className="text-slate-500 dark:text-slate-400">Update the copyright text at the bottom of the page.</p>
                </div>

                <div className="max-w-2xl">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Footer Text</label>
                  <input
                    type="text"
                    value={footerData.text}
                    onChange={(e) => onUpdateFooter({ ...footerData, text: e.target.value })}
                    className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                  />
                </div>
              </PencilBox>
            </div>
          ) : (
            <div className="space-y-6">
              <PencilBox>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Edit Projects Section</h3>
                  <p className="text-slate-500 dark:text-slate-400">Update the heading and description of your projects showcase.</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Section Heading</label>
                    <input
                      type="text"
                      value={projectsData.heading}
                      onChange={(e) => onUpdateProjects({ ...projectsData, heading: e.target.value })}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Section Description</label>
                    <textarea
                      value={projectsData.description}
                      onChange={(e) => onUpdateProjects({ ...projectsData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all resize-none"
                    />
                  </div>
                </div>
              </PencilBox>

              <PencilBox>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Manage Projects</h3>
                    <p className="text-slate-500 dark:text-slate-400">Add, edit or remove projects from your portfolio.</p>
                  </div>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all"
                  >
                    <Plus size={18} />
                    Add Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectsData.items.map((project) => (
                    <div key={project.id} className="p-6 pencil-border bg-slate-50 dark:bg-slate-800/50 relative group">
                      <button
                        onClick={() => removeProject(project.id)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden pencil-border flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                            <img src={project.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Title</label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, { title: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Type</label>
                              <input
                                type="text"
                                value={project.type}
                                onChange={(e) => updateProject(project.id, { type: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm text-slate-600 dark:text-slate-400 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Thumbnail URL</label>
                            <input
                              type="text"
                              value={project.thumbnail}
                              onChange={(e) => updateProject(project.id, { thumbnail: e.target.value })}
                              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Link</label>
                            <input
                              type="text"
                              value={project.link}
                              onChange={(e) => updateProject(project.id, { link: e.target.value })}
                              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 outline-none focus:border-slate-800 dark:focus:border-slate-200 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PencilBox>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 pencil-border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Instant Sync:</strong> Changes you make here are reflected on the main website immediately.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Reply Modal */}
      {replyTo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg pencil-border overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Reply to {replyTo.name}</h3>
              <button
                onClick={() => setReplyTo(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <Minus size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">To</label>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 pencil-border text-slate-700 dark:text-slate-300 text-sm">
                  {replyTo.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Message Content</label>
                <textarea
                  autoFocus
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 pencil-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 transition-all resize-none"
                  placeholder="Type your reply here..."
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => setReplyTo(null)}
                className="px-6 py-2 text-slate-600 dark:text-slate-400 font-bold hover:underline"
              >
                Cancel
              </button>
              <button
                disabled={isSending || !replyContent.trim()}
                onClick={() => {
                  setIsSending(true);
                  setTimeout(() => {
                    setIsSending(false);
                    setReplyTo(null);
                    setReplyContent('');
                    alert(`Email sent to ${replyTo.email} successfully!`);
                  }, 1500);
                }}
                className="px-8 py-2 bg-primary text-white font-bold pencil-border flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSending ? 'Sending...' : 'Send Email'}
                {!isSending && <Send size={18} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick, badge = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, badge?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${active ? 'bg-primary text-white pencil-border' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
  </button>
);

const Zap = ({ size, className }: { size: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const StatCard = ({ title, value, change }: { title: string, value: string, change: string }) => (
  <PencilBox padding="p-5">
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h4>
      <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {change}
      </span>
    </div>
  </PencilBox>
);
