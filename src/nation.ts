(async () => {
    const autoScrollEnabled = await getStorageValue("scrollToBottom") ?? false;
    console.log(autoScrollEnabled);

    if (autoScrollEnabled) {
        window.scrollTo(0, document.body.scrollHeight);
    }
})();