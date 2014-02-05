
InfologicaDualListBox = function () {

    this.element_form = "form1";
    this.element_available = "availableItems";
    this.element_selected = "selectedItems";

    this.addAll = function () {
        var ai = document.getElementById(this.element_available);
        var si = document.getElementById(this.element_selected);
        for (var i = 0; i < ai.options.length; i++) {
            var opt = ai.options[i];
            si.options[si.options.length] = new Option(opt.innerHTML, opt.value);
        }
        ai.options.length = 0;
    };

    this.addSelected = function () {
        var ai = document.getElementById(this.element_available);
        var si = document.getElementById(this.element_selected);
        for (var i = 0; i < ai.options.length; i++) {
            if (ai.options[i].selected) {
                var opt = ai.options[i];
                si.options[si.options.length] = new Option(opt.innerHTML, opt.value);
                ai.options[i] = null;
                i = i - 1;
            }
        }
    };

    this.removeAll = function () {
        var ai = document.getElementById(this.element_available);
        var si = document.getElementById(this.element_selected);
        for (var i = 0; i < si.options.length; i++) {
            var opt = si.options[i];
            ai.options[ai.options.length] = new Option(opt.innerHTML, opt.value);
        }
        si.options.length = 0;
        this.sortAvailable();
    };

    this.removeItems = function () {
        var ai = document.getElementById(this.element_available);
        var si = document.getElementById(this.element_selected);
        for (var i = 0; i < si.options.length; i++) {
            if (si.options[i].selected) {
                var opt = si.options[i];
                ai.options[ai.options.length] = new Option(opt.innerHTML, opt.value);
                si.options[i] = null;
                i = i - 1;
            }
        }
        this.sortAvailable();
    };

    this.moveDown = function () {
        var si = document.getElementById(this.element_selected);
        var sel = si.selectedIndex;
        if (sel < si.options.length -1) {
            var optHTML = si.options[sel].innerHTML;
            var optVal = si.options[sel].value;
            var opt1HTML = si.options[sel+1].innerHTML;
            var opt1Val = si.options[sel+1].value;
            si.options[sel] = new Option(opt1HTML,opt1Val);
            si.options[sel+1] = new Option(optHTML,optVal);
            si.options.selectedIndex = sel +1;
        }
    };

    this.moveUp = function () {
        var si = document.getElementById(this.element_selected);
        var sel = si.selectedIndex;
        if (sel > 0) {
            var optHTML = si.options[sel].innerHTML;
            var optVal = si.options[sel].value;
            var opt1HTML = si.options[sel-1].innerHTML;
            var opt1Val = si.options[sel-1].value;
            si.options[sel] = new Option(opt1HTML,opt1Val);
            si.options[sel-1] = new Option(optHTML,optVal);
            si.options.selectedIndex = sel - 1;
        }
    };

    this.sortAvailable = function () {
        var ai = document.getElementById(this.element_available);
        var tmp = "";
        for (var i = 0; i < ai.options.length; i++) {
            if (tmp > "") tmp +=",";
            tmp += ai.options[i].innerHTML + "~" + ai.options[i].value;
        }
        var atmp = tmp.split(",");
        atmp = atmp.sort();
        ai.options.length = 0;
        var opt;
        for (i = 0; i < atmp.length; i++) {
            opt = atmp[i].split("~");
            ai.options[i] = new Option(opt[0], opt[1]);
        }
    };

    this.formSubmit = function () {
        var si = document.getElementById(this.element_selected);
        for (var i = 0; i < si.options.length; i++) {
            si.options[i].selected = true;
        }
        $('#' + this.element_form).submit();
    }

};

/*
Example:

<%
    if request.Form("SelectedItems") > "" then
        response.Write("You chose option(s): " & request.Form("selectedItems"))
    end if
    initialItems = Array("Apples","Oranges","Grapes","Berries","Kiwis")
%>
<form name="form1" id="form1" method="post">
    <div style="width:130px; float:left;">
        <select size="10" multiple name="availableItems" id="availableItems" style="width:120px;">
            <% for i = 0 to ubound(initialItems) { %>
                <option value="<%= i %>"><%= initialItems(i) %></option>
            <% } %>
        </select>
    </div>
    <div style="width:100px;float:left;">
        <input type="button" style="width: 90px;" value="Add" onclick="addItems();" />
        <input type="button" style="width: 90px;" value="Add All" onclick="addAll();" />
        <input type="button" style="width: 90px;" value="Remove" onclick="removeItems();" />
        <input type="button" style="width: 90px;" value="Remove All" onclick="removeAll();" />
        <input type="button" style="width: 90px;" value="Move Up" onclick="moveUp();" />
        <input type="button" style="width: 90px;" value="Move Down" onclick="moveDown();" />
        <input type="button" style="width: 90px;" value="Submit" onclick="frmSubmit();" />
    </div>
    <div style="width: 130px; float: left">
        <select size="10" multiple="multiple" name="selectedItems" id="selectedItems" style="width:120px;">
        </select>
    </div>
</form>
*/