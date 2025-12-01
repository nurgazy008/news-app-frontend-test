# Инструкция по настройке проекта

## После клонирования репозитория

### 1. Установка зависимостей

#### Mobile приложение
```bash
cd mobile
npm install
```

#### Web приложение
```bash
cd web
npm install
```

**Важно**: После установки зависимостей для web-версии, установите дополнительные зависимости для Shadcn/ui:
```bash
cd web
npm install @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge
```

### 2. Настройка переменных окружения

#### Mobile
```bash
cd mobile
cp .env.example .env
# Отредактируйте .env и добавьте ваш NewsAPI ключ
```

#### Web
```bash
cd web
cp .env.example .env.local
# Отредактируйте .env.local и добавьте ваш NewsAPI ключ
```

### 3. Запуск проекта

#### Mobile
```bash
cd mobile
npm start
```

#### Web
```bash
cd web
npm run dev
```

## Что было исправлено

✅ Добавлен Shadcn/ui в web-версию
✅ Созданы .env.example файлы
✅ Обновлена документация
✅ Компоненты Shadcn/ui интегрированы в страницы

