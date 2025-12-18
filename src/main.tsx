import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize built-in components
import { registerBuiltInComponents } from './components/canvas-components/index'
import { initTestingMockupPlugin } from './testing_mockup_plugin'
import { registerTestAudio } from './plugins/mockup/test-audio'
import { initMockupTracksPlugin } from './plugins/mockup-tracks';
import { initEmptyContainerPlugin } from './plugins/empty-container';
import { initMockupPlaylistPlugin } from './plugins/mockup-playlist';

registerBuiltInComponents();
initTestingMockupPlugin();
registerTestAudio();
initMockupTracksPlugin();
initEmptyContainerPlugin();
initMockupPlaylistPlugin();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
