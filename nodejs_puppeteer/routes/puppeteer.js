const express = require("express")
const { snapGithuppageFunction, getRepoName, getDrrayongFunction } = require("../controllers/Puppeteer")
const router = express.Router()

router.get("/puppeteer/snapgithup", snapGithuppageFunction);
router.get("/puppeteer/getdrrayong", getDrrayongFunction);
// router.get("/puppeteer/getreponame", getRepoName)

module.exports = router