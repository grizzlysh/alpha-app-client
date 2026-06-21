# CLAUDE.md — [Pharmacy Web App]

---

## 1. Project Overview

- Name : [Pharmacy Web App]
- Description : [A modern Pharmacy POS web application focused on pharmacy operations, medicine sales, inventory monitoring, prescriptions, and cashier workflows — Client Side]
- Goal : [To provide pharmacists and pharmacy staff with a fast, responsive, and user-friendly system for managing daily pharmacy transactions, medicine inventory, prescriptions, and operational workflows efficiently.]
- Target Users: [Pharmacists, cashiers, pharmacy staff, inventory managers, and pharmacy owners.]
- Version : [v1.0.0]
- Status : [Active Development]

---

## 2. Tech Stack

- Language : [TypeScript]
- Framework : [React + Vite]
- Styling : [Tailwind CSS]
- UI Library : [shadcn/ui]
- Database : [PostgreSQL]
- ORM : [Prisma]
- Auth : [JWT Authentication]
- State Management: [Redux]
- Data Fetching : [Axios + TanStack Query (React Query)]
- Package Manager : [npm]
- Deployment : [Vercel]

---

## 3. Commands

```bash
# Development
[pm] run dev          # Jalankan dev server
[pm] run build        # Build untuk production
[pm] run start        # Jalankan production build
[pm] run lint         # Jalankan linter
[pm] run format       # Format kode

# Package Management
[pm] add [package]    # Install package baru

# Testing
[pm] run test         # Jalankan semua test
[pm] run test:unit    # Jalankan unit test saja
[pm] run test:e2e     # Jalankan e2e test saja

# Database
[pm] run db:migrate   # Jalankan migrasi
[pm] run db:seed      # Seed data awal
[pm] run db:reset     # Reset database
```

> [pm] = npm

---

## 4. Project Structure

Architecture: [Feature-Based Architecture with Clean Separation of Concerns]

```
[root]/
  [public]/
  [src]/
    [assets]/       # static assets
    [components]/
      [ui]/         # UI components
      [layout]/     # layout
      [shared]/     # shared component
      [pharmacy]/   # domain component
    [configs]/      # config files
    [pages]/        # pages
    [hooks]/        # hooks
    [service]/      # api call function
    [store]/        # redux slices
    [types]/        # typescript interace
    [utils]/        # utils
```

File Placement Rules:

- New UI Component always put in [components]
- Typescript Type always in [types]
- Helper and utility always in [utils]
- Do not make a new folder without confirmation first — exception: new folders inside `src/components/` are allowed without confirmation

---

## 5. Naming Conventions

```
# File and Folder
- Component      : PascalCase    contoh: UserCard.tsx
- Non-Component  : camelCase     contoh: useAuth.ts, getUserById.ts
- Folder        : kebab-case    contoh: user-profile/
- Page       : PascalCase    contoh: UserProfile.tsx
- Layout        : PascalCase    contoh Layout.tsx
- Test file     : [file-name].test.ts or [component].test.ts

# Inside Code
- Variable      : camelCase     contoh: userData, isLoading
- Constant     : UPPER_SNAKE_CASE   contoh: MAX_RETRY, BASE_URL
- Function        : camelCase     contoh: getUserById, formatDate
- Type/Interface: PascalCase    contoh: UserType, ApiResponse
- Enum          : PascalCase    contoh: UserRole, OrderStatus
- CSS Class     : kebab-case    contoh: user-card, nav-item

# Git Branch
- New Feature    : feat/[feature-name]
- Bug Fix       : fix/[bug-name]
- Hotfix        : hotfix/[issue-name]
- Refactor      : refactor/[scope-name]
```

---

## 6. Code Conventions

