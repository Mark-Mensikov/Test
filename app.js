// front/app.js
async function loadDiary() {
    try {
        const config = await fetch('/config').then(res => res.json());
        const pb = new PocketBase(config.pbUrl);

        // Получаем данные из коллекции 'diary'
        const records = await pb.collection('diary').getFullList({
            sort: '-created',
        });

        const container = document.getElementById('diary-content');
        if (container) {
            container.innerHTML = records.map(record => `
                <div class="entry">
                    <h3>${record.title || 'Pealkiri'}</h3>
                    <p>${record.content || 'Sisu puudub'}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Viga:", error);
    }
}

loadDiary();
