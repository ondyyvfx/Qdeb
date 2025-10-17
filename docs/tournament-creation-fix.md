# Исправление ошибок создания турнира

## Проблема

При попытке создания турнира возникали ошибки валидации:

1. `organizerContact` - поле должно быть не пустым
2. `date` - поле не может быть null

## Причины ошибок

### 1. Неправильные названия полей

Фронтенд отправлял:

- `organizerContacts` → сервер ожидал `organizerContact`
- `eventDate` → сервер ожидал `date`

### 2. Отсутствующие поля в форме

В форме создания турнира отсутствовали обязательные поля:

- `organizerName` (название организатора)
- `organizerContacts` (контактная информация)

### 3. Неправильное название файла

- Фронтенд отправлял `photo` → сервер ожидал `tournamentPicture`

### 4. Неправильный API URL

- Использовался порт 5639 → правильный порт 4232

## Исправления

### 1. Добавлены недостающие поля в форму

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="organizerName">Название организатора *</Label>
    <Input
      id="organizerName"
      value={formData.organizerName}
      onChange={(e) => handleInputChange("organizerName", e.target.value)}
      placeholder="QDeb Organization"
      required
    />
  </div>
  <div>
    <Label htmlFor="organizerContacts">Контактная информация *</Label>
    <Input
      id="organizerContacts"
      value={formData.organizerContacts}
      onChange={(e) => handleInputChange("organizerContacts", e.target.value)}
      placeholder="info@qdeb.kz, +7 777 123 4567"
      required
    />
  </div>
</div>
```

### 2. Исправлены названия полей в запросе

```javascript
const tournamentData = {
  name: formData.name,
  shortName: formData.shortName || formData.name.substring(0, 25),
  slug: formData.slug,
  organizerName: formData.organizerName,
  organizerContact: formData.organizerContacts, // ✅ Исправлено
  description: formData.description,
  date: formData.eventDate, // ✅ Исправлено
  active: formData.active,
  fee: formData.fee,
  level: formData.level,
  format: formData.format,
  seq: 1,
  registraionFields: [
    // ✅ Добавлены поля регистрации
    {
      name: "Full Name",
      type: "DESCRIPTION",
      required: true,
    },
    {
      name: "Institution",
      type: "DESCRIPTION",
      required: true,
    },
  ],
};
```

### 3. Исправлено название файла

```javascript
if (formData.photo) {
  formDataToSend.append("tournamentPicture", formData.photo); // ✅ Исправлено
}
```

### 4. Исправлен API URL

```javascript
const response = await fetch(
  `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api"
  }/tournaments` // ✅ Исправлено
  // ...
);
```

### 5. Улучшена обработка ошибок

```javascript
} else {
  let errorMessage = "Неизвестная ошибка";
  try {
    const errorData = await response.json();
    console.error("Server error response:", errorData);

    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
  } catch (parseError) {
    console.error("Error parsing error response:", parseError);
    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  }

  toast.error(`Ошибка создания турнира: ${errorMessage}`);
}
```

## Результат

- ✅ Все обязательные поля теперь присутствуют в форме
- ✅ Названия полей соответствуют API
- ✅ Правильный API URL
- ✅ Улучшенная обработка ошибок
- ✅ Добавлены поля регистрации по умолчанию

Теперь создание турниров должно работать корректно!
