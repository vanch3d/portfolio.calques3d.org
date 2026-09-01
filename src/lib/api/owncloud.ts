/**
 * ownCloud WebDAV — URL builder
 *
 * Builds authenticated WebDAV URLs for fetching publication PDFs.
 * Credentials are server-only and never sent to the client.
 *
 * Required env vars:
 *   OWNCLOUD_API        — WebDAV base URL, e.g. https://assets.calques3d.org/remote.php/webdav/
 *   OWNCLOUD_USERNAME   — WebDAV username
 *   OWNCLOUD_TOKEN      — WebDAV app token or password
 *   OWNCLOUD_COLLECTION — Folder path within WebDAV root, e.g. /portfolio.calques3d.org/
 */

import "server-only";

interface OwncloudConfig {
  apiUrl: string;
  username: string;
  token: string;
  collection: string;
}

function getConfig(): OwncloudConfig {
  const apiUrl = process.env.OWNCLOUD_API;
  const username = process.env.OWNCLOUD_USERNAME;
  const token = process.env.OWNCLOUD_TOKEN;
  const collection = process.env.OWNCLOUD_COLLECTION ?? "/";

  if (!apiUrl || !username || !token) {
    throw new Error(
      "Missing ownCloud credentials. Set OWNCLOUD_API, OWNCLOUD_USERNAME, and OWNCLOUD_TOKEN in .env.local"
    );
  }

  return { apiUrl, username, token, collection };
}

/** Returns the full WebDAV URL for a given filename within the collection. */
export function buildFileUrl(filename: string): string {
  const { apiUrl, collection } = getConfig();
  const base = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  const prefix = collection.endsWith("/") ? collection : `${collection}/`;
  return `${base}${prefix}${encodeURIComponent(filename)}`;
}

/** Returns a Basic Auth header value from username:token. */
export function buildAuthHeader(): string {
  const { username, token } = getConfig();
  return `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}`;
}
