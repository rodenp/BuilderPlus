import React, { useState } from 'react';
import { SideMenu } from './SideMenu';
import { ContentPanel } from '../panels/ContentPanel';
// import { PropertyPanel } from '../panels/PropertyPanel'; // Uncomment when ready

// Temporary theme until we migrate the full theme system
const defaultTheme = {
    bg: '#1e293b', // slate-800
    bgSecondary: '#0f172a', // slate-900
    bgTertiary: '#020617', // slate-950
    border: '#334155', // slate-700
    borderSecondary: '#1e293b', // slate-800
    text: '#f8fafc', // slate-50
    textSecondary: '#94a3b8', // slate-400
    textMuted: '#64748b', // slate-500
    primary: '#3b82f6', // blue-500
    primaryBg: 'rgba(59, 130, 246, 0.1)',
    primaryText: '#60a5fa', // blue-400
    accent: '#d946ef', // fuchsia-500
    marginBg: '#0f172a',
    marginBorder: '#334155',
    // Add other required properties with dummy values for now
    fontFamily: 'Inter',
    fontSize: '14px',
    // ... expand as needed based on Theme interface
} as any;

interface BuilderLayoutProps {
    children: React.ReactNode;
    removeComponent: (id: string) => void;
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ children, removeComponent }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'blocks' | 'body' | 'brand' | 'media'>('content');
    const [showLeftPanel, setShowLeftPanel] = useState(true);

    const handleTabChange = (tab: any) => {
        if (activeTab === tab && showLeftPanel) {
            setShowLeftPanel(false);
        } else {
            setActiveTab(tab);
            setShowLeftPanel(true);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: defaultTheme.bgSecondary }}>
            {/* Side Menu (Left Strip) */}
            <SideMenu activeTab={activeTab} onTabChange={handleTabChange} theme={defaultTheme} />

            {/* Side Drawer (Content Panel) */}
            {showLeftPanel && (
                <div style={{
                    borderRight: `1px solid ${defaultTheme.border}`,
                    backgroundColor: defaultTheme.bg,
                    display: activeTab === 'content' ? 'block' : 'none'
                }}>
                    <ContentPanel theme={defaultTheme} removeComponent={removeComponent} />
                </div>
            )}

            {/* Main Canvas Area */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>

            {/* Right Properties Panel - Placeholder */}
            <div style={{
                width: '280px',
                borderLeft: `1px solid ${defaultTheme.border}`,
                backgroundColor: defaultTheme.bg,
                display: 'none' // Hidden for now until integrated
            }}>
                {/* <PropertyPanel /> */}
                <div style={{ padding: '20px', color: defaultTheme.textMuted }}>Properties Panel</div>
            </div>
        </div>
    );
};
