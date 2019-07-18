# windows-network-drive

Allows a user to do network drive stuff on Microsoft Windows from node js

### Version 3 update notes

3.0.0 is a maintenance update. There are no API differences between 2.1.2 and 3.0.0. The breaking change is the new minimum version of NodeJS (raised from 4.2.4 to 8.16.0). Dependencies have been removed or updated as well.

## Installation

```bash
$ npm install windows-network-drive
```
## Features

* Mount a network drive that will persist after reboot
* Unmount a network drive
* Get a list of all network drives
* Find if a path is already mounted and get the drive letter
* Convert Unix paths to Windows friendly paths

## Methods

All examples assume:

```javascript
let networkDrive = require('windows-network-drive');
```

### find
Finds if a path is already mounted and returns all drive letters that point to that exact path.
```typescript
find(drivePath: string): Promise<string[]>
```

#### Examples

```javascript
 networkDrive.find("\\\\DoesExist\\Path")
 .then(function (driveLetter)
 {
	 // driveLetter === ["Z"]
 });

  networkDrive.find("\\\\DoesExist\\Path\\ThisFolderIsNotPartOfTheMountPath")
 .then(function (driveLetter)
 {
	 // driveLetter === []
 });

 networkDrive.find("\\\\DoesNOTExist\\Path")
 .then(function (driveLetter)
 {
	 // driveLetter === []
 });
```

### list
List all network drives and their paths.
```typescript
list(void): Promise<object>
```

#### Examples

```javascript
 // With network drives
 networkDrive.list()
 .then(function (drives)
 {
	 /*
		drives = {
			"F":"\\\\DoesExist\\Path\\Files",
			"K":"\\\\NETWORKB\\DRIVE C"
		}
	*/
 });

 // No network drives
 networkDrive.list()
 .then(function (drives)
 {
	 // drives = {}
 });
```

### mount
Mounts a network drive path and returns the new drive letter.
```typescript
mount(drivePath: string, driveLetter?: string, username?: string, password?: string): Promise<string>
```

#### Examples

```javascript
 networkDrive.mount("\\\\DoesExist\\Path\\Files", "F", undefined, undefined)
 .then(function (driveLetter)
 {
	 // driveLetter = "F"
 });
```

### unmount
Unmounts a network drive.
```typescript
unmount(driveLetter: string): Promise<void>
```

#### Examples

```javascript
 networkDrive.unmount("F")
 .then(function ()
 {
	 // done
 });
```

### pathToWindowsPath
Converts a valid file system path to a Windows friendly path.

NOTE: All methods can take in a non Windows friendly path. This is exported for user convenience.
```typescript
pathToWindowsPath(drivePath: string): Promise<string>
```

#### Examples

```javascript
 networkDrive.pathToWindowsPath(//DoesExist/Path/Files)
 .then(function (windowsPath)
 {
	 // windowsPath = \\\\DoesExist\\Path\\Files
 });
```

### isWinOs
Test the current OS is Windows.

```typescript
isWinOs(void): boolean
```

#### Examples

```javascript
 if (true ===networkDrive.isWinOs())
 {
	 console.log("This is running on Windows");
 }
```

## More Examples

For more examples, check out the [example](https://github.com/larrybahr/windows-network-drive/tree/master/example) folder in the GitHub repo!

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Format code with VS Code. Add unit tests for any new or changed functionality. Lint and test your code.

## People

Author and list of all contributors can be found in [package.json](package.json)

## License

  [MIT](LICENSE)
