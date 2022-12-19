function canonicalize(item) {
    return item.toLowerCase().replace(/ /g, '_');
}
function pretty(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
}
async function getStorageValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}
async function setStorageValue(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve();
        });
    });
}
function getUrlParameters(url) {
    const reg = new RegExp('\/([A-Za-z0-9-]+?)=([A-Za-z0-9_.+-]+)', 'g');
    let params = {};
    let match;
    while ((match = reg.exec(url)) !== null)
        params[match[1]] = match[2];
    return params;
}
async function crossEndoDoss(endo) {
    const nations = [];
    const lis = document.querySelectorAll('li');
    for (let i = 0; i < lis.length; i++) {
        const li = lis[i];
        const nationName = canonicalize(li.querySelector('.nnameblock').innerHTML);
        if (li.innerHTML.indexOf('was admitted') !== -1)
            nations.push(nationName);
        else if (li.innerHTML.indexOf('resigned') !== -1)
            nations.splice(nations.indexOf(nationName), 1);
    }
    if (endo)
        await setStorageValue('nationstoendorse', nations);
    else
        await setStorageValue('nationstodossier', nations);
    if (nations.length > 0)
        window.location.href = `/template-overall=none/nation=${nations[0]}`;
}
