# Los Santos Catholics - Web application for a roleplay project

Welcome to the official repository for the **Los Santos Catholics** roleplay website, a project designed for a Catholic Church faction in the **GTA World** server community. This site serves as a central hub for managing catholic religious roleplay activities within the County of Los Santos.

## 🚀 Tech Stack

This project is built with the following technologies:

- **[AdonisJS](https://adonisjs.com/)** (v6) - NodeJS Backend framework
- **[React](https://react.dev/)** - Frontend library
- **[InertiaJS](https://inertiajs.com/)** - Server-driven frontend
- **[TypeScript](https://www.typescriptlang.org/)** - Full stack type safety
- **[Material-UI](https://mui.com/)** - UI components and theming
- **[PostgreSQL](https://www.postgresql.org/)** - Database

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- PostgreSQL or SQLite (dev: SQLite recommended for lightweight database - prod: PostgreSQL)
- [Pnpm](https://pnpm.io) (package manager)

### Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/NairolfRP/lscatholics.git
    cd lscatholics
    ```
2. Install dependencies:
    ```sh
    pnpm install
    ```
3. Configure environment variables:
    - Copy `.env.example` to `.env`
    - Set up database credentials (not required with SQLite) and other necessary configurations
4. Run database migrations:
    ```sh
    node ace migration:run
    ```
5. Start the development server:
    ```sh
    pnpm dev
    ```

## 🛠 Development

- **Backend (AdonisJS)**: Located in the root directory
- **Frontend (React/InertiaJS)**: Located in the `inertia/` directory

## 🔗 Links

- **Hosted application**: _Coming soon_
- **GTA World**: [https://gta.world](https://gta.world)
- **Project Repository**: [https://github.com/NairolfRP/lscatholics](https://github.com/NairolfRP/lscatholics)

## 📜 License

This project is licensed under the GPL v3.0 License - see the [LICENSE](LICENSE) file for details.

---

Feel free to contribute and help improve the roleplay experience! ✝️
