const BUSINESS_ENTITIES_CHANGED_EVENT = "business-entities:changed";

export function notifyBusinessEntitiesChanged() {
  window.dispatchEvent(new Event(BUSINESS_ENTITIES_CHANGED_EVENT));
}

export function subscribeToBusinessEntitiesChanges(listener: () => void) {
  window.addEventListener(BUSINESS_ENTITIES_CHANGED_EVENT, listener);

  return () => {
    window.removeEventListener(BUSINESS_ENTITIES_CHANGED_EVENT, listener);
  };
}
