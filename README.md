Anti Fake News (TangxVlog)

project-02-anti-fakenews-cn-tangxvlog

Team Members:
Zhu Haoyuan  Niko(hayes) 20232099
Xu Haiyang Victum 20232037
Zhou Sian Sam 20232036

frontend/backend  code
:https://github.com/chartchai-class/project-02-anti-fakenews-cn-tangxvlog.git

Video URL:
https://www.youtube.com/watch?v=NviUjuqhdDM

Team work:
20232099:Frontend function development and improvement, separation of frontend and backend, code resource integration, and development of functions such as registration and login.
20232037:Backend development and improvement, bug fixing, database connection, API development, frontend-backend connection, and development of web page interaction functions.
20232036:Project deployment, bug fixing, exception handling, and other related work.



Overview
 Minimal full‑stack app to vote on news authenticity with comments.

Project Structure
 Frontend in `fakenews/front`, backend in `fakenews/backend`, MySQL via Docker Compose.

Quick Start
 Start DB, run backend on `8082`, run frontend (`npm run dev`) and open the printed URL.

API Proxy
 Frontend proxies `/api` to `http://localhost:8082` and should match backend port.

Developer Helpers
 `NetworkError` page can start backend in dev; app falls back to local mode when server is down.

Tech Stack
 Vue 3 + Vite + TypeScript; Spring Boot + JPA + MySQL.

Features
 News CRUD display, like/toggle, vote counts, comments pagination, ops helpers, i18n + RSS.

Deployment
 Build backend JAR or container; build frontend and deploy `dist` with `/api` reverse proxy.

Troubleshooting
 Check ports (8080/8081/8082), DB connectivity (3310), and frontend proxy config.

License
 Demo and educational use; harden for production security and compliance.


