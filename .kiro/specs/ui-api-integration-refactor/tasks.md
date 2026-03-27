# Implementation Plan: UI–API Integration Refactor

## Overview

Refactor the Smart Real Estate frontend to achieve full production-ready alignment with the backend API. Work proceeds layer by layer: data types → shared primitives → custom hooks → components → pages → accessibility → tests.

## Tasks

- [x] 1. Update TypeScript interfaces and data types
  - Update the `Property` interface in `src/data/properties.ts` to include all API fields: `_id`, `priceFormatted`, `showPrice`, `images`, `video`, `amenities`, `addedBy`, `contactPhone`, `ownerSuspended`, `createdAt`
  - Update the `AdminUser` interface in `src/store/slices/usersSlice.ts` to add `email`, `phone`, and `expiresAt` fields
  - Add `CreateUserPayload` and `UpdateUserPayload` interfaces to `src/store/api/usersApi.ts` with `phone` and `expiresAt` fields
  - Update `usersApi` mutation payloads to include `phone` and `expiresAt`
  - _Requirements: 12.6, 13.2, 13.3_

- [x] 2. Update propertiesApi — _id mapping and query params
  - [x] 2.1 Map `_id` → `id` in all `propertiesApi` queryFn responses so the internal `Property` object always has `id`
    - Apply mapping in `getProperties`, `getFeaturedProperties`, `getPropertyById`, `createProperty`, and `updateProperty` responses
    - _Requirements: 13.3_
  - [ ]* 2.2 Write property test for _id → id mapping
    - **Property 14: API _id is mapped to id in Property objects**
    - **Validates: Requirements 13.3**
  - [x] 2.3 Ensure `getProperties` passes `isActive: "true"` and all required query params
    - Confirm `sort`, `page`, `pageSize`, and `isActive` are always included in the URL params
    - _Requirements: 4.5, 4.6_

- [x] 3. Upgrade ErrorState component
  - [x] 3.1 Rewrite `src/components/common/ErrorState.tsx` to accept `statusCode`, `apiMessage`, `message`, `description`, `onRetry`, `onLogin`, `onLogout`, and `onBack` props
    - Implement the status-to-message mapping table: 401 → "يجب تسجيل الدخول أولاً", 403/"انتهت صلاحية الحساب" → "انتهت صلاحية حسابك", 403/other → "غير مصرح بالوصول لهذا العقار", 404 → "العنصر المطلوب غير موجود", 500 → "حدث خطأ في الخادم، حاول مجدداً لاحقاً"
    - Render `onLogin` button for 401, `onLogout` button for 403 expired, `onBack` button for 404, `onRetry` button when provided
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  - [ ]* 3.2 Write property test for ErrorState HTTP status mapping
    - **Property 9: ErrorState maps HTTP status codes to correct Arabic messages**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5, 9.7**

- [x] 4. Upgrade SkeletonCard component
  - [x] 4.1 Rewrite `src/components/property/SkeletonCard.tsx` to mirror the exact `PropertyCard` layout
    - Image area: `aspect-[4/3]` using `<Skeleton>` primitive
    - Title placeholder, location placeholder (with MapPin-sized gap), specs row placeholder — same vertical order as `PropertyCard`
    - Add `aria-hidden="true"` and `aria-busy="true"` on the container element
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.5_
  - [ ]* 4.2 Write unit tests for SkeletonCard
    - Verify `aria-hidden` and `aria-busy` attributes are present
    - Verify `animate-pulse` is applied
    - _Requirements: 10.3, 11.5_

