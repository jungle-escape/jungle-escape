const _devUri = 'localhost';
const _devUrl = `http://${_devUri}:8080/pn.js`;
const _prodUri = 'sangwookim.store';
const _prodUrl = `https://${_prodUri}/pn.js`;

window.__pn_loader = async () => {

  let script = document.createElement('script');

  await fetch(_devUrl)
    .then(async (response) => {
      if (!response.ok) throw new Error('[loader.js] No valid response from dev');
      script.textContent = await response.text();
      if (!script.textContent) throw new Error('[loader.js] No valid script returned from dev');
      console.info(`[loader.js] pn.js fetched from dev.`);
      window._endpoint = _devUri;
      document.head.appendChild(script);
    })
    .catch(error => {
      console.error("[loader.js] Fetching dev server error:", error);
    });
  

  if (script.textContent) {
    return;
  }
  

  await fetch(_prodUrl)
    .then(async (response) => {
      if (!response.ok) throw new Error('[loader.js] No valid response from prod');
      script.textContent = await response.text();
      if (!script.textContent) throw new Error('[loader.js] No valid script returned from prod');
      console.info(`[loader.js] pn.js fetched from prod.`);
      window._endpoint = _prodUri;
      document.head.appendChild(script);
    })
    .catch(error => {
      console.error("[loader.js] Fetching prod server error:", error);
    });

};

(async () => {
  await window.__pn_loader();
})();