<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="bg.infologica.project.orm.ItemType" %>
<%@ page import="bg.infologica.project.dao.ItemTypeDao" %>
<%@ page import="bg.infologica.project.orm.Category" %>
<%@ page import="bg.infologica.project.orm.Item" %>
<%@ page import="bg.infologica.project.dao.ItemDao" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.project.core.*" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.project.dao.OrderDao" %>
<%@ page import="bg.infologica.project.orm.OrderOrm" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    SmartMap get;
    get = new SmartMap(request);
    // проверка правата за достъп на потребителя
    User user = User.create(session);
    boolean valid = User.valid(user);
    if (!valid) {
        out.println(JavaScript.documentReload());
        return;
    }
    Database db = null;
    try {
        db = new Database();
        if (get.getInt("capture") > 0) {
        }
        int id = get.getInt("order_id");
        String action= get.getString("action");
        // Item item = null;
        if("delete".equals(action)){
            OrderDao.Delete(id);
            out.println(JavaScript.documentReload());
            return;
        }
        OrderOrm order = null;
        if("save".equals(action))
        {
            int status_code = get.getInt("status_code");
            order = id>0?OrderDao.Load(id,false):new OrderOrm();
            if(user.hasRole(UserRole.BARTENDER)||user.hasRole(UserRole.ADMIN))
                order.setBartenderId( user.getId());
            if(user.hasRole(UserRole.WAITRESS))
                order.setWaitressId(user.getId());
            order.setOrderId(id);
            order.setStatusCode(status_code);
            if (status_code<=0) {
                SessionMessages.error(session, "Задължително трябва да се избере статус на поръчката.");
            }
            if (!SessionMessages.exists(session)) {
                if (OrderDao.Save(order)) {
                    SessionMessages.success(session, "Успешнно добавяне/редакция на статус на поръчка.");
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
                order = id>0?OrderDao.Load(id,false):new OrderOrm();
                //ItemDao.Load(id);
%>
<%= Popup.header(response, "Редакция на статус на поръчка") %>
<%}else{%><%= Popup.header(response, "Добавяне на поръчка") %><%}%>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("action", "save") %>
    <%= Html.hidden("order_id", id) %>
    <fieldset>
        <label>Статус на поръчката:</label>
        <select name="status_code" id="status_code">
            <option value="<%=OrderStatuses.NEW%>"
                    <%if(order!=null&&order.getStatusCode()== OrderStatuses.NEW){%>selected="selected" <%}%>>
                <%=OrderStatuses.getStatusName(OrderStatuses.NEW)%></option>
        <option value="<%=OrderStatuses.PROCESSING%>"
                    <%if(order!=null&&order.getStatusCode()== OrderStatuses.PROCESSING){%>selected="selected" <%}%>>
                <%=OrderStatuses.getStatusName(OrderStatuses.PROCESSING)%></option>
        <option value="<%=OrderStatuses.FINISHED%>"
                    <%if(order!=null&&order.getStatusCode()== OrderStatuses.FINISHED){%>selected="selected" <%}%>>
                <%=OrderStatuses.getStatusName(OrderStatuses.FINISHED)%></option>
        <option value="<%=OrderStatuses.PAYED%>"
                    <%if(order!=null&&order.getStatusCode()== OrderStatuses.PAYED){%>selected="selected" <%}%>>
                <%=OrderStatuses.getStatusName(OrderStatuses.PAYED)%></option>
        <option value="<%=OrderStatuses.DECLINED%>"
                    <%if(order!=null&&order.getStatusCode()== OrderStatuses.DECLINED){%>selected="selected" <%}%>>
                <%=OrderStatuses.getStatusName(OrderStatuses.DECLINED)%></option>
        </select>
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
        Database.RELEASE(db);
    }
%>