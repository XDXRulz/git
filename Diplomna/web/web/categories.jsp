<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.HtmlLink" %>
<%@ page import="bg.infologica.water.core.Settings" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page import="java.util.List" %>
<%@ page import="bg.infologica.water.core.UserRole" %>
<%@ page import="bg.infologica.water.orm.Category" %>
<%@ page import="bg.infologica.water.dao.CategoryDao" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!User.valid(user)) {
        response.sendRedirect(User.home(user));
        return;
    }

    boolean admin = user.hasRole(UserRole.ADMIN);
    List<Category> categories = CategoryDao.LoadAll();
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<h1>Видове категория за артикули</h1>
<table class="list hover">
    <thead>
    <tr>
        <th>Наименование</th>
        <% if (admin) { %>
        <th class="icon"></th>
        <th class="icon"></th>
        <% } %>
    </tr>
    <% if(admin) { %>
    <tr class="add_row">
        <td colspan="20">
            <%= HtmlLink.getLinkPopup("popup/category.jsp?action=add", "Добави") %>
        </td>
    </tr>
    <% } %>
    </thead>
    <tbody>
    <% for(Category category : categories) { %>
    <tr class="top">
        <td><%= Tools.fix(category.getCategoryName()) %></td>
        <% if (admin) { %>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/category.jsp?action=edit&id=" + category.getCategoryId(), "edit", "Корекция") %></td>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/category.jsp?action=delete&id=" + category.getCategoryId(), "delete", "Изтриване") %></td>
        <% } %>
    </tr>
    <% } %>
    </tbody>
</table>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>