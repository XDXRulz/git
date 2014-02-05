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

    ResultSet categories = null;
    Database db = null;
    try {
        db = new Database();
        categories = db.select(SQL.LOAD_CATEGORIES);

    int id = get.getInt("id");
    String action= get.getString("action");
    ItemType itemType = null;
    if("delete".equals(action)){
        ItemTypeDao.Delete(id);
        out.println(JavaScript.documentReload());
        return;
    }
    if("save".equals(action))
    {
        itemType = new ItemType(get.getInt("id"),get.getString("type_name"),new Category(get.getInt("category_id")));
        if (Tools.emptyString(itemType.getTypeName())) {
            SessionMessages.error(session, "Задължително трябва да се въведе наименование.");
        }
        if (!SessionMessages.exists(session)) {
            if (ItemTypeDao.Save(itemType)) {
                SessionMessages.success(session, "Успешнно добавяне/редакция на тип на артикули.");
            } else {
                SessionMessages.error(session, "Грешка при запис на тип на артикули.");
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
            itemType =  ItemTypeDao.Load(id);
%>
<%= Popup.header(response, "Редакция на тип на артикули") %>
<%}else{%><%= Popup.header(response, "Добавяне на тип на артикули") %><%}%>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("action", "save") %>
    <%= Html.hidden("id", id) %>
    <fieldset>
                <label>Наименование:</label>
        <%= Html.inputText("type_name", (itemType!=null)?itemType.getTypeName():"") %>

        <label>Категория:</label>
        <%= Html.select("category_id", (itemType!=null&&itemType.getCategory()!=null)?itemType.getCategory().getCategoryId():0, categories) %>
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
        Database.RELEASE(categories);
        Database.RELEASE(db);
    }
%>