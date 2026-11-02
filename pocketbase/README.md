# Local PocketBase

Download the Windows executable from the official PocketBase downloads page and place it here as `pocketbase.exe`. The executable and local database files are ignored by Git.

From the project root, start the local API on port 8090:

```powershell
npm run pb:serve
```

The command stores PocketBase data in `pocketbase/pb_data`.

Open the admin UI at `http://127.0.0.1:8090/_/`. On first run, create the first superuser through the admin setup flow (or run `pocketbase.exe superuser create <email> <password>` from this directory).

PocketBase stores its local database under `pocketbase/pb_data`. Keep this directory out of commits and back it up separately when needed.

After creating the superuser, add `POCKETBASE_ADMIN_EMAIL` and `POCKETBASE_ADMIN_PASSWORD` to the root `.env` using that superuser's credentials, then run `npm run pb:seed`. The seed creates the public collections, demo data, and a dedicated `admins` auth collection. In the PocketBase admin UI, create an `admins` record with role `admin`; use that record's email and password to sign in to the app. The web app never authenticates against the `_superusers` collection.
