# Admin Dashboard User Guide

Welcome to the Admin Dashboard! This guide will walk you through the features and functionalities of the application.

## 1. Getting Started

### Logging In

To access the dashboard, you will need to log in with your administrator credentials. Upon successful login, you will be directed to the main dashboard overview.

### Navigation

The main navigation is located in the sidebar on the left. From here, you can access all the major sections of the application, including:

*   **Dashboard**
*   **Banks**
*   **Customers**

## 2. Dashboard Overview

The dashboard provides a central hub with key metrics and a summary of the system's status. Here you can get a quick glance at important data points.

## 3. Bank Management

The Bank Management section allows you to perform full CRUD (Create, Read, Update, Delete) operations for bank records.

### Viewing Banks

All existing banks are listed in a table on the Banks page. The table displays the bank's name, description, and logo.

### Adding a New Bank

1.  Click the **"Add Bank"** button.
2.  A modal window will appear with a form.
3.  Fill in the following fields:
    *   **Bank Name:** The name of the bank (e.g., 'Global Bank').
    *   **Description:** A brief description of the bank.
    *   **Logo:** Upload the bank's logo (optional).
4.  Click **"Save"** to add the new bank.

### Editing a Bank

1.  In the bank list, click the **pencil icon** next to the bank you want to edit.
2.  The bank's information will be loaded into the form.
3.  Make the necessary changes.
4.  Click **"Save"** to update the bank's details.

### Deleting a Bank

1.  In the bank list, click the **trash icon** next to the bank you want to delete.
2.  A confirmation dialog will appear.
3.  Click **"Delete"** to permanently remove the bank.

## 4. Customer Management

The Customer Management page allows you to manage customer information and transactions.

### Viewing Customers

All customers are listed in a table, showing details such as Customer ID, name, transaction type, bank, amount, and credit.

### Adding a New Customer

1.  Click the **"Add Customer"** button.
2.  Fill in the customer's details in the form that appears.
3.  Click **"Save"** to create the new customer record.

### Editing a Customer

1.  Click the **pencil icon** next to the customer you wish to edit.
2.  Update the customer's information in the form.
3.  Click **"Save"** to apply the changes.

### Deleting a Customer

1.  Click the **trash icon** next to the customer you want to remove.
2.  Confirm the action in the dialog box to delete the customer.

### Searching and Filtering

You can easily find specific customers using the search and filter options:

*   **Search:** Use the search bar to find a customer by their Customer ID.
*   **Filter:** Click the **"Filter"** button to open the filter menu. You can filter customers by:
    *   **Currency:** (e.g., USD, KHR)
    *   **Type:** (e.g., Deposit, Withdraw)

## 5. User & Role Management

This section allows you to control user access and permissions within the dashboard. You can create new users, assign roles, and manage what each user can see and do.

## 6. Appearance

### Dark Mode

For better visual comfort, you can switch between light and dark themes. Look for the theme switcher, usually located in the header or sidebar, to toggle between modes.

## 7. Permissions & Visibility

*   __Role-based actions__: Buttons like "Add", edit (pencil), and delete (trash) only appear if your role has permission. If you don't see an action, contact an admin to adjust your access.
*   __Customers page__: Create, Update, and Delete controls respect your permissions for the `customers` resource.

## 8. Searching, Filtering, and Pagination

*   __Search__: On Customers, the search looks up Customer ID and also matches the linked Bank name.
*   __Filters__: Use the Filter menu to narrow by:
    *   __Currency__: USD ($), KHR (៛), or All
    *   __Type__: Deposit, Withdraw, or All
*   __Pagination__:
    *   Use the page buttons at the bottom to move between pages.
    *   The footer shows "Showing X to Y of Z customers".
    *   __Per page__: choose 10, 15, 25, or 50 items per page from the dropdown.

## 9. Bank Form Details & Validation

*   __Fields__:
    *   __Bank Name__: required, at least 3 characters; letters, spaces, ".", "&", and "-" are allowed.
    *   __Description__: optional.
    *   __Logo__: optional file upload with preview.
*   __Logo constraints__:
    *   Image files only (mime type should start with `image/`).
    *   Max size: 2MB. Larger files will be rejected with a validation message.
*   __Duplicate names__:
    *   If a bank name already exists, you'll see a validation error indicating the conflict. Use a different name or update the existing bank.

## 10. Tips

*   __Clear filters__: In the Customers filter menu, use "Clear all filters" to reset quickly.
*   __Mobile__: Key columns collapse on small screens; tap rows for details visible on larger screens.
*   __Currency display__: Amounts are formatted using the selected currency.

## 11. Troubleshooting

*   __I can't see Add/Edit/Delete actions__:
    *   You may not have permissions. Ask an administrator to update your role.
*   __Validation failed when creating a bank__:
    *   Ensure Bank Name meets the format and is unique.
    *   Check the logo file is an image and under 2MB.
*   __Data not loading__:
    *   Check your internet connection.
    *   If the issue persists, reload the page or contact support with any error messages shown.

## 12. Quick Start (Reference)

*   __Start locally__: `npm run dev` then open `http://localhost:5173`
*   __Login__: use your provided admin credentials.
*   __Navigate__: use the left sidebar to access Dashboard, Banks, and Customers.
