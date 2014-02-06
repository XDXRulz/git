<%@ page import="bg.infologica.water.core.Settings" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    User user = User.create(session);
    if (!User.valid(user)) {
        response.sendRedirect(User.home(user));
        return;
    }
%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<img src="images/welcome-to-the-wine-bar.png" alt="WELCOME" style="margin: 0 auto; width: 100%; height: auto"/>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>
