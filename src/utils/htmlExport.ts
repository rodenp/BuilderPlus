import type { Project } from '../types/project';
import { getComponentHTML } from '../components/canvas-components';

import { globalThemeRegistry } from '../core/theme-registry';

export const generateCanvasHTML = async (project: Project): Promise<string> => {
  const { data } = project;
  const { components, bodySettings } = data;

  // Resolve active theme
  const themeId = bodySettings.activeCanvasThemeId || 'light';
  const themeObj = globalThemeRegistry.getTheme(themeId) || globalThemeRegistry.getTheme('light');

  console.log('[generateCanvasHTML] Starting export for project:', project.name);
  console.log('[generateCanvasHTML] Components count:', components.length);

  const canvasTheme = {
    bg: (themeObj?.styles.backgroundColor as string) || '#ffffff',
    text: (themeObj?.styles.textColor as string) || '#171717',
    link: (themeObj?.styles.linkColor as string) || '#2563eb',
  };

  // Generate HTML for each component (isExport = true for full HTML export)
  // Ensure we pass a valid Theme object even if registry lookup failed
  const safeTheme = themeObj || { id: 'fallback', name: 'Fallback', styles: {} };
  const componentPromises = components.map(component => getComponentHTML(component, safeTheme, true));
  const componentHTMLs = await Promise.all(componentPromises);

  console.log('[generateCanvasHTML] Generated HTML chunks:', componentHTMLs.length);

  // Extract global styles from theme
  const styles = safeTheme.styles;

  // Build complete HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bodySettings.pageTitle || project.name}</title>
    ${bodySettings.metaDescription ? `<meta name="description" content="${bodySettings.metaDescription}">` : ''}
    ${bodySettings.faviconUrl ? `<link rel="icon" href="${bodySettings.faviconUrl}">` : ''}
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: '${styles.fontFamily || 'Inter'}', system-ui, sans-serif;
            font-size: ${styles.fontSize || '16px'};
            line-height: ${styles.lineHeight || '1.5'};
            background-color: ${canvasTheme.bg};
            color: ${canvasTheme.text};
            ${styles.backgroundImage ? `background-image: url(${styles.backgroundImage});` : ''}
            ${styles.backgroundSize ? `background-size: ${styles.backgroundSize};` : ''}
            ${styles.backgroundPosition ? `background-position: ${styles.backgroundPosition};` : ''}
            ${styles.backgroundRepeat ? `background-repeat: ${styles.backgroundRepeat};` : ''}
        }
        .canvas-container {
            max-width: ${styles.maxWidth || '1200px'};
            margin: 0 auto;
            padding: ${styles.padding || '20px'};
        }
        a {
            color: ${canvasTheme.link};
        }
    </style>
</head>
<body>
    <div class="canvas-container">
        ${componentHTMLs.join('\n        ')}
    </div>
</body>
</html>`;

  return html;
};

export const generateCanvasContent = async (project: Project): Promise<string> => {
  const { data } = project;
  const { components } = data;

  console.log('generateCanvasContent called with project:', project);
  // Derive theme from bodySettings if available
  const bodySettings = project.data.bodySettings;
  const themeId = bodySettings.activeCanvasThemeId || 'light';
  const themeObj = globalThemeRegistry.getTheme(themeId) || globalThemeRegistry.getTheme('light') || { id: 'fallback', name: 'Fallback', styles: {} };

  // Generate HTML for each component (isExport = false for preview mode)
  const componentPromises = components.map(component => getComponentHTML(component, themeObj, false));
  const componentHTMLs = await Promise.all(componentPromises);

  console.log('Generated component HTMLs:', componentHTMLs);

  // Return just the component content without full HTML structure
  const result = componentHTMLs.join('\n        ');
  console.log('Final HTML content:', result);
  return result;
};