- [x] 5. Decompose PropertyCard into sub-components
  - [x] 5.1 Create `src/components/property/PriceBadge.tsx`
    - When `showPrice` is `false`: render a WhatsApp CTA link (`wa.me`) using `contactPhone` or fallback `WHATSAPP_NUMBER`
    - When `showPrice` is `true`: render `priceFormatted` text
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]* 5.2 Write property test for PriceBadge showPrice rendering
    - **Property 1: PriceBadge renders correctly based on showPrice**
    - **Validates: Requirements 1.2, 1.3**
  - [x] 5.3 Create `src/components/property/LocationTag.tsx`
    - Render `property.neighborhood` with a MapPin icon
    - Accept `neighborhood` and `location` props
    - _Requirements: 1.1, 1.4_
  - [x] 5.4 Create `src/components/property/SpecsRibbon.tsx`
    - Render bedrooms (only when `bedrooms > 0`), bathrooms, and area in a single horizontal row
    - _Requirements: 1.1, 1.5, 1.6_
  - [ ]* 5.5 Write property test for SpecsRibbon bedrooms omission
    - **Property 2: SpecsRibbon omits bedrooms when zero**
    - **Validates: Requirements 1.5, 1.6**
  - [x] 5.6 Rewrite `src/components/PropertyCard.tsx` to compose `PriceBadge`, `LocationTag`, and `SpecsRibbon`
    - Add `aria-label={`عرض تفاصيل العقار: ${property.title}`}` to the `<Link>` element
    - _Requirements: 1.1, 1.7, 11.4_
  - [ ]* 5.7 Write property test for PropertyCard aria-label
    - **Property 10: PropertyCard aria-label contains property title**
    - **Validates: Requirements 11.4**

- [x] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update usePropertyFilters hook
  - [x] 7.1 Add `useMemo` to derive the `priceRange` API param string from Redux state in `src/hooks/usePropertyFilters.ts`
    - When `neighborhood` is `"الكل"`, omit it from the returned query params object
    - When `type` is `"الكل"`, omit it from the returned query params object
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3, 6.4_
  - [ ]* 7.2 Write property test for "الكل" filter omission
    - **Property 5: "الكل" filter values are omitted from API query params**
    - **Validates: Requirements 4.3, 4.4**
  - [ ]* 7.3 Write property test for page reset on filter change
    - **Property 6: Page resets to 1 on any filter change**
    - **Validates: Requirements 6.2**
  - [ ]* 7.4 Write property test for hasActiveFilters
    - **Property 7: hasActiveFilters reflects Redux filter state**
    - **Validates: Requirements 6.4**

- [x] 8. Update usePropertyList hook
  - [x] 8.1 Verify `src/hooks/usePropertyList.ts` derives `isInitialLoad` as `isLoading` and `isRefetching` as `isFetching && !isLoading`
    - Ensure the hook calls `useGetPropertiesQuery` with `isActive: true` and the full filter state from `usePropertyFilters`
    - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2_
  - [ ]* 8.2 Write property test for isInitialLoad and isRefetching derivation
    - **Property 4: isInitialLoad and isRefetching are correctly derived**
    - **Validates: Requirements 3.3**

- [x] 9. Create useAdminActions hook
  - [x] 9.1 Create `src/hooks/useAdminActions.ts`
    - Implement `buildCreateFormData(form, images, video)` — appends all required fields including `amenities` as `JSON.stringify(amenities)` and `location: "المنيا الجديدة"`
    - Implement `buildUpdateFormData(form, existingImages, newImages, existingVideo, newVideo)` — appends `existingImages` as `JSON.stringify(existingImages)`, handles `videoUrl` for existing/removed video, appends new video file under `video` key
    - Wire `createProperty` and `updateProperty` mutations from `propertiesApi`
    - Return `isCreating` and `isUpdating` loading flags
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 13.1_
  - [ ]* 9.2 Write property test for FormData round-trip
    - **Property 8: FormData round-trip preserves property fields**
    - **Validates: Requirements 7.1, 7.2, 13.1, 13.4**

- [x] 10. Refactor Properties page to use custom hooks
  - Update `src/pages/Properties.tsx` to use `usePropertyList` and `usePropertyFilters` exclusively — remove direct `useGetPropertiesQuery` call and direct Redux selector calls for filter state
  - Replace the inline `SkeletonCard` definition with the shared `SkeletonCard` from `src/components/property/SkeletonCard.tsx`
  - Use `styles.propertyGrid` from `src/lib/styles.ts` for the grid class
  - Use `styles.glassCard` for the filter panel container
  - Add `aria-busy={isInitialLoad}` to the property list container
  - Wrap pagination in `<nav aria-label="التنقل بين الصفحات">` with `aria-label` on prev/next buttons and `aria-current="page"` on the active page button
  - _Requirements: 3.1, 3.2, 5.4, 8.1, 8.2, 8.4, 11.1, 11.6, 11.7_

