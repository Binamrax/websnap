const express = require('express');
const puppeteer = require('puppeteer');
const axios=require('axios');
const app = require('../app');
const router = express.Router();

/**
 * Main route
 */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'WebSnap' });
});

/**
 * taking snap of website in desktop
 */
router.get('/desktop', async(req, res) => {
  const url = req.query.url || '';
  if (url) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1360,
      height: 720
    });
    page.setDefaultNavigationTimeout(0)
    await page.goto(url);
    const screen = await page.screenshot({ mitBackground: true, encoding: 'binary' });
    await browser.close();
    res.contentType('image/png');
    res.send(screen);
  } else {
    res.send(null);
  }
});

/**
 * taking snap of website on mobile.
 */
router.get('/mobile', async (req, res) => {
  const url = req.query.url || '';
  if (url) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.emulate({
      'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      'viewport': {
        'width': 375,
        'height': 667,
        'deviceScaleFactor': 2,
        'isMobile': true,
        'hasTouch': true,
        'isLandscape': false
      }
    });
    page.setDefaultNavigationTimeout(0)
    await page.goto(url);
    const screen = await page.screenshot({ mitBackground: true, encoding: 'binary' });
    await browser.close();
    res.contentType('image/png');
    res.send(screen);
  } else {
    res.send(null);
  }
});

/**
 * Check url valid or not
 */
router.get('/checkurl', (req, res) => {
  let obj = req.query.url;
  axios.head(obj).then(r => {
      res.send({ result: (r.status == 200 ? true : false) })
  }).catch(e => {
      res.send({ result: false })
  });
})


module.exports = router;
