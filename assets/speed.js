// Helper functions for Qualtrics

var $speed = (function() {
  let speedTestTempEl,
    overlayTempEl,
    answerInputEl,
    resetEl,
    statsEl,
    progressEl,
    completeEl;
  let startTime, keyCount, errorCount, correctCount, isCompleted, isStarted;
  let updateEvent;
  let speedTestHandler, completeHandler, resetHandler;

  const errorClass = 'error';
  const containerClass = 'code-container';
  const overlayClass = 'text-overlay';

  function commonStrStart(str1, str2) {
    const shortest = Math.min(str1.length, str2.length);
    let common = '';
    for (let i = 0; i < shortest; i++) {
      if (str1.charAt(i) == str2.charAt(i)) {
        common += str1.charAt(i);
      } else {
        break;
      }
    }
    return common;
  }

  // https://www.speedtypingonline.com/typing-equations
  function wpm() {
    const timeMin = (Date.now() - startTime) / 1000 / 60;
    const speed = (keyCount - errorCount) / 5 / timeMin;
    return Math.ceil(speed * 100) / 100;
  }

  function progress(m, n) {
    return n ? Math.ceil((m / n) * 1000) / 10 + '%' : '0%';
  }

  function setInnerHtml(el, val) {
    if (el) {
      el.innerHTML = val;
    }
  }

  function update(newValue) {
    const template = speedTestTempEl.innerHTML;
    const common = commonStrStart(template, newValue);
    const percent = progress(common.length, template.length);
    setInnerHtml(overlayTempEl, common);
    setInnerHtml(progressEl, percent);

    if (common.length <= correctCount) {
      errorCount += 1;
    }
    const newSpeed = wpm();
    setInnerHtml(statsEl, newSpeed);

    correctCount = common.length;
    if (containerEl && correctCount < newValue.length) {
      containerEl.classList.add(errorClass);
    } else if (containerEl) {
      containerEl.classList.remove(errorClass);
    }

    if (correctCount == template.length) {
      isCompleted = true;
      setInnerHtml(completeEl, isCompleted);
      answerInputEl.value = template; // remove auto space etc.
      if (containerEl) {
        containerEl.classList.remove(errorClass);
      }
      answerInputEl.disabled = true;
      completeHandler && completeHandler(newSpeed);
    }
  }

  function init(
    questionId,
    onComplete,
    onReset,
    options = { disablePaste: true, autoUpdate: true }
  ) {
    speedTestTempEl = document.getElementById('speedTest');
    if (!speedTestTempEl) {
      throw Error("Test template not found: id='speedTest'");
    }
    answerInputEl = document.getElementById('QR~' + questionId);
    if (!answerInputEl) {
      throw Error("Test input not found: id='QR~" + questionId + "'");
    }

    completeHandler = onComplete;
    resetHandler = onReset;

    // Optional elements
    overlayTempEl = document.getElementsByClassName(overlayClass)[0];
    containerEl = document.getElementsByClassName(containerClass)[0];
    statsEl = document.getElementById('speedStats');
    progressEl = document.getElementById('speedProg');
    completeEl = document.getElementById('speedCompleted');
    resetEl = document.getElementById('speedReset');

    reset();

    if (resetEl) {
      resetEl.onclick = function() {
        reset();
        resetHandler && resetHandler();
      };
    }

    if (options.disablePaste) {
      answerInputEl.onpaste = function(e) {
        e.preventDefault();
      };
    }

    if (options.autoUpdate) {
      updateEvent = setInterval(function() {
        if (!isCompleted && isStarted) {
          setInnerHtml(statsEl, wpm());
        }
      }, 1000);
    }

    speedTestHandler = function(event) {
      if (!isStarted) {
        isStarted = true;
      }

      if (!isCompleted && isStarted) {
        keyCount++;
        setTimeout(function() {
          update(event.target.value);
        }, 0);
      }
    };

    answerInputEl.addEventListener('keydown', speedTestHandler);
  }

  function reset() {
    startTime = Date.now();
    keyCount = 0;
    errorCount = 0;
    correctCount = 0;
    isCompleted = false;
    isStarted = false;
    setInnerHtml(overlayTempEl, '');
    setInnerHtml(completeEl, isCompleted);
    setInnerHtml(statsEl, '0');
    setInnerHtml(progressEl, '0%');
    answerInputEl.value = '';
    answerInputEl.disabled = false;

    if (containerEl) {
      containerEl.classList.remove(errorClass);
    }
  }

  function destroy() {
    answerInputEl.removeEventListener('keydown', speedTestHandler);
    clearInterval(updateEvent);
  }

  return {
    init,
    reset,
    destroy
  };
})();