- [x] 11. Update FeaturedProperties component
  - Replace the inline `SkeletonCard` in `src/components/FeaturedProperties.tsx` with the shared `SkeletonCard` from `src/components/property/SkeletonCard.tsx`
  - Show `SkeletonCard` components during `isInitialLoad` (`isLoading === true`)
  - Replace the inline error div with the upgraded `ErrorState` component with a `refetch` trigger
  - Use `styles.propertyGrid` for the grid class
  - _Requirements: 3.4, 3.5, 8.1_

- [x] 12. Update AdminProperties page — ownerSuspended and expiresAt badges
  - In `src/pages/admin/AdminProperties.tsx`, read the current user's role from `localStorage.adminUser`
  - For `super_admin` role: render a "موقوف" badge when `property.ownerSuspended === true` and a "منتهي الصلاحية" badge when `property.expiresAt` is a past date
  - Gate badge rendering on `role === "super_admin"` so `property_admin` users never see them
  - Replace the inline error div with the upgraded `ErrorState` component (pass `statusCode` and `apiMessage` from the RTK Query error)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 12.1 Write property test for admin badge display logic
    - **Property 3: Admin property badge display matches ownerSuspended and expiresAt**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 13. Update AdminUsers page — expiresAt and phone fields
  - [x] 13.1 Add `expiresAt` date input to the create/edit modal in `src/pages/admin/AdminUsers.tsx`
    - Show the field only when `form.role === "property_admin"`; hide it for `super_admin`
    - _Requirements: 12.1, 12.2_
  - [ ]* 13.2 Write property test for expiresAt field visibility
    - **Property 13: expiresAt field visibility depends on role**
    - **Validates: Requirements 12.1, 12.2**
  - [x] 13.3 Add `phone` field to the create form with Egyptian mobile number validation (`/^(\+?20)?01[0125]\d{8}$/`)
    - Show a validation error when the pattern does not match
    - _Requirements: 12.3_
  - [ ]* 13.4 Write property test for Egyptian phone number validation
    - **Property 12: Egyptian phone number validation**
    - **Validates: Requirements 12.3**
  - [x] 13.5 Update `usersApi` `createUser` and `updateUser` mutation payloads to include `phone` and `expiresAt`
    - _Requirements: 12.4, 12.5_

- [x] 14. Update CustomSelect for accessibility
  - Add `role="combobox"`, `aria-expanded={isOpen}`, and `aria-haspopup="listbox"` to the trigger button in `src/components/CustomSelect.tsx`
  - Add `role="listbox"` to the dropdown container
  - Add `role="option"` and `aria-selected={isSelected}` to each option button
  - _Requirements: 11.2, 11.3_
  - [ ]* 14.1 Write property test for CustomSelect aria-expanded
    - **Property 11: CustomSelect aria-expanded reflects open/closed state**
    - **Validates: Requirements 11.3**

- [x] 15. Refactor AddProperty and EditProperty to use useAdminActions
  - Update `src/pages/admin/AddProperty.tsx` to call `useAdminActions().buildCreateFormData` and `useAdminActions().createProperty` instead of constructing `FormData` inline
  - Update `src/pages/admin/EditProperty.tsx` to call `useAdminActions().buildUpdateFormData` and `useAdminActions().updateProperty` instead of constructing `FormData` inline
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` (already installed) with `fc.configureGlobal({ numRuns: 100 })`
- Property test files live under `src/**/__tests__/*.property.test.{ts,tsx}`
- Unit test files live under `src/**/__tests__/*.test.{ts,tsx}`
- The `vitest.config.ts` already includes jsdom + `@testing-library/react` setup
