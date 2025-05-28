const puppeteer = require("puppeteer")
const config = require("dotenv").config();

exports.snapGithuppageFunction = async (req, res) => {
    try {

        const url = "https://github.com/login"

        const getreponame = async () => {

            // เปิด Browser 
            const browser = await puppeteer.launch()
            // เปิด page 
            const page = await browser.newPage()

            await page.goto(url)
            await page.screenshot({ path: 'screenshots.png' })
            await browser.close();
            return "Snapsuccess"
        }
        const snappage = await getreponame()
        res.send(`${snappage}`)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: `${err}` })
    }
}

exports.getRepoName = async (req, res) => {
    try {

        const url = "https://github.com/login"

        //user account
        const USER = {
            username: process.env.GITHUB_USER,
            password: process.env.GITHUB_PASS,
            recoverycode: process.env.GITHUB_RECOVERYCODE,
        }

        //dom element selectors
        const SELECTOR = {
            username: "#login_field",
            password: "#password",
            recoverycode: "#recovery_code",
            btnSubmit: "form input[type=submit]",
            verifyUrl: 'a[data-test-selector="recovery-code-link"]',
            btnVerify: 'button[type="submit"].btn-primary',
            btnMenu: 'button[aria-label="Open user navigation menu"]',
            btnShowMore: "form.ajax-pagination-form > button[type=submit",
            repositoryName: "#repos-container li.source > div > a",
        }

        const getdatas = async () => {
            const browser = await puppeteer.launch({ headless: false })
            const page = await browser.newPage()

            await page.goto(url)
            await page.click(SELECTOR.username)
            await page.$eval(SELECTOR.username, (el, username) => el.value = username, USER.username)
            await page.click(SELECTOR.password)
            await page.$eval(SELECTOR.password, (el, password) => el.value = password, USER.password)
            await Promise.all([
                page.click(SELECTOR.btnSubmit),
                page.waitForNavigation({ waitUntil: 'networkidle2' })
            ])
            await Promise.all([
                await page.waitForSelector(SELECTOR.verifyUrl),
                await page.click(SELECTOR.verifyUrl)
            ])
            await page.waitForSelector(SELECTOR.recoverycode);
            await page.type(SELECTOR.recoverycode, USER.recoverycode)
            await Promise.all([
                page.waitForSelector(SELECTOR.btnVerify),
                page.click(SELECTOR.btnVerify),
                page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
            await page.screenshot({ path: 'screenshots.png' })
            // // await browser.close()
        }

        const datas = await getdatas()

        res.json({ msg: "Hello getreponame Funct" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: `${err}` })
    }
}

exports.getDrrayongFunction = async (req, res) => {
    try {

        const USER = {
            username: process.env.DRR_USER,
            password: process.env.DRR_PASS
        }

        const SELECTOR = {
            username: "#usr",
            password: "#pwd",
            btnSubmit: "form button[type=submit]",
            btnMenu: 'body > div.container-xxl.bg-white.p-0 > div:nth-child(2) > nav > button',
            btnCamera: "#navbarCollapse > ul > li:nth-child(3) > a",
            btnCameradropdown: "#navbarCollapse > ul > li:nth-child(3) > ul > li:nth-child(1)",
        }

        async function autoScroll(page) {
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 20;
                    const timer = setInterval(() => {
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= document.body.scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });
        }

        const getDrrdata = async () => {
            const url = "https://www.drrrayong.com/VMS/Login/"
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--ignore-certificate-errors', 
                    '--disable-password-manager-reauthentication',
                    '--disable-save-password-bubble',
                    '--disable-notifications',
                    '--no-default-browser-check',
                ],
                ignoreHTTPSErrors: true,
                // slowMo: 50
            })
            const page = await browser.newPage()

            await page.goto(url)
            await page.click(SELECTOR.username)
            await page.$eval(SELECTOR.username, (el, username) => el.value = username, USER.username)
            await page.click(SELECTOR.password)
            await page.$eval(SELECTOR.password, (el, password) => el.value = password, USER.password)

            await Promise.all([
                page.click(SELECTOR.btnSubmit),
                page.waitForNavigation({ waitUntil: 'networkidle2' })
            ])

            await Promise.all([
                page.waitForSelector(SELECTOR.btnMenu),
                page.click(SELECTOR.btnMenu),
                page.waitForSelector(SELECTOR.btnCamera)
            ])

            await page.click(SELECTOR.btnCamera),
                await page.waitForSelector(SELECTOR.btnCameradropdown)

            await Promise.all([
                page.click(SELECTOR.btnCameradropdown),
                page.waitForNavigation({ waitUntil: 'networkidle2' })
            ])

            await autoScroll(page);
            await page.screenshot({ path: 'capture.png', fullPage: true });

        }
        const datas = await getDrrdata();
        res.send("Success getDrrayongFunction")
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: `${err}` })
    }
}

