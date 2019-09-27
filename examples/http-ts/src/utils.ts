import { URL } from 'url';
import { BASE_URL } from './config';

/**
 * Helper to convert a relative url to full url.
 *
 * @param {string} relativeUrl
 */
export function toFullURL(relativeUrl: string): URL {
  return new URL(`${BASE_URL}${relativeUrl}`);
}
