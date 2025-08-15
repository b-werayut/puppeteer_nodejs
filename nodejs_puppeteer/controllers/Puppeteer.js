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

const droneTransportOpinions = [
    "เป็นอนาคตของการขนส่งที่รวดเร็วและปลอดภัย",
    "ช่วยลดต้นทุนแรงงานได้มาก",
    "เพิ่มประสิทธิภาพในการจัดส่งสินค้า",
    "ลดความแออัดบนถนน",
    "ดีต่อสิ่งแวดล้อมถ้าใช้พลังงานสะอาด",
    "เหมาะกับการขนส่งในพื้นที่ห่างไกล",
    "ยังคงต้องพัฒนาความปลอดภัยเพิ่มเติม",
    "อาจกระทบต่ออาชีพคนขับรถ",
    "ทำให้การขนส่งในเมืองฉลาดขึ้น",
    "มีแนวโน้มเติบโตอย่างรวดเร็ว",
    "ช่วยให้บริการเดลิเวอรีเร็วขึ้น",
    "ต้องมีกฎหมายรองรับอย่างรัดกุม",
    "เป็นนวัตกรรมที่น่าจับตามอง",
    "เหมาะกับยุคดิจิทัลที่ต้องการความเร็ว",
    "ยังมีข้อจำกัดด้านสภาพอากาศ",
    "อาจสร้างความกังวลเรื่องความเป็นส่วนตัว",
    "ช่วยในภาวะฉุกเฉินหรือภัยพิบัติได้ดี",
    "ลดความเสี่ยงจากอุบัติเหตุของมนุษย์",
    "ต้องพัฒนาโครงสร้างพื้นฐานให้รองรับ",
    "มีโอกาสพลิกโฉมโลจิสติกส์",
    "เพิ่มความสามารถในการเข้าถึงพื้นที่ยากลำบาก",
    "ต้องมีการควบคุมการจราจรทางอากาศที่ดี",
    "ช่วยให้ธุรกิจขนาดเล็กแข่งขันได้มากขึ้น",
    "เทคโนโลยี AI มีบทบาทสำคัญในการขับเคลื่อน",
    "การยอมรับจากสังคมยังต้องใช้เวลา",
    "โดรนอาจเป็นตัวเลือกใหม่ของไปรษณีย์",
    "เหมาะกับการส่งของชิ้นเล็กหรือด่วน",
    "ต้องระวังปัญหาการแฮ็กระบบ",
    "สนับสนุนการเติบโตของ Smart City",
    "จะเป็นส่วนหนึ่งของชีวิตประจำวันในอนาคตอันใกล้"
];

const provinces = [
    "กรุงเทพมหานคร",
    "เชียงใหม่",
    "ขอนแก่น",
    "ชลบุรี",
    "ภูเก็ต",
    "นครราชสีมา",
    "สุราษฎร์ธานี",
    "สงขลา",
    "อุบลราชธานี",
    "พิษณุโลก",
    "ลำปาง",
    "ราชบุรี",
    "นครปฐม",
    "นครศรีธรรมราช",
    "บุรีรัมย์",
    "มหาสารคาม",
    "เลย",
    "ศรีสะเกษ",
    "เพชรบูรณ์",
    "สระบุรี",
    "อุดรธานี",
    "นครพนม",
    "กาญจนบุรี",
    "ประจวบคีรีขันธ์",
    "สมุทรปราการ",
    "สมุทรสาคร",
    "ระยอง",
    "ตาก",
    "หนองคาย",
    "แพร่"
];

