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
    private String bartenderName;
    private Timestamp lastStatusUpdate;

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

    public OrderOrm(List<OrderItemsOrm> itemsList, int statusCode, int orderId, String waitressName, String bartenderName,
                    Timestamp lastStatusUpdate) {
        this.itemsList = itemsList;
        this.statusCode = statusCode;
        this.orderId = orderId;
        this.waitressName = waitressName;
        this.bartenderName = bartenderName;
        this.lastStatusUpdate = lastStatusUpdate;
    }

    public OrderOrm() {
    }


}
