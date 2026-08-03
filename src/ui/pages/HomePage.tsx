import { IonContent, IonPage } from '@ionic/react';
import { createLandingFacade } from '../../application/landing.facade';
import { AgentsSection } from '../components/AgentsSection';
import { CtaSection } from '../components/CtaSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { FlowSection } from '../components/FlowSection';
import { Hero } from '../components/Hero';
import { LandingFooter } from '../components/LandingFooter';
import { LandingNav } from '../components/LandingNav';
import '../../theme/landing.css';

const facade = createLandingFacade({
  onIntent: (intent) => {
    console.info('[landing]', intent);
  },
});

const HomePage: React.FC = () => {

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="landing">
          <LandingNav onCta={facade.startSignup} />
          <Hero onPrimary={facade.startSignup} onSecondary={facade.openDemo} />
          <hr className="full-sep" />
          <AgentsSection />
          <hr className="full-sep" />
          <FlowSection />
          <FeaturesSection />
          <hr className="full-sep" />
          <CtaSection
            onPrimary={facade.startSignup}
            onSecondary={facade.contactSpecialist}
          />
          <LandingFooter />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
