<%@ page import="bg.infologica.common.Debug" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.HtmlLink" %>
<%@ page import="bg.infologica.project.core.Database" %>
<%@ page import="bg.infologica.project.core.Settings" %>
<%@ page import="bg.infologica.project.core.User" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="bg.infologica.project.core.UserRole" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!(User.valid(user) && user.hasRole(UserRole.ADMIN))) {
        response.sendRedirect(User.home(user));
        return;
    }

    Database db = null;
    try {
        db = new Database();
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<h1>Потребители на системата</h1>
<table class="list hover">
    <thead>
    <tr>
        <th class="icon"></th>
        <th>Име за достъп</th>
        <th>Име, фамилия</th>
        <th>Роля</th>
        <th>Последно влизане</th>
        <th class="icon"></th>
        <th class="icon"></th>
    </tr>
    <tr class="add_row">
        <td colspan="20">
            <%= HtmlLink.getLinkPopup("popup/user.jsp", "Нов потребител") %>
        </td>
    </tr>
    </thead>
    <tbody>
    <%
        ResultSet rs = null;
        try {
            rs = db.select("select u.user_id, u.active," +
                    " u.user_name, u.names," +
                    " u.role_id, r.role_name as role_name," +
                    " to_char(u.last_login,'DD.MM.YYYY HH24:MI') as last_login " +
                    "from users u LEFT JOIN user_roles r ON u.role_id=r.role_id " +
                    "order by u.role_id, lower(u.names)");
            if (rs != null && rs.next()) {
                int save_role = -1;
                rs.beforeFirst();
                while (rs.next()) {
                    if (save_role != rs.getInt("role_id")) {
                        save_role = rs.getInt("role_id");
    %>
    <tr class="top">
        <td colspan="20" class="head center"><%= rs.getString("role_name") %></td>
    </tr>
    <%
                    }
    %>
    <tr class="top<%= (!rs.getBoolean("active") ? " inactive" : "") %>">
        <td class="icon"><%= HtmlLink.getIconPopup(
                "popup/password.jsp?id=" + rs.getInt("user_id"), "key", "Смяна на паролата") %></td>
        <td><%= Tools.fix(rs.getString("user_name")) %></td>
        <td><%= Tools.fix(rs.getString("names")) %></td>
        <td><%= Tools.fix(rs.getString("role_name")) %></td>
        <td><%= Tools.fix(rs.getString("last_login")) %></td>
        <td class="icon"><%= HtmlLink.getIconPopup(
                "popup/user.jsp?id=" + rs.getInt("user_id"), "edit", "Корекция") %></td>
        <td class="icon"><%= HtmlLink.getIconExecConfirm("Потвърдете изтриване?",
                "modules/delete_user.jsp?id=" + rs.getInt("user_id"), "delete", "Изтриване") %></td>
    </tr>
    <%
                }
            }
        }
        catch (SQLException e) {
            Debug.trace(e, "users.jsp");
        }
        finally {
            Database.RELEASE(rs);
        }
%>
    </tbody>
</table>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>
<%
    }
    finally {
        Database.RELEASE(db);
    }
%>