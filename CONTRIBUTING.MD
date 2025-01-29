Thank you for your interest in contributing to the **Los Santos Catholics Roleplay project website**! Contributions are welcome and appreciated. Please follow these guidelines to ensure a smooth collaboration process.

---

## 📋 Prerequisites

Before getting started, make sure you have:

- Node.js (LTS version recommended)
- SQLite or PostgreSQL installed and configured
- Pnpm installed globally
- Familiarity with the following tools and conventions:
    - **TypeScript** for type-safe code
    - **AdonisJS** for backend development
    - **React** and **InertiaJS** for frontend work
    - **Material-UI** for UI components
    - **Conventional Commits** for commit messages ([Learn more here](https://www.conventionalcommits.org/en/v1.0.0/))
    - **ESLint** and **Prettier** for linting and code formatting

---

## 🚀 Getting Started

1. **Fork the Repository**

    - Navigate to the [repository](https://github.com/NairolfRP/lscatholics) and click the `Fork` button.

2. **Clone Your Fork**

    ```sh
    git clone https://github.com/your-username/lscatholics.git
    cd lscatholics
    ```

3. **Install Dependencies**

    ```sh
    pnpm install
    ```

4. **Set Up Environment**

    - Copy `.env.example` to `.env`:
        ```sh
        cp .env.example .env
        ```
    - Update the `.env` file with your database credentials (not required for SQLite) and other required settings.

5. **Run Database Migrations**

    ```sh
    node ace migration:run
    ```

6. **Start the Development Server**
    ```sh
    pnpm dev
    ```

---

## 🛠 Development Workflow

### 1. Branch Naming

Create a new branch for your work.

Example:

```sh
git checkout -b feature/user-authentication
```

### 2. Code Standards

- Write **clean, modular, and type-safe code**.
- Follow the existing coding patterns.
- Lint your code:
    ```sh
    pnpm lint
    ```
- Format also your code before committing:
    ```sh
    pnpm format
    ```

### 3. Commit Messages

Use **Conventional Commits** for all commit messages. This ensures consistency and clarity in the project history.

**Commit message format:**

```
type(scope): description
```

Examples:

- `feat(auth): add user login functionality`
- `fix(ui): resolve button alignment issue`
- `docs(readme): update installation instructions`

Common commit types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation updates
- `style`: Code style changes (e.g., formatting)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

---

## ✅ Submitting Changes

1. **Push Your Branch**

    ```sh
    git push origin your-branch
    ```

2. **Open a Pull Request**

    - Go to the repository’s GitHub page.
    - Click `Compare & pull request`.
    - Provide a clear and descriptive title and summary for your PR.

3. **Address Feedback**

    - Collaborators may leave comments or request changes.

4. **PR Merging**
    - Once approved, your PR will be merged by a project maintainer.

---

## 🔄 Updating Your Fork

To stay up-to-date with the main repository, sync your fork regularly:

1. Add the original repository as a remote:

    ```sh
    git remote add upstream https://github.com/NairolfRP/lscatholics.git
    ```

2. Fetch and merge changes:
    ```sh
    git fetch upstream
    git checkout dev
    git merge upstream/dev
    ```

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same [License](LICENSE) as the project.

---

Thank you for contributing and helping improve the project roleplay experience! 🙌
