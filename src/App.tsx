import { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/layout/Header';
import { Canvas } from './components/layout/Canvas';
import { SideMenu } from './components/layout/SideMenu';
import { SettingsPanel } from './components/layout/SettingsPanel';
import { PreviewMode } from './components/layout/PreviewMode';
import type { PanelPosition } from './components/layout/SettingsPanel';
import { PropertyPanel, getTheme } from './components/panels/property-panel';
import { BodyPanel } from './components/panels/BodyPanel';
import { ContentPanel } from './components/panels/ContentPanel';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { defaultBodySettings } from './types/bodySettings';
import type { BodySettings } from './types/bodySettings';
import type { CanvasComponent } from './types/component-types';
import type { Project } from './types/project';
import type { AppMode } from './types/app-mode';
import { useBuilderState } from './hooks/useBuilderState';
import './MockupTheme.css'; // Global scope for Mockup theme

import { MediaGallery } from './components/panels/MediaGallery';
import { ThemePanel } from './components/panels/ThemePanel';
import type { MediaItem, MediaType } from './types/media';
import { X } from 'lucide-react';

type MenuTab = 'content' | 'blocks' | 'body' | 'theme' | 'media';
type AppPage = 'projects' | 'editor';

function App() {

  // Current page
  const [currentPage, setCurrentPage] = useState<AppPage>('projects');
  // Current project being edited
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  // Projects list
  const [projects, setProjects] = useState<Project[]>([]);

  // UI dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Canvas dark mode
  const [isCanvasDark, setIsCanvasDark] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Active side menu tab
  const [activeTab, setActiveTab] = useState<MenuTab>('content');
  // Panel position
  const [panelPosition, setPanelPosition] = useState<PanelPosition>('right');
  // Settings panel open state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Body settings state
  const [bodySettings, setBodySettings] = useState<BodySettings>(defaultBodySettings);

  // Builder State
  const {
    components,
    setComponents,
    moveComponent,
    addComponent,
    removeComponent,
    findParent,
    findContainer,
    updateComponent // Exporting this so components can update themselves
  } = useBuilderState([]);

  // Selected component
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // App mode
  const [appMode, setAppMode] = useState<AppMode>('edit');

  // Media gallery state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('builder_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Rehydrate Dates
        const restored = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        setProjects(restored);
      } catch (e) {
        console.error('Failed to load projects', e);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('builder_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Handle saving current work when going back or auto-saving
  const saveCurrentProjectState = useCallback(() => {
    if (!currentProject) return;

    setProjects(prev => prev.map(p => {
      if (p.id === currentProject.id) {
        return {
          ...p,
          updatedAt: new Date(),
          data: {
            ...p.data,
            components,
            bodySettings,
            mediaItems
          }
        };
      }
      return p;
    }));
  }, [currentProject, components, bodySettings, mediaItems]);

  // Handle Back to Projects
  const handleBackToProjects = useCallback(() => {
    saveCurrentProjectState();
    setCurrentPage('projects');
    setCurrentProject(null);
  }, [saveCurrentProjectState]);

  // Media picker modal state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((item: MediaItem) => void) | null>(null);
  const [mediaPickerAllowedTypes, setMediaPickerAllowedTypes] = useState<MediaType[]>(['image', 'video', 'audio', 'file']);

  // Open media gallery picker modal
  const openMediaGallery = useCallback((onSelect: (item: MediaItem) => void, allowedTypes: MediaType[] = ['image']) => {
    setMediaPickerCallback(() => onSelect);
    setMediaPickerAllowedTypes(allowedTypes);
    setMediaPickerOpen(true);
  }, []);

  // Handle media insert from picker
  const handleMediaPickerInsert = useCallback((item: MediaItem) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(item);
    }
    setMediaPickerOpen(false);
    setMediaPickerCallback(null);
  }, [mediaPickerCallback]);

  const theme = getTheme(isDarkMode);

  // Context value to pass down for DnD operations
  const builderContext = {
    components,
    moveComponent,
    addComponent,
    removeComponent,
    updateComponent, // Add to context
    findParent,
    findContainer,
    selectComponent: setSelectedComponentId,
    selectedId: selectedComponentId,
    appMode
  };

  const handleSelectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const handleComponentsChange = useCallback((newComponents: CanvasComponent[]) => {
    setComponents(newComponents);
  }, [setComponents]);

  // Render the appropriate panel content based on active tab and selection
  const renderActivePanel = () => {
    // If a component is selected and we are in edit mode, show the property panel
    if (selectedComponentId && activeTab === 'content') {
      return (
        <div style={{ width: '300px', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, backgroundColor: theme.bg }}>
          <PropertyPanel
            theme={theme}
            component={findContainer(selectedComponentId!) || { id: 'dummy', type: 'container', props: {} } as any}
            components={components}
            onComponentChange={(updated) => {
              // Use the central updateComponent function to ensure consistency
              builderContext.updateComponent(updated.id, updated);
            }}
            onDeselect={() => setSelectedComponentId(null)}
            onOpenMediaGallery={openMediaGallery}
            isCanvasDark={isCanvasDark}
            bodySettings={bodySettings}
          />
        </div>
      );
    }

    const panelStyle = { width: '300px', height: '100%', borderLeft: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, backgroundColor: theme.bg };

    switch (activeTab) {
      case 'content':
        return (
          <div style={panelStyle}>
            <ContentPanel theme={theme} removeComponent={removeComponent} />
          </div>
        );
      case 'body':
        return (
          <div style={panelStyle}>
            <BodyPanel
              theme={theme}
              bodySettings={bodySettings}
              onBodySettingsChange={setBodySettings}
              isCanvasDark={isCanvasDark}
            />
          </div>
        );
      case 'theme':
        return (
          <div style={panelStyle}>
            <ThemePanel
              theme={theme}
              bodySettings={bodySettings}
              onBodySettingsChange={setBodySettings}
              isCanvasDark={isCanvasDark}
            />
          </div>
        );
      case 'media':
        return (
          <div style={panelStyle}>
            <MediaGallery
              theme={theme}
              items={mediaItems}
              onItemsChange={setMediaItems}
              selectedId={selectedMediaId}
              onSelect={setSelectedMediaId}
              title="Media Library"
            />
          </div>
        );
      default:
        // Placeholder for other tabs
        return <div style={panelStyle} />;
    }
  };

  if (currentPage === 'projects') {
    return (
      <ProjectsPage
        onOpenProject={(project) => {
          setCurrentProject(project);
          setCurrentPage('editor');
          if (project.data.components) setComponents(project.data.components);
          if (project.data.bodySettings) setBodySettings(project.data.bodySettings);
          // Initialize media items if present, or empty
          setMediaItems(project.data.mediaItems || []);
        }}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        theme={theme}
        projects={projects}
        onProjectsChange={setProjects}
      />
    );
  }

  // Construct a temporary project object for PreviewMode if needed
  const previewProject: Project = currentProject || {
    id: 'preview',
    name: 'Preview',
    type: 'website', // Default type
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      components,
      bodySettings,
      mediaItems: []
    }
  };
  // Ensure the preview project has the latest state
  previewProject.data.components = components;
  previewProject.data.bodySettings = bodySettings;




  const renderPanels = () => {
    if (appMode === 'preview') {
      return (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Canvas
            isCanvasDark={isCanvasDark}
            onCanvasDarkToggle={() => setIsCanvasDark(!isCanvasDark)}
            theme={theme}
            bodySettings={bodySettings}
            components={components}
            onComponentsChange={handleComponentsChange}
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectComponent}
            builderContext={builderContext}
          />
        </div>
      );
    }

    const sideMenu = (
      <SideMenu
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab as any);
          // If switching tabs, maybe deselect component?
          // setSelectedComponentId(null); // Optional: mimics behaviour where tabs take precedence
        }}
        theme={theme}
      />
    );

    const activePanel = renderActivePanel();

    // Canvas takes remaining space
    const canvas = (
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Canvas
          isCanvasDark={isCanvasDark}
          onCanvasDarkToggle={() => setIsCanvasDark(!isCanvasDark)}
          theme={theme}
          bodySettings={bodySettings}
          components={components}
          onComponentsChange={handleComponentsChange}
          selectedComponentId={selectedComponentId}
          onSelectComponent={handleSelectComponent}
          builderContext={builderContext}
        />
      </div>
    );

    if (panelPosition === 'left') {
      return (
        <>
          {sideMenu}
          {activePanel}
          {canvas}
        </>
      );
    } else {
      return (
        <>
          {canvas}
          {activePanel}
          {sideMenu}
        </>
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: theme.bgSecondary,
          color: theme.text
        }}
      >
        {/* Header */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
          <Header
            theme={theme}
            isDarkMode={isDarkMode}
            onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
            onPreviewClick={() => setAppMode('preview')}
            onSettingsClick={() => setIsSettingsOpen(true)}
            mode={appMode}
            onBack={handleBackToProjects}
          />
        </div>

        {/* Main Content (below header) */}
        <div style={{ display: 'flex', width: '100%', paddingTop: '56px', height: '100%' }}>
          {renderPanels()}
        </div>

        {/* Settings Panel Overlay */}
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          panelPosition={panelPosition}
          onPanelPositionChange={setPanelPosition}
        />

        {/* Preview Mode Overlay */}
        {appMode === 'preview' && (
          <PreviewMode
            onExitPreview={() => setAppMode('edit')}
            project={previewProject}
            isCanvasDark={isCanvasDark}
            theme={theme as any}
          />
        )}

        {/* Media Picker Modal */}
        {mediaPickerOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
            }}
            onClick={() => {
              setMediaPickerOpen(false);
              setMediaPickerCallback(null);
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '400px',
                maxHeight: '80vh',
                backgroundColor: theme.bg,
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.text }}>
                  Select Media
                </h3>
                <button
                  onClick={() => {
                    setMediaPickerOpen(false);
                    setMediaPickerCallback(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: theme.bgSecondary,
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.textMuted,
                  }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              {/* Media gallery content */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <MediaGallery
                  theme={theme}
                  items={mediaItems}
                  onItemsChange={setMediaItems}
                  selectedId={selectedMediaId}
                  onSelect={setSelectedMediaId}
                  onInsert={handleMediaPickerInsert}
                  allowedTypes={mediaPickerAllowedTypes}
                  title=""
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
