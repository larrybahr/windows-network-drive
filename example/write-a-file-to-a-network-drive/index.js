let networkDrive = require("windows-network-drive");
const fs = require('fs-extra');
const path = require("path");
const NETWORK_DRIVE_PATH = "//localhost/c$";
const FILE_PATH = "test_folder/another_test_folder";
const FILE_NAME = "test_file.txt";
const FILE_CONTENT = "It worked! " + Date().toString();

Promise.resolve()

	/**
	 * Check if the drive is already mounted. Mount it if it is not.
	 */
	.then(() =>
	{
		console.log("Testing if '" + NETWORK_DRIVE_PATH + "' is already mounted");
		return networkDrive.find(NETWORK_DRIVE_PATH);
	})
	.then((driveLetters) =>
	{
		if (0 < driveLetters.length)
		{
			console.log("The drive is already mounted. Returning the first drive (" + driveLetters[0] + ") letter because they all point to the same place.");
			return driveLetters[0];
		}
		else
		{
			console.log("The path is not mounted. Mount the path");
			return networkDrive.mount(NETWORK_DRIVE_PATH, undefined, undefined, undefined);
		}
	})

	/**
	 * Write the file to the network drive
	 */
	.then((driveLetter) =>
	{
		let filePath;

		filePath = path.join(driveLetter + ":/", FILE_PATH, FILE_NAME);
		fs.ensureFileSync(filePath);
		fs.writeFile(filePath, FILE_CONTENT, (err) =>
		{
			if (err)
			{
				console.log("There was an error while saving the file. err = " + err.message);
				throw err
			};
			console.log('The file has been saved!');
			return;
		});
	})
	.catch((err) =>
	{
		console.error(err);
		return;
	});