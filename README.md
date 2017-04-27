# windows-network-drive

Allows a user to do network drive stuff on Microsoft Windows from node js

## Installation

  `npm install windows-network-drive`

## Usage

All examples assume:

	let networkDrive = require('windows-network-drive');

### find

find(drivePath: string): Promise<string | undefined>

#### Examples

```javascript
 networkDrive.find("\\DoesExist\Path")
 .then(function (driveLetter)
 {
	 // driveLetter === "Z"
 });

 networkDrive.find("\\\\DoesNOTExist\Path")
 .then(function (driveLetter)
 {
	 // driveLetter === undefined
 });
```
### list

list(void): Promise<Object>

#### Examples

```javascript
 networkDrive.list()
 .then(function (drives)
 {
	 /*
		drives = {
			"F":"\\DoesExist\Path\Files",
			"K":"\\NETWORKB\\DRIVE C"
		}
	*/
 });
 ```

### mount

mount(drivePath: string, driveLetter?: string, username?: string, password?: string): Promise<string>

#### Examples

```javascript
 networkDrive.mount("\\\\DoesExist\\Path\\Files", "F", undefined, undefined)
 .then(function (driveLetter)
 {
	 // driveLetter = "F"
 });
```

### unmount

unmount(driveLetter: string): Promise<void>

#### Examples

```javascript
 networkDrive.unmount("F")
 .then(function ()
 {
	 // done
 });
 ```

### pathToWindowsPath

pathToWindowsPath(drivePath: string): Promise<string>

#### Examples

```javascript
 networkDrive.pathToWindowsPath(//DoesExist/Path/Files)
 .then(function (windowsPath)
 {
	 // windowsPath = \\DoesExist\Path\Files
 });
 ```

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Format code with VS Code. Add unit tests for any new or changed functionality. Lint and test your code.
