# CodeWeave - Collaborative Code Editor

A real-time collaborative code editor built with the MERN stack (MongoDB, Express, React, Node.js).

## Description

CodeWeave enables multiple users to write, edit, and collaborate on code simultaneously with live synchronization across all connected clients.

## Features

- Real-time code collaboration
- Live code synchronization
- Modern MERN stack architecture
- Clean and responsive UI
- Support for multiple concurrent users

## Project Structure

```
CodeWeave/
├── Backend/          # Express.js server
├── Frontend/         # React application
├── Dockerfile        # Container configuration
├── LICENSE
└── Readme.md
```

## Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** React, Vite, ESLint
- **Deployment:** Docker + AWS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo url>
   cd codeweave
   ```

2. **Backend setup**
   ```bash
   cd Backend
   npm install
   npm start
   ```

3. **Frontend setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## Available Scripts

### Backend
- `npm start` - Start development server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## License

Licensed under the terms in the [LICENSE](LICENSE) file.

## Support

For issues or questions, please open a GitHub issue or contact the maintainers.