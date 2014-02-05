// Title: COOLjsTree
// URL: http://javascript.cooldev.com/scripts/cooltree/
// Version: 2.8.3
// Last Modify: 12 May 2006
// Notes: Registration needed to use this script on your web site.
// Copyright (c) 2001-2005 by CoolDev.Com
// Copyright (c) 2001-2005 by Sergey Nosenko

// Options: PROFESSIONAL



(function () {

function UNDERLINEisFunction(UNDERLINEvalue)
{
        return typeof UNDERLINEvalue == 'function';
}

function UNDERLINEisUndefined(UNDERLINEvalue)
{
        return typeof UNDERLINEvalue == 'undefined';
}

function UNDERLINEisNumber(UNDERLINEvalue)
{
        return typeof UNDERLINEvalue == 'number';
}

function UNDERLINEisObject(UNDERLINEvalue)
{
        return typeof UNDERLINEvalue == 'object';
}

function UNDERLINELargeString(UNDERLINEinitialValue)
{
    this.UNDERLINEpieces = [ UNDERLINEisUndefined(UNDERLINEinitialValue) ? '' : UNDERLINEinitialValue ];
}

UNDERLINELargeString.prototype =
{
    UNDERLINEprepend:function (UNDERLINEpiece) { this.UNDERLINEpieces.splice(0, 0, [ UNDERLINEpiece ]); return this; },
    UNDERLINEappendString:function (UNDERLINEstring) { this.UNDERLINEpieces[this.UNDERLINEpieces.length] = UNDERLINEstring; return this; },
    UNDERLINEappendLargeString:function (UNDERLINEstring) { this.UNDERLINEpieces = this.UNDERLINEpieces.concat(UNDERLINEstring.UNDERLINEpieces); return this; },
    UNDERLINEcompileTemplate:function ()
    {
        var UNDERLINEstring = this.UNDERLINEgetValue(), UNDERLINEresult = [], UNDERLINEpos = 0;

        while ((UNDERLINEpos = UNDERLINEstring.indexOf('{', UNDERLINEpos)) != -1 && UNDERLINEstring.length - UNDERLINEpos > 2)
            if (UNDERLINEstring.charAt(UNDERLINEpos + 2) == '}')
            {
                UNDERLINEresult[UNDERLINEresult.length] = UNDERLINEstring.slice(0, UNDERLINEpos);
                UNDERLINEresult[UNDERLINEresult.length] = parseInt(UNDERLINEstring.charAt(UNDERLINEpos + 1));
                UNDERLINEstring = UNDERLINEstring.slice(UNDERLINEpos + 3);
                UNDERLINEpos = 0;
            }

        return UNDERLINEresult.concat([ UNDERLINEstring ]);
    },
    UNDERLINEexpandTemplate:function (UNDERLINEtemplate, UNDERLINEparameters)
    {
        this.UNDERLINEappendString(UNDERLINEtemplate[0]);

        for (var i = 1; i < UNDERLINEtemplate.length; i += 2)
            this.UNDERLINEappendString(UNDERLINEparameters[UNDERLINEtemplate[i]]).UNDERLINEappendString(UNDERLINEtemplate[i + 1]);

        return this;
    },
    UNDERLINEgetValue:function () { return this.UNDERLINEpieces.join(''); }
};

function UNDERLINETree(UNDERLINEname, UNDERLINEnodes, UNDERLINEformat, UNDERLINEstatic)
{
    this.name = this.UNDERLINEname = UNDERLINEname;
    this.bw = new UNDERLINETree.UNDERLINEBrowserDetector();

    with (UNDERLINETree.UNDERLINENode.prototype)

    {
        if (this.bw.gecko)
            UNDERLINEupdateDimensions = UNDERLINEupdateDimensionsUNDERLINEgecko;
        else if (this.bw.ns4)
            UNDERLINEupdateDimensions = UNDERLINEupdateDimensionsUNDERLINEns4;
        else if (this.bw.operaNew)
            UNDERLINEupdateDimensions = UNDERLINEupdateDimensionsUNDERLINEoperaNew;
        else if (this.bw.UNDERLINEoperaOld)
            UNDERLINEupdateDimensions = UNDERLINEupdateDimensionsUNDERLINEoperaOld;
        else
            UNDERLINEupdateDimensions = UNDERLINEupdateDimensionsUNDERLINEdefault;

        if (this.bw.ns4)
            UNDERLINEmoveTo = UNDERLINEmoveToUNDERLINEns4;
        else
            UNDERLINEmoveTo = UNDERLINEmoveToUNDERLINEdefault;
    }

    var UNDERLINEfmt = {
        UNDERLINEleft:UNDERLINEformat[0],
        UNDERLINEtop:UNDERLINEformat[1],
        UNDERLINEshow:{ nb:UNDERLINEformat[2], nf:UNDERLINEformat[5] },
        UNDERLINEbuttons:UNDERLINEformat[3],
        UNDERLINEblankImage:UNDERLINEformat[3][2],
        UNDERLINEbuttonWidth:UNDERLINEformat[4][0],
        UNDERLINEbuttonHeight:UNDERLINEformat[4][1],
        UNDERLINEchildlessNodesIndent:UNDERLINEformat[4][2],
        UNDERLINEfolders:UNDERLINEformat[6],
        UNDERLINEiconWidth:UNDERLINEformat[7][0],
        UNDERLINEiconHeight:UNDERLINEformat[7][1],
        UNDERLINEindentation:UNDERLINEformat[8],
        UNDERLINEcssClass:UNDERLINEformat[10],
        UNDERLINEcssClasses:UNDERLINEformat[11],
        UNDERLINEsingleBranch:UNDERLINEformat[12],
        UNDERLINEpadding:UNDERLINEformat[13][0],
        UNDERLINEspacing:UNDERLINEformat[13][1]

        ,
        exp:UNDERLINEformat[14],
        expimg:UNDERLINEformat[15],
        expimgsize:UNDERLINEformat[16],
        cook:UNDERLINEformat[17],
        rel:UNDERLINEformat[18],
        rels:UNDERLINEformat[19],
        resize:UNDERLINEformat[20],
        sel:UNDERLINEformat[21],
        selC:UNDERLINEformat[22],
        UNDERLINEcssClassForSelectedNode:UNDERLINEformat[22] ? UNDERLINEformat[22][2] : '',
        UNDERLINEcssClassForOpenedNode:UNDERLINEformat[22] ? UNDERLINEformat[22][3] : '',
        UNDERLINEwrappingMargin:UNDERLINEformat[23] || 0,
        UNDERLINEimageAlignment:UNDERLINEformat[24] || 'middle'

    };

    if (UNDERLINEfmt.UNDERLINEshow.nb)
        UNDERLINEpreloadImages(UNDERLINEformat[3]);

    if (UNDERLINEfmt.UNDERLINEshow.nf)
        UNDERLINEpreloadImages(UNDERLINEformat[6]);

    this.UNDERLINEformat = UNDERLINEfmt;
    this.UNDERLINEselectedNodeIndex = null;

    if (!this.bw.UNDERLINEver3)
        this.UNDERLINEback = new UNDERLINETree.UNDERLINEBack(UNDERLINEformat[9], this);
    if (UNDERLINEisUndefined(window.CTrees))
        window.CTrees = [];
    window.CTrees[UNDERLINEname] = this;
    this.jsPath = "window.CTrees['" + UNDERLINEname + "']";
    this.Nodes = this.UNDERLINEnodes = [];
    this.UNDERLINElastLocalIndex = -1;
    this.UNDERLINElayerIndex = 0;

    this.UNDERLINElayersToDetach = {};

    this.UNDERLINEbackbone = this.UNDERLINEprepareNode(([ {id:null}, '', null, null, {format:{}} ]).concat(UNDERLINEnodes));

    this.UNDERLINEpx = this.bw.UNDERLINEoperaOld ? '' : 'px';
    this.UNDERLINEdynamic = !UNDERLINEstatic && this.bw.dom && !this.bw.UNDERLINEoperaOld && !this.bw.ns4;
    this.UNDERLINErtl = document.body && document.body.dir == 'rtl';

    this.UNDERLINEredrawAfter = -1;

    this.UNDERLINEtemplates =
    {
        UNDERLINEanchor:'<a onmouseover="' + this.UNDERLINEhandler('{0}', 'onmouseover', '{1}') + '" href="{2}" target="{3}" id="{4}" class="{5}" style="color: white; text-decoration: none;">{6}</a>',
        UNDERLINEimage:'<img src="{0}" name="{1}" id="{1}" width="{2}" height="{3}" border="0" style="border: 0px solid transparent;"' + (this.bw.ns4 ? '' : ' style="display:block"') + ' />',

        UNDERLINEsquare:'<td style="font-size:1px{2}" width="{0}" valign="{3}">{1}</td>',

        UNDERLINEnodeContent:'<table{0} cellpadding="' + this.UNDERLINEformat.UNDERLINEpadding + '" cellspacing="' + this.UNDERLINEformat.UNDERLINEspacing + '" border="0" class="cls' + this.UNDERLINEname + 'UNDERLINEback{1}" style="border-top:1px solid grey;"><tbody><tr>{2}{3}<td{4}><div id="{5}a" style="position:relative;">{6}</div></td></tr></tbody></table>',
        UNDERLINEnodeWrapper:'<div onmouseover=' + this.UNDERLINEhandler('layer', 'onmouseover', '{0}') + ' id="{1}d"  style="{2}left:-10000px;top:-10000px;position:absolute;{3}">{4}</div>'
    };

    for (var i in this.UNDERLINEtemplates)
        this.UNDERLINEtemplates[i] = new UNDERLINELargeString(this.UNDERLINEtemplates[i]).UNDERLINEcompileTemplate();

}

DOLLAR = UNDERLINETree.prototype;

UNDERLINETree.UNDERLINEredrawAllTrees = function ()
{
    if (!new UNDERLINETree.UNDERLINEBrowserDetector().ns4)
        for (var i in window.CTrees)
        {
            window.CTrees[i].UNDERLINEredrawComplete = true;
            window.CTrees[i].draw();
        }
}

DOLLAR.DOLLARhandleEvent = function (UNDERLINEprefix, UNDERLINEsuffix, UNDERLINEnodeIndex, UNDERLINEobject, UNDERLINEevent)
{
    var UNDERLINEnode = this.UNDERLINEnodeByIndex(UNDERLINEnodeIndex), UNDERLINEhandler = UNDERLINEprefix + 'UNDERLINE' + UNDERLINEsuffix;

    if (!UNDERLINEnode)
        return false;

    if (!UNDERLINEnode.UNDERLINEhandlersAttached[UNDERLINEprefix])
    {
        this.UNDERLINEattachHandlers(UNDERLINEprefix, UNDERLINEobject, this, UNDERLINEnodeIndex);
        this.UNDERLINEattachHandlers(UNDERLINEprefix, UNDERLINEobject, UNDERLINEnode.UNDERLINEgetFormat(), UNDERLINEnodeIndex);
        UNDERLINEnode.UNDERLINEhandlersAttached[UNDERLINEprefix] = true;
    }

    this.UNDERLINEexecuteHandler(UNDERLINEhandler, UNDERLINEnode.UNDERLINEgetFormat(), UNDERLINEnode, UNDERLINEevent);
    return this.UNDERLINEexecuteHandler(UNDERLINEhandler, this, UNDERLINEnode, UNDERLINEevent);
}

DOLLAR.UNDERLINEattachHandlers = function (UNDERLINEprefix, UNDERLINEobject, UNDERLINEhost, UNDERLINEnodeIndex)
{
    for (var UNDERLINEhandler in UNDERLINEhost)
        if (UNDERLINEhandler.match(new RegExp('^' + UNDERLINEprefix + 'UNDERLINE' + '(on.+)DOLLAR')))
            UNDERLINEobject[RegExp.DOLLAR1] = new Function(this.UNDERLINEhandler(UNDERLINEprefix, RegExp.DOLLAR1, UNDERLINEnodeIndex));
}

DOLLAR.UNDERLINEexecuteHandler = function (UNDERLINEhandler, UNDERLINEhost, UNDERLINEargument, UNDERLINEevent)
{
    return UNDERLINEhost[UNDERLINEhandler] ? UNDERLINEhost[UNDERLINEhandler](UNDERLINEargument, UNDERLINEevent) : false;
}

DOLLAR.UNDERLINEhandler = function (UNDERLINEprefix, UNDERLINEevent, UNDERLINEnodeIndex)
{
    return 'return ' + this.jsPath + '.DOLLARhandleEvent(\'' + UNDERLINEprefix + '\',\'' + UNDERLINEevent + '\',' + UNDERLINEnodeIndex + ',this,window.event||arguments[0])';
}

DOLLAR.getAdditionalColumns = function (UNDERLINEnode)
{
    return '';
}

DOLLAR.getRoot = DOLLAR.UNDERLINEgetRoot = function ()
{
    if (!this.UNDERLINEroot)
    {
        this.UNDERLINEbackbone.UNDERLINEobject = this.UNDERLINEroot = new UNDERLINETree.UNDERLINENode(this.UNDERLINEbackbone, this, null, false);
        this.UNDERLINEroot.UNDERLINEsetExpanded(true);
    }

    return this.UNDERLINEroot;
}

DOLLAR.UNDERLINEfindNode = function (UNDERLINEindex)
{
    var UNDERLINEpath = this.UNDERLINEnodePathBy('n', UNDERLINEindex, this.UNDERLINEbackbone.UNDERLINEchildren);

    if (!UNDERLINEpath)
        return null;

    var UNDERLINEparent = this.UNDERLINEbackbone, i = 0;

    for (var i = 0; i < UNDERLINEpath.length - 1; i++)
        UNDERLINEparent = UNDERLINEparent.UNDERLINEchildren[UNDERLINEpath[i]];

    return [ UNDERLINEparent, UNDERLINEpath[i] ];
}

DOLLAR.UNDERLINEstripObjects = function (UNDERLINEnode)
{
    if (UNDERLINEnode == this.UNDERLINEroot)
        this.UNDERLINEroot = null;

    if (UNDERLINEnode.UNDERLINEobject)
    {
        UNDERLINEnode.UNDERLINEobject.UNDERLINEdetachLayers();
        UNDERLINEnode.UNDERLINEparentNode = null;
        UNDERLINEnode.UNDERLINEobject = null;
    }

    for (var i in UNDERLINEnode.UNDERLINEchildren)
        if (UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEobject)
            this.UNDERLINEstripObjects(UNDERLINEnode.UNDERLINEchildren[i]);
}

DOLLAR.UNDERLINEinsertNodes = function (UNDERLINEparentIndex, UNDERLINEminorIndex, UNDERLINEdefinition, UNDERLINEnoUNDERLINEchildren)
{
    var UNDERLINEparent;
	
    if (UNDERLINEparentIndex == this.UNDERLINEbackbone.UNDERLINEindex)
        UNDERLINEparent = this.UNDERLINEbackbone;
    else
    {
        var UNDERLINEpair = this.UNDERLINEfindNode(UNDERLINEparentIndex);
        if (UNDERLINEpair)
            UNDERLINEparent = UNDERLINEpair[0].UNDERLINEchildren[UNDERLINEpair[1]];
    }
	
    if (UNDERLINEparent)
    {
        this.UNDERLINEstripObjects(UNDERLINEparent);
		
        for (var i in UNDERLINEdefinition)
        {
            UNDERLINEdefinition[i] = this.UNDERLINEprepareNode(UNDERLINEdefinition[i], UNDERLINEnoUNDERLINEchildren);
        }   

        
        UNDERLINEminorIndex = Math.max(0, Math.min(UNDERLINEminorIndex, UNDERLINEparent.UNDERLINEchildren.length));
		
        if (UNDERLINEminorIndex == UNDERLINEparent.UNDERLINEchildren.length)
        {
        	
            UNDERLINEparent.UNDERLINEchildren = UNDERLINEparent.UNDERLINEchildren.concat(UNDERLINEdefinition);
            
        }    
        else
        {
            var UNDERLINEchildren = UNDERLINEparent.UNDERLINEchildren;
            UNDERLINEparent.UNDERLINEchildren = [];

            
            for (var i in UNDERLINEchildren)
            {
                if (i == UNDERLINEminorIndex)
                    UNDERLINEparent.UNDERLINEchildren = UNDERLINEparent.UNDERLINEchildren.concat(UNDERLINEdefinition);
                UNDERLINEparent.UNDERLINEchildren[UNDERLINEparent.UNDERLINEchildren.length] = UNDERLINEchildren[i];
            }
            
        }
		
        this.UNDERLINEredraw();
		
        return UNDERLINEminorIndex;
    }
    else
        return null;
}

DOLLAR.UNDERLINEreplaceDefinition = function (UNDERLINEindex, UNDERLINEdefinition, UNDERLINEreuseId, UNDERLINEreuseFormat, UNDERLINEreuseChildren)
{
    if (UNDERLINEindex == this.UNDERLINEgetRoot().UNDERLINEindex)
    {
        this.UNDERLINEgetRoot().UNDERLINEactuallyDetachLayers();
        this.UNDERLINEstripObjects(this.UNDERLINEgetRoot());
        var UNDERLINEdefinition = this.UNDERLINEprepareNode(UNDERLINEdefinition);
        if (UNDERLINEreuseChildren)
            UNDERLINEdefinition.UNDERLINEchildren = this.UNDERLINEbackbone.UNDERLINEchildren;
        this.UNDERLINEbackbone = UNDERLINEdefinition;
    }
    else
    {
        var UNDERLINEpair = this.UNDERLINEfindNode(UNDERLINEindex);

        if (UNDERLINEpair)
        {
            var UNDERLINEparent = UNDERLINEpair[0], UNDERLINEchildren = UNDERLINEparent.UNDERLINEchildren, UNDERLINEindex = UNDERLINEpair[1];
            this.UNDERLINEstripObjects(UNDERLINEparent);
            var UNDERLINEdefinition = this.UNDERLINEprepareNode(UNDERLINEdefinition);
            if (UNDERLINEreuseId)
                UNDERLINEdefinition[0] = UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex][0];
            if (UNDERLINEreuseFormat)
                UNDERLINEdefinition[4] = UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex][4];
            if (UNDERLINEreuseChildren)
                UNDERLINEdefinition.UNDERLINEchildren = UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex].UNDERLINEchildren;
            UNDERLINEdefinition.i = UNDERLINEdefinition[0].id;
            UNDERLINEdefinition.f = UNDERLINEdefinition[4].format;
            UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex] = UNDERLINEdefinition;
        }
    }
}

