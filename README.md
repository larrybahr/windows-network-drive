# windows-network-drive

Allows a user to do network drive stuff on Microsoft Windows from node js

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

```typescript
find(drivePath: string): Promise<string[]>
```

#### Examples

```javascript
 networkDrive.find("\\DoesExist\Path")
 .then(function (driveLetter)
 {
	 // driveLetter === ["Z"]
 });

 networkDrive.find("\\\\DoesNOTExist\Path")
 .then(function (driveLetter)
 {
	 // driveLetter === []
 });
```

### list

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
			"F":"\\DoesExist\Path\Files",
			"K":"\\NETWORKB\\DRIVE C"
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

```typescript
pathToWindowsPath(drivePath: string): Promise<string>
```

#### Examples

```javascript
 networkDrive.pathToWindowsPath(//DoesExist/Path/Files)
 .then(function (windowsPath)
 {
	 // windowsPath = \\DoesExist\Path\Files
 });
```

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