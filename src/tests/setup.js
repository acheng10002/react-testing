import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
/* @testing-library/jest-dom includes handy custom matchers like 
toBeInTheDocument */
import * as matchers from "@testing-library/jest-dom/matchers";

/* @test-library/userevent provides the suerEventAPI that simulates 
user interactions with the webpage */

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock the clipboard API globally
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue(),
    readText: vi.fn().mockResolvedValue("Mocked clipboard content"),
  },
  configurable: true,
});

global.fetch = vi.fn();
/* implementation details - things which users of my code will not
typically use, see, or even know about 
Why is testing implementation details bad?
- it can break when I refactor application code - false negatives
- may not fail when I break application code - false positives*/
