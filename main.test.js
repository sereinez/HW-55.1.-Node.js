import { jest } from '@jest/globals';

// Мокаємо fs/promises ПЕРЕД імпортом тестованого модуля
jest.unstable_mockModule('fs/promises', () => ({
  writeFile: jest.fn(),
  readFile: jest.fn(),
  unlink: jest.fn(),
}));

const { writeFile, readFile, unlink } = await import('fs/promises');
const { writeFileAsync, readFileAsync, deleteFileAsync } = await import('./main.js');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('writeFileAsync', () => {
  test('успішно записує файл і логує повідомлення', async () => {
    writeFile.mockResolvedValue();

    await writeFileAsync('example.txt', 'привіт');

    expect(writeFile).toHaveBeenCalledWith('example.txt', 'привіт', 'utf-8');
    expect(console.log).toHaveBeenCalledWith('Файл успішно записано');
  });

  test('логує помилку і прокидає її далі при невдалому записі', async () => {
    const error = new Error('disk full');
    writeFile.mockRejectedValue(error);

    await expect(writeFileAsync('example.txt', 'привіт')).rejects.toThrow('disk full');
    expect(console.error).toHaveBeenCalledWith('Помилка при записі файлу:', error);
  });
});

describe('readFileAsync', () => {
  test('успішно читає файл, логує та повертає вміст', async () => {
    readFile.mockResolvedValue('тестовий вміст');

    const result = await readFileAsync('example.txt');

    expect(readFile).toHaveBeenCalledWith('example.txt', 'utf-8');
    expect(console.log).toHaveBeenCalledWith('Файл успішно прочитано:', 'тестовий вміст');
    expect(result).toBe('тестовий вміст');
  });

  test('окремо логує, якщо файл не існує (ENOENT)', async () => {
    const error = new Error('not found');
    error.code = 'ENOENT';
    readFile.mockRejectedValue(error);

    await expect(readFileAsync('missing.txt')).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith('Файл не існує:', 'missing.txt');
  });

  test('логує загальну помилку при інших збоях читання', async () => {
    const error = new Error('permission denied');
    readFile.mockRejectedValue(error);

    await expect(readFileAsync('example.txt')).rejects.toThrow('permission denied');
    expect(console.error).toHaveBeenCalledWith('Помилка при читанні файлу:', error);
  });
});

describe('deleteFileAsync', () => {
  test('успішно видаляє файл і логує повідомлення', async () => {
    unlink.mockResolvedValue();

    await deleteFileAsync('example.txt');

    expect(unlink).toHaveBeenCalledWith('example.txt');
    expect(console.log).toHaveBeenCalledWith('Файл успішно видалено');
  });

  test('окремо логує, якщо файл не існує (ENOENT)', async () => {
    const error = new Error('not found');
    error.code = 'ENOENT';
    unlink.mockRejectedValue(error);

    await expect(deleteFileAsync('missing.txt')).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith('Файл не існує:', 'missing.txt');
  });

  test('логує загальну помилку при інших збоях видалення', async () => {
    const error = new Error('permission denied');
    unlink.mockRejectedValue(error);

    await expect(deleteFileAsync('example.txt')).rejects.toThrow('permission denied');
    expect(console.error).toHaveBeenCalledWith('Помилка при видаленні файлу:', error);
  });
});
