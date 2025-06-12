import axios from 'axios';

/**
 * Универсальный запрос с явными параметрами
 * @param {string} method - HTTP метод (get/post/put/delete)
 * @param {string} url - URL запроса
 * @param {object|null} [data=null] - Тело запроса (для POST/PUT)
 * @param {function} [onSuccess=()=>{}] - Коллбэк при успехе
 * @param {function} [onError=()=>{}] - Коллбэк при ошибке
 */

const isDevelop = true;

const baseUrl = isDevelop ? 'http://89.169.45.188:3000' : 'http://89.169.45.188:3000';

export async function apiRequest(
    method,
    url,
    data = null,
    onSuccess = (response) => console.log('Успех:', response),
    onError = (error) => console.error('Ошибка:', error)
) {
    try {
        const config = {
            method,
            url: `${baseUrl}/api${url}`,
            headers: {
                'Content-Type': data instanceof FormData
                    ? 'multipart/form-data'
                    : 'application/json',
            }
        };

        if (data) config.data = data;

        const response = await axios(config);
        onSuccess(response.data);
        return response.data;
    } catch (error) {
        const errorData = {
            status: error.response?.status || 0,
            message: error.response?.data?.message ||
                error.message ||
                'Неизвестная ошибка'
        };
        onError(errorData);
        throw errorData; // Пробрасываем для дальнейшей обработки
    }
}