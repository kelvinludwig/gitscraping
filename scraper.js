const axios = require('axios')
const BASE_URL = 'https://github.com'


/**
 * Manages the calling of each processes during the scraping 
 * @param {*} gitPath 
 * @param {*} options 
 * @returns response
 */
const startScraper = async (gitPath, options) => {
	const url = `${BASE_URL}${gitPath}`
	try {
		const resHtml = await axios.get(url, options)
		console.log('Status Code: ', resHtml.status)
		let currentPageHrefs = findAndAddFilesFromCurrentPage(String(resHtml.data))
	
		const allFilesHref = await getAllFilesHref(currentPageHrefs)
		const allFilesHrefAndExtension = getFilesExtension(allFilesHref)
		const allFilesData = await getAllFilesData(allFilesHrefAndExtension)
		const response = mountResponse(allFilesData)
	
		return response
		
	} catch (error) {
		if (error.response.status == 404) {
      throw {
				msg: 'project not found'
			}
    } else {
			throw {
				msg: 'general error'
			}
		}
	}
}

/**
 * Function responsible for digging every folder in project and return all the files Href
 * @param {*} currentPageHrefs 
 * @returns currentPageHrefs.files
 */
const getAllFilesHref = async currentPageHrefs => {
	let auxiliarListForFolders = currentPageHrefs.folders

	do {
		//Goes to the Folder's URL and gets the next folders and the files inside each folder
		for (const folder of currentPageHrefs.folders) {
			const url = `${BASE_URL}${folder}`
			console.log('Folder url: ', url)
			const resFolderHtml = await axios.get(url)
			const filesAndFolders = findAndAddFilesFromCurrentPage(String(resFolderHtml.data))

			for (const file of filesAndFolders.files) {
				currentPageHrefs.files.push(file)
			}

			for (const fol of filesAndFolders.folders) {
				auxiliarListForFolders.push(fol)
			}
			auxiliarListForFolders.splice(auxiliarListForFolders.indexOf(folder), 1)
		}
		currentPageHrefs.folders = auxiliarListForFolders
	} while (currentPageHrefs.folders.length != 0)

	return currentPageHrefs.files
}

/**
 * Find all folder's href for a html page sent
 * @param {*} html 
 * @returns pagesHrefs
 */
const findFoldersFromCurrentPage = html => {
	const regexToGetFolderHtmlRaw = /<svg aria-label="Directory"(.|\n)*?<\/a>/gm
	const regexToGetHref = /(?<=href=")(.|\n)*?(?=")/gm
	const folderRawHtml = html.match(regexToGetFolderHtmlRaw)
	if (folderRawHtml) {
		const pagesHrefs = folderRawHtml.map(folder => {
			return folder.match(regexToGetHref)[0]
		})

		return pagesHrefs
	} else {
		return []
	}
}


/**
 * Find all file's href for a html page sent and merge with the folder's Href
 * @param {*} html 
 * @returns allHrefsTogether
 */
const findAndAddFilesFromCurrentPage = html => {
	const foldersHrefs = findFoldersFromCurrentPage(html)

	const regexToGetItemTables = /class="js-navigation-open Link--primary"(.|\n)*?<\/a>/gm
	const regexToGetHref = /(?<=href=")(.|\n)*?(?=")/gm
	const itemTablesRawHtml = html.match(regexToGetItemTables)
	if (itemTablesRawHtml) {
		const allHrefs = itemTablesRawHtml.map(folder => {
			return folder.match(regexToGetHref)[0]
		})

		const differenceBetweenFolder = allHrefs.filter(x => !foldersHrefs.includes(x))

		let allHrefsTogether = {}
		allHrefsTogether.folders = foldersHrefs
		allHrefsTogether.files = differenceBetweenFolder

		return allHrefsTogether
	}
	else {
		return []
	}
}

/**
 * Returns an Array with the total lines and bytes of a file in GitHub.
 * @param {*} html 
 * @returns { lines, sizeInBytes }
 */
