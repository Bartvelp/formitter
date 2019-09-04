const chrome = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

module.exports = async (req, res) => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  })

  console.log('opened browser')
  const page = await browser.newPage()
  await page.goto('https://example.com', {
    waitUntil: 'networkidle0'
  })
  const html = await page.evaluate(() => document.body.outerHTML)
  res.end('GOT HTML' + html)
}
