const chrome = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

module.exports = async (req, res) => {
  const requestStatus = checkRequest(req)
  if (requestStatus !== 'valid') return res.json(requestStatus)
  const formid = req.query.formid
  const formUrl = `https://docs.google.com/forms/d/e/${formid}/viewform?usp=sf_link`
  console.log(`Filling form from url: ${formUrl}`)

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });
  console.log('opened browser')
  const page = await browser.newPage()
  await page.goto(formUrl, {
    waitUntil: 'networkidle0'
  })
  console.log('opened page')
  const inputEls = await page.evaluate(x => {
    const inputs = document.querySelectorAll('input[type=text]')
    return inputs.toString()
  });

  console.log(inputEls)
  await browser.close();
  req.json(inputEls)
}

function checkRequest (req) {
  console.log(req.query)
  const formid = req.query.formid
  if (typeof formid !== 'string') return {
    error: true,
    message: 'Did not receive a valid formid'
  }
  if (!/^[a-z0-9\-]+$/i.test(formid)) return {
    error: true,
    message: 'formid contained invalid characters (only alphanumeral and - allowed)'
  }
  if (formid.length > 60 || formid.length < 50 ) return {
    error: true,
    message: 'formid was of invalid length'
  }
  return 'valid'
}