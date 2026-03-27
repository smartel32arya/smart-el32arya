# Requirements Document

## Introduction

This feature refactors the Smart Real Estate ("سمارت العقارية") frontend — a React + TypeScript + RTK Query application targeting the "New Minya" (المنيا الجديدة) market — to achieve full, production-ready alignment with the backend API defined in `api.md`. The refactor covers:

- Atomic decomposition of `PropertyCard` into focused sub-components
- Admin-specific UI reflecting `ownerSuspended` and `expiresAt` status
- RTK Query state management with correct skeleton / refetch patterns
- Derived state via `useMemo` for API query parameter construction
- Custom hooks (`usePropertyList`, `usePropertyFilters`, `useAdminActions`) for business-logic separation
- `multipart/form-data` handling for Cloudinary image/video uploads and `existingImages` management
- Responsive grids and "New Minya" Gold/Glassmorphism branding via Tailwind constants
- Typed HTTP error mapping (401 / 403 / 404) through a reusable `ErrorState` component
- `SkeletonCard` that mirrors the exact `PropertyCard` layout
- Full Arabic ARIA labels and semantic HTML for RTL accessibility

---

## Glossary

- **System**: The Smart Real Estate frontend application
- **PropertyCard**: The card component that renders a single property listing
- **PriceBadge**: Sub-component of `PropertyCard` that renders the price or "ask for price" CTA based on `showPrice`
- **LocationTag**: Sub-component of `PropertyCard` that renders the neighborhood using the API enum values
- **SpecsRibbon**: Sub-component of `PropertyCard` that renders bedrooms, bathrooms, and area specs
- **SkeletonCard**: Placeholder component that mirrors the exact layout of `PropertyCard` during loading
- **ErrorState**: Reusable error feedback component with typed HTTP status handling and a refetch trigger
- **propertiesApi**: RTK Query API slice for all property-related endpoints (`/api/properties`, `/api/admin/properties`)
- **usersApi**: RTK Query API slice for all user-related endpoints (`/api/admin/users`)
- **usePropertyList**: Custom hook that encapsulates RTK Query call and loading-state derivation for the public properties list
- **usePropertyFilters**: Custom hook that synchronises URL search params with Redux filter state
- **useAdminActions**: Custom hook that encapsulates `multipart/form-data` construction for property create/update, including Cloudinary image upload and `existingImages` management
- **AdminProperties**: Admin dashboard page listing all properties with `ownerSuspended` and `expiresAt` badges
- **AdminUsers**: Admin dashboard page for managing admin user accounts
- **isInitialLoad**: Boolean flag — `true` only on the very first fetch when no cached data exists (`isLoading === true`)
- **isRefetching**: Boolean flag — `true` when RTK Query is re-fetching with existing cached data (`isFetching && !isLoading`)
- **priceRange**: API query parameter in `min-max` string format (e.g. `500000-2000000`) or the literal `all`
- **ownerSuspended**: Boolean field present on admin property responses; `true` when the property owner's account is inactive or expired
- **expiresAt**: ISO 8601 date string on the User object; `null` for `super_admin` accounts
- **Cloudinary**: Third-party image/video hosting service used by the backend for media storage
- **existingImages**: JSON-encoded array of existing image URLs sent in `PUT /api/admin/properties/:id` to indicate which images to keep
- **Gold/Glassmorphism**: The "New Minya" design system branding — gold gradient buttons (`gradient-gold`) and frosted-glass cards (`glass-card`) defined as Tailwind utility classes
- **RTL**: Right-to-left text direction used throughout the Arabic UI

---

## Requirements

---

### Requirement 1: Atomic PropertyCard Decomposition

**User Story:** As a visitor, I want property cards to clearly display price, location, and specs so that I can quickly evaluate listings at a glance.

#### Acceptance Criteria

1. THE `PropertyCard` SHALL render three dedicated sub-components: `PriceBadge`, `LocationTag`, and `SpecsRibbon`.
2. WHEN `property.showPrice` is `false`, THE `PriceBadge` SHALL display a WhatsApp CTA link instead of the price value.
3. WHEN `property.showPrice` is `true`, THE `PriceBadge` SHALL display `property.priceFormatted` as returned by the API.
4. THE `LocationTag` SHALL render `property.neighborhood` using only the values defined in the API neighborhood enum: `حي الزهراء` | `الحي الثامن` | `الحي الأول` | `المحور المركزي`.
5. THE `SpecsRibbon` SHALL display `property.bedrooms`, `property.bathrooms`, and `property.area` in a single horizontal row.
6. WHEN `property.bedrooms` is `0`, THE `SpecsRibbon` SHALL omit the bedrooms indicator.
7. THE `PropertyCard` SHALL apply the `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` responsive grid when rendered inside a property list.

