# Analytics Implementation

This document describes the implementation of website analytics tracking using Supabase.

## Overview

The analytics system tracks visitor behavior on the website, including:

- Page views
- Session duration
- Bounce rates
- Geographic distribution
- Device and browser information

## Architecture

The analytics system consists of the following components:

1. **Client-side tracking**: JavaScript code that runs in the browser to track user interactions
2. **Supabase Edge Function**: Serverless function that processes analytics events
3. **Supabase Database**: PostgreSQL database that stores analytics data
4. **Admin Dashboard**: UI for viewing analytics data

## Database Schema

The analytics data is stored in the following tables:

### visitor_stats

Stores daily aggregated statistics about website visitors.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| stat_date | DATE | Date of the statistics |
| total_visitors | INTEGER | Total number of visitors |
| unique_visitors | INTEGER | Number of unique visitors |
| page_views | INTEGER | Total number of page views |
| avg_session_duration | INTEGER | Average session duration in seconds |
| bounce_rate | DECIMAL | Percentage of single-page sessions |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### geographic_stats

Stores visitor statistics by geographic region.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| stat_date | DATE | Date of the statistics |
| region | VARCHAR | Region name (e.g., "Hồ Chí Minh") |
| city | VARCHAR | City name (e.g., "Quận 1") |
| visitor_count | INTEGER | Number of visitors from this region |
| page_views | INTEGER | Number of page views from this region |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### page_views

Stores statistics about page views.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| stat_date | DATE | Date of the statistics |
| page_url | VARCHAR | URL of the page |
| page_title | VARCHAR | Title of the page |
| view_count | INTEGER | Number of views for this page |
| unique_visitors | INTEGER | Number of unique visitors to this page |
| avg_time_on_page | INTEGER | Average time spent on this page in seconds |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### visitor_logs

Stores raw visitor event data.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| session_id | VARCHAR | Unique session identifier |
| visitor_id | VARCHAR | Unique visitor identifier |
| page_url | VARCHAR | URL of the page viewed |
| page_title | VARCHAR | Title of the page viewed |
| referrer | VARCHAR | Referring URL |
| user_agent | VARCHAR | User agent string |
| ip_address | VARCHAR | IP address of the visitor |
| region | VARCHAR | Region of the visitor |
| city | VARCHAR | City of the visitor |
| country | VARCHAR | Country of the visitor (default: "Vietnam") |
| device_type | VARCHAR | Type of device (desktop, mobile, tablet) |
| browser | VARCHAR | Browser name |
| os | VARCHAR | Operating system |
| visit_duration | INTEGER | Duration of the visit in seconds |
| is_bounce | BOOLEAN | Whether this was a bounce visit |
| created_at | TIMESTAMP | Record creation time |

## Client-Side Tracking

The client-side tracking is implemented in `lib/analytics.ts`. It uses cookies to identify visitors and sessions, and sends tracking data to the Supabase Edge Function.

Key features:
- Anonymous visitor tracking using UUID
- Session tracking
- Page view tracking
- Session duration tracking
- Bounce rate calculation

## Supabase Edge Function

The Supabase Edge Function (`supabase/functions/track-analytics/index.ts`) receives tracking data from the client and calls the appropriate database functions to store the data.

## Database Functions

Two main database functions handle the analytics data:

1. `track_page_view`: Records a page view and updates the relevant statistics
2. `update_session_metrics`: Updates session duration and bounce rate statistics

## Integration with Next.js

The analytics tracking is integrated with Next.js using the `AnalyticsProvider` component, which is included in both the website and admin layouts.

## Dashboard

The analytics dashboard is implemented in the admin area and displays:

1. Overview statistics (visitors, page views, bounce rate, etc.)
2. Visitor trends over time
3. Geographic distribution of visitors
4. Most viewed pages
5. Device and browser statistics

## Privacy Considerations

The analytics system is designed to respect user privacy:

- No personally identifiable information is collected
- IP addresses are not stored in their raw form
- Session IDs and visitor IDs are randomly generated UUIDs
- Cookies used for tracking are set with appropriate expiration times

## Deployment

To deploy the analytics system:

1. Run the Supabase migrations to create the database schema
2. Deploy the Supabase Edge Function
3. Ensure the client-side tracking code is included in the application

## Maintenance

Regular maintenance tasks:

1. Monitor database size and performance
2. Archive old visitor_logs data if necessary
3. Update the geographic database as needed