DOLLAR.UNDERLINEdeleteNode = function (UNDERLINEparent, UNDERLINEindex)
{
    if (!UNDERLINEisUndefined(UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex]))
    {
        if (UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex].UNDERLINEobject)
            delete this.UNDERLINEnodes[UNDERLINEparent.UNDERLINEchildren[UNDERLINEindex].UNDERLINEobject.UNDERLINEindex];
        this.UNDERLINEstripObjects(UNDERLINEparent);
        UNDERLINEparent.UNDERLINEchildren.splice(UNDERLINEindex, 1);
    }
}

DOLLAR.getSelectedNode = function ()
{
    return this.nodeByIndex(this.UNDERLINEselectedNodeIndex);
}

DOLLAR.UNDERLINEisNodeSelected = function (UNDERLINEnode)
{
    return this.UNDERLINEselectedNodeIndex === UNDERLINEnode.UNDERLINEindex;
}

DOLLAR.UNDERLINEneedAdvancedWrapping = function ()
{
    return this.UNDERLINEdynamic && this.UNDERLINEformat.UNDERLINEwrappingMargin && this.UNDERLINEformat.exp;
}

DOLLAR.UNDERLINEwalkUNDERLINEns4UNDERLINElayers = function (UNDERLINEcollection)
{
    for (var i in UNDERLINEcollection)
    {
        this.UNDERLINEns4UNDERLINElayers[UNDERLINEcollection[i].id] = UNDERLINEcollection[i];
        if (UNDERLINEcollection[i].layers)
            this.UNDERLINEwalkUNDERLINEns4UNDERLINElayers(UNDERLINEcollection[i].layers);
    }
}

