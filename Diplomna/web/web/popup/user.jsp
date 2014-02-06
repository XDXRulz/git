<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.project.core.*" %>
<%@ page import="bg.infologica.project.orm.UserOrm" %>
<%@ page import="bg.infologica.project.dao.UsersDao" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!(User.valid(user) && user.hasRole(UserRole.ADMIN))) {
        out.println(JavaScript.documentReload());
        return;
    }

    SmartMap get;
    get = new SmartMap(request);

    UserOrm data;
    ResultSet roles = null;
    Database db = null;
    try {
        db = new Database();
        if (get.getInt("capture") > 0) {
            data = new UserOrm(get);
            if (data.valid(session, db)) {
                UsersDao.save(db, data, user.getId());
                out.println(JavaScript.documentReload());
                return;
            }
        } else {
            data = new UserOrm(db, get.getInt("id"));
        }

        roles = db.select(SQL.USER_ROLES);
%>
<%= Popup.header(response, "Данни на потребител") %>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("capture", 1) %>
    <%= Html.hidden("user_id", data.getUserId()) %>
    <fieldset>
        <label>Потребителско име:</label>
        <%= Html.inputText("login_name", data.getLoginName(), 32, "short") %>
        <%
            if (data.getUserId() <= 0) {
        %>
        <label>Парола:</label>
        <%= Html.inputPassword("pass1", "short") %>
        <label>Потвърдете паролата:</label>
        <%= Html.inputPassword("pass2", "short") %>
        <%
            }
        %>
        <label>Име, фамилия:</label>
        <%= Html.inputText("user_name", data.getUserName(), 64) %>
        <label>Роля:</label>
        <%= Html.select("role_id", data.getRoleId(), roles) %>
        <br/>
        <%= Html.checkbox("active", data.getActive(), "Потребителското име е активно") %>
    </fieldset>
    <%= Popup.buttonsSaveAndCancel() %>
</form>
<%= Popup.footer() %>
<%
    }
    finally {
        Database.RELEASE(roles);
        Database.RELEASE(db);
    }
%>