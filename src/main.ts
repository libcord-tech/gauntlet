interface Keybind
{
    functionName: string;
    displayName: string | null;
    defaultKey?: string;
    callback: Function;
    modifiedCallback: Function | null;
    modifiedCallbackDescription?: string;
    // will display on settings page as "Hold shift to {modifiedCallbackDescription}."
}

let notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top'
    }
});

const keybinds: Keybind[] = [
    {
        functionName: 'move',
        displayName: null,
        defaultKey: 'M',
        callback: () => {
            if (urlParams['page'] === 'reports') {
                const actionButton: HTMLInputElement = document.querySelector('#action');
                if (actionButton)
                    actionButton.click();
                else
                    notyf.error("Action button not yet loaded.")
            } else {
                const moveButton: HTMLButtonElement =
                    document.querySelector('button[name=move_region]') as HTMLButtonElement;
                if (moveButton)
                    moveButton.click();
                else
                    notyf.error("No move button found. Are you already in the region?")
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'endorse',
        displayName: null,
        defaultKey: 'E',
        callback: () => {
            const endorseButton: HTMLButtonElement =
                (document.querySelector('button[class="endorse button icon wa"]') as HTMLButtonElement);
            if (endorseButton)
                endorseButton.click();
            else
                notyf.error("No endorse button found.");
        },
        modifiedCallback: async () => {
            if (urlParams['view'] === `region.${await getStorageValue('jp')}`) {
                const returnPage = new URL(location.href);
                returnPage.searchParams.append("gauntlet-success", "All nations endorsed.")
                await setStorageValue('endorsereturnpage', returnPage.href);
                await crossEndoDoss(true);
            }
            else if (urlParams['nation']) {
                let nationsToEndorse: string[] = await getStorageValue('nationstoendorse');
                const endorseButton: HTMLButtonElement =
                    (document.querySelector('button[class="endorse button icon wa"]') as HTMLButtonElement);
                if (endorseButton && (nationsToEndorse.indexOf(urlParams['nation']) !== -1))
                    endorseButton.click();
                else if (nationsToEndorse.indexOf(urlParams['nation']) !== -1) {
                    const nextNation: string = nationsToEndorse[nationsToEndorse.indexOf(urlParams['nation']) + 1];
                    if (!nextNation) {
                        const returnPage = await getStorageValue('endorsereturnpage');
                        await removeStorageValue('endorsereturnpage');
                        if (returnPage)
                            location.assign(returnPage);
                        return;
                    }
                    nationsToEndorse.splice(nationsToEndorse.indexOf(urlParams['nation']), 1);
                    await setStorageValue('nationstoendorse', nationsToEndorse);
                    window.location.href = `/template-overall=none/nation=${nextNation}`;
                }
            }
        },
        modifiedCallbackDescription: "save nations to cross from a region activity page and then cycle through those nations and endorse them"
    },
    {
        functionName: 'refresh',
        displayName: null,
        defaultKey: 'N',
        callback: () => {
            location.reload();
        },
        modifiedCallback: null
    },
    {
        functionName: 'dossier',
        displayName: null,
        defaultKey: 'D',
        callback: () => {
            const dossierButton: HTMLButtonElement =
                document.querySelector('button[value=add]') as HTMLButtonElement;
            if (dossierButton)
                dossierButton.click();
            else
                notyf.error("No dossier button found. Are you viewing a nation that is already in your dossier?")
        },
        modifiedCallback: async () => {
            if (urlParams['view'] && (urlParams['view'] !== `region.${await getStorageValue('jp')}`)) {
                const returnPage = new URL(location.href);
                returnPage.searchParams.append("gauntlet-success", "All nations added to dossier.")
                await setStorageValue('dossierreturnpage', returnPage.href);
                await crossEndoDoss(false);
            }
            else if (urlParams['nation']) {
                let nationsToDossier: string[] = await getStorageValue('nationstodossier');
                const dossierButton: HTMLButtonElement =
                    document.querySelector('button[value=add]') as HTMLButtonElement;
                if (dossierButton && (nationsToDossier.indexOf(urlParams['nation']) !== -1))
                    dossierButton.click();
                else {
                    const nextNation: string = nationsToDossier[nationsToDossier.indexOf(urlParams['nation']) + 1];
                    if (!nextNation) {
                        const returnPage = await getStorageValue('dossierreturnpage');
                        await removeStorageValue('dossierreturnpage');
                        if (returnPage)
                            location.assign(returnPage);
                        return;
                    }
                    nationsToDossier.splice(nationsToDossier.indexOf(urlParams['nation']), 1);
                    await setStorageValue('nationstodossier', nationsToDossier);
                    window.location.href = `/template-overall=none/nation=${nextNation}`;
                }
            }
            else if (urlParams['page'] === 'dossier') {
                let nationsToDossier: string[] = await getStorageValue('nationstodossier');
                const currentNation: string = new RegExp('nation=(.+)$')
                    .exec((document.querySelector('.info > a') as HTMLAnchorElement).href)[1];
                const nextNation: string = nationsToDossier[nationsToDossier.indexOf(currentNation) + 1];
                if (!nextNation) {
                    const returnPage = await getStorageValue('dossierreturnpage');
                    await removeStorageValue('dossierreturnpage');
                    if (returnPage)
                        location.assign(returnPage);
                    return;
                }
                nationsToDossier.splice(nationsToDossier.indexOf(currentNation), 1);
                await setStorageValue('nationstodossier', nationsToDossier);
                window.location.href = `/template-overall=none/nation=${nextNation}`;
            }
        },
        modifiedCallbackDescription: "save nations to doss from a region activity page and then cycle through those nations and doss them"
    },
    {
        functionName: 'backtojp',
        displayName: "Move Back to Jump Point",
        defaultKey: 'B',
        callback: async () => {
            const moveButton: HTMLButtonElement =
                document.querySelector('button[name=move_region]') as HTMLButtonElement;
            const jumpPoint: string = await getStorageValue('jp');
            if ((urlParams['region'] === jumpPoint) && moveButton)
                moveButton.click();
            else if (urlParams['region'] !== jumpPoint)
                window.location.href = `/template-overall=none/region=${jumpPoint}`;
            else
                notyf.error("No move button found. Are you already in your jump point?");
        },
        modifiedCallback: null
    },
    {
        functionName: 'endodel',
        displayName: "Endorse WA Delegate",
        defaultKey: 'W',
        callback: () => {
            const delegate: HTMLAnchorElement =
                document.querySelector('#regioncontent > p > i.icon-wa ~ a') as HTMLAnchorElement;
            if (urlParams['region'])
                delegate.click();
            else if (urlParams['nation']) {
                const endorseButton: HTMLButtonElement =
                    (document.querySelector('button[class="endorse button icon wa"]') as HTMLButtonElement);
                if (endorseButton)
                    endorseButton.click();
                else
                    notyf.error("No endorsement button found.")
            } else {
                notyf.error("Could not find delegate. Please try again from a region page.")
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'checkifupdated',
        displayName: "Check If Your Nation Updated",
        defaultKey: 'U',
        callback: () => {
            window.location.href = '/page=ajax2/a=reports/view=self/filter=change/';
        },
        modifiedCallback: null
    },
    {
        functionName: 'toggletemplate',
        displayName: "Toggle Template",
        defaultKey: 'T',
        callback: () => {
            if (urlParams['template-overall'])
                window.location.href = document.URL.replace('template-overall=none/', '');
            else {
                window.location.href = `/template-overall=none/${document.URL.replace('https://www.nationstates.net/', '')}`;
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'activitypage',
        displayName: "Open Activity Page",
        defaultKey: 'A',
        callback: () => {
            window.location.href = '/page=activity/view=world/filter=move+member+endo';
        },
        modifiedCallback: null
    },
    // {
    //     functionName: 'appointro',
    //     displayName: "Appoint As Regional Officer",
    //     callback: () => {},
    //     modifiedCallback: null
    // },
    {
        functionName: 'reports',
        displayName: "Open Reports Page",
        defaultKey: ' ',
        callback: () => {
            window.location.href = '/template-overall=none/page=reports';
        },
        modifiedCallback: null
    },
    {
        functionName: 'regionajax',
        displayName: "Open Region Ajax2 Page",
        defaultKey: 'H',
        callback: () => {
            if (urlParams['region']) {
                window.location.href =
                    `/page=ajax2/a=reports/view=region.${urlParams['region']}/filter=move+member+endo`;
            } else {
                notyf.error("Could not load region activity. Are you viewing a region page?")
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'prep',
        displayName: null,
        defaultKey: 'P',
        callback: async () =>
        {
            const switchers = await getStorageValue('switchers');
            const password = await getStorageValue('password');
            const jumpPoint: string = await getStorageValue('jp');
            const moveButton: HTMLButtonElement =
                document.querySelector('button[name=move_region]') as HTMLButtonElement;
            if (!switchers || !password) {
                notyf.error("Could not find switchers and/or password. Have you added them in the Gauntlet settings?")
                return;
            }
            const currentSwitcher: number = await getStorageValue('currentswitcher');

            const startPage = getStorageValue('prepDossClear') ? 'dossier' : 'un';

            if (urlParams['page'] === 'dossier' && urlParams['template-overall'] === 'none') {
                if (document.querySelector('button[name="clear_dossier"]'))
                {
                    const chk = document.querySelector<HTMLInputElement>('input[name="chk"]').value;
                    location.assign(`/template-overall=none/page=dossier?chk=${chk}&clear_dossier=1`);
                }
                else
                    location.assign(`/template-overall=none/page=un`);
            }
            else if (urlParams['page'] === 'un' && urlParams['template-overall'] === 'none')
                (document.querySelector('button[type=submit]') as HTMLButtonElement).click();
            else if (urlParams['page'] === 'UN_status') {
                const resendButton = document.querySelector('body > p.error > a') as HTMLAnchorElement;
                if (resendButton !== null)
                    resendButton.click();
                else
                    window.location.href = `/template-overall=none/region=${jumpPoint}`;
            }
            else if (urlParams['region'] === jumpPoint && moveButton !== null)
                moveButton.click();
            else if (urlParams['page'] === 'change_region' || (urlParams['region'] && moveButton === null)) {
                if (currentSwitcher === (switchers.length - 1)) {
                    await setStorageValue('currentswitcher', 0);
                    window.location.href =
                        `/template-overall=none/page=${startPage}?nation=${switchers[0]}&password=${password}&logging_in=1`;
                }
                else {
                    await setStorageValue('currentswitcher', currentSwitcher + 1);
                    window.location.href =
                        `/template-overall=none/page=${startPage}?nation=${switchers[currentSwitcher + 1]}&password=${password}&logging_in=1`;
                }
            }
            else {
                window.location.href =
                    `/template-overall=none/page=${startPage}?nation=${switchers[currentSwitcher]}&password=${password}&logging_in=1`;
            }
        },
        modifiedCallback: async () =>
        {
            const switchers = await getStorageValue('switchers');
            if (urlParams['nation']) {
                const newIndex = switchers.indexOf(urlParams['nation']);
                if (newIndex !== -1) {
                    await setStorageValue('currentswitcher', newIndex);
                    notyf.success(`Synced index with ${urlParams['nation']}`);
                } else {
                    notyf.error(`This nation is not in your switchers list. Did you add it in the settings?`)
                }
            }
        },
        modifiedCallbackDescription: "set the switcher to start prepping from (while viewing its nation page)"
    },
    {
        functionName: 'back',
        displayName: "Back to Previous Page",
        defaultKey: ',',
        callback: () => {
            history.back();
        },
        modifiedCallback: null
    },
    {
        functionName: 'resign',
        displayName: "Resign from WA",
        defaultKey: "'",
        callback: () => {
            // if not a WA member
            if (urlParams['page'] === 'un' && document.querySelector("input[value='join_UN']")) {
                notyf.error("It doesn't seem like you're in the WA.");
                return;
            }

            const chkInput: HTMLInputElement | null = document.querySelector("input[name=chk]");

            if (chkInput) {
                location.assign(`/template-overall=none/page=UN_status?action=leave_UN&chk=${chkInput.value}&submit=1`);
            } else {
                location.assign("/template-overall=none/page=un");
            }
        },
        modifiedCallback: null
    },
    {

        functionName: 'closetab',
        displayName: "Close Current Tab",
        callback: () =>
        {
            chrome.runtime.sendMessage({command: "closeTab"});
        },
        modifiedCallback: null
    },
    {
        functionName: 'checkupdatingregions',
        displayName: "Check Updating Regions",
        defaultKey: 'G',
        callback: () =>
        {
            window.location.href = '/page=ajax2/a=reports/view=world/filter=change';
        },
        modifiedCallback: null
    },
    {
        functionName: 'cleardossier',
        displayName: "View/Clear Dossier",
        defaultKey: 'X',
        callback: () =>
        {
            if (urlParams['page'] === 'dossier')
            {
                const chk = document.querySelector<HTMLInputElement>('input[name="chk"]').value;
                location.assign(`/template-overall=none/page=dossier?chk=${chk}&clear_dossier=1`);
            }
            else
                location.assign('/template-overall=none/page=dossier');
        },
        modifiedCallback: null
    }
];

let keyFunctions: object = {};
const urlParams: object = getUrlParameters(document.URL);

document.addEventListener('keyup', (e: KeyboardEvent) =>
{
    const textboxSelected: boolean = document.querySelector('input:focus, textarea:focus') !== null;

    if (!('key' in e))
        return;

    const key = e.key.toUpperCase();
    if (e.altKey || e.ctrlKey || textboxSelected)
        return;
    else if (e.shiftKey && (key in keyFunctions) && (keyFunctions[key].modifiedCallback !== null))
        keyFunctions[key].modifiedCallback();
    else if (key in keyFunctions)
        keyFunctions[key].callback();
});

(async () =>
{
    // Load keybind keys
    for (let i = 0; i < keybinds.length; i++) {
        const currentKeybind: Keybind = keybinds[i];
        keyFunctions[await getKeybindKey(currentKeybind)] = {
            callback: currentKeybind.callback,
            modifiedCallback: currentKeybind.modifiedCallback
        };
    }
    // Set up some default values for settings if they aren't set
    if (await getStorageValue('jp') === undefined)
        await setStorageValue('jp', 'artificial_solar_system');
    if (await getStorageValue('nationstoendorse') === undefined)
        await setStorageValue('nationstoendorse', []);
    if ((await getStorageValue('switchers') !== undefined) &&
        (await getStorageValue('currentswitcher') === undefined)) {
        await setStorageValue('currentswitcher', 0);
    }

    // Check query parameters for Gauntlet messages
    const currentPage = new URL(location.href);
    if (currentPage.searchParams.has("gauntlet-success")) {
        notyf.success(currentPage.searchParams.get("gauntlet-success"));

        // remove search param to prevent triggering message again on reload/navigation back to page
        currentPage.searchParams.delete("gauntlet-success");
        window.history.replaceState({}, '', currentPage); // use replaceState to avoid page reload
    }
})();
