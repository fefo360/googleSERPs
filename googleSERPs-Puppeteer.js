const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    // Launch browser with args options
    const browser = await puppeteer.launch({ 
        headless: true,
        args: [
            "--no-sandbox", // Recommended for running in a Docker container
            "--disable-setuid-sandbox", // For sandboxing
            "--disable-infobars", // Disables info bars in Chrome
            "--disable-web-security", // Disable web security (be cautious)
            "--disable-features=IsolateOrigins,site-per-process", // Additional spoofing args
            "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", // Mac User Agent spoofing
            "--window-size=1920x1080", // Set the window size to simulate a real desktop user
            "--disable-blink-features=AutomationControlled", // Prevent Chrome from detecting automation
            "--disable-dev-shm-usage", // Reduce the likelihood of detection on certain systems
            "--remote-debugging-port=9222", // Disable Chrome's internal debugging tools to prevent detection
            "--start-maximized", // Start the window maximized
            "--disable-extensions" // Disable extensions
        ]
    });
    const page = await browser.newPage();

    // Navigate to a website
    await page.goto(`http://www.google.com/search?q=dog+food&num=100`);

    // Extract page content
    const htmlContent = await page.content();
    // console.log(htmlContent);

    const $ = cheerio.load(htmlContent);

    let results = [];

    $("#search .tF2Cxc").each((_, element) => {
        try {
            // Extract URL
            let linkTag = $(element).find("a");
            let url = linkTag.attr("href");

            // Extract page title
            let titleTag = $(element).find("h3");
            let pageTitle = titleTag.text().trim();

            // Extract description
            let descTag = $(element).find(".VwiC3b");
            let description = descTag.text().trim();

            if (url && pageTitle && description) {
                results.push({
                    url,
                    page_title: pageTitle,
                    description,
                });
            }
        } catch (error) {
            console.log(`Skipping a result due to an error: ${error}`);
        }
    });

    console.log(results);
    console.log('With Puppeteer')

    // Close the browser
    await browser.close();
})();
