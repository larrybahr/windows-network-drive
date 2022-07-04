declare module 'windows-network-drive' {

  interface DriveInfo
  {
    /** Status of the network drive. A falsy value might indicate connectivity issues */
    status: boolean
    /** Drive letter */
    driveLetter: string
    /** Path to the network drive */
    path: string
    /**
     * Status string, describing the status of the network drive.
     * This is a textual value depending on the local Windows system language.
     */
    statusMessage: string
  }

  /** Finds if a path is already mounted and returns all drive letters that point to that exact path. */
  function find(drivePath: string): Promise<DriveInfo[]>;

  /** List all network drives and their paths. */
  function list(): Promise<{ [driveLetter: string]: DriveInfo }>;

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
