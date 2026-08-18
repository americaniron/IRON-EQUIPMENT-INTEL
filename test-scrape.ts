async function test() {
  const response = await fetch('https://www.machinio.com/cat-950e', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Length:", text.length);
  console.log("Snippet:", text.slice(0, 200));
}
test();
