let notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top'
    }
});
const keybinds = [
    {
        functionName: 'move',
        displayName: null,
        callback: () => {
            if (urlParams['page'] === 'reports') {
                const actionButton = document.querySelector('#action');
                if (actionButton)
                    actionButton.click();
                else
                    notyf.error("Action button not yet loaded.");
            }
            else {
                const moveButton = document.querySelector('button[name=move_region]');
                if (moveButton)
                    moveButton.click();
                else
                    notyf.error("No move button found. Are you already in the region?");
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'endorse',
        displayName: null,
        callback: () => {
            const endorseButton = document.querySelector('button[class="endorse button icon wa"]');
            if (endorseButton)
                endorseButton.click();
            else
                notyf.error("No endorse button found.");
        },
        modifiedCallback: async () => {
            if (urlParams['view'] === `region.${await getStorageValue('jp')}`) {
                await crossEndoDoss(true);
            }
            else if (urlParams['nation']) {
                let nationsToEndorse = await getStorageValue('nationstoendorse');
                const endorseButton = document.querySelector('button[class="endorse button icon wa"]');
                if (endorseButton && (nationsToEndorse.indexOf(urlParams['nation']) !== -1))
                    endorseButton.click();
                else if (nationsToEndorse.indexOf(urlParams['nation']) !== -1) {
                    const nextNation = nationsToEndorse[nationsToEndorse.indexOf(urlParams['nation']) + 1];
                    if (!nextNation)
                        return;
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
        callback: () => {
            location.reload();
        },
        modifiedCallback: null
    },
    {
        functionName: 'dossier',
        displayName: null,
        callback: () => {
            const dossierButton = document.querySelector('button[value=add]');
            if (dossierButton)
                dossierButton.click();
            else
                notyf.error("No dossier button found. Are you viewing a nation that is already in your dossier?");
        },
        modifiedCallback: async () => {
            if (urlParams['view'] && (urlParams['view'] !== `region.${await getStorageValue('jp')}`)) {
                await crossEndoDoss(false);
            }
            else if (urlParams['nation']) {
                let nationsToDossier = await getStorageValue('nationstodossier');
                const dossierButton = document.querySelector('button[value=add]');
                if (dossierButton && (nationsToDossier.indexOf(urlParams['nation']) !== -1))
                    dossierButton.click();
                else {
                    const nextNation = nationsToDossier[nationsToDossier.indexOf(urlParams['nation']) + 1];
                    if (!nextNation)
                        return;
                    nationsToDossier.splice(nationsToDossier.indexOf(urlParams['nation']), 1);
                    await setStorageValue('nationstodossier', nationsToDossier);
                    window.location.href = `/template-overall=none/nation=${nextNation}`;
                }
            }
            else if (urlParams['page'] === 'dossier') {
                let nationsToDossier = await getStorageValue('nationstodossier');
                const currentNation = new RegExp('nation=(.+)$')
                    .exec(document.querySelector('.info > a').href)[1];
                const nextNation = nationsToDossier[nationsToDossier.indexOf(currentNation) + 1];
                if (!nextNation)
                    return;
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
        callback: async () => {
            const moveButton = document.querySelector('button[name=move_region]');
            const jumpPoint = await getStorageValue('jp');
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
        callback: () => {
            const delegate = document.querySelector('#regioncontent > p:nth-child(1) > a');
            if (urlParams['region'])
                delegate.click();
            else if (urlParams['nation']) {
                const endorseButton = document.querySelector('button[class="endorse button icon wa"]');
                if (endorseButton)
                    endorseButton.click();
                else
                    notyf.error("No endorsement button found.");
            }
            else {
                notyf.error("Could not find delegate. Please try again from a region page.");
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'checkifupdated',
        displayName: "Check If Your Nation Updated",
        callback: () => {
            window.location.href = '/page=ajax2/a=reports/view=self/filter=change/';
        },
        modifiedCallback: null
    },
    {
        functionName: 'toggletemplate',
        displayName: "Toggle Template",
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
        callback: () => {
            window.location.href = '/template-overall=none/page=reports';
        },
        modifiedCallback: null
    },
    {
        functionName: 'regionajax',
        displayName: "Open Region Ajax2 Page",
        callback: () => {
            if (urlParams['region']) {
                window.location.href =
                    `/page=ajax2/a=reports/view=region.${urlParams['region']}/filter=move+member+endo`;
            }
            else {
                notyf.error("Could not load region activity. Are you viewing a region page?");
            }
        },
        modifiedCallback: null
    },
    {
        functionName: 'prep',
        displayName: null,
        callback: async () => {
            const switchers = await getStorageValue('switchers');
            const password = await getStorageValue('password');
            const jumpPoint = await getStorageValue('jp');
            const moveButton = document.querySelector('button[name=move_region]');
            if (!switchers || !password) {
                notyf.error("Could not find switchers and/or password. Have you added them in the Gauntlet settings?");
                return;
            }
            const currentSwitcher = await getStorageValue('currentswitcher');
            if (urlParams['page'] === 'un' && urlParams['template-overall'] === 'none')
                document.querySelector('button[type=submit]').click();
            else if (urlParams['page'] === 'UN_status') {
                const resendButton = document.querySelector('body > p.error > a');
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
                        `/template-overall=none/page=un?nation=${switchers[0]}&password=${password}&logging_in=1`;
                }
                else {
                    await setStorageValue('currentswitcher', currentSwitcher + 1);
                    window.location.href =
                        `/template-overall=none/page=un?nation=${switchers[currentSwitcher + 1]}&password=${password}&logging_in=1`;
                }
            }
            else {
                window.location.href =
                    `/template-overall=none/page=un?nation=${switchers[currentSwitcher]}&password=${password}&logging_in=1`;
            }
        },
        modifiedCallback: async () => {
            const switchers = await getStorageValue('switchers');
            if (urlParams['nation']) {
                const newIndex = switchers.indexOf(urlParams['nation']);
                if (newIndex !== -1) {
                    await setStorageValue('currentswitcher', newIndex);
                    notyf.success(`Synced index with ${urlParams['nation']}`);
                }
                else {
                    notyf.error(`This nation is not in your switchers list. Did you add it in the settings?`);
                }
            }
        },
        modifiedCallbackDescription: "set the switcher to start prepping from (while viewing its nation page)"
    }
];
let keyFunctions = {};
const urlParams = getUrlParameters(document.URL);
document.addEventListener('keyup', (e) => {
    const textboxSelected = document.querySelector('input:focus, textarea:focus') !== null;
    const key = e.key.toUpperCase();
    if (e.altKey || e.ctrlKey || textboxSelected)
        return;
    else if (e.shiftKey && (key in keyFunctions) && (keyFunctions[key].modifiedCallback !== null))
        keyFunctions[key].modifiedCallback();
    else if (key in keyFunctions)
        keyFunctions[key].callback();
});
(async () => {
    for (let i = 0; i < keybinds.length; i++) {
        const currentKeybind = keybinds[i];
        keyFunctions[await getStorageValue(currentKeybind.functionName)] = {
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
})();
