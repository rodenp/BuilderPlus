import React from 'react';
import { Link2, Link2Off } from 'lucide-react';
import { SpacingInput } from './SpacingInput';
import type { Theme } from './theme';

interface SpacingValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface BoxModelControlProps {
  margin: SpacingValues;
  padding: SpacingValues;
  marginLinked: boolean;
  paddingLinked: boolean;
  onMarginChange: (side: keyof SpacingValues, value: string) => void;
  onPaddingChange: (side: keyof SpacingValues, value: string) => void;
  onMarginLinkedChange: (linked: boolean) => void;
  onPaddingLinkedChange: (linked: boolean) => void;
  theme: Theme;
}

export const BoxModelControl: React.FC<BoxModelControlProps> = ({
  margin,
  padding,
  marginLinked,
  paddingLinked,
  onMarginChange,
  onPaddingChange,
  onMarginLinkedChange,
  onPaddingLinkedChange,
  theme,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Margin layer (outermost - amber/yellow) */}
      <div
        style={{
          backgroundColor: theme.marginBg,
          borderRadius: '8px',
          padding: '6px',
          border: `1px solid ${theme.marginBorder}`,
        }}
      >
        {/* Margin label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4px',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: theme.marginText,
              fontWeight: 500,
            }}
          >
            margin
          </span>
          <button
            onClick={() => onMarginLinkedChange(!marginLinked)}
            style={{
              padding: '2px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: marginLinked ? theme.marginText : theme.textMuted,
            }}
            title={marginLinked ? 'Unlink margins' : 'Link margins'}
          >
            {marginLinked ? (
              <Link2 style={{ width: 12, height: 12 }} />
            ) : (
              <Link2Off style={{ width: 12, height: 12 }} />
            )}
          </button>
        </div>

        {/* Margin top */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <div style={{ width: '56px' }}>
            <SpacingInput
              value={margin.top}
              onChange={(v) => onMarginChange('top', v)}
              bgColor={theme.marginBg}
              borderColor={theme.marginBorder}
              theme={theme}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Margin left */}
          <div style={{ width: '56px' }}>
            <SpacingInput
              value={margin.left}
              onChange={(v) => onMarginChange('left', v)}
              bgColor={theme.marginBg}
              borderColor={theme.marginBorder}
              theme={theme}
            />
          </div>

          {/* Padding layer (inner - green) */}
          <div
            style={{
              flex: 1,
              backgroundColor: theme.paddingBg,
              borderRadius: '6px',
              padding: '6px',
              border: `1px solid ${theme.paddingBorder}`,
            }}
          >
            {/* Padding label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: theme.paddingText,
                  fontWeight: 500,
                }}
              >
                padding
              </span>
              <button
                onClick={() => onPaddingLinkedChange(!paddingLinked)}
                style={{
                  padding: '2px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: paddingLinked ? theme.paddingText : theme.textMuted,
                }}
                title={paddingLinked ? 'Unlink paddings' : 'Link paddings'}
              >
                {paddingLinked ? (
                  <Link2 style={{ width: 12, height: 12 }} />
                ) : (
                  <Link2Off style={{ width: 12, height: 12 }} />
                )}
              </button>
            </div>

            {/* Padding top */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <div style={{ width: '48px' }}>
                <SpacingInput
                  value={padding.top}
                  onChange={(v) => onPaddingChange('top', v)}
                  bgColor={theme.paddingBg}
                  borderColor={theme.paddingBorder}
                  theme={theme}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Padding left */}
              <div style={{ width: '48px' }}>
                <SpacingInput
                  value={padding.left}
                  onChange={(v) => onPaddingChange('left', v)}
                  bgColor={theme.paddingBg}
                  borderColor={theme.paddingBorder}
                  theme={theme}
                />
              </div>

              {/* Content box (center - blue) */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: theme.contentBg,
                  borderRadius: '4px',
                  padding: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${theme.contentBorder}`,
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.contentText,
                    fontWeight: 500,
                  }}
                >
                  content
                </span>
              </div>

              {/* Padding right */}
              <div style={{ width: '48px' }}>
                <SpacingInput
                  value={padding.right}
                  onChange={(v) => onPaddingChange('right', v)}
                  bgColor={theme.paddingBg}
                  borderColor={theme.paddingBorder}
                  theme={theme}
                />
              </div>
            </div>

            {/* Padding bottom */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
              <div style={{ width: '48px' }}>
                <SpacingInput
                  value={padding.bottom}
                  onChange={(v) => onPaddingChange('bottom', v)}
                  bgColor={theme.paddingBg}
                  borderColor={theme.paddingBorder}
                  theme={theme}
                />
              </div>
            </div>
          </div>

          {/* Margin right */}
          <div style={{ width: '56px' }}>
            <SpacingInput
              value={margin.right}
              onChange={(v) => onMarginChange('right', v)}
              bgColor={theme.marginBg}
              borderColor={theme.marginBorder}
              theme={theme}
            />
          </div>
        </div>

        {/* Margin bottom */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <div style={{ width: '56px' }}>
            <SpacingInput
              value={margin.bottom}
              onChange={(v) => onMarginChange('bottom', v)}
              bgColor={theme.marginBg}
              borderColor={theme.marginBorder}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
