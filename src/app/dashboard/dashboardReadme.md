# Dashboard Overview

This dashboard provides a user interface for managing and visualizing item data. It allows users to add new items with details such as date, product, category, price, and quantity. The dashboard displays a chart summarizing sales data by category and a paginated table listing all items.

## Key Features

- **Add New Items:** Users can add new items using a form with fields for date, product, category, price, and quantity.
- **Data Visualization:** The dashboard presents data through a chart and a table.
  - **Chart:** Displays sales data grouped by category, providing a visual overview of sales performance.
  - **Table:** Lists all items with their details, with pagination for easy navigation through large datasets.
- **Real-time Updates:** The dashboard fetches data from the database and updates the chart and table dynamically.
- **Loading Indicator:** A loading bar is displayed while data is being fetched, providing feedback to the user.
- **Data Pagination:** The table data is paginated to improve performance and user experience when dealing with large datasets.

## Technical Details

### Data Fetching

The dashboard uses the `useDashboardData` hook, located in `src/app/dashboard/utils/useDashboardData.ts`, to fetch data. This hook retrieves data using the following functions from `src/app/dashboard/actions.ts`:

- `getChartData`: Fetches data for the chart, grouping items by category and summing their sales.
- `getTableData`: Fetches all items from the database.
- `addItem`: Adds a new item to the database.

These functions interact with a MySQL database using the `mysql2/promise` library. Database connection details are configured using environment variables.

### Components

The dashboard is built using the following components:

- `src/app/dashboard/page.tsx`: Contains the form for adding new items, utilizing the `DatePickerField` component for date selection and input fields for other item details.
- `src/app/dashboard/components/DatePickerField.tsx`: Provides a date picker using React Aria components.
- `src/app/dashboard/components/LoadingBar.tsx`: Displays a loading bar while data is being fetched.
- `src/app/dashboard/components/ReportElement.tsx`: Dynamically renders either a chart or a table based on the `type` prop. The table component also handles pagination.
- `src/components/ui`: Contains reusable UI components like `Input` and `Label`.

### Styling

The dashboard is styled using Tailwind CSS. The `cn` function in `src/app/dashboard/utils/utils.ts` is used to merge class names.

### Database

The dashboard uses a MySQL database to store and retrieve data. Database connection details and the table name are configured using environment variables.

## User-Friendly Explanation

The dashboard allows you to keep track of your items. You can add new items by filling out the form on the dashboard page. The dashboard will then display a chart and a table summarizing the data. You can refresh the data by clicking the "Refresh" button. The date picker allows you to select a date for the item. The loading bar indicates when the data is being fetched.
