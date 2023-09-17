Simple project using [nlw-ai-mastery](https://github.com/rocketseat-education/nlw-ai-mastery) by [@rocketseat](https://twitter.com/rocketseat) as base.

It's a fullstack app using NextJS 13.4, Postgresql, and Prisma to give users the ability to upload a .mp4 video, add topics, add/select/edit a prompt template, select temperature, and send a request to OpenAI API to get back a response based on the video transcription + sent prompt.
In this project we have the use case of a user requesting OpenAI to generate a title and a description for an YouTube video based on the uploaded video content.

This project uses:

- WebAssembly ([FFMPEG](https://github.com/ffmpegwasm/ffmpeg.wasm)) to transcript the video to text
- [ShadcnUI](https://github.com/shadcn-ui/ui) to create UI elements
- [Docker](https://www.docker.com/) to manage the environment containers
- [pnpm](https://pnpm.io/) to manage modules

## Getting Started

First, run the development server:

Create a .env file

```bash
touch .env
```

Create a tmp folder under `public` directory:

```bash
cd public && mkdir tmp
```

Edit it with your data as the following

```
# DATABASE
DATABASE_URL=""
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# OPENAI
OPENAI_API_KEY=
```

Install dependencies

```bash
pnpm install
```

Run docker compose

```bash
docker-compose up --build
```

If everything works correctly, the app should be available at `http://localhost:3333`

### Known issues / TODOs

- Currently, prisma seed is not working properly
- Clean unused/unnecessary code
- We could use server actions
- Add more validations and UI improvements
- Use langchain
- Implement Llama2
