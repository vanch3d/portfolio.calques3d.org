/**
 * ownCloud WebDAV — URL builder
 *
 * Builds authenticated WebDAV URLs for fetching publication PDFs.
 * Credentials are server-only and never sent to the client.
 *
 * Required env vars:
 *   OWNCLOUD_URL        — WebDAV base URL, e.g. https://cloud.example.com/remote.php/webdav
 *   OWNCLOUD_API        — Basic Auth credential in "username:password" format
 *   OWNCLOUD_COLLECTION — Folder path, e.g. /portfolio.calques3d.org/
 */

import "server-only";

interface OwncloudConfig {
  url: string;
  apiKey: string;
  collection: string;
}

function getConfig(): OwncloudConfig {
  const url = process.env.OWNCLOUD_URL;
  const apiKey = process.env.OWNCLOUD_API;
  const collection = process.env.OWNCLOUD_COLLECTION ?? "/";

  if (!url || !apiKey) {
    throw new Error(
      "Missing ownCloud credentials. Set OWNCLOUD_URL and OWNCLOUD_API in .env.local"
    );
  }

  return { url, apiKey, collection };
}

/** Returns the full WebDAV URL for a given filename within the collection. */
export function buildFileUrl(filename: string): string {
  const { url, collection } = getConfig();
  const base = url.endsWith("/") ? url.slice(0, -1) : url;
  const prefix = collection.endsWith("/") ? collection : `${collection}/`;
  return `${base}${prefix}${encodeURIComponent(filename)}`;
}

/** Returns a Base64-encoded Basic Auth header value. */
export function buildAuthHeader(): string {
  const { apiKey } = getConfig();
  return `Basic ${Buffer.from(apiKey).toString("base64")}`;
}
