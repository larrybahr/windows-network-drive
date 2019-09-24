'use strict';
let networkDrive = require('../index');
var assert = require('assert');
const VALID_MOUNT_PATH = "\\\\localhost\\c$"; /** This network path should work on every windows computer */

describe('windows-network-drive', function ()
{
	describe('isWinOs()', function ()
	{
		it('should work on a Windows OS', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					if (true !== networkDrive.isWinOs())
					{
						throw (new Error("Windows OS failed!"));
					}
					return;
				});
		});

		it('should not work on a non Windows OS', function ()
		{
			var originalPlatform = process.platform;

			return Promise.resolve()
				.then(function ()
				{
					/**
					 * Fake the OS so this test can fail
					 * https://stackoverflow.com/a/30405547/6194193
					 */
					Object.defineProperty(process, 'platform', {
						value: 'MockOS'
					});
					if (false !== networkDrive.isWinOs())
					{
						throw (new Error("Non Windows OS passed!"));
					}

					/**
					 * Set the OS back to the original value so the other tests pass
					 */
					Object.defineProperty(process, 'platform', {
						value: originalPlatform
					});
					return;
				});
		});
	});

	describe('pathToWindowsPath()', function ()
	{
		it('should get a converted path', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.pathToWindowsPath(VALID_MOUNT_PATH.replace('\\', '/'));
				})
				.then(function (newPath)
				{
					if (VALID_MOUNT_PATH !== newPath)
					{
						throw (new Error("Path was not correct. newPath = " + JSON.stringify(newPath)));
					}
					return;
				});
		});

		it('should not work on a non Windows OS', function ()
		{
			var originalPlatform = process.platform;

			return Promise.resolve()
				.then(function ()
				{
					/**
					 * Fake the OS so this test can fail
					 * https://stackoverflow.com/a/30405547/6194193
					 */
					Object.defineProperty(process, 'platform', {
						value: 'MockOS'
					});
					return networkDrive.pathToWindowsPath(VALID_MOUNT_PATH.replace('\\', '/'));
				})
				.then(function (result)
				{
					/**
					 * The OS will be set back in the catch
					 */
					throw (new Error("Non Windows OS passed! result = " + result));
				})
				.catch(function (err)
				{
					/**
					 * Set the OS back to the original value so the other tests pass
					 */
					Object.defineProperty(process, 'platform', {
						value: originalPlatform
					});

					if (false == err.message.startsWith("windows-network-drive can only run on windows."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				})
		});

		it('should not allow paths that are only white space', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.pathToWindowsPath(" \t\n\r");
				})
				.then(function (result)
				{
					throw (new Error("Only white space passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive path is not valid. drive path is only whitespace."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not allow invalid paths', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.pathToWindowsPath(1);
				})
				.then(function (result)
				{
					throw (new Error("Invalid path passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive path is not valid."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});
	});

	describe('mount() and unmount()', function ()
	{
		it('should mount and unmount a drive', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH);
				})
				.then(function (driveLetter)
				{
					return networkDrive.unmount(driveLetter);
				});
		});

		it('should mount and unmount a drive (all parameters specified as empty strings)', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH, "", "", "");
				})
				.then(function (driveLetter)
				{
					return networkDrive.unmount(driveLetter);
				});
		});

		it('should unmount a drive if it was never actually mounted', function ()
		{
			return Promise.resolve()
				.then(function (driveLetter)
				{
					let driveLetters = require("windows-drive-letters");

					return networkDrive.unmount(driveLetters.randomFreeSync());
				});
		});

		it('should mount a drive twice with the same drive letter', function ()
		{
			let firstDriveLetter;
			let secondDriveLetter;

			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH);
				})
				.then(function (driveLetter)
				{
					firstDriveLetter = driveLetter;
					return networkDrive.unmount(driveLetter);
				})
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH, firstDriveLetter);
				})
				.then(function (driveLetter)
				{
					/**
					 * Save the drive letter and clean up before testing if it worked
					 */
					secondDriveLetter = driveLetter;
					return networkDrive.unmount(driveLetter);
				})
				.then(function ()
				{
					if (firstDriveLetter !== secondDriveLetter)
					{
						throw (new Error("Drive letter changed from " + firstDriveLetter + " to " + secondDriveLetter));
					}
					return;
				});
		});

		it('should not mount if parameters are only white space', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(" \t\n\r");
				})
				.then(function (result)
				{
					throw (new Error("Only white space passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive path is not valid. drive path"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not mount if password parameters is not undefined or a string', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH, undefined, undefined, 0);
				})
				.then(function (result)
				{
					throw (new Error("Invalid password passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Password must be a string or undefined"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not unmount if parameters are only white space', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.unmount(" \t\n\r");
				})
				.then(function (result)
				{
					throw (new Error("Only white space passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive letter is not valid"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not mount if parameters are not strings', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(0);
				})
				.then(function (result)
				{
					throw (new Error("None string passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive path is not valid. drive path"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not mount if driveLetter is invalid', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH, 0);
				})
				.then(function (result)
				{
					throw (new Error("Invalid value passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive letter must be a string or undefined"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not mount if username is invalid', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH, undefined, 0);
				})
				.then(function (result)
				{
					throw (new Error("Invalid value passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Username must be a string or undefined"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('should not unmount if parameters are only white space', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.unmount(0);
				})
				.then(function (result)
				{
					throw (new Error("None string passed! result = " + result));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive letter is not valid"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				});
		});

		it('mount should not work on a non Windows OS', function ()
		{
			var originalPlatform = process.platform;

			return Promise.resolve()
				.then(function ()
				{
					/**
					 * Fake the OS so this test can fail
					 * https://stackoverflow.com/a/30405547/6194193
					 */
					Object.defineProperty(process, 'platform', {
						value: 'MockOS'
					});
					return networkDrive.mount(VALID_MOUNT_PATH);
				})
				.then(function (result)
				{
					/**
					 * The OS will be set back in the catch
					 */
					throw (new Error("Non Windows OS passed! result = " + result));
				})
				.catch(function (err)
				{
					/**
					 * Set the OS back to the original value so the other tests pass
					 */
					Object.defineProperty(process, 'platform', {
						value: originalPlatform
					});

					if (false == err.message.startsWith("windows-network-drive can only run on windows."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				})
		});

		it('unmount should not work on a non Windows OS', function ()
		{
			var originalPlatform = process.platform;

			return Promise.resolve()
				.then(function ()
				{
					/**
					 * Fake the OS so this test can fail
					 * https://stackoverflow.com/a/30405547/6194193
					 */
					Object.defineProperty(process, 'platform', {
						value: 'MockOS'
					});
					return networkDrive.unmount("a");
				})
				.then(function (result)
				{
					/**
					 * The OS will be set back in the catch
					 */
					throw (new Error("Non Windows OS passed! result = " + result));
				})
				.catch(function (err)
				{
					/**
					 * Set the OS back to the original value so the other tests pass
					 */
					Object.defineProperty(process, 'platform', {
						value: originalPlatform
					});

					if (false == err.message.startsWith("windows-network-drive can only run on windows."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				})
		});
	});

	describe('list()', function ()
	{
		it('should get a list of network drives on windows', function ()
		{
			let driveLetter;
			let driveList;

			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH);
				})
				.then(function (result)
				{
					driveLetter = result;
					return networkDrive.list();
				})
				.then(function (result)
				{
					driveList = result;

					/**
					 * Clean up the mounted drive path
					 */
					return networkDrive.unmount(driveLetter);
				})
				.then(function ()
				{
					/**
					 * A drive was mounted so there should be at least one network drive listed
					 */
					if ('object' !== typeof driveList || 1 > Object.keys(driveList).length)
					{
						throw (new Error("Could not get drive list. driveList = " + JSON.stringify(driveList, null, '\t')));
					}
					return;
				});
		});

		it('should get an empty list of network drives on windows', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.list();
				})
				.then(function (driveList)
				{
					if ('object' !== typeof driveList || 0 !== Object.keys(driveList).length)
					{
						throw (new Error("0 drives should be in the list, but found" + Object.keys(driveList).length + ". driveList = " + JSON.stringify(driveList, null, '\t')));
					}
					return;
				});
		});

		it('should not work on a non Windows OS', function ()
		{
			var originalPlatform = process.platform;

			return Promise.resolve()
				.then(function ()
				{
					/**
					 * Fake the OS so this test can fail
					 * https://stackoverflow.com/a/30405547/6194193
					 */
					Object.defineProperty(process, 'platform', {
						value: 'MockOS'
					});
					return networkDrive.list();
				})
				.then(function (result)
				{
					/**
					 * The OS will be set back in the catch
					 */
					throw (new Error("Non Windows OS passed! result = " + result));
				})
				.catch(function (err)
				{
					/**
					 * Set the OS back to the original value so the other tests pass
					 */
					Object.defineProperty(process, 'platform', {
						value: originalPlatform
					});

					if (false == err.message.startsWith("windows-network-drive can only run on windows."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				})
		});
	});

	describe('find()', function ()
	{
		it('should mount a drive and find the drive letter', function ()
		{
			let driveLetter;
			let foundDriveLetters;

			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.mount(VALID_MOUNT_PATH);
				})
				.then(function (result)
				{
					driveLetter = result;
					return;
				})
				.then(function ()
				{
					return networkDrive.find(VALID_MOUNT_PATH);
				})
				.then(function (result)
				{
					foundDriveLetters = result;
					return;
				})
				.then(function ()
				{
					/**
					 * Clean up the mounted drive path
					 */
					return networkDrive.unmount(driveLetter);
				})
				.then(function ()
				{
					if (false === Array.isArray(foundDriveLetters) || 0 === foundDriveLetters.length)
					{
						throw (new Error("Could not find mounted path " + VALID_MOUNT_PATH + "."));
					}

					if (-1 === foundDriveLetters.indexOf(driveLetter))
					{
						throw (new Error("Should have found drive letter " + driveLetter + " in " + JSON.stringify(foundDriveLetters)));
					}
					return;
				});
		});

		it('should not work with an invalid parameter type', function ()
		{
			return Promise.resolve()
				.then(function ()
				{
					return networkDrive.find(0);
				})
				.then(function ()
				{
					/**
					 * The OS will be set back in the catch
					 */
					throw (new Error("Invalid parameter passed!"));
				})
				.catch(function (err)
				{
					if (false == err.message.startsWith("Drive path is not valid. drive path"))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				})
		});

		it('should not work on a non Windows OS', function ()
		{
			var originalPlatform = process.platform;

			return Promise.resolve()
				.then(function ()
				{
					/**
					 * Fake the OS so this test can fail
					 * https://stackoverflow.com/a/30405547/6194193
					 */
					Object.defineProperty(process, 'platform', {
						value: 'MockOS'
					});
					return networkDrive.find();
				})
				.then(function (result)
				{
					/**
					 * The OS will be set back in the catch
					 */
					throw (new Error("Non Windows OS passed! result = " + result));
				})
				.catch(function (err)
				{
					/**
					 * Set the OS back to the original value so the other tests pass
					 */
					Object.defineProperty(process, 'platform', {
						value: originalPlatform
					});

					if (false == err.message.startsWith("windows-network-drive can only run on windows."))
					{
						throw (new Error("Got an unexpected error. err = " + err));
					}
					return;
				})
		});
	});
});
