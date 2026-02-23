# Running Wheelio with Docker

This project is configured to run with Docker Compose, orchestrating the Frontend, Backend, and Database containers.

## Prerequisites
-   Docker and Docker Compose installed.
-   Ports `8072` (Backend), `5173` (Frontend), and `5432` (PostgreSQL) must be free.

## Quick Start

1.  **Stop Local Servers**: If you are running `mvn spring-boot:run` or `npm run dev`, stop them (Ctrl+C).
2.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```
3.  **Access Application**:
    -   Frontend: [http://localhost:5173](http://localhost:5173)
    -   Backend API: [http://localhost:8072/api](http://localhost:8072/api)

## Services

-   **Frontend**: React app served via Nginx. Proxies `/api` requests to the Backend.
-   **Backend**: Spring Boot application. Connects to the Database container.
-   **Database**: PostgreSQL 15. Data is persisted in a Docker volume `postgres_data`.

## Notes
-   **Data Persistence**: If you remove the containers (`docker-compose down`), your data remains in the volume. To wipe data, use `docker-compose down -v`.
## Maintenance
-   **Cleanup**: To remove unused containers, networks, and images (cleaning disk space), run:
    ```bash
    docker system prune
    ```
-   **Rebuild**: If you change dependencies or build configurations, force a rebuild:
    ```bash
    docker-compose up --build
    ```