const detail = [
    "ปรับปรุงความตรงต่อเวลาในการจัดส่ง",
    "เพิ่มความแม่นยำในการติดตามพัสดุแบบเรียลไทม์",
    "จัดให้มีบริการลูกค้าที่ตอบสนองรวดเร็ว",
    "พัฒนาระบบการแจ้งเตือนสถานะพัสดุผ่านแอปหรือ SMS",
    "เพิ่มช่องทางติดต่อหลากหลาย เช่น LINE, Facebook",
    "อบรมพนักงานจัดส่งให้มีมารยาทและความเป็นมืออาชีพ",
    "จัดทำระบบประเมินความพึงพอใจหลังการจัดส่ง",
    "เพิ่มจุดรับ-ส่งพัสดุให้ครอบคลุมพื้นที่มากขึ้น",
    "ให้บริการจัดส่งในวันหยุดหรือช่วงนอกเวลาทำการ",
    "พัฒนาแอปพลิเคชันให้ใช้งานง่ายและเสถียร",
    "เสนอแพ็กเกจราคาที่หลากหลายและยืดหยุ่น",
    "เพิ่มทางเลือกในการชำระเงิน เช่น QR Code, พร้อมเพย์",
    "จัดทำประกันพัสดุในกรณีเสียหายหรือสูญหาย",
    "พัฒนาบริการจัดส่งแบบด่วนพิเศษ",
    "ควบคุมอุณหภูมิสำหรับสินค้าที่ต้องการความเย็น",
    "ปรับปรุงกระบวนการรับพัสดุให้รวดเร็วขึ้น",
    "ส่งเสริมการใช้บรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อม",
    "มีระบบให้คะแนนและแสดงรีวิวพนักงานจัดส่ง",
    "จัดการข้อร้องเรียนของลูกค้าอย่างมีประสิทธิภาพ",
    "มีระบบสำรองข้อมูลการจัดส่งเพื่อการตรวจสอบย้อนหลัง",
    "เสนอโปรโมชันพิเศษสำหรับลูกค้าประจำ",
    "ขยายบริการจัดส่งข้ามจังหวัดหรือข้ามประเทศ",
    "จัดให้มีบริการรับพัสดุถึงหน้าบ้าน",
    "พัฒนาระบบ API สำหรับเชื่อมต่อกับแพลตฟอร์ม e-commerce",
    "ตรวจสอบพัสดุก่อนจัดส่งเพื่อป้องกันความเสียหาย",
    "จัดเตรียมระบบคิวอัตโนมัติสำหรับการรับ-ส่งพัสดุ",
    "มีระบบแจ้งเตือนเมื่อพัสดุใกล้ถึงปลายทาง",
    "จัดให้มีบริการแบบไม่สัมผัส (contactless delivery)",
    "เพิ่มความปลอดภัยในการขนส่งสินค้า",
    "จัดกิจกรรมส่งเสริมความสัมพันธ์กับลูกค้า"
]

const delay = ms => new Promise(res => setTimeout(res, ms));

async function clickStar(page, questionIndex, starValue) {
    const stars = await page.$$(`[role="radio"][aria-label="${starValue}"]`);
    if (stars.length > questionIndex) {
        await stars[questionIndex].evaluate(el => el.scrollIntoView());
        await stars[questionIndex].click();
        console.log(`✅ คลิก ${starValue} ดาว ในคำถามที่ ${questionIndex + 1}`);
        await delay(1000);
    } else {
        console.log(`❌ ไม่พบ ${starValue} ดาว ในคำถามที่ ${questionIndex + 1}`);
    }
}

async function fillForm() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://forms.gle/QezKKxszckL5ze9f9', { waitUntil: 'networkidle2' });
    await delay(1000);

    await page.waitForSelector('.docssharedWizToggleLabeledContainer');
    const allRadioButtons = await page.$$('.docssharedWizToggleLabeledContainer');

    const questionOptions = [
        3, 5, 5, 2, 4, 5, 5, 4, 5, 4, 4, 4, 4, 5, 2, 4
    ];

    let currentIndex = 0;

    for (let i = 0; i < questionOptions.length; i++) {
        const optionCount = questionOptions[i];
        const group = allRadioButtons.slice(currentIndex, currentIndex + optionCount);

        if (group.length !== optionCount) {
            console.log(`❌ ข้ามคำถามที่ ${i + 1} เนื่องจากตัวเลือกไม่ครบ`);
            continue;
        }

        const randomIndex = Math.floor(Math.random() * optionCount);
        const selected = group[randomIndex];

        console.log(`✅ คำถาม ${i + 1}: สุ่มเลือกตัวเลือกที่ ${randomIndex + 1} จาก ${optionCount} ตัวเลือก`);

        await selected.evaluate(el => el.scrollIntoView());
        await selected.click();
        await delay(500);

        currentIndex += optionCount;
    }

    await delay(1000);

    await page.waitForSelector('.whsOnd');
    const textInputs = await page.$$('.whsOnd');

    if (textInputs.length > 2) {
        const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
        const randomOpinion = droneTransportOpinions[Math.floor(Math.random() * droneTransportOpinions.length)];
        const randomDetail = detail[Math.floor(Math.random() * detail.length)];

        await textInputs[0].type(randomProvince);
        await delay(300);
        await textInputs[1].type(randomOpinion);
        await delay(300);
        await textInputs[2].type(randomDetail);
        await delay(300);
    }

    // กรอกเรตติ้งแบบดาว
    await clickStar(page, 0, Math.floor(Math.random() * 5) + 1); // 1-5
    await clickStar(page, 1, Math.floor(Math.random() * 5) + 1);

    // คลิกปุ่ม "ส่ง"
    await page.waitForSelector('span.NPEfkd.RveJvd.snByac');
    await delay(1000);

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('span'));
        const sendButton = buttons.find(el => el.textContent.trim() === 'ส่ง');
        if (sendButton) {
            sendButton.scrollIntoView();
            sendButton.click();
        }
    });

    // รอหน้า redirect
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log("✅ ส่งแบบฟอร์มสำเร็จ");

    await browser.close();
}

