document.querySelector('#content').innerHTML = `<h1>Gauntlet Settings</h1>
<fieldset>
<legend>Keys</legend>
<table>
<tbody id="keys">

</tbody>
</table>
</fieldset>
<fieldset>
<legend>Miscellaneous</legend>
<table>
<tbody>
<tr>
<td><label for="jump-point">Jump Point</label></td>
<td><input type="text" id="jump-point"></td>
<td><input type="button" class="button" id="set-jump-point" value="Set"></td>
</tr>
</tbody>
</table>
</fieldset>
<fieldset>
<legend>Prepping</legend>
<table>
<tbody>
<tr>
<td><label for="prep-password">Password</label></td>
<td><input type="text" id="prep-password"></td>
<td><input type="button" class="button" id="set-prep-password" value="Set"></td>
</tr>
<tr>
<td><label for="switchers">Switchers</label></td>
<td><textarea id="switchers" placeholder="Switcher 1\nSwitcher 2\nSwitcher 3"></textarea></td>
<td><input type="button" class="button" id="set-switchers" value="Set"></td>
</tr>
<tr>
<td colspan="3"><em>Enter one switcher on each line. Switchers must share the same password.</em></td>
</tr>
</tbody>
</table>
</fieldset>
`;

/**
 * Create a text field and corresponding button for setting the key of a function.
 * @param keybind   the keybind to set
 */
async function addKeySetter(keybind: Keybind)
{
    // If no display name was provided, simply give it the title case version of the function name
    if (keybind.displayName === null)
        keybind.displayName = pretty(keybind.functionName);

    // Create the "Set" button
    const setKeyInput: HTMLInputElement = document.createElement('input');
    setKeyInput.type = 'button';
    setKeyInput.value = 'Set';
    setKeyInput.classList.add('button');
    setKeyInput.addEventListener('click', async (e: MouseEvent): Promise<void> =>
    {
        console.log(`Setting ${keybind.functionName}`);
        const key: string = (document.querySelector(`#${keybind.functionName}-key`) as HTMLInputElement).value
            .toUpperCase();
        await setStorageValue(keybind.functionName, key);
    });

    // Set up a table row so that each of the buttons and text fields line up
    const tr: HTMLTableRowElement = document.createElement('tr');
    const td1: HTMLTableCellElement = document.createElement('td');
    td1.innerHTML += `<label>${keybind.displayName}</label>`;
    const td2: HTMLTableCellElement = document.createElement('td');
    // Give the text field the value of its currently stored key
    td2.innerHTML +=
        `<input type="text" id="${keybind.functionName}-key" value="${await getStorageValue(keybind.functionName) || '?'}">`;
    const td3: HTMLTableCellElement = document.createElement('td');
    td3.appendChild(setKeyInput);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    document.querySelector('#keys').appendChild(tr);

    // Add help text from modifiedCallbackDescription (if any)
    if (keybind.modifiedCallbackDescription) {
        const helpTr = document.createElement('tr');

        const helpTd = document.createElement("td");
        helpTd.colSpan = 3;
        helpTd.style.paddingBottom = "10px";
        helpTd.innerHTML = `<em>Hold shift to ${keybind.modifiedCallbackDescription}.</em>`;
        helpTr.appendChild(helpTd);
        document.querySelector('#keys').appendChild(helpTr);
    }
}

async function setJumpPoint(e: MouseEvent): Promise<void>
{
    const jumpPoint: string =
        canonicalize((document.querySelector('#jump-point') as HTMLInputElement).value);
    await setStorageValue('jp', jumpPoint);
}

async function setPassword(e: MouseEvent): Promise<void>
{
    const password: string = (document.querySelector('#prep-password') as HTMLInputElement).value;
    await setStorageValue('password', password);
}

async function setSwitchers(e: MouseEvent): Promise<void>
{
    let switchers: string[] =
        (document.querySelector('#switchers') as HTMLTextAreaElement).value.split('\n');
    for (let i = 0; i < switchers.length; i++)
        switchers[i] = canonicalize(switchers[i]);
    await setStorageValue('switchers', switchers);
}

(async () =>
{
    // Set up the keybind setting form
    for (let i = 0; i < keybinds.length; i++)
        await addKeySetter(keybinds[i]);

    // Set known values
    (document.querySelector('#jump-point') as HTMLInputElement).value = await getStorageValue('jp');
    (document.querySelector('#prep-password') as HTMLInputElement).value =
        await getStorageValue('password') ?? '';
    const switchers: string[] = await getStorageValue('switchers');
    if (switchers) {
        const switchersList = document.querySelector('#switchers') as HTMLTextAreaElement;
        for (let i = 0; i < switchers.length; i++) {
            switchersList.value += `${switchers[i]}\n`;
        }
    }

    // Other settings
    document.querySelector('#set-jump-point').addEventListener('click', setJumpPoint);
    document.querySelector('#set-prep-password').addEventListener('click', setPassword);
    document.querySelector('#set-switchers').addEventListener('click', setSwitchers);
})();