export default function queryDb (query, cb) {
  window.fetch(`http://localhost:3101?db=mhk&q=${query}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then(parsedResponse => {
      if (typeof parsedResponse === 'object') {
        cb(null, parsedResponse);
      } else {
        cb(parsedResponse);
      }
    })
    .catch(err => cb(err));
}
