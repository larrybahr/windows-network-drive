'use strict';
let networkDrive = require('../index');
var assert = require('assert');
const VALID_MOUNT_PATH = "\\\\localhost\\c$"; /** This network path should work on every windows computer */

describe('windows-network-drive', function ()
{
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
				});
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
				});
		});
	});
});
