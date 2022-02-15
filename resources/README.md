# ET Maps

Entropia Mapping readme file.
Version 0.2.0b February 2022
Licensed under CC http://creativecommons.org/licenses/by/4.0/#
*You can copy or use this software freely if you share it in the same terms. For commercial uses contact the author.
*OpenSeadragron is under Free BSD license.*
URL: http://lorna.chafalladas.com/ETail

## Disclaimer.

This software is free for use and copy, the source can be modified as needed and redistributed under the same CC license as long as the author is recognized.
THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY GUARANTEE MADE AS TO ITS SUITABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE. IF YOU CHOOSE TO USE IT, YOU DO SO ENTIRELY AT YOUR OWN RISK.
THE AUTHOR TAKES NO RESPONSIBILITY FOR ANY DAMAGE THAT MAY DIRECTLY OR INDIRECTLY BE CAUSED THROUGH ITS USE OR MISUSE.
IF YOU DO NOT OR CANNOT ACCEPT THESE TERMS FOR WHATEVER REASON, DO NOT USE THIS SOFTWARE.
NO FEE MAY BE CHARGED FOR SUCH DISTRIBUTION OR FOR THE SOFTWARE WITHOUT PRIOR PERMISSION FROM THE AUTHOR.

## Objective of this software.

   Zoomable mapping helper with editable locations.

## Requirements:

   - Windows 8 or higher running in an x64 system.
      Its recomended installing Web2view to run faster the program.
   
   https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section

## Installation:

This program is made in Neutralinojs, a javasript compiler that turns Javascript code into executable programs.
Neutralinojs is uses the javascript engine son you will need to allow its scripts execution manually. A command processor batch is provided to ease the process.

   - Download the 7zip file and copy the files in a directory of your choosing.
   - You must run the batch file **"unblockApp.cmd" **as Administrator to unblock the execution of javascript locally.
   - Download and install Web2view, not mandatory bur reecomended to have a smoother execution. https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section
   - The executable file is "EtMaps-win_x64.exe". There are other binaries intended to run in Mac and Linux.

## Usage:

   - Launch EtMaps-win_x64.exe. The default map is Calypso.
   - At the top you will see two buttons and one selectable list.
   - The button "Reload current map" will open again the map selected in the list if the first load fails.
   - In the selectable list you can choose what map to load. These maps are stored in the "resources.neu" file.
   - The "Add a waypoint map" will open a form to add new waypoint to a map.
   - The map can be zoomed in and out with the mouse wheel.
   - The map will display several icons, each one representing a waypoint. There are different types of icons, representing a type of waypoint. If you click on an icon, it will display a label with additional infomation about the waypoint.
   - At the right o the window you will se an interactive menu where you can see the waypoint names and select their visibility individually or by type just clicking on the icon eyes.
   - Either in the map or in the list you can open a submenu with the secondary button. This submenu will offer you the choice of copying the waypoint link to the clipboard, modify or delete it.
   - There is a status bar at the bottom that will display relevant information, such as the las waypoint copied.
   - At the top left you coud see the map longitude and latitude coordinates where the mouse is moving.

#### Copying a waypoint to the clipboard.

  You can select the waypoints either on icons of the map, or in the list at the rigt of the application window.
  There are two ways to copy a waypoint to the clipboard.

   1. -Press the ctrl key and simultaneously the secondary button of your mouse (right is default, left you configured if inverse buttons). A message will flash and you can see the text copied in the status bar.
   2. -Press the secondary button of your mouse and select the "Copy to clipboard option.
   
#### Adding a new waypoint.
  - **Brief**. Copy a waypoint from the clipboard using "Clipboard text" button, if the text isn't already copied. Select the map you will be adding the waypoint into. Fill the fields with "Fill clipboard". Put a personalized name to the waypoint in the "Name" field. Select the type of waypoint in dthe select field below "Type" text. Fill the additional nfo field if you like. Press the "Add waypoint" button and accept the prompt.
  - This is a valid waypoint to copy. "[Thule, 68460, 70759, 150, Flight Data Recorder]", "/wp [...]" links are also valid.
  
  1. - Press the "Add a waypoint" button. A form will be displayed with several fields and selectable lists. Ther will be also four buttons. From left to right, and top to bottom the following are the description and use of that fields and buttons.
   + - Button "Clipboard text". You can copy to the text field to its right, the text data that is curently in the clipboard. Use it to prepare the data to be parsed, any text that is not a Entropia Universe waypoint or waypoint link will give corrupted data.
   + - Input field "Copied text". The text here will be used to fill the waypoint data, be sure that is a valid waypoint like the ones described before.
   + - Button "Fill with clipboard". Will fill the planet, longitude, latitude, altitude and name fields with the data copied from clipboard. Type and additional info must be filled manually.
   + - Selectable list "Planet". Choose a map or let it be filled with clipboard data.
   + - Input field "Longitude". Longitudinal displacement in Entropia mapping coordinates. Only numeric values are alowed. Can be filled with clipboard data.
   + - Input field "Latitude". Transversal displacement in Entropia mapping coordinates. Only numeric values are alowed. Can be filled with clipboard data.
   + - Input field "Height". Vertical displacement in Entropia mapping coordinates. Only numeric values are alowed. Can be filled with clipboard data.
   + - Input field "Name". Waypoint name, alphanumeric. Can be filled with clipboard data.
   + - Selectable list "Planet". Type of location, NPC or object. Fill it manually.
   + - Input field "Additional info". Alphanumeric. Fill it manually with a brief description or data relevant of the waypoint.
   + - Button "Add waypoint". After you filled the data, click this button to record the new data in the CSV table. A confirmation windows will popup.
   + - Button "Cancel". Close the form and abandon editing.
   
