/**
 * Cyvexis Phishing Awareness & Interactive Quiz
 * Clean, lightweight, reliable logic without deprecated modules
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuizGame();
  initEmbedModal();
  
  const studentInput = document.getElementById('studentName');
  if (studentInput) {
    studentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        generateCertificate();
      }
    });
  }
});

/* ==========================================================================
   THE 5 PHISHING AWARENESS QUIZ QUESTIONS
   ========================================================================== */
function initQuizGame() {
  const questions = [
    {
      context: "Question 1: URL Structure Inspection",
      question: "Look at this link: https://accounts.google.com.user-verify.net/reset. Who actually controls this website?",
      highlight: "https://accounts.google.com.user-verify.net/reset",
      options: [
        { text: "Google (because 'accounts.google.com' is at the start)", correct: false },
        { text: "user-verify.net (an external third-party/attacker domain)", correct: true },
        { text: "The user's Internet Service Provider", correct: false },
        { text: "A certified Google security partner", correct: false }
      ],
      explanation: "🚨 The root domain is 'user-verify.net'! In web addresses, the actual owner is determined by the letters immediately before the final extension. 'accounts.google.com' is merely a fake subdomain created by the attacker to deceive you."
    },
    {
      context: "Question 2: Psychological Traps",
      question: "An email claims: 'Your payroll direct deposit failed. Click here within 60 minutes or your funds will be forfeited.' Why is this urgency dangerous?",
      highlight: "⚠️ 'Action Required Within 60 Minutes or Funds Forfeited'",
      options: [
        { text: "It creates panic so you act quickly without analyzing the link or verifying the source", correct: true },
        { text: "It means your company's payroll system is currently experiencing a database failure", correct: false },
        { text: "It proves the email was generated automatically by corporate software", correct: false },
        { text: "It indicates an official bank timeout protocol", correct: false }
      ],
      explanation: "🚨 Artificial urgency is the #1 social engineering tactic. Scammers create intense fear of loss or deadlines so your panic overrides your critical thinking before you inspect the link."
    },
    {
      context: "Question 3: Executive Impersonation (CEO Fraud)",
      question: "You receive an urgent email from your CEO asking you to buy gift cards or process an emergency wire transfer. What is the safest way to verify it?",
      highlight: "📧 'From: CEO <executive-office@company-internal-mail.com>'",
      options: [
        { text: "Reply directly to the email asking if they really sent it", correct: false },
        { text: "Buy the gift cards immediately to prove your speed and dedication", correct: false },
        { text: "Verify through a separate, trusted out-of-band channel (e.g., call the CEO directly or message via verified internal company chat)", correct: true },
        { text: "Forward the email to coworkers to see if anyone else can buy them", correct: false },
      ],
      explanation: "🛡️ Always verify financial or gift card requests out-of-band! Replying to the email only communicates with the attacker who spoofed or compromised the address. Use a known phone number or verified internal corporate chat."
    },
    {
      context: "Question 4: Link Preview Inspection",
      question: "A link in an email says 'View Official Document,' but when you hover your cursor over it, the popup preview shows an unrecognized IP address. What does this indicate?",
      highlight: "🔗 Display Text: 'View Official Document' ➔ Destination: 'http://185.220.101.5/doc.pdf'",
      options: [
        { text: "High probability of a malicious link hosting credential stealers or malware", correct: true },
        { text: "A routine network speed optimization used by enterprise cloud hosts", correct: false },
        { text: "The document is stored in a private intranet that requires no security certificate", correct: false },
        { text: "Your browser's SSL certificate needs to be reloaded", correct: false }
      ],
      explanation: "🚨 Huge red flag! Authentic businesses never send raw IP addresses in emails to host official documents. Raw IPs almost always point to compromised servers or attacker infrastructure hosting malware."
    },
    {
      context: "Question 5: Emergency Incident Response",
      question: "You accidentally clicked a suspicious link and typed in your company credentials. What should you do first?",
      highlight: "🚨 Incident: Credentials Entered on Suspicious Form",
      options: [
        { text: "Close the browser tab and wait a few days to see if anything unusual happens", correct: false },
        { text: "Immediately report the incident to your IT/Security team and change your password from an uncompromised device", correct: true },
        { text: "Delete your browser history and cache to wipe the record", correct: false },
        { text: "Forward the phishing link to colleagues so they can test if it works for them", correct: false }
      ],
      explanation: "🛡️ Time is critical! Immediately notifying IT/Security allows defenders to revoke active sessions and contain the breach. Changing passwords from a separate, clean device prevents the attacker from accessing your account."
    }
  ];

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  const counterEl = document.getElementById('quiz-counter');
  const scoreEl = document.getElementById('quiz-score');
  const contextEl = document.getElementById('quiz-context');
  const questionTitleEl = document.getElementById('quiz-question-title');
  const highlightBoxEl = document.getElementById('quiz-highlight-box');
  const optionsListEl = document.getElementById('quiz-options-list');
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('quiz-feedback-text');
  const nextBtn = document.getElementById('btn-next-quiz');
  
  const quizActiveCard = document.getElementById('quiz-active-card');
  const completionScreen = document.getElementById('quiz-completion-screen');
  const finalScoreEl = document.getElementById('final-score-val');
  const restartBtn = document.getElementById('btn-restart-quiz');

  if (!optionsListEl) return;

  function loadQuestion(idx) {
    answered = false;
    const q = questions[idx];

    counterEl.textContent = `Question ${idx + 1} of ${questions.length}`;
    contextEl.textContent = q.context;
    questionTitleEl.textContent = q.question;
    highlightBoxEl.textContent = q.highlight;

    feedbackBox.className = 'quiz-feedback-box';
    feedbackBox.classList.remove('show');
    optionsListEl.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="option-prefix">${letters[oIdx]}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => selectAnswer(btn, opt.correct, q.explanation));
      optionsListEl.appendChild(btn);
    });
  }

  function selectAnswer(selectedBtn, isCorrect, explanation) {
    if (answered) return;
    answered = true;

    // Disable all options
    const allBtns = optionsListEl.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      score++;
      scoreEl.textContent = score;
      selectedBtn.classList.add('selected-correct');
      feedbackBox.className = 'quiz-feedback-box correct show';
      feedbackText.innerHTML = `<strong>Correct! (+1 Point)</strong><br>${explanation}`;
    } else {
      selectedBtn.classList.add('selected-wrong');
      // Highlight the correct one
      questions[currentIndex].options.forEach((opt, idx) => {
        if (opt.correct) {
          allBtns[idx].classList.add('selected-correct');
        }
      });
      feedbackBox.className = 'quiz-feedback-box incorrect show';
      feedbackText.innerHTML = `<strong>Incorrect!</strong><br>${explanation}`;
    }

    if (currentIndex === questions.length - 1) {
      nextBtn.innerHTML = '🎉 Finish & View Results';
    } else {
      nextBtn.innerHTML = 'Next Question ➔';
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      loadQuestion(currentIndex);
    } else {
      // Show Completion Screen
      quizActiveCard.style.display = 'none';
      completionScreen.classList.add('show');
      finalScoreEl.textContent = score;
    }
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIndex = 0;
      score = 0;
      scoreEl.textContent = '0';
      completionScreen.classList.remove('show');
      quizActiveCard.style.display = 'block';
      loadQuestion(0);
    });
  }

  loadQuestion(0);
}

