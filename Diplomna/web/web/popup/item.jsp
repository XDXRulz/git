<%--
  Created by IntelliJ IDEA.
  User: Admin
  Date: 14-2-5
  Time: 16:39
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.water.core.*" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="bg.infologica.water.core.SessionMessages" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page import="bg.infologica.water.core.BarCommons" %>
<%@ page import="bg.infologica.water.core.UserRole" %>
<%@ page import="bg.infologica.water.orm.ItemType" %>
<%@ page import="bg.infologica.water.dao.ItemTypeDao" %>
<%@ page import="bg.infologica.water.orm.Category" %>
<%@ page import="bg.infologica.water.orm.Item" %>
<%@ page import="bg.infologica.water.dao.ItemDao" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    SmartMap get;
    get = new SmartMap(request);
    // проверка правата за достъп на потребителя
    User user = User.create(session);
    boolean admin = User.valid(user) && user.hasRole(UserRole.ADMIN);
    if (!admin) {
        out.println(JavaScript.documentReload());
        return;
    }

    ResultSet itemtypes = null;
    Database db = null;
    try {
        db = new Database();
        itemtypes = db.select(SQL.LOAD_ITEMTYPES);

        int id = get.getInt("id");
        String action= get.getString("action");
        Item item = null;
        if("delete".equals(action)){
            ItemDao.Delete(id);
            out.println(JavaScript.documentReload());
            return;
        }
        if("save".equals(action))
        {
            item = new Item(get.getInt("id"),get.getString("item_name"),get.getDouble("price"),new ItemType(get.getInt("type_id")));
            if (Tools.emptyString(item.getItemName())) {
                SessionMessages.error(session, "Задължително трябва да се въведе наименование.");
            }
            if (!SessionMessages.exists(session)) {
                if (ItemDao.Save(item)) {
                    SessionMessages.success(session, "Успешнно добавяне/редакция на артикули.");
                } else {
                    SessionMessages.error(session, "Грешка при запис  на артикули.");
                }
                out.println(JavaScript.documentReload());
                return;
            }
            else{SessionMessages.error(session, BarCommons.ERROR_SAVE);}
        }
        else
        {
            if("edit".equals(action))
            {
                item =  ItemDao.Load(id);
%>
<%= Popup.header(response, "Редакция на артикули") %>
<%}else{%><%= Popup.header(response, "Добавяне на артикули") %><%}%>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("action", "save") %>
    <%= Html.hidden("id", id) %>
    <fieldset>
        <label>Наименование:</label>
        <%= Html.inputText("item_name", (item != null) ? item.getItemName() : "") %>
        <label>Цена:</label>
        <%= Html.inputText("price", (item != null) ? Tools.fixFloat(item.getPrice(), 8,2): "") %>

        <label>Категория:</label>
        <%= Html.select("type_id", (item != null && item.getItemType() != null) ? item.getItemType().getTypeId() : 0, itemtypes) %>

        <br/>
    </fieldset>
    <%= Popup.buttonsSaveAndCancel() %>
</form>
<%= Popup.footer() %>
<%
        }
    }
    catch (Exception e){
        e.printStackTrace();
    }
    finally {
        Database.RELEASE(itemtypes);
        Database.RELEASE(db);
    }
%>