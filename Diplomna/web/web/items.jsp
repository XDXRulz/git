<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.HtmlLink" %>
<%@ page import="bg.infologica.project.core.Settings" %>
<%@ page import="bg.infologica.project.core.User" %>
<%@ page import="java.util.List" %>
<%@ page import="bg.infologica.project.core.UserRole" %>
<%@ page import="bg.infologica.project.orm.ItemType" %>
<%@ page import="bg.infologica.project.dao.ItemTypeDao" %>
<%@ page import="bg.infologica.project.orm.Item" %>
<%@ page import="bg.infologica.project.dao.ItemDao" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!User.valid(user)) {
        response.sendRedirect(User.home(user));
        return;
    }

    boolean admin = user.hasRole(UserRole.ADMIN);
    List<Item> items = ItemDao.LoadAll();
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<h1>Видове артикули</h1>
<table class="list hover">
    <thead>
    <tr>
        <th>Категория</th>
        <th>Тип продукт</th>
        <th>Наименование</th>
        <th>Цена</th>
        <% if (admin) { %>
        <th class="icon"></th>
        <th class="icon"></th>
        <% } %>
    </tr>
    <% if(admin) { %>
    <tr class="add_row">
        <td colspan="20">
            <%= HtmlLink.getLinkPopup("popup/item.jsp?action=add", "Добави") %>
        </td>
    </tr>
    <% } %>
    </thead>
    <tbody>
    <% for(Item item : items) { %>
    <tr class="top">
        <td><%= Tools.fix(item.getItemType().getCategory().getCategoryName()) %></td>
        <td><%= Tools.fix(item.getItemType().getTypeName()) %></td>
        <td><%= Tools.fix(item.getItemName()) %></td>
        <td><%= Tools.fixFloat(item.getPrice(), 8, 2, "лв") %></td>
        <% if (admin) { %>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/item.jsp?action=edit&id=" + item.getItemId(), "edit", "Корекция") %></td>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/item.jsp?action=delete&id=" +  item.getItemId(), "delete", "Изтриване") %></td>
        <% } %>
    </tr>
    <% } %>
    </tbody>
</table>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>