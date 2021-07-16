const axios = require('axios')
const BASE_URL = 'https://github.com'

//Manages the calling of each processes during the scraping 
const startScraper = async (gitPath, options) => {
	const url = `${BASE_URL}${gitPath}`
	const resHtml = await axios.get(url, options)
	let currentPageHrefs = findAndAddFilesFromCurrentPage(String(resHtml.data))

	const allFilesHref = await getAllFilesHref(currentPageHrefs)

	const allFilesHrefAndExtension = getFilesExtension(allFilesHref)


	return mountResponse(allFilesHrefAndExtension)
}

//Function responsible for digging every folder in project and return all the files Href
const getAllFilesHref = async currentPageHrefs => {
	let auxiliarListForFolders = currentPageHrefs.folders

	do {
		//Goes to the Folder's URL and gets the next folders and the files inside each folder
		for (const folder of currentPageHrefs.folders) {
			const url = `${BASE_URL}${folder}`
			console.log(url)
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

//Find all folder's href for a html page sent
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

//Find all file's href for a html page sent and merge with the folder's Href
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

//Returns an Array with the total lines and bytes of a file in GitHub.
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

//Converts the size found in byte number
//If the File doesn't have information about line or size will be given the valor 0
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

//Returns an array with the extension of each href that will be accessed
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

//Mount the response to the final pattern
const mountResponse = async hrefList => {
	const response = []

	for (const file of hrefList) {
		const url = `${BASE_URL}${file.href}`
		const resFileHtml = await axios.get(url)
		const filesAndFolders = getLinesAndBytesFromHtml(String(resFileHtml.data))
		const resultOfIsExist = isExistExtension(response, file)
		if(resultOfIsExist === false){
			response.push({
				extension: file.extensionType,
				count: 1,
				lines: parseInt(filesAndFolders.lines),
				bytes: parseInt(filesAndFolders.sizeInBytes)
			})
		}else{
			response[resultOfIsExist].count += 1
			response[resultOfIsExist].lines+= parseInt(filesAndFolders.lines)
			response[resultOfIsExist].bytes+= parseInt(filesAndFolders.sizeInBytes)
		}
	}
	return response
}

const isExistExtension = (response, file) => {
	for (const res of response) {
		if(res.extension == file.extensionType){
			return response.indexOf(res)
		}
	}
	return false
}

module.exports = {
	findAndAddFilesFromCurrentPage,
	findFoldersFromCurrentPage,
	getAllFilesHref,
	getFilesExtension,
	getLinesAndBytesFromHtml,
	getSizeInBytes,
	isExistExtension,
	mountResponse,
	startScraper
}