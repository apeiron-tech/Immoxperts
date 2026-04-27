import { durations } from '../durations';
import { easings } from '../easings';

export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.default },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease: easings.default } },
};

export const drawerSlideIn = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: durations.slow, ease: easings.enter } },
  exit: { x: '100%', transition: { duration: durations.base, ease: easings.exit } },
};
