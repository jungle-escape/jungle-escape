const _devUri = 'localhost';
const _prodUri = 'sangwookim.store';

const fetchEndpoint = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('No valid response');
    return await response.text();
  } catch (error) {
    return false;
  }
};

const _devPn = fetchEndpoint(`http://${_devUri}:8080/pn.js`);
const _prodPn = fetchEndpoint(`https://${_prodUri}/pn.js`);

const pn_loader = async () => {
  const devData = await _devPn;
  const prodData = await _prodPn;

  const script = document.createElement('script');
  if (devData) {
    script.textContent = devData;
    window._endpoint = _devUri;
  } else {
    script.textContent = prodData;
    window._endpoint = _prodUri;
  }
  document.head.appendChild(script);

};

(async () => {
  await pn_loader();
})();