---

### Requirement 2: Admin-Specific Property Status UI

**User Story:** As a super_admin, I want to see visual indicators for suspended and expired property listings so that I can quickly identify accounts that need attention.

#### Acceptance Criteria

1. WHEN `property.ownerSuspended` is `true`, THE `AdminProperties` page SHALL display a visible "موقوف" badge on the affected property row.
2. WHEN the owner's `expiresAt` date is in the past, THE `AdminProperties` page SHALL display a visible "منتهي الصلاحية" badge on the affected property row.
3. WHEN `property.ownerSuspended` is `false` and `expiresAt` is in the future or `null`, THE `AdminProperties` page SHALL display no suspension or expiry badge.
4. THE `AdminProperties` page SHALL only render `ownerSuspended` badges for users with the `super_admin` role, as the API only returns this field for `super_admin` requests.
5. WHEN the admin API returns a `403` response with message `"انتهت صلاحية الحساب"`, THE `System` SHALL display an `ErrorState` component with the message "انتهت صلاحية حسابك" and a logout action.

---

### Requirement 3: RTK Query State Management with Correct Loading Patterns

**User Story:** As a visitor, I want smooth loading transitions so that the page does not flash or shift layout while data is being fetched.

#### Acceptance Criteria

1. WHEN `isInitialLoad` is `true` (i.e. `isLoading === true`), THE `System` SHALL render `SkeletonCard` components in place of real property cards.
2. WHEN `isRefetching` is `true` (i.e. `isFetching && !isLoading`), THE `System` SHALL apply `opacity-40 pointer-events-none` to the existing property grid without replacing cards with skeletons.
3. THE `usePropertyList` hook SHALL derive `isInitialLoad` as `isLoading` and `isRefetching` as `isFetching && !isLoading` from the RTK Query result.
4. THE `FeaturedProperties` component SHALL use `useGetFeaturedPropertiesQuery` and show `SkeletonCard` components during `isInitialLoad`.
5. WHEN `useGetFeaturedPropertiesQuery` returns an error, THE `FeaturedProperties` component SHALL display an `ErrorState` component with a refetch trigger.

---

### Requirement 4: Derived State for API Query Parameter Construction

**User Story:** As a developer, I want filter state to be correctly transformed into API query parameters so that the backend receives well-formed requests.

#### Acceptance Criteria

1. THE `usePropertyFilters` hook SHALL use `useMemo` to derive the `priceRange` API parameter string in `min-max` format from the Redux filter state.
2. WHEN `priceRange` in Redux state is `"all"`, THE `usePropertyFilters` hook SHALL pass `"all"` to the API (which the `propertiesApi` queryFn already omits from the URL params).
3. WHEN `neighborhood` in Redux state is `"الكل"`, THE `usePropertyFilters` hook SHALL not include the `neighborhood` parameter in the API request.
4. WHEN `type` in Redux state is `"الكل"`, THE `usePropertyFilters` hook SHALL not include the `type` parameter in the API request.
5. THE `propertiesApi.getProperties` endpoint SHALL pass `sort`, `page`, and `pageSize` as query parameters on every request.
6. THE `propertiesApi.getProperties` endpoint SHALL pass `isActive: "true"` for public property list requests.

---

### Requirement 5: Custom Hook — usePropertyList

**User Story:** As a developer, I want property list logic encapsulated in a single hook so that the `Properties` page component stays focused on rendering.

#### Acceptance Criteria

1. THE `usePropertyList` hook SHALL return `properties`, `total`, `totalPages`, `isInitialLoad`, `isRefetching`, `isError`, and `refetch`.
2. THE `usePropertyList` hook SHALL call `useGetPropertiesQuery` with `isActive: true` and the current filter state from `usePropertyFilters`.
3. WHEN the URL contains `neighborhood`, `type`, or `priceRange` search parameters on mount, THE `usePropertyFilters` hook SHALL dispatch the corresponding Redux actions to synchronise state.
4. THE `Properties` page SHALL use `usePropertyList` and `usePropertyFilters` exclusively for data and filter state, removing direct RTK Query calls from the page component.

