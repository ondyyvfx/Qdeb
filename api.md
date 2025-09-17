1. Турниры:

- Создание турнира
POST localhost:5629/api/tournaments

Request Body:
multipart/form-data:

данные ввиде:
название - формат

1.photo - photo
2.tournament - JSON
example:

```jsonа
{
    "name": "test1",
    "slug": "test1",
    "organizerName": "someOrganizer",
    "organizerContance": "some@gmail.com",
    "description": "best tournament in the world",
    "date": "2025-12-31",
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
        }
    ]
}
```


2. Создание команды
POST localhost:5629/api/teams

Request Body: 
application/json:

```json
{
  "name": "string"
}
```

Response:
{
  "id": 0,
  "name": "string",
  "code": "string",
  "size": 0,
  "leader": true
}

3. Покинуть команду
POST localhost:5629/api/teams/leave
!!! Здесь не нужны никакие Request Body, так как информация о пользователе берется из JWT, также на фронте требуется чтобы лидер не мог ливать из команды (на бэке реализовано, но чтобы в лишний раз не выкидывать exception)

4. Присоединиться к команде 
POST localhost:5629/api/teams/join

Request Body: 
application/json
```json
{
  "code": "XTBGNN86D2JGX60Z"
}
```

5. Получить информацию о профиле пользвоателя:
GET localhost:5629/api/users/{username}

Response example:
```json
{
  "id": 0,
  "email": "string",
  "username": "string",
  "fullName": "string",
  "phone": "string",
  "description": "string",
  "profilePictureUrl": "string",
  "roles": [
    "ROLE_USER"
  ],
  "createdAt": "2025-08-19T19:44:01.673Z",
  "updatedAt": "2025-08-19T19:44:01.673Z",
  "teamId": 0,
  "teamName": "string",
  "teamCode": "string",
  "teamSize": 0,
  "teamLeader": true
}
```

6. Подать заявку на участие в турнире

POST localhost:5629/api/tournaments/{slug}/applications

Request Body
multipart/form-data

!!! Здесь полуачется реализуется фича в котором каждый организатор может делать уникальные поля для регистрационных форм на их турнир, поэтому чутка сложно для понимания

Поля:

payload — JSON с ответами на не-документные поля:

```json
{
  "answers": {
    "Age": "18",
    "About": "We are ready!"
  }
}
```

ключи должны совпадать с registrationFields.name

INTEGER — строка, парсится в число
DESCRIPTION — обычный текст

[имяДокументногоПоля] — файл (для каждого DOCUMENT-поля передаётся файл с таким же именем, как поле).
Примеры: Transcript, ConsentForm

Response

```json
{
  "id": 123,
  "tournamentSlug": "test1",
  "teamId": 456,
  "status": "PENDING",
  "message": "Application submitted"
}
```


Ошибки

400 Bad Request:

-"Tournament not found"
-"Registration for this tournament is closed"
-"You must be in a team to apply"
-"Only the team leader can submit the application"
-"Team must consist of exactly 2 members to apply"
-"Your team already has an active application for this tournament"
-"Field 'Age' is required (integer)"
-"Field 'Age' must be an integer"
-"Document field 'Transcript' is required"

401 Unauthorized — нет токена или он недействителе

### Auth:

1. Регистрация
POST localhost:5629/api/auth/register
Request Body: 
multipart/form-data

название - тип поля:
1. data - object (json)
Example of json:
```json
{
  "email": "test@example.com",
  "username": "ramy",
  "password": "pass1234",
  "full_name": "John Smith",
  "phone": "+77001234567",
  "description": "Hello!"
}
```
2. profilePicture - photo

2. Авторизация
POST localhost:5629/api/auth/login
Request Body:
application/json:
```json
{
    "email":"test@example.com",
    "password":"pass1234"
}
```

Response (example):
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3NTU2MzI4MDMsImV4cCI6MTc1NTYzNjQwM30.Q56DXPXefDAG7o3n9-FSN2YqFoHuGB40o2f7wozBMfg"
} 
```


