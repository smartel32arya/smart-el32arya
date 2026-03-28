/**
 * Bug Condition Exploration Test — Admin Property API Refactor
 *
 * Feature: admin-property-api-refactor
 * Property 1: Bug Condition — Single-FormData Create/Update Rejected by New API
 *
 * CRITICAL: These tests MUST FAIL on unfixed code — failure confirms the bug exists.
 * DO NOT fix the code or the test when it fails.
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9
 */

import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ── Mock RTK-Query hooks ──────────────────────────────────────────────────────
// We capture what each mutation receives so we can assert on the request shape.

const mockCreatePropertyMutationFn = vi.fn();
const mockUpdatePropertyMutationFn = vi.fn();

// Each mutation trigger returns an object with an unwrap() method (not a plain Promise).
// RTK-Query mutation triggers are synchronous calls that return { unwrap: () => Promise }.
const makeUnwrappable = (fn: ReturnType<typeof vi.fn>, returnValue: unknown = { _id: "new-id-123", id: "new-id-123" }) => {
  fn.mockReturnValue({ unwrap: () => Promise.resolve(returnValue) });
};

vi.mock("@/store/api/propertiesApi", () => ({
  useCreatePropertyMutation: () => [
    mockCreatePropertyMutationFn,
    { isLoading: false },
  ],
  useUpdatePropertyMutation: () => [
    mockUpdatePropertyMutationFn,
    { isLoading: false },
  ],
}));

import { useAdminActions, type PropertyFormState } from "../useAdminActions";

// ── Helpers ───────────────────────────────────────────────────────────────────

const baseForm: PropertyFormState = {
  title: "شقة فاخرة",
  description: "وصف تفصيلي",
  price: "1500000",
  neighborhood: "الزهراء",
  type: "شقة",
  area: "150",
  listingType: "sale",
  amenities: ["غاز طبيعي", "مصعد"],
  featured: true,
  active: true,
  showPrice: true,
};

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  makeUnwrappable(mockCreatePropertyMutationFn, { _id: "new-id-123", id: "new-id-123" });
  makeUnwrappable(mockUpdatePropertyMutationFn, { _id: "existing-id", id: "existing-id" });
});

// ── Case 1: Create scalar only ────────────────────────────────────────────────
/**
 * Validates: Requirements 1.1, 1.8, 1.9
 *
 * Expected (fixed): createProperty mutation receives a plain JSON object with
 *   featured as boolean true/false and amenities as a real array.
 *
 * Bug (unfixed): mutation receives a FormData instance; featured is the string
 *   "true"; amenities is the JSON-encoded string '["غاز طبيعي","مصعد"]'.
 */
describe("Case 1 — Create scalar only", () => {
  it("scalar mutation receives plain JSON object (not FormData), featured is boolean, amenities is array", async () => {
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.createProperty(baseForm, [], null);
    });

    expect(mockCreatePropertyMutationFn).toHaveBeenCalledTimes(1);

    const receivedArg = mockCreatePropertyMutationFn.mock.calls[0][0];

    // Must NOT be FormData
    expect(receivedArg).not.toBeInstanceOf(FormData);

    // Must be a plain object
    expect(typeof receivedArg).toBe("object");

    // featured must be a real boolean
    expect(typeof receivedArg.featured).toBe("boolean");
    expect(receivedArg.featured).toBe(true);

    // amenities must be a real array
    expect(Array.isArray(receivedArg.amenities)).toBe(true);
    expect(receivedArg.amenities).toEqual(["غاز طبيعي", "مصعد"]);
  });
});

// ── Case 2: Create with image URLs ───────────────────────────────────────────
/**
 * Validates: Requirements 2.3
 *
 * Expected (fixed): createProperty mutation receives a plain JSON object with
 *   images as a string array of pre-resolved Cloudinary URLs.
 *
 * Bug (unfixed): images are bundled into the single FormData create request
 *   as raw File objects.
 */
describe("Case 2 — Create with image URLs", () => {
  it("createProperty mutation receives images as string array (not File objects)", async () => {
    const imageUrl = "https://cdn.example.com/img.jpg";
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.createProperty(baseForm, [imageUrl], null);
    });

    expect(mockCreatePropertyMutationFn).toHaveBeenCalledTimes(1);

    const receivedArg = mockCreatePropertyMutationFn.mock.calls[0][0];

    // Must NOT be FormData
    expect(receivedArg).not.toBeInstanceOf(FormData);

    // images must be a string array
    expect(Array.isArray(receivedArg.images)).toBe(true);
    expect(receivedArg.images).toEqual([imageUrl]);

    // No File objects in images
    receivedArg.images.forEach((img: unknown) => {
      expect(typeof img).toBe("string");
    });
  });
});

// ── Case 3: Create with video URL ─────────────────────────────────────────────
/**
 * Validates: Requirements 2.3
 *
 * Expected (fixed): createProperty mutation receives video as a string URL.
 *
 * Bug (unfixed): video is bundled into the single FormData create request
 *   as a raw File object.
 */
describe("Case 3 — Create with video URL", () => {
  it("createProperty mutation receives video as string URL (not File object)", async () => {
    const videoUrl = "https://cdn.example.com/vid.mp4";
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.createProperty(baseForm, [], videoUrl);
    });

    expect(mockCreatePropertyMutationFn).toHaveBeenCalledTimes(1);

    const receivedArg = mockCreatePropertyMutationFn.mock.calls[0][0];

    // Must NOT be FormData
    expect(receivedArg).not.toBeInstanceOf(FormData);

    // video must be a string URL
    expect(typeof receivedArg.video).toBe("string");
    expect(receivedArg.video).toBe(videoUrl);
  });
});

// ── Case 4: Update with image URLs ────────────────────────────────────────────
/**
 * Validates: Requirements 2.6
 *
 * Expected (fixed): updateProperty mutation receives images as a string array.
 *
 * Bug (unfixed): images are bundled into the FormData PUT body as raw File objects.
 */
describe("Case 4 — Update with image URLs", () => {
  it("updateProperty mutation receives images as string array", async () => {
    const imageUrl = "https://cdn.example.com/img.jpg";
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.updateProperty("existing-id", baseForm, [imageUrl], null);
    });

    expect(mockUpdatePropertyMutationFn).toHaveBeenCalledTimes(1);

    const receivedArg = mockUpdatePropertyMutationFn.mock.calls[0][0];
    const body = receivedArg?.data ?? receivedArg;

    // Must NOT be FormData
    expect(body).not.toBeInstanceOf(FormData);

    // images must be a string array
    expect(Array.isArray(body.images)).toBe(true);
    expect(body.images).toEqual([imageUrl]);
  });
});

// ── Case 5: Update with video null ────────────────────────────────────────────
/**
 * Validates: Requirements 2.6, 3.5
 *
 * Expected (fixed): updateProperty mutation receives video: null in the JSON body.
 *
 * Bug (unfixed): videoUrl: "" is appended to the FormData body instead.
 */
describe("Case 5 — Update with video null", () => {
  it("updateProperty mutation receives video: null (not videoUrl: '' in FormData)", async () => {
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.updateProperty("existing-id", baseForm, [], null);
    });

    expect(mockUpdatePropertyMutationFn).toHaveBeenCalledTimes(1);

    const receivedArg = mockUpdatePropertyMutationFn.mock.calls[0][0];
    const body = receivedArg?.data ?? receivedArg;

    // Must NOT be FormData
    expect(body).not.toBeInstanceOf(FormData);

    // video must be null
    expect(body.video).toBeNull();

    // Must NOT have videoUrl field
    expect(body).not.toHaveProperty("videoUrl");
  });
});
