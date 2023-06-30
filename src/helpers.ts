function canonicalize(item: string)
{
    return item.toLowerCase().replace(/ /g, '_');
}

function pretty(item: string)
{
    return item.substring(0, 1).toUpperCase() + item.substring(1);
}

function prettyKey(item?: string)
{
    if (item == null)
        return "<none>";
    if (item == ' ')
        return "Space";
    if (item.length == 1)
        return item.toUpperCase();
    return item;
}

async function getKeybindKey(keybind: Keybind): Promise<string | null>
{
    var storedVal = await getStorageValue(keybind.functionName);
    return <string>storedVal || keybind.defaultKey;
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

async function removeStorageValue(key: string | string[]): Promise<void>
{
    return new Promise((resolve) =>
    {
        chrome.storage.local.remove(key, () => 
        {
            resolve();
        })
    })
}

function getUrlParameters(url: string): object
{
    const reg: RegExp = new RegExp('\/([^\/]+?)=([^\/]+?)(?=$|\/)', 'g');
    const path = new URL(url).pathname;
    let params: object = {};
    let match: string[];
    while ((match = reg.exec(path)) !== null)
        params[match[1]] = match[2];
    return params;
}

async function crossEndoDoss(endo: boolean)
{
    const nations: string[] = [];
    const processedNations = new Set();
    const lis = document.querySelectorAll('li');
    lis.forEach((li) => {
        // ignore non-World Assembly happenings
        if (!li.textContent.includes("World Assembly"))
            return;
        
        const nationName = canonicalize(li.querySelector('.nnameblock').textContent);

        // only check the most recent World Assembly happening for each nation
        if (processedNations.has(nationName))
            return;
        
        if (li.textContent.includes("was admitted"))
            nations.push(nationName);
        
        processedNations.add(nationName);
    });

    if (endo)
        await setStorageValue('nationstoendorse', nations);
    else
        await setStorageValue('nationstodossier', nations);
    if (nations.length > 0)
        window.location.href = `/template-overall=none/nation=${nations[0]}`;
}

function login(nation: string, password: string) {
    document.querySelector<HTMLInputElement>("#loginbox > form input[name=nation]").value = nation;
    document.querySelector<HTMLInputElement>("#loginbox > form input[name=password]").value = password;
    document.querySelector<HTMLButtonElement>("#loginbox > form button[name=submit]").click();
}