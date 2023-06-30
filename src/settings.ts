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
<fieldset>
<legend>Automatically Scroll To Bottom of Nation Pages</legend>
<input type="checkbox" id="scroll-to-bottom">
<input type="button" class="button" id="set-scroll-to-bottom" value="Set">
</fieldset>
<div id="keybind-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <p>Press a key to bind to <span id="keybind-which">KEY</span>...</p>
    </div>
</div>
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

    // input element, which displays the key and allows changing it
    var inputElement: HTMLInputElement = document.createElement('input');
    inputElement.readOnly = true;
    inputElement.type = 'text';
    inputElement.value = prettyKey(await getKeybindKey(keybind));

    inputElement.addEventListener('click', async (e: MouseEvent): Promise<void> => {
        // update the text in the modal showing which key we're now binding
        let which = document.getElementById('keybind-which');
        which.innerText = keybind.displayName;

        // show the modal
        let modal = document.getElementById('keybind-modal');
        modal.style.display = 'block';

        // wait for a keypress (only once)
        let keyup = async (e: KeyboardEvent) => {
            if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey)
                return;
            if (modal.style.display == "none") // if the modal was already closed (clicking outside or such), don't do anything
                return;

            e.preventDefault();

            // set key and update the input element
            let key = e.key.toUpperCase();
            await setStorageValue(keybind.functionName, key);
            inputElement.value = prettyKey(key);

            // hide the modal again
            modal.style.display = 'none';
        };
        window.addEventListener('keyup', keyup, { "once": true });
    });

    // Set up a table row so that each of the buttons and text fields line up
    const tr: HTMLTableRowElement = document.createElement('tr');
    const td1: HTMLTableCellElement = document.createElement('td');
    td1.innerHTML += `<label>${keybind.displayName}</label>`;
    const td2: HTMLTableCellElement = document.createElement('td');
    // Give the text field the value of its currently stored key
    //td2.innerHTML += `<input type="text" id="${keybind.functionName}-key" value="${await getKeybindKey(keybind) || '<none>'}" readonly>`;
    td2.appendChild(inputElement);
    tr.appendChild(td1);
    tr.appendChild(td2);

    const disableTd = document.createElement('td');
    const disableButton = document.createElement('button');
    disableButton.textContent = "Disable";
    disableButton.classList.add("button");
    disableButton.addEventListener("click", async () => {
        // set value to `null` to indicate keybind is intentionally disabled
        await setStorageValue(keybind.functionName, null);

        // update displayed setting value
        inputElement.value = prettyKey(await getKeybindKey(keybind));
    });

    disableTd.appendChild(disableButton);
    tr.append(disableTd);

    const restoreTd = document.createElement('td');
    const restoreButton = document.createElement('button');
    restoreButton.textContent = "Restore Default";
    restoreButton.classList.add("button");
    restoreButton.addEventListener("click", async () => {
        await removeStorageValue(keybind.functionName);

        // update displayed setting value
        inputElement.value = prettyKey(await getKeybindKey(keybind));
    });

    restoreTd.appendChild(restoreButton);
    tr.append(restoreTd);

    // Add help text from modifiedCallbackDescription (if any)
    const helpTd = document.createElement("td");
    if (keybind.modifiedCallbackDescription) {
        helpTd.innerHTML = `<em>Hold shift to ${keybind.modifiedCallbackDescription}.</em>`;
    }
    tr.appendChild(helpTd);

    document.querySelector('#keys').appendChild(tr);
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
        (document.querySelector('#switchers') as HTMLTextAreaElement).value.split('\n').filter(element => element);
    for (let i = 0; i < switchers.length; i++)
        switchers[i] = canonicalize(switchers[i]);
    await setStorageValue('switchers', switchers);
}

async function setScrollToBottom(e: MouseEvent): Promise<void>
{
    const scrollToBottom: boolean = (document.querySelector('#scroll-to-bottom') as HTMLInputElement).checked;
    await setStorageValue('scrollToBottom', scrollToBottom);
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
    (document.querySelector('#scroll-to-bottom') as HTMLInputElement).checked =
        await getStorageValue('scrollToBottom') ?? false;

    // Other settings
    document.querySelector('#set-jump-point').addEventListener('click', setJumpPoint);
    document.querySelector('#set-prep-password').addEventListener('click', setPassword);
    document.querySelector('#set-switchers').addEventListener('click', setSwitchers);
    document.querySelector('#set-scroll-to-bottom').addEventListener('click', setScrollToBottom);

    // set up modal
    let modal = document.getElementById('keybind-modal');

    // move modal element for z-order purposes to the body
    // (otherwise, it won't cover the actual page)
    modal = document.body.appendChild(modal);

    // modal close button
    document.querySelector('.modal .close').addEventListener('click', (e) => {
        modal.style.display = "none";
    });

    // clicking anywhere outside of modal also closes it
    window.addEventListener('click', (e) => {
        if (e.target == modal)
            modal.style.display = "none";
    });


})();
