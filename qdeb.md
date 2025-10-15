Документация Qdeb API

Version: 1.0
Base URL: http://localhost:4232
Authentication: Bearer Token (JWT)

!!! Важные моменты по проекту:

1. Пожалуйста, чтобы все функции работали корректно запусти Tabbycat Docker, если не знаешь как то напиши мне
2. Все функции были простетировано по отдельности, поэтому если возникнут ошибки то это скорее всего ошибка окружения либо вы запустили что то неправильно либо неправильно кидаете запрос, также если ошибки будут пишите мне
3. При первом запуске приложения автоматически создается админский аккаунт: username=admin, password=admin с ролью ROLE_ADMIN
4. Пожалуйста, на фронте при регистрации прям проверяйте что full name это 2 слова, то етсь реальное имя и фамилия, так как это будет далее регаться в tabbycat

если чето не так свяжись со мной @heiPHin7 (тг)

КРАТКИЙ ПЕРЕЧЕНЬ ENDPOINTS

Аутентификация:
POST /api/auth/signup - Регистрация пользователя с загрузкой фото
POST /api/auth/signin - Авторизация и получение JWT токена

Профили пользователей:
GET /api/profile - Получение профиля текущего пользователя
GET /api/profile/{username} - Получение публичного профиля по username

Команды:
POST /api/teams - Создание новой команды
POST /api/teams/join - Вступление в команду по коду
POST /api/teams/leave - Выход из команды
POST /api/teams/kick/{userId} - Исключение участника из команды (только лидер)
GET /api/teams/my - Получение информации о своей команде
GET /api/teams/{teamId}/applications - Получение заявок команды

Турниры:
POST /api/tournaments - Создание турнира
GET /api/tournaments - Получение списка всех турниров
POST /api/tournaments/{tournamentId}/apply - Подача заявки на турнир
GET /api/tournaments/{tournamentSlug}/applications - Получение заявок на турнир

Управление заявками:
POST /api/applications/{applicationId}/accept - Принятие заявки (админ)
POST /api/applications/{applicationId}/reject - Отклонение заявки (админ)

Управление файлами:
GET /api/files/{fileName} - Получение файла
GET /api/files/profile-picture/{fileName} - Получение фото профиля

Тестовые endpoints:
GET /api/test/public - Публичный тестовый endpoint
GET /api/test/user - Защищенный endpoint для пользователей
GET /api/test/admin - Защищенный endpoint для админов
GET /api/test/profile - Получение профиля для тестирования

АУТЕНТИФИКАЦИЯ

Все защищенные endpoints требуют JWT токен в заголовке Authorization:

Authorization: Bearer <jwt_token>

JWT токены действительны 24 часа. Получите токен через endpoint signin.

Админский аккаунт:
При первом запуске приложения автоматически создается админский аккаунт:

- Username: admin
- Password: admin
- Email: admin@qdeb.com
- Роль: ROLE_ADMIN

Используйте эти данные для входа в систему с правами администратора.

ОТВЕТЫ С ОШИБКАМИ

Все ошибки следуют этой структуре:

{
"error": "Сообщение об ошибке",
"code": "КОД_ОШИБКИ",
"details": "Дополнительные детали"
}

HTTP коды статуса:

- 200 - Успех
- 201 - Создано
- 400 - Неверный запрос
- 401 - Не авторизован
- 403 - Запрещено
- 404 - Не найдено
- 500 - Внутренняя ошибка сервера

ENDPOINTS

АУТЕНТИФИКАЦИЯ

1. Регистрация пользователя
   POST /api/auth/signup

Регистрация нового пользователя с возможностью загрузки фото профиля.

Content-Type: multipart/form-data

Параметры:

- register (string, обязательный) - JSON строка с данными пользователя
- profilePicture (file, опциональный) - Изображение профиля (JPG, PNG, GIF, WebP, макс 10MB)

JSON для регистрации:
{
"username": "alice",
"email": "alice@example.com",
"password": "password123",
"fullName": "Alice Johnson",
"gender": "F",
"phone": "+1234567890",
"description": "Debate enthusiast"
}

Успешный ответ:
200 OK
"Пользователь успешно зарегистрирован!"

Ответы с ошибками:
400 Bad Request
"Ошибка: Имя пользователя уже используется!"

400 Bad Request
"Ошибка: Email уже используется!"

