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

  let quizCompleted = false;
  let quizPassed = false;
  window.module1QuizPassed = false;

  nextBtn.addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      loadQuestion(currentIndex);
    } else {
      // Show Completion Screen & check 50% passing threshold (at least 3 of 5)
      quizCompleted = true;
      quizPassed = (score >= 3);
      window.module1QuizPassed = quizPassed;

      quizActiveCard.style.display = 'none';
      completionScreen.classList.add('show');
      finalScoreEl.textContent = score;

      const celebrationTitle = document.querySelector('.completion-celebration-title');
      const claimBanner = document.querySelector('.claim-cert-scroll-banner');
      const certBadge = document.getElementById('certBadge');
      const certDesc = document.getElementById('certDesc');
      const studentNameInput = document.getElementById('studentName');
      const generateBtn = document.getElementById('generateBtn');
      const certLockNotice = document.getElementById('certLockNotice');

      if (quizPassed) {
        if (celebrationTitle) {
          celebrationTitle.innerHTML = `👏 Congratulations! You Passed with ${score}/5! 🥳`;
        }
        if (claimBanner) {
          claimBanner.innerHTML = `
            <div class="cert-scroll-icon">🎓</div>
            <div class="cert-scroll-info">
              <h4 class="cert-scroll-title" style="color: #10b981;">🎉 Certificate Unlocked (Score: ${score}/5 - Passed)</h4>
              <p class="cert-scroll-sub">You scored 50% or higher! Scroll down to enter your name and download your verified credential:</p>
            </div>
            <a href="#certificateSection" class="btn-go-down-cert" style="background: linear-gradient(135deg, #10b981, #059669);">
              <span>Claim Certificate ↓</span>
            </a>
          `;
        }
        if (certBadge) {
          certBadge.textContent = '🛡️ VERIFIED COMPLETION';
          certBadge.style.color = '#00f2fe';
          certBadge.style.borderColor = 'rgba(0, 242, 254, 0.4)';
          certBadge.style.background = 'rgba(0, 242, 254, 0.1)';
        }
        if (certDesc) {
          certDesc.textContent = 'Enter the name you would like displayed on your official Cyvexis awareness record.';
        }
        if (studentNameInput) studentNameInput.disabled = false;
        if (generateBtn) {
          generateBtn.disabled = false;
          generateBtn.style.opacity = '1';
          generateBtn.style.cursor = 'pointer';
        }
        if (certLockNotice) certLockNotice.style.display = 'none';
      } else {
        if (celebrationTitle) {
          celebrationTitle.innerHTML = `⚠️ Quiz Not Passed (Score: ${score}/5)`;
        }
        if (claimBanner) {
          claimBanner.innerHTML = `
            <div class="cert-scroll-icon">🔒</div>
            <div class="cert-scroll-info">
              <h4 class="cert-scroll-title" style="color: #ef4444;">❌ Certificate Locked (Minimum 3/5 Required)</h4>
              <p class="cert-scroll-sub" style="color: #cbd5e1;">You scored ${score} out of 5. You need at least <strong>50% (3 out of 5 correct)</strong> to qualify for a certificate. Please retake the quiz to unlock your certificate.</p>
            </div>
            <button type="button" class="btn-go-down-cert" onclick="document.getElementById('btn-restart-quiz').click()" style="background: linear-gradient(135deg, #ef4444, #dc2626); border: none; cursor: pointer;">
              <span>🔄 Retake Quiz to Unlock</span>
            </button>
          `;
        }
        if (certBadge) {
          certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 3/5 REQUIRED';
          certBadge.style.color = '#ef4444';
          certBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          certBadge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
        if (certDesc) {
          certDesc.innerHTML = `<span style="color: #f87171;">You scored ${score}/5. You must score at least 3/5 (50%) to unlock the certificate.</span>`;
        }
        if (studentNameInput) studentNameInput.disabled = true;
        if (generateBtn) {
          generateBtn.disabled = true;
          generateBtn.style.opacity = '0.5';
          generateBtn.style.cursor = 'not-allowed';
        }
        if (certLockNotice) {
          certLockNotice.style.display = 'block';
          certLockNotice.innerHTML = `❌ Certificate locked. Click <strong>Retake Quiz</strong> above and score at least 3/5 to unlock.`;
          certLockNotice.style.color = '#ef4444';
        }
      }
    }
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIndex = 0;
      score = 0;
      scoreEl.textContent = '0';
      quizCompleted = false;
      quizPassed = false;
      window.module1QuizPassed = false;
      completionScreen.classList.remove('show');
      quizActiveCard.style.display = 'block';

      // Reset certificate section to locked state
      const certBadge = document.getElementById('certBadge');
      const certDesc = document.getElementById('certDesc');
      const studentNameInput = document.getElementById('studentName');
      const generateBtn = document.getElementById('generateBtn');
      const certLockNotice = document.getElementById('certLockNotice');

      if (certBadge) {
        certBadge.textContent = '🔒 CERTIFICATE LOCKED';
        certBadge.style.color = '';
        certBadge.style.borderColor = '';
        certBadge.style.background = '';
      }
      if (certDesc) {
        certDesc.textContent = 'Complete the Phishing Awareness Drill above with at least 50% (3/5) correct to unlock your official verified certificate.';
      }
      if (studentNameInput) studentNameInput.disabled = true;
      if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.6';
        generateBtn.style.cursor = 'not-allowed';
      }
      if (certLockNotice) {
        certLockNotice.style.display = 'block';
        certLockNotice.textContent = '⚠️ Take the 5-question quiz above to unlock download access.';
        certLockNotice.style.color = '#f59e0b';
      }

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
const MODULE1_CONFIG = {
  code: 'M01',
  filePrefix: 'Module1',
  title: 'MODULE 01: PHISHING LINK & URL DECEPTION DEFENSE',
  descLine1: 'An intensive cybersecurity training module covering deceptive URL dissection,',
  descLine2: 'typosquatting triage, and credential harvesting mitigation.'
};

