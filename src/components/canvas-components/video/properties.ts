import { createComponentProperties, type PropertyField, type PropertyGroup } from '../properties';

const contentFields: PropertyField[] = [
  { key: 'src', label: 'Video URL', type: 'url', placeholder: 'https://...', group: 'content' },
  { key: 'poster', label: 'Poster Image', type: 'url', placeholder: 'https://...', group: 'content' },
];

const videoGroup: PropertyGroup = { id: 'playback', label: 'Playback' };

const playbackFields: PropertyField[] = [
  { key: 'autoplay', label: 'Autoplay', type: 'boolean', defaultValue: false, group: 'playback' },
  { key: 'loop', label: 'Loop', type: 'boolean', defaultValue: false, group: 'playback' },
  { key: 'muted', label: 'Muted', type: 'boolean', defaultValue: false, group: 'playback' },
  { key: 'controls', label: 'Show Controls', type: 'boolean', defaultValue: true, group: 'playback' },
];

export const properties = createComponentProperties(
  contentFields,
  [videoGroup],
  playbackFields
);

export const defaultProps = {
  src: '',
  poster: '',
  autoplay: false,
  loop: false,
  muted: false,
  controls: true,
  borderRadius: '0',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
};