400 Bad Request
"Поддерживаются только изображения (JPG, PNG, GIF, WebP)"

2. Авторизация пользователя
   POST /api/auth/signin

Аутентификация пользователя и получение JWT токена.

Content-Type: application/json

Тело запроса:
{
"username": "alice",
"password": "password123"
}

Успешный ответ:
{
"token": "eyJhbGciOiJIUzI1NiJ9...",
"type": "Bearer",
"username": "alice",
"email": "alice@example.com"
}

Ответ с ошибкой:
401 Unauthorized

ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ

3. Получить мой профиль
   GET /api/profile

Получить профиль текущего пользователя с информацией о команде.

Заголовки: Authorization: Bearer <token>

Успешный ответ:
{
"id": 1,
"username": "alice",
"email": "alice@example.com",
"fullName": "Alice Johnson",
"phone": "+1234567890",
"description": "Debate enthusiast",
"profilePicture": "uploads/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00",
"team": {
"id": 1,
"name": "Dream Team",
"joinCode": "ABC12345",
"role": "LEADER",
"memberCount": 2,
"isFull": true,
"joinedAt": "2024-01-01T12:00:00"
}
}

4. Получить публичный профиль
   GET /api/profile/{username}

Получить публичный профиль по username.

Успешный ответ: Такой же как выше

КОМАНДЫ

5. Создать команду
   POST /api/teams

Создать новую команду. Создатель становится лидером команды.

Заголовки: Authorization: Bearer <token>

Тело запроса:
{
"name": "Dream Team"
}

Успешный ответ:
{
"id": 1,
"name": "Dream Team",
"leader": {
"id": 1,
"username": "alice",
"email": "alice@example.com",
"fullName": "Alice Johnson",
"phone": "+1234567890",
"description": "Team captain",
"profilePicture": "uploads/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00"
},
"joinCode": "ABC12345",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00",
"memberCount": 1,
"isFull": false
}

Ответ с ошибкой:
400 Bad Request
"Пользователь уже состоит в команде"

6. Join Team
   POST /api/teams/join

Join a team using invitation code.

Заголовки: Authorization: Bearer <token>

Тело запроса:
{
"joinCode": "ABC12345"
}

Успешный ответ: Same as Create Team

Ответы с ошибками:
400 Bad Request
"Пользователь уже состоит в команде"

400 Bad Request
"Команда с таким кодом не найдена"

400 Bad Request
"Команда уже полная"

7. Leave Team
   POST /api/teams/leave

Leave current team.

Заголовки: Authorization: Bearer <token>

Успешный ответ: Team data or deletion message

8. Get My Team
   GET /api/teams/my

Get current user's team information.

Заголовки: Authorization: Bearer <token>

Успешный ответ: Same as Create Team

9. Kick Member from Team
   POST /api/teams/kick/{userId}

Kick a member from the team (only for team leader).

Заголовки: Authorization: Bearer <token>

URL Parameters:

- userId - ID of the user to kick

Успешный ответ: Team data after kicking member

Ответы с ошибками:
400 Bad Request
"Пользователь не состоит в команде"

400 Bad Request
"Только лидер команды может исключать участников"

400 Bad Request
"Пользователь не найден"

400 Bad Request
"Пользователь не состоит в команде"

400 Bad Request
"Пользователь не состоит в вашей команде"

400 Bad Request
"Лидер не может исключить самого себя"

10. Get Team Applications
    GET /api/teams/{teamId}/applications

Get all applications submitted by a team.

Заголовки: Authorization: Bearer <token>

Query Parameters:

- status (optional) - Filter by status: PENDING, APPROVED, REJECTED

Успешный ответ:
[
{
"id": 1,
"tournamentId": 1,
"tournamentName": "National Championship",
"tournamentSlug": "national-2024",
"team": {
"id": 1,
"name": "Dream Team",
"joinCode": "ABC12345",
"leader": {
"id": 1,
"username": "alice",
"email": "alice@example.com",
"fullName": "Alice Johnson",
"phone": "+1234567890",
"description": "Team captain",
"profilePicture": "uploads/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00"
},
"member": {
"id": 2,
"username": "bob",
"email": "bob@example.com",
"fullName": "Bob Smith",
"phone": "+1234567891",
"description": "Team member",
"profilePicture": null,
"createdAt": "2024-01-01T12:00:00"
},
"memberCount": 2,
"isFull": true,
"createdAt": "2024-01-01T12:00:00"
},
"submittedBy": {
"id": 1,
"username": "alice",
"email": "alice@example.com",
"fullName": "Alice Johnson",
"phone": "+1234567890",
"description": "Team captain",
"profilePicture": "uploads/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00"
},
"status": "PENDING",
"fields": [
{
"id": 1,
"name": "Full Name",
"value": "Alice Johnson"
},
{
"id": 2,
"name": "Institution",
"value": "Stanford University"
}
],
"createdAt": "2024-01-01T15:00:00",
"updatedAt": "2024-01-01T15:00:00"
}
]

