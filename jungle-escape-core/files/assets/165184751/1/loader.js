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
  let script = document.createElement('script');

  try {
    const devData = await _devPn;
    const prodData = await _prodPn;

    if (devData) {
      console.log("fetched dev data");
      script.textContent = devData;
      window._endpoint = _devUri;
    } else if (prodData) {
      console.log("fetched prod data");
      script.textContent = prodData;
      window._endpoint = _prodUri;
    } else {
      console.error("No data available for the script");
      return;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return;
  }

  document.head.appendChild(script);
};

(async () => {
  await pn_loader();
})();