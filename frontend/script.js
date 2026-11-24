const API_BASE = "http://127.0.0.1:8000";

async function createPost() {
    const author = document.getElementById("author").value.trim() || "Аноним";
    const text = document.getElementById("text").value.trim();
    const resultBox = document.getElementById("result");

    if (!text) {
        resultBox.style.display = "block";
        resultBox.className = "result-box error";
        resultBox.textContent = "Ошибка: Текст поста не может быть пустым.";
        return;
    }

    resultBox.style.display = "block";
    resultBox.className = "result-box";
    resultBox.textContent = "Отправка...";

    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, author })
        });

        if (!response.ok) throw new Error("Ошибка сервера");

        const data = await response.json();
        resultBox.className = "result-box success";
        resultBox.textContent = `Успешно! Пост создан.\nID: ${data.id}\nАвтор: ${data.author}\nТекст: ${data.text}`;

        // Очищаем поле после отправки
        document.getElementById("text").value = "";
        // Автоматически подставляем ID для поиска, чтобы было удобно проверять
        document.getElementById("postId").value = data.id;
    } catch (error) {
        resultBox.className = "result-box error";
        resultBox.textContent = "Не удалось создать пост. Проверьте, запущен ли сервер.";
    }
}

async function getPost() {
    const id = document.getElementById("postId").value;
    const getResultBox = document.getElementById("getResult");

    if (!id) {
        getResultBox.style.display = "block";
        getResultBox.className = "result-box error";
        getResultBox.textContent = "Введите ID поста для поиска.";
        return;
    }

    getResultBox.style.display = "block";
    getResultBox.className = "result-box";
    getResultBox.textContent = "Поиск...";

    try {
        const response = await fetch(`${API_BASE}/posts/${id}`);

        if (response.status === 404) {
            getResultBox.className = "result-box error";
            getResultBox.textContent = `Пост с ID ${id} не найден.`;
            return;
        }

        if (!response.ok) throw new Error("Ошибка сервера");

        const data = await response.json();
        getResultBox.className = "result-box success";
        getResultBox.textContent = `Пост найден:\nАвтор: ${data.author}\nТекст: ${data.text}\nID: ${data.id}`;
    } catch (error) {
        getResultBox.className = "result-box error";
        getResultBox.textContent = "Ошибка при получении данных. Проверьте сервер.";
    }
}