Ответ с ошибкой:
403 Forbidden
"У вас нет доступа к заявкам этой команды"

ТУРНИРЫ

11. Create Tournament
    POST /api/tournaments

Create a new tournament with registration fields.

Заголовки: Authorization: Bearer <token>

Content-Type: multipart/form-data

Parameters:

- tournament (string, required) - JSON string with tournament data
- tournamentPicture (file, optional) - Tournament image (JPG, PNG, GIF, WebP, max 10MB)

Tournament JSON:
{
"name": "National Championship 2024",
"slug": "national-2024",
"organizerName": "Debate Society",
"organizerContact": "contact@debatesociety.com",
"description": "Annual national debate championship",
"date": "2024-12-31",
"active": true,
"fee": 500,
"level": "NATIONAL",
"format": "online",
"seq": 1,
"registraionFields": [
{
"name": "Full Name",
"type": "DESCRIPTION",
"required": true
},
{
"name": "Institution",
"type": "DESCRIPTION",
"required": true
}
]
}

Успешный ответ:
{
"id": 1,
"name": "National Championship 2024",
"slug": "national-2024",
"organizerName": "Debate Society",
"organizerContact": "contact@debatesociety.com",
"description": "Annual national debate championship",
"date": "2024-12-31",
"active": true,
"fee": 500,
"level": "NATIONAL",
"format": "online",
"seq": 1,
"tournamentPicture": "uuid-filename.jpg",
"imageURL": "/api/files/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00",
"registrationFields": [
{
"id": 1,
"name": "Full Name",
"type": "DESCRIPTION",
"required": true
}
],
"rounds": []
}

Ответ с ошибкой:
400 Bad Request
"Турнир с таким slug уже существует: national-2024"

12. Get All Tournaments
    GET /api/tournaments

Get list of all tournaments.

Заголовки: Authorization: Bearer <token>

Успешный ответ:
[
{
"id": 1,
"name": "National Championship 2024",
"slug": "national-2024",
"organizerName": "Debate Society",
"organizerContact": "contact@debatesociety.com",
"description": "Annual national debate championship",
"date": "2024-12-31",
"active": true,
"fee": 500,
"level": "NATIONAL",
"format": "online",
"seq": 1,
"tournamentPicture": "uuid-filename.jpg",
"imageURL": "/api/files/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00",
"registrationFields": [
{
"id": 1,
"name": "Full Name",
"type": "DESCRIPTION",
"required": true
}
],
"rounds": []
}
]

13. Submit Tournament Application
    POST /api/tournaments/{tournamentId}/apply

Submit team application for tournament participation.

Заголовки: Authorization: Bearer <token>

Тело запроса:
{
"teamId": 1,
"fields": [
{
"name": "Full Name",
"value": "Alice Johnson"
},
{
"name": "Institution",
"value": "Stanford University"
}
]
}

Успешный ответ:
{
"message": "Application submitted successfully",
"applicationId": 12
}

Ответы с ошибками:
400 Bad Request
"Tournament is not active"

400 Bad Request
"Missing required field: Full Name"

400 Bad Request
"Команда должна иметь ровно 2 участника"

400 Bad Request
"Команда уже подавала заявку на этот турнир"

403 Forbidden
"Пользователь не является участником команды"

403 Forbidden
"Только капитан команды может подавать заявки"

404 Not Found
"Турнир не найден"

14. Get Tournament Applications
    GET /api/tournaments/{tournamentSlug}/applications

Get all applications for a tournament.

Заголовки: Authorization: Bearer <token>

Query Parameters:

- status (optional) - Filter by status: PENDING, APPROVED, REJECTED

Успешный ответ: Same as Get Team Applications

УПРАВЛЕНИЕ ЗАЯВКАМИ

