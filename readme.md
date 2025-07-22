# Playwright Framework

This repository contains a Playwright framework setup for automated testing. The framework is structured as follows:

## Project Folder Structure

Project Folder<br>
├── node_modules <br>
└── src<br>
&nbsp; &nbsp; &nbsp; &nbsp;├── config<br>
&nbsp; &nbsp; &nbsp; &nbsp;├── logging<br>
&nbsp; &nbsp; &nbsp; &nbsp;├── pages<br>
&nbsp; &nbsp; &nbsp; &nbsp;├── testdata<br>
&nbsp; &nbsp; &nbsp; &nbsp;└── tests<br>
├─ playwright-report<br>
│ readme.md<br>
│ .gitignore<br>
│ package-lock.json<br>
│ package.json<br>
│ playwright.config.ts<br>
│ tsconfig.json<br>


## Description

- `.eslintrc.json`: ESLint configuration file for linting TypeScript code.
- `.gitignore`: Specifies intentionally untracked files to ignore in Git.
- `package-lock.json` and `package.json`: Node.js package files specifying project dependencies.
- `playwright.config.ts`: Configuration file for Playwright settings.
- `tsconfig.json`: TypeScript compiler options file.

### `.github`

- `.github/workflows/main.yml`: GitHub Actions workflow file for continuous integration.

### `node_modules`

- Directory containing Node.js modules installed by npm.

### `playwright-report`

- Directory for storing Playwright test reports.

### `src`

- Source code directory containing project files.

#### `config`

- Directory containing environment configuration files and authentication data.

#### `fixtures`

- Directory for test fixtures, such as reusable functions for login.

#### `logging`

- Directory for log files generated during test execution.

#### `pages`

- Page object files representing different pages of the application under test.

#### `testdata`

- Directory containing test data files in various formats, such as JSON and CSV.

#### `tests`

- Directory for test scripts written in TypeScript.

#### `utils`

- Directory for utility scripts used in testing, such as encryption and logging utilities.

### `test-results`

- Directory for storing test execution results, including screenshots, trace files, and videos.

## Usage

- Clone the repository and install dependencies using `npm install`.
- Run tests using `npm test`.
- View test reports in the `playwright-report` directory.
- Explore source code files for detailed implementation.


