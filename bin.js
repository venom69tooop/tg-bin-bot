const cheerio = require("cheerio");
const axios = require('axios');
const qs = require('qs');
const QueryString = require("qs");
var alpha2 = require('iso-3166-1-alpha-2')

async function fetchData(bin) {
    var data = qs.stringify({
        'action': 'searchbins',
        'bins': bin,
        'bank': '',
        'country': ''
    });
    var config = {
        method: 'post',
        url: 'http://bins.su/',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,bn;q=0.6',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'bins.su',
            'Origin': 'http://bins.su',
            'Referer': 'http://bins.su/',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
            'Cache-Control': 'max-age=0',
            'Content-Length': '44'
        },
        data: data
    };
    let res = await axios(config);
    return res.data;
}

async function search(bin) {
    let isNumber = /^\d+$/.test(bin);
    if (bin.length < 6 || !isNumber) {
        return "❗️ <b>Request a valid BIN.</b>";
    }
    bin = bin.substr(0, 6);
    let htmlData = await fetchData(bin);
    let $ = cheerio.load(htmlData);
    let result = $("#result").html();
    if (!result.match("Total found 1 bins")) {
        return "❌ <b>No Result Found.</b>";
    }

    let country = $("#result tr:nth-child(2) td:nth-child(2)").text();
    let vendor = $("#result tr:nth-child(2) td:nth-child(3)").text();
    let type = $("#result tr:nth-child(2) td:nth-child(4)").text();
    let level = $("#result tr:nth-child(2) td:nth-child(5)").text();
    let bank = $("#result tr:nth-child(2) td:nth-child(6)").text();

    console.log(`Search Successful for : ${bin}`)

    let resp = `<b>➤ BIN : </b> ${bin}\n` +
        `<b>➤ Brand :</b> ${vendor}\n` +
        `<b>➤ Type :</b> ${type}\n` +
        `<b>➤ Level :</b> ${level}\n` +
        `<b>➤ Bank :</b> ${bank}\n` +
        `<b>➤ Country :</b> ${alpha2.getCountry(country).toUpperCase()}\n` +
        `<code>■ Data Provided from Bins.Su ■</code>`;
    return resp;
}

exports.search = search;