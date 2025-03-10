
# Database Manager with React, TypeScript, and Vite

This project is a Database Management Tool built with React, TypeScript, and Vite. It allows users to connect to remote MySQL databases, visualize schemas, execute SQL queries, and manage backups. The backend is built with Express.js and integrates with Supabase for logging queries and managing backups.

## Features

### Database Connection Management:
- Connect to remote MySQL databases.
- View and manage active connections.

### Schema Visualization:
- Browse tables and columns of connected databases.

### SQL Query Execution:
- Execute custom SQL queries.
- View query results in a table format.

### Backup & Restore:
- Create backups of databases.
- Restore databases from backup files.

### Query Logging:
- Log all executed queries for auditing purposes.

### Responsive UI:
- Built with Material-UI for a clean and responsive interface.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL server (remote or local)
- Supabase account (for query logging)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/database-manager.git
cd database-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
VITE_BACKEND_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Set up the backend:

Navigate to the backend directory:
```bash
cd backend
```

6. Install backend dependencies:
```bash
npm install
```

7. Start the backend server:
```bash
npm start
```

## Usage

### Connecting to a Database
1. Open the application in your browser (`http://localhost:5173`).
2. Navigate to the Dashboard.
3. Add a new database connection by providing the host, username, password, and database name.

### Visualizing Schemas
1. Select a database from the dropdown.
2. View the list of tables and their columns.

### Executing SQL Queries
1. Open the SQL Editor from the sidebar.
2. Write your SQL query and click Execute.
3. View the results in the table below.

### Managing Backups
1. Navigate to the Backup & Restore section.
2. Click Backup Database to create a new backup.
3. Use Restore Backup to restore a database from a backup file.

## Project Structure

```bash
database-manager/
├── public/               # Static assets
├── src/                  # Frontend source code
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions and configurations
│   ├── pages/            # Application pages
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── backend/              # Backend source code
│   ├── routes/           # API routes
│   ├── index.js          # Backend entry point
│   └── .env              # Backend environment variables
├── .env                  # Frontend environment variables
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Technologies Used

### Frontend:
- React
- TypeScript
- Vite
- Material-UI
- Lucide React (icons)

### Backend:
- Express.js
- MySQL2
- Supabase (for logging)

### Tools:
- ESLint (for linting)
- Prettier (for code formatting)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/your-feature).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Vite for the fast development setup.
- Material-UI for the UI components.
- Supabase for backend integration.

