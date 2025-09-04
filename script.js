document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const thinkingIndicator = document.getElementById('thinking-indicator');
    const thoughtProcess = document.getElementById('thought-process');
    const thoughtContent = document.getElementById('thought-content');
    const thoughtTimer = document.getElementById('thought-timer');
    const errorMessage = document.getElementById('error-message');
    
    // API Keys (dalam produksi nyata, ini harus disimpan di backend yang aman)
    const CHATGPT_API_KEY = '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';
    const GEMINI_API_KEY = 'AIzaSyAg1ahiWIFCutnF24YAyxgT_-mRvPM4fMA';
    
    // Tambahkan pesan ke chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Tampilkan error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    // Tampilkan proses berpikir
    function showThoughtProcess(steps, duration) {
        thoughtContent.innerHTML = '';
        thoughtProcess.style.display = 'block';
        
        let seconds = 0;
        const timerInterval = setInterval(() => {
            seconds++;
            thoughtTimer.textContent = `${seconds}s`;
        }, 1000);
        
        // Animasi untuk menampilkan proses berpikir langkah demi langkah
        steps.forEach((step, index) => {
            setTimeout(() => {
                const stepElement = document.createElement('div');
                stepElement.classList.add('thought-step');
                stepElement.textContent = step;
                thoughtContent.appendChild(stepElement);
                thoughtProcess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, (duration * 1000 / steps.length) * index);
        });
        
        // Hentikan timer setelah selesai
        setTimeout(() => {
            clearInterval(timerInterval);
        }, duration * 1000);
        
        return duration * 1000;
    }
    
    // Sembunyikan proses berpikir
    function hideThoughtProcess() {
        thoughtProcess.style.display = 'none';
    }
    
    // Generate proses berpikir berdasarkan input pengguna
    function generateThoughtProcess(message) {
        const thoughtSteps = [];
        
        // Analisis pesan pengguna
        thoughtSteps.push(`Menganalisis klaim: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`);
        
        // Identifikasi asumsi
        thoughtSteps.push("Mengidentifikasi asumsi dan premis tersembunyi dalam argumen");
        
        // Cari bias kognitif
        thoughtSteps.push("Memeriksa kemungkinan bias kognitif (konfirmasi, seleksi data, dll.)");
        
        // Bangun kontra-argumen
        thoughtSteps.push("Membangun kontra-argumen dari perspektif alternatif");
        
        // Uji konsistensi logika
        thoughtSteps.push("Menguji konsistensi logika dan mendeteksi kesalahan penalaran");
        
        // Siapkan perspektif alternatif
        thoughtSteps.push("Mempersiapkan perspektif alternatif dari berbagai disiplin ilmu");
        
        // Kalibrasi bukti
        thoughtSteps.push("Mengkalibrasi kekuatan bukti yang disajikan");
        
        // Formulasi respons
        thoughtSteps.push("Merumuskan respons analitis yang konstruktif");
        
        return thoughtSteps;
    }
    
    // Kirim pesan ke AI
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Tambahkan pesan pengguna ke chat
        addMessage(message, true);
        userInput.value = '';
        
        // Tampilkan indikator berpikir
        thinkingIndicator.style.display = 'flex';
        
        try {
            // Generate dan tampilkan proses berpikir
            const thoughtSteps = generateThoughtProcess(message);
            const thoughtDuration = 5 + Math.floor(Math.random() * 5); // 5-10 seconds
            const processTime = showThoughtProcess(thoughtSteps, thoughtDuration);
            
            // Tunggu proses berpikir selesai sebelum memanggil API
            setTimeout(async () => {
                // Coba gunakan Gemini API terlebih dahulu
                let response = await queryGeminiAPI(message);
                
                // Jika Gemini gagal, coba ChatGPT
                if (!response || response.error) {
                    response = await queryChatGPTAPI(message);
                }
                
                // Sembunyikan indikator berpikir dan proses berpikir
                thinkingIndicator.style.display = 'none';
                hideThoughtProcess();
                
                // Tambahkan respons AI ke chat
                if (response && response.text) {
                    addMessage(response.text);
                } else {
                    throw new Error('Tidak ada respons dari AI');
                }
            }, processTime);
        } catch (error) {
            thinkingIndicator.style.display = 'none';
            hideThoughtProcess();
            showError('Error: ' + error.message);
            addMessage('Maaf, saya mengalami kesalahan teknis. Bisakah Anda mencoba lagi atau merumuskan ulang pertanyaannya?');
        }
    }
    
    // Query Gemini API
    async function queryGeminiAPI(message) {
        try {
            // Implementasi query ke Gemini API
            // Catatan: Implementasi aktual akan membutuhkan endpoint yang benar dan format data
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Anda adalah mitra adu gagasan yang ketat, analitis, dan jujur. Tugas Anda adalah membantu pengguna mencapai pemikiran yang lebih jernih, kokoh, dan bebas bias — meski itu berarti menantang mereka keras.
                            
                            Instruksi untuk menanggapi:
                            1. Uraikan asumsi pengguna. Identifikasi hal-hal yang dianggap benar padahal masih bisa dipertanyakan.
                            2. Bangun kontra-argumen yang kuat dari sudut pandang berbeda.
                            3. Uji konsistensi logika dan identifikasi kemungkinan kesalahan logika.
                            4. Tawarkan perspektif alternatif dari kacamata sejarah, sains, etika, psikologi, atau teori relevan.
                            5. Prioritaskan kebenaran di atas kesepakatan.
                            6. Deteksi bias kognitif dan usulkan cara mengatasinya.
                            7. Kalibrasi kekuatan bukti yang disajikan pengguna.
                            8. Ajukan pertanyaan reflektif atau provokatif.
                            
                            Pesan pengguna: ${message}
                            
                            Berikan respons analitis yang ketat dan konstruktif:`
                        }]
                    }]
                })
            });
            
            const data = await response.json();
            return { text: data.candidates[0].content.parts[0].text };
        } catch (error) {
            console.error('Gemini API Error:', error);
            return { error: error.message };
        }
    }
    
    // Query ChatGPT API
    async function queryChatGPTAPI(message) {
        try {
            // Implementasi query ke ChatGPT API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CHATGPT_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `Anda adalah GemGPT, mitra adu gagasan yang ketat, analitis, dan jujur. Tugas Anda adalah membantu pengguna mencapai pemikiran yang lebih jernih, kokoh, dan bebas bias — meski itu berarti menantang mereka keras.

                            Setiap kali pengguna menyampaikan ide atau klaim, lakukan hal berikut:
                            1. Uraikan asumsi pengguna. Identifikasi hal-hal yang dianggap benar padahal masih bisa dipertanyakan. Bedakan antara fakta, interpretasi, dan spekulasi.
                            2. Bangun kontra-argumen. Sajikan apa yang mungkin dikatakan oleh seorang kritikus cerdas atau pakar dari sudut pandang berbeda.
                            3. Uji konsistensi logis. Periksa apakah alur penalaran tahan banting dan identifikasi kemungkinan kesalahan logika.
                            4. Tawarkan perspektif alternatif dari kacamata sejarah, sains, etika, psikologi, atau teori relevan.
                            5. Prioritaskan kebenaran di atas kesepakatan. Jika pengguna keliru, katakan dengan jelas dan berikan alasan.
                            6. Deteksi bias kognitif (konfirmasi, motivasi, seleksi data, dsb.) dan usulkan cara mengatasinya.
                            7. Kalibrasi kekuatan bukti. Tunjukkan apakah klaim didukung oleh bukti yang lemah, anekdot, atau spekulasi.
                            8. Ajukan pertanyaan reflektif atau provokatif yang memaksa pengguna memperkuat, memperjelas, atau merevisi argumen.

                            Gaya balasan:
                            - Tegas tapi konstruktif
                            - Analitis, bukan normatif
                            - Hindari jawaban dangkal atau sekadar ringkasan
                            - Gunakan contoh konkret atau analogi bila membantu memperjelas
                            - Jika ada ketidakpastian, sebutkan dengan jujur`
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            const data = await response.json();
            return { text: data.choices[0].message.content };
        } catch (error) {
            console.error('ChatGPT API Error:', error);
            return { error: error.message };
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