```
# Coding Approach
- Apply Clean Code, DRY, and SOLID principles
- Avoid duplicated code, extract reusable functions/hooks/components when used more than once
- Write code that is easy to read and maintain
- Prefer clarity over overly short or clever code
- Use descriptive names for variables, functions, and components
- Separate business logic from UI components
- Keep components and functions focused on a single responsibility
- Avoid hardcoded values, use constants or environment variables
- Prefer reusable and composable architecture patterns

# TypeScript
- Enable strict mode
- Do not use the `any` type
- Always define explicit return types for functions
- Use `interface` for object shapes
- Use `type` for unions, intersections, and utility types
- Use enums or constant objects for fixed status values
- Avoid unnecessary type assertions
- Use Zod for schema validation and type inference

# React Conventions
- Use functional components
- Use hooks instead of class components
- Keep components small and reusable
- Use custom hooks for reusable or complex logic
- Avoid excessive prop drilling
- Use Redux for global client state
- Use TanStack Query for server state management
- Use react-hook-form for form handling

# Import Order
1. External libraries (React, Axios, etc.)
2. Internal absolute imports (@/components, @/utils, etc.)
3. Internal relative imports (./Component, ../utils)
4. Types and interfaces
5. Assets and styles

# Export Pattern
- Use named exports for components, hooks, utilities, and functions
- Use default export only for `page.tsx` and `layout.tsx`
- Avoid mixing default and named exports in the same file

# Error Handling
- Always use try-catch for async functions
- Never leave errors unhandled
- Write clear and specific error messages
- Show user-friendly error feedback in the UI
- Log unexpected errors for debugging purposes

# API & Data Fetching
- Centralize API calls inside feature/api folders
- Do not call APIs directly inside UI components
- Use TanStack Query for caching, synchronization, and server state
- Handle loading, error, and empty states properly
- Validate API responses whenever necessary

# Styling
- Use Tailwind CSS utility classes
- Use `cn()` helper for conditional class names
- Avoid inline styles unless necessary
- Keep styling consistent across components
- Extract reusable UI patterns into shared components

# Component Structure
- One component per file
- Keep files focused and not overly large
- Co-locate related files inside feature folders

# Git Convention
- Write clear and descriptive commit messages
- Use conventional commit format
```

---

## 7. Component Rules

```
# Component Structure Order
1. Imports
2. Props types or interfaces
3. Component definition
4. Hooks (useState, useEffect, useMemo, etc.)
5. Handlers and local helper functions
6. Return JSX
7. Export

# Props Rules
- Always define props types explicitly
- Use default values for optional props
- Keep components focused and avoid excessive props
- Group related props into objects when necessary
- Avoid deeply nested props

# Small Components
- Move components into separate files if reused in multiple places
- Components used only once may stay in the same file
- Extract complex UI sections into smaller components
- Avoid components with too much logic or TSX

# Component Responsibility
- One component should handle one primary responsibility
- Separate presentation components from business logic when possible
- Avoid mixing API calls directly inside UI components
- Prefer composition over large monolithic components

# Hooks Rules
- Keep hooks at the top level of the component
- Never call hooks conditionally
- Extract reusable logic into custom hooks
- Prefix custom hooks with `use`

# Performance Guidelines
- Memoize expensive calculations with `useMemo`
- Use `useCallback` only when necessary
- Avoid unnecessary re-renders
- Lazy load heavy components or pages when appropriate
```

---

## 8. Styling Rules

```
# Styling Approach
- Use Tailwind CSS for styling
- Avoid inline styles unless the value is truly dynamic
- Do not use `!important`
- Keep styling consistent across the application
- Prefer reusable UI patterns and shared components
- Use semantic and maintainable class structures

# Tailwind CSS Rules
- Use utility classes directly inside JSX
- Use `cn()` or `clsx()` for conditional class names
- Extract repeated class patterns into reusable components
- Keep class names organized and readable
- Class Order:
  1. Layout
  2. Positioning
  3. Spacing
  4. Sizing
  5. Borders
  6. Background & colors
  7. Typography
  8. Effects & transitions
  9. States

# Responsive Design
- Follow a mobile-first approach
- Use responsive utilities provided by Tailwind CSS
- Supported breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- Test layouts on mobile, tablet, and desktop sizes
- Avoid fixed widths whenever possible

# Dark Mode
- Use Tailwind `dark:` modifiers for dark mode styling
- Ensure every new component supports dark mode
- Test UI in both light and dark themes
- Maintain proper contrast and readability

# Design Tokens
- Use CSS variables for colors, spacing, radius, and typography
- Do not hardcode color values directly
- Reuse tokens defined in the global theme configuration
- Keep design values centralized and consistent

# Component Styling
- Keep component styles self-contained
- Prefer composition over large utility chains
- Avoid deeply nested structures with excessive classes
- Extract complex UI sections into reusable components

# Animation & Transition
- Keep animations subtle and purposeful
- Prefer Tailwind transition utilities
- Avoid excessive animations that reduce usability
- Use consistent durations and easing

# Accessibility Styling
- Ensure sufficient color contrast
- Preserve visible focus states
- Avoid removing outlines without proper replacements
- Support keyboard navigation properly
```

