declare module 'windows-network-drive' {
  /** Finds if a path is already mounted and returns all drive letters that point to that exact path. */
  function find(drivePath: string): Promise<string[]>;

  /** List all network drives and their paths. */
  function list(): Promise<object>;

  /** Mounts a network drive path and returns the new drive letter. */
  function mount(
    drivePath: string,
    driveLetter?: string,
    username?: string,
    password?: string,
  ): Promise<string>;

  /** Unmounts a network drive. */
  function unmount(driveLetter: string): Promise<void>;

  /** Converts a valid file system path to a Windows friendly path. */
  function pathToWindowsPath(drivePath: string): Promise<string>;

  /** Test the current OS is Windows. */
  function isWinOs(): boolean;
}
