# Admin Dashboard

This project is a modern, responsive admin dashboard built with React. It provides a user-friendly interface for managing application data.

## About The Project

This dashboard is designed to provide administrators with a comprehensive overview and control over the application's key metrics and data. It features a clean and intuitive UI for managing users, banks, and other system entities.

### Built With

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [React Router](https://reactrouter.com/)
*   [TanStack Query](https://tanstack.com/query/latest)

## Features

*   **Dashboard Overview**: A central hub with key metrics and system summaries.
*   **Bank Management**: Full CRUD (Create, Read, Update, Delete) functionality for bank records.
*   **Customer Management**: Easily manage customer information.
*   **User & Role Management**: Control user access and permissions.
*   **Responsive Design**: A seamless experience across desktop and mobile devices.
*   **Dark Mode**: Switch between light and dark themes for better visual comfort.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/admin-dashboard.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory by copying one of the examples (e.g., `.env.example`) and add the necessary environment variables.

## Usage

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will start the application on `http://localhost:5173` by default.

2.  **Log in:**
    Use your administrator credentials to log in to the dashboard.

3.  **Navigate the Dashboard:**
    Use the sidebar to navigate between different sections like **Dashboard**, **Banks**, and **Customers**.

4.  **Manage Data:**
    On each page, you can:
    *   **Add** new items using the 'Add' button.
    *   **Edit** existing items by clicking the edit icon in the table.
    *   **Delete** items using the delete icon.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the project files.
*   `npm run preview`: Serves the production build locally for preview.
*   `npm run build:dev`: Builds the project using the development environment configuration.
*   `npm run build:prod`: Builds the project using the production environment configuration.