DOLLAR.UNDERLINEgetElement = function (UNDERLINEid)
{
    if (this.bw.ns4)
    {
        if (!this.UNDERLINEns4UNDERLINElayers)
        {
            this.UNDERLINEns4UNDERLINElayers = {};
            this.UNDERLINEwalkUNDERLINEns4UNDERLINElayers(document.layers);
        }
        return this.UNDERLINEns4UNDERLINElayers[UNDERLINEid];
    }
    else
        return (document.all && document.all[UNDERLINEid]) || document.getElementById(UNDERLINEid);
}

DOLLAR.moveTo = function (x, y)
{
    this.UNDERLINEback.UNDERLINEtop = y;
    this.UNDERLINEback.UNDERLINEleft = x;
    this.UNDERLINEback.UNDERLINEmoveTo(x, y);
    this.UNDERLINEformat.UNDERLINEtop = y;
    this.UNDERLINEformat.UNDERLINEleft = x;
    this.draw();
}

DOLLAR.ensureVisible = function (UNDERLINEindex, UNDERLINEnoredraw)
{
    var UNDERLINEnode = this.nodeByIndex(UNDERLINEindex);
    var UNDERLINEredraw = false;
    while (UNDERLINEnode)
    {
        UNDERLINEnode = UNDERLINEnode.UNDERLINEparentNode;

        if (UNDERLINEnode.UNDERLINEisRoot())
            break;

        if (!UNDERLINEnode.UNDERLINEisExpanded())
        {
            this.expandNode(UNDERLINEnode.UNDERLINEindex, 1);
            UNDERLINEredraw = true;
        }
    }

    if (UNDERLINEredraw && !UNDERLINEnoredraw)
        this.draw();
}

DOLLAR.UNDERLINEnodePathBy = function (UNDERLINEfield, UNDERLINEvalue, UNDERLINEnodes)
{
    for (var i in UNDERLINEnodes)
    {
        switch (typeof(UNDERLINEvalue))
        {
        case 'string':
        case 'number':
            if (UNDERLINEnodes[i][UNDERLINEfield] == UNDERLINEvalue)
                return [i];
            break;
        default:
            if (('' + UNDERLINEnodes[i][UNDERLINEfield]).match(UNDERLINEvalue))
                return [i];
        }

        var UNDERLINEsubPath = this.UNDERLINEnodePathBy(UNDERLINEfield, UNDERLINEvalue, UNDERLINEnodes[i].UNDERLINEchildren);
        if (UNDERLINEsubPath)
            return [i].concat(UNDERLINEsubPath);
    }

    return null;
}

DOLLAR.UNDERLINEnodeBy = function (UNDERLINEfield, UNDERLINEvalue)
{
    return this.UNDERLINEgetRoot().UNDERLINEgetNodeByPath(this.UNDERLINEnodePathBy(UNDERLINEfield, UNDERLINEvalue, this.UNDERLINEbackbone.UNDERLINEchildren));
}

DOLLAR.nbn = DOLLAR.nodeByName = function (UNDERLINEvalue) { return this.UNDERLINEnodeBy('c', UNDERLINEvalue); }
DOLLAR.nodeByID = function (UNDERLINEvalue) { return this.UNDERLINEnodeBy('i', UNDERLINEvalue); }
DOLLAR.nodeByURL = function (UNDERLINEvalue) { return this.UNDERLINEnodeBy('u', UNDERLINEvalue); }

DOLLAR.nodeByIndex = DOLLAR.UNDERLINEnodeByIndex = function (UNDERLINEvalue)
{
    if (!this.UNDERLINEnodes[UNDERLINEvalue])
        this.UNDERLINEnodes[UNDERLINEvalue] = this.UNDERLINEnodeBy('n', UNDERLINEvalue);
    return this.UNDERLINEnodes[UNDERLINEvalue];
}

DOLLAR.nodeByXY = function (UNDERLINEX, UNDERLINEY)
{
    for (var i in this.UNDERLINEnodes)
        if (this.UNDERLINEnodes[i])
            with (this.UNDERLINEnodes[i])
                if (visible && UNDERLINEx <= UNDERLINEX && UNDERLINEy <= UNDERLINEY && UNDERLINEx + w > UNDERLINEX && UNDERLINEy + h > UNDERLINEY)
                    return this.UNDERLINEnodes[i];
    return null;
}

DOLLAR.UNDERLINEredraw = function (UNDERLINEy)
{
    if (!this.UNDERLINEredrawTO)
        this.UNDERLINEredrawTO = window.setTimeout(this.jsPath + '.draw()', 1);
    if (typeof(UNDERLINEy) == 'number')
        this.UNDERLINEredrawAfter = Math.min(UNDERLINEy, this.UNDERLINEredrawAfter);
    else
        this.UNDERLINEredrawAfter = -1;
}

DOLLAR.UNDERLINEdetachLayers = function (UNDERLINEnode)
{
    UNDERLINEnode.UNDERLINEdetachLayers();
}

DOLLAR.UNDERLINEactuallyDetachLayers = function ()
{
    if (this.UNDERLINEdynamic)
        for (var UNDERLINEindex in this.UNDERLINElayersToDetach)
        {
            var UNDERLINEnode = this.nodeByIndex(UNDERLINEindex);
            if (UNDERLINEnode)
                UNDERLINEnode.UNDERLINEactuallyDetachLayers();
        }

    this.UNDERLINElayersToDetach = {};
}

DOLLAR.draw = function ()
{
    if (this.bw.UNDERLINEver3 || !this.UNDERLINEredrawComplete)
        return;

    this.UNDERLINEactuallyDetachLayers();
    this.UNDERLINEcanDetachImmediately = true;

    this.UNDERLINEmaxHeight = 0;
    this.UNDERLINEmaxWidth = 0;

    with (this.UNDERLINEgetRoot())
    {
        draw(true);
        if (this.UNDERLINErtl)
            draw(true);
    }

    if (!this.UNDERLINEformat.rel || this.UNDERLINEformat.resize)

        this.UNDERLINEback.UNDERLINEresize(this.UNDERLINEmaxWidth, this.UNDERLINEmaxHeight);

    this.UNDERLINEredrawTO = null;
    this.UNDERLINEredrawAfter = 10000000;

    if (this.ondraw)
        this.ondraw(this);

    this.UNDERLINEcanDetachImmediately = false;

    this.UNDERLINEsaveState();

}

DOLLAR.UNDERLINEsaveState = function ()
{
    with (this)
        UNDERLINEsetCookie('Selected', UNDERLINEselectedNodeIndex),
        UNDERLINEsetCookie('State', UNDERLINEgetState());
}

DOLLAR.expandNode = function (UNDERLINEindex, UNDERLINEnoRedraw, UNDERLINEselectNode)
{
    if (!this.bw.UNDERLINEver3)
    {
        var UNDERLINEnode = this.nodeByIndex(UNDERLINEindex);
        if (UNDERLINEselectNode)
            this.selectNode(UNDERLINEindex);
        if (UNDERLINEnode && UNDERLINEnode.UNDERLINEisItFolder())
        {
            var UNDERLINEnewState = !UNDERLINEnode.UNDERLINEisExpanded();
            if (this.UNDERLINEformat.UNDERLINEsingleBranch)
            {
                this.collapseAll(this.UNDERLINEparentNode);
                this.ensureVisible(UNDERLINEnode.index, true);
            }
            UNDERLINEnode.UNDERLINEsetExpanded(UNDERLINEnewState);
            this.UNDERLINEredraw(UNDERLINEnode.UNDERLINEy);
        }
    }
}

DOLLAR.UNDERLINEselectNode = DOLLAR.selectNode = function (UNDERLINEindex)
{
    this.UNDERLINEselectedNodeIndex = parseInt(UNDERLINEindex);
    this.UNDERLINEredraw();
}

DOLLAR.UNDERLINEUNDERLINEsetStateGlobally = function (UNDERLINEstate, UNDERLINEnode)
{
    for (var i in UNDERLINEnode.UNDERLINEchildren)
    {
        this.UNDERLINEUNDERLINEsetStateGlobally(UNDERLINEstate, UNDERLINEnode.UNDERLINEchildren[i]);
        if (UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEchildren.length)
            if (UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEobject)
                UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEobject.UNDERLINEsetExpanded(UNDERLINEstate);
            else
                UNDERLINEnode.UNDERLINEchildren[i][4].format.expanded = UNDERLINEstate;
    }
}

DOLLAR.UNDERLINEsetStateGlobally = function (UNDERLINEstate, UNDERLINEnode)
{
    this.UNDERLINEUNDERLINEsetStateGlobally(UNDERLINEstate, UNDERLINEnode || this.UNDERLINEbackbone);
    this.UNDERLINEredraw();
}

DOLLAR.collapseAll = function (UNDERLINEnode)
{
    this.UNDERLINEsetStateGlobally(false, UNDERLINEnode && UNDERLINEnode.UNDERLINEdefinition);
}

DOLLAR.expandAll = function (UNDERLINEnode)
{
    this.UNDERLINEsetStateGlobally(true, UNDERLINEnode && UNDERLINEnode.UNDERLINEdefinition);
}

