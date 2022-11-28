function canonicalize(item: string)
{
    return item.toLowerCase().replace(/ /g, '_');
}

function pretty(item: string)
{
    return item.substring(0, 1).toUpperCase() + item.substring(1);
}

async function getStorageValue(key: string): Promise<any>
{
    return new Promise((resolve, reject) =>
    {
        chrome.storage.local.get(key, (result) =>
        {
            resolve(result[key]);
        });
    });
}

async function setStorageValue(key: string, value: any): Promise<void>
{
    return new Promise((resolve, reject) =>
    {
        chrome.storage.local.set({[key]: value}, () =>
        {
            resolve();
        });
    });
}

function getUrlParameters(url: string): object
{
    const reg: RegExp = new RegExp('\/([A-Za-z0-9-]+?)=([A-Za-z0-9_.+-]+)', 'g');
    let params: object = {};
    let match: string[];
    while ((match = reg.exec(url)) !== null)
        params[match[1]] = match[2];
    return params;
}

async function crossEndoDoss(endo: boolean)
{
    const nations: string[] = [];
    const lis: NodeList = document.querySelectorAll('li');
    for (let i = 0; i < lis.length; i++) {
        const li: HTMLUListElement = lis[i] as HTMLUListElement;
        const nationName: string = canonicalize(li.querySelector('.nnameblock').innerHTML);
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