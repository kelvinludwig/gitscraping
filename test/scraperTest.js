//Unit test that check all function about the scraper
const scraper = require('../scraper')
const axios = require('axios')
const assert = require('assert')

const findAndAddFilesFromCurrentPageTest = async () => {
  const resFolderHtml = await axios.get('https://github.com/kelvinludwig/OnePiece')
  result = scraper.findAndAddFilesFromCurrentPage(resFolderHtml.data)
  //Need to finish the execution above to execute getAllFilesHrefTest
  getAllFilesHrefTest()
  return assert.deepStrictEqual(result, expectedFolder, 'List of folders and files href not expected')
}
const getAllFilesHrefTest = async () => {
  result = await scraper.getAllFilesHref(expectedFolder)
  getFilesExtensionTest()
  return assert.deepStrictEqual(result, expectedHrefsList, 'List of all files href not expected')
}
const getFilesExtensionTest = async () => {
  result = await scraper.getFilesExtension(expectedHrefsList)
  getAllFilesDataTest()
  return assert.deepStrictEqual(result, extepectedFilesAndExtensions, 'List of files hrefs and extensions not expected')
}
const getAllFilesDataTest = async () => {
  result = await scraper.getAllFilesData(extepectedFilesAndExtensions)
  mountResponseTest()
  return assert.deepStrictEqual(result, expectedFileData, 'FilesData test not expected')
}
const mountResponseTest = async () => {
  result = await scraper.mountResponse(expectedFileData)
  return assert.deepStrictEqual(result, expectedFinalResult, 'Final result mounted not expected')
}
const findFoldersFromCurrentPageTest = async () => {
  const resFileHtml = await axios.get('https://github.com/kelvinludwig/OnePiece/tree/master/Luffy')
  result = scraper.findFoldersFromCurrentPage(resFileHtml.data)
  return assert.deepStrictEqual(result, expectedFolderList, 'Folder list scraped not expected')
}
const getLinesAndBytesFromHtmlTest = async () => {
  const resFileHtml = await axios.get('https://github.com/kelvinludwig/OnePiece/blob/master/sagas')
  result = scraper.getLinesAndBytesFromHtml(resFileHtml.data)
  return assert.deepStrictEqual(result, expectedFile, 'Line and SizeInBytes scraped not expected')
}
const getLinesAndBytesFromHtmlTestNotExpected = async () => {
  const resFileHtml = await axios.get('https://github.com/kelvinludwig/OnePiece/blob/master/sagas')
  result = scraper.getLinesAndBytesFromHtml(resFileHtml.data)
  return assert.notDeepStrictEqual(result, notExpectedFile, 'Line and SizeInBytes scraped should not be expected')
}

findAndAddFilesFromCurrentPageTest()
getLinesAndBytesFromHtmlTestNotExpected()
findFoldersFromCurrentPageTest()
getLinesAndBytesFromHtmlTest()



