function addButton(label: string, callback: (e: MouseEvent) => void)
{
    const button: HTMLInputElement = document.createElement('input');
    button.type = 'button';
    button.addEventListener('click', callback);
    button.id = label.toLowerCase().replace(/ /g, '-');
    button.value = label;
    const belDiv: HTMLDivElement = document.createElement('div');
    button.classList.add('button');
    belDiv.classList.add('bel');
    belDiv.appendChild(button);
    document.querySelector('#loginswitcher').parentNode.insertBefore(belDiv, document.querySelector('#loginswitcher'));
}

addButton('Gauntlet Settings', (e: MouseEvent): void =>
{
    window.location.href = '/page=blank/gauntlet=settings';
});