import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContent';
import CharacterTab from '../components/admin/CharacterTab';
import AUTab from '../components/admin/AUTab';
import PostTab from '../components/admin/PostTab';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('characters');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const getUserName = (email) => {
    const name = email.split('-')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const selectTab = (tab) => {
    setActiveTab(tab);
    setIsMobileNavOpen(false);
  };

  useEffect(() => {
    const handleSectionShortcut = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      const shortcutTabs = { '1': 'characters', '2': 'aus', '3': 'posts' };
      if (shortcutTabs[event.key]) selectTab(shortcutTabs[event.key]);
    };

    window.addEventListener('keydown', handleSectionShortcut);
    return () => window.removeEventListener('keydown', handleSectionShortcut);
  }, []);

  const activeTabLabel = {
    characters: 'Characters',
    aus: 'Alternate universes',
    posts: 'Posts & fragments',
  }[activeTab];

  if (!user) {
    navigate('/admin');
    return null;
  }

  return (
    <div className={`admin-dashboard${isSidebarCollapsed ? ' is-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar${isMobileNavOpen ? ' is-open' : ''}`}>
        <div className="archive-mark">
          <button
            className="admin-sidebar__toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? 'Expand archive index' : 'Collapse archive index'}
            aria-expanded={!isSidebarCollapsed}
          >
            <span />
            <span />
          </button>
          <span className="archive-mark__eyebrow">Private collection</span>
          <h2>Archive Control</h2>
          <span className="archive-mark__number">No. 004 / 2026</span>
        </div>
        
        <button
          className="admin-mobile-toggle"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          aria-expanded={isMobileNavOpen}
        >
          <span>Index</span><strong>{isMobileNavOpen ? 'Close' : 'Open'}</strong>
        </button>
        <nav className="admin-nav" aria-label="Archive sections">
          <span className="admin-nav__label">Index</span>
          {[
            ['characters', 'Characters', '01'],
            ['aus', 'Alternate universes', '02'],
            ['posts', 'Posts & fragments', '03'],
          ].map(([tab, label, number]) => (
            <button
              className={activeTab === tab ? 'admin-nav__item is-active' : 'admin-nav__item'}
              key={tab}
              onClick={() => selectTab(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
              title={`Open ${label}`}
            >
              <span className="admin-nav__number">{number}</span>
              <span className="admin-nav__text">{label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <span className="admin-sidebar__status"><i /> Cataloguing desk online</span>
          <button className="admin-text-button" onClick={handleLogout}>Log out <span>↗</span></button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div>
            <span className="admin-header__kicker">The SnuggleStack archive / working index</span>
            <h1>Hello, {getUserName(user.email)}</h1>
            <p>Record, revise, and preserve the fragments that belong here.</p>
          </div>
          <div className="admin-header__date">Filed<br /><strong>21.08.26</strong></div>
        </header>

        {/* Content area */}
        <section className="admin-content" data-active-tab={activeTab}>
          <div className="admin-content__rule"><span>Current register / {activeTabLabel}</span><span>Restricted access</span></div>
          <div className="admin-records">
            {activeTab === 'characters' && <CharacterTab />}
            {activeTab === 'aus' && <AUTab />}
            {activeTab === 'posts' && <PostTab />}
          </div>
        </section>
      </main>
    </div>
  );
}