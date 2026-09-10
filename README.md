# #55. JavaScript Homework — Async File Operations

Реалізація трьох функцій для асинхронної роботи з файлами через `fs/promises` у Node.js.

## Функції

### `writeFileAsync(filename, content)`
Асинхронно записує `content` у файл `filename`.

- Успіх → `console.log('Файл успішно записано')`
- Помилка → `console.error('Помилка при записі файлу:', error)`, помилка прокидається далі (`throw`)

```js
await writeFileAsync('example.txt', 'Привіт, це тестовий файл!');
```

### `readFileAsync(filename)`
Асинхронно читає вміст файлу `filename` і повертає його.

- Успіх → `console.log('Файл успішно прочитано:', content)`, повертає `content`
- Файл не знайдено (`error.code === 'ENOENT'`) → `console.error('Файл не існує:', filename)`
- Інша помилка → `console.error('Помилка при читанні файлу:', error)`
- Помилка прокидається далі (`throw`)

```js
const content = await readFileAsync('example.txt');
```

### `deleteFileAsync(filename)`
Асинхронно видаляє файл `filename` через `unlink`.

- Успіх → `console.log('Файл успішно видалено')`
- Файл не знайдено (`error.code === 'ENOENT'`) → `console.error('Файл не існує:', filename)`
- Інша помилка → `console.error('Помилка при видаленні файлу:', error)`
- Помилка прокидається далі (`throw`)

```js
await writeFileAsync('example.txt', 'Привіт!');
await deleteFileAsync('example.txt');
```

## Технічні деталі

- Усі функції — `async`, використовують `await` та `try/catch`.
- Усі помилки логуються, а потім прокидаються далі (`throw error`), щоб виклик функції отримав відхилений (`rejected`) проміс — це потрібно для коректного тестування через Jest (`await expect(fn()).rejects.toThrow()`).
- `ENOENT` — стандартний код помилки Node.js, який означає "файл або шлях не знайдено".



## Запуск

```bash
# ручний запуск коду
node main.js

# запуск тестів
npm test
```
