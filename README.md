# SDMX Dashboard Demo application

Manage your dashboard config files (JSON format) and preview dashboards
using the [sdmx-dashboard-components](https://github.com/PacificCommunity/sdmx-dashboard-components) client application.

## Online demo

Demo is available on Vercel here:  
https://dashboard-creator-thhomas-projects.vercel.app/


## Configuration

By default JSON files are saved in local file system (in `./public/uploads/` folder)

To store JSON files as Github Gists, add 2 environment variables  
(in .env.local for instance)

```
GIST_TOKEN=<your_github_token>
GIST_PUBLIC=false
```

## How to define your dashboard

A guide on how to write a JSON configuration file is available in [here](./public/doc.md)


## Running the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Build and run docker image

```
docker build -t sdmx-dashboard-demo .

docker run -p 3000:3000 sdmx-dashboard-demo
```

