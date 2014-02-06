package bg.infologica.project.core;

import bg.infologica.common.web.HtmlLink;
import bg.infologica.design.HeaderFiles;
import bg.infologica.design.HeaderTabs;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Клас за управление на главното меню на системата.
 *
 * @author Кальо Катеров
 * @version 2013-06-20 Първа версия.
 */
public final class Header {

    // константи, описващи индексите на отделните табулатори
    private static final int TAB_LOGIN = 0;
    private static final int TAB_HOME = 1;
    private static final int TAB_ADMIN = 2;
    private static final int TAB_BARTENDER = 3;
    private static final int TAB_WAITRESS = 4;

    private HeaderTabs tabs;
    private User user;

    private int selected_tab;
    private int selected_button;

    /**
     * Конструктор на класа. Създава се списък на файловете и списък на табулаторите на заглавната част.
     *
     * @param session Текущата сесия на потребителя.
     * @param request Заявката към Web сървъра.
     */
    public Header(HttpSession session, HttpServletRequest request) {
        user = User.create(session);

        tabs = new HeaderTabs();
        tabs.add("Вход в системата", "index.jsp");
        tabs.add("Начална страница", User.valid(user)?"home.jsp": "index.jsp");
        tabs.add("Администриране", User.valid(user) && user.hasRole(UserRole.ADMIN)?"users.jsp": "index.jsp");
        tabs.add("Бармани", User.valid(user) &&( user.hasRole(UserRole.ADMIN)||user.hasRole(UserRole.BARTENDER)) ? "orders_b.jsp" : "index.jsp");
        tabs.add("Сервитьорки", User.valid(user) && (user.hasRole(UserRole.ADMIN)||user.hasRole(UserRole.WAITRESS) )? "orders_all.jsp" : "index.jsp");

        // определяне на видимите табулатори
        tabs.setVisible(TAB_LOGIN, !User.valid(user));
        tabs.setVisible(TAB_HOME, User.valid(user));
        tabs.setVisible(TAB_ADMIN, User.valid(user) && user.hasRole(UserRole.ADMIN));
        tabs.setVisible(TAB_BARTENDER, User.valid(user)  && (user.hasRole(UserRole.ADMIN)||user.hasRole(UserRole.BARTENDER)));
        tabs.setVisible(TAB_WAITRESS, User.valid(user) && (user.hasRole(UserRole.ADMIN)||user.hasRole(UserRole.WAITRESS)));

        // списък на файловете
        HeaderFiles files = new HeaderFiles();

        files.add("home.jsp", TAB_HOME,1);
        files.add("index.jsp", TAB_LOGIN);

        files.add("users.jsp", TAB_ADMIN,1);
        files.add("items.jsp", TAB_ADMIN,2);
        files.add("item_types.jsp", TAB_ADMIN,3);
        files.add("categories.jsp", TAB_ADMIN,4);
        files.add("orders_all.jsp", TAB_WAITRESS,1);
        files.add("orders_b.jsp", TAB_BARTENDER,1);


        // определяне индексите на активния табулатор и активния бутон
        String[] dummy = request.getRequestURI().split("/");
        String filename = dummy != null && dummy.length > 0 ?
                dummy[dummy.length - 1].toLowerCase() : "index.jsp";
        if ("project".equals(filename)) {
            filename = "index.jsp";
        }
        selected_tab = files.getTabIndex(filename);
        selected_button = files.getButtonIndex(filename);
    }

    /**
     * Генерира HTML кода на табулаторите и бутоните от заглавната част на страницата.
     *
     * @return Генерираният HTML код.
     */
    public String get() {
        return getUserMenu() + getTabs() + getButtons();
    }

    /**
     * Създава HTML кода с менюто на потребителя, ако в системата има влязъл потребтел.
     *
     * @return Генерираният HTML код.
     */
    public String getUserMenu() {
        StringBuilder res = new StringBuilder();
        res.append("<div class='top'><div class='topl'><div class='topr'>");
        if (user != null) {
            res.append("<span class='rgh'>")
                    .append("<a href='#'>").append("Здравейте").append(" <b>").append(user.getName()).append("</b></a> | ")
                    .append(HtmlLink.getLinkPopup("popup/password.jsp?id=" + user.getId(), "Смяна на паролата")).append(" | ")
                    .append("<a href='index.jsp?logout=yes'>Изход</a>")
                    .append("</span>");
        }
        res.append("</div></div></div>\n");
        return res.toString();
    }

    /**
     * @return Кода за показване на табулаторите.
     */
    public String getTabs() {
        return tabs.toHTML(selected_tab);
    }

    /**
     * Генерира HTML кода за бутоните на активния табулатор.
     *
     * @return Генерираният HTML код.
     */
    private StringBuilder getButtons() {
        StringBuilder res = new StringBuilder();
        res.append("<div id='nav' class='tabs'><ul class='l1 nav'>");
        switch (selected_tab) {
            case TAB_HOME:
                res.append(makeButton("home.jsp", "Начало", selected_button == 1));
                break;
            case TAB_ADMIN:
                res.append(makeButton(UserRole.ADMIN, "users.jsp", "Потребители", selected_button == 1));
                res.append(makeButton(UserRole.ADMIN, "items.jsp", "Артиклули", selected_button == 2));
                res.append(makeButton(UserRole.ADMIN, "item_types.jsp", "Типове артикули", selected_button == 3));
                res.append(makeButton(UserRole.ADMIN, "categories.jsp", "Категории артикули", selected_button == 4));
                break;
            case TAB_WAITRESS:
                res.append(makeButton(UserRole.WAITRESS, "orders_all.jsp", "Поръчки", selected_button == 1));
                break;
            case TAB_BARTENDER:
                res.append(makeButton(UserRole.BARTENDER, "orders_b.jsp", "Поръчки", selected_button == 1));
                break;
        }
        res.append("</ul></div>");
        return res;
    }

    /**
     * Създава HTML кода за един бутон от менюто на активния табулатор.
     *
     * @param address  Адрес, които да се отвори при избиране на бутона.
     * @param caption  Заглавие на бутона.
     * @param selected Флаг, показващ дали елементът е избран (активен).
     * @return Генерираният HTML код.
     */
    private StringBuilder makeButton(String address, String caption, boolean selected) {
        return new StringBuilder("<li").append(selected ? " class='tabs-selected'" : "")
                .append("><a href='").append(address).append("'>").append(caption).append("</a></li>");
    }

    /**
     * Създава HTML кода за един бутон от менюто на активния табулатор.
     *
     * @param role Права за достъп, които трябва да има потребителя, за да се добави бутона.
     * @param address Адрес, които да се отвори при избиране на бутона.
     * @param caption Заглавие на бутона.
     * @param selected Флаг, показващ дали елементът е избран (активен).
     * @return Генерираният HTML код.
     */
    private String makeButton(int role, String address, String caption, boolean selected) {
        if (user != null && (user.hasRole(role)||user.hasRole(UserRole.ADMIN))) {
            return makeButton(address, caption, selected).toString();
        }
        return "";
    }
}
