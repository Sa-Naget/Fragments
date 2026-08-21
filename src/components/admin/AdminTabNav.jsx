export default function AdminTabNav({ activeTab, setActiveTab }) {
  const tabs = ['Characters', 'AUs', 'Posts'];

  return (
    <nav style={{
      display: 'flex',
      gap: '2rem',
      borderBottom: '1px solid var(--border)',
      paddingBottom: '1rem',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab.toLowerCase())}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.95rem',
            padding: '0.75rem 0',
            cursor: 'pointer',
            color: activeTab === tab.toLowerCase() 
              ? 'var(--text-primary)' 
              : 'var(--text-secondary)',
            fontWeight: activeTab === tab.toLowerCase() ? '500' : '400',
            borderBottom: activeTab === tab.toLowerCase()
              ? '2px solid var(--text-primary)'
              : '2px solid transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}