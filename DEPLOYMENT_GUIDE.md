# Supabase Edge Function Deployment Guide

## **Step 1: Set up your Supabase project**

1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Copy your project URL and anon key

## **Step 2: Link your local project to Supabase**

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

## **Step 3: Set the secret in Supabase**

```bash
supabase secrets set GOLF_API_KEY=your_actual_api_key_here
```

Or set it in the Supabase dashboard:

1. Go to Settings > Edge Functions
2. Add environment variable: `GOLF_API_KEY`
3. Set the value to your golf API key

## **Step 4: Deploy the Edge Function**

```bash
supabase functions deploy search-courses
```

## **Step 5: Test the function**

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/search-courses' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"searchQuery": "Austin"}'
```

## **Security Benefits:**

✅ **API key is never exposed** - Stored securely on Supabase servers  
✅ **No client-side secrets** - Your React Native app can't access the key  
✅ **CORS protection** - Only your app can call the function  
✅ **Rate limiting** - Built-in protection against abuse

## **Usage in your app:**

The `searchCourses` function now calls your secure Edge Function instead of the golf API directly. Your API key is completely hidden from the client!
