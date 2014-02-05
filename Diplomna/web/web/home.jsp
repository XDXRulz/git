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

<jsp:include page="<%= Settings.FOOTER_FILE %>"/>
