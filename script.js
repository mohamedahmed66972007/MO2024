const toggleButton = document.getElementById("toggleBtn");
const resultDiv = document.getElementById("result");
const timerDisplay = document.getElementById("timer");

let isRecording = false;
let recognition;
let timerInterval;
let seconds = 0;
let finalTranscript = ""; // متغير لتخزين النص النهائي

function startTimer() {
    seconds = 0; // Reset seconds if needed
    timerDisplay.textContent = "00:00"; // Reset display
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}


if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ar-SA"; // تعيين اللغة إلى العربية

    recognition.onstart = () => {
        isRecording = true;
        toggleButton.textContent = "إيقاف التسجيل"; // تغيير النص إلى "إيقاف التسجيل"
        startTimer(); // بدء العد التنازلي
    };

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + " "; // دمج النصوص النهائية
            }
        }
        resultDiv.innerHTML = finalTranscript; // عرض النص النهائي
    };

    recognition.onend = () => {
        isRecording = false;
        toggleButton.textContent = "ابدأ التسجيل"; // تغيير النص إلى "ابدأ التسجيل"
        // لا يتم إعادة تعيين المؤقت هنا
    };

    toggleButton.addEventListener("click", () => {
        if (isRecording) {
            recognition.stop();
        } else {
            // إذا بدأنا التسجيل مرة أخرى، نعيد تعيين الثواني والنص النهائي
            finalTranscript = ""; // إعادة تعيين النص النهائي
            resultDiv.innerHTML = ""; // مسح النص المعروض
            recognition.start();
        }
    });
}
