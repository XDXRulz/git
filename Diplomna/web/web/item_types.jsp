<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.HtmlLink" %>
<%@ page import="bg.infologica.project.core.Settings" %>
<%@ page import="bg.infologica.project.core.User" %>
<%@ page import="java.util.List" %>
<%@ page import="bg.infologica.project.core.UserRole" %>
<%@ page import="bg.infologica.project.orm.ItemType" %>
<%@ page import="bg.infologica.project.dao.ItemTypeDao" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!User.valid(user)) {
        response.sendRedirect(User.home(user));
        return;
    }

    boolean admin = user.hasRole(UserRole.ADMIN);
    List<ItemType> itemTypes = ItemTypeDao.LoadAll();
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<h1>Видове Типове за артикули</h1>
<table class="list hover">
    <thead>
    <tr>
        <th>Категория</th>
        <th>Наименование</th>
        <% if (admin) { %>
        <th class="icon"></th>
        <th class="icon"></th>
        <% } %>
    </tr>
    <% if(admin) { %>
    <tr class="add_row">
        <td colspan="20">
            <%= HtmlLink.getLinkPopup("popup/item_type.jsp?action=add", "Добави") %>
        </td>
    </tr>
    <% } %>
    </thead>
    <tbody>
    <% for(ItemType itemType : itemTypes) { %>
    <tr class="top">
        <td><%= Tools.fix(itemType.getCategory().getCategoryName()) %></td>
        <td><%= Tools.fix(itemType.getTypeName()) %></td>
        <% if (admin) { %>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/item_type.jsp?action=edit&id=" + itemType.getTypeId(), "edit", "Корекция") %></td>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/item_type.jsp?action=delete&id=" +  itemType.getTypeId(), "delete", "Изтриване") %></td>
        <% } %>
    </tr>
    <% } %>
    </tbody>
</table>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>