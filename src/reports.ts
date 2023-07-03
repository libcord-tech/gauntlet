(() =>
{
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Refresh');
    button.setAttribute('id', 'action');
    button.addEventListener('click', (e) =>
    {
        (e.target as HTMLInputElement).disabled = true;
        const moveRegion: HTMLAnchorElement = document.querySelector('.rlink:nth-of-type(3)');
        if (moveRegion && moveRegion.parentElement.innerHTML.indexOf('relocated from') !== -1)
            moveRegion.click();
        else
            location.reload();
    });
    document.body.insertBefore(button, document.querySelector('h1').nextSibling);

    const loadTime = (performance.getEntriesByName(location.href, 'navigation')[0] as PerformanceNavigationTiming).domContentLoadedEventEnd;
    document.querySelector("h1").textContent += ` (${loadTime.toFixed(2)} ms)`
})();
