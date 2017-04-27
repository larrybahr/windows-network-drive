'use strict';
let networkDrive = require('../index');
var assert = require('assert');
const VALID_MOUNT_PATH = "\\\\HOUPROGDATA.UCSPROG.PVT\\DRIVE G\\34_000\\Systems\\Project\\bahrlarr";

describe('windows-network-drive', function ()
{
	describe('list()', function ()
	{
		it('should get a list of network drives on windows', function ()
		{
			return networkDrive.list();
		});
	});

	describe('pathToWindowsPath()', function ()
	{
		it('should get a converted path', function ()
		{
			return networkDrive.pathToWindowsPath(VALID_MOUNT_PATH.replace('\\', '/'))
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

	describe('general test (must have a network drive mounted for this to work)', function ()
	{
		it('should unmount and mount a drive with the same letter', function ()
		{
			let driveLetter;

			return networkDrive.find(VALID_MOUNT_PATH)
				.then(function (result)
				{
					if (undefined === result)
					{
						throw (new Error("Could not find mounted path " + VALID_MOUNT_PATH + " . Please mount this path and run the test again."));
					}
					driveLetter = result;
					return;
				})
				.then(function ()
				{
					return networkDrive.unmount(driveLetter);
				})
				.then(function ()
				{
					console.log('here');
					return networkDrive.mount(VALID_MOUNT_PATH, driveLetter);
				})
				.then(function (newDriveLetter)
				{
					if (driveLetter !== newDriveLetter)
					{
						throw ("Drive letter changed from " + driveLetter + " to " + newDriveLetter);
					}
					return;
				})
		});
	});
});
