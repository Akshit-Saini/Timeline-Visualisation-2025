Beyond Timelines – VRTI Knowledge Graph Explorer

An interactive timeline visualisation tool for exploring historical people’s data from the Virtual Record Treasury of Ireland (VRTI) Knowledge Graph.
Built with React (frontend) and Node.js/Express (backend) with SPARQL integration.

⸻

Features
	•	Interactive, zoomable, filterable timeline
	•	SPARQL-powered queries to the VRTI Knowledge Graph
	•	Semantic filtering by multiple attributes (gender, occupation, floruit period, etc.)
	•	Linked biography and archival sources (e.g., DIB)
	•	Responsive design for desktop and mobile

⸻

Prerequisites

Install:
	•	Node.js v18 or later
	•	npm (bundled with Node.js) or yarn

⸻

Running Locally

You have two options:

⸻

Option 1 – Directly connect to public VRTI SPARQL endpoint

(No backend required – good for quick testing, but limited by CORS policies)
	1.	Clone the repository:

git clone <https://github.com/Akshit-Saini/Timeline-Visualisation-2025>
cd <beyond2022>


	2.	Install dependencies:

npm install


	3.	In src/services/sparqlService.js (or wherever the endpoint is defined),
set:

const SPARQL_ENDPOINT = "https://vrti-graph-explorer.adaptcentre.ie/sparql/";


	4.	Start the development server:

npm run dev


	5.	Open in your browser:
http://localhost:5173

⸻

Option 2 – Use a local proxy backend

(Recommended – avoids CORS errors and allows custom server logic)
	1.	Clone the repository:

git clone <https://github.com/Akshit-Saini/Timeline-Visualisation-2025>
cd <beyond2022>


	2.	Install dependencies for both frontend & backend:

npm install
cd server
npm install
cd ..


	3.	In server/config.js set the remote endpoint:

const SPARQL_ENDPOINT = "https://vrti-graph-explorer.adaptcentre.ie/sparql/";


	4.	Start the proxy backend:

npm run server

By default runs on: http://localhost:5000

	5.	In your frontend config (src/services/sparqlService.js),
set:

const SPARQL_ENDPOINT = "http://localhost:5000/api/sparql";


	6.	Start the frontend:

npm run dev


	7.	Open in your browser:
http://localhost:5173

⸻

Project Structure

.
├── server/                # Express backend (SPARQL proxy)
│   ├── api/               # Query routes
│   ├── config.js          # Endpoint settings
│   └── ...
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── pages/             # Page views
│   ├── services/          # SPARQL request logic
│   └── ...
├── public/                # Static assets
└── package.json           # Scripts & dependencies


⸻

Scripts

Command	Description
npm run dev	              Start frontend in dev mode
npm run build	          Build frontend for production
ts-node cors.proxy.js	  Start backend proxy server
npm start	              Serve production frontend


⸻

Notes
	•	Use Option 2 for development if you want stable CORS-free access.
	•	For production, deploy backend and frontend separately (e.g., backend on Railway, frontend on Vercel).

⸻

Do you want me to also include a “SPARQL Queries Guide” section in this README so anyone can add/modify queries without breaking the app? That could make your repo way easier to maintain.