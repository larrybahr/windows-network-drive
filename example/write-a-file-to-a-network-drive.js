let networkDrive = require("windows-network-drive");

/**
 * Mount the local C:\ as Z:\
 */
networkDrive.mount("\\\\localhost\\c$", "Z", undefined, undefined)
	.then(function (driveLetter)
	{
		const fs = require("fs");
		const path = require("path");
		let filePath;

		/**
		 * This will create a file at "Z:\message.txt" with the contents of "text"
		 * NOTE: Make sure to escape '\' (e.g. "\\" will translate to "\")
		 */
		filePath = path.join(driveLetter + ":\\", "message.txt");
		fs.writeFile(filePath, "text", (err) =>
		{
			if (err) throw err;
			console.log('The file has been saved!');
		});
	});