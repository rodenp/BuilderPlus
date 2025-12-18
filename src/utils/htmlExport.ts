import type { Project } from '../types/project';
import { getComponentHTML } from '../components/canvas-components';
import { getDefaultCanvasColors } from '../types/bodySettings';

export const generateCanvasHTML = async (project: Project): Promise<string> => {
  const { data } = project;
  const { components, bodySettings } = data;

  // Get theme colors
  const defaultColors = getDefaultCanvasColors(false); // Default to light mode for HTML export
  const canvasTheme = {
    bg: bodySettings.backgroundColor ?? defaultColors.backgroundColor,
    text: bodySettings.textColor ?? defaultColors.textColor,
    link: bodySettings.linkColor ?? defaultColors.linkColor,
  };

  // Generate HTML for each component (isExport = true for full HTML export)
  const componentPromises = components.map(component => getComponentHTML(component, true));
  const componentHTMLs = await Promise.all(componentPromises);

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
            font-family: '${bodySettings.fontFamily}', system-ui, sans-serif;
            font-size: ${bodySettings.baseFontSize}px;
            line-height: ${bodySettings.baseLineHeight};
            background-color: ${canvasTheme.bg};
            color: ${canvasTheme.text};
            ${bodySettings.backgroundImage ? `background-image: url(${bodySettings.backgroundImage});` : ''}
            ${bodySettings.backgroundImage ? `background-size: ${bodySettings.backgroundSize};` : ''}
            ${bodySettings.backgroundImage ? `background-position: ${bodySettings.backgroundPosition};` : ''}
            ${bodySettings.backgroundImage ? `background-repeat: ${bodySettings.backgroundRepeat};` : ''}
        }
        .canvas-container {
            max-width: ${bodySettings.contentWidth}px;
            margin: 0 auto;
            padding: ${bodySettings.contentPadding}px;
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
  console.log('Components to generate:', components);

  // Generate HTML for each component (isExport = false for preview mode)
  const componentPromises = components.map(component => getComponentHTML(component, false));
  const componentHTMLs = await Promise.all(componentPromises);

  console.log('Generated component HTMLs:', componentHTMLs);

  // Return just the component content without full HTML structure
  const result = componentHTMLs.join('\n        ');
  console.log('Final HTML content:', result);
  return result;
};