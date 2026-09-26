/**
 * CYVEXIS SECURITY TRAINING: MODULE 02
 * Password Hygiene & MFA Fatigue: Defending Against Credential Attacks
 * Interactive Controller & Simulation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initMfaFatigueSimulation();
  initEntropyLab();
  initScenarioQuiz();
  initEmbedModal();
  initTakeawayChecklist();
  initCertificateGenerator();
});

/* ==========================================================================
   1. INTERACTIVE MFA FATIGUE SIMULATION ENGINE
   ========================================================================== */
function initMfaFatigueSimulation() {
  const phoneFrame = document.querySelector('.sim-phone-frame');
  const notifStack = document.getElementById('sim-notification-stack');
  const counterBadge = document.getElementById('prompt-counter-badge');
  const telemCount = document.getElementById('telem-count');
  const telemHaptic = document.getElementById('telem-haptic');
  const btnDeny = document.getElementById('sim-btn-deny');
  const btnApprove = document.getElementById('sim-btn-approve');
  const btnRestart = document.getElementById('btn-restart-sim');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundBtnText = document.getElementById('sound-btn-text');

  const feedbackBox = document.getElementById('sim-feedback-box');
  const feedbackDot = document.getElementById('feedback-dot');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackBody = document.getElementById('feedback-body');
  const feedbackTip = document.getElementById('feedback-tip');

  let soundEnabled = true;
  let attackInterval = null;
  let vibrateInterval = null;
  let currentPromptCount = 1;
  const maxPrompts = 12;

  // Web Audio Context for notification chimes & haptic clicks
  let audioCtx = null;
  function playBeep(freq = 520, duration = 0.12, type = 'sine') {
    if (!soundEnabled || window.currentLearningMode !== 'article') return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported in iframe
    }
  }

  function playAlertChime() {
    if (window.currentLearningMode !== 'article') return;
    playBeep(680, 0.08, 'triangle');
    setTimeout(() => {
      if (window.currentLearningMode === 'article') {
        playBeep(880, 0.12, 'sine');
      }
    }, 90);
  }

  // Trigger one barrage round
  function triggerIncomingPush() {
    if (window.currentLearningMode !== 'article') {
      stopAttack();
      return;
    }
    if (currentPromptCount < maxPrompts) {
      currentPromptCount++;
      counterBadge.textContent = `${currentPromptCount} of ${maxPrompts}`;
      telemCount.textContent = `${currentPromptCount} Requests`;

      // Append mini notification item in background stack
      const mini = document.createElement('div');
      mini.className = 'sim-push-mini-card';
      mini.innerHTML = `
        <span>🔑 Sign-in request #${currentPromptCount}</span>
        <span class="mini-time">02:${14 + Math.floor(currentPromptCount / 2)} AM</span>
      `;
      if (notifStack.firstChild) {
        notifStack.insertBefore(mini, notifStack.firstChild);
      } else {
        notifStack.appendChild(mini);
      }

      // Keep max 3 visible in mini stack
      while (notifStack.children.length > 3) {
        notifStack.removeChild(notifStack.lastChild);
      }

      // Trigger phone vibration pulse
      triggerPhoneVibrate();
      playAlertChime();
    }
  }

  function triggerPhoneVibrate() {
    if (!phoneFrame || window.currentLearningMode !== 'article') return;
    phoneFrame.classList.add('vibrating');
    telemHaptic.textContent = 'Active (Vibrating)';
    setTimeout(() => {
      if (phoneFrame) phoneFrame.classList.remove('vibrating');
      if (telemHaptic && window.currentLearningMode === 'article') {
        telemHaptic.textContent = 'Idle (Awaiting next)';
      }
    }, 450);
  }

  function startAttack() {
    stopAttack();
    currentPromptCount = 1;
    counterBadge.textContent = `1 of ${maxPrompts}`;
    telemCount.textContent = `1 Request`;
    notifStack.innerHTML = '';

    feedbackDot.className = 'status-indicator-dot pulse-amber';
    feedbackTitle.textContent = 'Attack In Progress (2:14 AM)...';
    feedbackBody.innerHTML = `
      The attacker already acquired your password from a previous data breach and is bombarding your phone with continuous authentication pushes. Notice the psychological urge to tap "Approve" just to silence the device.
    `;
    feedbackTip.innerHTML = `💡 <strong>Remember:</strong> Tapping "Approve" does not make the attacker go away; it grants them full access to your account.`;

    btnDeny.disabled = false;
    btnApprove.disabled = false;

    // Push barrage every 4 seconds only if in article mode
    if (window.currentLearningMode === 'article') {
      attackInterval = setInterval(triggerIncomingPush, 4200);
    }
  }

  function stopAttack() {
    if (attackInterval) clearInterval(attackInterval);
    if (vibrateInterval) clearInterval(vibrateInterval);
    attackInterval = null;
    vibrateInterval = null;
    if (phoneFrame) phoneFrame.classList.remove('vibrating');
    if (telemHaptic) telemHaptic.textContent = 'Stopped';
    if (audioCtx && audioCtx.state === 'running') {
      try { audioCtx.suspend(); } catch (e) {}
    }
  }

  // Handle User Clicks on Deny
  btnDeny.addEventListener('click', () => {
    stopAttack();
    playBeep(440, 0.15, 'sine');
    btnDeny.disabled = true;
    btnApprove.disabled = true;

    feedbackDot.className = 'status-indicator-dot pulse-emerald';
    feedbackTitle.textContent = '✅ Threat Successfully Deflected!';
    feedbackBody.innerHTML = `
      <strong>Flawless Reaction:</strong> You refused the unauthorized prompt and protected your account from immediate compromise.
      <br><br>
      <strong>Crucial Next Step:</strong> Because the attacker was able to trigger this prompt, <em>they already know your password</em>. You must immediately change your password and terminate any existing sessions (Follow Step 4 below).
    `;
    feedbackTip.innerHTML = `🛡️ <strong>Golden Rule:</strong> An unsolicited MFA prompt always means your password is known to an unauthorized party.`;
  });

  // Handle User Clicks on Approve (Simulated Accident)
  btnApprove.addEventListener('click', () => {
    stopAttack();
    playBeep(260, 0.25, 'sawtooth');
    btnDeny.disabled = true;
    btnApprove.disabled = true;

    feedbackDot.className = 'status-indicator-dot pulse-rose';
    feedbackTitle.textContent = '⚠️ Simulated Breach: Prompt Approved';
    feedbackBody.innerHTML = `
      <strong>Zero-Shaming Analysis:</strong> You just experienced why MFA fatigue is so dangerous. Under genuine sleep interruption and persistent device buzzing, hundreds of security professionals and employees have tapped "Approve" simply to silence their phones.
      <br><br>
      <strong>How to React Now:</strong> Don't panic! Head directly down to <strong>Section 04: Containment Protocol</strong>. Immediate password reset and session termination will cut off the intruder in seconds.
    `;
    feedbackTip.innerHTML = `💚 <strong>Support Over Blame:</strong> Security teams never punish accidental clicks when reported promptly. Immediate disclosure protects the entire company.`;
  });

  // Restart Button
  btnRestart.addEventListener('click', () => {
    startAttack();
  });

  // Sound Toggle
  btnToggleSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtnText.textContent = soundEnabled ? '🔊 Sound / Vibration FX: On' : '🔇 Sound / Vibration FX: Off';
  });

  // Expose simulation controller so learning mode selector can control it
  window.mfaSimController = {
    start: startAttack,
    stop: stopAttack
  };

  // Only start attack simulation if currently in article mode; in video mode keep it stopped!
  if (window.currentLearningMode === 'article') {
    startAttack();
  } else {
    stopAttack();
  }
}

