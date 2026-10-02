/**
 * Cyvexis Cybersecurity Training Platform
 * Module 04: Social Engineering Beyond Email (Smishing, Quishing & Deepfakes)
 * Engine: Interactive Threat Simulators, 6-Question Assessment HUD, & 2D Canvas Verified Certificate
 */

// Global User Fallback Helpers
const getAuthenticatedUserName = () => {
  if (typeof window.userName !== 'undefined' && window.userName) {
    return window.userName;
  }
  if (typeof window.currentUser !== 'undefined' && window.currentUser && window.currentUser.fullName) {
    return window.currentUser.fullName;
  }
  return 'Student';
};

/* ==========================================================================
   1. QUIZ DATA SPECIFICATION (6 Questions - Minimum 5/6 or 80% to Pass)
   ========================================================================== */
const QUIZ_DATA = [
  {
    id: 1,
    question: "An employee receives an urgent SMS from a shortcode claiming a package delivery failed due to unpaid customs clearance. What is the safest immediate action?",
    options: [
      "Click the link to verify the tracking number.",
      "Reply 'STOP' to opt out of future updates.",
      "Navigate independently to the courier service website to check tracking status.",
      "Forward the SMS to personal contacts to see if they received it."
    ],
    correctIndex: 2,
    explanation: "Navigating independently through an official URL prevents visiting malicious credential-harvesting or malware sites."
  },
  {
    id: 2,
    question: "Why do cyber adversaries increasingly leverage malicious QR codes (quishing) within enterprise environments?",
    options: [
      "QR codes permanently disable mobile operating systems upon contact.",
      "They evade detection mechanisms configured on traditional secure email gateways.",
      "They automatically install rootkits without requiring user interaction.",
      "QR codes can bypass network firewalls without connecting to DNS."
    ],
    correctIndex: 1,
    explanation: "Because QR codes are delivered as images, legacy text-based email security filters frequently miss the embedded URL."
  },
  {
    id: 3,
    question: "An IT technician receives an urgent call from someone claiming to be an executive who needs a hardware token reset while traveling. Which step confirms the caller's identity?",
    options: [
      "Trust the caller if their phone number matches caller ID.",
      "Ask the caller to read back their corporate email address.",
      "Call the employee back on an internally established phone extension from the corporate directory.",
      "Immediately issue a temporary one-time password to prevent business disruption."
    ],
    correctIndex: 2,
    explanation: "Caller ID is easily spoofed. Performing an out-of-band callback using the pre-established internal directory ensures authentic identity verification."
  },
  {
    id: 4,
    question: "Which auditory anomaly is most characteristic of real-time synthetic voice cloning during an unexpected phone conversation?",
    options: [
      "Abrupt latency spikes during interruptions combined with unnatural prosodic inflections.",
      "Loud static white noise throughout the entirety of the call.",
      "Frequent echo caused by speakerphone hardware feedback.",
      "Instantaneous, human-like voice inflection changes without pause."
    ],
    correctIndex: 0,
    explanation: "Real-time AI voice generation struggles with natural vocal flow and often experiences latency delays when interrupted."
  },
  {
    id: 5,
    question: "A physical inspection reveals an adhesive sticker bearing a QR code affixed over the payment scanner at an offsite venue. What is the appropriate protocol?",
    options: [
      "Scan the code using an incognito mobile browser session.",
      "Refrain from scanning the code and notify the venue management immediately.",
      "Peel off the sticker and scan it on a personal device to inspect the URL.",
      "Proceed with payment if the landing page looks identical to the venue's branding."
    ],
    correctIndex: 1,
    explanation: "Physical sticker overlays are a primary physical quishing vector. Never scan tampered codes."
  },
  {
    id: 6,
    question: "Which organizational policy provides the strongest resilience against deepfake-facilitated wire transfer fraud?",
    options: [
      "Mandatory dual-authorization with secondary verbal confirmation via pre-established directories.",
      "Restricting high-value payment requests exclusively to SMS.",
      "Requiring the caller to send a voice note confirmation on WhatsApp.",
      "Allowing verbal approval if the caller mentions internal project codenames."
    ],
    correctIndex: 0,
    explanation: "Separation of duties (dual-authorization) and verified out-of-band verbal confirmation neutralize single-point human compromise."
  }
];

