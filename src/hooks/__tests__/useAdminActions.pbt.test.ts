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
const mockAppendPropertyImagesMutationFn = vi.fn();
const mockReplacePropertyImagesMutationFn = vi.fn();
const mockAddPropertyVideoMutationFn = vi.fn();
const mockReplacePropertyVideoMutationFn = vi.fn();
const mockDeletePropertyVideoMutationFn = vi.fn();

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
  useAppendPropertyImagesMutation: () => [
    mockAppendPropertyImagesMutationFn,
    { isLoading: false },
  ],
  useReplacePropertyImagesMutation: () => [
    mockReplacePropertyImagesMutationFn,
    { isLoading: false },
  ],
  useAddPropertyVideoMutation: () => [
    mockAddPropertyVideoMutationFn,
    { isLoading: false },
  ],
  useReplacePropertyVideoMutation: () => [
    mockReplacePropertyVideoMutationFn,
    { isLoading: false },
  ],
  useDeletePropertyVideoMutation: () => [
    mockDeletePropertyVideoMutationFn,
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

const makeImageFile = (name = "photo.jpg") =>
  new File(["img-data"], name, { type: "image/jpeg" });

const makeVideoFile = (name = "tour.mp4") =>
  new File(["vid-data"], name, { type: "video/mp4" });

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  makeUnwrappable(mockCreatePropertyMutationFn, { _id: "new-id-123", id: "new-id-123" });
  makeUnwrappable(mockUpdatePropertyMutationFn, { _id: "existing-id", id: "existing-id" });
  makeUnwrappable(mockAppendPropertyImagesMutationFn, {});
  makeUnwrappable(mockReplacePropertyImagesMutationFn, {});
  makeUnwrappable(mockAddPropertyVideoMutationFn, {});
  makeUnwrappable(mockReplacePropertyVideoMutationFn, {});
  makeUnwrappable(mockDeletePropertyVideoMutationFn, {});
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

// ── Case 2: Create with images ────────────────────────────────────────────────
/**
 * Validates: Requirements 1.2
 *
 * Expected (fixed): appendPropertyImages mutation is called with the image file
 *   after the scalar create succeeds.
 *
 * Bug (unfixed): images are bundled into the single FormData create request;
 *   no separate call to POST /:id/images is made.
 */
describe("Case 2 — Create with images", () => {
  it("appendPropertyImages mutation is called with the image file after scalar create", async () => {
    const imageFile = makeImageFile();
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.createProperty(baseForm, [imageFile], null);
    });

    // The images mutation must have been called
    expect(mockAppendPropertyImagesMutationFn).toHaveBeenCalledTimes(1);

    const imagesArg = mockAppendPropertyImagesMutationFn.mock.calls[0][0];

    // The argument must contain the image file
    const body: FormData = imagesArg.data ?? imagesArg;
    const hasFile =
      body instanceof FormData
        ? body.get("images") === imageFile || [...(body.getAll("images"))].includes(imageFile)
        : imagesArg.images === imageFile || (Array.isArray(imagesArg.images) && imagesArg.images.includes(imageFile));

    expect(hasFile).toBe(true);
  });
});

// ── Case 3: Create with video ─────────────────────────────────────────────────
/**
 * Validates: Requirements 1.3
 *
 * Expected (fixed): addPropertyVideo mutation is called after the scalar create.
 *
 * Bug (unfixed): video is bundled into the single FormData create request;
 *   no separate call to POST /:id/video is made.
 */
describe("Case 3 — Create with video", () => {
  it("addPropertyVideo mutation is called after scalar create", async () => {
    const videoFile = makeVideoFile();
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.createProperty(baseForm, [], videoFile);
    });

    expect(mockAddPropertyVideoMutationFn).toHaveBeenCalledTimes(1);
  });
});

// ── Case 4: Edit — remove video ───────────────────────────────────────────────
/**
 * Validates: Requirements 1.7
 *
 * Expected (fixed): deletePropertyVideo mutation is called (not videoUrl: "" in body).
 *
 * Bug (unfixed): videoUrl: "" is appended to the FormData body; no DELETE call is made.
 */
describe("Case 4 — Edit remove video", () => {
  it("deletePropertyVideo mutation is called when videoRemoved=true (not videoUrl:'' in body)", async () => {
    const existingImages = ["https://example.com/img1.jpg"];
    const existingVideo = "https://example.com/video.mp4";
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.updateProperty(
        "existing-id",
        baseForm,
        existingImages,
        [],           // no new images
        existingVideo,
        null,         // no new video
        true          // videoRemoved = true
      );
    });

    // deletePropertyVideo must be called
    expect(mockDeletePropertyVideoMutationFn).toHaveBeenCalledTimes(1);

    // The scalar update body must NOT contain videoUrl: ""
    const scalarArg = mockUpdatePropertyMutationFn.mock.calls[0][0];
    const body = scalarArg?.data ?? scalarArg;
    if (body instanceof FormData) {
      expect(body.get("videoUrl")).not.toBe("");
    } else {
      expect(body).not.toHaveProperty("videoUrl");
    }
  });
});

// ── Case 5: Edit — add images ─────────────────────────────────────────────────
/**
 * Validates: Requirements 1.5
 *
 * Expected (fixed): replacePropertyImages mutation is called when new images are added.
 *
 * Bug (unfixed): new images are bundled into the scalar PUT FormData body;
 *   no separate call to PUT /:id/images is made.
 */
describe("Case 5 — Edit add images", () => {
  it("replacePropertyImages mutation is called when new images are added", async () => {
    const existingImages = ["https://example.com/img1.jpg"];
    const newImg = makeImageFile("new-photo.jpg");
    const existingVideo = "https://example.com/video.mp4";
    const { result } = renderHook(() => useAdminActions());

    await act(async () => {
      await result.current.updateProperty(
        "existing-id",
        baseForm,
        existingImages,
        [newImg],     // new images added
        existingVideo,
        null,         // no new video
        false         // videoRemoved = false
      );
    });

    expect(mockReplacePropertyImagesMutationFn).toHaveBeenCalledTimes(1);
  });
});
