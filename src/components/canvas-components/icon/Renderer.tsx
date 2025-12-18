import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { CanvasComponentProps } from '../types';

type LucideIconComponent = React.FC<LucideProps>;

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const iconName = (props.icon as string) || 'Star';
  const size = parseInt((props.size as string) || '24', 10);

  // Get the icon component from lucide-react
  const icons = LucideIcons as unknown as Record<string, LucideIconComponent>;
  const IconComponent = icons[iconName];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: commonStyles.color || (props.color as string) || canvasTheme.text,
        backgroundColor: commonStyles.backgroundColor,
        width: commonStyles.width,
        height: commonStyles.height,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
      }}
    >
      {IconComponent ? (
        <IconComponent style={{ width: size, height: size }} />
      ) : (
        <LucideIcons.Star style={{ width: size, height: size }} />
      )}
    </div>
  );
};