function generateCertificate() {
  if (!window.module1QuizPassed) {
    alert("Certificate Locked: You must score at least 50% (minimum 3 out of 5 correct) on the Phishing Awareness Quiz to unlock and download your certificate.");
    const quizSec = document.getElementById('quiz');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const nameInput = document.getElementById('studentName');
  const name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    alert("Please enter your full name to generate your verified Cyvexis certificate.");
    if (nameInput) nameInput.focus();
    return;
  }

  const canvas = document.getElementById('certCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

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
    while (ctx.measureText(name.toUpperCase()).width > 1200 && nameFontSize > 28) {
      nameFontSize -= 2;
      ctx.font = `bold ${nameFontSize}px Georgia, "Times New Roman", serif`;
    }
    ctx.fillText(name.toUpperCase(), centerX, 542);

    // 2. Module Title (bold serif)
    ctx.fillStyle = navyColor;
    ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE1_CONFIG.title, centerX, 684);

    // 3. Module Description (italic serif)
    ctx.fillStyle = descColor;
    ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE1_CONFIG.descLine1, centerX, 752);
    if (MODULE1_CONFIG.descLine2) {
      ctx.fillText(MODULE1_CONFIG.descLine2, centerX, 788);
    }

    // 4. Date & ID
    const today = new Date();
    const formattedDate = `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `ID: CYV-${today.getFullYear()}-${MODULE1_CONFIG.code}-${randomSuffix}`;

    ctx.font = '500 25px "Courier New", Consolas, monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText(formattedDate, 760, 960);
    ctx.fillText(certId, 1220, 960);

    setTimeout(() => {
      const sanitizedName = name.replace(/[\s/\\?%*:|"<>]+/g, '_');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Cyvexis_Module1_Certificate_${sanitizedName}.png`;
      downloadLink.href = canvas.toDataURL('image/png');
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

