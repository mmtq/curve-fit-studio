# Curve Fit Studio

A web-based application designed for interactive data visualization and mathematical curve fitting. Built with modern web technologies, this tool allows users to plot data, apply various fitting algorithms, and visualize the results in real-time.

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About The Project

Curve Fit Studio provides an intuitive interface for mathematicians, engineers, and data scientists to analyze datasets by fitting curves to their data points. Leveraging the power of Next.js for a fast, server-rendered React application, and Chart.js for beautiful, interactive charts, this project aims to make curve fitting accessible and straightforward. It's designed to handle mathematical computations efficiently using Math.js and render complex equations beautifully with KaTeX.

## Key Features

-   **Interactive Data Plotting**: Easily plot your datasets on an interactive chart using **Chart.js**.
-   **Curve Fitting**: Apply various mathematical functions and algorithms to find the best fit for your data using **Math.js**.
-   **Equation Rendering**: Displays mathematical equations and formulas clearly using **KaTeX** and **react-katex**.
-   **Component-Based UI**: Built with a modern UI using **shadcn/ui** and **Radix UI** for accessibility and customizability.
-   **Export and Share**: Includes `dom-to-image` and `html2canvas` for exporting charts and results as images.
-   **Theming**: Light and dark mode support with `next-themes`.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (with Turbopack)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://reactjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Charting**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
-   **Mathematical Operations**: [Math.js](https://mathjs.org/)
-   **Equation Rendering**: [KaTeX](https://katex.org/) & [react-katex](https://github.com/talyssonoc/react-katex)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Linting**: [ESLint](https://eslint.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your development machine:

-   [Node.js](https://nodejs.org/en/) (v20 or later recommended)
-   [cite_start][pnpm](https://pnpm.io/installation) (as the project uses a `pnpm-lock.yaml`) [cite: 1]

    ```sh
    npm install -g pnpm
    ```

### Installation

1.  **Clone the repository:**

    ```sh
    git clone [https://github.com/your-username/curve-fit-studio.git](https://github.com/your-username/curve-fit-studio.git)
    cd curve-fit-studio
    ```

2.  **Install dependencies:**

    ```sh
    pnpm install
    ```

3.  **Run the development server:**

    ```sh
    pnpm dev
    ```
    This command is defined in your `package.json` and starts the Next.js development server with Turbopack.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`.

## Available Scripts

In the project directory, you can run the following commands, which are defined in `package.json`:

-   `pnpm dev`: Runs the app in development mode with Turbopack.
-   `pnpm build`: Builds the app for production.
-   `pnpm start`: Starts the production server.
-   `pnpm lint`: Runs the ESLint linter to check for code quality issues.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information. (Note: You'll need to add a `LICENSE.txt` file to your project).

## Acknowledgements

-   [Vercel](https://vercel.com/) for the Next.js framework.
-   The creators of all the open-source libraries used in this project.
-   Your team members.