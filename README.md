# Grow Habits API 🪴

## Overview

Welcome to the Grow Habits API ! This API allows users to create and track their habits, providing a structured way to cultivate positive routines in their daily lives.

## Features

- **Create Habits**: Users can create and define habits, specifying details such as name, cue, craving, response, and reward.

- **Track Habits**: Once habits are created, users can track their daily progress by completing tracked habits associated with each habit.

- **Completion Validation**: The API ensures that completion dates are valid, not in the future, and not before the habit's start date.

- **User Authentication**: Users need to be authenticated to create and track habits, ensuring secure access to personal habit data.

## Run the project locally
__prerequisites__ : You need to have Docker installed on your local machine and to create a `.env.development` file following `.env.example` file.

#### Clone the project
```sh
git clone https://github.com/alexboisseau/grow-habits-api
```

#### Go into the project folder
```sh
cd ./grow-habits
```

#### Run dev start command
```sh
make build_and_start_dev
```

And voila !

##### Services running through docker environment
- PostgreSQL : `postgres:5432`
- PGAdmin : `pgadmin:80`
- Redis : `redis:redis`
- NestJS App: `app:3000`

## Learn and Practice Clean Architecture

This project is developed with a focus on Clean Architecture principles. The separation of concerns and maintainability of the codebase are prioritized. Feel free to explore the codebase, understand the architecture, and contribute to enhancing your skills in software design.
