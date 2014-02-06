<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.water.core.*" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="bg.infologica.water.core.SessionMessages" %>
<%@ page import="bg.infologica.water.core.User" %>
<%@ page import="bg.infologica.water.core.BarCommons" %>
<%@ page import="bg.infologica.water.core.UserRole" %>
<%@ page import="bg.infologica.water.dao.ItemTypeDao" %>
<%@ page import="bg.infologica.water.dao.ItemDao" %>
<%@ page import="bg.infologica.water.utils.StringUtils" %>
<%@ page import="bg.infologica.water.dao.OrderItemsDao" %>
<%@ page import="bg.infologica.water.dao.OrderDao" %>
<%@ page import="bg.infologica.water.orm.*" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    SmartMap get;
    get = new SmartMap(request);
    // проверка правата за достъп на потребителя
    User user = User.create(session);
    boolean admin = User.valid(user) && (user.hasRole(UserRole.ADMIN)||user.hasRole(UserRole.WAITRESS));
    if (!admin) {
        out.println(JavaScript.documentReload());
        return;
    }
    ResultSet categories = null;
    Database db = null;
    int orderId = get.getInt("order_id");
    String action = get.getString("action");
    int orderItemId = get.getInt("order_item_id");
    OrderItemsOrm item = null;
    try {
        db = new Database();
        categories = db.select(SQL.LOAD_CATEGORIES);
        if("delete".equals(action))
        {
            if(orderItemId >0)
                OrderItemsDao.Delete(orderItemId);
            out.println(JavaScript.documentReload());
            return;
        }
        if("save".equals(action))
        {
            if(orderId<=0)
            {
                List<OrderItemsOrm> items = new ArrayList<OrderItemsOrm>();
                items.add(new OrderItemsOrm(0,0,get.getFloat("quantity"),get.getString("remark"),null,new Item(get)));
                OrderOrm order = new OrderOrm(items,OrderStatuses.NEW,0,"",user.getId(),"",0,null);
                OrderDao.Save(order);
            }
            else if(orderItemId <=0)
            {
                item = new OrderItemsOrm(orderId,0,get.getFloat("quantity"),get.getString("remark"),null,new Item(get));
                OrderItemsDao.Save(item,orderId);
            }
            else
            {
                item = new OrderItemsOrm(orderId,orderItemId,get.getFloat("quantity"),get.getString("remark"),null,new Item(get));
                OrderItemsDao.Save(item,orderId);
            }
            out.println(JavaScript.documentReload());
            return;
        }
        else{
            if("edit".equals(action)){
                item = OrderItemsDao.Load(orderItemId);
                orderId = item.getOrderId();
           %>
<%= Popup.header(response, "Редакция на артикул към поръчка") %><%        }
else {%><%= Popup.header(response, "Добавяне на артикул към поръчка") %><%}%>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("action", "save") %>
    <%= Html.hidden("order_id", orderId) %>
    <%= Html.hidden("order_item_id", orderItemId) %>
    <fieldset>
        <label>Категория артикул:</label>
        <%= Html.select("category_id", (item!=null&&item.getItem()!=null&&item.getItem().getItemType()!=null&&item.getItem().getItemType().getCategory()!=null)?
                item.getItem().getItemType().getCategory().getCategoryId():0, categories) %>
        <label>Тип артикул:</label>
        <div id="types"><%= Html.select("type_id", "short") %></div>
        <label>Артикул:</label>
        <div id="items"><%= Html.select("type_id", "short") %></div>

        <label>Количество:</label>
        <%= Html.inputFloat("quantity", item!=null?item.getQuantity():0, 8, 2) %>
        <label>Забележка:</label>
        <%= Html.inputText("remark", item!=null?item.getRemark():"") %>
        <br/>
    </fieldset>
    <%= Popup.buttonsSaveAndCancel() %>
</form>
<script type="text/javascript">
    function generateTypes(category,type,item)
    {
        if(item == undefined) item = 0;
        console.log(category);
        var request = $.ajax({
            url: "../modules/itemTypes.jsp",
            type: "POST",
            data: { category_id : category,type_id:type },
            dataType: "html"
        });

        request.done(function( msg ) {
            console.log( msg );
            $( "#types" ).html( msg );
            var types = $("#type_id");
            types.bind('change',function(){
                console.log('changing');
                generateItems($("#type_id").val(),item)
            });
            types.trigger('change');
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
    }
    function generateItems(type,item_id)
    {
        console.log(type);
        var request = $.ajax({
            url: "../modules/items.jsp",
            type: "POST",
            data: { item_id : item_id,type_id:type },
            dataType: "html"
        });

        request.done(function( msg ) {
            console.log( msg );
            $( "#items" ).html( msg );

        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
    }
    function init()
    {
        console.log('init');
        var category = $("#category_id");

        category.bind('change',function(){
            console.log('changing');
            generateTypes($("#category_id").val(),0)
        });

        generateTypes(category.val(),<%=(item!=null&&item.getItem()!=null&&item.getItem().getItemType()!=null)?
                item.getItem().getItemType().getTypeId():0%>,<%=(item!=null&&item.getItem()!=null)?
                item.getItem().getItemId():0%>);

    }
    setTimeout(init,500);

</script>
<%= Popup.footer() %>
<%
    }
    }
    catch (Exception e){
        e.printStackTrace();
    }
    finally {
        Database.RELEASE(categories);
        Database.RELEASE(db);
    }
%>