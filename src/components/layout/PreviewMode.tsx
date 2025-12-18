import React, { useState, useEffect } from 'react';
import type { Project } from '../../types/project';
import { Edit3 } from 'lucide-react';
import { generateCanvasContent } from '../../utils/htmlExport';
import { getDefaultCanvasColors } from '../../types/bodySettings';

interface PreviewModeProps {
  project: Project;
  isCanvasDark: boolean;
  theme: {
    bg: string;
    text: string;
    border: string;
  };
  onExitPreview: () => void;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({
  project,
  isCanvasDark,
  theme,
  onExitPreview,
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateHTML = async () => {
      try {
        setIsLoading(true);
        const html = await generateCanvasContent(project);
        setHtmlContent(html);
      } catch (error) {
        console.error('Failed to generate HTML:', error);
        setHtmlContent('<p>Failed to generate preview</p>');
      } finally {
        setIsLoading(false);
      }
    };

    generateHTML();
  }, [project]);

  const { bodySettings } = project.data;
  const defaultColors = getDefaultCanvasColors(isCanvasDark);
  const canvasTheme = {
    bg: bodySettings.backgroundColor ?? defaultColors.backgroundColor,
    text: bodySettings.textColor ?? defaultColors.textColor,
    link: bodySettings.linkColor ?? defaultColors.linkColor,
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Exit preview button */}
      <button
        onClick={onExitPreview}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          backgroundColor: theme.bg,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Edit3 style={{ width: 16, height: 16 }} />
        Edit Mode
      </button>

      {/* HTML Preview Content */}
      {isLoading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: canvasTheme.bg,
            color: canvasTheme.text,
          }}
        >
          <div>Loading preview...</div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            backgroundColor: canvasTheme.bg,
            color: canvasTheme.text,
            fontFamily: `'${bodySettings.fontFamily}', system-ui, sans-serif`,
            fontSize: `${bodySettings.baseFontSize}px`,
            lineHeight: bodySettings.baseLineHeight,
            backgroundImage: bodySettings.backgroundImage ? `url(${bodySettings.backgroundImage})` : undefined,
            backgroundSize: bodySettings.backgroundSize,
            backgroundPosition: bodySettings.backgroundPosition,
            backgroundRepeat: bodySettings.backgroundRepeat,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: `${bodySettings.contentWidth}px`,
              margin: '0 auto',
              padding: `${bodySettings.contentPadding}px`,
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  );
};