# Peeyoush Shah — Portfolio

Personal portfolio website showcasing my background, technical skills, projects, and contact information.

## Overview

This project is organized into two applications:

- **Frontend:** React, Vite, Tailwind CSS, and Motion for React.
- **Backend:** FastAPI, with request validation and automated tests for the contact API.

## Project Structure

```text
peeyoush-portfolio/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

## Features

- Responsive portfolio interface
- Animated hero and project sections
- About, skills, projects, and contact sections
- FastAPI backend for contact form requests
- Request validation and automated backend tests

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.13 or a compatible Python version supported by the backend dependencies
- Git

## Run the Frontend

Open a terminal in the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

To create a production build:

```bash
npm run build
```

The generated production files are placed in `frontend/dist/`.

## Run the Backend

Open a separate terminal in the backend directory.

Create a virtual environment:

```bash
python -m venv .venev
```

Activate it on Windows CMD:

```bat
.venev\Scripts\activate.bat
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Configure environment variables using the project's `.env.example` as a reference. Create a local `.env` file and supply the required values. Never commit real credentials.

Start the API:

```bash
python -m uvicorn app.main:app --reload
```

When the server starts, open `http://127.0.0.1:8000/docs` to inspect the API documentation.

## Run Backend Tests

From the backend directory, with the virtual environment activated:

```bash
python -m pytest
```

## Deployment

The frontend and backend are deployed separately.

- **Frontend:** Deploy the `frontend` directory as a static site. Build command: `npm run build`. Publish directory: `dist`.
- **Backend:** Deploy the `backend` directory as a Python web service. Build/install command: `pip install -r requirements.txt`. Start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

Configure the required environment variables in the hosting provider's settings. Update the frontend's API configuration and backend CORS settings to use the deployed origins.

## Security

- Keep `.env` files and credentials out of Git.
- Use `.env.example` for placeholder configuration only.
- Do not expose private API keys in frontend code.

## Author

**Peeyoush Shah**

- GitHub: https://github.com/peeyoush
- Portfolio repository: https://github.com/peeyoush/peeyoush-portfolio
