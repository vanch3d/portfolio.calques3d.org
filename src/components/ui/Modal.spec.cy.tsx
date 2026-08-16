import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders trigger as a button", () => {
    cy.mountAccessible(
      <Modal trigger={<img src="https://placehold.co/400x300" alt="Preview" width={400} height={300} />} title="Image preview" closeLabel="Close image">
        <img src="https://placehold.co/800x600" alt="Full size preview" width={800} height={600} />
      </Modal>
    );
    cy.get("button").should("exist");
  });

  it("opens on trigger click and shows content", () => {
    cy.mountAccessible(
      <Modal trigger={<span>Open preview</span>} title="Image preview" closeLabel="Close image">
        <p>Modal content</p>
      </Modal>
    );
    cy.get("button").contains("Open preview").click();
    cy.contains("Modal content");
  });

  it("hides title visually but exposes it to screen readers", () => {
    cy.mountAccessible(
      <Modal trigger={<span>Open</span>} title="Accessible title" closeLabel="Close image">
        <p>Content</p>
      </Modal>
    );
    cy.get("button").click();
    cy.get(".sr-only").contains("Accessible title");
  });

  it("renders close button with aria-label", () => {
    cy.mountAccessible(
      <Modal trigger={<span>Open</span>} title="Image preview" closeLabel="Close image">
        <p>Content</p>
      </Modal>
    );
    cy.get("button").click();
    cy.get('[aria-label="Close image"]').should("be.visible");
  });

  it("closes on close button click", () => {
    cy.mountAccessible(
      <Modal trigger={<span>Open</span>} title="Image preview" closeLabel="Close image">
        <p>Modal content</p>
      </Modal>
    );
    cy.get("button").first().click();
    cy.contains("Modal content").should("be.visible");
    cy.get('[aria-label="Close image"]').click();
    cy.contains("Modal content").should("not.exist");
  });

  it("has no axe accessibility violations (closed)", () => {
    cy.mountAccessible(
      <Modal trigger={<img src="https://placehold.co/400x300" alt="Preview thumbnail" width={400} height={300} />} title="Image preview" closeLabel="Close image">
        <img src="https://placehold.co/800x600" alt="Full size preview" width={800} height={600} />
      </Modal>
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (open)", () => {
    cy.mountAccessible(
      <Modal trigger={<img src="https://placehold.co/400x300" alt="Preview thumbnail" width={400} height={300} />} title="Image preview" closeLabel="Close image">
        <img src="https://placehold.co/800x600" alt="Full size preview" width={800} height={600} />
      </Modal>
    );
    cy.get("button").click();
    cy.checkA11y();
  });
});
