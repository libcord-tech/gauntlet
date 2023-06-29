(async () => {
    const autoScrollEnabled = await getStorageValue("scrollToBottom") ?? false;

    if (autoScrollEnabled) {
        window.scrollTo(0, document.body.scrollHeight);
    }
})();