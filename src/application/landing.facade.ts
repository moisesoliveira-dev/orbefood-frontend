export type LandingIntent = 'signup' | 'demo' | 'contact';

/** Facade da landing — CTAs sem fetch direto nas páginas. */
export function createLandingFacade(handlers?: {
  onIntent?: (intent: LandingIntent) => void;
}) {
  const emit = (intent: LandingIntent) => {
    handlers?.onIntent?.(intent);
  };

  return {
    startSignup: () => emit('signup'),
    openDemo: () => emit('demo'),
    contactSpecialist: () => emit('contact'),
  };
}

export type LandingFacade = ReturnType<typeof createLandingFacade>;
