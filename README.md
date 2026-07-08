# ERP Frontend - TypeScript Edition

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![MUI](https://img.shields.io/badge/MUI-9.0-007fff)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff)
![License](https://img.shields.io/badge/License-MIT-green)

Modern ERP (Enterprise Resource Planning) frontend application built with React 19, TypeScript, and Material-UI.

## 🚀 Features

- ✅ **Authentication** - Secure login with JWT
- ✅ **Dashboard** - Interactive charts with MUI X Charts
- ✅ **Customers Module** - Complete CRUD operations
- ✅ **Products Module** - Product management with categories
- ✅ **Orders Module** - Order processing (in progress)
- ✅ **Form Management** - React Hook Form + Zod validation
- ✅ **Data Fetching** - TanStack React Query with caching
- ✅ **Testing** - Vitest for unit and integration tests
- ✅ **Code Quality** - ESLint + Prettier + Husky

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 6, Vite 8
- **UI Library**: Material-UI 9 (MUI) with MUI X Charts
- **State Management**: React Query for server state
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Mshshahabi55/erp-frontend-ts.git

# Install dependencies
npm install

# Start development server (with json-server)
npm run dev:full

# Or start them separately:
npm run server  # json-server on port 5000
npm run dev     # Vite dev server
