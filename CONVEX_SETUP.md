# Convex Setup Guide for Ringside Oracle

## Prerequisites

1. Make sure you have a Convex account and project set up
2. Install Convex CLI: `npm install -g convex`
3. Your `NEXT_PUBLIC_CONVEX_URL` environment variable should be set

## Setup Steps

### 1. Initialize Convex (if not already done)
\`\`\`bash
npx convex dev
\`\`\`

### 2. Deploy the Schema
The schema is already defined in `convex/schema.ts`. Deploy it:
\`\`\`bash
npx convex deploy
\`\`\`

### 3. Import Your CSV Data
Run the data analysis script first to understand your data:
\`\`\`bash
node scripts/analyze-csv-data.js
\`\`\`

Then run the import script to populate your Convex database:
\`\`\`bash
node scripts/import-csv-data.js
\`\`\`

### 4. Update Your Environment Variables
Make sure you have:
\`\`\`
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
\`\`\`

### 5. Test the Application
Start your Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

## Key Changes Made

1. **Database Layer**: Replaced Supabase with Convex
2. **Schema**: Defined proper Convex schema with relationships
3. **Data Access**: Changed from async functions to React hooks
4. **Types**: Updated to use Convex ID types
5. **Mutations**: Created Convex mutations for user contributions

## Data Structure

Your data will be imported with the following relationships:
- Promotions (root entities)
- Brands (belong to promotions)
- Wrestlers (belong to brands)
- Events (belong to promotions)
- Match Types (belong to promotions)
- Championships (belong to promotions)

## Troubleshooting

1. **Import Issues**: Check that your CSV URLs are accessible
2. **Schema Errors**: Make sure to deploy the schema before importing data
3. **Hook Errors**: Ensure components are wrapped in ConvexProvider

## Next Steps

1. Run the import script to populate your database
2. Test the application functionality
3. Verify that all features work with the new Convex backend
