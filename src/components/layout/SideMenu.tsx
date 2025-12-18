import React from 'react';
import { Type, LayoutGrid, Palette, Settings, Image } from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';

type MenuTab = 'content' | 'blocks' | 'body' | 'brand' | 'media';

interface SideMenuProps {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
  theme: Theme;
}

export const SideMenu: React.FC<SideMenuProps> = ({ activeTab, onTabChange, theme }) => {
  const menuItems: { id: MenuTab; icon: React.ReactNode; label: string }[] = [
    { id: 'content', icon: <Type style={{ width: 20, height: 20 }} />, label: 'Content' },
    { id: 'blocks', icon: <LayoutGrid style={{ width: 20, height: 20 }} />, label: 'Blocks' },
    { id: 'media', icon: <Image style={{ width: 20, height: 20 }} />, label: 'Media' },
    { id: 'body', icon: <Palette style={{ width: 20, height: 20 }} />, label: 'Body' },
    { id: 'theme', icon: <Settings style={{ width: 20, height: 20 }} />, label: 'Theme' },
  ];

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '64px',
        backgroundColor: theme.bg,
        borderLeft: `1px solid ${theme.border}`,
      }}
    >
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '16px 8px',
              border: 'none',
              backgroundColor: isActive ? theme.primaryBg : 'transparent',
              color: isActive ? theme.primaryText : theme.textMuted,
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderLeft: isActive ? `2px solid ${theme.primary}` : '2px solid transparent',
            }}
            title={item.label}
          >
            {item.icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