---

## 9. API & Data Fetching Rules

```
# When to Use Server vs Client Fetching
- Use server-side fetching for:
  - Initial page data
  - SEO-critical content
  - Data that does not depend on user interaction
  - Static or infrequently changing data

- Use client-side fetching for:
  - User interactions
  - Search, filters, pagination, and sorting
  - Real-time or frequently updated data
  - Mutations and dynamic UI updates

- Use TanStack Query (React Query) for client-side data fetching
- Do not use `useEffect` directly for API fetching
- Prefer async server components when possible

# API Response Format
- All API endpoints must return a consistent response structure
  { success: boolean, data: T | null, message: string }

# Error Handling di API
- Always handle errors using try-catch
- Return appropriate HTTP status codes
- Never expose internal server errors or stack traces in production
- Provide clear and user-friendly error messages

# Fetch Function Location
- Store all API functions inside dedicated `services/` folders
- Do not write fetch logic directly inside components
- Keep API functions grouped by feature

# React Query Rules
- Use React Query for:
  - Data fetching
  - Caching
  - Synchronization
  - Optimistic updates
  - Mutation handling

- Every query must have:
  - Stable query keys
  - Loading state handling
  - Error state handling

# Mutation Rules
- Use `useMutation` for create, update, and delete actions
- Invalidate related queries after successful mutations
- Handle optimistic updates carefully

# Environment Variables
- Use environment variables for:
  - API URLs
  - API keys
  - Tokens
  - External service credentials

- Never hardcode secrets or URLs directly in the codebase
- Prefix public frontend variables properly

# Axios Configuration
- Use a centralized Axios instance
- Configure:
  - Base URL
  - Authorization headers
  - Interceptors
  - Timeout handling

# Validation & Data Safety
- Validate API payloads before sending requests
- Validate API responses when necessary
- Use Zod schemas for request and response validation
- Never trust external data directly

# Loading & Empty States
- Always handle:
  - Loading states
  - Error states
  - Empty states

- Avoid rendering blank screens while fetching data

# Caching Rules
- Cache server state using React Query
- Avoid unnecessary refetching
- Use staleTime and gcTime appropriately
- Invalidate cache only when necessary

# Authentication Handling
- Attach auth tokens using Axios interceptors
- Handle expired sessions globally
- Redirect unauthorized users properly

# Performance Guidelines
- Avoid duplicate API requests
- Use pagination for large datasets
- Lazy load non-critical data
- Debounce search requests when needed
```

---

## 10. State Management Rules

