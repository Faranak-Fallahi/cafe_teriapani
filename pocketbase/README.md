# Local PocketBase

Download the Windows executable from the official PocketBase downloads page and place it here as `pocketbase.exe`. The executable and local database files are ignored by Git.

From the project root, start the local API on port 8090:

```powershell
npm run pb:serve
```

Open the admin UI at `http://127.0.0.1:8090/_/`. On first run, create the first superuser through the admin setup flow (or run `pocketbase.exe superuser create <email> <password>` from this directory).

PocketBase stores its local database under `pocketbase/pb_data`. Keep this directory out of commits and back it up separately when needed.
