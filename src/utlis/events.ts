/**
 * Custom event system for triggering content updates across the app
 * Use this after create/edit/delete operations to refresh content lists
 */

export const triggerContentUpdate = () => {
  globalThis.dispatchEvent(new Event('content-updated'));
};

export const triggerFeedUpdate = () => {
  globalThis.dispatchEvent(new Event('feed-updated'));
};
