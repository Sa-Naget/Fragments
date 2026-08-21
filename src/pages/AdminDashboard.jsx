import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContent';
import CharacterTab from '../components/admin/CharacterTab';
import AUTab from '../components/admin/AUTab';
import PostTab from '../components/admin/PostTab';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('characters');

  if (!user) {
    navigate('/admin');
    return null;
  }

  const getUserName = (email) => {
    const name = email.split('-')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--surface-0)' }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        borderRight: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ fontSize: '1rem', margin: '0 0 2rem', fontWeight: '500' }}>Archive Control</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button style={{
            background: activeTab === 'characters' ? 'var(--surface-1)' : 'transparent',
            border: 'none',
            textAlign: 'left',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: activeTab === 'characters' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'characters' ? '500' : '400',
            transition: 'all 0.2s ease',
          }} onClick={() => setActiveTab('characters')}>
            Characters
          </button>
          <button style={{
            background: activeTab === 'aus' ? 'var(--surface-1)' : 'transparent',
            border: 'none',
            textAlign: 'left',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: activeTab === 'aus' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'aus' ? '500' : '400',
            transition: 'all 0.2s ease',
          }} onClick={() => setActiveTab('aus')}>
            AUs
          </button>
          <button style={{
            background: activeTab === 'posts' ? 'var(--surface-1)' : 'transparent',
            border: 'none',
            textAlign: 'left',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: activeTab === 'posts' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'posts' ? '500' : '400',
            transition: 'all 0.2s ease',
          }} onClick={() => setActiveTab('posts')}>
            Posts
          </button>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button style={{
            background: 'none',
            border: 'none',
            textAlign: 'left',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}>
            Settings
          </button>
          <button onClick={handleLogout} style={{
            background: 'none',
            border: 'none',
            textAlign: 'left',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}>
            Log out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          borderBottom: '1px solid var(--border)',
          padding: '2rem',
          background: 'var(--surface-1)',
        }}>
          <h1 style={{ fontSize: '1.6rem', margin: '0 0 0.5rem', fontWeight: '600' }}>
            Hello, {getUserName(user.email)}
          </h1>
          <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Any new records today?
          </p>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          {activeTab === 'characters' && <CharacterTab />}
          {activeTab === 'aus' && <AUTab />}
          {activeTab === 'posts' && <PostTab />}
        </div>
      </div>
    </div>
  );
}