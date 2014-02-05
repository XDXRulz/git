package bg.infologica.water.orm;

import bg.infologica.water.core.User;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by Nikola on 14-2-5.
 */
public class OrderOrm {
    private List<OrderItemsOrm> itemsList;
    private int statusCode;
    private int orderId;
    private String waitressName;
    private int waitressId;
    private String bartenderName;
    private int bartenderId;
    private Timestamp lastStatusUpdate;

    public int getWaitressId() {
        return waitressId;
    }

    public void setWaitressId(int waitressId) {
        this.waitressId = waitressId;
    }

    public int getBartenderId() {
        return bartenderId;
    }

    public void setBartenderId(int bartenderId) {
        this.bartenderId = bartenderId;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public String getWaitressName() {
        return waitressName;
    }

    public void setWaitressName(String waitressName) {
        this.waitressName = waitressName;
    }

    public String getBartenderName() {
        return bartenderName;
    }

    public void setBartenderName(String bartenderName) {
        this.bartenderName = bartenderName;
    }

    public List<OrderItemsOrm> getItemsList() {
        return itemsList;
    }

    public void setItemsList(List<OrderItemsOrm> itemsList) {
        this.itemsList = itemsList;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public Timestamp getLastStatusUpdate() {
        return lastStatusUpdate;
    }

    public void setLastStatusUpdate(Timestamp lastStatusUpdate) {
        this.lastStatusUpdate = lastStatusUpdate;
    }

    public OrderOrm(List<OrderItemsOrm> itemsList, int statusCode, int orderId, String waitressName, int waitressId, String bartenderName, int bartenderId, Timestamp lastStatusUpdate) {
        this.itemsList = itemsList;
        this.statusCode = statusCode;
        this.orderId = orderId;
        this.waitressName = waitressName;
        this.waitressId = waitressId;
        this.bartenderName = bartenderName;
        this.bartenderId = bartenderId;
        this.lastStatusUpdate = lastStatusUpdate;
    }

    public OrderOrm() {
    }


}
