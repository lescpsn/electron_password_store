const fileName = 'data.zip'
const fs = require('fs');
const pathArchive = __dirname + '/../archives';
const pathUpload = `${pathArchive}/upload`;
const async   = require('async');
const pathDb = __dirname + '/../db_test/tingo_db/data';

const getUploadPath = date => `${pathUpload}/${date}/`;

const checkDownloadFolder = date => new Promise((ok, bad) => {
	let pathToday =  `${pathUpload}/${date}`;

	async.waterfall([
		cb => fs.exists(pathArchive, exists => exists ? cb(null) : fs.mkdir(pathArchive, e => cb(e))),
		cb => fs.exists(pathUpload, exists => exists ? cb(null) : fs.mkdir(pathUpload, e => cb(e))),
		cb => fs.exists(pathToday, exists => exists ? cb(null) : fs.mkdir(pathToday, e => cb(e)))
	], err => err ? bad(err) : ok(pathToday));
});

/**
 * Get acrhive file name.
 * @method getArchiveName
 * @return {string}
 */
const getArchiveName = () => fileName;
/**
 * Get path folder to database.
 *
 * @method getPathDb
 * @return {string}
 */
const getPathDb = () => pathDb;

/**
 * Return path to new archive
 * @method getNewArchivePath
*  @param  {string} date
 * @return {string}
 */
const getNewArchivePath = date => `${pathArchive}/${date}/${fileName}`;

/**
 * Check exist path to new archive.
 * if no exist create him.
 * @method checkFolderNewArchive
 * @param  {string}  date [description]
 * @return {Promise}
 */
const checkFolderNewArchive = date => new Promise((ok, bad) => {
	let pathToday = `${pathArchive}/${date}`;
	let pathZip = getNewArchivePath(date);

	async.waterfall([
		cb => fs.exists(pathArchive, exists => exists ? cb(null) : fs.mkdir(pathArchive, e => cb(e))),
		cb => fs.exists(pathToday, exists => exists ? cb(null) : fs.mkdir(pathToday, e => cb(e))),
		cb => fs.exists(pathZip, exists => exists ? fs.unlink(pathZip, e => cb(e)) : cb(null))
	], err => err ? bad(err) : ok());

});

const deleteFolderRecursive = path => {
	if ( fs.existsSync(path) ) {

		fs.readdirSync(path).forEach( file => {
			let curPath = path + '/' + file;

			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});

		fs.rmdirSync(path);
	}
}

module.exports = {
	checkFolderNewArchive : checkFolderNewArchive,
	getNewArchivePath : getNewArchivePath,
	getPathDb : getPathDb,
	getArchiveName : getArchiveName,
	checkDownloadFolder : checkDownloadFolder,
	getUploadPath : getUploadPath,
	deleteFolderRecursive : deleteFolderRecursive
}