DOLLAR.UNDERLINEprepareNode = function (UNDERLINEnode, UNDERLINEnoUNDERLINEchildren)
{
    if (UNDERLINEisUndefined(UNDERLINEnode[UNDERLINEnode.length - 1]))
        UNDERLINEnode = UNDERLINEnode.slice(0, UNDERLINEnode.length - 1);

    if (UNDERLINEisUndefined(UNDERLINEnode[0].id))
        UNDERLINEnode = ([{id:null}]).concat(UNDERLINEnode);

    if (UNDERLINEisUndefined(UNDERLINEnode[4]) || UNDERLINEisUndefined(UNDERLINEnode[4].format))
        UNDERLINEnode = UNDERLINEnode.slice(0, 4).concat([{format:{}}]).concat(UNDERLINEnode.slice(4));

    var UNDERLINEindex = this.UNDERLINElastLocalIndex++;
    var UNDERLINEchildren = UNDERLINEnode.slice(5);
    UNDERLINEnode = UNDERLINEnode.slice(0, 5);
    UNDERLINEnode.UNDERLINEchildren = [];

    if (UNDERLINEnoUNDERLINEchildren == null || UNDERLINEnoUNDERLINEchildren == false)
    {
	    for (var i in UNDERLINEchildren)
	    {   
	        UNDERLINEnode.UNDERLINEchildren[i] = this.UNDERLINEprepareNode(UNDERLINEchildren[i]);
	    }
    }    
    UNDERLINEnode[4] = UNDERLINEcopyObject(UNDERLINEnode[4]);
    
    UNDERLINEnode.i = UNDERLINEnode[0].id;
    UNDERLINEnode.c = UNDERLINEnode[1]; 
    UNDERLINEnode.u = UNDERLINEnode[2];
    UNDERLINEnode.t = UNDERLINEnode[3];
    UNDERLINEnode.f = UNDERLINEnode[4].format;
    UNDERLINEnode.n = UNDERLINEnode.UNDERLINEindex = UNDERLINEindex;
    UNDERLINEnode.UNDERLINEobject = null;

    return UNDERLINEnode;
}

DOLLAR.init = function ()
{
    var s = new UNDERLINELargeString;

    this.UNDERLINEgetRoot().UNDERLINEgetHtml(s, !this.UNDERLINEdynamic);

    if (this.UNDERLINEformat.cook)
    {
        this.UNDERLINEselectNode(this.UNDERLINEgetCookie('Selected'));
        this.UNDERLINEsetState(this.UNDERLINEgetCookie('State'));
    }

    if (!this.bw.UNDERLINEver3)
        this.UNDERLINEback.UNDERLINEinit(s);

    if (this.bw.ns4)
        s.UNDERLINEprepend('<div id="' + this.UNDERLINEname + 'dummytreediv" style="position:absolute;"></div>');

    document.write(s.UNDERLINEgetValue());

    if (this.bw.ns4)
    {
        this.UNDERLINEredrawComplete = true;
        this.draw();
    }

}

DOLLAR.UNDERLINEgetCookie = function(UNDERLINEname)
{
    return document.cookie.match(new RegExp('(\\W|^)' + this.UNDERLINEname + UNDERLINEname + '=([^;]+)')) ? RegExp.DOLLAR2 : null;
}

DOLLAR.UNDERLINEsetCookie = function (UNDERLINEname, UNDERLINEvalue)
{
    document.cookie = this.UNDERLINEname + UNDERLINEname + '=' + UNDERLINEvalue + '; path=/';
}

DOLLAR.UNDERLINEUNDERLINEgetState = function (UNDERLINEnode)
{
    var UNDERLINEresult = '';

    for (var i in UNDERLINEnode.UNDERLINEchildren)
        if (UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEchildren.length)
            UNDERLINEresult += (UNDERLINEnode.UNDERLINEchildren[i][4].format.expanded ? 1 : 0) + this.UNDERLINEUNDERLINEgetState(UNDERLINEnode.UNDERLINEchildren[i]);

    return UNDERLINEresult;
}

DOLLAR.UNDERLINEgetState = function ()
{
    return this.UNDERLINEUNDERLINEgetState(this.UNDERLINEbackbone);
}

DOLLAR.UNDERLINEUNDERLINEsetState = function (UNDERLINEnode, UNDERLINEstate, UNDERLINEindex)
{
    if (UNDERLINEstate)
        for (var i in UNDERLINEnode.UNDERLINEchildren)
        {
            if (UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEchildren.length)
            {
                if (UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEobject)
                    UNDERLINEnode.UNDERLINEchildren[i].UNDERLINEobject.UNDERLINEsetExpanded(UNDERLINEstate.charAt(UNDERLINEindex) == '1');
                else
                    UNDERLINEnode.UNDERLINEchildren[i][4].format.expanded = UNDERLINEstate.charAt(UNDERLINEindex) == '1';
                UNDERLINEindex = this.UNDERLINEUNDERLINEsetState(UNDERLINEnode.UNDERLINEchildren[i], UNDERLINEstate, UNDERLINEindex + 1);
            }
        }

    return UNDERLINEindex;
}

DOLLAR.UNDERLINEsetState = function (UNDERLINEstate)
{
    this.UNDERLINEUNDERLINEsetState(this.UNDERLINEbackbone, UNDERLINEstate || '', 0);
}

DOLLAR.layerUNDERLINEonmousedown = function (UNDERLINEnode, UNDERLINEevent)
{
    UNDERLINEnode.UNDERLINEactive = true;
    UNDERLINEnode.UNDERLINEupdateImages();
    UNDERLINEnode.UNDERLINEupdateVisibility();
    return true;
}

DOLLAR.layerUNDERLINEonmouseup = DOLLAR.layerUNDERLINEonclick = function (UNDERLINEnode, UNDERLINEevent)
{
    UNDERLINEnode.UNDERLINEactive = false;
    UNDERLINEnode.UNDERLINEupdateImages();
    UNDERLINEnode.UNDERLINEupdateVisibility();
    return true;
}

DOLLAR.layerUNDERLINEonmouseover = function (UNDERLINEnode, UNDERLINEevent)
{
    UNDERLINEnode.UNDERLINEhover = true;
    UNDERLINEnode.UNDERLINEupdateImages();
    UNDERLINEnode.UNDERLINEupdateVisibility();
    return true;
}

DOLLAR.layerUNDERLINEonmouseout = function (UNDERLINEnode, UNDERLINEevent)
{
    UNDERLINEnode.UNDERLINEhover = false;
    UNDERLINEnode.UNDERLINEupdateImages();
    UNDERLINEnode.UNDERLINEupdateVisibility();
    return true;
}

DOLLAR.imageUNDERLINEonclick = DOLLAR.captionUNDERLINEonclick = function (UNDERLINEnode, UNDERLINEevent)
{
  //this.expandNode(UNDERLINEnode.index, 1, 1);
    return true;
}

DOLLAR.buttonUNDERLINEonclick = function (UNDERLINEnode, UNDERLINEevent)
{
  //this.expandNode(UNDERLINEnode.index);
    return true;
}

DOLLAR.imageUNDERLINEonmouseover = DOLLAR.buttonUNDERLINEonmouseover = DOLLAR.captionUNDERLINEonmouseover = function (UNDERLINEnode, UNDERLINEevent)
{
    window.status = UNDERLINEnode.text;
    return true;
}

DOLLAR.imageUNDERLINEonmouseout = DOLLAR.buttonUNDERLINEonmouseout = DOLLAR.captionUNDERLINEonmouseout = function (node, UNDERLINEevent)
{
    window.status = window.defaultStatus;
    return true;
}

UNDERLINETree.UNDERLINENode = function (UNDERLINEdefinition, UNDERLINEtree, UNDERLINEparent, UNDERLINEhasNext)
{
    var UNDERLINEindex = UNDERLINEdefinition.UNDERLINEindex;
    this.UNDERLINEdefinition = UNDERLINEdefinition;
    this.UNDERLINEindex = this.index = UNDERLINEindex;
    this.jsPath = UNDERLINEtree.jsPath + '.nodeByIndex(' + UNDERLINEindex + ')';
    this.treeView = this.UNDERLINEtree = UNDERLINEtree;
    this.UNDERLINEparentNode = this.parentNode = UNDERLINEparent;
    this.UNDERLINEhasNext = UNDERLINEhasNext;
    this.text = UNDERLINEdefinition[1];
    this.url = UNDERLINEdefinition[2];
    this.target = UNDERLINEdefinition[3];
    this.UNDERLINElayerOwner = null;
    this.UNDERLINEhandlersAttached = {};

    this.nodeID = UNDERLINEdefinition[0].id;
    this.UNDERLINEformat = UNDERLINEdefinition[4].format;

    this.UNDERLINEpreviousExpanded = null;
    this.UNDERLINEsetExpanded(this.UNDERLINEdefinition[4].format.expanded);
    this.children = this.UNDERLINEchildren = [];
    this.UNDERLINElevel = this.level = UNDERLINEparent ? UNDERLINEparent.UNDERLINElevel + 1 : -1;
    this.visible = false;
    this.UNDERLINElayers = {};
    this.UNDERLINEexceeds = false;
    this.UNDERLINEimagesToUpdate = {};

    if (UNDERLINEparent)
        this.UNDERLINEinitImages();
}

DOLLAR = UNDERLINETree.UNDERLINENode.prototype;

DOLLAR.UNDERLINEisRoot = function ()
{
    return this.UNDERLINEtree.UNDERLINEbackbone.UNDERLINEindex == this.UNDERLINEindex;
}

DOLLAR.UNDERLINEisExpanded = function ()
{
    return this.UNDERLINEdefinition[4].format.expanded;
}

DOLLAR.id = function ()
{
    return this.UNDERLINEid;
}

