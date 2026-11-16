// Runtime validation coverage for navigation, theme, projects, and contact actions.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import Contact from "./Contact";
import MobileNavigation from "./MobileNavigation";
import Projects from "./Projects";
import SidebarNavigation from "./SidebarNavigation";
import { Hero } from "./Sections";
import ThemeToggle from "./ThemeToggle";
import { EMAIL } from "../data/content";
import { mobileNavigationLinks, navigationLinks } from "../data/navigation";

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    },
  });
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: async () => undefined },
  });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, "showModal", originalShowModal);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, "close", originalClose);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
});

describe("portfolio navigation", () => {
  it("renders the same ordered, accessible destinations in desktop and mobile navigation", () => {
    const expectedIds = ["home", "about", "skills", "projects", "experience", "education", "services", "process", "github", "contact"];
    expect(navigationLinks.map(({ id }) => id)).toEqual(expectedIds);

    const desktop = render(<SidebarNavigation activeSection="projects" />);
    const desktopLinks = Array.from(desktop.container.querySelectorAll(".sidebar-nav a"));
    expect(desktopLinks.map((link) => link.getAttribute("href"))).toEqual(expectedIds.map((id) => `#${id}`));
    expect(desktopLinks[3]?.getAttribute("aria-current")).toBe("location");
    expect(desktopLinks.every((link) => link.getAttribute("aria-label"))).toBe(true);
    desktop.unmount();

    const mobile = render(<MobileNavigation activeSection="contact" />);
    const mobileLinks = Array.from(mobile.container.querySelectorAll(".mobile-nav a"));
    expect(mobileLinks.map((link) => link.getAttribute("href"))).toEqual(
      ["#home", "#about", "#skills", "#projects", "#contact"],
    );
    expect(mobileNavigationLinks.map(({ id }) => id)).toEqual(["home", "about", "skills", "projects", "contact"]);
    expect(mobile.container.querySelector('.mobile-nav a[href="#contact"]')?.getAttribute("aria-current")).toBe("location");
  });

  it("renders exactly one section with a matching ID for every navigation destination", () => {
    const { container } = render(<App />);
    for (const { id } of navigationLinks) {
      expect(container.querySelectorAll(`#${id}`)).toHaveLength(1);
    }

    const main = container.querySelector("main");
    expect(Array.from(main?.querySelectorAll(":scope > section") ?? []).map((section) => section.id)).toEqual(
      navigationLinks.map(({ id }) => id),
    );
  });
});

describe("CV download", () => {
  it("links to the supplied public PDF with a download filename", () => {
    const { container } = render(<Hero />);
    const link = container.querySelector('a[download="Sayed-Rohullah-Sadat-CV.pdf"]');
    expect(link?.getAttribute("href")).toBe(`${import.meta.env.BASE_URL}sayed-rohullah-sadat-cv.pdf`);
    expect(link?.textContent).toBe("Download My CV");
  });
});

describe("profile photo", () => {
  it("renders the supplied portrait with descriptive alternative text", () => {
    const { container } = render(<Hero />);
    const portrait = container.querySelector<HTMLImageElement>(".profile-frame img");
    expect(portrait?.getAttribute("src")).toBe(`${import.meta.env.BASE_URL}images/profile-photo.jpeg`);
    expect(portrait?.getAttribute("alt")).toBe("Portrait of Sayed Rohullah Sadat");
  });
});

describe("theme toggle", () => {
  it("updates the document theme and persists the selection", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
    expect(localStorage.getItem("sw-theme")).toBe("dark");

    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("light"));
  });
});