const getLinesAndBytesFromHtml = html => {
	const regexToGetDataDiv = /(?<=<div class="text-mono f6 flex-auto pr-3 flex-order-2 flex-md-order-1">)(.|\n)*?<\/div>/gm
	const regexToGetLineNumber = /\d+(?= line)/gm
	let regexToGetSizeNumber
	const divContent = html.match(regexToGetDataDiv)
	let lines = divContent[0].match(regexToGetLineNumber)

	if (lines) {
		lines = lines[0]
		regexToGetSizeNumber = /(?<=<\/span>)(.|\n)*?(?=<\/div>)/gm
	} else {
		lines = 0
		regexToGetSizeNumber = /(\d+)(.|\n)*?(?=<span|<\/div>)/gm
	}

	const size = (divContent[0].match(regexToGetSizeNumber)) ? divContent[0].match(regexToGetSizeNumber)[0].trim() : 0
	const sizeInBytes = getSizeInBytes(size)


	return { lines, sizeInBytes }
}

/**
 * Converts the size found in byte number 
 * If the File doesn't have information about line or size will be given the valor 0
 * @param {*} size 
 * @returns sizeNumber
 */
const getSizeInBytes = size => {
	const sizeNumber = size.split(' ')[0]
	const sizeOrder = size.split(' ')[1]

	switch (sizeOrder) {
		case 'MB':
			return sizeNumber * 1000000
			break
		case 'KB':
			return sizeNumber * 1000
			break
		case 'Bytes':
			return sizeNumber
			break

		default:
			return 0
			break;
	}
}

/**
 * Returns an array with the extension of each href that will be accessed
 * @param {*} hrefList 
 * @returns hrefExtensionList
 */
const getFilesExtension = hrefList => {
	const hrefExtensionList = []
	const regexToSearchDot = /[.]/g
	for (const href of hrefList) {
		const result = href.split('/')
		const filename = result[result.length - 1]
		const extensionType = (filename.search(regexToSearchDot) === -1)
			? 'No Extension'
			: filename.split('.').slice(-1).pop()

		hrefExtensionList.push({ href, extensionType })
	}

	return hrefExtensionList
}

/**
 * Mount the response to the final pattern
 * @param {*} hrefList 
 * @returns response
 */
const getAllFilesData = async hrefList => {
	const response = []

	for (const file of hrefList) {
		const url = `${BASE_URL}${file.href}`
		const resFileHtml = await axios.get(url)
		console.log('File url: ', url)
		const filesAndFolders = getLinesAndBytesFromHtml(String(resFileHtml.data))
		response.push({
			extension: file.extensionType,
			count: 1,
			lines: parseInt(filesAndFolders.lines),
			bytes: parseInt(filesAndFolders.sizeInBytes)
		})
	}
	return response
}

/**
 * Get the Array of files data and mount the final JSON to return
 * @param {*} allFilesData 
 * @returns response
 */
const mountResponse = allFilesData => {
	const response = []
	const resCountEachExtension = countEachExtension(allFilesData)
	let lines = 0, bytes = 0

	for (const extension of resCountEachExtension) {
		for (const fileData of allFilesData) {
			if (fileData.extension === extension[0]) {
				lines += fileData.lines
				bytes += fileData.bytes
				// allFilesData.splice(allFilesData.indexOf(fileData), 1)
			}
		}


		response.push({
			extension: extension[0],
			count: extension[1],
			lines: lines,
			bytes: bytes
		})
		lines = 0
		bytes = 0
	}
	return response
}

/**
 * Return an Array with the count of each extension type found
 * @param {*} allFilesData 
 * @returns allExtensions
 */
const countEachExtension = allFilesData => {
	return Object.entries(
		Array.from(allFilesData).reduce((allExtensions, ext) => {
			if (ext.extension in allExtensions) {
				allExtensions[ext.extension]++;
			} else {
				allExtensions[ext.extension] = 1;
			}
			return allExtensions;
		}, {})
	)
}


module.exports = {
	countEachExtension,
	findAndAddFilesFromCurrentPage,
	findFoldersFromCurrentPage,
	getAllFilesHref,
	getFilesExtension,
	getLinesAndBytesFromHtml,
	getSizeInBytes,
	getAllFilesData,
	mountResponse,
	startScraper
}