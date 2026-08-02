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
          <div className="section-divider" />
          <AgentsSection />
          <div className="section-divider" />
          <FlowSection />
          <FeaturesSection />
          <div className="section-divider" />
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
