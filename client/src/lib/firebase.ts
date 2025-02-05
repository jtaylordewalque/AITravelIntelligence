import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from '@firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  authDomain: "voyage-genius.firebaseapp.com",
  projectId: "voyage-genius",
  appId: "1:123456789:web:abcdef123456789",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize App Check with reCAPTCHA v3
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdZ9dEeAAAAAJDfl2Vta8oJ_HFqXC81Q1UoCa-K'), // Replace with your actual reCAPTCHA v3 site key
  isTokenAutoRefreshEnabled: true
});