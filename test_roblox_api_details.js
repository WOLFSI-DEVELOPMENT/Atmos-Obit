async function test() {
  const req = {
    "items": [
      { "itemType": "Asset", "id": 12314868715 },
      { "itemType": "Asset", "id": 18112883440 }
    ]
  };
  
  const res = await fetch('https://catalog.roblox.com/v1/catalog/items/details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  
  console.log(await res.text());
}
test();
