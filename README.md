# Lyceum European website

The official website of Academic Lyceum "European" in Lubny, live at **[european-lyceum.pp.ua](https://european-lyceum.pp.ua/)**.

It has two parts: a public website for students, parents and teachers, and an admin panel where the lyceum staff edit all content without touching code.

## What's inside

**Public website** (Ukrainian and English)
- About the lyceum: history, visiting card, innovation
- Educational process: clubs and studios, student self-government, psychological support, anti-bullying, sports, research projects
- Teaching staff, methodical work and teacher certification
- News, information for parents and students
- Transparency: financial reports, public information, regulatory documents
- Interactive features: a virtual tour of the lyceum and profile-choice tests for future students

**Admin panel**
- Secure login for staff, password change
- One generic editor for 18 content types: pages and sections, news, staff and categories, clubs, documents and files, FAQ, statistics, profile tests and more
- Image uploads through Cloudinary

## Tech stack

- **Frontend:** Next.js, React, MUI
- **Admin panel:** Next.js, NextAuth, Prisma, Zod
- **Database:** PostgreSQL
- **Infrastructure:** Docker Compose, Nginx, database backup script

## Run locally

See [README-LOCAL.md](README-LOCAL.md). In short:

```bash
cp env-example .env   # then fill in your own values
docker compose -f docker-compose.dev.yml up -d
```

## Author

Built by [Artem Moseichenko](https://github.com/dexipua) (about 90% of the code), with contributions from [Oleksii Tokarenko](https://github.com/altokarenko).
