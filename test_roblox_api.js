async function test() {
  try {
    const res1 = await fetch('https://catalog.roblox.com/v1/search/items?category=Models&keyword=tree&limit=10');
    console.log('Catalog API:', await res1.text());
  } catch(e) { console.error('Catalog Error:', e); }

  try {
    // Toolbox API might be better for Creator Marketplace
    const res2 = await fetch('https://apis.roblox.com/toolbox-service/v1/items?category=FreeModels&keyword=tree&limit=5');
    console.log('Toolbox API:', await res2.text());
  } catch(e) { console.error('Toolbox Error:', e); }
}
test();