#### Modifying a waypoint.
  - **Brief**. The context menu second option is "Modify waypoint". If you click it, it will show a form similar to the "Add Waypoint", but all the fields are filled with the data of the waypoint selected and there is no buttons or fields related to clipboard actions.
  You can then alter the values as needed and pressing the "Modify waypoint" a popup will ask you to save the changes.
  
  1. - Click the "Modify waypoint" option in the context menu of a waypoint. A form will be displayed with several fields and selectfile:///C:/Users/amdgr/myapp/README.mdable lists. Ther will be also four buttons. From left to right, and top to bottom the following are the description and use of that fields and buttons.
   + - Selectable list "Planet". Choose a map.
   + - Input field "Longitude". Longitudinal displacement in Entropia mapping coordinates. Only numeric values are alowed.
   + - Input field "Latitude". Transversal displacement in Entropia mapping coordinates. Only numeric values are alowed.
   + - Input field "Height". Vertical displacement in Entropia mapping coordinates. Only numeric values are alowed.
   + - Input field "Name". Waypoint name, alphanumeric.
   + - Selectable list "Planet". Type of location, NPC or object.
   + - Input field "Additional info". Alphanumeric. Brief description or data relevant of the waypoint.
   + - Button "Modify waypoint". After you edited the data, click this button to record the new data in the CSV table. A confirmation windows will popup.
   + - Button "Cancel". Close the form and abandon editing.

#### Deleting a waypoint.
  - The context menu third option is "Delete waypoint". If you click it, a popup will ask you to confirm the deletion.
  
#### Showing info of the waypoint.
  - Click on any icon on the map. It will open a box with information of the waypoint.
  - Click on the blue named boxes on the right. Ecah one has a sublist of waypoint of that type, if you click on a name it will show the info box of the waypoint on the map.
  
#### Hiding and showing waypoints.
  - If the map is too cluttered with icons, you can hide some of them to see the waypoints clearly. The "eyes" icons on the list boxes of the right can be clicked to hide or show waypoints.
  - If you click on an open eye in the blue boxes, it will hide all the waypoints of that type. The icon will then be changed to a closed eye, which can be cliecke to restore the visibility.
  - If you click on the eyes next to the waypoint names, you can switch the visibility of that waypoint.

## Files provided in the release.

#### Files in main dir:

   - EtMaps-linux_x64 -Linux executable.
   - EtMaps-mac_x64 -Mac executable.
   - EtMaps-win_x64.exe -Windows executable.
   - WebView2Loader.dll -Windows dinamic link library to invoke web viewer.
   - resources.neu -Data files, icons and maps compressed in ASAR format.
   - unblockApp.cmd -Batch file to unblock the execution of Neutralinojs javascript.
  - sources.7z -Source code of the app and Openseadragon. This not include the map files and other resource files. Thay can be found in the git page of the project or extracted from the resources.neu file.
  - readme.md -This file.
  - License.txt -License of the program.

#### Files in data dir:

  Data files, contains the waypoints and data of each map.  
  This data can be edited by the user either using EtMaps, a text editor or any program capable of using comma separated datasets.
  It's recomended to make backups of this data indepently.

      - Ancient Greece.csv
      - Arkadia Moon.csv
      - Arkadia underground.csv
      - Arkadia.csv
      - Asteroid.csv
      - Calypso.csv
      - Crystal palace.csv
      - Cyrene.csv
      - Dsec-9.csv
      - Howling mine.csv
      - Monria.csv
      - Next Island.csv
      - Rocktropia.csv
      - Secret Island.csv
      - Space station standard.csv
      - Space.csv
      - The hub.csv
      - Thule.csv
      - Toulan.csv
   Some data related to the maps dimensions.
      - MapCoords.txt
      - transformations.txt

# Built with OpenSeadragon

*OpenSeadragon*
https://github.com/openseadragon/openseadragon/

# Icon credits

- `trayIcon.png` - Made by [Freepik](https://www.freepik.com) and downloaded from [Flaticon](https://www.flaticon.com)
- `Icons from` - Silk Icons by FamFamFam https://iconarchive.com/show/silk-icons-by-famfamfam.2.html
- `and` - Fugue Icons by Yusuke Kamiyamane https://iconarchive.com/show/fugue-icons-by-yusuke-kamiyamane.35.html
- `and` - Jonatan Castro Fernández © 2009 - midtone design http://www.midtonedesign.com
- `and` - http://www.fatcow.com/free-icons

#####	Changelog:
 Version 0.2b February 10th 2022.
 Changed programing language to Javascript and Neutralinojs. Chat is no longer read, the waypionts are added directly or via clipboard.

 Version 0.1b April 25th 2015.
 First version. The waypoints are read directly from the chat log via etail.hta and a vbs script to parse and write them.