---

### Requirement 6: Custom Hook — usePropertyFilters

**User Story:** As a visitor, I want filter selections made on the hero search form to persist when navigating to the properties page so that my search context is not lost.

#### Acceptance Criteria

1. THE `usePropertyFilters` hook SHALL read `neighborhood`, `type`, and `priceRange` from URL search parameters on mount and dispatch them to Redux.
2. WHEN a filter value changes, THE `usePropertyFilters` hook SHALL reset `page` to `1` via the Redux `setPage` action.
3. THE `usePropertyFilters` hook SHALL expose `setNeighborhood`, `setType`, `setPriceRange`, `setSort`, `setPage`, and `clearFilters` as dispatcher wrappers.
4. THE `usePropertyFilters` hook SHALL expose `hasActiveFilters` derived from the Redux selector `selectHasActiveFilters`.

---

### Requirement 7: Custom Hook — useAdminActions (multipart/form-data)

**User Story:** As a property_admin, I want to upload images and videos when creating or editing a property so that listings have rich media content.

#### Acceptance Criteria

1. THE `useAdminActions` hook SHALL construct a `FormData` object containing all required fields for `POST /api/admin/properties` as defined in the API spec.
2. WHEN updating a property, THE `useAdminActions` hook SHALL include `existingImages` as a JSON-encoded array of URLs to keep, per the `PUT /api/admin/properties/:id` spec.
3. WHEN a new video file is provided, THE `useAdminActions` hook SHALL append it under the `video` field key.
4. WHEN no new video is provided and an existing video URL exists, THE `useAdminActions` hook SHALL append `videoUrl` with the existing URL.
5. WHEN the user removes the existing video, THE `useAdminActions` hook SHALL append `videoUrl` as an empty string `""` to signal deletion to the backend.
6. THE `useAdminActions` hook SHALL call `useCreatePropertyMutation` for new properties and `useUpdatePropertyMutation` for edits, both from `propertiesApi`.
7. WHEN a create or update mutation succeeds, THE `useAdminActions` hook SHALL invalidate the `"Property"` RTK Query tag to trigger a cache refresh.

---

### Requirement 8: Responsive Grid and Theme Consistency

**User Story:** As a visitor on any device, I want property grids to display correctly and consistently with the "New Minya" branding so that the experience feels polished.

#### Acceptance Criteria

1. THE `System` SHALL use the `styles.propertyGrid` constant (`"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"`) from `src/lib/styles.ts` for all property grid layouts.
2. THE `System` SHALL use the `styles.glassCard` constant (`"glass-card rounded-3xl p-6 md:p-8 shadow-2xl"`) for filter panel containers.
3. THE `System` SHALL use the `styles.gradientBtn` constant for all primary CTA buttons.
4. WHEN the property grid is in `isRefetching` state, THE `System` SHALL maintain the grid layout without collapsing or shifting.
5. THE `SkeletonCard` SHALL match the exact aspect ratio, padding, and element positions of the real `PropertyCard` to prevent cumulative layout shift (CLS).

---

### Requirement 9: Typed HTTP Error Mapping via ErrorState

**User Story:** As a visitor or admin, I want clear, actionable error messages when API calls fail so that I know what went wrong and how to proceed.

#### Acceptance Criteria

1. THE `ErrorState` component SHALL accept `statusCode`, `message`, `description`, and `onRetry` props.
2. WHEN the API returns a `401` status, THE `ErrorState` component SHALL display the message "يجب تسجيل الدخول أولاً" with a login redirect action.
3. WHEN the API returns a `403` status with message `"انتهت صلاحية الحساب"`, THE `ErrorState` component SHALL display "انتهت صلاحية حسابك" with a logout action.
4. WHEN the API returns a `403` status with message `"غير مصرح: هذا العقار لم يتم إضافته بواسطتك"`, THE `ErrorState` component SHALL display "غير مصرح بالوصول لهذا العقار".
5. WHEN the API returns a `404` status, THE `ErrorState` component SHALL display "العنصر المطلوب غير موجود" with a back-navigation action.
6. WHEN `onRetry` is provided, THE `ErrorState` component SHALL render a "إعادة المحاولة" button that calls `onRetry` on click.
7. IF the API returns a `500` status, THEN THE `ErrorState` component SHALL display "حدث خطأ في الخادم، حاول مجدداً لاحقاً".

