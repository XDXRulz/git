<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.HtmlLink" %>
<%@ page import="bg.infologica.water.core.Settings" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page import="java.util.List" %>
<%@ page import="bg.infologica.water.core.UserRole" %>
<%@ page import="bg.infologica.water.orm.Category" %>
<%@ page import="bg.infologica.water.dao.CategoryDao" %>
<%@ page import="bg.infologica.water.dao.OrderDao" %>
<%@ page import="bg.infologica.water.orm.OrderOrm" %>
<%@ page import="bg.infologica.water.core.OrderStatuses" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="bg.infologica.water.orm.OrderItemsOrm" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!User.valid(user)) {
        response.sendRedirect(User.home(user));
        return;
    }
    SimpleDateFormat sdf= new SimpleDateFormat("dd.MM.yyyy hh:mm:ss");
    boolean waitress = user.hasRole(UserRole.ADMIN) || user.hasRole(UserRole.WAITRESS);
    boolean bartender = user.hasRole(UserRole.ADMIN) || user.hasRole(UserRole.WAITRESS);
    List<OrderOrm> orders = OrderDao.LoadAll();
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<h1>Поръчки:</h1>
<table class="list hover">
    <thead>
    <tr>
        <th>Статус</th>
        <th>Име на сервитиорка</th>
        <th>Име на барман</th>
        <th>Дата</th>
        <% if (waitress) { %>
        <th class="icon"></th>
        <% } %>
        <% if (waitress||bartender) { %>
        <th class="icon"></th>
        <% } %>
    </tr>
    <% if (waitress) { %>
    <tr class="add_row">
        <td colspan="20">
            <%= HtmlLink.getLinkPopup("popup/order.jsp?action=add", "Добави") %>
        </td>
    </tr>
    <% } %>
    </thead>
    <tbody>
    <% int count=0;
        for(OrderOrm order : orders) { %>
    <tr class="top">
        <td><%= Tools.fix(OrderStatuses.getStatusName(order.getStatusCode())) %></td>
        <td><%= Tools.fix(order.getWaitressName()) %></td>
        <td><%= Tools.fix(order.getBartenderName()) %></td>
        <td><%= Tools.fix(sdf.format(order.getLastStatusUpdate())) %></td>
        <% if (waitress) { %>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/order_items.jsp?action=add&orderId=" + order.getOrderId(), "add", "Добавяне на артикули") %></td>
        <% } %>
        <% if (waitress||bartender) { %>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/order.jsp?action=edit&orderId=" + order.getOrderId(), "edit", "Редакция на статус") %></td>
        <% } %>
    </tr>
    <tr class="top">
        <td colspan="20">
            <table class="list hover">
                <thead>
                <tr>
                    <th>Категория</th>
                    <th>Тип</th>
                    <th>Продукт</th>
                    <th>Количество</th>
                    <% if (waitress) { %>
                    <th class="icon"></th>
                    <th class="icon"></th>
                    <%}%>
                </tr>
                </thead>
                <tbody>
                <% for(OrderItemsOrm item : order.getItemsList()){ %>
                <tr>
                    <td><%= Tools.fix(item.getItem().getItemType().getCategory().getCategoryName()) %></td>
                    <td><%= Tools.fix(item.getItem().getItemType().getTypeName())%></td>
                    <td><%= Tools.fix(item.getItem().getItemName())%></td>
                    <td><%= Tools.fixFloat(item.getQuantity(), 8, 2)%></td>
                    <% if (waitress) { %>
                    <td class="icon"><%= HtmlLink.getIconPopup("popup/order_items.jsp?action=edit&order_item_id=" + item.getOrderItemId(), "edit", "Редакция на артикул") %></td>
                    <td class="icon"><%= HtmlLink.getIconPopup("popup/order_items.jsp?action=delete&order_item_id=" + item.getOrderItemId(), "delete", "Изтриване на артикул") %></td>
                    <% } %>
                </tr>
                <% } %>
                </tbody>
            </table>
        </td>
    </tr>
    <% } %>
    </tbody>
</table>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>