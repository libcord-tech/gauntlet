(() => {
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Refresh');
    button.setAttribute('id', 'action');
    button.addEventListener('click', (e) => {
        e.target.disabled = true;
        const moveRegion = document.querySelector('.rlink:nth-of-type(3)');
        if (moveRegion && moveRegion.parentElement.innerHTML.indexOf('relocated from') !== -1)
            moveRegion.click();
        else
            location.reload();
    });
    document.body.insertBefore(button, document.querySelector('h1').nextSibling);
})();