15. Accept Application
    POST /api/applications/{applicationId}/accept

Accept a tournament application (Admin only).

Заголовки: Authorization: Bearer <token>

Успешный ответ: Application data with status "APPROVED"

Ответы с ошибками:
400 Bad Request
"Можно принимать только заявки в статусе PENDING. Текущий статус: APPROVED"

403 Forbidden
"Access Denied"

404 Not Found
"Заявка не найдена"

16. Reject Application
    POST /api/applications/{applicationId}/reject

Reject a tournament application (Admin only).

Заголовки: Authorization: Bearer <token>

Успешный ответ: Application data with status "REJECTED"

Ответы с ошибками: Same as Accept Application

УПРАВЛЕНИЕ ФАЙЛАМИ

17. Get File
    GET /api/files/{fileName}

Get any file from uploads directory.

Успешный ответ: File content with appropriate Content-Type

Ответ с ошибкой:
404 Not Found

18. Get Profile Picture
    GET /api/files/profile-picture/{fileName}

Get profile picture by filename.

Успешный ответ: Image file

ТЕСТОВЫЕ ENDPOINTS

19. Public Test
    GET /api/test/public

Public endpoint for testing.

Успешный ответ:
200 OK
"Это публичный endpoint, доступен всем."

20. User Test
    GET /api/test/user

Protected endpoint for authenticated users.

Заголовки: Authorization: Bearer <token>

Успешный ответ:
200 OK
"Привет, alice! Это защищенный endpoint для пользователей."

21. Admin Test
    GET /api/test/admin

Protected endpoint for administrators.

Заголовки: Authorization: Bearer <token>

Успешный ответ:
200 OK
"Привет, admin! Это защищенный endpoint для администраторов."

22. Profile Test
    GET /api/test/profile

Get current user profile for testing.

Заголовки: Authorization: Bearer <token>

Успешный ответ: User entity with roles

МОДЕЛИ ДАННЫХ

Пользователь
{
"id": 1,
"username": "alice",
"email": "alice@example.com",
"fullName": "Alice Johnson",
"gender": "F",
"phone": "+1234567890",
"description": "Debate enthusiast",
"profilePicture": "uploads/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00"
}

Команда
{
"id": 1,
"name": "Dream Team",
"leader": "User object",
"joinCode": "ABC12345",
"memberCount": 2,
"isFull": true,
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00"
}

Tournament
{
"id": 1,
"name": "National Championship 2024",
"slug": "national-2024",
"organizerName": "Debate Society",
"organizerContact": "contact@debatesociety.com",
"description": "Annual national debate championship",
"date": "2024-12-31",
"active": true,
"fee": 500,
"level": "NATIONAL",
"format": "online",
"seq": 1,
"tournamentPicture": "uuid-filename.jpg",
"imageURL": "/api/files/uuid-filename.jpg",
"createdAt": "2024-01-01T12:00:00",
"updatedAt": "2024-01-01T12:00:00"
}

Заявка на турнир
{
"id": 1,
"tournamentId": 1,
"tournamentName": "National Championship 2024",
"tournamentSlug": "national-2024",
"team": "Team object",
"submittedBy": "User object",
"status": "PENDING",
"fields": [
{
"id": 1,
"name": "Full Name",
"value": "Alice Johnson"
}
],
"createdAt": "2024-01-01T15:00:00",
"updatedAt": "2024-01-01T15:00:00"
}

ПЕРЕЧИСЛЕНИЯ

Гендер

- M - Мужской
- F - Женский
- O - Другой

Уровень турнира

- NATIONAL - Национальный уровень
- REGIONAL - Региональный уровень
- INTERNATIONAL - Международный уровень
- LOCAL - Местный уровень

Статус заявки

- PENDING - Ожидает рассмотрения
- APPROVED - Принята
- REJECTED - Отклонена

Названия ролей

- ROLE_USERS - Обычный пользователь
- ROLE_ADMIN - Администратор

ИНТЕГРАЦИЯ С TABBYCAT

При принятии заявок команды автоматически создаются в Tabbycat со следующим маппингом:

- Название команды → reference, short_reference, code_name
- Полное имя пользователя → name и last_name (разделено по пробелу)
- Email пользователя → email
- Телефон пользователя → phone
- Username пользователя → code_name
- Гендер пользователя → gender (M, F, O из профиля)
