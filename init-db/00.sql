-- 1. Створення користувача (якщо не існує)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_panel') THEN
    CREATE USER admin_panel WITH PASSWORD 'fc8a54b8f';
END IF;
END $$;

-- 2. Встановлення власника бази (зазвичай дозволено в Docker)
ALTER DATABASE liceum OWNER TO admin_panel;

-- 3. Надання прав на схему
GRANT ALL ON SCHEMA public TO admin_panel;

-- 4. Надання прав на існуючі об'єкти в схемі public
-- Використовуємо явні команди замість REASSIGN
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_panel;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_panel;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin_panel;

-- 5. Автоматичні права на майбутні об'єкти
-- Це гарантує, що якщо таблиці створює інший юзер, admin_panel матиме до них доступ
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin_panel;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin_panel;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO admin_panel;

-- 6. Додатково: зміна власника саме ваших таблиць (якщо вони вже існують)
-- Цей цикл змінить власника тільки для таблиць у public, не чіпаючи систему
DO $$
DECLARE
r RECORD;
BEGIN
FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO admin_panel';
END LOOP;
END $$;