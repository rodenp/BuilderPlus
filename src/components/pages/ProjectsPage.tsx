import React, { useState, useRef } from 'react';
import {
  Plus,
  FileText,
  Mail,
  Globe,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  Upload,
  Copy,
  Calendar,
  Clock,
  X,
  Check,
  AlertCircle,
  Sun,
  Moon,
  FileCode,
} from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';
import type { Project, ProjectType } from '../../types/project';
import {
  createProject,
  getProjectTypeLabel,
  getProjectTypeDescription,
  exportProject,
  importProject,
} from '../../types/project';
import { generateCanvasHTML } from '../../utils/htmlExport';

interface ProjectsPageProps {
  theme: Theme;
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  onOpenProject: (project: Project) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

type FilterType = 'all' | ProjectType;

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  theme,
  projects,
  onProjectsChange,
  onOpenProject,
  isDarkMode,
  onDarkModeToggle,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<ProjectType>('website');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === 'all' || project.type === filter;
    const matchesSearch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get icon for project type
  const getTypeIcon = (type: ProjectType, size = 20) => {
    const style = { width: size, height: size };
    switch (type) {
      case 'form':
        return <FileText style={style} />;
      case 'email':
        return <Mail style={style} />;
      case 'website':
        return <Globe style={style} />;
    }
  };

  // Handle create project
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const project = createProject(
      newProjectName.trim(),
      newProjectType,
      newProjectDescription.trim() || undefined
    );

    onProjectsChange([...projects, project]);
    setShowCreateModal(false);
    setNewProjectName('');
    setNewProjectType('website');
    setNewProjectDescription('');

