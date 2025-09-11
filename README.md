# CureZone

CureZone Pharmacy is an online store, your one stop for all your needs.

## Setup Instructions

### Supabase Authentication Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Auth > Settings in the Supabase dashboard
4. Configure the email templates and site URL
5. Set up OAuth providers (Google) if needed
6. Create a `.env.local` file in the root directory and add the following variables:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-project-url` and `your-supabase-anon-key` with the values from your Supabase project settings.

### Custom Users Table Setup

To sync user data with a custom users table:

1. In your Supabase dashboard, go to the SQL Editor
2. Create a new query and paste the contents of the `supabase-users-table.sql` file
3. Run the SQL query to create:
   - The `users` table
   - Row Level Security policies
   - A trigger to automatically add users to the table when they sign up

This creates a relationship between Supabase Auth users and your custom users table, allowing you to store additional user information while maintaining synchronization.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
