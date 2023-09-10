# Dashboard generator

This webapp displays dashboards according to configuration
provided by YAML files uploaded by end users.

## Configuration

By default YAML files are saved in local file system (in `pubic/uploads/` folder)

To store YAML files as Github Gists, add 2 environment variables  
(in .env.local for instance)

```
GIST_TOKEN=<your_github_token>
GIST_PUBLIC=false
```

## Running the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

