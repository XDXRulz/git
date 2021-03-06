<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.HtmlLink" %>
<%@ page import="bg.infologica.project.core.Settings" %>
<%@ page import="bg.infologica.project.core.User" %>
<%@ page import="java.util.List" %>
<%@ page import="bg.infologica.project.core.UserRole" %>
<%@ page import="bg.infologica.project.orm.Category" %>
<%@ page import="bg.infologica.project.dao.CategoryDao" %>
<%@ page import="bg.infologica.project.dao.OrderDao" %>
<%@ page import="bg.infologica.project.orm.OrderOrm" %>
<%@ page import="bg.infologica.project.core.OrderStatuses" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="bg.infologica.project.orm.OrderItemsOrm" %>
<%@ page import="java.util.Calendar" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!(User.valid(user)&&(user.hasRole(UserRole.ADMIN)|| user.hasRole(UserRole.BARTENDER))))
    {
        response.sendRedirect(User.home(user));
        return;
    }
    SimpleDateFormat sdf= new SimpleDateFormat("dd.MM.yyyy hh:mm:ss");
    try {

        List<OrderOrm> orders = OrderDao.LoadAll(false);
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<h1>Поръчки:</h1>
<table class="list hover">
    <thead>
    <tr>
        <th>Статус</th>
        <th>Име на сервитиорка</th>
        <th>Име на барман</th>
        <th>Брой артикули</th>
        <th>Момент на редакция</th>
        <th class="icon"></th>
    </tr>
    </thead>
    <tbody>
    <%
        for(OrderOrm order : orders) { %>
    <tr class="top status_<%=order.getStatusCode()%>" onclick="showOnClick('<%=order.getOrderId()%>');">
        <td><%= Tools.fix(OrderStatuses.getStatusName(order.getStatusCode())) %></td>
        <td><%= Tools.fix(order.getWaitressName()) %></td>
        <td><%= Tools.fix(order.getBartenderName()) %></td>
        <td><%= Tools.fixInt(order.getItemsList() != null ? order.getItemsList().size() : 0) %></td>
        <td><%= Tools.fix(sdf.format(order.getLastStatusUpdate())) %></td>
        <td class="icon"><%= HtmlLink.getIconPopup("popup/order_status_change.jsp?action=edit&order_id=" + order.getOrderId(), "edit", "Редакция на статус") %></td>
    </tr>
    <%
        if(order.getItemsList()!=null&&order.getItemsList().size()>0)
        {
    %>
    <tr class="top toBeHidden toShowWhen_<%=order.getOrderId()%>">
        <td colspan="20">
            <table class="list hover">
                <thead>
                <tr>
                    <th>Категория</th>
                    <th>Тип</th>
                    <th>Продукт</th>
                    <th>Количество</th>
                    <th>Момент на добавяне</th>
                </tr>
                </thead>
                <tbody>
                <% for(OrderItemsOrm item : order.getItemsList()){ %>
                <tr>
                    <td><%= Tools.fix(item.getItem().getItemType().getCategory().getCategoryName()) %></td>
                    <td><%= Tools.fix(item.getItem().getItemType().getTypeName())%></td>
                    <td><%= Tools.fix(item.getItem().getItemName())%></td>
                    <td><%= Tools.fixFloat(item.getQuantity(), 8, 2)%></td>
                    <td><%= Tools.fix(sdf.format(item.getDate())) %></td>
                </tr>
                <% } %>
                </tbody>
            </table>
        </td>
    </tr>
    <%
            }
        }
    %>
    </tbody>
</table>

<table>
    <tr><th colspan="2">Легенда:</th></tr>
    <tr><th><%=OrderStatuses.getStatusName(OrderStatuses.NEW)%></th><td class="status_<%=OrderStatuses.NEW%>"></td></tr>
    <tr><th><%=OrderStatuses.getStatusName(OrderStatuses.PROCESSING)%></th><td class="status_<%=OrderStatuses.PROCESSING%>"></td></tr>
    <tr><th><%=OrderStatuses.getStatusName(OrderStatuses.FINISHED)%></th><td class="status_<%=OrderStatuses.FINISHED%>"></td></tr>
    <tr><th><%=OrderStatuses.getStatusName(OrderStatuses.PAYED)%></th><td class="status_<%=OrderStatuses.PAYED%>"></td></tr>
    <tr><th><%=OrderStatuses.getStatusName(OrderStatuses.DECLINED)%></th><td class="status_<%=OrderStatuses.DECLINED%>"></td></tr>
</table>
<script type="text/javascript">
    function showOnClick(id){
        $(".toBeHidden").hide();
        $(".toShowWhen_"+id).show();
    }
    setTimeout(showOnClick,100);
    function checkForNewData(){
        var request = $.ajax({
            url: "../modules/checkForNewData.jsp",
            type: "POST",
            data: { time:<%=Calendar.getInstance().getTime().getTime()%> },
            dataType: "html"
        });
        request.done(function( msg ) {
            var json = JSON.parse(msg);
            if("true"===json.flag){
                console.log("top.locating");
                top.location = top.location;
            }
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
    }
    setInterval(checkForNewData,30000);
</script>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>
<%

    }
    catch (Exception e){
        e.printStackTrace();
    }
%>