```
# State Hierarchy (Prefer the Simplest Solution First)
1. Local State (`useState`)
   - Use for state used within a single component
   - Keep state as close as possible to where it is used
2. Lifted State
   - Use when state is shared between 2–3 closely related components
   - Move state to the nearest common parent component
3. Global State
   - Use only when state is shared across many unrelated components or pages
   - Avoid turning all state into global state unnecessarily

# When to Use Global State
- Authenticated user data
- Authentication/session state
- Theme and appearance settings
- Language/locale settings
- Sidebar or layout toggle state
- Data that must persist across pages
- Cross-feature UI state

# Redux Rules
- Use Redux Toolkit (RTK)
- Create slices per feature/domain
- Avoid one massive global store
- Keep slices focused and maintainable

# Slice Rules
- Keep state minimal
- Do not store derived/computed values
- Compute derived values using selectors
- Keep reducers pure
- Avoid deeply nested state structures

# Selector Rules
- Always use selectors to access store data
- Avoid selecting the entire store
- Keep selectors small and focused
- Memoize expensive selectors with `createSelector`

# Redux Toolkit Rules
- Use `createSlice`
- Use `createAsyncThunk` only when React Query is not used
- Prefer Redux Toolkit over manual Redux setup
- Avoid excessive boilerplate

# React Query vs Redux
- Use React Query for server state
- Use Redux for global client state
- Do not duplicate API data in Redux unless necessary

# Async Logic Rules
- Keep async logic outside components when possible
- Prefer React Query for API fetching and caching
- Use middleware only when necessary

# Persistence Rules
- Persist only necessary global state
- Avoid persisting temporary UI state
- Never persist sensitive data insecurely

# Context API Rules
Use React Context only for:
- Theme
- Locale/language
- Global configuration
- Rarely changing values

Avoid Context for:
- Frequently changing state
- Complex business logic
- Large datasets

# Form State
- Use `react-hook-form` for forms
- Keep form state local
- Avoid storing form inputs in Redux

# Performance Guidelines
- Normalize large datasets when necessary
- Avoid deeply nested objects
- Use selectors to minimize re-renders
- Split slices by feature/domain
- Avoid unnecessary global state
```

---

## 11. Performance Rules

```
# Code Splitting
- Use dynamic imports for large components that are not immediately visible
- Lazy load pages and rarely used components
- Split heavy feature modules to reduce initial bundle size
- Avoid loading unnecessary JavaScript on first render

# Image Optimization
- Use optimized image components provided by the framework when available
- Always define image width and height
- Prefer WebP or AVIF image formats for new assets
- Avoid using plain HTML `<img>` tags unless necessary
- Compress images before uploading to the project

# Re-render Optimization
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed as props when necessary
- Avoid unnecessary state updates
- Avoid excessive prop drilling
- Do not overuse memoization without profiling first

# Component Optimization
- Keep components small and focused
- Split large components into smaller reusable parts
- Avoid unnecessary parent re-renders
- Use selectors for Redux state access
- Avoid inline object and array creation inside JSX when possible

# Bundle Size Optimization
- Import only what is needed
- Avoid importing entire libraries unnecessarily
- Remove unused dependencies and dead code
- Prefer lightweight libraries when possible

# React Query Optimization
- Configure `staleTime` and `gcTime` appropriately
- Avoid unnecessary refetching
- Use query invalidation carefully
- Paginate large datasets
- Use optimistic updates when appropriate

# Rendering Rules
- Render only necessary UI
- Avoid rendering hidden heavy components
- Virtualize very large lists or tables when necessary

# State Management Performance
- Keep Redux state minimal
- Avoid storing large API datasets in Redux
- Use selectors to minimize re-renders
- Normalize large collections when necessary

# Network Optimization
- Debounce search requests
- Batch requests when possible
- Cache server data properly
- Avoid duplicate API calls

# Asset Optimization
- Minify production assets
- Enable compression (gzip/brotli)
- Use caching headers properly
- Avoid oversized fonts and icons

# Fonts
- Use only necessary font weights
- Prefer system fonts when possible
- Preload critical fonts
- Avoid loading multiple unused font families

# Performance Mindset
- Optimize only after identifying bottlenecks
- Measure performance before and after optimization
- Prefer maintainable optimizations over premature micro-optimizations
```

---

## 12. Git Rules

```
# Commit Workflow
- Commit changes immediately after completing a specific task or feature
- Create small, focused commits
- Make commits before starting the next unrelated task
- Keep commit history clean and easy to understand
- Ensure the project is in a working state before committing

# Commit Message Format
Use conventional commit messages:

- `feat`     → new feature
- `fix`      → bug fix
- `refactor` → code refactoring
- `style`    → styling or formatting changes
- `docs`     → documentation updates
- `test`     → test additions or modifications
- `chore`    → tooling, dependencies, or configuration changes

# Commit Rules
- One commit should represent one specific change
- Do not combine unrelated changes in a single commit
- Write clear and descriptive commit messages
- Use present tense in commit messages
- Avoid vague messages like:
  - `fix stuff`
  - `update code`
  - `changes`

# Security Rules
- Never commit:
  - `.env`
  - API keys
  - access tokens
  - secrets
  - credentials
  - private certificates
```

