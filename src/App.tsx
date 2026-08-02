import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { prefersSidebarNavigation } from './adapters/platform/runtime';
import { AppSidebarShell } from './ui/shell/AppSidebarShell';
import { AppTabsShell } from './ui/shell/AppTabsShell';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.always.css';

import './theme/variables.css';
import './theme/landing.css';

setupIonicReact();

const useSidebar = prefersSidebarNavigation();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        {useSidebar ? <AppSidebarShell /> : <AppTabsShell />}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
