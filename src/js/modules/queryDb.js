export default function queryDb (query, cb) {
  window.fetch(`http://localhost:3101?db=mhk&q=${query}`)
    .then(response => response.json())
    .then(json => cb(null, json))
    .catch(err => cb(err));
}