const expectedFile = { lines: '4', sizeInBytes: '39' }
const notExpectedFile = { lines: '3', sizeInBytes: '390' }
const expectedFolder = {
  folders: [
    '/kelvinludwig/OnePiece/tree/master/Buggy',
    '/kelvinludwig/OnePiece/tree/master/Luffy'
  ],
  files: [
    '/kelvinludwig/OnePiece/blob/master/.DS_Store',
    '/kelvinludwig/OnePiece/blob/master/.gitignore',
    '/kelvinludwig/OnePiece/blob/master/OnePiece',
    '/kelvinludwig/OnePiece/blob/master/README.md',
    '/kelvinludwig/OnePiece/blob/master/onepiece.png',
    '/kelvinludwig/OnePiece/blob/master/sagas'
  ]
}
const expectedFolderList = [
  '/kelvinludwig/OnePiece/tree/master/Luffy/Chopper',
  '/kelvinludwig/OnePiece/tree/master/Luffy/Sanji',
  '/kelvinludwig/OnePiece/tree/master/Luffy/Usopp',
  '/kelvinludwig/OnePiece/tree/master/Luffy/Zoro'
]
const expectedHrefsList = [
  '/kelvinludwig/OnePiece/blob/master/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/.gitignore',
  '/kelvinludwig/OnePiece/blob/master/OnePiece',
  '/kelvinludwig/OnePiece/blob/master/README.md',
  '/kelvinludwig/OnePiece/blob/master/onepiece.png',
  '/kelvinludwig/OnePiece/blob/master/sagas',
  '/kelvinludwig/OnePiece/blob/master/Buggy/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Buggy/Trajetoria.py',
  '/kelvinludwig/OnePiece/blob/master/Buggy/King/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Buggy/King/Trajetoria.py',
  '/kelvinludwig/OnePiece/blob/master/Luffy/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Luffy/trajetoria.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Chopper/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Chopper/cura.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Chopper/medicamento.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Usopp/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Usopp/atirador.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Usopp/sogeking.js',
  '/kelvinludwig/OnePiece/blob/master/Buggy/King/Shanks/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Buggy/King/Shanks/Trajetoria.py',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Zoro/tr.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Zoro/trajetoria.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Sanji/.DS_Store',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Sanji/tr.js',
  '/kelvinludwig/OnePiece/blob/master/Luffy/Sanji/trajetoria.js',
  '/kelvinludwig/OnePiece/blob/master/Buggy/King/Shanks/Roger/Trajetoria.py'
]

const extepectedFilesAndExtensions = [
  { "href": "/kelvinludwig/OnePiece/blob/master/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/.gitignore", "extensionType": "gitignore" },
  { "href": "/kelvinludwig/OnePiece/blob/master/OnePiece", "extensionType": "No Extension" },
  { "href": "/kelvinludwig/OnePiece/blob/master/README.md", "extensionType": "md" },
  { "href": "/kelvinludwig/OnePiece/blob/master/onepiece.png", "extensionType": "png" },
  { "href": "/kelvinludwig/OnePiece/blob/master/sagas", "extensionType": "No Extension" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/Trajetoria.py", "extensionType": "py" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/King/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/King/Trajetoria.py", "extensionType": "py" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/trajetoria.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Chopper/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Chopper/cura.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Chopper/medicamento.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Usopp/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Usopp/atirador.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Usopp/sogeking.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/King/Shanks/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/King/Shanks/Trajetoria.py", "extensionType": "py" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Zoro/tr.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Zoro/trajetoria.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Sanji/.DS_Store", "extensionType": "DS_Store" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Sanji/tr.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Luffy/Sanji/trajetoria.js", "extensionType": "js" },
  { "href": "/kelvinludwig/OnePiece/blob/master/Buggy/King/Shanks/Roger/Trajetoria.py", "extensionType": "py" }
]

const expectedFileData = [
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'gitignore', count: 1, lines: 0, bytes: 0 },
  { extension: 'No Extension', count: 1, lines: 13, bytes: 196 },
  { extension: 'md', count: 1, lines: 3, bytes: 157 },
  { extension: 'png', count: 1, lines: 0, bytes: 1220000 },
  { extension: 'No Extension', count: 1, lines: 4, bytes: 39 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'py', count: 1, lines: 9, bytes: 189 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'py', count: 1, lines: 9, bytes: 189 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 8000 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'py', count: 1, lines: 9, bytes: 189 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'DS_Store', count: 1, lines: 0, bytes: 6000 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'js', count: 1, lines: 5, bytes: 112 },
  { extension: 'py', count: 1, lines: 9, bytes: 189 }
]

const expectedFinalResult = [
  { "extension": "DS_Store", "count": 8, "lines": 0, "bytes": 50000 },
  { "extension": "gitignore", "count": 1, "lines": 0, "bytes": 0 },
  { "extension": "No Extension", "count": 2, "lines": 17, "bytes": 235 },
  { "extension": "md", "count": 1, "lines": 3, "bytes": 157 },
  { "extension": "png", "count": 1, "lines": 0, "bytes": 1220000 },
  { "extension": "py", "count": 4, "lines": 36, "bytes": 756 },
  { "extension": "js", "count": 9, "lines": 45, "bytes": 1008 }
]
