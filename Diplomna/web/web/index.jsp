<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.water.core.Settings" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%    try{
    SmartMap get;
    get = new SmartMap(request);

    if (get.get("logout") != null) {
        User.logout(session);
    }

    User user = User.create(session);
    if (User.valid(user)) {
        response.sendRedirect(User.home(user));
        return;
    }

    if (get.getInt("capture") > 0) {
        user = User.login(session, get.getString("username"), get.getString("password"));
        if (User.valid(user)) {
            response.sendRedirect(User.home(user));
            return;
        }
    }

%>
<jsp:include page="<%= Settings.HEADER_FILE %>"/>
<form method="post" action="<%= request.getRequestURI()  %>">
    <%= Html.hidden("capture", 1) %>
    <fieldset>
        <legend>Вход в системата</legend>
        <label>Потребителско име:</label>
        <%= Html.inputText("username", get.getString("username"), 0, "short") %>
        <label>Парола:</label>
        <%= Html.inputPassword("password", "short") %>
    </fieldset>
    <div class="buttons">
        <%= Html.submit("RuchLogin", "Вход в системата", "login ui-corner-all") %>
    </div>
</form>
<%= JavaScript.focus("username") %>
<jsp:include page="<%= Settings.FOOTER_FILE %>"/>
<%
    }
    catch (Exception e)
    {
        e.printStackTrace();
    }
%>