    // Open the newly created project
    onOpenProject(project);
  };

  // Handle delete project
  const handleDeleteProject = (id: string) => {
    onProjectsChange(projects.filter((p) => p.id !== id));
    setActiveMenu(null);
  };

  // Handle duplicate project
  const handleDuplicateProject = (project: Project) => {
    const duplicate = createProject(
      `${project.name} (Copy)`,
      project.type,
      project.description
    );
    duplicate.data = JSON.parse(JSON.stringify(project.data));
    onProjectsChange([...projects, duplicate]);
    setActiveMenu(null);
  };

  // Handle export project
  const handleExportProject = (project: Project) => {
    const json = exportProject(project);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveMenu(null);
  };

  // Handle download HTML
  const handleDownloadHTML = async (project: Project) => {
    try {
      const html = await generateCanvasHTML(project);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setActiveMenu(null);
    } catch (error) {
      console.error('Failed to generate HTML:', error);
      // Could add user notification here
    }
  };

  // Handle import project
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const project = importProject(content);
      if (project) {
        // Generate new ID to avoid conflicts
        project.id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        project.name = `${project.name} (Imported)`;
        project.createdAt = new Date();
        project.updatedAt = new Date();
        onProjectsChange([...projects, project]);
        setShowImportModal(false);
        setImportError(null);
      } else {
        setImportError('Invalid project file. Please select a valid JSON file.');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Styles
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: theme.primary,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.15s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.bgSecondary,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    color: theme.text,
    fontSize: '14px',
    outline: 'none',
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: isActive ? theme.primaryBg : 'transparent',
    color: isActive ? theme.primaryText : theme.textMuted,
    border: isActive ? `1px solid ${theme.primary}` : `1px solid transparent`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.15s',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: theme.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px 32px',
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: theme.text,
              }}
            >
              My Projects
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '14px',
                color: theme.textMuted,
              }}
            >
              Create and manage your forms, emails, and websites
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onDarkModeToggle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: theme.bgSecondary,
                color: isDarkMode ? '#facc15' : theme.textMuted,
                cursor: 'pointer',
              }}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun style={{ width: 18, height: 18 }} />
              ) : (
                <Moon style={{ width: 18, height: 18 }} />
              )}
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              style={secondaryButtonStyle}
            >
              <Upload style={{ width: 16, height: 16 }} />
              Import
            </button>
            <button onClick={() => setShowCreateModal(true)} style={buttonStyle}>
              <Plus style={{ width: 16, height: 16 }} />
              New Project
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilter('all')}
              style={filterButtonStyle(filter === 'all')}
            >
              All
            </button>
            <button
              onClick={() => setFilter('website')}
              style={filterButtonStyle(filter === 'website')}
            >
              <Globe style={{ width: 14, height: 14 }} />
              Websites
            </button>
            <button
              onClick={() => setFilter('email')}
              style={filterButtonStyle(filter === 'email')}
            >
              <Mail style={{ width: 14, height: 14 }} />
              Emails
            </button>
            <button
              onClick={() => setFilter('form')}
              style={filterButtonStyle(filter === 'form')}
            >
              <FileText style={{ width: 14, height: 14 }} />
              Forms
            </button>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
                color: theme.textMuted,
              }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                ...inputStyle,
                paddingLeft: '40px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px 32px',
        }}
      >
        {filteredProjects.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                backgroundColor: theme.bgSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <FileText style={{ width: 36, height: 36, color: theme.textMuted }} />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
                color: theme.text,
              }}
            >
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h2>
            <p
              style={{
                margin: '8px 0 24px',
                fontSize: '14px',
                color: theme.textMuted,
                maxWidth: '400px',
              }}
            >
              {searchQuery
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Create your first project to start building beautiful forms, emails, and websites.'}
            </p>
            {!searchQuery && (
              <button onClick={() => setShowCreateModal(true)} style={buttonStyle}>
                <Plus style={{ width: 16, height: 16 }} />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onOpenProject(project)}
                style={{
                  position: 'relative',
                  backgroundColor: theme.bgSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: '140px',
                    backgroundColor: theme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${theme.border}`,
                    borderRadius: '12px 12px 0 0',
                    overflow: 'hidden',
                  }}
                >
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        backgroundColor: theme.primaryBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.primary,
                      }}
                    >
                      {getTypeIcon(project.type, 28)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 600,
                          color: theme.text,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {project.name}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '4px',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            backgroundColor: theme.bg,
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: theme.textMuted,
                            fontWeight: 500,
                          }}
                        >
                          {getTypeIcon(project.type, 12)}
                          {getProjectTypeLabel(project.type)}
                        </span>
                      </div>
                    </div>

                    {/* Menu button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === project.id ? null : project.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: theme.textMuted,
                        }}
                      >
                        <MoreVertical style={{ width: 16, height: 16 }} />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenu === project.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            width: '160px',
                            backgroundColor: theme.bg,
                            borderRadius: '8px',
                            border: `1px solid ${theme.border}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={() => {
                              onOpenProject(project);
                              setActiveMenu(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: theme.text,
                              fontSize: '13px',
                              textAlign: 'left',
                            }}
                          >
                            <Edit2 style={{ width: 14, height: 14 }} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateProject(project)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: theme.text,
                              fontSize: '13px',
                              textAlign: 'left',
                            }}
                          >
                            <Copy style={{ width: 14, height: 14 }} />
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleExportProject(project)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: theme.text,
                              fontSize: '13px',
                              textAlign: 'left',
                            }}
                          >
                            <Download style={{ width: 14, height: 14 }} />
                            Export JSON
                          </button>
                          <button
                            onClick={() => handleDownloadHTML(project)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: theme.text,
                              fontSize: '13px',
                              textAlign: 'left',
                            }}
                          >
                            <FileCode style={{ width: 14, height: 14 }} />
                            Download HTML
                          </button>
                          <div
                            style={{
                              height: '1px',
                              backgroundColor: theme.border,
                              margin: '4px 0',
                            }}
                          />
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444',
                              fontSize: '13px',
                              textAlign: 'left',
                            }}
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p
                      style={{
                        margin: '0 0 12px',
                        fontSize: '13px',
                        color: theme.textMuted,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {project.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '12px',
                      color: theme.textMuted,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar style={{ width: 12, height: 12 }} />
                      {formatDate(project.createdAt)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: 12, height: 12 }} />
                      {formatDate(project.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '480px',
              backgroundColor: theme.bg,
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: theme.text }}>
                Create New Project
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
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

            {/* Modal content */}
            <div style={{ padding: '24px' }}>
              {/* Project type selection */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.text,
                    marginBottom: '8px',
                  }}
                >
                  Project Type
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {(['website', 'email', 'form'] as ProjectType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewProjectType(type)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px',
                        backgroundColor:
                          newProjectType === type ? theme.primaryBg : theme.bgSecondary,
                        border:
                          newProjectType === type
                            ? `2px solid ${theme.primary}`
                            : `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: newProjectType === type ? theme.primaryText : theme.text,
                        transition: 'all 0.15s',
                      }}
                    >
                      {getTypeIcon(type, 24)}
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>
                        {getProjectTypeLabel(type)}
                      </span>
                    </button>
                  ))}
                </div>
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: '12px',
                    color: theme.textMuted,
                  }}
                >
                  {getProjectTypeDescription(newProjectType)}
                </p>
              </div>

              {/* Project name */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.text,
                    marginBottom: '8px',
                  }}
                >
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  style={inputStyle}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.text,
                    marginBottom: '8px',
                  }}
                >
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Brief description of your project..."
                  style={{
                    ...inputStyle,
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  style={{
                    ...buttonStyle,
                    opacity: newProjectName.trim() ? 1 : 0.5,
                    cursor: newProjectName.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Check style={{ width: 16, height: 16 }} />
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
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
            setShowImportModal(false);
            setImportError(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '400px',
              backgroundColor: theme.bg,
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: theme.text }}>
                Import Project
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
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

            {/* Modal content */}
            <div style={{ padding: '24px' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '32px',
                  border: `2px dashed ${theme.border}`,
                  borderRadius: '12px',
                  backgroundColor: theme.bgSecondary,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Upload
                  style={{
                    width: 40,
                    height: 40,
                    color: theme.textMuted,
                    marginBottom: '12px',
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: theme.text,
                    marginBottom: '4px',
                  }}
                >
                  Click to select a file
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: theme.textMuted }}>
                  JSON files only
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  style={{ display: 'none' }}
                />
              </div>

              {importError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '13px',
                  }}
                >
                  <AlertCircle style={{ width: 16, height: 16 }} />
                  {importError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};