DOLLAR.UNDERLINEsetProperties = function (UNDERLINEcaption, UNDERLINEurl, UNDERLINEtarget)
{
    this.UNDERLINEtree.UNDERLINEreplaceDefinition(this.UNDERLINEindex, [ UNDERLINEisUndefined(UNDERLINEcaption) ? this.UNDERLINEgetCaption() : UNDERLINEcaption, UNDERLINEisUndefined(UNDERLINEurl) ? this.UNDERLINEgetUrl() : UNDERLINEurl, UNDERLINEisUndefined(UNDERLINEtarget) ? this.UNDERLINEgetTarget() : UNDERLINEtarget ], true, true, true);
    this.UNDERLINEtree.UNDERLINEredraw();
}

                DOLLAR.getTree = function () { return this.UNDERLINEtree; }
                DOLLAR.getParent = function () { return this.UNDERLINEparentNode; }

                DOLLAR.getId = function () { return this.UNDERLINEdefinition[0].id; }
DOLLAR.UNDERLINEgetCaption = DOLLAR.getCaption = function () { return this.UNDERLINEdefinition[1]; }
DOLLAR.UNDERLINEgetUrl = DOLLAR.getUrl = function () { return this.UNDERLINEdefinition[2]; }
DOLLAR.UNDERLINEgetTarget = DOLLAR.getTarget = function () { return this.UNDERLINEdefinition[3]; }
DOLLAR.UNDERLINEgetFormat = DOLLAR.getFormat = function () { return this.UNDERLINEdefinition[4].format; }

                DOLLAR.setCaption = function (UNDERLINEvalue) { this.UNDERLINEsetProperties(UNDERLINEvalue, this.UNDERLINEundefined, this.UNDERLINEundefined); }
                DOLLAR.setUrl = function (UNDERLINEvalue) { this.UNDERLINEsetProperties(this.UNDERLINEundefined, UNDERLINEvalue, this.UNDERLINEundefined); }
                DOLLAR.setTarget = function (UNDERLINEvalue) { this.UNDERLINEsetProperties(this.UNDERLINEundefined, this.UNDERLINEundefined, UNDERLINEvalue); }

DOLLAR.hasChildren = DOLLAR.UNDERLINEhasChildren = function ()
{
    return !!this.UNDERLINEdefinition.UNDERLINEchildren.length;
}

DOLLAR.UNDERLINEisItFolder = function ()
{
    return this.UNDERLINEhasChildren() || this.UNDERLINEdefinition[4].format.isFolder;
}

DOLLAR.UNDERLINEgetNodeByPath = function (UNDERLINEpath)
{
    if (UNDERLINEpath)
        return UNDERLINEpath.length ? this.UNDERLINEgetChild(UNDERLINEpath[0]).UNDERLINEgetNodeByPath(UNDERLINEpath.slice(1)) : this;

    return null;
}

DOLLAR.UNDERLINEsetExpanded = function (UNDERLINEvalue)
{
    this.expanded = this.UNDERLINEdefinition[4].format.expanded = !!UNDERLINEvalue;
    this.UNDERLINEupdateImages();
}

DOLLAR.UNDERLINEgetButtonImage = function ()
{
    if (this.UNDERLINEtree.UNDERLINEformat.UNDERLINEshow.nb && !this.UNDERLINEformat.nobuttons && this.UNDERLINEhasChildren())

        if (this.UNDERLINEtree.UNDERLINEformat.exp)
            return this.UNDERLINEselectImage(this.UNDERLINEtree.UNDERLINEformat.expimg, this.UNDERLINEformat.eimages, this.UNDERLINEisExpanded() ? (this.UNDERLINEhasNext ? 3 : 4) : (this.UNDERLINEhasNext ? 5 : 6));
        else

            return this.UNDERLINEselectImage(this.UNDERLINEtree.UNDERLINEformat.UNDERLINEbuttons, this.UNDERLINEformat.buttons, this.UNDERLINEisExpanded() ? 1 : 0);

    return null;
}

DOLLAR.UNDERLINEgetIconImage = function ()
{
    if (this.UNDERLINEtree.UNDERLINEformat.UNDERLINEshow.nf && !this.UNDERLINEformat.nofolders)
    {
        var UNDERLINEindex = this.UNDERLINEisItFolder() ? (this.UNDERLINEisExpanded() ? 1 : 0) : 2;

        if (this.UNDERLINEtree.UNDERLINEformat.exp)
            return this.UNDERLINEselectImage(this.UNDERLINEtree.UNDERLINEformat.expimg, this.UNDERLINEformat.eimages, UNDERLINEindex);
        else

            return this.UNDERLINEselectImage(this.UNDERLINEtree.UNDERLINEformat.UNDERLINEfolders, this.UNDERLINEformat.folders, UNDERLINEindex);
    }

    return null;
}

DOLLAR.UNDERLINEselectImage = function (UNDERLINEarray1, UNDERLINEarray2, UNDERLINEindex)
{
    var UNDERLINEsrc = (UNDERLINEarray2 && UNDERLINEarray2[UNDERLINEindex]) || (UNDERLINEarray1 && UNDERLINEarray1[UNDERLINEindex]) || this.UNDERLINEtree.UNDERLINEformat.UNDERLINEblankImage;

    if (typeof UNDERLINEsrc != 'string' && UNDERLINEsrc[0])
    {
        if (this.UNDERLINEactive && this.UNDERLINEhover && UNDERLINEsrc[2])
            UNDERLINEsrc = UNDERLINEsrc[2];
        else if (this.UNDERLINEhover && UNDERLINEsrc[1])
            UNDERLINEsrc = UNDERLINEsrc[1];
        else
            UNDERLINEsrc = UNDERLINEsrc[0];
    }

    return UNDERLINEsrc;
}

DOLLAR.UNDERLINEupdateImages = function ()
{
    if (this.UNDERLINElayersAttached)
    {
        this.UNDERLINEupdateImage('nb', this.UNDERLINEgetButtonImage());
        this.UNDERLINEupdateImage('nf', this.UNDERLINEgetIconImage());
    }
}

DOLLAR.UNDERLINEupdateImage = function (UNDERLINEsuffix, UNDERLINEsrc)
{
    if (UNDERLINEsrc)
    {
        var UNDERLINEimg = (this.UNDERLINEgetLayer().document || document).images[this.UNDERLINEid + UNDERLINEsuffix];

        if ((this.UNDERLINEtree.UNDERLINEformat.UNDERLINEshow[UNDERLINEsuffix] || this.UNDERLINEtree.UNDERLINEformat.exp) && UNDERLINEimg && UNDERLINEimg.src != UNDERLINEsrc)

            this.UNDERLINEimagesToUpdate[UNDERLINEsuffix] = { UNDERLINEimage:UNDERLINEimg, UNDERLINEpath:UNDERLINEsrc };
    }
}

DOLLAR.UNDERLINEinitImages = function ()
{

    if (this.UNDERLINEtree.UNDERLINEformat.exp)
    {
        var esz = this.UNDERLINEtree.UNDERLINEformat.expimgsize;
        this.wimg = this.UNDERLINEiconWidth = this.UNDERLINEbuttonWidth = esz[0];
        this.himg = this.UNDERLINEiconHeight = this.UNDERLINEbuttonHeight = esz[1];
    }
    else
    {

        this.UNDERLINEbuttonWidth = UNDERLINEisUndefined(this.UNDERLINEformat.bsize) ? this.UNDERLINEtree.UNDERLINEformat.UNDERLINEbuttonWidth : this.UNDERLINEformat.bsize[0];
        this.UNDERLINEbuttonHeight = UNDERLINEisUndefined(this.UNDERLINEformat.bsize) ? this.UNDERLINEtree.UNDERLINEformat.UNDERLINEbuttonHeight : this.UNDERLINEformat.bsize[1];
        this.UNDERLINEiconWidth = UNDERLINEisUndefined(this.UNDERLINEformat.fsize) ? this.UNDERLINEtree.UNDERLINEformat.UNDERLINEiconWidth : this.UNDERLINEformat.fsize[0];
        this.UNDERLINEiconHeight = UNDERLINEisUndefined(this.UNDERLINEformat.fsize) ? this.UNDERLINEtree.UNDERLINEformat.UNDERLINEiconHeight : this.UNDERLINEformat.fsize[1];

    }

}

DOLLAR.UNDERLINEgetHtml = function (UNDERLINEstring, UNDERLINErecursive)
{
    this.UNDERLINEid = 'nt' + this.UNDERLINEtree.UNDERLINEname + 'UNDERLINE' + this.UNDERLINEtree.UNDERLINElayerIndex++;

    if (!this.UNDERLINEisRoot())
        if (this.UNDERLINEtree.bw.UNDERLINEver3)
            UNDERLINEstring.UNDERLINEappendString(this.UNDERLINEgetContent());
        else
            UNDERLINEstring.UNDERLINEexpandTemplate(this.UNDERLINEtree.UNDERLINEtemplates.UNDERLINEnodeWrapper, [ this.UNDERLINEindex, this.UNDERLINEid, this.UNDERLINEtree.bw.mac || this.UNDERLINEtree.bw.UNDERLINEoperaOld ? '' : 'height:1px;width:1px;', this.UNDERLINEtree.UNDERLINEdynamic ? '' : 'visibility:hidden;', this.UNDERLINEgetContent() ]);

    if (UNDERLINErecursive)
        this.UNDERLINEgetHtmlForChildren(UNDERLINEstring, UNDERLINErecursive);

    return UNDERLINEstring;
}

DOLLAR.UNDERLINEgetHtmlForChildren = function (UNDERLINEstring, UNDERLINErecursive)
{
    for (var i = 0; i < this.UNDERLINEgetNumberOfChildren(); i++)
        this.UNDERLINEgetChild(i).UNDERLINEgetHtml(UNDERLINEstring, UNDERLINErecursive);

    return UNDERLINEstring;
}

DOLLAR.UNDERLINEgenerateAnchorTag = function (UNDERLINEurl, UNDERLINEprefix, UNDERLINEcontent, UNDERLINEcssClass, UNDERLINEneedId)
{
    return new UNDERLINELargeString().UNDERLINEexpandTemplate(this.UNDERLINEtree.UNDERLINEtemplates.UNDERLINEanchor, [ UNDERLINEprefix, this.UNDERLINEindex, UNDERLINEurl || 'javascript:void(0)', UNDERLINEurl && this.target || '', UNDERLINEneedId && (this.UNDERLINEid + 'an') || '', UNDERLINEcssClass || '', UNDERLINEcontent ]).UNDERLINEgetValue();
}

