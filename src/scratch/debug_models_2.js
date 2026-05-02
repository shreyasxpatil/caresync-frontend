const apiKey = 'AIzaSyCi4KwWJMe649Ek1ZwY6fLBiY6AHxlE3aw';
const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => console.error('Error:', err));