---

### Requirement 10: SkeletonCard Layout Fidelity

**User Story:** As a visitor, I want skeleton placeholders to match the real card layout so that the page does not jump when content loads.

#### Acceptance Criteria

1. THE `SkeletonCard` SHALL render an image placeholder with `aspect-ratio: 4/3` matching the `PropertyCard` image area.
2. THE `SkeletonCard` SHALL render a title placeholder, a location placeholder, and a specs row placeholder in the same vertical order as `PropertyCard`.
3. THE `SkeletonCard` SHALL apply `animate-pulse` to all placeholder elements.
4. THE `SkeletonCard` SHALL use the shared `Skeleton` primitive from `src/components/common/Skeleton.tsx`.
5. FOR ALL viewport widths, THE `SkeletonCard` SHALL maintain the same width and height as a real `PropertyCard` in the same grid position.

---

### Requirement 11: Advanced Accessibility (a11y)

**User Story:** As a user relying on assistive technology, I want the UI to be navigable and understandable in Arabic so that I can use the application independently.

#### Acceptance Criteria

1. THE pagination controls in `Properties` page SHALL be wrapped in a `<nav>` element with `aria-label="التنقل بين الصفحات"`.
2. THE `CustomSelect` component SHALL render its trigger button with `role="combobox"` and the dropdown list with `role="listbox"`.
3. WHEN the `CustomSelect` dropdown is open, THE trigger button SHALL have `aria-expanded="true"`; WHEN closed, `aria-expanded="false"`.
4. THE `PropertyCard` link SHALL include `aria-label` in the format `"عرض تفاصيل العقار: {property.title}"`.
5. THE `SkeletonCard` SHALL include `aria-hidden="true"` and `aria-busy="true"` on its container to hide it from screen readers during loading.
6. WHEN `isInitialLoad` is `true`, THE property list container SHALL have `aria-busy="true"`.
7. ALL icon-only buttons (view toggle, pagination arrows) SHALL have descriptive `aria-label` attributes in Arabic.

---

### Requirement 12: Admin Users — expiresAt and Phone Fields

**User Story:** As a super_admin, I want to set and view expiry dates and phone numbers for property_admin accounts so that I can manage subscription lifecycles.

#### Acceptance Criteria

1. THE `AdminUsers` create/edit modal SHALL include an `expiresAt` date input for `property_admin` accounts.
2. WHEN `role` is `super_admin`, THE `AdminUsers` modal SHALL hide the `expiresAt` field, as the API ignores and forces it to `null` for super admins.
3. THE `AdminUsers` create form SHALL include a `phone` field validated against the Egyptian mobile number pattern `01[0125]XXXXXXXX`.
4. THE `usersApi.createUser` mutation payload SHALL include `phone` and `expiresAt` fields as defined in `POST /api/admin/users`.
5. THE `usersApi.updateUser` mutation payload SHALL include `expiresAt` to support subscription renewal via `PUT /api/admin/users/:id`.
6. THE `AdminUser` TypeScript interface in `usersSlice.ts` SHALL include `email`, `phone`, and `expiresAt` fields to match the API User object shape.

---

### Requirement 13: Round-Trip API Data Integrity

**User Story:** As a developer, I want property data serialised to FormData and deserialised from API responses to be equivalent so that no data is silently lost or corrupted.

#### Acceptance Criteria

1. THE `useAdminActions` hook SHALL serialise `amenities` as `JSON.stringify(amenities)` when appending to `FormData`, matching the API spec field format.
2. WHEN the API returns a property, THE `Property` TypeScript type SHALL include all fields from the API Property Object: `_id`, `title`, `description`, `price`, `priceFormatted`, `showPrice`, `location`, `neighborhood`, `type`, `bedrooms`, `bathrooms`, `area`, `image`, `images`, `video`, `amenities`, `featured`, `active`, `addedBy`, `contactPhone`, `ownerSuspended`, and `createdAt`.
3. THE `propertiesApi` SHALL use `_id` as the canonical identifier field from API responses, mapping it to `id` for internal use where needed.
4. FOR ALL valid property form submissions, serialising to `FormData` and receiving the API response SHALL produce a property object with equivalent field values (round-trip property).
