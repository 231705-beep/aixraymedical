# Running with Docker

This project is now containerized using Docker and Docker Compose. This allows you to run the frontend, backend, and database with a single command.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

## How to Run

1. **Open a terminal** in the root directory of the project.
2. **Start the containers** by running:
   ```bash
   docker-compose up --build
   ```
   The `--build` flag ensures that the images are built (or rebuilt) with your latest code changes.

3. **Access the application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:3001](http://localhost:3001)
   - **Database**: Port `5433` (mapped to `5432` inside the container)

## Stopping the System

To stop the containers, press `Ctrl+C` in the terminal or run:
```bash
docker-compose down
```

## Useful Commands

- **View logs**: `docker-compose logs -f`
- **Restart a specific service**: `docker-compose restart backend`
- **Clean up volumes**: `docker-compose down -v` (This will delete the database data)