DOLLAR.UNDERLINEgenerateImageTag = function (UNDERLINEimgSrc, UNDERLINEname, UNDERLINEwidth, UNDERLINEheight)
{
    return new UNDERLINELargeString().UNDERLINEexpandTemplate(this.UNDERLINEtree.UNDERLINEtemplates.UNDERLINEimage, arguments).UNDERLINEgetValue();
}

DOLLAR.UNDERLINEsquare = function (UNDERLINEprefix, UNDERLINEsuffix, UNDERLINEimgSrc, UNDERLINEneedAnchor, UNDERLINEneedUrl, w, h, UNDERLINEbackground)
{
    if (!w || !UNDERLINEimgSrc)
        return '';

    var UNDERLINEimageTag = this.UNDERLINEgenerateImageTag(UNDERLINEimgSrc, UNDERLINEsuffix && this.UNDERLINEid + UNDERLINEsuffix || '', w, h);

    return new UNDERLINELargeString().UNDERLINEexpandTemplate(
        this.UNDERLINEtree.UNDERLINEtemplates.UNDERLINEsquare,
        [
            w,
            UNDERLINEneedAnchor ? this.UNDERLINEgenerateAnchorTag(UNDERLINEneedUrl && this.url, UNDERLINEprefix, UNDERLINEimageTag) : UNDERLINEimageTag

            ,
            UNDERLINEbackground ? ';background-image:url(' + UNDERLINEbackground + ')' : '',
            this.UNDERLINEtree.UNDERLINEformat.exp ? 'top' : this.UNDERLINEtree.UNDERLINEformat.UNDERLINEimageAlignment

        ]
    ).UNDERLINEgetValue();
}

DOLLAR.UNDERLINElineSquares = function ()
{
    return this.UNDERLINElevel >= 0 ? this.UNDERLINEparentNode.UNDERLINElineSquares() + this.UNDERLINEsquare('', '', this.UNDERLINEtree.UNDERLINEformat.UNDERLINEblankImage, false, false, this.UNDERLINEtree.UNDERLINEformat.expimgsize[0], this.UNDERLINEtree.UNDERLINEformat.expimgsize[1], this.UNDERLINEhasNext && this.UNDERLINEtree.UNDERLINEformat.expimg[7]) : '';
}

DOLLAR.UNDERLINEgetIndent = function ()
{
    with (this.UNDERLINEtree.UNDERLINEformat)
        return UNDERLINEisUndefined(UNDERLINEindentation[this.UNDERLINElevel]) ? UNDERLINEindentation[0] * this.UNDERLINElevel : UNDERLINEindentation[this.UNDERLINElevel];
}

DOLLAR.UNDERLINEgetContent = function ()
{
    this.UNDERLINElastCssClass = this.UNDERLINEgetCssClass();

    var UNDERLINEarguments =
    [

        this.UNDERLINEtree.UNDERLINEformat.UNDERLINEwrappingMargin ? ' width="' + this.UNDERLINEtree.UNDERLINEformat.UNDERLINEwrappingMargin + '"' : '',

        this.UNDERLINElevel,

        this.UNDERLINEtree.UNDERLINEformat.exp ?
            this.UNDERLINEparentNode.UNDERLINElineSquares() + (this.UNDERLINEhasChildren() ? '' : this.UNDERLINEsquare('', '', (this.UNDERLINEhasNext ? this.UNDERLINEtree.UNDERLINEformat.expimg[8] : this.UNDERLINEtree.UNDERLINEformat.expimg[9]), false, false, this.UNDERLINEtree.UNDERLINEformat.expimgsize[0], this.UNDERLINEtree.UNDERLINEformat.expimgsize[1], this.UNDERLINEhasNext && this.UNDERLINEtree.UNDERLINEformat.exp && this.UNDERLINEtree.UNDERLINEformat.expimg[7]))
        :

            this.UNDERLINEsquare('', '', this.UNDERLINEtree.UNDERLINEformat.UNDERLINEblankImage, false, false, this.UNDERLINEgetIndent() + (this.UNDERLINEhasChildren() ? 0 : this.UNDERLINEtree.UNDERLINEformat.UNDERLINEchildlessNodesIndent), 1),
        this.UNDERLINEsquare(
            'button',
            'nb',
            this.UNDERLINEgetButtonImage(),
            true,
            false,
            this.UNDERLINEbuttonWidth,
            this.UNDERLINEbuttonHeight,

            this.UNDERLINEhasNext && this.UNDERLINEtree.UNDERLINEformat.exp && this.UNDERLINEtree.UNDERLINEformat.expimg[7]

        )
        +
        this.UNDERLINEsquare(
            'image',
            'nf',
            this.UNDERLINEgetIconImage(),
            true,
            true,
            this.UNDERLINEiconWidth,
            this.UNDERLINEiconHeight,

            this.UNDERLINEisExpanded() && this.UNDERLINEhasChildren() && this.UNDERLINEtree.UNDERLINEformat.exp && this.UNDERLINEtree.UNDERLINEformat.expimg[7]

        ),

        this.UNDERLINEtree.UNDERLINEformat.UNDERLINEwrappingMargin ? '' : ' nowrap="nowrap"',

        this.UNDERLINEid,
        this.UNDERLINEgenerateAnchorTag(this.url, 'caption', this.text, this.UNDERLINElastCssClass, true)
    ];

    return new UNDERLINELargeString().UNDERLINEexpandTemplate(this.UNDERLINEtree.UNDERLINEtemplates.UNDERLINEnodeContent, UNDERLINEarguments).UNDERLINEgetValue();
}

DOLLAR.UNDERLINEgetCssClass = function ()
{
    var UNDERLINEresult;

    if (this.UNDERLINEtree.UNDERLINEformat.sel)
        if (this.UNDERLINEisSelected())
            UNDERLINEresult = this.UNDERLINEtree.UNDERLINEformat.UNDERLINEcssClassForSelectedNode;
        else if (this.UNDERLINEhasChildren() && this.UNDERLINEisExpanded())
            UNDERLINEresult = this.UNDERLINEtree.UNDERLINEformat.UNDERLINEcssClassForOpenedNode;

    if (!UNDERLINEresult)

        with (this.UNDERLINEtree.UNDERLINEformat)
            UNDERLINEresult = UNDERLINEcssClasses[this.UNDERLINElevel] || UNDERLINEcssClass;

    if (typeof(UNDERLINEresult) != 'string')
        UNDERLINEresult = UNDERLINEresult[this.UNDERLINElevel];

    return UNDERLINEresult || '';
}

DOLLAR.UNDERLINEgetBackgroundColor = function ()
{
    return this.UNDERLINEtree.UNDERLINEformat.sel ? this.UNDERLINEtree.UNDERLINEformat.selC[this.UNDERLINEisSelected() ? 1 : 0] : '';
}

DOLLAR.UNDERLINEmoveToUNDERLINEns4 = function (UNDERLINEx, UNDERLINEy)
{
    if (this.UNDERLINEx != UNDERLINEx || this.UNDERLINEy != UNDERLINEy)
    {
        this.UNDERLINEx = UNDERLINEx;
        this.UNDERLINEy = UNDERLINEy;

        with (this.UNDERLINEgetLayer())
            moveTo(UNDERLINEx, UNDERLINEy);
    }
}

DOLLAR.UNDERLINEmoveToUNDERLINEdefault = function (UNDERLINEx, UNDERLINEy)
{
    if (this.UNDERLINEx != UNDERLINEx || this.UNDERLINEy != UNDERLINEy)
    {
        this.UNDERLINEx = UNDERLINEx;
        this.UNDERLINEy = UNDERLINEy;

        with (this.UNDERLINEgetLayer().style)
        {
            left = UNDERLINEx + this.UNDERLINEtree.UNDERLINEpx;
            top = UNDERLINEy + this.UNDERLINEtree.UNDERLINEpx;
        }
    }
}

DOLLAR.UNDERLINEmoveTo = null;

DOLLAR.UNDERLINEgetLayerForChildren = function ()
{
    return this.UNDERLINElayerForChildren || (this.UNDERLINElayerForChildren = this.UNDERLINEtree.UNDERLINEdynamic ? this.UNDERLINEtree.UNDERLINEback.UNDERLINEcreateChildLayer(this.UNDERLINEgetHtmlForChildren(new UNDERLINELargeString).UNDERLINEgetValue()) : this.UNDERLINEgetLayer('ch'));
}

function UNDERLINEdestroy(UNDERLINElayer)
{
    UNDERLINElayer.parentNode.removeChild(UNDERLINElayer);
}

DOLLAR.UNDERLINEdestroyLayerForChildren = function ()
{
    if (this.UNDERLINElayerForChildren)
    {
        var UNDERLINEtmp = this.UNDERLINElayerForChildren;
        this.UNDERLINElayerForChildren = null;

        for (var i in this.UNDERLINEdefinition.UNDERLINEchildren)
            with (this.UNDERLINEdefinition.UNDERLINEchildren[i])
                if (UNDERLINEobject)
                    UNDERLINEobject.UNDERLINEactuallyDetachLayers();

        UNDERLINEdestroy(UNDERLINEtmp);
    }
}

DOLLAR.UNDERLINEdetachLayers = function ()
{
    if (this.UNDERLINEtree.UNDERLINEcanDetachImmediately)
        this.UNDERLINEactuallyDetachLayers();
    else
    {
        this.UNDERLINEtree.UNDERLINElayersToDetach[this.UNDERLINEindex] = true;
        this.UNDERLINEtree.UNDERLINEredraw();
    }
}

DOLLAR.UNDERLINErecreate = function ()
{
    this.UNDERLINEgetLayer().innerHTML = this.UNDERLINEgetContent();
    this.UNDERLINEhandlersAttached = {};
}

