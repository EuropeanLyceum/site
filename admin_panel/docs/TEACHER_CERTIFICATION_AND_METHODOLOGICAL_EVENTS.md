# Атестація педагогічних працівників та Основні методичні заходи

## Огляд

Було створено функціональність для управління двома новими розділами адміністративної панелі:

1. **Атестація педагогічних працівників** - аналогічно до сторінки новин з додатковими полями
2. **Основні методичні заходи** - аналогічно до сторінки новин

## Структура бази даних

### TeacherCertification (Атестація педагогічних працівників)

```prisma
model TeacherCertification {
  id              Int      @id @default(autoincrement())
  heading         String   // Заголовок
  description     String   // Опис
  text            String?  // Додатковий текст (опціонально)
  url             String?  // Посилання (опціонально)
  photoUrls       String   @default("[]") // JSON масив URL фотографій
  publicationDate DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### MethodologicalEvents (Основні методичні заходи)

Використовує існуючу модель з додатковими покращеннями:

```prisma
model MethodologicalEvents {
  id        Int      @id @default(autoincrement())
  title     String   // Заголовок
  content   String   // Зміст
  photoUrl  String?  // URL фотографії (опціонально)
  url       String?  // Посилання (опціонально)
  order     Int      // Порядок відображення
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Компоненти

### TeacherCertificationManager

**Файл:** `components/TeacherCertificationManager.tsx`

Компонент для управління атестацією педагогічних працівників з наступними можливостями:

- ✅ Додавання нових атестацій
- ✅ Редагування існуючих атестацій
- ✅ Видалення атестацій
- ✅ Завантаження фотографій
- ✅ Підтримка додаткових полів: текст та посилання
- ✅ Валідація даних
- ✅ Обробка помилок
- ✅ Стани завантаження

### MethodologicalEventsManager

**Файл:** `components/MethodologicalEventsManager.tsx`

Компонент для управління методичними заходами з наступними можливостями:

- ✅ Додавання нових заходів
- ✅ Редагування існуючих заходів
- ✅ Видалення заходів
- ✅ Завантаження фотографій
- ✅ Управління порядком відображення
- ✅ Підтримка посилань
- ✅ Валідація даних
- ✅ Обробка помилок
- ✅ Стани завантаження

## API Endpoints

### Атестація педагогічних працівників

- **GET** `/api/teacher-certification` - отримання всіх атестацій
- **POST** `/api/teacher-certification` - створення нової атестації
- **PUT** `/api/teacher-certification/[id]` - оновлення атестації
- **DELETE** `/api/teacher-certification/[id]` - видалення атестації

### Методичні заходи

- **GET** `/api/methodological-events` - отримання всіх заходів
- **POST** `/api/methodological-events` - створення нового заходу
- **PUT** `/api/methodological-events/[id]` - оновлення заходу
- **DELETE** `/api/methodological-events/[id]` - видалення заходу

## Сторінки адміністративної панелі

### Атестація педагогічних працівників

**Файл:** `app/(admin)/teacher-certification/page.tsx`

```tsx
import TeacherCertificationManager from "@/components/TeacherCertificationManager";

export default function TeacherCertificationPage() {
  return (
    <TeacherCertificationManager 
      apiEndpoint="/api/teacher-certification" 
      title="Атестація педагогічних працівників" 
    />
  );
}
```

### Основні методичні заходи

**Файл:** `app/(admin)/methodological-events/page.tsx`

```tsx
import MethodologicalEventsManager from "@/components/MethodologicalEventsManager";

export default function MethodologicalEventsPage() {
  return (
    <MethodologicalEventsManager 
      apiEndpoint="/api/methodological-events" 
      title="Основні методичні заходи" 
    />
  );
}
```

## Особливості реалізації

### Атестація педагогічних працівників

1. **Додаткові поля:**
   - `text` - додатковий текст (опціонально)
   - `url` - посилання (опціонально)

2. **Фотографії:** Підтримка множинних фотографій через JSON масив

3. **Валідація:** Обов'язкові поля: `heading`, `description`

### Методичні заходи

1. **Порядок:** Поле `order` для управління порядком відображення

2. **Фотографії:** Підтримка однієї фотографії на захід

3. **Валідація:** Обов'язкові поля: `title`, `content`

## Міграції

Було створено міграцію для нової моделі `TeacherCertification`:

```bash
npx prisma migrate dev --name add_teacher_certification
```

## Використання

1. **Додавання нової атестації:**
   - Натисніть "Додати нову атестацію"
   - Заповніть обов'язкові поля (заголовок, опис)
   - Додайте додатковий текст та посилання (за бажанням)
   - Завантажте фотографії
   - Збережіть

2. **Додавання нового методичного заходу:**
   - Натисніть "Додати новий захід"
   - Заповніть обов'язкові поля (заголовок, зміст)
   - Додайте посилання та фотографію (за бажанням)
   - Встановіть порядок відображення
   - Збережіть

## Технічні деталі

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **База даних:** SQLite з Prisma ORM
- **Завантаження файлів:** Інтеграція з існуючою системою ImageUploader
- **Валідація:** Клієнтська та серверна валідація
- **Обробка помилок:** Детальні повідомлення про помилки
- **UX:** Стани завантаження, підтвердження дій, responsive дизайн
