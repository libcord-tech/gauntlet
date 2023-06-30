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

function login(nation: string, password: string, redirect: string = "/") {
    if (document.querySelector("#loginbox:has(input[name=nation], input[name=password], button[name=submit])")) {
        document.querySelector<HTMLFormElement>("#loginbox > form").action = `${redirect}?userclick=${Date.now()}&x-gauntlet-useragent`;
        document.querySelector<HTMLInputElement>("#loginbox > form input[name=nation]").value = nation;
        document.querySelector<HTMLInputElement>("#loginbox > form input[name=password]").value = password;
        document.querySelector<HTMLButtonElement>("#loginbox > form button[name=submit]").click();
    } else {
        const loginForm = document.createElement("form");
        loginForm.action = `${redirect}?userclick=${Date.now()}&x-gauntlet-useragent`;
        loginForm.method = "POST";
        loginForm.target = "_top";
        loginForm.hidden = true;

        const loggingInInput = document.createElement("input");
        loggingInInput.name = "logging_in";
        loggingInInput.value = "1";

        const nationInput = document.createElement("input");
        nationInput.name = "nation";
        nationInput.value = nation;
        nationInput.autocomplete = "off";

        const passwordInput = document.createElement("input");
        passwordInput.name = "password";
        passwordInput.type = "password";
        passwordInput.value = password;
        passwordInput.autocomplete = "off";

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.name = "submit";
        submitButton.value = "Login";

        loginForm.append(loggingInInput, nationInput, passwordInput, submitButton);
        document.body.appendChild(loginForm);
        submitButton.click();
    }
}
