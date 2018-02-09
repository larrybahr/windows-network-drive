# Description

This script will mount a drive if it is not mounted. It will then write a file to a sub directory on that drive. Check out [index.js](https://github.com/larrybahr/windows-network-drive/blob/master/example/write-a-file-to-a-network-drive/index.js) to see the code.

## NOTE

This script does not remove the file it writes, the directories it creates, or unmount the drive. It should be easy to look at the ```const```s at the top of the code and remove them.

# To Test

Save this directory to your pc and run the following in the directory:
```bash
$ npm install
$ node index.js
```

## Example Output

If the drive is not mounted (most likely your first run)
```bash
C:\windows-network-drive\example\write-a-file-to-a-network-drive>node index.js
Testing if '//localhost/c$' is already mounted
The path is not mounted. Mount the path
The file has been saved!
```

If the drive is mounted (subsequent runs)
```bash
C:\windows-network-drive\example\write-a-file-to-a-network-drive>node index.js
Testing if '//localhost/c$' is already mounted
The drive is already mounted. Returning the first drive (E) letter because they all point to the same place.
The file has been saved!
```