describe("project actions", () => {
  it("filters only categories with projects and opens the selected details", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);

    expect(container.querySelectorAll(".proj")).toHaveLength(6);
    expect(screen.queryByRole("button", { name: "Frontend" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Backend" }));
    expect(container.querySelectorAll(".proj")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Full-Stack" }));
    expect(container.querySelectorAll(".proj")).toHaveLength(4);

    await user.click(screen.getByRole("button", { name: "All Projects" }));
    await user.click(screen.getAllByRole("button", { name: "View Details" })[0]!);
    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe("project-dialog-title");
    expect(container.querySelector("dialog h3")?.textContent).toBe("OpenShelf — Digital Library Platform");

    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(container.querySelector("dialog")?.hasAttribute("open")).toBe(false));
  });

  it("shows POHANA project previews and its screenshot gallery", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const pohanaCard = Array.from(container.querySelectorAll<HTMLElement>(".proj"))
      .find((card) => card.textContent?.includes("POHANA"));

    if (!pohanaCard) throw new Error("POHANA project card was not rendered.");
    expect(pohanaCard?.querySelector(".shot img")?.getAttribute("src")).toBe(
      `${import.meta.env.BASE_URL}images/projects/pohana-dashboard.webp`,
    );
    const detailsButton = pohanaCard.querySelector("button");
    if (!detailsButton) throw new Error("POHANA project details button was not rendered.");
    await user.click(detailsButton);
    expect(container.querySelectorAll(".project-image-gallery img")).toHaveLength(5);
    expect(container.querySelector(".project-image-gallery img")?.getAttribute("alt")).toBe("POHANA screenshot 1");
    expect(Array.from(container.querySelectorAll<HTMLImageElement>(".project-image-gallery img"))
      .map((image) => image.getAttribute("src"))).toEqual([
      `${import.meta.env.BASE_URL}images/projects/pohana-dashboard.webp`,
      `${import.meta.env.BASE_URL}images/projects/pohana-students.webp`,
      `${import.meta.env.BASE_URL}images/projects/pohana-student-management.webp`,
      `${import.meta.env.BASE_URL}images/projects/pohana-settings.webp`,
      `${import.meta.env.BASE_URL}images/projects/pohana-account-creation.webp`,
    ]);
  });

  it("shows OpenShelf screenshots on its project card and details gallery", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const openshelfCard = Array.from(container.querySelectorAll<HTMLElement>(".proj"))
      .find((card) => card.textContent?.includes("OpenShelf"));

    if (!openshelfCard) throw new Error("OpenShelf project card was not rendered.");
    expect(openshelfCard.querySelector(".shot img")?.getAttribute("src")).toBe(
      `${import.meta.env.BASE_URL}images/projects/openshelf-home.webp`,
    );
    const detailsButton = openshelfCard.querySelector("button");
    if (!detailsButton) throw new Error("OpenShelf project details button was not rendered.");
    await user.click(detailsButton);
    expect(container.querySelectorAll(".project-image-gallery img")).toHaveLength(4);
    expect(container.querySelector(".project-image-gallery img")?.getAttribute("alt")).toBe("OpenShelf screenshot 1");
    expect(Array.from(container.querySelectorAll<HTMLImageElement>(".project-image-gallery img"))
      .map((image) => image.getAttribute("src"))).toEqual([
      `${import.meta.env.BASE_URL}images/projects/openshelf-home.webp`,
      `${import.meta.env.BASE_URL}images/projects/openshelf-library.webp`,
      `${import.meta.env.BASE_URL}images/projects/openshelf-sign-up.webp`,
      `${import.meta.env.BASE_URL}images/projects/openshelf-contribute-book.webp`,
    ]);
  });

  it("shows the Chess Learning Platform cover and all eight gallery images", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const chessCard = Array.from(container.querySelectorAll<HTMLElement>(".proj"))
      .find((card) => card.textContent?.includes("Chess Learning Platform"));

    if (!chessCard) throw new Error("Chess Learning Platform project card was not rendered.");
    expect(chessCard.querySelector(".shot img")?.getAttribute("src")).toBe(
      `${import.meta.env.BASE_URL}images/projects/chess1.png`,
    );
    expect(chessCard.querySelectorAll('a[href]')).toHaveLength(0);

    const detailsButton = chessCard.querySelector("button");
    if (!detailsButton) throw new Error("Chess Learning Platform details button was not rendered.");
    await user.click(detailsButton);

    const galleryImages = Array.from(container.querySelectorAll<HTMLImageElement>(".project-image-gallery img"));
    expect(galleryImages).toHaveLength(8);
    expect(galleryImages.map((image) => image.getAttribute("src"))).toEqual(
      Array.from({ length: 8 }, (_, index) =>
        `${import.meta.env.BASE_URL}images/projects/chess${index + 1}.png`,
      ),
    );
    expect(container.querySelector("dialog h3")?.textContent).toBe(
      "Chess Learning Platform — Interactive Chess Learning Application",
    );
  });

  it("shows the supplied FuelCore, NetPilot, and Inventory project screenshots", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const projectsWithImages = [
      { title: "FuelCore", images: ["FuelCore.png"] },
      { title: "NetPilot", images: ["netPilot1.png", "netPilot2.png", "netPilot3.png"] },
      { title: "Shop Inventory", images: ["Inventory1.png", "Inventory2.png", "Inventory3.png", "Inventory4.png", "Inventory5.png"] },
    ];

    for (const project of projectsWithImages) {
      const card = Array.from(container.querySelectorAll<HTMLElement>(".proj"))
        .find((candidate) => candidate.textContent?.includes(project.title));
      if (!card) throw new Error(`${project.title} project card was not rendered.`);

      expect(card.querySelector(".shot img")?.getAttribute("src")).toBe(
        `${import.meta.env.BASE_URL}images/projects/${project.images[0]}`,
      );
      const detailsButton = card.querySelector("button");
      if (!detailsButton) throw new Error(`${project.title} details button was not rendered.`);
      await user.click(detailsButton);

      const galleryImages = Array.from(container.querySelectorAll<HTMLImageElement>(".project-image-gallery img"));
      expect(galleryImages.map((image) => image.getAttribute("src"))).toEqual(
        project.images.map((image) => `${import.meta.env.BASE_URL}images/projects/${image}`),
      );
      await user.click(screen.getByRole("button", { name: "Close" }));
      await waitFor(() => expect(container.querySelector("dialog")?.hasAttribute("open")).toBe(false));
    }
  });
});

describe("contact actions", () => {
  it("validates fields and exposes working email, WhatsApp, Telegram, and copy actions", async () => {
    const user = userEvent.setup();
    const { container } = render(<Contact />);

    await user.click(screen.getByRole("button", { name: "Send via Email App" }));
    expect(container.querySelectorAll('input[aria-invalid="true"], textarea[aria-invalid="true"]')).toHaveLength(4);
    expect(container.querySelector(`a[href="mailto:${EMAIL}"]`)).not.toBeNull();
    expect(container.querySelector('a[href="https://wa.me/93798116566"]')).not.toBeNull();
    expect(container.querySelector('a[href="https://t.me/sayedsadat143"]')).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Copy Email" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied ✓" })).toBeTruthy());
  });
});
