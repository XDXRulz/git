<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.water.core.Database" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page import="bg.infologica.water.dao.UsersDao" %>
<%@ page import="bg.infologica.water.core.UserRole" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (User.valid(user) && user.hasRole(UserRole.ADMIN)) {
        SmartMap get;
        get = new SmartMap(request);

        int user_id = get.getInt("id");

        if (user_id > 0 && user_id != user.getId()) {
            Database db = null;
            try {
                db = new Database();
                UsersDao.delete(db, user_id, user.getId());
            }
            finally {
                Database.RELEASE(db);
            }
        }
    }

%>
<%= JavaScript.documentReload() %>