<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.project.core.SessionMessages" %>
<%@ page import="bg.infologica.project.core.User" %>
<%@ page import="bg.infologica.project.core.BarCommons" %>
<%@ page import="bg.infologica.project.core.UserRole" %>
<%@ page import="bg.infologica.project.orm.Category" %>
<%@ page import="bg.infologica.project.dao.CategoryDao" %>
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
    int id = get.getInt("id");
    String action= get.getString("action");
    Category category = new Category();
    if("delete".equals(action)){
        CategoryDao.Delete(id);
        out.println(JavaScript.documentReload());
        return;
    }
    if("save".equals(action))
    {
        category = new Category(get.getInt("id"),get.getString("category_name"));
        if (Tools.emptyString(category.getCategoryName())) {
            SessionMessages.error(session, "Задължително трябва да се въведе наименование.");
        }
        if (!SessionMessages.exists(session)) {
            if (CategoryDao.Save(category)) {
                SessionMessages.success(session, "Успешнно добавяне/редакция на категория за артикули.");
            } else {
                SessionMessages.error(session, "Грешка при запис на категория за артикули.");
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
            category =  CategoryDao.Load(id);
%>
<%= Popup.header(response, "Редакция на категория за артикули") %>
<%}else{%><%= Popup.header(response, "Добавяне на категория за артикули") %><%}%>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("action", "save") %>
    <%= Html.hidden("id", id) %>
    <fieldset>
        <label>Наименование:</label>
        <%= Html.inputText("category_name", (category!=null)?category.getCategoryName():"") %>
    </fieldset>
    <%= Popup.buttonsSaveAndCancel() %>
</form>
<%= Popup.footer() %>
<%
    }
%>
