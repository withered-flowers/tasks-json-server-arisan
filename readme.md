# Simple API Documentation

## Model

### entrant

| column   | type   | notes           |
| -------- | ------ | --------------- |
| id       | number |                 |
| nama     | string |                 |
| username | string |                 |
| email    | string |                 |
| password | string | hashed (bcrypt) |
| saldo    | number |                 |

|

### club

| column   | type   | notes |
| -------- | ------ | ----- |
| id       | number |       |
| nama     | string |       |
| poolUang | number |       |

### gift

| column    | type   | notes                        |
| --------- | ------ | ---------------------------- |
| id        | number |                              |
| entrantId | number | relasi terhadap entrant (id) |
| clubId    | number | relasi terhadap club (id)    |
| reward    | number |                              |

## List of Endpoints:

- POST `/login`
- GET `/clubs`
- GET `/gifts?_expand=club&_expand=entrant`
- POST `/clubs`
- PATCH `/clubs/:id`
- POST `/gifts`
- PATCH `/gifts/:id`
- DELETE `/gifts/:id`

## All Responses

- Success (200, 201)

```json
{
  "statusCode": number,
  "data": Array<Object> | string
}
```

- Error (400, 401, 403)

```json
{
  "statusCode": number,
  "error": string
}
```

## POST `/login`

Lihat `data.json` -> `entrant` -> `username` (pilih satu)

### Request

```json
{
  "username" : string,
  "password": "123456"
}
```

### Response

```json
{
  "statusCode": number
  "data": string
}
```

## GET `/clubs`

### Request

Tidak diperlukan

### Response

```json
"statusCode": number,
"data": Array<club>
```

## GET `/gifts?_expand=club&_expand=entrant`

### Request

Tidak diperlukan

### Response

```json
"statusCode": number
"data": [
  {
    "id": number,
    "entrantId": number,
    "clubId": number,
    "reward": number,
    "entrant": entrant,
    "club": club
  },
  ...
]
```

## Semua Route di bawah Membutuhkan Authentication

### Request

(Headers)

```json
{
  "token_akses": string
}
```

## POST `/clubs`

### Request

```json
{
  "nama": string,
  "poolUang": number
}
```

### Response

```json
{
  "statusCode": number,
  "data": club
}
```

## PATCH `/clubs/:id`

### Request

```json
{
  "poolUang": number
}
```

### Response

```json
{
  "statusCode": number,
  "data": club
}
```

## POST `/gifts`

### Request

```json
{
  "clubId": number,
  "reward": number
}
```

### Response

```json
{
  "statusCode": number,
  "data": gift
}
```

## PATCH `/gifts/:id`

### Request

```json
{
  "reward": number
}
```

### Response

```json
{
  "statusCode": number,
  "data": gift
}
```

## DELETE `/gifts/:id`

### Request

Tidak diperlukan

### Reponse

```json
{
  "statusCode": number,
  "data": {}
}
```
