<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.water.core.*" %>
<%@ page import="bg.infologica.water.dao.UsersDao" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    SmartMap get;
    get = new SmartMap(request);

    int id = get.getInt("id");

    // проверка правата за достъп на потребителя
    User user = User.create(session);
    boolean admin = User.valid(user) && user.hasRole(UserRole.ADMIN) ;
    if (user == null || (!(admin || user.getId() == id))) {
        out.println(JavaScript.documentReload());
        return;
    }

    if (get.getInt("capture") > 0) {
        String pass0 = get.getString("pass0");
        String pass1 = get.getString("pass1");
        String pass2 = get.getString("pass2");

        Database db = null;
        try {
            db = new Database();

            if (!admin) {
                // ако не е администратор потребители, проверява дали старата парола е въведена вярно
                if (!BarCommons.passwordEncode(pass0).equals(UsersDao.getPassword(db, id))) {
                    SessionMessages.error(session, "Старата парола не е въведена вярно.");
                }
            }
            if (Tools.emptyString(pass1)) {
                SessionMessages.error(session, "Задължително трябва да се въведе парола.");
            } else {
                if (!pass1.equals(pass2)) {
                    SessionMessages.error(session, "Новата парола не е повторена вярно.");
                } else {
                    int pass_min = 6;
                    if (pass_min > 0 && pass1.length() < pass_min)
                        SessionMessages.error(session, "Паролата е твърде къса - трябва да съдържа поне " + pass_min + " символа.");
                }
            }

            if (!SessionMessages.exists(session)) {
                if (UsersDao.setPassword(db, id, pass1, user.getId())) {
                    SessionMessages.success(session, "Паролата е сменена успешно.");
                } else {
                    SessionMessages.error(session, "Грешка при запис на новата парола.");
                }
                out.println(JavaScript.documentReload());
                return;
            }
        }
        finally {
            Database.RELEASE(db);
        }
    }
%>
<%= Popup.header(response, "Смяна на паролата") %>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("capture", 1) %>
    <%= Html.hidden("id", id) %>
    <fieldset>
        <%
            // ако потребителят не е администратор потребители се изисква въвеждане на старата парола
            if (!admin) {
        %>
        <label>Стара парола:</label>
        <%= Html.inputPassword("pass0", "short") %>
        <%
            }
        %>
        <label>Нова парола:</label>
        <%= Html.inputPassword("pass1", "short") %>
        <label>Потвърдете новата парола:</label>
        <%= Html.inputPassword("pass2", "short") %>
    </fieldset>
    <%= Popup.buttonsSaveAndCancel() %>
</form>
<%= JavaScript.timeout("focusElement('" + (admin ? "pass1" : "pass0") + "')") %>
<%= Popup.footer() %>
