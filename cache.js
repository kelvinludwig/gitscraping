const scraper = require('./scraper')
const fs = require('fs')


//Headers to simulate a brawser access
const browserHeaders = {
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
	'accept-encoding': 'gzip, deflate, br',
	'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
	'cache-control': 'max-age=0',
	'cookie': '_octo=GH1.1.1998379610.1619546633; tz=America%2FBahia; _device_id=045ad3dc27e1a9ccb6f965c6187f3c9f; tz=America%2FBahia; user_session=iSD-g63oNri0ejG9EE7HJpDyQ39kAgjWfuaLKuN95ShnAbmZ; __Host-user_session_same_site=iSD-g63oNri0ejG9EE7HJpDyQ39kAgjWfuaLKuN95ShnAbmZ; logged_in=yes; dotcom_user=kelvinludwig; color_mode=%7B%22color_mode%22%3A%22auto%22%2C%22light_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; _ga=GA1.2.224428643.1626404556; _gid=GA1.2.904986037.1626404556; has_recent_activity=1; _gh_sess=u%2ByA4vn0uyQ0dU9j3ApC50%2B%2BFnRrQE6OX8ZlTNYZnobMS7Afm8ugfUGwW7zLllcZxyQ9R%2B%2B6y%2FDRIz8AGZh%2BPkx5R%2BFeNQHKMIJOmvdhHxZnod48ixYNPsGxGUyrxc%2FpCqZlxQHBY5JI%2FyOl9Ey9gBsuDCtB9WIKjIxDOUXMiDK7IIWHGsM0oSGO0xPFCrs4dwfkmYb7DiksroVk20Isqh%2F3Kvh8xFyndGMNzp02KgwkAqjgvyickjPohXIUpQ1QgcPruHRc4DRfm7WI0KGHqqhGAOx4O80ErJK820tctc874IkJ9V%2BZ6jjhXcULOxp9oAitxEOJyUG5MQb49vZQG5Madqrfji2mBFcci4divxArCV3B%2BNzD%2FLxfIWt68ztNgPxfN6SX3TzM930ZqJTgJ0gx00YUE1Xvg%2FBlJcZmeIzqm7Bt%2BB9EesnBbJ%2B%2FSHfOVb3e6OrpdB9dFWlJPnGOfEzyjHQSEwi3eeT1U3FMeIjM7ykSI9mjNlz5osTutLLqfyfQ6HPR33ifSJa4u8%2B7blBI6l835b8vDpMf8hnhVLTT8SlAuXE%2Bs6ChPBqo7wfN%2FYEBc7eOT8ArUP2WBogblG0SmlJXxcyPiThydu22cwoLr7zvuqnKoqPbkwRadhmBbciS1T3kMSbxTa9eIaTAXSGOuK6OswbokaZgf3BrJ%2FzNryDG0ZeIudZ3pBXhuxHmNMUIICnQzGsI4YsIUKjtur26%2FcpOxdaRyz5BAmqro%2Frz6QIUp%2BGajIVHr0QAtd7EUlC9Rny%2FrnBIbnZDibgp9h7aiQj2in%2BtFjgfdQsbBFQJnGQeTunkpa4IM0ca3YW2K9Cz8%2FYAfzb1LLys59nU5GiIfncv793MJBeAUSAakArEQfUU1nowsxgqnVGYmtj%2BypyZODPlc%2Fqgl2foASJBfKnAhpJ2vInTTeVpkJiz3hgt10%2FCdODMk1cg2i%2Bxn2w4S5fSiJ17KGPxGhxeJjeosoFQWRR9F6JcM6xYxa%2FhoLfpQKkQIaiYDCY2Auu0QEdX%2BEzsBGjfalzpRkOYDbEOgbie8y7mKrZ4qE65y2bQ%2FYXLBFnaDmUa%2FOZP0a9JcAqSXjpdU3x%2BBecf3LoHntUgAHk1e4YGRUeJ3biUgzscN5caMdA4DlWmRQpD4UZC4bA7OWxOwETORuAIGtLQEVs%2BnLmrZysMAn5LTLXuoSPX%2FsrYkkOtyIwVEpsKpyJA%2BtXDNJJ2czfrUec1naowvZdkJqQLJfHxuKjn--MQUa1sQPZbQLTsUQ--EHPAWbog9fYF37ghNLbKeg%3D%3D',
	'if-none-match': 'W/"1cb73b54430099b9169e0b70b59bae84"',
	'referer': 'https://www.google.com/',
	'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
	'sec-ch-ua-mobile': '?0',
	'sec-fetch-dest': 'document',
	'sec-fetch-mode': 'navigate',
	'sec-fetch-site': 'same-origin',
	'sec-fetch-user': '?1',
	'upgrade-insecure-requests': 1,
	'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
}

/**
 * Write in a File the response of a request about any project in git
 * @param {*} data 
 * @param {*} filename 
 * @returns Promise(promiseCallback)
 */
const writeToFile = (data, filename) => {
	const promiseCallback = (resolve, reject) => {
		fs.writeFile(filename, data, (error) => {
			if (error) {
				reject(error)
				return
			}
			resolve(true)
		})
	}

	return new Promise(promiseCallback)
}

/**
 * Read a previus response saved in a file in cache/
 * @param {*} filename 
 * @returns Promise(promiseCallback)
 */
const readFromFile = filename => {
	const promiseCallback = async (resolve) => {
		fs.readFile(filename, 'utf8', (error, contents) => {
			if (error) {
				resolve(null)
			}
			resolve(contents)
		})
	}
	return new Promise(promiseCallback)
}

/**
 * start the scraper calling getPage() or return a cached response about a directory
 * @param {*} path 
 * @returns result, error
 */
const getOrCreateCachedPage = path => {
	const filename = `cache/${slug(path)}.json`
	return new Promise(async (resolve, reject) => {
		try {
			const cachedResponse = await readFromFile(filename)
			if (!cachedResponse) {
				const result = await getPage(path)
				await writeToFile(JSON.stringify(result), filename)
				resolve(result)
				return
			}
			resolve(JSON.parse(cachedResponse))
		} catch (error) {
			reject(error)
		}
	})
}

/**
 * A slug function to clean a string before storage it
 * @param {*} str 
 * @returns str
 */
const slug = str => {
	str = str.replace(/^\s+|\s+$/g, '') // trim
	str = str.toLowerCase()

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
	var to = "aaaaeeeeiiiioooouuuunc------"
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
	}

	str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-') // collapse dashes

	return str
}

/**
 * Gets the result of the scraper
 * @param {*} path 
 * @returns result
 */
const getPage = async (path) => {
	const option = {
		headers: browserHeaders
	}

	const result = await scraper.startScraper(path, option)

	// return result
	return (result)

}

module.exports = {
	getOrCreateCachedPage,
	getPage,
	readFromFile,
	slug,
	writeToFile
}