exports.selectForm = async (req, res) => {
    const loopCount = 2; // เปลี่ยนจำนวนรอบที่ต้องการ

    for (let i = 1; i <= loopCount; i++) {
        console.log(`🚀 เริ่มรอบที่ ${i}`);
        await fillForm();
        await delay(3000); // หน่วงก่อนรอบถัดไป
    }

    res.send("Success")
}

// exports.selectForm = async (req, res) => {

//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     await page.goto('https://forms.gle/QezKKxszckL5ze9f9', { waitUntil: 'networkidle2' });
//     await delay(1000);

//     await page.waitForSelector('.docssharedWizToggleLabeledContainer');
//     const allRadioButtons = await page.$$('.docssharedWizToggleLabeledContainer');

//     console.log(`📌 พบ radio buttons ทั้งหมด: ${allRadioButtons.length}`);

//     const questionOptions = [
//         3, 5, 5, 2, 4, 5, 5, 4, 5, 4, 4, 4, 4, 5, 2, 4
//     ];

//     let currentIndex = 0;

//     for (let i = 0; i < questionOptions.length; i++) {
//         const optionCount = questionOptions[i];

//         const group = allRadioButtons.slice(currentIndex, currentIndex + optionCount);

//         if (group.length !== optionCount) {
//             console.log(`❌ คำถามที่ ${i + 1} มีตัวเลือกไม่ครบ (คาดว่า ${optionCount}, พบ ${group.length})`);
//             continue;
//         }

//         const randomIndex = Math.floor(Math.random() * optionCount);
//         const selected = group[randomIndex];

//         console.log(`✅ คำถาม ${i + 1}: สุ่มเลือกตัวเลือกที่ ${randomIndex + 1} จาก ${optionCount} ตัวเลือก`);

//         await selected.evaluate(el => el.scrollIntoView());
//         await selected.click();
//         await delay(1000);

//         currentIndex += optionCount;
//     }

//     await delay(1000);

//     await page.waitForSelector('.whsOnd');
//     const textInputs = await page.$$('.whsOnd');

//     if (textInputs.length > 0) {
//         //คุณอาศัยอยู่ในพื้นที่จังหวัดใดของประเทศไทย *
//         await textInputs[0].type('ชลบุรี');
//         await delay(1000);
//         //ความเห็นของคุณเกี่ยวกับแนวโน้มการใช้โดรน/ยานพาหนะไร้คนขับในการขนส่ง (ตอบสั้นๆ)
//         await textInputs[1].type('สินค้าอาจจะไม่ปลอดภัยเท่ากับการส่งด้วยมนุษย์');
//         await delay(1000);
//         //ข้อเสนอแนะเพิ่มเติมต่อผู้ให้บริการขนส่ง/โลจิสติกส์
//         await textInputs[2].type('อยากให้บางพื้นที่โทนแจ้งก่อนที่จะเข้ามาส่งไม่เกิน 30 นาที');
//         await delay(1000);
//     }

//     await clickStar(page, 0, 3); // คำถามที่ 1 → 3 ดาว
//     await clickStar(page, 1, 4); // คำถามที่ 2 → 4 ดาว

//     await page.waitForSelector('span.NPEfkd.RveJvd.snByac');
//     await delay(1000);

//     await page.evaluate(() => {
//         const buttons = Array.from(document.querySelectorAll('span'));
//         const sendButton = buttons.find(el => el.textContent.trim() === 'ส่ง');
//         if (sendButton) {
//             sendButton.scrollIntoView();
//             sendButton.click();
//         }
//     });

//     // รอโหลดหน้าถัดไป (optional)
//     await page.waitForNavigation({ waitUntil: 'networkidle2' });

//     res.send("Success");
// }

// async function clickStar(page, questionIndex, starValue) {
//     const stars = await page.$$(`[role="radio"][aria-label="${starValue}"]`);
//     if (stars.length > questionIndex) {
//         await stars[questionIndex].evaluate(el => el.scrollIntoView());
//         await stars[questionIndex].click();
//         console.log(`✅ คลิก ${starValue} ดาว ในคำถามที่ ${questionIndex + 1}`);
//         await delay(1000);
//     } else {
//         console.log(`❌ ไม่พบ ${starValue} ดาว ในคำถามที่ ${questionIndex + 1}`);
//     }
// }

// async function clickStar(page, questionIndex, stars) {
//   const starGroups = await page.$$('.z12JJ');
//   if (!starGroups[questionIndex]) return;

//   const starsInGroup = await starGroups[questionIndex].$$('div[role="radio"]');
//   if (stars <= starsInGroup.length) {
//     await starsInGroup[stars - 1].click();
//     await delay(500);
//   }
// }