const PASSING_SCORE = 5; // Minimum 5 out of 6 (83.3% >= 80%)

let score = 0;
const answeredQuestions = new Set();
let quizCompleted = false;
let quizPassed = false;
window.module4QuizPassed = false;

/* ==========================================================================
   2. SIMULATOR TAB SWITCHING LOGIC
   ========================================================================== */
function switchSimTab(tabId) {
  const tabs = document.querySelectorAll('.sim-tab-btn');
  const panels = document.querySelectorAll('.sim-tab-panel');

  tabs.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  panels.forEach(panel => {
    if (panel.id === `tab-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}
window.switchSimTab = switchSimTab;

/* ==========================================================================
   3. INTERACTIVE QUIZ ENGINE
   ========================================================================== */
function checkAnswer(qId, selectedIndex, buttonEl) {
  if (answeredQuestions.has(qId)) return;

  answeredQuestions.add(qId);
  const qData = QUIZ_DATA.find(q => q.id === qId);
  if (!qData) return;

  const card = document.getElementById(`qCard${qId}`);
  const fb = document.getElementById(`fb${qId}`);
  const statusBadge = document.getElementById(`status${qId}`);
  const allButtons = card ? card.querySelectorAll('.opt-btn') : [];

  const isCorrect = (selectedIndex === qData.correctIndex);

  // Disable all buttons in this question card
  allButtons.forEach(btn => {
    btn.disabled = true;
  });

  if (isCorrect) {
    score++;
    buttonEl.classList.add('correct');
    if (card) {
      card.classList.add('answered-correct');
    }
    if (statusBadge) {
      statusBadge.textContent = 'VERIFIED';
      statusBadge.className = 'status-indicator correct';
    }
    if (fb) {
      fb.className = 'feedback-msg correct';
      fb.innerHTML = `<strong>✓ Correct:</strong> ${qData.explanation}`;
      fb.style.display = 'block';
    }
  } else {
    buttonEl.classList.add('wrong');
    // Highlight the correct answer
    if (allButtons[qData.correctIndex]) {
      allButtons[qData.correctIndex].classList.add('correct');
    }
    if (card) {
      card.classList.add('answered-wrong');
    }
    if (statusBadge) {
      statusBadge.textContent = 'DEFICIENT';
      statusBadge.className = 'status-indicator wrong';
    }
    if (fb) {
      fb.className = 'feedback-msg wrong';
      fb.innerHTML = `<strong>✗ Incorrect:</strong> ${qData.explanation}`;
      fb.style.display = 'block';
    }
  }

  updateScoreDisplay();

  // If all 6 questions have been answered, evaluate completion
  if (answeredQuestions.size === QUIZ_DATA.length) {
    quizCompleted = true;
    quizPassed = (score >= PASSING_SCORE);
    window.module4QuizPassed = quizPassed;
    showTriageResults();
  }
}
window.checkAnswer = checkAnswer;

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay');
  if (!scoreDisplay) return;

  scoreDisplay.textContent = `Score: ${score} / ${QUIZ_DATA.length} Resolved`;

  if (score >= PASSING_SCORE) {
    scoreDisplay.classList.add('complete');
  } else {
    scoreDisplay.classList.remove('complete');
  }
}

function showTriageResults() {
  const resultsCard = document.getElementById('triageResultsCard');
  if (!resultsCard) return;

  const percentage = Math.round((score / QUIZ_DATA.length) * 100);

  if (quizPassed) {
    resultsCard.innerHTML = `
      <div class="result-trophy">🏆</div>
      <h3 class="result-title" style="color: #10b981;">Assessment Certified: ${score} / ${QUIZ_DATA.length} (${percentage}%)</h3>
      <p class="result-desc">
        Congratulations! You successfully surpassed the <strong>80% passing threshold</strong> (minimum 5 of 6 correct) on Multi-Channel Social Engineering, Quishing & Deepfake defense. Your verified Cyvexis credential has been unlocked below.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="#certificateSection" class="btn-retake" style="background: linear-gradient(135deg, #10b981, #059669); border: none; text-decoration: none;">
          Claim Certificate Below ↓
        </a>
        <button type="button" class="btn-retake" onclick="resetQuiz()">
          🔄 Retake Assessment
        </button>
      </div>
    `;
  } else {
    resultsCard.innerHTML = `
      <div class="result-trophy">⚠️</div>
      <h3 class="result-title" style="color: #ef4444;">Passing Threshold Not Met: ${score} / ${QUIZ_DATA.length} (${percentage}%)</h3>
      <p class="result-desc">
        You scored <strong>${score} out of 6</strong> (${percentage}%). Cyvexis requires at least <strong>80% (5 out of 6 correct)</strong> to qualify for your official verified certificate. Please review the threat landscape lessons above and retake the assessment.
      </p>
      <button type="button" class="btn-retake" onclick="resetQuiz()" style="background: linear-gradient(135deg, #ef4444, #b91c1c); border: none;">
        🔄 Retake Threat Assessment
      </button>
    `;
  }

  resultsCard.style.display = 'block';
  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  updateCertificateCardState();
}

function updateCertificateCardState() {
  const certBadge = document.getElementById('certBadge');
  const certDesc = document.getElementById('certDesc');
  const studentNameInput = document.getElementById('studentName');
  const generateBtn = document.getElementById('generateBtn');
  const certLockNotice = document.getElementById('certLockNotice');

  if (quizPassed) {
    if (certBadge) {
      certBadge.textContent = `🎉 CERTIFICATE UNLOCKED (Passed: ${score}/${QUIZ_DATA.length})`;
      certBadge.className = 'cert-badge unlocked';
    }
    if (certDesc) {
      certDesc.textContent = 'Enter the name you would like displayed on your official Cyvexis verified defense record:';
    }
    if (studentNameInput) {
      studentNameInput.disabled = false;
      // Pre-fill with authenticated user name if field is empty
      if (!studentNameInput.value.trim()) {
        studentNameInput.value = getAuthenticatedUserName();
      }
    }
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
      generateBtn.style.cursor = 'pointer';
    }
    if (certLockNotice) {
      certLockNotice.style.display = 'none';
    }
  } else {
    if (certBadge) {
      certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 80% (5/6) REQUIRED';
      certBadge.className = 'cert-badge';
    }
    if (certDesc) {
      certDesc.innerHTML = `<span style="color: #f87171;">Complete all 6 threat evaluation questions above with at least 80% (5/6) correct to unlock your official verified certificate.</span>`;
    }
    if (studentNameInput) {
      studentNameInput.disabled = true;
    }
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.5';
      generateBtn.style.cursor = 'not-allowed';
    }
    if (certLockNotice) {
      certLockNotice.style.display = 'block';
      certLockNotice.innerHTML = `❌ Certificate locked. Score at least 5 out of 6 (80%) on the assessment to unlock.`;
      certLockNotice.style.color = '#ef4444';
    }
  }
}

function resetQuiz() {
  score = 0;
  answeredQuestions.clear();
  quizCompleted = false;
  quizPassed = false;
  window.module4QuizPassed = false;
  updateScoreDisplay();

  const resultsCard = document.getElementById('triageResultsCard');
  if (resultsCard) resultsCard.style.display = 'none';

  for (let i = 1; i <= QUIZ_DATA.length; i++) {
    const card = document.getElementById(`qCard${i}`);
    if (card) {
      card.classList.remove('answered-correct', 'answered-wrong');
      const buttons = card.querySelectorAll('.opt-btn');
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
      });
      const fb = document.getElementById(`fb${i}`);
      if (fb) {
        fb.style.display = 'none';
        fb.innerHTML = '';
      }
      const statusBadge = document.getElementById(`status${i}`);
      if (statusBadge) {
        statusBadge.textContent = 'PENDING';
        statusBadge.className = 'status-indicator';
      }
    }
  }

  const certBadge = document.getElementById('certBadge');
  const certDesc = document.getElementById('certDesc');
  const studentNameInput = document.getElementById('studentName');
  const generateBtn = document.getElementById('generateBtn');
  const certLockNotice = document.getElementById('certLockNotice');

  if (certBadge) {
    certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 80% (5/6) REQUIRED';
    certBadge.className = 'cert-badge';
  }
  if (certDesc) {
    certDesc.textContent = 'Complete all 6 threat evaluation questions above with at least 80% (5/6) correct to unlock your official verified certificate.';
  }
  if (studentNameInput) studentNameInput.disabled = true;
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.5';
    generateBtn.style.cursor = 'not-allowed';
  }
  if (certLockNotice) {
    certLockNotice.style.display = 'block';
    certLockNotice.textContent = '⚠️ Complete all 6 threat evaluation questions above to unlock download access.';
    certLockNotice.style.color = '#f59e0b';
  }

  const firstCard = document.getElementById('quizSection');
  if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });
}
window.resetQuiz = resetQuiz;

/* ==========================================================================
   4. VERIFIED CERTIFICATE GENERATOR (2048 x 1142 HTML5 Canvas)
   ========================================================================== */
const MODULE4_CONFIG = {
  code: 'M04',
  filePrefix: 'Module4',
  title: 'Module 4: Social Engineering Beyond Email & Deepfakes',
  descLine1: 'An intensive cybersecurity training module covering smishing triage, quishing countermeasures,',
  descLine2: 'synthetic voice cloning detection, and out-of-band verification protocols.'
};

function generateCertificate() {
  if (answeredQuestions.size < QUIZ_DATA.length) {
    alert('Please complete all 6 Threat Evaluation questions before generating your certificate.');
    const quizSec = document.getElementById('quizSection');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (score < PASSING_SCORE) {
    alert(`Certificate Locked: You scored ${score} / 6. You must achieve at least 80% (minimum 5 out of 6 correct) to unlock and download your certificate. Please click 'Retake Threat Assessment' to try again.`);
    const quizSec = document.getElementById('quizSection');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const nameInput = document.getElementById('studentName');
  const enteredName = nameInput ? nameInput.value.trim() : '';
  const authName = getAuthenticatedUserName();
  const studentName = enteredName || authName || 'Student';

  if (!studentName) {
    alert('Please enter your full name to generate your verified Cyvexis certificate.');
    if (nameInput) nameInput.focus();
    return;
  }

  const canvas = document.getElementById('certCanvas');
  if (!canvas) {
    console.error('Certificate canvas element #certCanvas not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const btn = document.getElementById('generateBtn');
  const originalBtnText = btn ? btn.innerHTML : 'Download Certificate';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Rendering Certificate...</span>';
  }

  const templateImg = new Image();
  templateImg.crossOrigin = 'anonymous';

  templateImg.onload = function() {
    canvas.width = 2048;
    canvas.height = 1142;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0, 2048, 1142);

    const centerX = 1024;
    const navyColor = '#0c1b33';
    const descColor = '#1e293b';

    // 1. Recipient Full Name (bold serif in deep navy)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = navyColor;
    let nameFontSize = 50;
    ctx.font = `bold ${nameFontSize}px Georgia, "Times New Roman", serif`;
    while (ctx.measureText(studentName.toUpperCase()).width > 1200 && nameFontSize > 28) {
      nameFontSize -= 2;
      ctx.font = `bold ${nameFontSize}px Georgia, "Times New Roman", serif`;
    }
    ctx.fillText(studentName.toUpperCase(), centerX, 542);

    // 2. Course Title (bold serif)
    ctx.fillStyle = navyColor;
    ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE4_CONFIG.title, centerX, 684);

    // 3. Module Description (italic serif)
    ctx.fillStyle = descColor;
    ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE4_CONFIG.descLine1, centerX, 752);
    if (MODULE4_CONFIG.descLine2) {
      ctx.fillText(MODULE4_CONFIG.descLine2, centerX, 788);
    }

    // 4. Date & ID
    const today = new Date();
    const formattedDate = `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `ID: CYV-${today.getFullYear()}-${MODULE4_CONFIG.code}-${randomSuffix}`;

    ctx.font = '500 25px "Courier New", Consolas, monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText(formattedDate, 760, 960);
    ctx.fillText(certId, 1220, 960);

    setTimeout(() => {
      const cleanName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Cyvexis_Module4_Certificate_${cleanName}.png`;
      const dataUrl = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }, 200);
  };

  templateImg.onerror = function() {
    alert("Could not load certificate template. Please refresh and try again.");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  };

  templateImg.src = 'certificate-template.png';
}
window.generateCertificate = generateCertificate;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateScoreDisplay();

  const studentNameInput = document.getElementById('studentName');
  if (studentNameInput) {
    const authName = getAuthenticatedUserName();
    if (authName && authName !== 'Student') {
      studentNameInput.value = authName;
    }

    studentNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !studentNameInput.disabled) {
        e.preventDefault();
        generateCertificate();
      }
    });
  }
});
