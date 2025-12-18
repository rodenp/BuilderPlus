// Project types
export type ProjectType = 'form' | 'email' | 'website';

// Project interface
export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  // The actual content data
  data: ProjectData;
}

// Project data contains the components and settings
export interface ProjectData {
  components: import('./component-types').CanvasComponent[];
  bodySettings: import('./bodySettings').BodySettings;
  mediaItems: import('./media').MediaItem[];
}

// Generate unique project ID
export const generateProjectId = (): string => {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get project type label
export const getProjectTypeLabel = (type: ProjectType): string => {
  switch (type) {
    case 'form':
      return 'Form';
    case 'email':
      return 'Email';
    case 'website':
      return 'Website';
  }
};

// Get project type description
export const getProjectTypeDescription = (type: ProjectType): string => {
  switch (type) {
    case 'form':
      return 'Create interactive forms with validation';
    case 'email':
      return 'Design responsive email templates';
    case 'website':
      return 'Build complete web pages';
  }
};

// Export project to JSON
export const exportProject = (project: Project): string => {
  return JSON.stringify(project, null, 2);
};

// Import project from JSON
export const importProject = (json: string): Project | null => {
  try {
    const parsed = JSON.parse(json);
    // Validate required fields
    if (!parsed.id || !parsed.name || !parsed.type || !parsed.data) {
      return null;
    }
    // Convert date strings back to Date objects
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  } catch {
    return null;
  }
};

// Create a new project
export const createProject = (
  name: string,
  type: ProjectType,
  description?: string
): Project => {
  const now = new Date();
  return {
    id: generateProjectId(),
    name,
    type,
    description,
    createdAt: now,
    updatedAt: now,
    data: {
      components: [],
      bodySettings: {
        backgroundColor: null,
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Inter',
        baseFontSize: '16',
        baseLineHeight: '1.5',
        textColor: null,
        linkColor: null,
        contentWidth: '1200',
        contentPadding: '20',
        pageTitle: '',
        metaDescription: '',
        faviconUrl: '',
      },
      mediaItems: [],
    },
  };
};
