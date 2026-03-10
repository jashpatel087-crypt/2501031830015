$(document).ready(function () {

    // --- Master Quiz Data (15 Questions) ---
    const allQuestions = [
        // Ancient Egypt
        { question: "Which pharaoh's tomb was discovered nearly intact in 1922?", options: ["Ramses II", "Tutankhamun", "Akhenaten", "Thutmose III"], correct: 1 },
        { question: "What was the primary purpose of the Great Pyramids of Giza?", options: ["Grain Storage", "Royal Palaces", "Royal Tombs", "Astronomical Observatories"], correct: 2 },
        { question: "Which process was used to preserve bodies in Ancient Egypt?", options: ["Mummification", "Crystallization", "Embalming", "Taxidermy"], correct: 0 },
        { question: "Who was the last active ruler of the Ptolemaic Kingdom of Egypt?", options: ["Nefertiti", "Cleopatra VII", "Hatshepsut", "Isis"], correct: 1 },
        { question: "What form of writing used picture symbols in Ancient Egypt?", options: ["Cuneiform", "Linear B", "Hieroglyphics", "Demotic"], correct: 2 },
        // Medieval Europe
        { question: "The 'Black Death' pandemic was primarily caused by which bacteria?", options: ["Yersinia pestis", "Salmonella", "E. coli", "Variola virus"], correct: 0 },
        { question: "Which agreement signed in 1215 limited the power of the English King?", options: ["Bill of Rights", "Magna Carta", "Treaty of Versailles", "Declaration of Arbroath"], correct: 1 },
        { question: "What was the code of conduct followed by knights called?", options: ["The Knight's Law", "Bushido", "Chivalry", "The Iron Rule"], correct: 2 },
        { question: "Who was the French heroine who led troops during the Hundred Years' War?", options: ["Eleanor of Aquitaine", "Joan of Arc", "Catherine de' Medici", "Marie Antoinette"], correct: 1 },
        { question: "Which city was the capital of the Byzantine Empire?", options: ["Rome", "Alexandria", "Constantinople", "Athens"], correct: 2 },
        // Industrial Age
        { question: "Who is credited with inventing the first practical steam engine?", options: ["James Watt", "Thomas Edison", "Isaac Newton", "Alexander Graham Bell"], correct: 0 },
        { question: "In which country did the Industrial Revolution begin?", options: ["France", "USA", "Germany", "Great Britain"], correct: 3 },
        { question: "The 'Spinning Jenny' was an invention in which industry?", options: ["Coal Mining", "Textiles", "Transportation", "Agriculture"], correct: 1 },
        { question: "What was the main source of power during the early Industrial Revolution?", options: ["Electricity", "Oil", "Coal/Steam", "Natural Gas"], correct: 2 },
        { question: "What term describes the mass movement of people from rural areas to cities?", options: ["Suburbanization", "Migration", "Urbanization", "Colonization"], correct: 2 }
    ];

    // --- State Variables ---
    let userAnswers = new Array(allQuestions.length).fill(null);
    let currentUser = {
        name: '',
        class: '',
        branch: '',
        history: []
    };

    // --- Boot Sequence ---
    function runBootSequence() {
        console.log("Starting Boot Sequence...");
        let progress = 0;
        $('#boot-bar').css('width', '0%');
        $('#start-btn').addClass('d-none'); // Hide if retrying

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 3;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                $('#boot-status').text('TEMPORAL MATRIX LOADED');
                $('#start-btn').removeClass('d-none').hide().fadeIn();
            }
            $('#boot-bar').css('width', progress + '%');
            updateBootStatus(progress);
        }, 100);
    }

    function updateBootStatus(p) {
        if (p < 30) $('#boot-status').text('Opening Data Portals...');
        else if (p < 60) $('#boot-status').text('Fetching Chrono-Data...');
        else if (p < 90) $('#boot-status').text('Stabilizing Time Loops...');
    }

    // --- Initialization ---
    $(document).on('click', '#auth-btn', function (e) {
        console.log("Auth button clicked via delegetion");

        const uName = $('#input-username').val();
        const uClass = $('#input-class').val();
        const uBranch = $('#input-branch').val();

        if (!uName || !uClass || !uBranch) {
            alert("MATRIX_ERROR: All credentials required.");
            return;
        }

        currentUser.name = uName;
        currentUser.class = uClass;
        currentUser.branch = uBranch;

        // Update profile UI
        $('#prof-name').text(currentUser.name);
        $('#prof-class').text(currentUser.class);
        $('#prof-branch').text(currentUser.branch);

        // Transition
        switchScreen('user-info-screen', 'boot-screen');
        runBootSequence();
    });

    $('#start-btn').off('click').click(function () {
        renderAllQuestions();
        switchScreen('boot-screen', 'quiz-screen');
    });

    function renderAllQuestions() {
        const list = $('#all-questions-list');
        list.empty();

        allQuestions.forEach((q, qIdx) => {
            let optionsHtml = '';
            q.options.forEach((opt, oIdx) => {
                optionsHtml += `
                    <div class="col-12 mb-1">
                        <button class="option-btn p-1 small-text" style="font-size: 0.65rem; line-height: 1" data-qidx="${qIdx}" data-oidx="${oIdx}">
                            ${opt}
                        </button>
                    </div>
                `;
            });

            list.append(`
                <div id="node-${qIdx}" class="col-grid-5 mb-2">
                    <div class="quiz-box glass-panel p-2 h-100" style="border-radius: 5px;">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                             <span class="badge bg-cyan text-dark" style="font-size: 0.5rem; padding: 2px 4px;">#${qIdx + 1}</span>
                             <span class="text-white-50" style="font-size: 0.5rem">${qIdx < 5 ? 'Ancient' : (qIdx < 10 ? 'Medieval' : 'Industrial')}</span>
                        </div>
                        <h6 class="text-white mb-1" style="font-size: 0.75rem; line-height: 1.2;">${q.question}</h6>
                        <div class="row g-1">
                            ${optionsHtml}
                        </div>
                    </div>
                </div>
            `);
        });
    }



    // --- Selection Logic ---
    $(document).on('click', '.option-btn', function () {
        const qIdx = $(this).data('qidx');
        const oIdx = $(this).data('oidx');

        // Unselect others in same question
        $(`.option-btn[data-qidx="${qIdx}"]`).removeClass('selected');
        // Select this one
        $(this).addClass('selected');

        userAnswers[qIdx] = oIdx;
        updateIntegrityStatus();
    });

    function updateIntegrityStatus() {
        const answeredCount = userAnswers.filter(a => a !== null).length;
        const total = allQuestions.length;
        $('#score-val').text(`${answeredCount}/${total} SYNCED`);

        if (answeredCount === total) {
            $('#score-val').addClass('text-cyan').removeClass('text-magenta');
        }
    }

    // --- Final Submission ---
    $('#submit-quiz-btn').click(function () {
        const unanswered = userAnswers.indexOf(null);
        if (unanswered !== -1) {
            // Scroll to first unanswered item HORIZONTALLY
            const list = $('#all-questions-list');
            const target = $(`#node-${unanswered}`);

            const scrollPos = target.position().left + list.scrollLeft() - 20;

            list.animate({
                scrollLeft: scrollPos
            }, 600);

            // Visual pulse on missing item
            target.find('.quiz-box').addClass('border-danger-pulse');
            setTimeout(() => target.find('.quiz-box').removeClass('border-danger-pulse'), 1000);
            return;
        }

        calculateAndShowResults();
    });

    function calculateAndShowResults() {
        let correctCount = 0;
        let eraScores = { ancient: 0, medieval: 0, industrial: 0 };

        allQuestions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct) {
                correctCount++;
                if (idx < 5) eraScores.ancient++;
                else if (idx < 10) eraScores.medieval++;
                else eraScores.industrial++;
            }
        });

        const percent = Math.round((correctCount / allQuestions.length) * 100);
        $('#final-score').text(percent + '%');

        // Update Era Integrity Bars
        const ancientPct = (eraScores.ancient / 5) * 100;
        const medievalPct = (eraScores.medieval / 5) * 100;
        const industrialPct = (eraScores.industrial / 5) * 100;

        $('#result-screen .progress-bar').eq(0).css('width', ancientPct + '%');
        $('#result-screen .progress-bar').eq(1).css('width', medievalPct + '%');
        $('#result-screen .progress-bar').eq(2).css('width', industrialPct + '%');

        // Update labels based on score
        const getStatus = (p) => p === 100 ? 'OPTIMIZED' : (p >= 60 ? 'STABILIZED' : 'DRIFTED');
        $('#result-screen .text-cyan, #result-screen .text-magenta').eq(1).text(getStatus(ancientPct));
        $('#result-screen .text-cyan, #result-screen .text-magenta').eq(2).text(getStatus(medievalPct));
        $('#result-screen .text-cyan, #result-screen .text-magenta').eq(3).text(getStatus(industrialPct));

        // Add to history
        const session = {
            id: 'SYNC_' + Math.floor(Math.random() * 9000 + 1000),
            score: percent + '%',
            status: percent >= 80 ? 'STABLE' : 'DRIFTED'
        };
        currentUser.history.push(session);
        updateHistoryUI();
        $('#prof-accuracy-bar').css('width', percent + '%');

        // Save to Global Logs for Admin Panel
        saveSyncToGlobalLogs({
            name: currentUser.name,
            class: currentUser.class,
            branch: currentUser.branch,
            score: percent + '%',
            status: session.status
        });

        if (percent >= 80) {
            $('#result-title').text('TIMELINE STABILIZED').addClass('text-cyan').removeClass('text-magenta');
            $('#result-text').text('Matrix integrity restored. All temporal nodes unified.');
            $('.stat-circle').css('border-color', 'var(--cyan)').css('box-shadow', '0 0 30px var(--cyan)');
        } else {
            $('#result-title').text('PARTIAL SYNC').addClass('text-magenta').removeClass('text-cyan');
            $('#result-text').text('Significant temporal drift remains. Re-synchronization recommended.');
            $('.stat-circle').css('border-color', 'var(--magenta)').css('box-shadow', '0 0 30px var(--magenta)');
        }

        switchScreen('quiz-screen', 'result-screen');
    }

    function updateHistoryUI() {
        const body = $('#user-score-history');
        body.empty();
        currentUser.history.forEach(h => {
            body.append(`
                <tr>
                    <td>${h.id}</td>
                    <td>${h.score}</td>
                    <td><span class="badge ${h.status === 'STABLE' ? 'bg-success' : 'bg-danger'}">${h.status}</span></td>
                </tr>
            `);
        });
    }

    $('#view-score-btn').click(function () {
        switchScreen('result-screen', 'score-screen');
    });

    $('#restart-btn').click(function () {
        userAnswers = new Array(allQuestions.length).fill(null);
        $('#score-val').text('READY').removeClass('text-cyan').addClass('text-magenta');
        switchScreen('result-screen', 'boot-screen');
        runBootSequence();
    });

    // --- Start ---
    // runBootSequence(); // Moved to after user info setup
});

// Global switchScreen function for screen transitions
function switchScreen(from, to) {
    console.log(`EXE_SWITCH: ${from} -> ${to}`);
    const fromEl = $(`#${from}`);
    const toEl = $(`#${to}`);

    if (fromEl.length === 0 || toEl.length === 0) {
        console.error(`ERROR: Node ${from} or ${to} missing.`);
        return;
    }

    // Direct switch with fade support
    fromEl.fadeOut(300, function () {
        fromEl.addClass('d-none').css('display', '');

        // Remove d-none first
        toEl.removeClass('d-none');

        // Ensure flex for centered screens
        if (to === 'boot-screen' || to === 'user-info-screen' || to === 'result-screen') {
            toEl.css('display', 'flex').hide().fadeIn(300);
        } else {
            toEl.hide().fadeIn(300);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Persist data for Admin Panel
function saveSyncToGlobalLogs(data) {
    let logs = JSON.parse(localStorage.getItem('globalSyncLogs')) || [];
    logs.unshift(data); // Add to beginning
    if (logs.length > 10) logs.pop(); // Keep only last 10
    localStorage.setItem('globalSyncLogs', JSON.stringify(logs));
}
