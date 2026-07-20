# Los Santos Catholics - Web application for a roleplay project

[![gh-workflow-image]][gh-workflow-url] [![website-image]][website-url] [![release-image]][release-url] [![license-image]][license-url]

Welcome to the official repository for the **Los Santos Catholics** roleplay website, a project designed for a Catholic
Church faction in the **GTA World** server community. This site serves as a central hub for managing catholic religious
roleplay activities within the County of Los Santos.

## 🚀 Tech Stack

This project is built with the following technologies:

- **[TypeScript](https://www.typescriptlang.org/)** - Full stack type safety
- **[TanStack Start](https://tanstack.com/start/latest)** - Full stack Framework
- **[React 19](https://react.dev)** - Frontend framework
- **[shadcn/ui](https://ui.shadcn.com/)** - UI Components
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework
- **[Turso](https://turso.tech/)** - SQLite Database

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 24.x
- [Turso CLI](https://docs.turso.tech/cli/introduction)
- [Pnpm](https://pnpm.io)

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
- Set up database credentials and other necessary configurations

4. Run database migrations and seeders:
   ```sh
   pnpm db:migrate && pnpm db:seed
   ```
5. Start the development server:
   ```sh
   pnpm dev
   ```

## 🔗 Links

- **Hosted application**: Soon
- **Project Repository**: [https://github.com/NairolfRP/lscatholics](https://github.com/NairolfRP/lscatholics)

## 📜 License

This project is licensed under the GPL v3.0 License - see the [LICENSE](LICENSE) file for details.

---

Feel free to contribute and help improve the roleplay experience! ✝️

[gh-workflow-image]: https://img.shields.io/github/check-runs/nairolfrp/lscatholics/prod?style=for-the-badge
[gh-workflow-url]: https://github.com/nairolfrp/lscatholics/actions/workflows/test.yml
[website-image]: https://img.shields.io/website?url=https%3A%2F%2Farchls.infos.st%2F&style=for-the-badge
[website-url]: https://archls.infos.st/
[release-image]: https://img.shields.io/github/v/release/nairolfrp/lscatholics?style=for-the-badge
[release-url]: https://github.com/NairolfRP/lscatholics/releases
[license-image]: https://img.shields.io/github/license/nairolfrp/lscatholics?style=for-the-badge
[license-url]: LICENSE