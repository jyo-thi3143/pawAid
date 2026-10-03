
# PawAid 🐾
A web app that helps low-income pet owners find affordable or free vet services.
## Live App
👉 👉 https://paw-aid.vercel.app/

## Features

- Search veterinary listings by ZIP code
- Filter listings by veterinary service
- Submit new veterinary listings
- Admin review and approval
- Edit and delete listings through the admin portal
- Duplicate listing prevention
- Community confirmation of listing information
- Report outdated or incorrect information

## Technologies

- HTML, CSS, JavaScript — Frontend
- Node.js — Server-side JavaScript runtime
- Express.js — Backend API and routing
- MongoDB — Database
- Mongoose — Database modeling and validation
- Nodemon — Development tool
- Git/GitHub — Version control
- Vercel — Deployment

These tools were selected because they support the project's frontend, REST API, database, version control, and deployment requirements.


## How to Run

1. Clone the repository.
2. Install the dependencies:

   ```bash
   npm install
    ```
3. Create a `.env` file in the project root and add your MongoDB connection string:

   ```env
   MONGO_URI=your_mongodb_connection_string
    ```
Replace the placeholder with your own MongoDB connection string.

**Note:** Do not share or commit your `.env` file because it contains private credentials.

4. Start the development server:
    ```bash
    npm run dev
   
   ```markdown
5. Visit:

    ` http://localhost:5001

## API Routes
| Method | URL | What it does |
|--------|-----|--------------|
| GET | /api/vets | Get all listings |
| GET | /api/vets/:id | Get one listing |
| POST | /api/vets | Add a listing |
| PUT | /api/vets/:id | Update a listing |
| DELETE | /api/vets/:id | Delete a listing |

## Project Status
The core application functionality has been implemented, including veterinary listing submission, search and filtering, admin review, duplicate prevention, and community feedback.
Current development focuses on:
- Verifying real veterinary service information
- Geolocation and distance-based search
- Admin authentication and API security
- Automated testing
- Stronger input validation
- Accessibility and UI improvements

## AI Tools Used
GitHub Copilot was used during development as an AI-assisted coding tool. Copilot instructions were included in the repository to provide project-specific context and guidelines.

AI assistance was used to support coding, explain code, troubleshoot issues, and suggest implementation approaches. Suggestions were reviewed and tested before being incorporated into the project.

## Third-Party Libraries
PawAid uses open-source packages listed in package.json. Their licenses and usage terms should be followed according to their respective licenses.

## Author
JYO - CISC 4900, Brooklyn College, Fall 2026