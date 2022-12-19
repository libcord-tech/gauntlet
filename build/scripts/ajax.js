const links = document.querySelectorAll('a');
for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const linkParams = getUrlParameters(link.href);
    if (linkParams['nation'])
        link.href = `/template-overall=none/nation=${linkParams['nation']}`;
    else if (linkParams['region'])
        link.href = `/template-overall=none/region=${linkParams['region']}`;
}
