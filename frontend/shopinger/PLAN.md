# Project Plan: Shopinger Frontend

This plan outlines the necessary steps to build a robust and scalable React application using a cohesive stack: **MUI** for components, **TanStack** for routing, data fetching, and tables, and **Redux** for global client state.

## 1. Foundational Setup & Dependencies

We will install a comprehensive set of libraries to build upon.

*   **UI Components (MUI):** `@mui/material @emotion/react @emotion/styled`
*   **Icons:** `@mui/icons-material`
*   **Charting:** `react-chartjs-2 chart.js`
*   **The TanStack Ecosystem:**
    *   **Routing:** `@tanstack/react-router`
    *   **Data Fetching & State:** `@tanstack/react-query`
    *   **Data Grids/Tables:** `@tanstack/react-table`
*   **Global Client State:** `@reduxjs/toolkit react-redux`
*   **API Communication:** `axios`

## 2. Scalable Folder Structure

The folder structure is designed for clarity and scalability:

```
src/
|-- api/
|   |-- axiosConfig.ts
|-- app/
|   |-- store.ts            # Redux store (for client state)
|   |-- hooks.ts
|-- assets/
|-- components/
|   |-- common/
|   |-- layout/
|   |-- table/              # Reusable table components built with TanStack Table
|-- features/
|   |-- auth/
|   |   |-- authSlice.ts    # Redux slice for auth state
|   |   |-- Login.tsx
|   |-- admin/
|   |-- customer/
|-- routes/
|   |-- routeTree.tsx
|-- services/               # API service functions (used by TanStack Query)
|   |-- authService.ts
|   |-- inventoryService.ts
|-- styles/
|   |-- theme.ts
|-- utils/
|-- types/
|-- constants/
```

## 3. Application Architecture & Data Flow

The architecture now clearly distinguishes between **Server State** and **Client State**.

*   **Server State (managed by TanStack Query):** All data fetched from your API (products, orders, users) will be managed by TanStack Query. This handles caching, background refetching, and data synchronization automatically.
*   **Client State (managed by Redux):** Global UI state that is not persisted on the backend will be handled by Redux. This is perfect for things like the user's authentication status, theme preferences, or the state of a shopping cart before checkout.

Here is the updated data flow diagram:

```mermaid
graph TD
    subgraph Browser
        A[User Interaction] --> B{React Components};
    end

    subgraph "React Application"
        B -- Calls Query Hook --> TQ[TanStack Query];
        TQ -- Uses Service --> D{API Services (Axios)};
        TQ -- Manages Server Cache & State --> B;

        B -- Dispatches Action --> C[Redux Store];
        C -- Manages Client State --> B;

        B -- Navigates via --> G[TanStack Router]
    end

    subgraph "Backend"
        D -- HTTP Request --> E[API Server];
        E -- HTTP Response --> D;
    end

    B -- Renders UI --> F[DOM];

    style TQ fill:#f26b21,stroke:#333,stroke-width:2px
    style C fill:#764abc,stroke:#333,stroke-width:2px
    style G fill:#9cf,stroke:#333,stroke-width:2px
```

## 4. Core Features Implementation Plan

### A. Authentication & Routing
1.  **Setup Routing & Query Provider:** Configure TanStack Router in `routeTree.tsx` and wrap the application with the `QueryClientProvider`.
2.  **Implement Protected Routes:** Use TanStack Router's `beforeLoad` event to check the Redux `authSlice` for user authentication and role.
3.  **Build Login/Register Pages:** Use TanStack Query's `useMutation` hook for login/register actions, which will update the Redux store on success.

### B. Role-Based Dashboards & Features

*   **Customer:**
    *   Use `useQuery` to fetch and display products.
    *   Manage shopping cart state in a Redux slice.
    *   Use `useQuery` to fetch personal order history and display it using **TanStack Table**.

*   **Admin (Manager):**
    *   Dashboard with analytics using `react-chartjs-2`, fed by data from `useQuery`.
    *   Display inventory in a data grid built with **TanStack Table**.
    *   Use `useMutation` for all inventory and user management CRUD operations.

*   **Teller:**
    *   POS interface using `useMutation` to create sales.
    *   View inventory with **TanStack Table**.

*   **Deliverer:**
    *   View assigned deliveries in a list/table using `useQuery` and **TanStack Table**.
    *   Update delivery status with `useMutation`.