---

## 14. Do Not

```
# Clarification Rules
- If instructions or requirements are ambiguous, ask for clarification before coding
- Do not make assumptions about business logic, architecture, or implementation details
- Confirm unclear requirements before modifying existing functionality

# Structure & File Rules
- Do not create new folders without confirmation — exception: new folders inside `src/components/` are allowed without confirmation
- Do not delete files without confirmation
- Do not move files without confirmation
- Do not change the existing folder structure without approval
- Do not rename files or folders unless explicitly requested

# Code Rules
- Do not use the `any` type in TypeScript
- Do not hardcode values that should come from environment variables
- Do not commit `.env` files or any secret credentials
- Do not install new packages without confirmation
- Do not modify or remove existing working features without clear instructions
- Do not introduce unnecessary abstractions or overengineering
- Do not ignore TypeScript or ESLint errors

# Forbidden Patterns
- Do not use `useEffect` for data fetching
- Do not use inline styles when utility classes or reusable styles can be used
- Do not duplicate logic that can be reused
- Do not use deprecated or unmaintained libraries
- Do not bypass validation or type safety

# API & Data Rules
- Do not call APIs directly inside UI components
- Do not expose internal server errors to the client
- Do not trust user input without validation
- Do not skip loading, error, or empty states

# Database Rules
- Do not run destructive production database commands
- Do not create database migrations without confirmation
- Do not expose database credentials to the client
- Do not write queries that can unintentionally modify large datasets

# Security Rules
- Do not expose API keys, tokens, or secrets to the client
- Do not bypass authentication or authorization checks
- Do not skip input validation
- Do not disable security protections for convenience
- Do not store sensitive data insecurely

# Git Rules
- Do not commit unrelated changes together
- Do not push broken or untested code
- Do not commit debugging logs or temporary code
- Do not force push shared branches without confirmation

# Performance Rules
- Do not optimize prematurely without identifying bottlenecks
- Do not load unnecessary dependencies or large libraries
- Do not store large server datasets in Redux unnecessarily

# UI/UX Rules
- Do not break responsive layouts
- Do not ignore accessibility considerations
- Do not introduce inconsistent styling patterns
- Do not skip dark mode support for new components

# General Development Rules
- Do not sacrifice readability for shorter code
- Do not leave TODOs or unfinished logic without clear notes
- Do not silently ignore errors
- Do not add features outside the requested scope
```

---

## 15. Environment Variables

```
# Setup
- Copy `.env.example` to `.env.local` for local development setup
- Never commit `.env` or `.env.local` files to the repository
```

---

## 16. Toast Notification Rules

```
# Component: LiveToastMessage
- Location: src/components/shared/LiveToastMessage.tsx
- Purpose: Makes toast text reactively update when the language mode changes

# Usage — Always use LiveToastMessage for translation-keyed toasts
  import { toast } from "sonner";
  import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

  // Single message
  toast.success(<LiveToastMessage getMessage={(t) => t.yourKey} />);
  toast.error(<LiveToastMessage getMessage={(t) => t.yourKey} />);
  toast.warning(<LiveToastMessage getMessage={(t) => t.yourKey} />);

  // With options (description, id, etc.)
  toast.success(
    <LiveToastMessage getMessage={(t) => t.yourTitleKey} />,
    {
      id: "some-id",
      description: <LiveToastMessage getMessage={(t) => t.yourDescKey} />,
    }
  );

# Rules
- NEVER use toast.success(t.key) directly — the text will NOT update on language switch
- Always pass a <LiveToastMessage> element as the first argument for any translation key
- LiveToastMessage reads from useLanguage() inside Sonner's portal (still in the React tree)
  so context propagates and language changes are reflected in real time
- For dynamic API error messages (e.g. getApiErrorMessage, res.message[language]):
  these are NOT translation keys — use plain toast.error(string) as-is, no LiveToastMessage needed
- Do NOT use createElement(LiveToastMessage, ...) in .ts files — rename to .tsx or restructure

# Reference implementation: src/pages/MedicinesPage.tsx — handleSuccess()
```

---