-- 2. ADMIN USER SEED
INSERT INTO "AdminUser" (
    username,
    password,
    role,
    "isActive",
    "createdAt",
    "updatedAt"
)
VALUES (
           'european_admin',
           '$2a$12$48jjpVTAXKJl1IVvXrDsBek8pSQYyfpzqOsmmaEEVazhwn40j6yVm',
           'admin',
           true,
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
       )
    ON CONFLICT (username) DO UPDATE SET
    role = EXCLUDED.role,
                                  "isActive" = EXCLUDED."isActive",
                                  "updatedAt" = CURRENT_TIMESTAMP;