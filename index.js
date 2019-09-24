"use strict";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const MAX_BUFFER_SIZE = 2000 * 1024;

/**
 * @param {string} input - Drive path to search for
 * @returns {void}
 * @description Assertion if the value is a non empty string
 */
function assertIfNonEmptyString(input)
{
	/**
	 * Ignore this in code coverage because it should never happen
	 */
	/* istanbul ignore if */
	if ("string" === typeof input &&
		0 !== input.length)
	{
		throw (new Error(input));
	}

	return;
}

let windowsNetworkDrive = {
	/**
	 * @function find
	 * @public
	 * @param {string} drivePath - Drive path to search for
	 * @returns {Promise<string[]>} - An array of drive letters that point to the drive path
	 * @description Gets the network drive letter for a path
	 * @example
	 * networkDrive.find("\\DoesExist\Path")
	 * // returns
	 * ["T"]
	 * @example
	 * networkDrive.find("\\DoesNOTExist\Path")
	 * // returns
	 * []
	 */
	find: function find(drivePath)
	{
		let findPromise;

		findPromise = Promise.resolve()
			.then(function ()
			{
				if (false === windowsNetworkDrive.isWinOs())
				{
					throw (new Error('windows-network-drive can only run on windows.'));
				}
			})

			/**
			 * Param check
			 */
			.then(function ()
			{
				if ("string" !== typeof drivePath ||
					0 === drivePath.trim().length)
				{
					throw (new Error('Drive path is not valid. drive path = ' + JSON.stringify(drivePath)));
				}
				return;
			})

			.then(function ()
			{
				return windowsNetworkDrive.pathToWindowsPath(drivePath)
					.then(function (newPath)
					{
						drivePath = newPath;
						return;
					});
			})

			.then(windowsNetworkDrive.list)
			.then(function (networkDrives)
			{
				let driveLetters = [];

				/**
				 * Create the list of drives to path
				 */
				for (let currentDriveLetter in networkDrives)
				{
					let currentDrivePath;

					/**
					 * There is not an easy way to test this
					 */
					/* istanbul ignore if */
					if (!networkDrives.hasOwnProperty(currentDriveLetter))
					{
						continue;
					}
					currentDrivePath = networkDrives[currentDriveLetter];

					if (currentDrivePath === drivePath)
					{
						driveLetters.push(currentDriveLetter.toUpperCase());
					}
				}
				return driveLetters;
			})
		return findPromise;
	},

	/**
	 * @function isWinOs
	 * @public
	 * @returns {boolean} - True if is a Windows OS
	 * @description Test the current OS is Windows. This was split into a function for code testing
	 * @example
	 * if (true ===networkDrive.isWinOs())
	 * {
	 *     console.log("This is running on Windows");
	 * }
	 */
	isWinOs: function isWinOs()
	{
		return /^win/.test(process.platform);
	},

	/**
	 * @function list
	 * @public
	 * @returns {Promise<Object>} - Object keys are drive letters, values are the network path
	 * @description lists all network drives and paths
	 * @example
	 * networkDrive.list()
	 * // returns
	 * {
	 *    "F":"\\NETWORKA\Files",
	 *    "K":"\\NETWORKB\DRIVE G"
	 * }
	 */
	list: function list()
	{
		let listPromise;

		listPromise = Promise.resolve()
			.then(function ()
			{
				if (false === windowsNetworkDrive.isWinOs())
				{
					throw (new Error('windows-network-drive can only run on windows.'));
				}
			})
			.then(function ()
			{
				return exec("wmic path Win32_LogicalDisk Where DriveType=\"4\" get DeviceID, ProviderName", { maxBuffer: MAX_BUFFER_SIZE });
			})
			.then(function (result)
			{
				let pathList;
				let drivePaths = {};
				let currentPathIndex;

				/**
				 * Windows throws an "No Instance(s) Available" error if no network drives are mounted
				 */
				if (-1 == result.stderr.indexOf('No Instance(s) Available'))
				{
					assertIfNonEmptyString(result.stderr);
				}

				/**
				 * Break based on the line endings (one for each network drive)
				 * and remove the header row
				 */
				pathList = result.stdout.split(/\s*[\n\r]+/g);
				pathList.splice(0, 1);

				/**
				 * Create the list of drives to path
				 */
				for (currentPathIndex = 0; currentPathIndex < pathList.length; currentPathIndex++)
				{
					let currentPath = pathList[currentPathIndex];

					if ("string" === typeof currentPath &&
						0 < currentPath.length)
					{
						let colonIndex = currentPath.indexOf(':');
						let driveLetter = currentPath.substring(0, colonIndex);
						let drivePath = currentPath.substring(colonIndex + 1);

						drivePaths[driveLetter.trim().toUpperCase()] = drivePath.trim();
					}
				}
				return drivePaths;
			})
		return listPromise;
	},

	/**
	 * @function mount
	 * @public
	 * @param {string} drivePath - Path to create a network drive to
	 * @param {string} [driveLetter] - Drive letter to use when mounting. If undefined a random drive letter will be used.
	 * @param {string} [username] - Username to use when accessing network drive
	 * @param {string} [password] - Password to use when accessing network drive
	 * @returns {Promise<string>} - Drive letter
	 * @description Creates a network drive
	 * @example
	 * networkDrive.mount("\\NETWORKA\Files")
	 * // returns
	 * "F"
	 */
	mount: function mount(drivePath, driveLetter, username, password)
	{
		let driveLetters = require("windows-drive-letters");
		let mountPromise;
		let mountCommand = "net use";

		mountPromise = Promise.resolve()
			.then(function ()
			{
				if (false === windowsNetworkDrive.isWinOs())
				{
					throw (new Error('windows-network-drive can only run on windows.'));
				}
			})

			/**
			 * Param check
			 */
			.then(function ()
			{

				if ("string" !== typeof drivePath || 0 === drivePath.trim().length)
				{
					throw (new Error('Drive path is not valid. drive path = ' + JSON.stringify(drivePath)));
				}
				drivePath = drivePath.trim();

				if ("string" === typeof driveLetter)
				{
					driveLetter = driveLetter.trim();
				}
				if ("string" !== typeof driveLetter && undefined !== driveLetter)
				{
					throw (new Error('Drive letter must be a string or undefined'));
				}
				else if ("" === driveLetter)
				{
					driveLetter = undefined;
				}

				if ("string" !== typeof username && undefined !== username)
				{
					throw (new Error('Username must be a string or undefined'));
				}
				else if ("" === username)
				{
					username = undefined;
				}

				if ("string" !== typeof password && undefined !== password)
				{
					throw (new Error('Password must be a string or undefined'));
				}
				else if ("" === password)
				{
					password = undefined;
				}
				return;
			})

			.then(function ()
			{
				return windowsNetworkDrive.pathToWindowsPath(drivePath)
					.then(function (newPath)
					{
						drivePath = newPath;
						return;
					});
			})

			/**
			 * Get the next drive letter
			 */
			.then(driveLetters.randomFree)
			.then(function (newDriveLetter)
			{
				if (undefined === driveLetter)
				{
					/**
					 * Get a drive letter if one was not given
					 */
					driveLetter = newDriveLetter;
				}
				return;
			})

			/**
			 * Create the command to run
			 */
			.then(function ()
			{
				mountCommand += " " + driveLetter + ": \"" + drivePath + "\" /P:Yes";

				/**
				 * There is not an easy way to setup a network drive with a username and password
				 */
				/* istanbul ignore next */
				if ("string" === typeof username &&
					"string" === typeof password)
				{
					mountCommand += " /user:" + username + " " + password;
				}
			})

			/**
			 * mount the drive
			 */
			.then(function ()
			{
				return exec(mountCommand, { maxBuffer: MAX_BUFFER_SIZE });
			})
			.then(function (result)
			{
				assertIfNonEmptyString(result.stderr);
				return;
			})

			/**
			 * Return the drive letter for this mount
			 */
			.then(function ()
			{
				return driveLetter.toUpperCase();
			})
		return mountPromise;
	},

	/**
	 * @function unmount
	 * @public
	 * @param {string} driveLetter - Drive letter to remove
	 * @returns {Promise<void>}
	 * @description Removes a network drive
	 * @example
	 * networkDrive.unmount("F")
	 */
	unmount: function unmount(driveLetter)
	{
		let driveLetters = require("windows-drive-letters");
		let unmountPromise;

		unmountPromise = Promise.resolve()
			.then(function ()
			{
				if (false === windowsNetworkDrive.isWinOs())
				{
					throw (new Error('windows-network-drive can only run on windows.'));
				}
			})

			/**
			 * Param check
			 */
			.then(function ()
			{
				if ("string" !== typeof driveLetter || 0 === driveLetter.trim().length)
				{
					throw (new Error('Drive letter is not valid'));
				}
				driveLetter = driveLetter.trim().toUpperCase();
				return;
			})

			/**
			 * Get the used drive letter
			 */
			.then(driveLetters.used)
			.then(function (letters)
			{
				/**
				 * If this drive is mounted, remove it
				 */
				if (-1 !== letters.indexOf(driveLetter))
				{
					let unmountCommand = "net use " + driveLetter + ": /Delete /y";

					return exec(unmountCommand, { maxBuffer: MAX_BUFFER_SIZE })
						.then(function (result)
						{
							assertIfNonEmptyString(result.stderr);
							return;
						});
				}
				/**
				 * Ignore false possitive
				 */
				/* istanbul ignore next */
				return;
			})
		return unmountPromise;
	},

	/**
	 * @function pathToWindowsPath
	 * @public
	 * @param {string} drivePath - Path to be converted
	 * @returns {Promise<string>} - Converted path
	 * @description Converts a path to a windows path
	 * @example
	 * networkDrive.pathToWindowsPath('K:/test')
	 * // returns
	 * 'K:\test'
	 */
	pathToWindowsPath: function pathToWindowsPath(drivePath)
	{
		let pathPromise;

		pathPromise = Promise.resolve()
			.then(function ()
			{
				if (false === windowsNetworkDrive.isWinOs())
				{
					throw (new Error('windows-network-drive can only run on windows.'));
				}
				return;
			})

			/**
			 * Param check
			 */
			.then(function ()
			{
				if ("string" !== typeof drivePath)
				{
					throw (new Error('Drive path is not valid. drive path = ' + JSON.stringify(drivePath)));
				}

				drivePath = drivePath.trim();
				if (0 === drivePath.length)
				{
					throw (new Error('Drive path is not valid. drive path is only whitespace. drive path = ' + JSON.stringify(drivePath)));
				}
				return;
			})

			.then(function ()
			{
				drivePath = path.normalize(drivePath);
				drivePath = drivePath.replace('/', '\\');

				/**
				 * Remove the trailing \ because it breaks the net use command
				 */
				drivePath = drivePath.replace(/\\+$/, '');
				return drivePath;
			});
		return pathPromise;
	}
}

exports.list = windowsNetworkDrive.list;
exports.pathToWindowsPath = windowsNetworkDrive.pathToWindowsPath;
exports.mount = windowsNetworkDrive.mount;
exports.find = windowsNetworkDrive.find;
exports.unmount = windowsNetworkDrive.unmount;
exports.isWinOs = windowsNetworkDrive.isWinOs;
