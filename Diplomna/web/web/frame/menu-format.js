var MENU_FORMAT =
[
//0. left position
	6,
//1. top position
	0,
//2. show +/- buttons
	false,
//3. couple of button images (collapsed/expanded/blank)
	["http://pdbase.government.bg/frame/menu-button-collapsed.gif",
         "http://pdbase.government.bg/frame/menu-button-expanded.gif",
         "http://pdbase.government.bg/frame/menu-blank.gif"],
//4. size of images (width, height,ident for nodes w/o children)
	[16, 16, 0],
//5. show folder image
	true,
//6. folder images (closed/opened/document)
	["http://pdbase.government.bg/frame/menu-folder-closed-b.gif",
         "http://pdbase.government.bg/frame/menu-folder-open-b.gif",
         "http://pdbase.government.bg/frame/menu-blank.gif"],
//7. size of images (width, height)
	[16,16],
//8. identation for each level [0/*first level*/, 16/*second*/, 32/*third*/,...]
	[0,5,14,48],
//9. tree background color ("" - transparent)
	"",
//10. default style for all nodes
	"treeNodeSpec0",
//11. styles for each level of menu (default style will be used for undefined levels)
	["treeNodeSpec0", "treeNodeSpec1", "treeNodeSpec2"],
//12. true if only one branch can be opened at same time
	true,
//13. item pagging and spacing
	[0, 0],
//14. "explorer-like" mode
	false,
//15. images for "explorer-like" mode
	[],
//16. size of images for "explorer-like" mode: width, height
	[19, 16],
//17. store tree state into cookies
	false,
//18. relative positioning mode
	true,
//19. initial space for the relatively positioned tree: width, height
	[190, 50],
//20. resize container of the relatively positioned tree
	true,
//21. change background-color and style for selected node
	false,
//22. background color for unselected node, background color for selected node, class for selected node
	["", "", ""],
//23. text wrapping margin
	190,
//24. vertical alignment for buttons and icons
	"middle"
];

//Sledvashtite redove tryabva da sa izvan html fayla, za da ne gi blokira Internet Explorer.
  var mainmenu = new COOLjsTreePRO("mainmenu", MENU_NODES, MENU_FORMAT);
  mainmenu.init();