# Dashboard Overview

This dashboard provides a user interface for managing and visualizing data related to items. It allows users to add new items with details such as date, product, category, price, and quantity. The dashboard also displays a chart and a table summarizing the data.

## Technical Details

### Data Fetching

The dashboard fetches data using the `useDashboardData` hook, which is located in `src/app/dashboard/utils/useDashboardData.ts`. This hook is responsible for fetching chart and table data from the database. The data is fetched using the following functions in `src/features/dashboard/actions.ts`:

-   `getChartData`: Fetches data for the chart, grouping items by category and summing their sales.
-   `getTableData`: Fetches all items from the database.
-   `addItem`: Adds a new item to the database.

These functions interact with a MySQL database using the `mysql2/promise` library. The database connection details are configured using environment variables.

### Components

The dashboard is composed of the following main components:

-   `src/app/dashboard/page.tsx`: This file contains the form for adding new items. It uses the `DatePickerField` component for selecting a date, and input fields for product, category, price, and quantity.
-   `src/features/dashboard/page.tsx`: This file displays the dashboard UI, including a loading bar, a chart, and a table. It uses the `ReportElement` component to display the chart and table.
-   `src/app/dashboard/components/DatePickerField.tsx`: This component provides a date picker using React Aria components.
-   `src/features/dashboard/components/LoadingBar.tsx`: This component displays a loading bar while data is being fetched.
-   `src/features/dashboard/components/ReportElement.tsx`: This component displays either a chart or a table based on the `type` prop.
-   `src/components/ui`: This directory contains reusable UI components used in the dashboard, such as `Input` and `Label`.

### Styling

The dashboard uses Tailwind CSS for styling. The `cn` function in `src/lib/utils.ts` is used to merge class names.

### Database

The dashboard uses a MySQL database to store and retrieve data. The database connection details are configured using environment variables. The table name is also configured using an environment variable.

## User-Friendly Explanation

The dashboard allows you to keep track of your items. You can add new items by filling out the form on the dashboard page. The dashboard will then display a chart and a table summarizing the data. You can refresh the data by clicking the "Refresh" button. The date picker allows you to select a date for the item. The loading bar indicates when the data is being fetched.
