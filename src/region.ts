(() =>
{
    const moveButton: HTMLButtonElement = document.querySelector('button[name=move_region]');
    if (moveButton) {
        const localid = (document.querySelector('input[name=localid]') as HTMLInputElement).value;
        moveButton.addEventListener('click', (e) =>
        {
            moveButton.disabled = true;
            e.preventDefault();
            window.location.href = `/template-overall=none/page=change_region?localid=${localid}&region_name=${urlParams['region']}&move_region=1`;
        });
    }
})();