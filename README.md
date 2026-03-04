X Marbles Trading LLC — Operations Platform
Netlify Deployment (3 steps)

Push to GitHub

Create a new repo on github.com
Upload all files maintaining this structure:



   /
   ├── public/
   │   └── index.html
   ├── src/
   │   ├── App.jsx
   │   └── index.js
   ├── package.json
   └── netlify.toml

Connect to Netlify

Go to netlify.com → "Add new site" → "Import from Git"
Select your repo
Build command: npm run build
Publish directory: build
Click Deploy


Share the URL with your client for demo approval


Modules Included
ModuleFeaturesDashboardKPIs, yard stock, aging, customer credit, shipmentsProcurementLanded cost calculator (6 Incoterms), PO tracking, suppliersInventory19 materials, 5 yards, barcode scanner, damaged stockProductionDamaged slab recovery, epoxy/resin/blade/labour costingSalesQuote builder, PDF export, Excel export, VAT-compliantDesign PlannerInteractive floor plan, material schedule, AutoCAD roadmap
Next Step: Backend
Connect to Supabase — see xmarbles_database_schema.docx for full PostgreSQL schema.
Tech Stack

React 18 · No external UI libraries · Inline styles
PDF: Browser print API (zero dependencies)
Excel: CSV export (zero dependencies)
Fonts: Outfit + DM Serif Display (Google Fonts)
