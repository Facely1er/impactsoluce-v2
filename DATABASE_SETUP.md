# Database Setup - Shared with AgroSoluce

ImpactSoluce now uses the same shared Supabase database as AgroSoluce, with separate schemas to keep data isolated.

## Database Configuration

### Shared Database Instance
- **URL**: `https://nuwfdvwqiynzhbbsqagw.supabase.co`
- **Schema**: `impactsoluce` (default)
- **Shared with**: AgroSoluce (uses `agrosoluce` schema)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Shared Supabase Database (same as AgroSoluce)
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8

# Schema for ImpactSoluce data (separate from AgroSoluce)
VITE_SUPABASE_SCHEMA=impactsoluce
```

**Note**: The application will use these values by default even if environment variables are not set, ensuring it always connects to the shared database.

## Schema Isolation

- **AgroSoluce**: Uses `agrosoluce` schema
- **ImpactSoluce**: Uses `impactsoluce` schema

This ensures data separation while sharing the same database instance, reducing costs and simplifying management.

## Database Tables

ImpactSoluce uses the following tables (in the `impactsoluce` schema):

- `assessments` - ESG assessment records
- `assessment_responses` - Individual question responses
- `risk_radar_configs` - Risk Radar configurations
- `evidence_inventory` - Evidence workspace data
- `eudr_compliance` - EUDR module data
- `regulatory_modules` - Active regulatory modules

## Migration Notes

When running migrations:

1. All migrations should target the `impactsoluce` schema
2. Use schema-qualified table names: `impactsoluce.assessments`
3. Ensure RLS (Row Level Security) policies are schema-aware

## Benefits of Shared Database

1. **Cost Efficiency**: Single database instance for multiple applications
2. **Unified Authentication**: Shared user accounts across platforms
3. **Simplified Management**: One database to monitor and maintain
4. **Data Isolation**: Schema separation ensures data privacy
5. **Cross-Platform Features**: Potential for shared data when needed

## Verification

After setup, verify the connection:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for connection logs:
   ```
   ✓ Database connected - using shared Supabase database for data persistence
     Schema: impactsoluce
     Shared with AgroSoluce: https://nuwfdvwqiynzhbbsqagw.supabase.co
   ```

3. Test database operations by creating an assessment or configuring Risk Radar.

## Troubleshooting

### Connection Issues

If you see "Running in standalone mode":
- Check that environment variables are set correctly
- Verify the Supabase URL is accessible
- Check browser console for detailed error messages

### Schema Errors

If you encounter schema-related errors:
- Verify `VITE_SUPABASE_SCHEMA=impactsoluce` is set
- Check that migrations have been run for the `impactsoluce` schema
- Ensure RLS policies are correctly configured

### Authentication Issues

Since both apps share the database:
- User authentication works across both platforms
- Sign in to one app, and you're authenticated in both
- Sign out from one app, and you're signed out from both