DOLLAR.UNDERLINEactuallyDetachLayers = function ()
{
    if (this.UNDERLINElayersAttached)
    {
        for (var i in this.UNDERLINElayers)
        {
            UNDERLINEdestroy(this.UNDERLINElayers[i]);
            this.UNDERLINElayers[i] = null;
        }

        this.UNDERLINElayers = {};

        this.w = this.h = 0;
        this.UNDERLINEx = this.UNDERLINEy = -1;

        this.UNDERLINElayersAttached = false;
    }

    this.UNDERLINEhandlersAttached = {};

    this.UNDERLINEdestroyLayerForChildren();

    if (!this.UNDERLINEisRoot())
        this.UNDERLINEparentNode.UNDERLINEdestroyLayerForChildren();
}

DOLLAR.UNDERLINEsetVisibility = function (UNDERLINElayer, UNDERLINEvalue)
{
    if (this.UNDERLINEtree.bw.ns4)
        UNDERLINElayer.visibility = UNDERLINEvalue ? 'show' : 'hide';
    else
        UNDERLINElayer.style.visibility = UNDERLINEvalue ? 'visible' : 'hidden';
}

DOLLAR.UNDERLINEupdateVisibility = function ()
{
    if (!this.UNDERLINEtree.UNDERLINEdynamic)
        this.UNDERLINEsetVisibility(this.UNDERLINEgetLayer(), this.visible);

    if (this.visible)
    {
        for (var i in this.UNDERLINEimagesToUpdate)
            with (this.UNDERLINEimagesToUpdate[i])
                UNDERLINEimage.src = UNDERLINEpath;

        this.UNDERLINEimagesToUpdate = {};
    }
}

DOLLAR.UNDERLINEupdatePosition = function ()
{
    if (!this.visible)
        this.UNDERLINEmoveTo(-10000, -10000);
    else
        this.UNDERLINEmoveTo(this.UNDERLINEtree.UNDERLINErtl ? (this.UNDERLINEtree.bw.gecko ? this.UNDERLINEtree.UNDERLINEmaxWidth : 0) - this.w : 0, this.UNDERLINEtree.UNDERLINEcurrTop);
}

DOLLAR.UNDERLINEupdateStyle = function ()
{
    if (this.UNDERLINEtree.UNDERLINEformat.sel)
    {
        if (this.UNDERLINEisSelected() == !this.UNDERLINElastSelected)
        {
            var UNDERLINEbackgroundColor = this.UNDERLINEgetBackgroundColor();

            with (this.UNDERLINEgetLayer('a'))
                if (this.UNDERLINEtree.bw.ns4)
                    bgColor = UNDERLINEbackgroundColor;
                else
                    style.backgroundColor = UNDERLINEbackgroundColor;

            this.UNDERLINElastSelected = this.UNDERLINEisSelected();
        }

        if (this.UNDERLINEtree.bw.dom)
        {
            if (UNDERLINEisUndefined(this.UNDERLINEoriginalClassName))
                this.UNDERLINElastCssClass = this.UNDERLINEoriginalClassName = this.UNDERLINEtree.UNDERLINEgetElement(this.UNDERLINEid + 'an').className;

            var UNDERLINEcssClass = this.UNDERLINEgetCssClass();

            if (UNDERLINEcssClass != this.UNDERLINElastCssClass)
            {
                this.UNDERLINEgetLayer('an').className = this.UNDERLINElastCssClass = UNDERLINEcssClass;
                this.h = 0;
            }
        }
    }
}

DOLLAR.UNDERLINEupdateDimensionsUNDERLINEgecko = function (UNDERLINEforce)
{
    if (!this.h || UNDERLINEforce)
    {
        with (this.UNDERLINEgetLayer().childNodes[0])
        {
            this.w = offsetWidth;
            this.h = offsetHeight;
        }

        if (this.UNDERLINEtree.UNDERLINEneedAdvancedWrapping())
            this.UNDERLINEexceeds = this.UNDERLINEtree.UNDERLINEformat.exp && this.h > this.UNDERLINEtree.UNDERLINEformat.expimgsize[1];

    }
}

DOLLAR.UNDERLINEupdateDimensionsUNDERLINEns4 = function (UNDERLINEforce)
{
    if (!this.h || UNDERLINEforce)
    {
        with (this.UNDERLINEgetLayer())
        {
            this.w = clip.width;
            this.h = clip.height;
        }

        if (this.UNDERLINEtree.UNDERLINEneedAdvancedWrapping())
            this.UNDERLINEexceeds = this.UNDERLINEtree.UNDERLINEformat.exp && this.h > this.UNDERLINEtree.UNDERLINEformat.expimgsize[1];

    }
}

DOLLAR.UNDERLINEupdateDimensionsUNDERLINEoperaNew = function (UNDERLINEforce)
{
    if (!this.h || UNDERLINEforce)
    {
        with (this.UNDERLINEgetLayer().childNodes[0])
        {
            this.w = offsetWidth;
            this.h = offsetHeight;
        }

        if (this.UNDERLINEtree.UNDERLINEneedAdvancedWrapping())
            this.UNDERLINEexceeds = this.UNDERLINEtree.UNDERLINEformat.exp && this.h > this.UNDERLINEtree.UNDERLINEformat.expimgsize[1];

    }
}

DOLLAR.UNDERLINEupdateDimensionsUNDERLINEoperaOld = function (UNDERLINEforce)
{
    if (!this.h || UNDERLINEforce)
    {
        with (this.UNDERLINEgetLayer())
        {
            this.w = style.pixelWidth;
            this.h = style.pixelHeight;
        }

        if (this.UNDERLINEtree.UNDERLINEneedAdvancedWrapping())
            this.UNDERLINEexceeds = this.UNDERLINEtree.UNDERLINEformat.exp && this.h > this.UNDERLINEtree.UNDERLINEformat.expimgsize[1];

    }
}

DOLLAR.UNDERLINEupdateDimensionsUNDERLINEdefault = function (UNDERLINEforce)
{
    if (!this.h || UNDERLINEforce)
    {
        with (this.UNDERLINEgetLayer())
        {
            this.w = scrollWidth || offsetWidth;
            this.h = scrollHeight || offsetHeight;
        }

        if (this.UNDERLINEtree.UNDERLINEneedAdvancedWrapping())
            this.UNDERLINEexceeds = this.UNDERLINEtree.UNDERLINEformat.exp && this.h > this.UNDERLINEtree.UNDERLINEformat.expimgsize[1];

    }
}

DOLLAR.UNDERLINEupdateDimensions = function () { }

DOLLAR.draw = function (UNDERLINEvisible)
{
    var UNDERLINEvisibilityChanged = this.visible != UNDERLINEvisible;
    var UNDERLINEwasAttached = this.UNDERLINElayersAttached;
    var UNDERLINEwasExceeding = this.UNDERLINEexceeds;

    if (this.UNDERLINEisRoot())
    {
        this.UNDERLINEtree.UNDERLINEcurrTop = 0;
        this.visible = UNDERLINEvisible;
    }
    else if (this.UNDERLINEy < this.UNDERLINEtree.UNDERLINEredrawAfter)
    {
        this.UNDERLINEtree.UNDERLINEcurrTop = this.UNDERLINEy + this.h;
        this.UNDERLINEtree.UNDERLINEmaxWidth = this.UNDERLINEmaxWidth;
        this.UNDERLINEtree.UNDERLINEmaxHeight = this.UNDERLINEmaxHeight;
    }
    else if (this.visible || UNDERLINEvisible)
    {
        this.UNDERLINEtree.UNDERLINEredrawAfter = -1;
        this.visible = UNDERLINEvisible;
        this.UNDERLINEupdateVisibility();

        if (this.visible)
        {

            if (UNDERLINEwasAttached || this.UNDERLINEisSelected())
                this.UNDERLINEupdateStyle();

            this.UNDERLINEupdateDimensions();
            this.UNDERLINEupdatePosition();

            if ( this.UNDERLINEexceeds && this.UNDERLINEpreviousExpanded != this.UNDERLINEisExpanded() && UNDERLINEwasAttached)
            {
                this.UNDERLINErecreate();
                this.UNDERLINEupdateDimensions();
                this.UNDERLINEupdatePosition();
                this.UNDERLINEupdateVisibility();
            }

            this.UNDERLINEtree.UNDERLINEmaxWidth = Math.max(this.w, this.UNDERLINEtree.UNDERLINEmaxWidth);
            this.UNDERLINEtree.UNDERLINEcurrTop += this.h;
            this.UNDERLINEtree.UNDERLINEmaxHeight = Math.max(this.UNDERLINEtree.UNDERLINEcurrTop, this.UNDERLINEtree.UNDERLINEmaxHeight);

            this.UNDERLINEmaxWidth = this.UNDERLINEtree.UNDERLINEmaxWidth;
            this.UNDERLINEmaxHeight = this.UNDERLINEtree.UNDERLINEmaxHeight;
        }
    }

    if (
        (this.visible && (this.UNDERLINEpreviousExpanded || this.UNDERLINEisExpanded()))
        || (!this.visible && UNDERLINEvisibilityChanged && this.UNDERLINEpreviousExpanded)
    )
        this.UNDERLINEdrawChildren(this.UNDERLINEisExpanded() && this.visible);

    if (this.UNDERLINEtree.UNDERLINEdynamic && this.UNDERLINEhasChildren() && (this.UNDERLINElayerForChildren || (this.UNDERLINEisExpanded() && this.visible)))
        this.UNDERLINEsetVisibility(this.UNDERLINEgetLayerForChildren(), this.UNDERLINEisExpanded() && this.visible);

    this.UNDERLINEpreviousExpanded = this.UNDERLINEisExpanded();
}

DOLLAR.UNDERLINEdrawChildren = function (UNDERLINEvisible)
{
    for (var i = 0; i < this.UNDERLINEgetNumberOfChildren(); i++)
        this.UNDERLINEgetChild(i).draw(UNDERLINEvisible);
}

