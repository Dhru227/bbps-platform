export function resolveApiBaseUrl() {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (process.env.NODE_ENV === "development") {
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return "http://" + host + ":8000";
  }
  return "";
}

export const API_BASE_URL = resolveApiBaseUrl();
export const ONBOARDING_API_BASE_URL = API_BASE_URL;

export function resolveOnboardingJourneyUrl() {
  if (process.env.REACT_APP_ONBOARDING_JOURNEY_URL) return process.env.REACT_APP_ONBOARDING_JOURNEY_URL;
  if (typeof window !== "undefined") {
    return window.location.origin + "/biller-onboarding-journey";
  }
  return "http://localhost:3000/biller-onboarding-journey";
}

export const ONBOARDING_JOURNEY_URL = resolveOnboardingJourneyUrl();