/* ==========================================================================
   EMBED DIALOG & COPY HELPER
   ========================================================================== */
function initEmbedModal() {
  const modal = document.getElementById('embed-modal');
  const openBtn = document.getElementById('btn-open-embed');
  const closeBtn = document.getElementById('btn-close-modal');
  const copyBtn = document.getElementById('btn-copy-code');
  const codeBox = document.getElementById('embed-code-snippet');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => modal.showModal());
  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) modal.close();
  });

  if (copyBtn && codeBox) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBox.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied to Clipboard!';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
      });
    });
  }
}
function generateCertificate() {
  const nameInput = document.getElementById('studentName');
  const name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    alert("Please enter a name for the certificate.");
    if (nameInput) nameInput.focus();
    return;
  }

  const canvas = document.getElementById('certCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Obsidian dark background
  ctx.fillStyle = "#060913";
  ctx.fillRect(0, 0, 1200, 800);

  // Dual borders: Outer dark border and Cyan inner border (#00f2fe)
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#1e293b";
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00f2fe";
  ctx.strokeRect(42, 42, 1116, 716);

  // Brand Header
  ctx.textAlign = "center";
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 22px monospace";
  ctx.fillText("CYVEXIS // CYBERSECURITY DRILLS", 600, 115);

  // Main Bold Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("Certificate of Completion", 600, 185);

  // Certification Statement
  ctx.fillStyle = "#94a3b8";
  ctx.font = "20px sans-serif";
  ctx.fillText("This certifies that", 600, 255);

  // Recipient Name in Emerald Green (#10b981)
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText(name, 600, 335);

  // Decorative separator line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(350, 360);
  ctx.lineTo(850, 360);
  ctx.stroke();

  // Accomplishment text
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "22px sans-serif";
  ctx.fillText("has successfully completed the practical awareness drill on", 600, 415);

  // Course Title
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Phishing Links: Spot Deceptive URLs Before You Click", 600, 465);

  // Dynamic Date & Random Record ID (CYV-XXXXXX)
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randId = '';
  for (let i = 0; i < 6; i++) {
    randId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const certId = "CYV-" + randId;

  ctx.fillStyle = "#64748b";
  ctx.font = "16px monospace";
  ctx.fillText(`Issued: ${today}  |  Record ID: ${certId}`, 600, 555);

  // Security & Privacy Notice Box
  ctx.fillStyle = "rgba(10, 15, 29, 0.85)";
  ctx.fillRect(180, 635, 840, 52);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(180, 635, 840, 52);

  // Privacy Footer
  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px monospace";
  ctx.fillText("Client-Side Verified • Zero Credentials Stored • cyvexis", 600, 668);

  // Trigger Local Download
  const sanitizedName = name.replace(/[\s/\\?%*:|"<>]+/g, '_');
  const downloadLink = document.createElement('a');
  downloadLink.download = `Cyvexis_Certificate_${sanitizedName}.png`;
  downloadLink.href = canvas.toDataURL('image/png');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/* ==========================================================================
   STRICT LEARNING MODE SWITCHER (Video Track vs Article Track)
   ========================================================================== */
function setLearningMode(mode) {
  const cardVideo = document.getElementById('cardChoiceVideo');
  const cardArticle = document.getElementById('cardChoiceArticle');
  const btnVideo = document.getElementById('btnLabelVideo');
  const btnArticle = document.getElementById('btnLabelArticle');
  const videoTrack = document.getElementById('videoTrackContent');
  const articleTrack = document.getElementById('articleTrackContent');
  const videoEl = document.getElementById('phishingVideo');

  if (mode === 'video') {
    if (cardVideo) cardVideo.classList.add('active');
    if (cardArticle) cardArticle.classList.remove('active');
    if (btnVideo) {
      btnVideo.textContent = 'Selected Track ✓';
      btnVideo.className = 'btn-choice-select';
    }
    if (btnArticle) {
      btnArticle.textContent = 'Choose Reading Track ➔';
      btnArticle.className = 'btn-choice-select secondary';
    }
    // Show ONLY Video Track, Hide Article Track
    if (videoTrack) videoTrack.style.display = 'block';
    if (articleTrack) articleTrack.style.display = 'none';

    if (videoTrack) {
      videoTrack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else if (mode === 'article') {
    if (cardArticle) cardArticle.classList.add('active');
    if (cardVideo) cardVideo.classList.remove('active');
    if (btnArticle) {
      btnArticle.textContent = 'Selected Track ✓';
      btnArticle.className = 'btn-choice-select';
    }
    if (btnVideo) {
      btnVideo.textContent = 'Choose Video Track ➔';
      btnVideo.className = 'btn-choice-select secondary';
    }
    // Pause video if playing
    if (videoEl && !videoEl.paused) {
      videoEl.pause();
    }
    // Show ONLY Article Track, Hide Video Track
    if (videoTrack) videoTrack.style.display = 'none';
    if (articleTrack) articleTrack.style.display = 'block';

    if (articleTrack) {
      articleTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
window.setLearningMode = setLearningMode;

// Automatically detect when the video finishes playing!
document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('phishingVideo');
  const completionNotice = document.getElementById('videoCompletionNotice');
  const proceedBtn = document.getElementById('btnProceedQuiz');

  if (videoEl) {
    videoEl.addEventListener('ended', () => {
      if (completionNotice) {
        completionNotice.style.display = 'flex';
      }
      if (proceedBtn) {
        proceedBtn.classList.add('highlight-pulse');
      }
      const quizSection = document.getElementById('quiz');
      if (quizSection) {
        setTimeout(() => {
          quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
      }
    });
  }
});