DOLLAR.UNDERLINEisSelected = function ()
{
    return this.UNDERLINEtree.UNDERLINEisNodeSelected(this);
}

DOLLAR.getNumberOfChildren = DOLLAR.UNDERLINEgetNumberOfChildren = function ()
{
    return this.UNDERLINEdefinition.UNDERLINEchildren.length;
}

DOLLAR.getChild = DOLLAR.UNDERLINEgetChild = function (UNDERLINEminorIndex)
{
    with (this.UNDERLINEdefinition.UNDERLINEchildren[UNDERLINEminorIndex])
    {
        if (!UNDERLINEobject)
        {
            var UNDERLINEraw = this.UNDERLINEdefinition.UNDERLINEchildren[UNDERLINEminorIndex];
            UNDERLINEobject = this.UNDERLINEtree.UNDERLINEnodes[UNDERLINEraw.UNDERLINEindex] = new UNDERLINETree.UNDERLINENode(UNDERLINEraw, this.UNDERLINEtree, this, UNDERLINEminorIndex < this.UNDERLINEgetNumberOfChildren() - 1);
        }

        return UNDERLINEobject;
    }
}

DOLLAR.getMinorIndex =

DOLLAR.UNDERLINEgetMinorIndex = function ()
{
    var UNDERLINEresult = 0;

    while (UNDERLINEresult < this.UNDERLINEparentNode.UNDERLINEdefinition.UNDERLINEchildren.length)
        if (this.UNDERLINEparentNode.UNDERLINEdefinition.UNDERLINEchildren[UNDERLINEresult].UNDERLINEindex == this.UNDERLINEindex)
            return UNDERLINEresult;
        else
            UNDERLINEresult++;

    return null;
}

DOLLAR.addNode = function (UNDERLINEminorIndex, UNDERLINEraw, UNDERLINEnoUNDERLINEchildren)
{
    return this.UNDERLINEtree.UNDERLINEinsertNodes(this.UNDERLINEindex, UNDERLINEminorIndex, [ UNDERLINEraw ], UNDERLINEnoUNDERLINEchildren);
}

DOLLAR.recreate = function (UNDERLINEraw, UNDERLINEreuseChildren)
{
    this.UNDERLINEtree.UNDERLINEreplaceDefinition(this.UNDERLINEindex, UNDERLINEraw, false, false, UNDERLINEreuseChildren);
    this.UNDERLINEtree.UNDERLINEredraw();
}

DOLLAR.deleteNode = function (UNDERLINEindex)
{
    this.UNDERLINEtree.UNDERLINEdeleteNode(this.UNDERLINEdefinition, UNDERLINEindex);
}

DOLLAR.getLayer = DOLLAR.UNDERLINEgetLayer = function (UNDERLINEsuffix)
{
    if (!UNDERLINEsuffix)
        UNDERLINEsuffix = 'd';

    if (!this.UNDERLINElayers[UNDERLINEsuffix])
    {
        if (!this.UNDERLINElayersAttached)
        {
            if (this.UNDERLINEparentNode)
                this.UNDERLINEparentNode.UNDERLINEgetLayerForChildren();
            this.UNDERLINElayersAttached = true;
            this.UNDERLINElayers = {};
        }

        this.UNDERLINElayers[UNDERLINEsuffix] = this.UNDERLINEtree.UNDERLINEgetElement(this.UNDERLINEid + UNDERLINEsuffix);
    }

    return this.UNDERLINElayers[UNDERLINEsuffix];
}

UNDERLINETree.UNDERLINEBack = function (UNDERLINEcolor, UNDERLINEtree)
{
    this.UNDERLINEtree = UNDERLINEtree;
    this.UNDERLINEleft = UNDERLINEtree.UNDERLINEformat.UNDERLINEleft;
    this.UNDERLINEtop = UNDERLINEtree.UNDERLINEformat.UNDERLINEtop;
    this.UNDERLINEname = 'cls' + UNDERLINEtree.UNDERLINEname + 'UNDERLINEback';
    this.color = UNDERLINEcolor;
}

DOLLAR = UNDERLINETree.UNDERLINEBack.prototype;

DOLLAR.UNDERLINEgetLayer = function (UNDERLINEsuffix)
{
    return this.UNDERLINEtree.UNDERLINEgetElement(this.UNDERLINEname + (UNDERLINEsuffix || ''));
}

DOLLAR.UNDERLINEcreateChildLayer = function (UNDERLINEhtml)
{
    var UNDERLINEresult = document.createElement('div');

    with (UNDERLINEresult)
    {
        style.position = 'absolute';
        style.top = style.left = 0;
        innerHTML = UNDERLINEhtml;
    }

    this.UNDERLINEgetLayer().appendChild(UNDERLINEresult);

    return UNDERLINEresult;
}

DOLLAR.UNDERLINEresize = function (UNDERLINEwidth, UNDERLINEheight)
{
    if (this.UNDERLINEtree.bw.UNDERLINEoperaOld && !this.UNDERLINEfirst)
        this.UNDERLINEfirst = true;
    else
    {

        with (this.UNDERLINEgetLayer())
            if (this.UNDERLINEtree.bw.ns4)
                resizeTo(UNDERLINEwidth, UNDERLINEheight);
            else
            {
                style.width = UNDERLINEwidth + this.UNDERLINEtree.UNDERLINEpx;
                style.height = UNDERLINEheight + this.UNDERLINEtree.UNDERLINEpx;
            }
    }
}

DOLLAR.UNDERLINEmoveTo = function (UNDERLINEleft, UNDERLINEtop)
{
    with (this.UNDERLINEgetLayer())
        if (this.UNDERLINEtree.bw.ns4)
            moveTo(UNDERLINEleft, UNDERLINEtop);
        else
        {
            style.left = UNDERLINEleft + this.UNDERLINEtree.UNDERLINEpx;
            style.top = UNDERLINEtop + this.UNDERLINEtree.UNDERLINEpx;
        }
}

DOLLAR.UNDERLINEinit = function (UNDERLINEstring)
{
    var p = 'relative', w = 1, h = 1;

    if (this.UNDERLINEtree.UNDERLINEformat.rel)
    {
        w = this.UNDERLINEtree.UNDERLINEformat.rels[0];
        h = this.UNDERLINEtree.UNDERLINEformat.rels[1];
    }
    else

        p = 'absolute';

    return UNDERLINEstring.UNDERLINEprepend(
        '<div style="overflow:'
        + (this.UNDERLINEtree.UNDERLINEoperaOld ? 'scroll' : 'hidden') + ';'
        + (this.color == "" ? "" : (this.UNDERLINEtree.bw.ns4 ? 'layer-' : '')
        + 'background-color:' + this.color + ";")
        + 'position:' + p + ';top:' + this.UNDERLINEtop + 'px;left:' + this.UNDERLINEleft
        + 'px;width:' + w + 'px;height:' + h + 'px;z-index:0;" id="'
        + this.UNDERLINEname + '">'
        + (
            this.UNDERLINEtree.bw.ns4
            ? '<img src="' + this.UNDERLINEtree.UNDERLINEformat.UNDERLINEblankImage
            + '" width="' + w + '" height="' + h + '" />'
            : ''
        )

    ).UNDERLINEappendString('</div>');
}

UNDERLINETree.UNDERLINEBrowserDetector = function ()
{
    var UNDERLINEisUNDERLINEmajor = parseInt(navigator.appVersion);

    this.ver = navigator.appVersion;
    this.agent = navigator.userAgent;
    this.dom = document.getElementById ? 1 : 0;
    this.opera = window.opera ? 1 : 0;
    this.ie5 = this.ver.match(/MSIE 5/) && this.dom && !this.opera;
    this.ie6 = this.ver.match(/MSIE 6/) && this.dom && !this.opera;
    this.ie4 = document.all && !this.dom && !this.opera;
    this.ie = this.ie4 || this.ie5 || this.ie6;
    this.mac = this.agent.match(/Mac/);

    this.ie3 = this.ver.match(/MSIE/) && UNDERLINEisUNDERLINEmajor < 4;
    this.hotjava = this.agent.match(/hotjava/i);
    this.ns4 = document.layers && !this.dom && !this.hotjava;

    this.UNDERLINEver3 = this.hotjava || this.ie3;
    this.operaNew = this.agent.match(/opera.[789]/i);
    this.gecko = this.agent.match(/gecko/i);
    this.oldGecko = this.agent.match(/gecko\/2002/i);
    this.UNDERLINEoperaOld = this.opera && !this.operaNew;
}

function UNDERLINEpreloadImages(UNDERLINElist)
{
    for (var i in UNDERLINElist)
        (new Image()).src = UNDERLINElist[i];
}

UNDERLINETree.UNDERLINEoldCTOnLoad = window.onload;
UNDERLINETree.UNDERLINEoldCTOnUnLoad = window.onunload;

window.onload = function ()
{
    UNDERLINETree.UNDERLINEredrawAllTrees();
    return !UNDERLINEisFunction(UNDERLINETree.UNDERLINEoldCTOnLoad) || UNDERLINETree.UNDERLINEoldCTOnLoad();
}

window.onunload = function ()
{
    for (var i in window.CTrees)
        with (window.CTrees[i])
            if (UNDERLINEformat.cook)
                UNDERLINEsaveState();

    return !UNDERLINEisFunction(UNDERLINETree.UNDERLINEoldCTOnUnLoad) || UNDERLINETree.UNDERLINEoldCTOnUnLoad();
}

function UNDERLINEcopyObject (o)
{
    var r = {};

    for (var i in o)
        r[i] = typeof(o[i]) == 'object' && o[i] !== null ? UNDERLINEcopyObject(o[i]) : o[i];

    return r;
}

window.COOLjsTreePRO = UNDERLINETree;

window.RedrawAllTrees = function ()
{
    UNDERLINETree.UNDERLINEredrawAllTrees();
}

})();