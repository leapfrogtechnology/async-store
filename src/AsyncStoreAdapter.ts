/**
 * Async Store adapter types.
 */
enum AsyncStoreAdapter {
  DOMAIN = 'domain'

  // Later we can add other implementations of the store as a new adapter,
  // for instance, add: ASYNC_HOOKS = 'async_hooks'
  // and create implementation for async hooks as per the API requirements.
}

export default AsyncStoreAdapter;
