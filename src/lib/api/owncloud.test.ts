import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildFileUrl, buildAuthHeader } from "./owncloud";

const ENV: Record<string, string> = {
  OWNCLOUD_API: "https://assets.example.org/remote.php/webdav/",
  OWNCLOUD_USERNAME: "testuser",
  OWNCLOUD_TOKEN: "testtoken",
  OWNCLOUD_COLLECTION: "/portfolio/",
};

beforeEach(() => {
  for (const [k, v] of Object.entries(ENV)) process.env[k] = v;
});

afterEach(() => {
  for (const k of Object.keys(ENV)) delete process.env[k];
});

describe("buildFileUrl", () => {
  it("builds a URL from base + collection + encoded filename", () => {
    const url = buildFileUrl("my paper.pdf");
    expect(url).toBe(
      "https://assets.example.org/remote.php/webdav/portfolio/my%20paper.pdf"
    );
  });

  it("strips trailing slash from apiUrl before joining", () => {
    process.env.OWNCLOUD_API = "https://assets.example.org/remote.php/webdav";
    const url = buildFileUrl("doc.pdf");
    expect(url).toBe(
      "https://assets.example.org/remote.php/webdav/portfolio/doc.pdf"
    );
  });

  it("ensures collection always ends with /", () => {
    process.env.OWNCLOUD_COLLECTION = "/portfolio";
    const url = buildFileUrl("doc.pdf");
    expect(url).toContain("/portfolio/doc.pdf");
  });

  it("encodes special characters in filenames", () => {
    const url = buildFileUrl("Van Labeke & Smith (2005).pdf");
    expect(url).toContain("Van%20Labeke%20%26%20Smith%20(2005).pdf");
  });

  it("throws when OWNCLOUD_API is missing", () => {
    delete process.env.OWNCLOUD_API;
    expect(() => buildFileUrl("doc.pdf")).toThrow("Missing ownCloud credentials");
  });
});

describe("buildAuthHeader", () => {
  it("returns a Basic auth header", () => {
    const header = buildAuthHeader();
    expect(header).toMatch(/^Basic /);
  });

  it("encodes username:token as base64", () => {
    const header = buildAuthHeader();
    const encoded = header.replace("Basic ", "");
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    expect(decoded).toBe("testuser:testtoken");
  });

  it("throws when OWNCLOUD_USERNAME is missing", () => {
    delete process.env.OWNCLOUD_USERNAME;
    expect(() => buildAuthHeader()).toThrow("Missing ownCloud credentials");
  });
});