/* ==========================================================================
   2. INTERACTIVE ENTROPY & PASSPHRASE LAB
   ========================================================================== */
function initEntropyLab() {
  const buttons = document.querySelectorAll('.btn-preset');
  const displayContainer = document.getElementById('entropy-display');

  const entropyData = {
    weak: {
      password: 'Tr0ub4dor&',
      length: '10 characters',
      entropy: '42 bits',
      crackTime: '3 Hours',
      statusClass: 'danger',
      desc: 'Common formula: Root word + leetspeak substitution (0 for o, 4 for a). Modern hashcat GPU clusters test this pattern in billions of variations per second.'
    },
    sprayed: {
      password: 'Summer2024!',
      length: '11 characters',
      entropy: '18 bits (Effective)',
      crackTime: '0.001 Seconds',
      statusClass: 'danger',
      desc: 'The #1 corporate password spray target. Attackers script seasonal words + current year + exclamation point across tens of thousands of corporate email inboxes simultaneously.'
    },
    passphrase: {
      password: 'correct-horse-battery-staple',
      length: '28 characters',
      entropy: '78 bits',
      crackTime: '2.8 Million Years',
      statusClass: 'cyan',
      desc: 'High-Entropy Passphrase. 4 completely unrelated dictionary words. Immensely difficult for brute-force algorithms to search through the combinatorial space, yet very easy for humans to remember.'
    },
    vault: {
      password: 'xK9#mQ2$vL8!zP4@rT7*wE5&',
      length: '24 characters',
      entropy: '144 bits',
      crackTime: 'Trillions of Centuries',
      statusClass: 'emerald',
      desc: 'Cryptographically Secure Random Vault Password. Zero recognizable patterns. Generated and autofilled by 1Password or Bitwarden, completely uncrackable and immune to credential reuse.'
    }
  };

  function renderEntropy(type) {
    const data = entropyData[type];
    if (!data) return;

    displayContainer.innerHTML = `
      <div class="demo-password-visual">${escapeHtml(data.password)}</div>
      <div class="demo-metrics-row">
        <div class="demo-metric-item">
          <span class="demo-metric-label">Length</span>
          <span class="demo-metric-val">${data.length}</span>
        </div>
        <div class="demo-metric-item">
          <span class="demo-metric-label">Cryptographic Entropy</span>
          <span class="demo-metric-val text-cyan">${data.entropy}</span>
        </div>
        <div class="demo-metric-item">
          <span class="demo-metric-label">Brute-Force Offline Cracking</span>
          <span class="demo-metric-val text-${data.statusClass}">${data.crackTime}</span>
        </div>
      </div>
      <p class="demo-explanation">${data.desc}</p>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEntropy(btn.getAttribute('data-type'));
    });
  });

  // Render default
  renderEntropy('weak');
}

/* ==========================================================================
   3. PRACTICE: 3-SCENARIO INTERACTIVE QUIZ (Zero-Shaming)
   ========================================================================== */
function initScenarioQuiz() {
  const quizQuestions = [
    {
      category: '// SCENARIO 01 • MIDNIGHT NOTIFICATION BARRAGE',
      title: 'Defending Against Middle-of-the-Night Push Bombing',
      context: 'It is 2:15 AM on a Wednesday. Your phone suddenly buzzes with 10 consecutive push notifications from your company authentication app asking to approve a sign-in from an unknown IP address. You are exhausted and half-asleep.',
      options: [
        {
          text: 'Tap "Approve" so the notifications stop vibrating, planning to tell IT tomorrow morning.',
          correct: false,
          rationale: 'Understandable impulse due to sleep disruption, but tapping Approve immediately gives the intruder full access to your corporate accounts. Never approve an unprompted request.'
        },
        {
          text: 'Tap "Deny / Block", and recognize that because the prompt appeared, the attacker already has your password and it must be changed immediately.',
          correct: true,
          rationale: 'Spot on! Denying prevents the immediate breach. Recognizing that an unprompted MFA prompt means your primary password has leaked allows you to reset credentials before they try another method.'
        },
        {
          text: 'Turn your phone off and assume your company firewall will block the attacker automatically.',
          correct: false,
          rationale: 'Turning off your phone leaves the attacker in possession of your valid password. They can continue testing other avenues until you actively reset credentials.'
        }
      ]
    },
    {
      category: '// SCENARIO 02 • ACCIDENTAL APPROVAL CONTAINMENT',
      title: 'Zero-Shaming Incident Response When Mistakes Occur',
      context: 'An employee, Jordan, is rushing between meetings and accidentally taps "Approve" on an unexpected login prompt on their smartwatch. Jordan realizes the mistake 10 seconds later and feels intense anxiety about getting in trouble.',
      options: [
        {
          text: 'Immediately report the incident to IT/SOC and reset the password, knowing modern security teams celebrate rapid reporting.',
          correct: true,
          rationale: 'Exactly right! Psychological fear of punishment is an attacker\'s best friend. Security teams are trained to assist without blame; early notification lets defenders revoke active session tokens in minutes.'
        },
        {
          text: 'Stay silent and monitor email for suspicious activity to see if an intruder actually logs in.',
          correct: false,
          rationale: 'Attackers move programmatically in seconds to exfiltrate session cookies and download data. Waiting to see what happens turns a manageable containment event into a catastrophic breach.'
        },
        {
          text: 'Format and factory-reset the laptop without notifying IT support.',
          correct: false,
          rationale: 'The session token exists in the cloud authentication provider (Azure AD / Okta), not just locally on the laptop. Wiping the machine destroys forensic logs without evicting the cloud attacker.'
        }
      ]
    },
    {
      category: '// SCENARIO 03 • CREDENTIAL ARCHITECTURE & HYGIENE',
      title: 'Architecting Defense Against Credential Stuffing',
      context: 'Your team is reviewing corporate password and authentication policies. You want to completely eliminate vulnerability to credential stuffing leaks and push fatigue attacks without burdening employees with impossible memory requirements.',
      options: [
        {
          text: 'Require employees to memorize complex 8-character passwords with symbols and change them every 30 days, using SMS MFA.',
          correct: false,
          rationale: 'Outdated standard. Frequent 30-day rotations lead to predictable substitutions (Password01, Password02), and SMS is vulnerable to SIM swaps and Evilginx reverse-proxy phishing.'
        },
        {
          text: 'Deploy an enterprise Password Manager for unique 20+ char credentials, and enforce Number Matching MFA or FIDO2 Passkeys.',
          correct: true,
          rationale: 'State-of-the-art defense! Password managers prevent reuse across breached sites, while Number Matching (typing the 2-digit number from screen to phone) or FIDO2 passkeys completely neutralize blind push fatigue attacks.'
        },
        {
          text: 'Allow employees to use one master high-complexity password across all accounts so they never forget it.',
          correct: false,
          rationale: 'Reusing a single password—even a complex one—is the exact vulnerability credential stuffing exploits. One breach at any vendor exposes all accounts.'
        }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;

  const currentQNum = document.getElementById('current-q-num');
  const userScoreEl = document.getElementById('user-score');
  const progressFill = document.getElementById('quiz-progress-fill');
  const quizCategory = document.getElementById('quiz-category');
  const quizTitle = document.getElementById('quiz-question-title');
  const quizContext = document.getElementById('quiz-context');
  const optionsContainer = document.getElementById('quiz-options-container');

  const feedbackDrawer = document.getElementById('quiz-feedback-drawer');
  const feedbackResultIcon = document.getElementById('feedback-result-icon');
  const feedbackResultTitle = document.getElementById('feedback-result-title');
  const feedbackDrawerText = document.getElementById('feedback-drawer-text');
  const btnNext = document.getElementById('btn-next-question');

  const quizCard = document.getElementById('quiz-card');
  const quizCompleteCard = document.getElementById('quiz-complete-card');
  const completionSummaryText = document.getElementById('completion-summary-text');
  const btnRestartQuiz = document.getElementById('btn-restart-quiz');

  function renderQuestion(index) {
    const q = quizQuestions[index];
    currentQNum.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;

    quizCategory.textContent = q.category;
    quizTitle.textContent = q.title;
    quizContext.textContent = q.context;

    optionsContainer.innerHTML = '';
    feedbackDrawer.classList.add('hidden');

    const prefixes = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${prefixes[optIdx]}</span>
        <span>${escapeHtml(opt.text)}</span>
      `;

      btn.addEventListener('click', () => {
        handleOptionSelected(opt, btn, q);
      });

      optionsContainer.appendChild(btn);
    });
  }

  function handleOptionSelected(option, btnElement, question) {
    // Disable all options
    const allBtns = optionsContainer.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (option.correct) {
      userScore++;
      userScoreEl.textContent = userScore;
      btnElement.classList.add('selected-correct');
      feedbackResultIcon.textContent = '✅';
      feedbackResultTitle.textContent = 'Correct Defense Assessment';
      feedbackResultTitle.style.color = 'var(--emerald-safe)';
    } else {
      btnElement.classList.add('selected-incorrect');
      feedbackResultIcon.textContent = '💡';
      feedbackResultTitle.textContent = 'Educational Perspective';
      feedbackResultTitle.style.color = 'var(--amber-warn)';

      // Highlight the correct one
      question.options.forEach((opt, idx) => {
        if (opt.correct) {
          allBtns[idx].classList.add('selected-correct');
        }
      });
    }

    feedbackDrawerText.textContent = option.rationale;
    feedbackDrawer.classList.remove('hidden');

    if (currentQuestionIndex === quizQuestions.length - 1) {
      btnNext.innerHTML = '<span>View Training Results ➔</span>';
    } else {
      btnNext.innerHTML = '<span>Next Scenario ➔</span>';
    }
  }

  btnNext.addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      showCompletionScreen();
    }
  });

  function showCompletionScreen() {
    quizCard.classList.add('hidden');
    quizCompleteCard.classList.remove('hidden');

    const quizPassed = (userScore >= 2);
    window.module2QuizPassed = quizPassed;

    const trophyEl = quizCompleteCard.querySelector('.completion-trophy');
    const headerEl = quizCompleteCard.querySelector('h3');
    const claimBanner = quizCompleteCard.querySelector('.claim-cert-scroll-banner');
    const certBadge = document.getElementById('certBadge');
    const certDesc = document.getElementById('certDesc');
    const studentNameInput = document.getElementById('studentName');
    const generateBtn = document.getElementById('generateBtn');
    const certLockNotice = document.getElementById('certLockNotice');

    if (quizPassed) {
      if (trophyEl) trophyEl.textContent = '🏆';
      if (headerEl) headerEl.textContent = `Scenario Challenge Passed (${userScore}/3)!`;
      completionSummaryText.textContent = `Congratulations! You scored ${userScore} out of ${quizQuestions.length} scenarios correctly. You met the 50% passing requirement and unlocked your certificate.`;

      if (claimBanner) {
        claimBanner.innerHTML = `
          <div class="cert-scroll-icon">🎓</div>
          <div class="cert-scroll-info">
            <h4 class="cert-scroll-title" style="color: #10b981;">🎉 Certificate Unlocked (Passed: ${userScore}/3)</h4>
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
      if (trophyEl) trophyEl.textContent = '⚠️';
      if (headerEl) headerEl.textContent = `Challenge Not Passed (Score: ${userScore}/3)`;
      completionSummaryText.textContent = `You scored ${userScore} out of ${quizQuestions.length} scenarios correctly. You must answer at least half (minimum 2 out of 3) correctly to unlock your certificate.`;

      if (claimBanner) {
        claimBanner.innerHTML = `
          <div class="cert-scroll-icon">🔒</div>
          <div class="cert-scroll-info">
            <h4 class="cert-scroll-title" style="color: #ef4444;">❌ Certificate Locked (Minimum 2/3 Required)</h4>
            <p class="cert-scroll-sub" style="color: #cbd5e1;">You scored ${userScore} out of 3. You need at least <strong>50% (2 out of 3 correct)</strong> to qualify for a certificate. Please retake the challenge below.</p>
          </div>
          <button type="button" class="btn-go-down-cert" onclick="document.getElementById('btn-restart-quiz').click()" style="background: linear-gradient(135deg, #ef4444, #dc2626); border: none; cursor: pointer;">
            <span>🔄 Retake Challenge to Unlock</span>
          </button>
        `;
      }
      if (certBadge) {
        certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 2/3 REQUIRED';
        certBadge.style.color = '#ef4444';
        certBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        certBadge.style.background = 'rgba(239, 68, 68, 0.1)';
      }
      if (certDesc) {
        certDesc.innerHTML = `<span style="color: #f87171;">You scored ${userScore}/3. You must score at least 2/3 (50%) to unlock the certificate.</span>`;
      }
      if (studentNameInput) studentNameInput.disabled = true;
      if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.5';
        generateBtn.style.cursor = 'not-allowed';
      }
      if (certLockNotice) {
        certLockNotice.style.display = 'block';
        certLockNotice.innerHTML = `❌ Certificate locked. Click <strong>Retake Challenge</strong> above and score at least 2/3 to unlock.`;
        certLockNotice.style.color = '#ef4444';
      }
    }
  }

  btnRestartQuiz.addEventListener('click', () => {
    currentQuestionIndex = 0;
    userScore = 0;
    userScoreEl.textContent = '0';
    window.module2QuizPassed = false;
    quizCompleteCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    btnNext.innerHTML = '<span>Next Scenario ➔</span>';

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
      certDesc.textContent = 'Complete the Scenario Challenge above with at least 50% (2/3) correct to unlock your official verified certificate.';
    }
    if (studentNameInput) studentNameInput.disabled = true;
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.6';
      generateBtn.style.cursor = 'not-allowed';
    }
    if (certLockNotice) {
      certLockNotice.style.display = 'block';
      certLockNotice.textContent = '⚠️ Take the 3-scenario challenge above to unlock download access.';
      certLockNotice.style.color = '#f59e0b';
    }

    renderQuestion(0);
  });

  // Start with Question 0
  renderQuestion(0);
}

/* ==========================================================================
   4. TAKEAWAY CHECKLIST
   ========================================================================== */
function initTakeawayChecklist() {
  window.toggleTakeaway = function(card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      card.classList.toggle('checked', checkbox.checked);
    }
  };
}

/* ==========================================================================
   5. EMBED / EXPORT MODAL HANDLER
   ========================================================================== */
function initEmbedModal() {
  const modal = document.getElementById('embed-modal');
  const btnOpen = document.getElementById('btn-open-embed');
  const btnClose = document.getElementById('btn-close-modal');
  const tabBtns = document.querySelectorAll('.embed-tab-btn');
  const tabBodies = document.querySelectorAll('.embed-tab-body');
  const copyBtns = document.querySelectorAll('.btn-embed-copy');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.showModal();
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.close();
    });
  }

  // Close modal when clicking outside dialog content
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  }

  // Switch tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabBodies.forEach(b => b.classList.remove('active'));

      btn.classList.add('active');
      const body = document.getElementById(`tab-${targetTab}`);
      if (body) body.classList.add('active');
    });
  });

  // Copy snippets
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>✅ Copied to Clipboard!</span>';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2200);
        }).catch(() => {
          btn.innerHTML = '<span>❌ Please select and copy manually</span>';
        });
      }
    });
  });
}

// Utility
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/* ==========================================================================
   6. CYVEXIS CERTIFICATE GENERATOR (Client-Side HTML5 2D Canvas)
   ========================================================================== */
function initCertificateGenerator() {
  const studentInput = document.getElementById('studentName');
  if (studentInput) {
    studentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateCertificate();
      }
    });
  }
}

const MODULE2_CONFIG = {
  code: 'M02',
  filePrefix: 'Module2',
  title: 'MODULE 02: PASSWORD HYGIENE & MFA FATIGUE DEFENSE',
  descLine1: 'An intensive cybersecurity training module covering credential stuffing mitigation,',
  descLine2: 'passkey adoption, and MFA prompt bombing triage.'
};

function generateCertificate() {
  if (!window.module2QuizPassed) {
    alert("Certificate Locked: You must score at least 50% (minimum 2 out of 3 scenarios correct) on the Scenario Challenge to unlock and download your certificate.");
    const practiceSec = document.getElementById('practice');
    if (practiceSec) practiceSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const nameInput = document.getElementById('studentName');
  const studentName = nameInput ? nameInput.value.trim() : '';

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

    // 2. Module Title (bold serif)
    ctx.fillStyle = navyColor;
    ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE2_CONFIG.title, centerX, 684);

    // 3. Module Description (italic serif)
    ctx.fillStyle = descColor;
    ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE2_CONFIG.descLine1, centerX, 752);
    if (MODULE2_CONFIG.descLine2) {
      ctx.fillText(MODULE2_CONFIG.descLine2, centerX, 788);
    }

    // 4. Date & ID
    const today = new Date();
    const formattedDate = `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `ID: CYV-${today.getFullYear()}-${MODULE2_CONFIG.code}-${randomSuffix}`;

    ctx.font = '500 25px "Courier New", Consolas, monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText(formattedDate, 760, 960);
    ctx.fillText(certId, 1220, 960);

    setTimeout(() => {
      const cleanName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Cyvexis_Module2_Certificate_${cleanName}.png`;
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

// Attach globally for inline HTML onclick handlers
window.generateCertificate = generateCertificate;

/* ==========================================================================
   STRICT LEARNING MODE SWITCHER (5-Min Video Track vs 5-Min Article Track)
   ========================================================================== */
window.currentLearningMode = 'video';

function setLearningMode(mode) {
  const cardVideo = document.getElementById('cardChoiceVideo');
  const cardArticle = document.getElementById('cardChoiceArticle');
  const btnVideo = document.getElementById('btnLabelVideo');
  const btnArticle = document.getElementById('btnLabelArticle');
  const videoTrack = document.getElementById('videoTrackContent');
  const articleTrack = document.getElementById('articleTrackContent');
  const videoEl = document.getElementById('mfaVideo');

  if (mode === 'video') {
    window.currentLearningMode = 'video';

    // Immediately stop simulation attack loop and silence all sound & vibration!
    if (window.mfaSimController && typeof window.mfaSimController.stop === 'function') {
      window.mfaSimController.stop();
    }

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
    window.currentLearningMode = 'article';

    // Pause video if HTML5 video element is playing
    if (videoEl && typeof videoEl.pause === 'function' && !videoEl.paused) {
      videoEl.pause();
    }

    // Start simulation attack when user enters Article Mode
    if (window.mfaSimController && typeof window.mfaSimController.start === 'function') {
      window.mfaSimController.start();
    }

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
    // Show ONLY Article Track, Hide Video Track
    if (videoTrack) videoTrack.style.display = 'none';
    if (articleTrack) articleTrack.style.display = 'block';

    if (articleTrack) {
      articleTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
window.setLearningMode = setLearningMode;

// Automatically detect when the video finishes playing in Module 2!
document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('mfaVideo');
  const completionNotice = document.getElementById('videoCompletionNotice');
  const proceedBtn = document.getElementById('btnProceedChallenge');

  if (videoEl) {
    videoEl.addEventListener('ended', () => {
      if (completionNotice) {
        completionNotice.style.display = 'flex';
      }
      if (proceedBtn) {
        proceedBtn.classList.add('highlight-pulse');
      }
      const challengeSection = document.getElementById('practice');
      if (challengeSection) {
        setTimeout(() => {
          challengeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
      }
    });
  }
});
